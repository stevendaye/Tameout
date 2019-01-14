/* Setting our Socket.IO server to work side by side with Express */
import "dotenv/config";
let io = require("socket.io");
import cookie from "cookie";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
const ConnectRedis = require("connect-redis")(expressSession);
import redisAdapter from "socket.io-redis"; // a Redis Store to store Socket.IO data and for handling rooms and sharing states among rooms;
import redis from "redis";
import config from "../config";
const redisSession = new ConnectRedis({host: config.redisHost, port: config.redisPort}); // We create an object that connects to redis to store our session;
import * as redisChat from "../redis/chat";
import * as models from "../redis/models";
import * as log from "../middleware/log";

// We define an authorization function;
const socketAuth = (socket, next) => {
    const requestData = socket.request; // To establish connection between Socket.io and Express, we need a request data;
    const parsedCookie = cookie.parse(requestData.headers.cookie); // This is an array that has the "connect.sid" but unsigned. To sign we need a cookie-parser along with the same secret string:
    const sid = cookieParser.signedCookie(parsedCookie["connect.sid"], config.secret); // Gives a signed cookie thus a unique signed session ID;
    if (parsedCookie["connect.sid"] === sid) {
        return next(new Error("Unsigned Cookie! Not Authenticated"));
    }
    // Now we get the sessionID out of the Redis Store;
    redisSession.get(sid, (err, session) => {
        if (session.isAuthenticated) {
            socket.request.user = session.passport.user;
            socket.request.sid = sid;
            redisChat.addUser(session.passport.user.id, session.passport.user.displayName, session.passport.user.provider);
            return next();
        } else {
            return next(new Error("Not Authenticated"));
        }
    });
};

// Now we add two utilities to remove users from a room;
const removeFromRoom = (socket, room) => {
    socket.leave(room);  // first we remove the user from socket;
    redisChat.removeUserFromRoom(socket.request.user.id, room); // then from Redis;
    socket.broadcast.to(room).emit("removeUser", models.User(socket.request.user.id, socket.request.user.displayName, socket.request.user.provider)); // then a message is sent to all other sockets in this room to remove the user;
};
// Then we remove all other possible rooms the user might be in;
const removeAllRooms = (socket, cb) => {
    const current = socket.rooms; // this has all the rooms;
    const len = Object.keys(current).length; // No more the ES5 way: len = Object.keys(current).length;
    let i = 0;
    for (let r in current) {
        if ( current[r] !== socket.id) // skipping the connection from the current room the user is in;
            removeFromRoom(socket, current[r]);
        i += 1;
        if (i === len)
            cb(); // After it has looped through all the rooms, the callback function is called to continue the execution;
    }
};

// We define the socket connection;
const socketConnection = socket => {
    socket.on("GetMe", () => {
        socket.emit("GetMe", models.User(socket.request.user.id, socket.request.user.displayName, socket.request.user.provider));
    });
    socket.on('GetUser', function(room){
		var  usersP = redisChat.getUsersinRoom(room.room);
		usersP.done(function(users){
			socket.emit('GetUser', users);
		});
	});
    socket.on("AddChat", chat => {
        const newChat = models.Chat(chat.message, chat.room, models.User(
            socket.request.user.id, socket.request.user.displayName, socket.request.user.provider)
        );
        redisChat.addChat(newChat);
        socket.broadcast.to(chat.room).emit("AddChat", newChat);
        socket.emit("AddChat", newChat);
    });
    socket.on("GetChat", data => {
        redisChat.getChat(data.room, chats => {
            let retArray = [];
            let len = chats.length;
            chats.forEach(c => { // We loop over each chat message and push it to retArray as an object;
                try {
                    retArray.push(JSON.parse(c));
                } catch (e) {
                    log.error(e.message);
                }
                len -= 1;
                if (len === 0)
                    socket.emit("GetChat", retArray); // when the looping is over we emit the "GetChat" event to retrieve all chats:
            });
        });
    });
    socket.on("AddRoom", r => {
        const room = r.name;
        removeAllRooms(socket, () => { // removing all rooms so that the new room will be the only room the connection is in;
            if (room !== "") {
                socket.join(room); // joining the room being added after all other rooms have been removed;
                redisChat.addRoom(room); // This is a sorted set, so the timestamp set as a score will just be updated;
                socket.broadcast.emit("AddRoom", models.Room(room)); // this is to create new rooms and also when user join existing rooms;
                socket.broadcast.to(room).emit("AddRoom", models.User(
                    socket.request.user.id, socket.request.user.displayName, socket.request.user.provider)
                ); // this will be notifying to all users in the room that a user has joined;
                redisChat.addUserToRoom(socket.request.user.id, room); // Letting Redis know that the user is in the room;
            }
        });
    });
    socket.on('GetRoom', () => {
		redisChat.getRooms( rooms => {
			let retArray = [];
			let len = rooms.length;
			rooms.forEach( r => {
			    retArray.push(models.Room(r));
				len -= 1;
				(len === 0) && socket.emit('GetRoom', retArray);
			});
		});
	});
    socket.on("disconnect", () => {
        removeAllRooms(socket, () => {});
    });
};

const startSocket = server => {
    io = io.listen(server);
    io.adapter(redisAdapter({host: config.redisHost, port: config.redisPort})); // we create a redisStore and set all Redis attributes to a new Redis client connection. This is used to handle rooms so that states can be shared among Socket.IO rooms easily;
    const chatApp = io.of("/chatapp");
    chatApp.use(socketAuth); // Using the Socket.IO middleware to check whether the user is authenticated or not;
    chatApp.on("connection", (socketConnection));
    return io;
};

export { startSocket };

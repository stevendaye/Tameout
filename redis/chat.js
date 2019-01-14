/* Now we read an write the models to Redis */
import { client } from "./index";
import q from "q";
import * as models from "./models";
// We add a user to the sorted set "users" and a timestamp as a score;
const addUser = (user, name, type) => {
    client.multi()
        .hset("user:" + user, "name", name)
        .hset("user:" + user, "type", type)
        .zadd("users", Date.now(), user)
    .exec();
};
// Next we add a room to the sorted set "rooms" and  a timstmp as a score;
const addRoom = room => {
    if (room !== "")
        client.zadd("rooms", Date.now(), room);
};
// Now we get all the those who joined a room from the newest to the oldest;
const getRooms = cb => {
    client.zrevrangebyscore("rooms", "+inf", "-inf", (err, data) =>
        cb(data)
    );
};
// we add a chat to a room as well as the user and room to their respective sorted sets;
const addChat = chat => {
    client.multi()
    .zadd('rooms:' + chat.room + ':chats', Date.now(), JSON.stringify(chat))
    .zadd('users', (new Date).getTime(), chat.user.id)
    .zadd('rooms', (new Date).getTime(), chat.room)
    .exec();
};
// Next we get all the chat in a partucular room;
const getChat = (room, cb) => {
    client.zrange("rooms:" + room + ":chats", 0, -1, (err, chats) => {
        cb(chats);
    });
};
// Now, we add a the user to a room to know those who are in that room;
const addUserToRoom = (user, room) => {
    client.multi()
        .zadd("rooms:" + room, Date.now(), user)
        .zadd("users", Date.now(), user)
        .zadd("rooms", Date.now(), room)
        .set("user:" + user + "room", room)
    .exec();
};
// We can now remove the user from a room since we now know those in that room;
const removeUserFromRoom = (user, room) => {
    client.multi()
        .zrem("rooms:" + room, user)
        .del("user:" + user + ":room")
    .exec();
};
// Now we can get all the users in a room;
const getUsersinRoom = room =>
    q.Promise((resolve, reject, notify) => {
        client.zrange("rooms:" + room, 0, -1, (err, data) => {
            const users = [];
            let loopsleft = data.length;
            data.forEach( u => {
                client.hgetall("user:" + u, (err, userHash) => {
                    users.push(models.User(u, userHash.name, userHash.type));
                    loopsleft -= 1;
                    if (loopsleft === 0)
                        resolve(users);
                });
            });
        });
    });

export { addUser, addRoom, getRooms, addChat, getChat, addUserToRoom, removeUserFromRoom, getUsersinRoom };

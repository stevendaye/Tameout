/* Creating a chat worker to clean up Redis data every 24 hours to avoid the memory to run out */
import { client } from "../redis/index";
import { debug, error } from "../middleware/log";
import config from "../config";

// Cleaning up all rooms that have been inactive for 48 hours;
const RemoveRooms = () => {
    debug({message: "Removing Rooms", ts: Date.now()});
    client.zrangebyscore("rooms", "-inf", ((new Date).getTime() - config.RedisMemoryCleanUp.delta), (err, rooms) => {
        if (err !== null)
            error({message: "Error ocuured while Removing Rooms!", error: err, ts: Date.now()});
        else {
            rooms.forEach( room => {
                client.multi()
                    .zrem("rooms", room)
                    .del(`${"rooms:"}${room}${":chats"}`)
                .exec();
            });
        }
    });
};

// Next, cleaning up all chats from rooms that have been inactive for 48 hours;
const CleanUpChatsFromRooms = () => {
    debug({message: "Cleaning Up Chats from Rooms", ts: Date.now()});
    client.zrange("rooms", 0, -1, (err, rooms) => {
        rooms.forEach( room => {
            client.zremrangebyscore(`${"rooms:"}${room}${":chats"}`, "-inf", ((new Date).getTime() - config.RedisMemoryCleanUp.delta));
        });
    });
};

// Finallly, cleaning up all innactive users since 48 hours;
const CleanUpUsers = () => {
    debug({message: "Cleaning Up Inactive Users", ts: Date.now()});
    client.zrangebyscore("users", "inf", ((new Data).getTime() - config.RedisMemoryCleanUp.delta), (err, users) => {
        users.forEach( user => {
            client.multi()
                .zrem("users", user)
                .del(`${"user:"}${user}`)
                .del(`${"user:"}${user}${":room"}`)
            .exec();
        });
    });
};

// Starting the Cleaning up process;
const CleanUp = () => {
    RemoveRooms();
    CleanUpChatsFromRooms();
    CleanUpUsers();
};
CleanUp();

setInterval(CleanUp, config.RedisMemoryCleanUp.interval);

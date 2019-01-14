/* Creating a model for the types: users, rooms and chats */
"use strict";

const User = (id, name, type) => {
    if (arguments.length < 3)
        return new Error("Not Enough Arguments");
    return {
        id: id,
        user: name,
        type: type
    };
};
const Chat = (message, room, user) => {
    if (arguments.length < 3)
        return new Error("Not Enough Arguments");
    if (typeof user !== "object")
        return new Error("User must be an object!");
    return {
        id: user.id + (new Date).getTime().toString(),
        message: message,
        room: room,
        user: user,
        ts: (new Date).getTime()
    };
};
const Room = name => {
    if (arguments.length < 1)
        return new Error("Room needs a name");
    return {
        id: name,
        name: name
    };
};

export { User, Chat, Room };

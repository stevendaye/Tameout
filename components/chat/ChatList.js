/* Creating a Chat List */
import React from "react";
import ChatMessage from "./ChatMessage";

const ChatList = ({ me, chats }) => (
    <ul className = "list-unstyled">
        {chats.map( chat =>
            <ChatMessage
                chat = {chat}
                me = {me}
            />
        )}
    </ul>
); // The "chats" props is as well a backbone collection that holds all the chats;

export default ChatList;
/* Creating the Chat Message */
import React from "react";
import UserView from "../user/UserView";
import moment from "moment";

const ChatMessage = ({ me, chat }) => {
    let pull = me.id === chat.get("user").id ? "pull-right" : "pull-left";
    let timeSeen = moment(chat.get("ts")).fromNow();
    const addClass = "bg-primary chat-message";

    return (
        <li>
            <div className = {`${pull}${addClass}`}>
                {chat.get("message")}
            </div>
            <div className = "clearfix"></div>
            <div className = {pull}>
                <UserView
                    user = {chat.get("user")}
                    useName = {true}
                    size = {20}
                />
                <small>{timeSeen}</small>
            </div>
            <div className = "clearfix"></div>
        </li>
    );
}; // The "chat" props is a backbone object that has a message, timestamp and the user that created the message;

export default ChatMessage;

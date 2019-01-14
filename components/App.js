/* ####### Creating React's Component ####### */
import React, { Component } from "react";
import UserList from "./user/UserList";
import ChatList from "./chat/ChatList";
import ChatForm from "./chat/ChatForm";

class App extends Component {
    constructor (props) {
        super (props);

        this.forceUpdate = this.forceUpdate.bind(this);
        this.chatAdd = this.chatAdd.bind(this);
    }

    componentWillMount () {
        const { chats, users } = this.props;
        let channel = postal.channel();
        chats.on("add change remove", this.forceUpdate, this);
        users.on("add change remove", this.forceUpdate, this);
        this.chatSub = channel.subscribe("Chat.Add", this.chatAdd);
    }
    componentWillUnmount () {
        const { chats, users } = this.props;        
        chats.off("add change remove", this.forceUpdate, this);
        users.off("add change remove", this.forceUpdate, this);
        this.chatSub.unsubscribe();
    }
    componentDidUpdate () {
        const chatList = this.chatList;
        chatList.scrollTop = chatList.scrollHeight
    }

    chatAdd (data) {
        const { chats, room } = this.props;
        chats.sync("create", {message: data.message, room: room});
    }

    render () {
        const { chats, users, me } = this.props

        return (
            <div className = "row">
                <div className ="row">
                    <div className = "col-sm-2">
                        <UserList
                            collection = {users}
                            me = {me}
                        />
                    </div>
                    <div className = "col-sm-8 chat-list" ref = {el => this.chatList = el}>
                        <ChatList
                            chats = {chats}
                            me = {me}
                        />
                    </div>
                </div>
                <ChatForm
                    me = {me}
                />
            </div>
        );
    }
}

export default App;
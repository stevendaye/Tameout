/* Creating a Form for the Chat */
import React, { Component } from "react";
import UserView from "../user/UserView";

class ChatForm extends Component {
    constructor (props) {
        super(props);
        this.state = {
            value: ""
        }

        this.onChatSubmit = this.onChatSubmit.bind(this);
    }

    componentWillMount () {
        this.channel = postal.channel();
    }

    onChatSubmit (e) {
        let message = this.message.value;
        (message !== "") && this.channel.publish("Chat.Add", {message: message});
        this.setState({ value: "" });
        e.preventDefault();
    }

    render () {
        const { me } = this.props;
        const { value } = this.state;

        return (
            <div className = "row">
                <form onSubmit = {this.onChatSubmit}>
                    <div className = "col-sm-2">
                        <UserView
                            user = {me}
                            size = {50}
                            useName = {true}
                        />
                    </div>
                    <div className = "col-sm-8">
                        <imput
                            type = "text"
                            className = "form-control"
                            placeholder = "Type a message"
                            value = {value}
                            ref = {el => this.message = el}
                        />
                    </div>
                    <div className = "col-sm-2">
                        <button
                            className = "btn btn-primary"
                            type = "submit"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default ChatForm;

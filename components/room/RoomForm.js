/* Creating a form to join a room */
import React, { Component } from "react";

const ROOM_PATH = "#room/";
const PARAM_ROOM_NAME = room.get("name");

class RoomForm extends Component {
    constructor (props) {
        super(props);
        
        this.state = {
            value: ""
        };

        this.forceUpdate = this.forceUpdate.bind(this);
        this.joinRoomHandler = this.joinRoomHandler.bind(this);
    }

    componentWillMount () {
        this.channel = postal.channel(); // uisng poastal.js as a global bus to later add an event to it;
        this.props.rooms.on("add change remove", this.forceUpdate, this); // Adding events on the "rooms" backbone collections
    }
    componentWillUnmount () {
        this.props.rooms.off("add change remove", this.forceUpdate);
    }

    joinRoomHandler () {
        this.channel.publish("Room.Join", {roomName: this.roomName.value});
        this.setState({ value: this.roomName.value });
    }

    render() {
        const { rooms } = this.props;
        const { value } = this.state;

        return (
            <div className = "col-sm-8 col-sm-offset-2">
                <h2>Please Select a room</h2>
                <input
                    className = "form-control"
                    type = "text"
                    value = {value}
                    placeholder = "Enter a New Room Name"
                    ref = {el => this.roomName = el}
                />
                <button
                    className = "btn btn-primary btn-block top-margin "
                    type = "button"
                    onClick = {this.joinRoomHandler}
                >
                    Join Room
                </button>
                <ul>
                    {rooms.map( room =>
                        <li className = "list-unstyled">
                            <a href = {`${ROOM_PATH}${PARAM_ROOM_NAME}`}>
                                {PARAM_ROOM_NAME}
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

export default RoomForm;

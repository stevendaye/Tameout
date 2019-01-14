/* Creating  Users List */
import React from "react";
import UserView from "./UserView";

const UserList = ({ me, collection }) => (
    <ul className = "list-unstyled">
        {collection.map( user => {
            if (me.id !== user.get("id")) {
                return (
                    <UserView
                        user = {user}
                        size = {50}
                        useName = {true}
                    />
                );
            }
        })}
    </ul>
); // the "me" props is the currently logged in user model, and the "collection" props is a Backbone collection of user models;

export default UserList;

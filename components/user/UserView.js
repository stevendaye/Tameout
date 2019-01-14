/* Creating the User View */
import React from "react";

const UserView = ({ useName, user, size  }) => {
    let name = useName ? user.get("user") : null;

    return (
        <div>
            <img
                src = {user.image(size)}
                className = "image-circle"
                title = {user.get("user")}
            />
            name
        </div>
    );
}; // the "user" props will be coming from a Backbone Model;

export default UserView;

/* Creating Models and Collections in place of React's Local State to be used by its Components */
// First we create a socket listener adapter to mimic the CRUD operation between Backbone and Socket.IO;
// This socket listener listens for Socket.IO events;
const SocketListener = function SocketListener (syncNoun, collection, socket) {
    const addModels = models => {
        collection.add(collection.parse(models));
    };
    const removeModels = models => {
      collection.remove(collection.parse(models));
    };

    socket.on(`${"Add"}${syncNoun}`, addModels);
    socket.on(`${"Get"}${syncNoun}`, addModels);
    socket.on(`${"Remove"}${syncNoun}`, removeModels);

    const destroy = () => {
        socket.removeListener(`${"Add"}${syncNoun}`, addModels);
        socket.removeListener(`${"Get"}${syncNoun}`, addModels);
        socket.removeListener(`${"Remove"}${syncNoun}`, removeModels);
    };
    return {destroy: destroy};
}; // Once called, events on the collection will be emitted and our components will recieve the collections;

// We create a SocketSync in place of the default backbone's sync(Backbone.sync) to trigger the Socket.IO events;
// These events are listened by Sockect.IO to send a response back which is listened by SocketListener to add them to the collections;
const SocketSync = function SocketSync (method, model, options) {
    const socket = Backbone.socket;
    const create = (model, options, syncNoun) => {
        socket.emit(`${"Add"}${syncNoun}`, model);
    };
    const read =  (model, options, syncNoun) => {
        socket.emit(`${"Get"}${syncNoun}`, options);
    };

    switch (method) {
        case "create":
            create(model, options, this.syncNoun);
        break;
        case "read":
            read(model, options, this.syncNoun);
        break;
    }
};

// Creating the User Model;
const User = Backbone.Model.extend({
    image (size) {
        switch (this.get("type")) {
            case "local":
                return this.gravatar(size);
            break;
            case "google":
                return this.gravatar(size);
            break;
            case "facebook":
                return this.facebook(size);
            break;
        }
    },
    gravatar (size) {
        return `${"http://www.gravatar.com/avatar/"}${md5(this.get('id'))}?${"d=retro"}&${"s="}${size}`;
    },
    facebook (size) {
        return `${'http://graph.facebook.com/'}${this.get('id/')}${"picture/"}?${"height="}${size}`;
    }
});

// Creating Backbone collections to get our Backbone syncing and event triggering: User, Room and Chat;
const UserCollection = Backbone.Collection.extend({model: User});
const RoomsCollection = Backbone.Collection.extend();
const ChatCollection = Backbone.Collection.extend({
    parse (data) {
        if (Array.isArray(data)) {
            return _.map(data, d => {
                d.user = new User(d.user);
                return d;
            });
        } else {
            data.user = new User(data.user);
            return data;
        } // Adding an object to the collection to turn the User object into a Backbone model;
    }
});

// Creating a Backbone Router to listen to hash changes in the URL to trigger events;
const Router = Backbone.Router.extend({
    routes: {
        "": "RoomSelection",
        "room/:room": "JoinRoom",
        "*default": "Default"
    }
});

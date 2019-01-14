/* Setting the chat interface */
const BeginChatUI = () => {
    const ChatApp = window.ChatApp || {};
    ChatApp.Chat = function (el) {
        let $root = $(`${"#"}${el}`);
        const socket = io.connect("http://localhost:3000/chatapp");
        let me = null;
        let connected = false;
        let router, roomsCollection, userCollection, chatCollection;

        const GetMe = user => {
            me = new User(user); // Setting me to a user Model;
            Backbone.history.stop(); // Making sure a route isn't executed before any data is loaded;
            startChat(me);
            Backbone.history.start();
            connected = true;
        };
        socket.on("connect", () => {
            (!connected) && socket.emit("GetMe");
        });
        socket.on("GetMe", GetMe);

        // We create the function that initializes everything we need;
        const startChat = startThis = () => {
            router = new Router();
            Backbone.socket = socket;
            Backbone.sync = SocketSync;

            roomsCollection = new RoomsCollection();
            roomsCollection.syncNoun = "Room";
            userCollection = new UserCollection();
            userCollection.syncNoun = "User";
            chatCollection = new ChatCollection();
            chatCollection.syncNoun = "Chat";

            const roomsSync = new SocketListener("Room", roomsCollection, socket);
            const userSync = new SocketListener("User", userCollection, socket);
            const chatSync = new SocketListener("Chat", chatCollection, socket);

            roomsCollection.fetch(); // Here, fetch will use the sync function and our read method to emit "GetRoom"; 

            // The next functions will help us to get rooms, messages and render React's components;
            const roomFormEvent = message => {
                roomsCollection.add({name: message.roomName, id: message.roomName});
                router.navigate(`${"room/"}${message.roomName}`, {trigger : true});
            };

            const channel = postal.channel();
            const roomJoin = channel.subscribe("Room.Join", roomFormEvent);

            const RoomSelection = () => {
                roomsCollection.sync("create", {name: "Books", id: "Books"});
                React.unmountComponentAtNode($root[0]);
                React.renderComponent(RoomForm({rooms: roomsCollection}), $root[0]);
            };
            const JoinRoom = room => {
                userCollection.reset();
                chatCollection.reset();
                roomsCollection.sync("create", {name: room, id: room});
                userCollection.fetch({room: room});
                chatCollection.fetch({room: room});
                React.unmountComponentAtNode($root[0]);
                React.renderComponent(ChatView({users: userCollection, chats: chatCollection, room: room, me: me}), $root[0]);
            };
            const DefaultRoute = () => {
                router.navigate("", {trigger: true});
            };

            router.on('route:RoomSelection', RoomSelection);
            router.on('route:JoinRoom', JoinRoom);
            router.on('route:Default', DefaultRoute);
        };
    };
    const chatapp = new ChatApp.Chat('app');
};

BeginChatUI();

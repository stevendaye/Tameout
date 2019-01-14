/* Building a NodeChat App using Express */
/* Setting up our server */
import "dotenv/config";
import express from "express";
import partials from "express-partials";
const app = express();
import { index, login, logOut, signUp, signUpProcess, chat  } from "./routes";
import { error, notFound } from "./middleware/errorhandlers";
import { logger } from "./middleware/log";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import csrf from "csurf"; // loading "the Cross-Site Request Forgery" module to protect our forms against suspecious submissions;
import session from "express-session";
const RedisStore = require("connect-redis")(session); // We define a memory store to store sessions;
import * as util from "./middleware/utilities";
import flash from "connect-flash";
import * as io from "./socket.io";
import { passport, routes as passport_routes } from "./passport";
import { join } from "path";
import config from "./config";

// Configuring our app;
app.set("view engine", "ejs");
app.set("view options", {defaultLayout: "layout"}); // we add a view option for the default layout. This avoids us to have to add a layout to each view when rendrering;

app.use(partials()); // Adding partials as a middleware to serve the partial file called: layout(layout.ejs);
app.use(logger); // or "app.use(express.logger())". This is to be called before any other route;
app.set("views", join(__dirname, "views"));
app.use(express.static(__dirname + "/static")); // or app.use(express.static(path.join(__dirname, "/static")) to serve all static files like javascript, css and other type of files;
app.use(express.static(__dirname + "/bower_components"));
app.use(cookieParser(config.secret)); // uses the same secret as the session because the session creates the cookie and the cookieParser reads it out;
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
    store: new RedisStore({
        host: config.redisHost,
        port: config.redisPort
    }) // we define a store by creating a redis object to connect to redis that takes two option objects using the Redis host server and Redis server port. This URL can take a username, password and a port if they were not given by default;
}));
app.use(passport.initialize()); // Initializing passport before using it;
app.use(passport.session()); // Passport's session comes after Express' session, for it extends Express' session. Therefore, Express' session must exist first;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(csrf()); // Then we add a token to the session;
app.use(util.csrf); // This takes the token "req.csrfToken()" from the session and exposes it to all templates through "the res.locals.token" object;
app.use(util.authenticated);
app.use(flash());
app.use(util.templateRoutes); // Now our app has a config, and all templates can use the routes "/login" and "/logout";

// Setting up the different routes of our App;
app.get("/", index);
app.get(config.routes.login, login);
app.get(config.routes.logout, logOut);
app.get(config.routes.signUp, signUp);
app.post(config.routes.signUp, signUpProcess);
app.get(config.routes.chat, [util.requireAuthentication], chat);
passport_routes(app);

app.get("/error", (req, res, next) => { // Just for testing the error handler;
    next(new Error("505 Internal Error"));
});

app.use(error); // This will catch any error in our app;
app.use(notFound);

// We listen to our server;
const server = app.listen(config.port, () => {
    console.log(`${"Server running at "}${config.host}`);
});
io.startSocket(server);

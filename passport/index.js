/* Setting up a passport authentication */
import "dotenv/config";
import passport from "passport";
const facebook = require("passport-facebook").Strategy; // we load the facebook Strategy;
const google = require("passport-google-oauth").OAuth2Strategy; // we load the google Strategy. But here we are using the OAuth2 startegy;
const local = require("passport-local").Strategy; // loading the local strategy to authenticate users locally;
import { passwordCheck } from "./password";
import { findByUsername, updatePassword } from "./user";
import { debug } from "../middleware/log";
import config from "../config";

let routes;

// Configuring the facebook authentication strategy;
passport.use(new facebook({ // We tell passport here that we are using the facebook strategy;
    clientID: config.facebook.appID,
    clientSecret: config.facebook.appSecret,
    callbackURL: config.host + config.routes.facebookAuthCallback
}, (accessToken, refreshToken, profile, done) => { // Passport will run this, after the authentication request is successfull;
    done(null, profile); // next, this "done()" callback takes the user in and out of the session. Note that 'profile' is the facebook user profile that has a facebook ID;
}));

// Configuring the google authentication strategy;
passport.use(new google({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.host + config.routes.googleAuthCallback
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));

// Configuring the local authentication Strategy;
passport.use(new local((username, password, done) => {
    findByUsername(username, (err, profile) => { // On login, we first check if a username exists;
        if (profile) {
            passwordCheck(password, profile.password, profile.salt, profile.work, (err, isAuth) => { // If so, we check if the password matches. The 'isAuth' here is then a boolean value that confirms it returning true or false;
                if (isAuth) { // if true(if the password matches);
                    if (profile.work < config.crypto.workFactor) {
                        updatePassword(username, password, config.crypto.workFactor); // If yes, we update the salt, derived password and work factor;
                    } // This helps as the users authenticate to store their password more securely;
                    done(null, profile); // This gets the user into the session;
                } else {
                    debug({message: "Wrong Username or Password", username: username});
                    done(null, false, {message: "Wrong Username or Password!"});
                }
            });
        } else {
            debug({message: "Wrong Username or Password", username: username});
            done(null, false, {message: "Wrong Username or Password"});
        }
    });
})); // This way we securely authenticated and stored the user's password and this is well protected;

// Getting the user in and out of the session using the "serializeUser()" and "deserializeUser()" functions;
passport.serializeUser((user, done) => {
    done(null, user);// Here the "user" represents the whole user object. So we are storing the user object as a whole instead of the user ID only. This is especially convenient for a super fast backend like redis;
}); // here Passport serializes the user to know how to get it into the session;
passport.deserializeUser((user, done) => {
    done(null, user);
}); // here Passport deserializes the user to know how to get it out of the session;

// Next, set up build the routes for facebook, google and twitter to let express know about those routes;
routes = (app) => {
    app.get(config.routes.facebookAuth, passport.authenticate("facebook"));
    app.get(config.routes.facebookAuthCallback, passport.authenticate("facebook", {
        successRedirect: config.routes.chat,
        failureRedirect: config.routes.login,
        failureFlash: true
    }));

    app.get(config.routes.googleAuth, passport.authenticate("google", {
        scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"] // This scope is compulsory to tell google which of the user's info we need. We can set this scope in facebook as well, but if we don't, facebook uses the default scope;
    }));
    app.get(config.routes.googleAuthCallback, passport.authenticate("google", {
        successRedirect: config.routes.chat,
        failureRedirect: config.routes.login,
        failureFlash: true
    }));

    app.post(config.routes.login, passport.authenticate("local", {
        successRedirect: config.routes.chat,
        failureRedirect: config.routes.login,
        failureFlash: true
    })); // The login process is handled by passport;
};

export { passport, routes };

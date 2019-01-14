/* Setting up all of our App routes */
import config from "../config";
import * as util from "../middleware/utilities";
import { addUser, findByUsername } from "../passport/user";

const index = (req, res) => {
    res.cookie("IndexCookie", "This cookie was set from index"); // setting a cookie first so that it can be used by express session;
    res.render("index", {title: "ChatApp"});
};
const login = (req, res) => {
    res.render("login", {title: "Login Page", message: req.flash("error")});
};
const signUp = (req, res) => {
    res.render("sign-up", {title: "Sign Up", message: req.flash("error")});
};
const signUpProcess = (req, res) => {
    if (req.body.username && req.body.password && req.body.confirm_pass) {
        if (req.body.password === req.body.confirm_pass) {
            findByUsername(req.body.username, (err, profile) => {
                if (profile) {
                    req.flash("error", "Username already exists!");
                    res.redirect(config.routes.signUp);
                } else {
                    addUser(req.body.username, req.body.password, config.crypto.workFactor, (err, profile) => {
                        if (err) {
                            req.flash("error", err);
                            res.redirect(config.routes.signUp);
                        } else {
                            req.login(profile, err => {
                                res.redirect(config.routes.chat);
                            }); // "req.login()" is a Passport function that sets all the session variables for a logged in user; 
                        }
                    });
                }
            });
        } else {
            req.flash("error", "Please password must be the same!");
            res.redirect(config.routes.signUp);
        }
    } else {
        req.flash("error", "Please fill out all the fields!");
        res.redirect(config.routes.signUp);
    }
};
const logOut = (req, res) => {
    util.logOut(req);
    res.redirect("/");
};
const chat = (req, res) => {
    res.render("chat", {title: "Chat Page"});
};

export { index, login, logOut, chat, signUp, signUpProcess };

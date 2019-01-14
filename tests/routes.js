/* Setting up a test for all our routes */
import nodeunit from "nodeunit";
import config from "../config";
import * as routes from "../routes";
import Request from "./Request";
import Response from "./Response";

// Index Route;
const indexRouteTest = test => {
    const res = new Response();
    test.equal(res.view, undefined);
    routes.index({}, res);
    test.equal(res.view, "index");
    test.equal(res.viewData.title, "ChatApp");
    test.done();
};

// Login Route;
const loginRouteTest = test => {
    const res = new Response();
    test.equal(res.view, undefined);
    routes.login({}, res);
    test.equal(res.view, "login");
    test.equal(res.viewData, "login");
    test.done();
};

// SignUp Route;
const signUpRouteTest = test => {
    const res = new Response();
    test.equal(res.view, undefined);
    routes.login({}, res);
    test.equal(res.view, "signup");
    test.equal(res.viewData, "Sign Up");
    test.done();
};

// Chat Route;
const chatRouteTest = test => {
    const res = new Response();
    test.equal(res.view, undefined);
    routes.login({}, res);
    test.equal(res.view, "chat");
    test.equal(res.viewData, "Chat Page");
    test.done();
};

export { indexRouteTest, signUpRouteTest, loginRouteTest, chatRouteTest };

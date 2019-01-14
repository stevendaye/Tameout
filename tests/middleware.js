/* Setting our middleware test */
import nodeunit from "nodeunit";
import config from "../config";
import * as util from "../middleware/utilities";
import Request from "./request";
import Response from "./response";

const requireAuthTest = nodeunit.testCase({
    setUp (cb) {
        this.res = new Response();
        this.req = new Request();
        this.nextExecuted = false;
        this.next = function () {
            this.nextExecuted = true
        }.bind(this);
        cb();
    },
    "Not Authenticated" (test) {
        this.req.session.isAuthenticated = false;
        util.requireAuthentication(this.req, this.res, this.next);
        test.equal(this.res.url, config.routes.login);
        test.equal(this.nextExecuted, false);
        test.done();
    },
    "Authenticated" (test) {
        this.req.session.isAuthenticated = true;
        test.equal(this.nextExecuted, false);
        util.requireAuthentication(this.req, this.res, this.next);
        test.equal(this.res.url, "");
        test.equal(this.nextExecuted, true);
        test.done();
    }
}); // We use nodeunit.testCase() to build a group of test or test suit like we would React;

export { requireAuthTest };

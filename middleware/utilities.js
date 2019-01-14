/* Setting a utulity middleware that will be used by our app */
import config from "../config"; // mapping routes to be available for all templates;

const templateRoutes = (req, res, next) => {
    res.locals.routes = config.routes; // Now routes are now available for all templates;
    next();
};
// Setting a token to protect the form submission
const csrf = (req, res, next) => {
    res.locals.token = req.csrfToken();
    next();
};
// Next, here we are storing whether or not someone is authenticated in the session through the "req.session.isAuthenticated" object;
const authenticated = (req, res, next) => {
    req.session.isAuthenticated = req.session.passport.user !== undefined; // we check whether there is a passport user within the session;
    res.locals.isAuthenticated = req.session.isAuthenticated; // Making the "isAuthenticated" boolean available to all templates;
    req.session.isAuthenticated && (res.locals.user = req.session.passport.user);
    next();
};
// Now, We check if the user is successfully authenticated, if not he is redirected to the login page;
const requireAuthentication = (req, res, next) => {
    req.session.isAuthenticated
      ?  next()
      :  res.redirect(config.routes.login);
};
// Now, we set up a log out functionnality;
const logOut = req => {
    req.session.isAuthenticated = false;
    req.logout(); // no more 'delete session.user' for Passport comes with a "req.logout()" function that takes care of removing the user out of the session;
};

export { csrf, authenticated, requireAuthentication, logOut, templateRoutes };

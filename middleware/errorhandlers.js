/* Defining Middlewares for ChatApp to handle errors */
import log from "../middleware/log";

const notFound = (req, res, next) => {
    res.status(404).render("404", {title: "Wrong Turn!"});
};
const error = (err, req, res, next) => {
    log.error({error: err.message, ts: Date.now()});
    res.status(500).render("500", {title: "Something's Wrong!"});
};

export { notFound, error };
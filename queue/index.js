/* Setting up our queues and exchange */
import "dotenv/config";
import rabbitPromise from "./rabbit";
import q from "q";
import config from "../config";
// Our queues are broken into two: 'debug.log' and 'error.log';
const taskQueues = (rabbit) => {
    rabbit.queue("debug.log", {autoDelete: false}, (q) => {
        q.bind(config.RabbitMQ.exchange, "*.log");
        q.close();
    });
    rabbit.queue("error.log", {autoDelete: false}, (q) => {
        q.bind(config.RabbitMQ.exchange, "error.log");
        q.close();
    });
};
export default q.Promise((resolve, reject, notify) => {
    rabbitPromise.done((rabbit) => { // referencing the rabbit server once it is done connecting;
        rabbit.exchange(config.RabbitMQ.exchange, {type: "topic", autoDelete: false}, (ex) => {
            taskQueues(rabbit);
            resolve(ex);
        });
    });
});

/* Now we build our worker to work the created queues */
import "dotenv/config";
import q from "q";
import rabbitPromise from "../queue/rabbit";
import config from "../config";
// Creating a worker to work the queues during users requests and logging process;
rabbitPromise.done( rabbit => {
    rabbit.queue("debug.log", {autoDelete: false}, q => {
        q.bind(config.RabbitMQ.exchange, "*.log");
        q.subscribe({ack: true, prefetchCount: 1}, (message, headers, delivery, messageObject) => {
            console.log("Debug-Routing:" + delivery.routingKey + JSON.stringify(message));
            messageObject.acknowledge(); // To let RabbitMQ know that the message is successfully processed and that it can be deleted;
        });
    });
    rabbit.queue("error.log", {autoDelete: false}, q => {
        q.bind(config.RabbitMQ.exchange, "error.log");
        q.subscribe({ack: true, prefetchCount: 1}, (message, headers, delivery, messageObject) => {
            console.log("Error-Routing:" + delivery.routingKey + JSON.stringify(message));
            messageObject.acknowledge();
        }); // we must subscribe to the queue to get the message logged into it;
    });
});

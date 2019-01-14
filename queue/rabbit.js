/* Setting up a Message Broker: RabbitMQ to highly scale up ChatApp */
import "dotenv/config";
import amqp from "amqp";
import q from "q"; // For the use of assynchronous objects in a synchronouse manner;
import config from "../config";
// Setting up our RabbitMQ server and Promises;
export default q.Promise((resolve, reject, notify) => {
    const rabbit = amqp.createConnection(config.RabbitMQ.URL);
    rabbit.on("error", (err) => {
        console.log(err);
    });
    rabbit.on("ready", () => {
        resolve(rabbit);
    });
}); // we export the Promise object. So when the RabbitMQ server is connected, we resolve the promise so that the 'rabbit' object can be used syncronoulsy;
// NB: if we try to use the 'rabbit' object before the server is connected, errors will surely occur. That's why the Promise returned by "q" package to make things happen syncronously;

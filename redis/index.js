/* Setting up the redis server to persist data */
import "dotenv/config";
import redis from "redis";
import config from "../config";

export const client = redis.createClient(config.redisPort, config.redisHost);

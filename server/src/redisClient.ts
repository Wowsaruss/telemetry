import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;
const redisUsername = process.env.REDIS_USERNAME || 'default';
const redisPassword = process.env.REDIS_PASSWORD || '';

const redisClient = createClient({
    username: redisUsername,
    password: redisPassword,
    socket: {
        host: redisHost,
        port: redisPort,
    },
});

redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error);

export default redisClient; 
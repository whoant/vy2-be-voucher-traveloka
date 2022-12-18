const { REDIS_URI } = require('./index');
const redis = require('redis');

const clientRedis = redis.createClient({
    url: REDIS_URI
});

clientRedis.on('connect', () => {
    console.log('Redis server online.');
});

clientRedis.on('error', err => {
    console.error('Redis server is error');
    console.error(err);
});

clientRedis.connect();

module.exports = clientRedis;
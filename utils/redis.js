const redis = require('redis');
const { promisify } = require('util');

class RedisService {
  constructor() {
    this.connection = redis.createClient();
    this.fetchAsync = promisify(this.connection.get).bind(this.connection);
    this.connection.on('error', (err) => {
      console.log(`Error connecting to Redis server: ${err.message}`);
    });
  }

  isActive() {
    return this.connection.connected;
  }

  async retrieve(key) {
    return this.fetchAsync(key);
  }

  async store(key, value, ttl) {
    this.connection.setex(key, ttl, value);
  }

  async remove(key) {
    this.connection.del(key);
  }
}

const redisService = new RedisService();

module.exports = redisService;

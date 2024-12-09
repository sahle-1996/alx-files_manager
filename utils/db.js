import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * RedisHandler class for interacting with Redis.
 */
class RedisHandler {
  constructor() {
    this.redisClient = createClient();
    this.asyncGet = promisify(this.redisClient.get).bind(this.redisClient);

    this.redisClient.on('error', (err) => {
      console.error(`Failed to connect to Redis: ${err.message}`);
    });

    this.redisClient.on('ready', () => {
      // console.info('Redis connection established successfully');
    });
  }

  /**
   * Verifies if Redis connection is active.
   * @returns {boolean} Connection status.
   */
  isAlive() {
    return this.redisClient.connected;
  }

  /**
   * Fetches a value associated with a key.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<string>} The corresponding value.
   */
  async getValue(key) {
    return this.asyncGet(key);
  }

  /**
   * Stores a key-value pair with a time-to-live (TTL).
   * @param {string} key - Key to store.
   * @param {string} value - Value to associate with the key.
   * @param {number} ttl - Time-to-live in seconds.
   */
  async setValue(key, value, ttl) {
    this.redisClient.setex(key, ttl, value);
  }

  /**
   * Removes a key from Redis storage.
   * @param {string} key - The key to remove.
   */
  async removeKey(key) {
    this.redisClient.del(key);
  }
}

const redisHandler = new RedisHandler();

export default redisHandler;

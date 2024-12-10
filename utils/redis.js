import { createClient } from 'redis';

/**
 * Class to manage Redis client operations.
 */
class RedisHandler {
  /**
   * Initializes the RedisHandler instance.
   */
  constructor() {
    this.client = createClient();
    this.connectionStatus = false;
    this.client.on('error', (err) => {
      console.error('Redis connection error:', err.message || err);
    });
    this.client.on('connect', () => {
      this.connectionStatus = true;
    });
  }

  /**
   * Returns whether the Redis client is connected.
   * @returns {boolean}
   */
  isConnected() {
    return this.connectionStatus;
  }

  /**
   * Retrieves the value associated with a given key.
   * @param {String} key The key to fetch the value for.
   * @returns {Promise<String | Object>}
   */
  async fetch(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  /**
   * Sets a key-value pair in Redis with an expiration time.
   * @param {String} key The key to store.
   * @param {String | Number | Boolean} value The value to store.
   * @param {Number} ttl The time-to-live in seconds.
   * @returns {Promise<void>}
   */
  async store(key, value, ttl) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, ttl, value, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  /**
   * Deletes the value associated with a specific key.
   * @param {String} key The key to delete.
   * @returns {Promise<void>}
   */
  async remove(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}

export const redisHandler = new RedisHandler();
export default redisHandler;

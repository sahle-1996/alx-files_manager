import { createClient } from 'redis';

/**
 * Manages Redis connections and operations.
 */
class RedisManager {
  /**
   * Sets up the RedisManager with the Redis client.
   */
  constructor() {
    this.client = createClient();
    this.isConnected = false;

    // Event listener for connection errors
    this.client.on('error', (err) => {
      console.log(`Redis connection error: ${err.message}`);
    });

    // Event listener for successful connection
    this.client.on('connect', () => {
      this.isConnected = true;
    });
  }

  /**
   * Checks if the Redis client is connected.
   * @returns {boolean}
   */
  isConnectedToServer() {
    return this.isConnected;
  }

  /**
   * Fetches the value associated with a key from Redis.
   * @param {String} key The key to fetch.
   * @returns {Promise<String | null>}
   */
  async fetch(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) reject(err);
        resolve(value);
      });
    });
  }

  /**
   * Saves a key-value pair in Redis with an expiration time.
   * @param {String} key The key to store.
   * @param {String | Number | Boolean} value The value to store.
   * @param {Number} ttl Time to live in seconds.
   * @returns {Promise<void>}
   */
  async save(key, value, ttl) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, ttl, value, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  /**
   * Removes a key-value pair from Redis.
   * @param {String} key The key to remove.
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

export const redisManager = new RedisManager();
export default redisManager;

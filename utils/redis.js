import { createClient } from 'redis';

/**
 * RedisService handles interactions with a Redis client.
 */
class RedisService {
  /**
   * Initializes the RedisService instance.
   */
  constructor() {
    this.client = createClient();
    this.isConnected = false;
    this.client.on('error', (err) => {
      console.log(`Connection error: ${err.message}`);
    });
    this.client.on('connect', () => {
      this.isConnected = true;
    });
  }

  /**
   * Verifies if the Redis client is connected.
   * @returns {boolean}
   */
  isClientActive() {
    return this.isConnected;
  }

  /**
   * Retrieves the value of a specified key.
   * @param {String} key Key whose value is to be fetched.
   * @returns {Promise<String | Object>}
   */
  async retrieve(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) reject(err);
        resolve(value);
      });
    });
  }

  /**
   * Stores a value with a key in Redis with an expiry.
   * @param {String} key The key for the data.
   * @param {String | Number | Boolean} value The value to store.
   * @param {Number} ttl The time-to-live in seconds.
   * @returns {Promise<void>}
   */
  async storeData(key, value, ttl) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, ttl, value, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  /**
   * Deletes the key-value pair from Redis.
   * @param {String} key Key of the value to remove.
   * @returns {Promise<void>}
   */
  async deleteData(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}

export const redisService = new RedisService();
export default redisService;

import { createClient } from 'redis';

/**
 * Handles Redis operations and connection management.
 */
class RedisService {
  /**
   * Initializes a new Redis client and sets up event listeners.
   */
  constructor() {
    this.client = createClient();
    this.isConnected = false;

    this.client.on('error', (error) => {
      console.error(`Redis error: ${error.message || error.toString()}`);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      this.isConnected = true;
    });
  }

  /**
   * Verifies if the Redis client is successfully connected to the server.
   * @returns {boolean}
   */
  checkConnection() {
    return this.isConnected;
  }

  /**
   * Retrieves the value associated with a given key.
   * @param {String} key The key to retrieve the value for.
   * @returns {Promise<String | null>}
   */
  async fetchValue(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }

  /**
   * Saves a key-value pair in Redis with an expiration time.
   * @param {String} key The key to store.
   * @param {String | Number | Boolean} value The value to associate with the key.
   * @param {Number} ttl Time to live in seconds for the key.
   * @returns {Promise<void>}
   */
  async saveValue(key, value, ttl) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, ttl, value, (error) => {
        if (error) reject(error);
        resolve();
      });
    });
  }

  /**
   * Deletes a key-value pair from Redis.
   * @param {String} key The key to remove from Redis.
   * @returns {Promise<void>}
   */
  async removeKey(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error) => {
        if (error) reject(error);
        resolve();
      });
    });
  }
}

export const redisService = new RedisService();
export default redisService;

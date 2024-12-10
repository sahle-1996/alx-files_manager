import { createClient } from 'redis';

/**
 * Redis client manager class.
 */
class RedisClient {
  /**
   * Creates a new RedisClient instance.
   */
  constructor() {
    this.client = createClient();
    this.connected = false;

    this.client.on('error', (err) => {
      console.log(`Redis client not connected: ${err.message || err}`);
      this.connected = false;
    });

    this.client.on('connect', () => {
      this.connected = true;
    });
  }

  /**
   * Verifies if the client is connected to Redis.
   * @returns {boolean}
   */
  isAlive() {
    return this.connected;
  }

  /**
   * Retrieves a value for a given key.
   * @param {string} key The key to retrieve the value for.
   * @returns {Promise<string | null>}
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  /**
   * Sets a key-value pair with an expiration time.
   * @param {string} key The key to set.
   * @param {string | number | boolean} value The value to set.
   * @param {number} ttl The time-to-live in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, ttl) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, ttl, value, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  /**
   * Deletes a key.
   * @param {string} key The key to delete.
   * @returns {Promise<void>}
   */
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}

export const redisClient = new RedisClient();
export default redisClient;

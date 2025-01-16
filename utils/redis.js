import redis from 'redis';
import { promisify } from 'util';

/**
 * Class to manage Redis client operations
 */
class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.asyncGet = promisify(this.client.get).bind(this.client);

    this.client.on('error', (err) => {
      console.error(`Error connecting to Redis: ${err.message}`);
    });

    this.client.on('ready', () => {
      // Console log intentionally omitted to match spec
    });
  }

  /**
   * Check if Redis client is connected
   * @returns {boolean} Connection status
   */
  isAlive() {
    return this.client.ready;
  }

  /**
   * Retrieve a value by key from Redis
   * @param {string} key - The key to search for
   * @returns {Promise<string>} Value associated with the key
   */
  async get(key) {
    try {
      return await this.asyncGet(key);
    } catch (err) {
      console.error(`Failed to retrieve key ${key}: ${err.message}`);
      return null;
    }
  }

  /**
   * Store a key-value pair in Redis with a time-to-live (TTL)
   * @param {string} key - The key to store
   * @param {string} value - The value to store
   * @param {number} duration - Time-to-live in seconds
   */
  async set(key, value, duration) {
    try {
      this.client.setex(key, duration, value);
    } catch (err) {
      console.error(`Failed to set key ${key}: ${err.message}`);
    }
  }

  /**
   * Delete a key from Redis
   * @param {string} key - The key to delete
   */
  async del(key) {
    try {
      this.client.del(key);
    } catch (err) {
      console.error(`Failed to delete key ${key}: ${err.message}`);
    }
  }
}

const redisClient = new RedisClient();

export default redisClient;

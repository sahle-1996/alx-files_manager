import redis from 'redis';

class CacheService {
  constructor() {
    this.cache = redis.createClient();

    this.cache.on('error', (err) => {
      console.error(`Cache service error: ${err}`);
    });
  }

  isConnected() {
    return this.cache.connected;
  }

  async fetch(key) {
    return new Promise((resolve, reject) => {
      this.cache.get(key, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async store(key, value, ttlInSeconds) {
    return new Promise((resolve, reject) => {
      this.cache.setex(key, ttlInSeconds, value, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async remove(key) {
    return new Promise((resolve, reject) => {
      this.cache.del(key, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

const cacheService = new CacheService();

export default cacheService;

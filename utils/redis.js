import { createClient } from 'redis';
import { promisify } from 'util';

class RedisHandler {
  constructor() {
    this.redisConnection = createClient();
    this.redisConnection.on('error', (err) => console.error(err));
  }

  isConnectionActive() {
    return this.redisConnection.connected;
  }

  async fetch(key) {
    const asyncGet = promisify(this.redisConnection.GET).bind(this.redisConnection);
    return asyncGet(key);
  }

  async store(key, value, duration) {
    const asyncSet = promisify(this.redisConnection.SET).bind(this.redisConnection);
    return asyncSet(key, value, 'EX', duration);
  }

  async remove(key) {
    const asyncDel = promisify(this.redisConnection.DEL).bind(this.redisConnection);
    return asyncDel(key);
  }
}

const redisHandler = new RedisHandler();

export default redisHandler;

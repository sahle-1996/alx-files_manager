import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static async fetchStatus(req, res) {
    const isRedisConnected = redisClient.isAlive();
    const isDbConnected = dbClient.isAlive();
    res.set('Content-Type', 'application/json');
    res.status(200).json({ redis: isRedisConnected, db: isDbConnected }).end();
  }

  static async fetchStats(req, res) {
    const totalUsers = await dbClient.nbUsers();
    const totalFiles = await dbClient.nbFiles();
    res.set('Content-Type', 'application/json');
    res.status(200).json({ users: totalUsers, files: totalFiles }).end();
  }
}

export default AppController;

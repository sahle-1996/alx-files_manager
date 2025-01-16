import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  /**
   * Check the health of Redis and MongoDB connections.
   * @param {Object} request - The HTTP request object.
   * @param {Object} response - The HTTP response object.
   */
  static getStatus(request, response) {
    const redisStatus = redisClient.isAlive();
    const dbStatus = dbClient.isAlive();
    response.status(200).json({ redis: redisStatus, db: dbStatus });
  }

  /**
   * Retrieve statistics for users and files from the database.
   * @param {Object} request - The HTTP request object.
   * @param {Object} response - The HTTP response object.
   */
  static async getStats(request, response) {
    try {
      const userCount = await dbClient.nbUsers();
      const fileCount = await dbClient.nbFiles();
      response.status(200).json({ users: userCount, files: fileCount });
    } catch (error) {
      response.status(500).json({ error: 'Unable to retrieve statistics' });
    }
  }
}

export default AppController;

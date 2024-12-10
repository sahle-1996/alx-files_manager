import { MongoClient } from 'mongodb';
// eslint-disable-next-line no-unused-vars
import Collection from 'mongodb/lib/collection';
import config from './env_loader';

/**
 * MongoDB connection handler.
 */
class MongoDBClient {
  /**
   * Initializes a new MongoDBClient instance.
   */
  constructor() {
    config();
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'files_manager';
    const connectionUrl = `mongodb://${dbHost}:${dbPort}/${dbName}`;

    this.client = new MongoClient(connectionUrl, { useUnifiedTopology: true });
    this.client.connect();
  }

  /**
   * Verifies if the connection to MongoDB is active.
   * @returns {boolean}
   */
  isConnected() {
    return this.client.isConnected();
  }

  /**
   * Fetches the total count of users in the database.
   * @returns {Promise<number>}
   */
  async countUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * Fetches the total count of files in the database.
   * @returns {Promise<number>}
   */
  async countFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  /**
   * Retrieves a reference to the 'users' collection.
   * @returns {Promise<Collection>}
   */
  async getUsersCollection() {
    return this.client.db().collection('users');
  }

  /**
   * Retrieves a reference to the 'files' collection.
   * @returns {Promise<Collection>}
   */
  async getFilesCollection() {
    return this.client.db().collection('files');
  }
}

export const mongoDBClient = new MongoDBClient();
export default mongoDBClient;

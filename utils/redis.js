import { MongoClient } from 'mongodb';
// eslint-disable-next-line no-unused-vars
import Collection from 'mongodb/lib/collection';
import envLoader from './env_loader';

/**
 * MongoDB client handler.
 */
class DBClient {
  /**
   * Initializes a new DBClient instance.
   */
  constructor() {
    envLoader();
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'files_manager';
    const connectionString = `mongodb://${host}:${port}/${dbName}`;

    this.client = new MongoClient(connectionString, { useUnifiedTopology: true });
    this.client.connect();
  }

  /**
   * Checks if the client is connected to the MongoDB server.
   * @returns {boolean}
   */
  isAlive() {
    return this.client.isConnected();
  }

  /**
   * Retrieves the count of users in the database.
   * @returns {Promise<Number>}
   */
  async countUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * Retrieves the count of files in the database.
   * @returns {Promise<Number>}
   */
  async countFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  /**
   * Gets the 'users' collection reference.
   * @returns {Promise<Collection>}
   */
  async getUsersCollection() {
    return this.client.db().collection('users');
  }

  /**
   * Gets the 'files' collection reference.
   * @returns {Promise<Collection>}
   */
  async getFilesCollection() {
    return this.client.db().collection('files');
  }
}

export const dbClient = new DBClient();
export default dbClient;

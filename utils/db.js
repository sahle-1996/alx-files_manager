import { MongoClient } from 'mongodb';
import envLoader from './env_loader';

/**
 * MongoDB client manager class.
 */
class DBClient {
  /**
   * Creates a new DBClient instance.
   */
  constructor() {
    envLoader();
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'files_manager';
    const connectionString = `mongodb://${host}:${port}/${dbName}`;

    this.client = new MongoClient(connectionString, { useUnifiedTopology: true });
    this.connected = false;

    this.client.on('error', (err) => {
      console.log(`MongoDB client not connected: ${err.message || err}`);
      this.connected = false;
    });

    this.client.connect()
      .then(() => {
        this.connected = true;
      })
      .catch((err) => {
        console.log(`Error connecting to MongoDB: ${err.message || err}`);
      });
  }

  /**
   * Verifies if the client is connected to MongoDB.
   * @returns {boolean}
   */
  isAlive() {
    return this.connected;
  }

  /**
   * Retrieves the number of users in the database.
   * @returns {Promise<number>}
   */
  async countUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * Retrieves the number of files in the database.
   * @returns {Promise<number>}
   */
  async countFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  /**
   * Retrieves a reference to the `users` collection.
   * @returns {Promise<Collection>}
   */
  async getUsersCollection() {
    return this.client.db().collection('users');
  }

  /**
   * Retrieves a reference to the `files` collection.
   * @returns {Promise<Collection>}
   */
  async getFilesCollection() {
    return this.client.db().collection('files');
  }
}

export const dbClient = new DBClient();
export default dbClient;

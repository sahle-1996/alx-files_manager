import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const connectionUrl = `mongodb://${DB_HOST}:${DB_PORT}`;

/**
 * Class for managing MongoDB operations
 */
class DBClient {
  constructor() {
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true }, (error, client) => {
      if (error) {
        console.error(`Failed to connect to MongoDB: ${error.message}`);
        this.db = null;
      } else {
        this.db = client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      }
    });
  }

  /**
   * Verifies if the MongoDB connection is active
   * @returns {boolean} True if connection is alive, otherwise false
   */
  isAlive() {
    return this.db !== null;
  }

  /**
   * Gets the total number of documents in the "users" collection
   * @returns {Promise<number>} The number of users
   */
  async nbUsers() {
    try {
      return await this.usersCollection.countDocuments();
    } catch (error) {
      console.error(`Error counting users: ${error.message}`);
      return 0;
    }
  }

  /**
   * Gets the total number of documents in the "files" collection
   * @returns {Promise<number>} The number of files
   */
  async nbFiles() {
    try {
      return await this.filesCollection.countDocuments();
    } catch (error) {
      console.error(`Error counting files: ${error.message}`);
      return 0;
    }
  }
}

const dbClient = new DBClient();

export default dbClient;

import { env } from 'process';
import { MongoClient, ObjectId } from 'mongodb';

// eslint-disable-next-line import/prefer-default-export
export class DatabaseService {
  constructor() {
    const dbHost = env.DB_HOST || '127.0.0.1';
    const dbPort = env.DB_PORT || 27017;
    const dbName = env.DB_DATABASE || 'files_manager';
    this.mongoClient = new MongoClient(`mongodb://${dbHost}:${dbPort}/${dbName}`, { useUnifiedTopology: true });
    this.mongoClient.connect();
  }

  isAlive() {
    return this.mongoClient.isConnected();
  }

  async countUsers() {
    const database = this.mongoClient.db();
    const usersCollection = database.collection('users');
    return usersCollection.countDocuments();
  }

  async countFiles() {
    const database = this.mongoClient.db();
    const filesCollection = database.collection('files');
    return filesCollection.countDocuments();
  }

  async findUserByEmail(email) {
    const database = this.mongoClient.db();
    const usersCollection = database.collection('users');
    return usersCollection.findOne({ email });
  }

  async createUser(email, hashedPassword) {
    const database = this.mongoClient.db();
    const usersCollection = database.collection('users');
    return usersCollection.insertOne({ email, hashedPassword });
  }

  async findUser(filters) {
    const database = this.mongoClient.db();
    const usersCollection = database.collection('users');
    if (filters._id) {
      filters._id = ObjectId(filters._id);
    }
    return usersCollection.findOne(filters);
  }

  async findFile(filters) {
    const database = this.mongoClient.db();
    const filesCollection = database.collection('files');
    ['_id', 'userId', 'parentId'].forEach((field) => {
      if (filters[field] && filters[field] !== '0') {
        filters[field] = ObjectId(filters[field]);
      }
    });
    return filesCollection.findOne(filters);
  }
}

const databaseService = new DatabaseService();

export default databaseService;

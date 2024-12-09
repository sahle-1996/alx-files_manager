import { expect, use, should, request } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import database from '../utils/db';

use(chaiHttp);
should();

// Testing the Application Status Endpoints =========================

describe('Verifying App Status Endpoints', () => {
  describe('GET /status', () => {
    it('should return the connection status of Redis and MongoDB', async () => {
      const response = await request(app).get('/status').send();
      const body = JSON.parse(response.text);

      expect(body).to.eql({ redis: true, db: true });
      expect(response.statusCode).to.equal(200);
    });
  });

  describe('GET /stats', () => {
    before(async () => {
      await database.usersCollection.deleteMany({});
      await database.filesCollection.deleteMany({});
    });

    it('should return 0 users and files when the database is empty', async () => {
      const response = await request(app).get('/stats').send();
      const body = JSON.parse(response.text);

      expect(body).to.eql({ users: 0, files: 0 });
      expect(response.statusCode).to.equal(200);
    });

    it('should return 1 user and 2 files after inserting data', async () => {
      await database.usersCollection.insertOne({ name: 'Larry' });
      await database.filesCollection.insertOne({ name: 'image.png' });
      await database.filesCollection.insertOne({ name: 'file.txt' });

      const response = await request(app).get('/stats').send();
      const body = JSON.parse(response.text);

      expect(body).to.eql({ users: 1, files: 2 });
      expect(response.statusCode).to.equal(200);
    });
  });
});

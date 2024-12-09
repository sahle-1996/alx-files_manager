import { expect, use, should } from 'chai';
import chaiHttp from 'chai-http';
import { promisify } from 'util';
import database from '../utils/db';
import redis from '../utils/redis';

use(chaiHttp);
should();

describe('Testing MongoDB and Redis Clients', () => {
  describe('Testing Redis Client', () => {
    before(async () => {
      await redis.client.flushall('ASYNC');
    });

    after(async () => {
      await redis.client.flushall('ASYNC');
    });

    it('should confirm that Redis connection is active', async () => {
      expect(redis.isAlive()).to.equal(true);
    });

    it('should return null for a non-existing key', async () => {
      expect(await redis.get('nonExistentKey')).to.equal(null);
    });

    it('should allow setting a key without issues', async () => {
      expect(await redis.set('newKey', 25, 1)).to.equal(undefined);
    });

    it('should return null after key expiration', async () => {
      const sleep = promisify(setTimeout);
      await sleep(1100); // wait for key expiration
      expect(await redis.get('newKey')).to.equal(null);
    });
  });

  describe('Testing DB Client', () => {
    before(async () => {
      await database.usersCollection.deleteMany({});
      await database.filesCollection.deleteMany({});
    });

    after(async () => {
      await database.usersCollection.deleteMany({});
      await database.filesCollection.deleteMany({});
    });

    it('should confirm that DB connection is active', () => {
      expect(database.isAlive()).to.equal(true);
    });

    it('should correctly return user count', async () => {
      await database.usersCollection.deleteMany({});
      expect(await database.nbUsers()).to.equal(0);

      await database.usersCollection.insertOne({ name: 'Alice' });
      await database.usersCollection.insertOne({ name: 'Bob' });
      expect(await database.nbUsers()).to.equal(2);
    });

    it('should correctly return file count', async () => {
      await database.filesCollection.deleteMany({});
      expect(await database.nbFiles()).to.equal(0);

      await database.filesCollection.insertOne({ name: 'Document1' });
      await database.filesCollection.insertOne({ name: 'Document2' });
      expect(await database.nbFiles()).to.equal(2);
    });
  });
});

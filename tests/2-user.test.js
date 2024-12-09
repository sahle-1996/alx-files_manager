import { expect, use, should, request } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { ObjectId } from 'mongodb';
import app from '../server';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

use(chaiHttp);
should();

// User Routes Testing ==============================================

describe('Validating User Routes', () => {
  const basicAuth = 'Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=';
  let sessionToken = '';
  let userIdentifier = '';
  const testUser = {
    email: 'bob@dylan.com',
    password: 'toto1234!',
  };

  before(async () => {
    await redisClient.client.flushall('ASYNC');
    await dbClient.usersCollection.deleteMany({});
    await dbClient.filesCollection.deleteMany({});
  });

  after(async () => {
    await redisClient.client.flushall('ASYNC');
    await dbClient.usersCollection.deleteMany({});
    await dbClient.filesCollection.deleteMany({});
  });

  // User Creation Tests
  describe('POST /users', () => {
    it('should return the ID and email of the created user', async () => {
      const response = await request(app).post('/users').send(testUser);
      const body = JSON.parse(response.text);
      expect(body.email).to.equal(testUser.email);
      expect(body).to.have.property('id');
      expect(response.statusCode).to.equal(201);

      userIdentifier = body.id;
      const createdUser = await dbClient.usersCollection.findOne({
        _id: ObjectId(body.id),
      });
      expect(createdUser).to.exist;
    });

    it('should return an error when password is missing', async () => {
      const incompleteUser = {
        email: 'bob@dylan.com',
      };
      const response = await request(app).post('/users').send(incompleteUser);
      const body = JSON.parse(response.text);
      expect(body).to.eql({ error: 'Missing password' });
      expect(response.statusCode).to.equal(400);
    });

    it('should return an error when email is missing', async () => {
      const incompleteUser = {
        password: 'toto1234!',
      };
      const response = await request(app).post('/users').send(incompleteUser);
      const body = JSON.parse(response.text);
      expect(body).to.eql({ error: 'Missing email' });
      expect(response.statusCode).to.equal(400);
    });

    it('should return an error if the user already exists', async () => {
      const existingUser = {
        email: 'bob@dylan.com',
        password: 'toto1234!',
      };
      const response = await request(app).post('/users').send(existingUser);
      const body = JSON.parse(response.text);
      expect(body).to.eql({ error: 'Already exist' });
      expect(response.statusCode).to.equal(400);
    });
  });

  // Login Tests
  describe('GET /connect', () => {
    it('should return an error if no user matches the credentials', async () => {
      const response = await request(app).get('/connect').send();
      const body = JSON.parse(response.text);
      expect(body).to.eql({ error: 'Unauthorized' });
      expect(response.statusCode).to.equal(401);
    });

    it('should return a token when credentials are correct', async () => {
      const redisSpy = sinon.spy(redisClient, 'set');

      const response = await request(app)
        .get('/connect')
        .set('Authorization', basicAuth)
        .send();
      const body = JSON.parse(response.text);
      sessionToken = body.token;
      expect(body).to.have.property('token');
      expect(response.statusCode).to.equal(200);
      expect(
        redisSpy.calledOnceWithExactly(`auth_${sessionToken}`, userIdentifier, 24 * 3600)
      ).to.be.true;

      redisSpy.restore();
    });

    it('should confirm the token exists in Redis', async () => {
      const redisToken = await redisClient.get(`auth_${sessionToken}`);
      expect(redisToken).to.exist;
    });
  });

  // Logout Tests
  describe('GET /disconnect', () => {
    after(async () => {
      await redisClient.client.flushall('ASYNC');
    });

    it('should return unauthorized when no token is provided', async () => {
      const response = await request(app).get('/disconnect').send();
      const body = JSON.parse(response.text);
      expect(body).to.eql({ error: 'Unauthorized' });
      expect(response.statusCode).to.equal(401);
    });

    it('should successfully log out the user using the token', async () => {
      const response = await request(app)
        .get('/disconnect')
        .set('X-Token', sessionToken)
        .send();
      expect(response.text).to.be.equal('');
      expect(response.statusCode).to.equal(204);
    });

    it('should confirm the token no longer exists in Redis', async () => {
      const redisToken = await redisClient.get(`auth_${sessionToken}`);
      expect(redisToken).to.not.exist;
    });
  });

  // User Details Tests
  describe('GET /users/me', () => {
    before(async () => {
      const response = await request(app)
        .get('/connect')
        .set('Authorization', basicAuth)
        .send();
      const body = JSON.parse(response.text);
      sessionToken = body.token;
    });

    it('should return unauthorized if no token is passed', async () => {
      const response = await request(app).get('/users/me').send();
      const body = JSON.parse(response.text);

      expect(body).to.eql({ error: 'Unauthorized' });
      expect(response.statusCode).to.equal(401);
    });

    it('should return user details based on the token', async () => {
      const response = await request(app)
        .get('/users/me')
        .set('X-Token', sessionToken)
        .send();
      const body = JSON.parse(response.text);

      expect(body).to.eql({ id: userIdentifier, email: testUser.email });
      expect(response.statusCode).to.equal(200);
    });
  });
});

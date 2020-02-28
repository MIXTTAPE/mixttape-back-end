require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  // beforeEach(() => {
  //   User.create({ username: 'treemo2', password: '1234' });
  // });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('should be able to sign up a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'treemo', password: '123456789' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'treemo',
          __v: 0
        });
      });
  });

  it('can login a user with username and password', async() => {
    const user = await User.create({
      username: 'treemo',
      password: 'password'
    });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'treemo', password: 'password' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: user.id,
          username: 'treemo',
          mixtapes:[],
          __v: 0
        });
      });
  });

  it('fails to login a user with a bad username', async() => {
    await User.create({
      username: 'treemoney',
      password: 'password'
    });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'tresus', password: 'password' })
      .then(res => {
        expect(res.status).toEqual(401);
        expect(res.body).toEqual({
          status: 401,
          message: 'Invalid Username/Password'
        });
      });
  });

  it('fails to login a user with a bad password', async() => {
    await User.create({
      username: 'treemoney',
      password: 'password'
    });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'treemoney', password: '1234' })
      .then(res => {
        expect(res.status).toEqual(401);
        expect(res.body).toEqual({
          status: 401,
          message: 'Invalid Username/Password'
        });
      });
  });

  it('can verify if a user is logged in', async() => {
    const user = await User.create({
      username: 'treemo',
      password: 'password'
    });
    
    const agent = request.agent(app);
    await agent
      .post('/api/v1/auth/login')
      .send({ username: 'treemo', password: 'password' });

    return agent
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          mixtapes: [],
          username: 'treemo',
          __v: 0
        });
      });
  });

  it('can logout a user', async() => {
    await User.create({
      username: 'treemo',
      password: 'password'
    });

    const agent = request.agent(app);
    await agent
      .post('/api/v1/auth/login')
      .send({ username: 'treemo', password: 'password' });
    // .then(res => console.log(res.headers['set-cookie'][0]));
  
    return agent
      .post('/api/v1/auth/logout')
      .then(res => {
        expect(res.headers['set-cookie'][0]).toEqual(expect.stringContaining('session=;'));
      });
  });
});

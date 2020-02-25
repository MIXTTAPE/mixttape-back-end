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

  
});

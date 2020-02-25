require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const Mixtape = require('../lib/models/Mixtape');

describe('user routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;
  beforeEach(async() => {
    user = await User.create({ username: 'treesus', password: '1234' });
    await Mixtape.create({
      userId: user._id,
      songs: [
        {
          nativeId: '345',
          nativeSource: 'soundcloud',
          title: 'Big Poppa',
          thumbnailUrl: 'mypic.com',
          buyLink: 'buythis.com',
          isMemo: false,
          tags: ['rap']
        }    
      ],
      rating: 1
    });
    await Mixtape.create({
      userId: user._id,
      songs: [
        {
          nativeId: '567',
          nativeSource: 'youtube',
          title: 'Lady Gaga',
          thumbnailUrl: 'mycoolpic.com',
          buyLink: 'buythissicktrack.com',
          isMemo: false,
          tags: ['pop']
        }    
      ],
      rating: 3
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can get a users mixtapes', () => {
    return request(app)
      .get(`/api/v1/users/${user._id}`)
      .then((res) => {
        expect(res.body).toEqual({ _id: expect.any(String),
          mixtapes: [{
            __v: 0,
            _id: expect.any(String),
            rating: 1,
            songs: [{
              _id: expect.any(String),
              buyLink: 'buythis.com',
              isMemo: false,
              nativeId: '345',
              nativeSource: 'soundcloud',
              tags: ['rap'],
              thumbnailUrl: 'mypic.com',
              title: 'Big Poppa' 
            }],
            userId: expect.any(String)
          },
          { __v: 0,
            _id: expect.any(String),
            rating: 3,
            songs: [{
              _id: expect.any(String),
              buyLink: 'buythissicktrack.com', 
              isMemo: false, 
              nativeId: '567',
              nativeSource: 'youtube',
              tags: ['pop'],
              thumbnailUrl: 'mycoolpic.com', 
              title: 'Lady Gaga' }],
            userId: expect.any(String) }], 
          username: 'treesus' });
      });
      
  });
});

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
        expect(res.body).toEqual({
          _id: expect.any(String),
          mixtapes: [{
            _id: expect.any(String),
            userId: user._id,
            songs: [
              {
                _id: expect.any(String),
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
          },
          {
            _id: expect.any(String),
            userId: user._id,
            songs: [
              {
                _id: expect.any(String),
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
          }],
          username: 'treesus',
          __v: 0
        });
      });
      
  });
});

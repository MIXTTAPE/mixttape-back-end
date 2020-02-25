require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Mixtape = require('../lib/models/Mixtape');
const User = require('../lib/models/User');

describe('mixtape routes', () => {
  beforeAll(async() => {
    connect();
  });
  
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let travis;
  let user;
  beforeEach(async() => {
    user = await User
      .create({
        username: 'treemoney',
        password: '1234'
      });
    travis = request.agent(app);
    return travis
      .post('/api/v1/auth/login')
      .send({
        username: 'treemoney',
        password: '1234'
      })
      .then(() => {
        return travis.get('/api/v1/auth/verify');
      });
  });
  let mixtape;
  beforeEach(async() => {
    mixtape = await Mixtape.create({
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

  it('requires authorization to post', async() => {
    return request(app)
      .post('/api/v1/mixtapes')
      .send({
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
        ]
      })
      .then(res => {
        expect(res.statusCode).toEqual(500);
      });
  });

  it('should be able to post a mixtape', async() => {
    await User
      .create({
        username: 'treemo',
        password: '1234'
      });
    const travis = request.agent(app);
    return travis
      .post('/api/v1/auth/login')
      .send({
        username: 'treemo',
        password: '1234'
      })
      .then(() => {
        return travis.get('/api/v1/auth/verify');
      })
      .then(() => {
        return travis
          .post('/api/v1/mixtapes')
          .send({
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
            ]
          })
          .then(res => {
            expect(res.body).toEqual({
              _id: expect.any(String),
              userId: expect.any(String),
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
              __v: 0
            });
          });
          
      });   
  });

  it('can get a mixtape by id', async() => {
    await User
      .create({
        username: 'treemo',
        password: '1234'
      });
    const travis = request.agent(app);
    return travis
      .post('/api/v1/auth/login')
      .send({
        username: 'treemo',
        password: '1234'
      })
      .then(() => {
        return travis.get('/api/v1/auth/verify');
      })
      .then(() => {
        return travis
          .get(`/api/v1/mixtapes/${mixtape.id}`)
          .then(res => {
            expect(res.body).toEqual({
              _id: expect.any(String),
              userId: expect.any(String),
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
              rating: 1,
              __v: 0   
            });
          });
      });
  });

  it('can update a mixtape by id', async() => {
    await User
      .create({
        username: 'treemo',
        password: '1234'
      });
    const travis = request.agent(app);
    return travis
      .post('/api/v1/auth/login')
      .send({
        username: 'treemo',
        password: '1234'
      })
      .then(() => {
        return travis.get('/api/v1/auth/verify');
      })
      .then(() => {
        return travis
          .get(`/api/v1/mixtapes/${mixtape.id}`)
          .then(() => {
            return travis
              .patch(`/api/v1/mixtapes/${mixtape.id}`)
              .send({ rating: 2 })
              .then(res => {
                expect(res.body).toEqual({
                  _id: expect.any(String),
                  userId: expect.any(String),
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
                  rating: 2,
                  __v: 0   
                });
              });
          });
      });
  });

  it('can delete a mixtape by id', async() => {
    await User
      .create({
        username: 'treemo',
        password: '1234'
      });
    const travis = request.agent(app);
    return travis
      .post('/api/v1/auth/login')
      .send({
        username: 'treemo',
        password: '1234'
      })
      .then(() => {
        return travis.get('/api/v1/auth/verify');
      })
      .then(() => {
        return travis
          .get(`/api/v1/mixtapes/${mixtape.id}`)
          .then(() => {
            return travis
              .delete(`/api/v1/mixtapes/${mixtape.id}`)
              .then(res => {
                expect(res.body).toEqual({
                  _id: expect.any(String),
                  userId: expect.any(String),
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
                  rating: 1,
                  __v: 0   
                });
              });
          });
      });
  });

  //   it.only('can find all mixtapes by user', () => {
 
//     return request(app)
//       .get(`/api/v1/mixtapes/byuser/${user._id}`)
//       .then((res) => {
//         expect(res.body).toEqual('');
//       });
//   });
});



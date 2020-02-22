const Mixtape = require('./Mixtape');

describe('Mixtape model', () => {
  it('has a userId', () => {
    const mixtape = new Mixtape();
    const { errors } = mixtape.validateSync();

    expect(errors.userId.message).toEqual('Path `userId` is required.');
  });

  it('has a required username from User', () => {
    const mixtape = new Mixtape();
    const { errors } = mixtape.validateSync();

    expect(errors.username.message).toEqual('Path `username` is required.');
  });

  it('cannot have a rating over 5', () => {});
  const mixtape = new Mixtape({ 
    userId: 'awdefrgtdhg',
    username: 'treemo',
    songs: [],
    rating: 6
  });
  const { errors } = mixtape.validateSync();

  expect(errors.rating.message).toEqual('Path `rating` (6) is more than maximum allowed value (5).');

  it('cannot have a rating below 0', () => {
    const mixtape = new Mixtape({ 
      userId: 'awdefrgtdhg',
      username: 'treemo',
      songs: [],
      rating: 0
    });
    const { errors } = mixtape.validateSync();
    
    expect(errors.rating.message).toEqual('Path `rating` (0) is less than minimum allowed value (1).');
  });

});

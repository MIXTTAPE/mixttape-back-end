const User = require('./User');

describe('User model', () => {
  it('has a required username', () => {
    const user = new User();
    const { errors } = user.validateSync();
    expect(errors.username.message).toEqual('Path `username` is required.');
  });

  it('has a required passwordHash', () => {
    const user = new User({ username: 'tree' });
    const { errors } = user.validateSync();
    expect(errors.passwordHash.message).toEqual('Path `passwordHash` is required.');
  });

  it('should be able to hash a password', () => {
    const user = new User({ username: 'tree', passwordHash: '1234' });
    expect(user.passwordHash).toEqual(expect.any(String));
  });
});

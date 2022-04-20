const User = require('../models/user');

const getUsersFromDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

module.exports = {
  getUsersFromDb,
};

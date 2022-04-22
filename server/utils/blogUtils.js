const getTokenFrom = req => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    // auth string looks like 'bearer <token>'
    return auth.substring(7); // return just the token
  }
};

module.exports = {
  getTokenFrom
};

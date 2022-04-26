import axios from 'axios';

const login = async (username, password) => {
  console.log('logging in...');
  const res = await axios.post('/api/login', { username, password });
  return res.data;
};

export {
  login
};

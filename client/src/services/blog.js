import axios from 'axios';

const getAll = async () => {
  const res = await axios.get('/api/blogs');
  return res.data;
};

export {
  getAll
};

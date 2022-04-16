const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { initialBlogs, resetTestDb } = require('./api.test.utils');

beforeEach(resetTestDb);

test('blogs are returned as json', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('bloglist has length 6', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(initialBlogs.length);
});

test('valid blog entry can be added', async () => {
  const response = await api.post('/api/blogs')
    .send({
      title: 'new blog title',
      author: 'matt muroya',
      url: 'http://mattmuroya.com',
      likes: 100
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);
  
  expect(response.body.title).toBe('new blog title');

  const blogs = await api.get('/api/blogs');
  expect(blogs.body).toHaveLength(initialBlogs.length + 1);
});

test('invalid blog entry is rejected', async () => {
  await api.post('/api/blogs')
    .send({
      author: 'matt muroya',
      url: 'http://mattmuroya.com',
      likes: 100
    })
    .expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});

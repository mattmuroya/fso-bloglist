const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { initialBlogs, resetTestDb } = require('./api.test.utils');

beforeEach(resetTestDb);

describe('fetching json data', () => {
  test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  
  test('bloglist has length 6', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('added blogs have an id assigned', async () => {
    const response = await api.get('/api/blogs');
    for (let blog of response.body) {
      expect (blog.id).toBeDefined();
    }
  });
});

describe('adding blog entries', () => {
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
  
  test('blog entry with no title is rejected', async () => {
    await api.post('/api/blogs')
      .send({
        author: 'matt muroya',
        url: 'http://mattmuroya.com',
        likes: 100
      })
      .expect(400);
  });

  test('blog entry with no url is rejected', async () => {
    await api.post('/api/blogs')
      .send({
        title: 'test blog with no url',
        author: 'matt muroya',
        likes: 100
      })
      .expect(400);
  });

  test('"likes" defaults to 0 when no number provided', async () => {
    const response = await api.post('/api/blogs')
      .send({
        title: 'blog without likes',
        author: 'matt muroya',
        url: 'http://mattmuroya.com'
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.likes).toBe(0);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

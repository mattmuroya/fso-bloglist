const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { initialBlogs, resetTestDb } = require('./blog.api.test.utils');

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

describe('deleting blog entries', () => {
  test('blog post with valid id can be deleted', async () => {
    const response = await api.get('/api/blogs');
    const id = response.body[0].id;
    await api.delete(`/api/blogs/${id}`)
      .expect(204);
    
    const blogs = await api.get('/api/blogs');
    expect(blogs.body).toHaveLength(initialBlogs.length - 1);
  });

  test('delete by id responds with 400 for bad id', async () => {
    const response = await api.delete('/api/blogs/malformedId')
      .expect(400);
    
    expect(response.error.text).toBe('{"error":"malformatted id"}');
  });
});

describe('updating blog entries', () => {
  test('can update likes for existing blogs', async () => {
    const response = await api.get('/api/blogs');
    const noteToUpdate = response.body[0];
    const updatedDetails = {
      title: noteToUpdate.title,
      author: noteToUpdate.author,
      url: noteToUpdate.url,
      likes: noteToUpdate.likes + 1
    };
    const id = noteToUpdate.id;
    const updatedNote = await api.put(`/api/blogs/${id}`)
      .send(updatedDetails)
      .expect(200);

    expect(updatedNote.body.likes).toBe(initialBlogs[0].likes + 1);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

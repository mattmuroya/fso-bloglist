const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { initialBlogs, resetTestDb } = require('./blog.api.test.utils');
const User = require('../models/user');

let token;
let tokenWrongUser;

beforeAll(resetTestDb);
beforeAll(async () => {
  const response = await api.post('/api/login')
    .send({
      username: 'root',
      password: 'secretpassword'
    });
  token = response.body.token;

  const response2 = await api.post('/api/login')
    .send({
      username: 'mattmuroya',
      password: 'secretpassword2'
    });
  tokenWrongUser = response2.body.token;
});

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
      .set({
        Authorization: `bearer ${token}`
      })
      .send({
        title: 'new blog title',
        author: 'matt muroya',
        url: 'http://mattmuroya.com',
        likes: 100
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);
    
    expect(response.body.title).toBe('new blog title');

    const users = await api.get('/api/users');
    expect(response.body.userId.toString()).toBe(users.body[0].id);

    const blogs = await api.get('/api/blogs');
    expect(blogs.body).toHaveLength(initialBlogs.length + 1);
  });

  test('add blog entry with invalid token is rejected', async () => {
    const response = await api.post('/api/blogs')
      .set({
        Authorization: 'bearer invalidtoken'
      })
      .send({
        title: 'new blog title',
        author: 'matt muroya',
        url: 'http://mattmuroya.com',
        likes: 100
      })
      .expect(401);

    expect(response.error.text).toBe('{"error":"Invalid token."}');
  });

  test('blog entry with expired token is rejected', async () => {
    const response = await api.post('/api/blogs')
      .set({
        Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hdHRtdXJveWEiLCJpZCI6IjYyNjI3NzRjMzg2MWU0NDU5Mzc4NmM1YiIsImlhdCI6MTY1MDYyMDI5MiwiZXhwIjoxNjUwNjIzODkyfQ.2ZG37RM7Ucm94i5N3rN1_nyZ-wQ4i_aaQW-qtKnSr-w'
      })
      .send({
        title: 'new blog title',
        author: 'matt muroya',
        url: 'http://mattmuroya.com',
        likes: 100
      })
      .expect(401);

    expect(response.error.text).toBe('{"error":"Token expired."}');
  });
  
  test('blog entry with no title is rejected', async () => {
    await api.post('/api/blogs')
      .set({
        Authorization: `bearer ${token}`
      })
      .send({
        author: 'matt muroya',
        url: 'http://mattmuroya.com',
        likes: 100
      })
      .expect(400);
  });

  test('blog entry with no url is rejected', async () => {
    await api.post('/api/blogs')
      .set({
        Authorization: `bearer ${token}`
      })
      .send({
        title: 'test blog with no url',
        author: 'matt muroya',
        likes: 100
      })
      .expect(400);
  });

  test('"likes" defaults to 0 when no number provided', async () => {
    const response = await api.post('/api/blogs')
      .set({
        Authorization: `bearer ${token}`
      })
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
    const id = response.body[2].id;
    await api.delete(`/api/blogs/${id}`)
      .set({
        Authorization: `bearer ${token}`
      })
      .expect(204);
    
    const blogs = await api.get('/api/blogs');
    expect(blogs.body).toHaveLength(initialBlogs.length - 1);

    const user = await User.findById('6262834b24228c7f3130dbf3');
    expect(user.blogs).toHaveLength(initialBlogs.length - 1);
  });

  test('delete by id rejected with invalid token', async () => {
    const response = await api.get('/api/blogs');
    const id = response.body[0].id;
    await api.delete(`/api/blogs/${id}`)
      .set({
        Authorization: `bearer ${tokenWrongUser}`
      })
      .expect(401);
  });

  test('delete by id responds with 400 for bad id', async () => {
    const response = await api.delete('/api/blogs/malformedId')
      .set({
        Authorization: `bearer ${token}`
      })
      .expect(400);
    
    expect(response.error.text).toBe('{"error":"Malformed ID."}');
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
      .set({
        Authorization: `bearer ${token}`
      })
      .send(updatedDetails)
      .expect(200);

    expect(updatedNote.body.likes).toBe(initialBlogs[0].likes + 1);
  });

  test('update blog fails for invalid token', async () => {
    const response = await api.get('/api/blogs');
    const noteToUpdate = response.body[0];
    const updatedDetails = {
      title: noteToUpdate.title,
      author: noteToUpdate.author,
      url: noteToUpdate.url,
      likes: noteToUpdate.likes + 1
    };
    const id = noteToUpdate.id;
    await api.put(`/api/blogs/${id}`)
      .set({
        Authorization: `bearer ${tokenWrongUser}`
      })
      .send(updatedDetails)
      .expect(401);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

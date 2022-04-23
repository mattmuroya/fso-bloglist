const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { resetTestDb } = require('./blog.api.test.utils');

beforeEach(resetTestDb);

test('root can log in', async () => {
  await api.post('/api/login')
    .send({
      username: 'root',
      password: 'secretpassword'
    })
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('reject wrong password attempt', async () => {
  const response = await api.post('/api/login')
    .send({
      username: 'root',
      password: 'wrongpassword'
    })
    .expect(401);
  expect(response.error.text).toBe('{"error":"Invalid username or password."}');
});
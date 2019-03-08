const request = require('supertest');
const server = require('../index.js');

beforeAll(async () => {
  // do something before anything else runs
  console.log('Jest starting!');
});

// close the server after each test
afterAll(() => {
  server.close();
  console.log('server closed!');
});

describe('basic route test', () => {
  test('get home route GET /', async () => {
  const response = await request(server).get('/api');
  expect(response.status).toEqual(200);
  expect(response.text).toContain('Hello World!');
  });
});

describe('common student test', () => {
  test('get common students  GET /api/commonstudents', async () => {
    const response = await request(server).get('/api/commonstudents?teacher=teacherken@example.com');
    expect(response.status).toEqual(200);
    expect(response.text).toContain('students');
  });
});

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

describe('registration test', () => {
  test('post registration POST /api/register', async () => {
    const response = await request(server).post('/api/register').send({
      "teacher": "teacherken@gmail.com",
      "students":
        [
          "studentjon@example.com",
          "studenthon@example.com"
        ]
    });
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.text).toContain('OK');
  });
});

describe('common students test', () => {
  test('get common students GET /api/commonstudents', async () => {
    const response = await request(server).get('/api/commonstudents?teacher=teacherken@example.com&teacher=teacherjoe@example.com');
    expect(response.status).toEqual(200);
    expect(response.body.students).toBeDefined();
    expect(response.body.students.length >= 0).toBeTruthy();
  });
});

describe('suspend a student', () => {
  test('if the student exists, it succeeds', async () => {
    const response = await request(server).post('/api/suspend').send({
      "student" : "studentjon@example.com"
    });
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toContain('is suspended');
  });

  test('if the student does not exist, it fails', async () => {
    const response = await request(server).post('/api/suspend').send({
      "student" : "student-not-found@gmail.com"
    });
    expect(response.status).toEqual(404);
    expect(response.body).toBeDefined();
    expect(response.text).toContain('Student Not Found');
  });
});

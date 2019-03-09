const request = require('supertest');
const server = require('../index.js');

describe('registration test', () => {
  test('it succeeds', async () => {
    const response = await request(server).post('/api/register').send({
      "teacher": "teacher-new@gmail.com",
      "students":
        [
          "student-new-1@example.com",
          "student-new-2@example.com"
        ]
    });
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.text).toContain('OK');
  });
});

describe('common students test', () => {
  test('get common students GET /api/commonstudents', async () => {
    const response = await request(server).get('/api/commonstudents?teacher=teacher-ken@example.com');
    expect(response.status).toEqual(200);
    expect(response.body.students).toBeDefined();
    expect(response.body.students.length).toEqual(2);
  });

  test('get common students GET /api/commonstudents', async () => {
    const response = await request(server).get('/api/commonstudents?teacher=teacher-ken@example.com&teacher=teacher-joe@example.com');
    expect(response.status).toEqual(200);
    expect(response.body.students).toBeDefined();
    expect(response.body.students.length).toEqual(1);
  });
});

describe('suspension test', () => {
  test('if the student exists, it succeeds', async () => {
    const response = await request(server).post('/api/suspend').send({
      "student" : "student-jon@example.com"
    });
    expect(response.status).toEqual(204);
    expect(response.body).toEqual({});
  });

  test('if the student does not exist, it fails', async () => {
    const response = await request(server).post('/api/suspend').send({
      "student" : "student-not-found@example.com"
    });
    expect(response.status).toEqual(404);
    expect(response.body).toBeDefined();
    expect(response.body.message).toContain('Student Not Found');
  });
});

describe('retrieve students for notification', () => {
  test('if all the teacher and students exist, it succeeds', async () => {
    const response = await request(server).post('/api/retrievefornotifications').send({
      "teacher":  "teacher-ken@example.com",
      "notification": "Hello students! @student-jon@example.com @student-hon@example.com"
    });
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body.recipients.length >= 0).toBeTruthy();
  });

  test('if all the teacher and students exist, it succeeds', async () => {
    const response = await request(server).post('/api/retrievefornotifications').send({
      "teacher":  "teacher-not-found@example.com",
      "notification": "Hello students! @student-jon@example.com @student-hon@example.com"
    });
    expect(response.status).toEqual(404);
    expect(response.body).toBeDefined();
    expect(response.body.message).toContain('Teacher Not Found');
  });

  test('if the teacher or any students do not exist, it fails', async () => {
    const response = await request(server).post('/api/retrievefornotifications').send({
      "teacher":  "teacher-ken@example.com",
      "notification": "Hello students! @student-hon@example.com @student-not-found@example.com"
    });
    expect(response.status).toEqual(404);
    expect(response.body).toBeDefined();
    expect(response.body.message).toContain('Student Not Found');
  });
});

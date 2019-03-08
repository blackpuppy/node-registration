const store = require('../store');

module.exports = ({ router }) => {
  // getting the home route
  router.get('/', (ctx, next) => {
    ctx.body = 'Hello World!';
  });

  router.post('/register', async (ctx, next) => {
    await console.log('ctx.request.body: ', ctx.request.body);

    await store.register({
        teacherEmail: ctx.request.body.teacher,
        studentEmails: ctx.request.body.students
      })
      .then(() => {
        ctx.status = 200;
        ctx.body = 'OK';
      })
      .catch((e) => {
        const message = 'Internal server error';
        ctx.status = e.statusCode || 500;
        ctx.body = {
          error: e.data || { message }
        };
      });
  });

  // getting the common students route
  router.get('/commonstudents', (ctx, next) => {
    console.log('ctx.query.teacher: ', ctx.query.teacher);

    ctx.body = {"students": [
      "commonstudent1@gmail.com",
      "commonstudent2@gmail.com",
      "student_only_under_teacher_ken@gmail.com"
    ]};
  });
};

const store = require('../store');

module.exports = ({ router }) => {
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
  router.get('/commonstudents', async (ctx, next) => {
    await console.log('ctx.query.teacher: ', ctx.query.teacher);

    await store.getCommonStudents({
      teacherEmails: ctx.query.teacher
    })
    .then((students) => {
      ctx.status = 200;
      ctx.body = {students};
    })
    .catch((e) => {
      const message = 'Internal server error';
      ctx.status = e.statusCode || 500;
      ctx.body = {
        error: e.data || { message }
      };
    });
  });

  // suspend a student
  router.post('/suspend', async (ctx, next) => {
    // await console.log('ctx.request.body: ', ctx.request.body);

    const studentEmail = ctx.request.body.student;

    await store.suspend({
      studentEmail: ctx.request.body.student
    })
    .then(async () => {
      ctx.status = 204;
    })
    .catch(async (e) => {
      // await console.debug('error: ', e);

      const message = e.message || 'Internal server error';
      ctx.status = e.statusCode || 500;
      ctx.body = { message };
    });
  });

  // retrieve students of a notification
  router.post('/retrievefornotifications', async (ctx, next) => {
    await console.log('/api/retrievefornotifications: ctx.request.body =', ctx.request.body);

    await store.getNotificationRecipients({
      teacherEmail: ctx.request.body.teacher,
      notification: ctx.request.body.notification,
    })
    .then((recipients) => {
      ctx.status = 200;
      ctx.body = {recipients};
    })
    .catch((e) => {
      // console.debug('error: ', e);

      const message = e.message || 'Internal server error';
      ctx.status = e.statusCode || 500;
      ctx.body = { message };
    });
  });
};

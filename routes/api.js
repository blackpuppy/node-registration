module.exports = ({ router }) => {
  // getting the home route
  router.get('/', (ctx, next) => {
    ctx.body = 'Hello World!';
  });

// router.post('/api/register', (req, res) => {
//   store.register({
//       teacherEmail: req.body.teacher,
//       studentEmails: req.body.students
//     })
//     .then(() => res.sendStatus(200))
//     .catch(() => res.sendStatus(500));
// });

  // getting the common students route
  router.get('/commonstudents', (ctx, next) => {
    console.log('ctx: ', ctx);

    ctx.body = {"students": [
      "commonstudent1@gmail.com",
      "commonstudent2@gmail.com",
      "student_only_under_teacher_ken@gmail.com"
    ]};
  });
};

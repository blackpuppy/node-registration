const knex = require('knex')(require('./knexfile'));
const util = require('util');
const Promise = require('bluebird');

// function upsert(table, data, uniqueColumnName) {
//   let insert = knex(table).insert(data);
//   delete data['uniqueColumnName'];
//   let update = knex(table).update(data);
//   let query = util.format('%s on duplicate key update %s',
//     insert.toString(), update.toString().replace(/^update ([`"])[^\1]+\1 set/i, ''))
//   return knex.raw(query);
// }

module.exports = {
  async register ({teacherEmail, studentEmails}) {
    console.log(`register students ${studentEmails} to a teacher ${teacherEmail}`);

    return await knex.transaction(async function(tx) {
        const [teacher, ...restTeachers] = await knex('teachers').transacting(tx).where({email: teacherEmail});

        let tid;
        if (!teacher) {
          console.debug('insert teacher');

          let restTids;
          [tid, ...restTids] = await knex('teachers').transacting(tx).insert({email: teacherEmail}, 'id');
        } else {
          console.debug('got teacher');

          tid = teacher.id;
        }

        console.debug('tid:', tid);

        await Promise.map(studentEmails, async function(studentEmail) {
          const [student, restStudents] = await knex('students').transacting(tx).where({email: studentEmail});

          console.debug('student:', student);

          let sid;
          if (!student) {
            console.debug('insert student');

            let restSids;
            [sid, ...restSids] = await knex('students').transacting(tx).insert({email: studentEmail}, 'id');
          } else {
            console.debug('got student');

            sid = student.id;
          }

          console.debug('sid:', sid);

          const [registration, ...restRegisrations] = await knex('registrations').transacting(tx).where({
            teacher_id: tid,
            student_id: sid,
          });

          console.debug('registration:', registration);

          if (!registration) {
            console.debug('insert registration: (', tid, ', ', sid, ')');

            await knex('registrations').transacting(tx).insert({
              teacher_id: tid,
              student_id: sid,
              suspended: false,
            });
          } else if (registration.suspended) {
            console.debug('update registration: (', tid, ', ', sid, ')');

            await knex('registrations').transacting(tx).where({
              teacher_id: registration.teacher_id,
              student_id: registration.student_id,
            }).update({suspended: false});
          }
        });
    });
  }
}

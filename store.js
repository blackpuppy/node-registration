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
  async register({teacherEmail, studentEmails}) {
    console.log(`register students ${studentEmails} to a teacher ${teacherEmail}`);

    return await knex.transaction(async function(tx) {
      const [teacher, ...restTeachers] = await knex('teachers').transacting(tx).where({email: teacherEmail});

      let tid;
      if (!teacher) {
        // console.debug('insert teacher');

        let restTids;
        [tid, ...restTids] = await knex('teachers').transacting(tx).insert({email: teacherEmail}, 'id');
      } else {
        // console.debug('got teacher');

        tid = teacher.id;
      }

      // console.debug('tid:', tid);

      await Promise.map(studentEmails, async function(studentEmail) {
        const [student, restStudents] = await knex('students').transacting(tx).where({email: studentEmail});

        // console.debug('student:', student);

        let sid;
        if (!student) {
          // console.debug('insert student');

          let restSids;
          [sid, ...restSids] = await knex('students').transacting(tx).insert({email: studentEmail}, 'id');
        } else {
          // console.debug('got student');

          sid = student.id;
        }

        // console.debug('sid:', sid);

        const [registration, ...restRegisrations] = await knex('registrations').transacting(tx).where({
          teacher_id: tid,
          student_id: sid,
        });

        // console.debug('registration:', registration);

        if (!registration) {
          // console.debug('insert registration: (', tid, ', ', sid, ')');

          await knex('registrations').transacting(tx).insert({
            teacher_id: tid,
            student_id: sid,
            suspended: false,
          });
        } else if (registration.suspended) {
          // console.debug('update registration: (', tid, ', ', sid, ')');

          await knex('registrations').transacting(tx).where({
            teacher_id: registration.teacher_id,
            student_id: registration.student_id,
          }).update({suspended: false});
        }
      });
    });
  },

  async getCommonStudents({teacherEmails}) {
    await console.log(`retrieve students common to teacher(s) ${teacherEmails}`);

    let commonStudentEmails = await knex('students')
      .select('students.email')
      .join('registrations', 'registrations.student_id', '=', 'students.id')
      .join('teachers', 'teachers.id', '=', 'registrations.teacher_id')
      .where('teachers.email', teacherEmails[0])
      .map(r => r.email);

    if (teacherEmails.length > 1) {
      await Promise.map(teacherEmails, async function(teacherEmail) {
        const studentEmails = await knex('students')
          .select('students.email')
          .join('registrations', 'registrations.student_id', '=', 'students.id')
          .join('teachers', 'teachers.id', '=', 'registrations.teacher_id')
          .where('teachers.email', teacherEmail)
          .map(r => r.email);

        await console.debug(`students found for teacher ${teacherEmail}: `, commonStudentEmails);

        commonStudentEmails = commonStudentEmails.filter(
          email => studentEmails.includes(email)
        );
      });
    }

    await console.debug('common students found: ', commonStudentEmails);

    return commonStudentEmails;
  },

  async suspend({studentEmail}) {
    await console.log(`suspend student ${studentEmail}`);

    const [student, restStudents] = await knex('students').where({email: studentEmail});

    // await console.debug('student:', student);

    if (!student) {
      return Promise.reject({
        statusCode: 404,
        message: "Student Not Found"
      });
    }

    return await knex('registrations').update({suspended: true})
      .where('student_id', student.id);
  },

  async getNotificationRecipients({teacherEmail, notification}) {
    await console.log(`get recipients of notification "${notification}" sent by teacher ${teacherEmail}`);

    const [teacher, ...restTeachers] = await knex('teachers').where({email: teacherEmail});

    let tid;
    if (!teacher) {
      // console.debug('insert teacher');

      return Promise.reject({
        statusCode: 404,
        message: "Teacher Not Found",
      });
    } else {
      // console.debug('got teacher');

      tid = teacher.id;
    }

    // await console.debug('tid:', tid);

    // get students listed in notification, validated to exists and not suspended
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const notificationEmails = notification.match(emailRegex);

    // await console.debug('notificationEmails:', notificationEmails);

    // validate students mentionedin notification
    const studentEmailsFound = await knex('students')
      .select('email')
      .whereIn('email', notificationEmails)
      .map(record => record.email);

    // await console.debug('studentEmailsFound:', studentEmailsFound);

    const studentEmailsNotFound = notificationEmails.filter(
      email => !studentEmailsFound.includes(email)
    );

    // await console.debug('studentEmailsNotFound:', studentEmailsNotFound);

    if (studentEmailsNotFound.length > 0) {
      return Promise.reject({
        statusCode: 404,
        message: `Student Not Found: ${studentEmailsNotFound.join(', ')}`,
      })
    }

    // get teacher's registered students and those mentioned in notification
    const recipients = await knex('students')
      .distinct('students.email')
      .select()
      .join('registrations', 'registrations.student_id', '=', 'students.id')
      .where('registrations.suspended', 0)
      .andWhere(function() {
        this.where('registrations.teacher_id', tid)
        .orWhereIn('students.email', notificationEmails)
      })
      .map(record => record.email);

    // await console.debug('recipients:', recipients);

    return recipients;
  }
}

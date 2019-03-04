const knex = require('knex')(require('./knexfile'));

module.exports = {
  register ({teacher, students}) {
    console.log(`register students ${students} to a teacher ${teacher}`);

    const studentsData = students.map(s => ({
      email: s
    }));

    console.debug('studentsData: ', studentsData);

    return knex.transaction(function(tx) {
      knex('teachers').transacting(tx).insert({email: teacher}, 'id')
      .then(function(tids) {
        console.debug('tids: ', tids);

        return knex('students').transacting(tx).insert(studentsData, ['id'])
        .then(function(sids) {
          console.debug('sids: ', sids);

          const registrationsData = sids.map(sid => ({
            teacher_id: tids[0],
            student_id: sid
          }));

          console.debug('registrationsData: ', registrationsData);

          return knex('registrations').transacting(tx).insert(registrationsData);
        })
        .catch(tx.rollback);
      })
      .then(tx.commit)
      .catch(tx.rollback);
    });
  }
}

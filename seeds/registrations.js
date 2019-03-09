exports.seed = async function(knex, Promise) {
  return await knex.transaction(async function(tx) {
    // Deletes ALL existing entries
    let rc = await knex('registrations').transacting(tx).del();

    console.log(`${rc} records deleted from table registrations`);

    let sc = await knex('students').transacting(tx).del();

    console.log(`${sc} records deleted from table students`);

    let tc = await knex('teachers').transacting(tx).del();

    console.log(`${tc} records deleted from table teachers`);

    // Inserts seed entries
    rc = await knex('teachers').transacting(tx).insert([
      {id: 1, email: 'teacher-ken@example.com'},
      {id: 2, email: 'teacher-joe@example.com'},
      {id: 3, email: 'teacher-won@example.com'}
    ]);

    console.log(`${rc} records inserted into table teachers`);

    sc = await knex('students').transacting(tx).insert([
      {id: 1, email: 'student-jon@example.com'},
      {id: 2, email: 'student-hon@example.com'},
      {id: 3, email: 'student-mary@example.com'}
    ]);

    console.log(`${sc} records inserted into table students`);

    tc = await knex('registrations').transacting(tx).insert([
      {id: 1, teacher_id: 1, student_id: 1, suspended: 0},
      {id: 2, teacher_id: 1, student_id: 2, suspended: 0},
      {id: 3, teacher_id: 2, student_id: 2, suspended: 0},
      {id: 4, teacher_id: 2, student_id: 3, suspended: 0},
      {id: 5, teacher_id: 3, student_id: 1, suspended: 0},
      {id: 6, teacher_id: 3, student_id: 3, suspended: 0},
    ]);

    console.log(`${tc} records inserted into table registrations`);
  });
};

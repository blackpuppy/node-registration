exports.up = function(knex, Promise) {
  return knex.schema.createTable('registrations', function (t) {
    t.increments('id').primary();
    t.integer('teacher_id').unsigned().notNullable();
    t.integer('student_id').unsigned().notNullable();
    t.boolean('suspended').notNullable().defaultTo(0);
    t.timestamps(false, true);

    t.unique(['teacher_id', 'student_id']);

    t.foreign('teacher_id').references('id').inTable('teachers');
    t.foreign('student_id').references('id').inTable('students');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('registrations');
};

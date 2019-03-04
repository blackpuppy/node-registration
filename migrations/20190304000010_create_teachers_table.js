exports.up = function(knex, Promise) {
  return knex.schema.createTable('teachers', function (t) {
    t.increments('id').primary();
    t.string('email').notNullable();
    t.timestamps(false, true);

    t.unique('email');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('teachers');
};

const knex = require('knex')(require('./knexfile'));

module.exports = {
  register ({teacher, students}) {
    console.log(`register students ${username} to a teacher ${teacher}`);

    return knex('teacher').insert({
    })
}

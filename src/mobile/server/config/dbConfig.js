var knex;

if (process.env.DEPLOYED) {
  knex = require('knex')({
    client: 'pg',
    connection: {
      host: 'postgres',
      user: 'postgres',
      password: 'mysecretpassword',
      database : 'postgres',
      charset  : 'utf8'
    }
  });
} else {
  knex = require('knex')({
    client: 'pg',
    connection: {
      host: 'localhost',
      database: 'postgres',
      password:'root',
      charset: 'utf8'
    }
  });
}

var db = require('bookshelf')(knex);

var createUsersTable = function () {
  return db.knex.schema.createTable('users', function (user) {
    user.increments('id').primary();
    user.string('picture');
    user.string('first_name');
    user.string('last_name');
    user.string('uuid');
    user.string('rider_id');
    user.string('access_token');
    user.string('refresh_token');
    user.timestamps();
  }).then(function (table) {
    console.log('Created user Table');
  });
};

var createHubsTable = function () {
  return db.knex.schema.createTable('hubs', function (hub) {
    hub.increments('id').primary();
    hub.string('lat');
    hub.string('lon');
    hub.timestamps();
  }).then(function (table) {
    console.log('Created hub Table');
  });
};

db.knex.schema.hasTable('hubs').then(function(exists) {
  if (!exists) {
    createHubsTable();
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    createUsersTable();
  }
});




module.exports = db;

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
    hub.string('name');
    hub.string('address');
    hub.decimal('distance');
    hub.decimal('duration');
    hub.string('leaveTime');
    hub.string('arriveTime');
    hub.string('endPoint');
    hub.decimal('lat', undefined, 5);
    hub.decimal('lon', undefined, 5);
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

// Shortcut function to reset challenges
var resetUsersTable = function () {
  return db.knex.schema.dropTable('users').then(createUsersTable);
};

// Shortcut function to reset matches
var resetHubsTable = function () {
  return db.knex.schema.dropTable('hubs').then(createHubsTable);
};

// Exposed function that resets the entire database
db.resetEverything = function (req, res) {
  resetUsersTable().then(function() {
    resetHubsTable();
  }).then(function() {
    res.status(201).end();
  });
};

db.resetEverythingPromise = function () {
  return resetUsersTable().then(function() {
    return resetHubsTable();
  }).catch(function(e) {
    console.log(e);
  });
};




module.exports = db;

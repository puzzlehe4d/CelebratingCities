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
    hub.string('area');
    hub.string('recurring');
    hub.decimal('distance');
    hub.string('leaveTime');
    hub.integer('duration');
    hub.string('endPoint');
    hub.string('lat', undefined, 5);
    hub.decimal('lon', undefined, 5);
    hub.string('geoRoute');
    hub.timestamps();
  }).then(function (table) {
    console.log('Created hub Table');
  });
};

var createRidesTable = function () {
  return db.knex.schema.createTable('rides', function (ride) {
    ride.increments('id').primary();
    ride.string('request_id');
    ride.string('product_id');
    ride.string('surge_multiplier')
    ride.string('status');
    ride.string('eta');
    ride.integer('hub_id');
    ride.string('driver');
    ride.string('vehicle');
    ride.timestamps();
  }).then(function (table) {
    console.log('Created ride Table');
  });
};

var createHubsUsersTable = function () {
  return db.knex.schema.createTable('hubs_users', function (hubs_users) {
    hubs_users.increments('id').primary();
    hubs_users.integer('user_id');
    hubs_users.integer('hub_id');
    hubs_users.timestamps();
  }).then(function (table) {
    console.log('Created hubs_users Table');
  });
};

var createRidesUsersTable = function () {
  return db.knex.schema.createTable('rides_users', function (rides_users) {
    rides_users.increments('id').primary();
    rides_users.integer('user_id');
    rides_users.integer('ride_id');
    rides_users.timestamps();
  }).then(function (table) {
    console.log('Created rides_users Table');
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

db.knex.schema.hasTable('rides').then(function(exists) {
  if (!exists) {
    createRidesTable();
  }
});

db.knex.schema.hasTable('hubs_users').then(function(exists) {
  if (!exists) {
    createHubsUsersTable();
  }
});

db.knex.schema.hasTable('rides_users').then(function(exists) {
  if (!exists) {
    createRidesUsersTable();
  }
});


var resetUsersTable = function () {
  return db.knex.schema.dropTable('users').then(createUsersTable);
};

var resetRidesTable = function () {
  return db.knex.schema.dropTable('rides').then(createRidesTable);
};

var resetHubsTable = function () {
  return db.knex.schema.dropTable('hubs').then(createHubsTable);
};

var resetHubsUsersTable = function () {
  return db.knex.schema.dropTable('hubs_users').then(createHubsUsersTable);
};

var resetRidesUsersTable = function () {
  return db.knex.schema.dropTable('rides_users').then(createRidesUsersTable);
};


// Exposed function that resets the entire database
db.resetEverything = function (req, res) {
  resetUsersTable().then(function() {
    resetHubsTable();
  }).then(function(){
    resetRidesTable();
  }).then(function(){
    resetHubsUsersTable();
  }).then(function(){
    resetRidesUsersTable();
  }).then(function() {
    res.status(201).end();
  });
};

db.resetEverythingPromise = function () {
  return resetUsersTable().then(function() {
    return resetHubsTable();
  }).then(function(){
    return resetRidesTable();
  }).then(function(){
    return resetHubsUsersTable();
  }).then(function(){
    return resetRidesUsersTable();
  }).catch(function(e) {
    console.log(e);
  });
};




module.exports = db;

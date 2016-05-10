var apiKey = require('./apiKey.js');
var port = process.env.PORT || 3000;
var Uber = require('node-uber');


////////// Passport and github passport required //////
var uber = new Uber({
  client_id: apiKey.client_id,
  client_secret: apiKey.client_secret,
  server_token: apiKey.server_token,
  redirect_uri: apiKey.redirect_uri,
  name: apiKey.name,
  language: 'en_US' // optional, defaults to en_US
});

module.exports = uber;
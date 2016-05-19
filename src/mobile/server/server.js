var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var morgan = require('morgan');
var response = require('response');
var bodyParser = require('body-parser');
var session = require('express-session');
var db = require('./config/dbConfig.js');
var socrata = require('./config/socrataConfig.js');
var redisClient = require('./config/redisConfig.js');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
  key: 'app.testS',
  secret: 'SEKR37',
  saveUninitialized:false,
  resave:false
}));

require('./routes.js')(app, redisClient);
require('./config/crimeScheduler.js')(redisClient);

app.use(express.static(__dirname + '/../client/www'));

var port = process.env.PORT || 3000;
server.listen(port);
console.log(process.env)
console.log('listening on port...', port)
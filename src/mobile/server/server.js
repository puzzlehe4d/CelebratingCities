var express = require('express');
var app = express();
var http = require('http')
var server = http.createServer(app);
var morgan = require('morgan');
var response = require('response');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat'
}))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use(express.static(__dirname + '/../client/www'));

var port = process.env.PORT || 3000;
server.listen(port);
console.log('listening on port...', port)
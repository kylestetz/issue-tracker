// bring in the node modules we're going to use
var express = require('express')
var http = require('http');
var path = require('path');
var nunjucks = require('nunjucks');
var moment = require('moment');

// make the express app
var app = express();

// set up nunjucks
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(__dirname + '/views'), {
  dev: true,
  autoescape: true
});

env.addFilter('log', function(data) {
  console.log(data);
});

env.addFilter('json', function(data) {
  return JSON.stringify(data);
});

env.addFilter('date', function(data, format) {
  return moment(data).format(format);
});

// configure the app
app.configure( function(){
  env.express(app);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler());
});

var mongo = require('./db');
mongo({});

//  routes/index.js is where all the fun happens
require('./routes')(app);

// run the server
http.createServer(app).listen(3003, function(){
  console.log('The node server is running at http://localhost:3003');
});
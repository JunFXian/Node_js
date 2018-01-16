//reference:
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website
// https://github.com/sequelize/express-example
// http://sequelize.readthedocs.io/en/1.7.0/articles/express/
// http://docs.sequelizejs.com/manual/tutorial/migrations.html#the-sequelizerc-file
// https://github.com/sequelize/sequelize/issues/5036

//it is a configuation file for Express application object (app)

var express = require('express');
//core Node library for parsing file and directory paths
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');

//define the routes modules the app needs
var index = require('./routes/index');
var about = require('./routes/about');

//create the app object
var app = express();

// view engine setup
//set the 'views' value to specify the folder where the templates will be stored
app.set('views', path.join(__dirname, 'views'));
//set the 'view engine' value to specify the template library 
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(validator());
//use the Express.static middleware to get Express to serve all the static files 
//in the directory /public in the project root
app.use(express.static(path.join(__dirname, 'public')));

//add our (previously imported) route-handling code to the request handling chain
app.use('/', index);
//The paths specified above ('/' and '/users') are treated as a prefix to routes 
//defined in the imported files. So for example if the imported users module defines 
//a route for /profile, you would access that route at /users/profile. We'll talk 
//more about routes in a later article.
app.use('/about', about);

//adds handler methods for errors and HTTP 404 responses
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//add it to the module exports (this is what allows it to be imported by /bin/www)
module.exports = app;

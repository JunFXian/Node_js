//First it loads the express module, and uses it to get an 
//express.Router object. Then it specifies a route on that 
//object, and lastly exports the router from the module (this 
//is what allows the file to be imported into app.js)

var express = require('express');
var router = express.Router();

/* GET home page. */
//The route defines a callback that will be invoked whenever 
//an HTTP GET request with the correct pattern is detected. 
//The matching pattern is the route specified when the module 
//is imported ('/users') plus whatever is defined in this file 
//('/'). In other words, this route will be used when an URL 
//of /users/ is received
//the callback function has the third argument 'next', and is 
//hence a middleware function rather than a simple route callback. 
//While the code doesn't currently use the next argument, it may be 
//useful in the future if you want to add multiple route handlers to 
//the '/' route path.
router.get('/', function(req, res, next) {
	//The method Response.render() is used to render a specified 
	//template along with the values of named variables passed in an 
	//object, and then send the result as a response
  	res.render('index', { title: 'Express' });
});

module.exports = router;

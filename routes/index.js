//First it loads the express module, and uses it to get an 
//express.Router object. Then it specifies a route on that 
//object, and lastly exports the router from the module (this 
//is what allows the file to be imported into app.js)

var models  = require('../models');
var express = require('express');
var router = express.Router();

// Require controller modules.
var recipe_controller = require('../controllers/recipeController');

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
router.get('/', recipe_controller.index);

// GET request for one Recipe.
router.get('/recipes/:id', recipe_controller.recipe_detail);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/create', recipe_controller.recipe_create_get);

// POST request for creating Book.
router.post('/create', recipe_controller.recipe_create_post);

// GET request to delete Book.
router.get('/:id/delete', recipe_controller.recipe_delete_get);

// POST request to delete Book.
router.post('/:id/delete', recipe_controller.recipe_delete_post);

// GET request to update Book.
router.get('/:id/update', recipe_controller.recipe_update_get);

// POST request to update Book.
router.post('/:id/update', recipe_controller.recipe_update_post);


module.exports = router;

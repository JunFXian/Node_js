var models  = require('../models');
var express = require('express');
var router = express.Router();

// Require controller modules.
var json_controller = require('../controllers/jsonController');

router.get('/recipes/json', json_controller.recipe_list_get);

router.get('/recipe/:id/json', json_controller.recipe_get);

router.get('/recipe/:id/ingredients/json', json_controller.recipe_ingredients_get);

router.get('/recipe/:id/steps/json', json_controller.recipe_steps_get);

module.exports = router;

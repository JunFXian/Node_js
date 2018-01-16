const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var models  = require('../models');
var Recipe = require('../models/recipe');
var express = require('express');
var Sequelize = require('sequelize');

var async = require('async');

const Op = Sequelize.Op;

//for home page
exports.index = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: Home Page');
    //use sequalize models data retrieval methods
    models.Recipe.findAll({
    		// include: [ models.Ingredient ], [ models.Step ]
    	}).then(function(recipe_list){
			//The method Response.render() is used to render a specified 
			//template along with the values of named variables passed in an 
			//object, and then send the result as a response
  			res.render('index', { 
  				title: 'Share Your Favorite Recipe',
  				recipes: recipe_list
  			});
  		});
};

// Display detail page for a specific recipe.
exports.recipe_detail = function(req, res, next) {
    //res.send('NOT IMPLEMENTED: Recipe detail: ' + req.params.id);
// // an example using an object instead of an array
// async.parallel({
//     one: function(callback) {
//         setTimeout(function() {
//             callback(null, 1);
//         }, 200);
//     },
//     two: function(callback) {
//         setTimeout(function() {
//             callback(null, 2);
//         }, 100);
//     }
// }, function(err, results) {
//     // results is now equals to: {one: 1, two: 2}
// });
    async.parallel({
    	reci_res: function(callback){
    		models.Recipe.findOne({
    			where: {
    				id: {
    					[Op.eq]: req.params.id
    				}
    			}
    		}).then(function(reci_info){
    			callback(null, reci_info);
    		});
    	},
    	ingr_res: function(callback){
    		models.Ingredient.findAll({
    			where: {
    				recipeId: {
    					[Op.eq]: req.params.id
    				}
    			}
    		}).then(function(ingr_list){
    			callback(null, ingr_list);
    		});
    	},
    	step_res: function(callback){
    		models.Step.findAll({
    			where: {
    				recipeId: {
    					[Op.eq]: req.params.id
    				}
    			}
    		}).then(function(step_list){
    			callback(null, step_list);
    		});
    	}
    }, function(err, result) {
    		if (err) console.log(err);
    		// console.log(result);
    		res.render('detail', { 
  				data: result,
  				id: req.params.id
  			});
    });
};

// Display recipe create form on GET.
exports.recipe_create_get = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: Recipe create GET');
    res.render('create', { 
  				title: 'Create recipe'
  			});
};

// Handle recipe create on POST.
exports.recipe_create_post = [
    // Validate that the name field is not empty.
    body('recipename', 'Recipe name required').isLength({ min: 1 }).trim(),
    // Sanitize (trim and escape) the name field.
    sanitizeBody('recipename').trim().escape(),
    // Process request after validation and sanitization.
	function(req, res, next) {
		// res.send('NOT IMPLEMENTED: Recipe create POST');
		// Extract the validation errors from a request.
        const errors = validationResult(req);
    	if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('create', { 
  				title: 'Create recipe',
  				errors: errors.array()
  			});
        	return;
        } else {
        	// Data from form is valid.
        	models.Recipe.create({
				name: req.body.recipename,
    			servings: req.body.servings,
    			image: req.body.imageUrl 
        	}).then(function(newRecipe) {
  				var ingr_num = req.body.ingrItemsNum;
  				var step_num = req.body.stepsNum;
  				var recipe_id = newRecipe.id;
  				if (ingr_num || step_num) {
  					res.redirect('/create/' + recipe_id + '/' + ingr_num + '/' + step_num);
  				} else {
  					res.redirect('/');
  				}
  			});
        }
    }
];

// Display recipe create form on GET.
exports.recipe_createdetail_get = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: Recipe create GET');
    var ingrCount = [];
    for (i = 0; i < req.params.ingr; i++) { 
    	ingrCount.push(i);
	}
	var stepCount = [];
    for (i = 0; i < req.params.step; i++) { 
    	stepCount.push(i);
	}
    models.Recipe.findOne({
    		where: {
    			id: {
    				[Op.eq]: req.params.id
    			}
    		}
    	}).then(function(result){
			res.render('createDetail', { 
  				title: 'Create recipe',
  				recipe: result,
  				ingr_number: ingrCount,
  				step_number: stepCount
  			});
  		});
};

// Handle recipe create on POST.
exports.recipe_createdetail_post = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: Recipe create POST');
    var ingrArr = [];
    var ingrItem = {};
    for (i = 0; i < req.params.ingr; i++) { 
    	ingrItem = {
    		quantity: req.body["quantity"+i],
    		measure: req.body["measure"+i],
    		ingredient: req.body["ingredient"+i],
    		recipeId: req.params.id
    	}
    	ingrArr.push(ingrItem);
    }
    var stepArr = [];
    var stepItem = {};
    for (i = 0; i < req.params.step; i++) { 
    	stepItem = {
    		stepId: i+1,
    		shortDescription: req.body["short"+i],
    		description: req.body["description"+i],
    		videoURL: req.body["videoUrl"+i],
    		thumbnailURL: req.body["thumbUrl"+i],
    		recipeId: req.params.id
    	}
    	stepArr.push(stepItem);
    }

    async.parallel({
    	ingr_create: function(callback){
    		models.Ingredient.bulkCreate(
    			ingrArr
    		).then(function(){
    			callback(null);
    		});
    	},
    	step_create: function(callback){
    		models.Step.bulkCreate(
    			stepArr
    		).then(function(){
    			callback(null);
    		});
    	}
    }, function(err) {
    		if (err) console.log(err);
    		res.redirect('/');
    });
};

// Display recipe delete form on GET.
exports.recipe_delete_get = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: Recipe delete GET');
    res.render('delete', { 
  				title: 'Delete recipe',
  				deleteId: req.params.id
  			});
};

// Handle recipe delete on POST.
exports.recipe_delete_post = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: Recipe delete POST');
    async.parallel({
    	reci_res: function(callback){
    		models.Recipe.destroy({
    			where: {
    				id: {
    					[Op.eq]: req.params.id
    				}
    			}
    		}).then(function(){
    			callback(null);
    		});
    	},
    	ingr_res: function(callback){
    		models.Ingredient.destroy({
    			where: {
    				recipeId: {
    					[Op.eq]: req.params.id
    				}
    			}
    		}).then(function(){
    			callback(null);
    		});
    	},
    	step_res: function(callback){
    		models.Step.destroy({
    			where: {
    				recipeId: {
    					[Op.eq]: req.params.id
    				}
    			}
    		}).then(function(){
    			callback(null);
    		});
    	}
    }, function(err) {
    		if (err) console.log(err);
    		res.redirect('/');
    });
};

// Display recipe update form on GET.
exports.recipe_update_get = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: Recipe update GET');
    async.parallel({
    	reci_res: function(callback){
    		models.Recipe.findOne({
    			where: {
    				id: {
    					[Op.eq]: req.params.id
    				}
    			}
    		}).then(function(reci_info){
    			callback(null, reci_info);
    		});
    	},
    	ingr_res: function(callback){
    		models.Ingredient.findAll({
    			where: {
    				recipeId: {
    					[Op.eq]: req.params.id
    				}
    			}
    		}).then(function(ingr_list){
    			callback(null, ingr_list);
    		});
    	},
    	step_res: function(callback){
    		models.Step.findAll({
    			where: {
    				recipeId: {
    					[Op.eq]: req.params.id
    				}
    			}
    		}).then(function(step_list){
    			callback(null, step_list);
    		});
    	}
    }, function(err, result) {
    		if (err) console.log(err);
    		// console.log(result);
    		res.render('update', {
    			title: 'Update recipe',
  				data: result,
  				updateId: req.params.id
  			});
    });
};

// Handle recipe update on POST.
exports.recipe_update_post = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: Recipe update POST');
    var ingrArr = [];
    var ingrItem = {};
    for (i = 0; i < req.params.ingr; i++) { 
    	ingrItem = {
    		quantity: req.body["quantity"+i],
    		measure: req.body["measure"+i],
    		ingredient: req.body["ingredient"+i],
    		recipeId: req.params.id
    	}
    	ingrArr.push(ingrItem);
    }
    var stepArr = [];
    var stepItem = {};
    for (i = 0; i < req.params.step; i++) { 
    	stepItem = {
    		stepId: i+1,
    		shortDescription: req.body["short"+i],
    		description: req.body["description"+i],
    		videoURL: req.body["videoUrl"+i],
    		thumbnailURL: req.body["thumbUrl"+i],
    		recipeId: req.params.id
    	}
    	stepArr.push(stepItem);
    }

    async.parallel({
    	ingr_create: function(callback){
    		models.Ingredient.bulkCreate(
    			ingrArr
    		).then(function(){
    			callback(null);
    		});
    	},
    	step_create: function(callback){
    		models.Step.bulkCreate(
    			stepArr
    		).then(function(){
    			callback(null);
    		});
    	}
    }, function(err) {
    		if (err) console.log(err);
    		res.redirect('/');
    });
};

// Handle recipe ingredient or step update on POST.
exports.recipe_catagory_update_post = function(req, res, next) {
	


	
};
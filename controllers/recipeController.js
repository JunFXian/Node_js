var models  = require('../models');
var Recipe = require('../models/recipe');
var express = require('express');

var async = require('async');

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
    	ingr_res: function(callback){
    		models.Ingredient.findAll({
    			where: {
    				recipeId: req.params.id
    			}
    		}).then(function(ingr_list){
    			callback(null, ingr_list);
    		});
    	},
    	step_res: function(callback){
    		models.Step.findAll({
    			where: {
    				recipeId: req.params.id
    			}
    		}).then(function(step_list){
    			callback(null, step_list);
    		});
    	}
    }, function(err, result) {
    		if (err) console.log(err);
    		// console.log(result);
    		res.render('detail', { 
  				title: 'Recipe detail',
  				data: result,
  				id: req.params.id
  			});
    });
};

// Display recipe create form on GET.
exports.recipe_create_get = function(req, res) {
    // res.send('NOT IMPLEMENTED: Recipe create GET');
    res.render('create', { 
  				title: 'Create recipe',
  				ingr_number: [1, 2, 3, 4, 5, 6],
  				step_number: [1, 2, 3, 4, 5]
  			});
};

// Handle recipe create on POST.
exports.recipe_create_post = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: Recipe create POST');
    console.log(req.body);
    // models.Recipe.create({

    // })
};

// Display recipe delete form on GET.
exports.recipe_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Recipe delete GET');
};

// Handle recipe delete on POST.
exports.recipe_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Recipe delete POST');
};

// Display recipe update form on GET.
exports.recipe_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Recipe update GET');
};

// Handle recipe update on POST.
exports.recipe_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Recipe update POST');
};
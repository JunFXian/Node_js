var models  = require('../models');
var Recipe = require('../models/recipe');
var express = require('express');
var Sequelize = require('sequelize');

var async = require('async');

const Op = Sequelize.Op;

//for home page
exports.recipe_list_get = function(req, res, next) {
    models.Recipe.findAll({
        attributes: [
            'id',
            'name',
            'servings',
            'image'
        ],
        include: [{
            model: models.Ingredient,
            where: { recipeId: Sequelize.col('Recipe.id') },
            attributes: ['quantity', 'measure', 'ingredient']
        },
        {
            model: models.Step,
            where: { recipeId: Sequelize.col('Recipe.id') },
            attributes: ['stepId', 'shortDescription', 'description', 'videoURL', 'thumbnailURL']
        }],
    }).then(function(recipes) {
        //res.json({recipes});   this is one json object
        //res.json(recipes);   this is a json array
        res.json(
            recipes
        );
            // async.parallel({
            //     ingredients: function(callback){
            //         models.Ingredient.findAll({
            //             attributes: [
            //                 'quantity',
            //                 'measure',
            //                 'ingredient'
            //             ], 
            //             where: {
            //                 recipeId: item.id
            //             }
            //         }).then(function(ingr_list){
            //             callback(null, ingr_list);
            //         });
            //     },
            //     steps: function(callback){
            //         models.Step.findAll({
            //             attributes: [
            //                 'stepId',
            //                 'shortDescription',
            //                 'description',
            //                 'videoURL',
            //                 'thumbnailURL'
            //             ],
            //             where: {
            //                 recipeId: req.params.id
            //             }
            //         }).then(function(step_list){
            //             callback(null, step_list);
            //         });
            //     }
            // }, function(err, recipe) {
            //     if (err) console.log(err);
            //     res.json({
            //         recipe
            //     });
            // });
    });
};

exports.recipe_get = function(req, res, next) {
    async.parallel({
    	recipe: function(callback){
    		models.Recipe.findOne({
                attributes: [
                    'id',
                    'name',
                    'servings',
                    'image'
                ],
                where: {
                    id: req.params.id
                }
            }).then(function(reci_info){
    			callback(null, reci_info);
    		});
    	},
    	ingredients: function(callback){
    		models.Ingredient.findAll({
                attributes: [
                    'quantity',
                    'measure',
                    'ingredient'
                ], 
                where: {
                    recipeId: req.params.id
                }
            }).then(function(ingr_list){
    			callback(null, ingr_list);
    		});
    	},
    	steps: function(callback){
    		models.Step.findAll({
                attributes: [
                    'stepId',
                    'shortDescription',
                    'description',
                    'videoURL',
                    'thumbnailURL'
                ],
                where: {
                    recipeId: req.params.id
                }
            }).then(function(step_list){
    			callback(null, step_list);
    		});
    	}
    }, function(err, recipe) {
    	if (err) console.log(err);
    	res.json({
            recipe
        });
    });
};

// Display recipe create form on GET.
exports.recipe_ingredients_get = function(req, res, next) {
    models.Ingredient.findAll({
        attributes: [
            'quantity',
            'measure',
            'ingredient'
        ], 
        where: {
            recipeId: req.params.id
        }
    }).then(function(ingredients){
        res.json({
            ingredients
        });
    });
};

// Handle recipe create on POST.
exports.recipe_steps_get = function(req, res, next) {
    models.Step.findAll({
        attributes: [
            'stepId',
            'shortDescription',
            'description',
            'videoURL',
            'thumbnailURL'
        ], 
        where: {
            recipeId: req.params.id
        }
    }).then(function(steps){
        res.json({
            steps
        });
    });
};
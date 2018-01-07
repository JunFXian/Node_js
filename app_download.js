//this node.js is to download the json file

const http = require('http');
const fs = require('fs');
const mysql = require('mysql');

//create a connection to the DB
const connection = mysql.createConnection({
    host: 'localhost',
    user: '***',
    password: '***',
    database: '***DB'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected!');
    downloadRecipesData();
});

function downloadRecipesData() {
	var recipesCols = 'recipes.id, recipes.name, recipes.servings, recipes.image';
	var ingredientsCols = 'ingredients.quantity, ingredients.measure, ingredients.ingredient';
	var stepsCols = 'steps.stepId, steps.shortDescription, steps.description, steps.videoURL, steps.thumbnailURL';
	var recipesQuery = 'SELECT ' + recipesCols + ' FROM recipes';
	var ingredientsQuery = 'SELECT ' + ingredientsCols + ' FROM ingredients';
	var stepsQuery = 'SELECT ' + stepsCols + ' FROM steps';
	connection.query(recipesQuery, function(err, result, fields) {
  		if(err) throw err;
  		console.log('Data received from DB:');
  		Object.keys(result).forEach(function(key) {
  			var rowData = JSON.stringify(result[key]);
        	var jsonData =  JSON.parse(rowData);
        	connection.query(ingredientsQuery + ' WHERE ingredients.recipeId = ' + jsonData.id,
        		 function(err1, result1, fields1) {
  				if(err1) throw err1;
  				console.log('Data received from ingredients table:');
  				Object.keys(result1).forEach(function(key1) {
  					var rowData1 = JSON.stringify(result1[key1]);
        			var jsonData1 =  JSON.parse(rowData1);
        			console.log(jsonData1);
  				});
  			});
  			connection.query(stepsQuery + ' WHERE steps.recipeId = ' + jsonData.id,
        		 function(err2, result2, fields2) {
  				if(err2) throw err2;
  				console.log('Data received from steps table:');
  				Object.keys(result2).forEach(function(key2) {
  					var rowData2 = JSON.stringify(result2[key2]);
        			var jsonData2 =  JSON.parse(rowData2);
        			console.log(jsonData2);
  				});
  			});
        });
  		endConnect();
	});
}

function endConnect() {
    connection.end(function(err){
        if (err) {
            console.log('Disconnection DB error.');
            return;
        }
        console.log('Disconnected DB');
    });
}


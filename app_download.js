//this node.js is to download the json file
//reference:
//	https://stackoverflow.com/questions/14974864/combine-or-merge-json-on-node-js-without-jquery
//	https://stackoverflow.com/questions/18361930/node-js-returning-result-from-mysql-query

const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const util = require('util');

var jsonFilePath = '/Users/junfx/Desktop/node_js/UploadRecipes/Recipes/recipes.json';

//create a connection to the DB
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql1234',
    database: 'RecipesDB'
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

  	var data = {'recipes': []};
  	fs.writeFile(jsonFilePath, JSON.stringify(data), 'utf8', function(err) {
   		if (err) throw err;
   	});

	connection.query(recipesQuery, function(err, result, fields) {
  		if(err) throw err;
  		console.log('Data received from DB');
  		var recipeArray = [];
  		Object.keys(result).forEach(function(key) {
  			var rowData = JSON.stringify(result[key]);
        	var jsonData =  JSON.parse(rowData);

        	var ingrData = [];
        	queryData(ingredientsQuery, jsonData.id, function(err, array){
        		if (err) {
        			// error handling code goes here
            		console.log("ERROR : ",err);            
        		} else {            
            		// code to execute on data retrieval
            		ingrData = array;
        		}    
        	});
        	
        	console.log(JSON.stringify(jsonData));

        	// jsonData.push(ingrData);

        	// console.log(JSON.stringify(jsonData));

        	

  			var stepData = queryData(stepsQuery, jsonData.id);
        	data.recipes.steps = stepData;

        	recipeArray.push(jsonData);
        });
        // endConnect();
	});
}

function queryData(query, id, callback) {
	connection.query(query + ' WHERE ingredients.recipeId = ' + id, 
		function(err, result, fields) {
  		if (err) {
  			throw err;
  			callback(err, null);
  		} else {
  			var dataArray = [];
  			Object.keys(result).forEach(function(key) {
 				var rowData = JSON.stringify(result[key]);
        		var jsonData = JSON.parse(rowData);
       			dataArray.push(jsonData);
  			});
  			//use util module to display array elements
  			// console.log(util.inspect(dataArray, false, null));
  			callback(null, dataArray);
  		}
  	});
}

function appendFile(jsonFile, jsonObj) {
	fs.readFile(jsonFile, 'utf8', function readFileCallback(err, data){
    	if (err){
        	console.log(err);
    	} else {
    		var parent = JSON.parse(data);
    		console.log(parent);
    		// parent.push(jsonObj); //add some data
    		// var json = JSON.stringify(parentObj); //convert it back to json
    		// fs.writeFile(jsonFile, json, 'utf8', function(err) {
   			// 	if (err) throw err;
   			// }); // write it back 
		}
	});
}

// function extendJSON(target) {
//     var sources = [].slice.call(arguments, 1);
//     sources.forEach(function (source) {
//         for (var prop in source) {
//             target[prop] = source[prop];
//         }
//     });
//     return target;
// }

function endConnect() {
    connection.end(function(err){
        if (err) {
            console.log('Disconnection DB error.');
            return;
        }
        console.log('Disconnected DB');
    });
}


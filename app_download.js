//this node.js is to download the json file
//reference:
//	https://stackoverflow.com/questions/14974864/combine-or-merge-json-on-node-js-without-jquery
//	https://stackoverflow.com/questions/18361930/node-js-returning-result-from-mysql-query

const fs = require('fs');
const mysql = require('mysql');
const util = require('util');

var jsonFilePath = '/Users/junfx/Desktop/node_js/UploadRecipes/Recipes/recipes.json';
var data = {'recipes': []};
var recipesArray = [];

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

  	data.recipes = recipesArray;
	connection.query(recipesQuery, function(err, result, fields) {
  		if(err) throw err;
  		console.log('Data received from DB');
  		Object.keys(result).forEach(function(key) {
  			var resultCount = result.length;
			var rowData = JSON.stringify(result[key]);
        	var jsonData =  JSON.parse(rowData);

        	var ingrTable = 'ingredients';
        	queryData(ingredientsQuery, ingrTable, jsonData.id, function(err, index, array){
        		if (err) {
        			// error handling code goes here
            		console.log("ERROR : ",err);            
        		} else {            
            		// code to execute on data retrieval
            		if (jsonData.id == index) {
            			jsonData.ingredients = array;
            		} else {
            			jsonData.ingredients = [];
            		}

            		var stepTable = 'steps';
        			queryData(stepsQuery, stepTable, jsonData.id, function(err, index, array){
        				if (err) {
        					// error handling code goes here
            				console.log("ERROR : ",err);            
        				} else {            
            				// code to execute on data retrieval
            				if (jsonData.id == index) {
            					jsonData.steps = array;
            				} else {
            					jsonData.steps = [];
            				}

            				recipesArray.push(jsonData);
            				appendFile(jsonFilePath, data);

            				//determine when to disconnect: after all results are downloaded
            				if (key == resultCount-1) {
            					endConnect();
            				}
        				}    
        			});
        		}    
        	});
        });
	});
}

function queryData(query, table, id, callback) {
	connection.query(query + ' WHERE ' + table + '.recipeId = ' + id, 
		function(err, result, fields) {
  		if (err) {
  			throw err;
  			callback(err, 0, null);
  		} else {
  			var dataArray = [];
  			Object.keys(result).forEach(function(key) {
 				var rowData = JSON.stringify(result[key]);
        		var jsonData = JSON.parse(rowData);
       			dataArray.push(jsonData);
  			});
  			//use util module to display array elements
  			// console.log(util.inspect(dataArray, false, null));
  			//returning result from MySQL query have to do the processing on the 
  			//results from the db query on a callback only
  			callback(null, id, dataArray);
  		}
  	});
}

function appendFile(jsonFile, content) {
	// fs.readFile(jsonFile, 'utf8', function readFileCallback(err, data){
 //    	if (err){
 //        	console.log(err);
 //    	} else {
 //    		fs.appendFile(jsonFile, content, 'utf8', function(err) {
 //   				if (err) throw err;
 //   			}); // write it back 
	// 	}
	// });
	fs.writeFile(jsonFile, JSON.stringify(content), 'utf8', function(err) {
   		if (err) throw err;
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


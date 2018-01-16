//combine upload and download script

const http = require('http');
const fs = require('fs');
const formidable = require('formidable');
const util = require('util');
const mysql = require('mysql');

//create a connection to the DB
const connection = mysql.createConnection({
    host: 'localhost',
    user: '***',
    password: '***',
    database: '***'
});

var jsonFilePath = '/Users/junfx/Desktop/node_js/UploadRecipes/Recipes/recipes.json';
var data = {'recipes': []};
var recipesArray = [];
var isDoneUploadIngr = false;
var isDoneUploadStep = false;

//creates a server on your computer
var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        processForm(req, res);
    } 
});

function displayForm(res) {
    // html page containing upload form
    fs.readFile("upload_form.html", function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
        res.write(data);
        res.end();
    });
}

function processForm(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        connection.connect(function(err){
            if (err) throw err;
            console.log('Connected!');
            uploadRecipesData(fields);
        });
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based on your 
        //application.
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('Received the data. Thank you!');
        // res.end(util.inspect({fields: fields, files: files}));
        res.end();
    });
}

function uploadRecipesData(fields) {
    var recipeRecord = { name: fields.name, servings: fields.servings, image: fields.image };
    var recipeId = 0;
    connection.query('INSERT INTO recipes SET ?', recipeRecord, function(err, res){
        if (err) throw err;
        console.log('Insert new recipe record to DB');
        recipeId = res.insertId;
        uploadIngredientsData(fields, recipeId);
        uploadStepsData(fields, recipeId);
    });
}

function uploadIngredientsData(fields, id) {
    var ingrArray = [ fields.quan0, fields.quan1, fields.quan2, fields.quan3, fields.quan4, 
    fields.quan5, fields.quan6, fields.quan7, fields.quan8, fields.quan9 ];
    var ingredientRecord = [];
    var ingredientRecordsArray = [];
    Object.keys(ingrArray).forEach(function(index) {
        if (ingrArray[index] != 0) {
            //keys of the fields, so the value with the key can be accessed via fields[quan]
            var quan = "quan" + index;
            var meas = "meas" + index;
            var ingr = "ingr" + index;
            ingredientRecord = [ id, fields[quan], fields[meas], fields[ingr] ];
            ingredientRecordsArray.push(ingredientRecord);
        }
    });
    
    // if no records then no need to upload
    if (ingredientRecordsArray.length == 0) return;
    connection.query('INSERT INTO ingredients (recipeId, quantity, measure, ingredient) VALUES ?', 
        [ingredientRecordsArray], function(err, res){
        if (err) throw err;
        console.log('Insert new ingredients record to DB');

        //determine when to disconnect the DB
        isDoneUploadIngr = true;
        if (isDoneUploadIngr && isDoneUploadStep) {
        	console.log("Start downloading the data");
            downloadRecipesData();
        }
    });
}

function uploadStepsData(fields, id) {
    var stepArray = [ fields.short0, fields.short1, fields.short2, fields.short3, fields.short4, 
    fields.short5, fields.short6, fields.short7, fields.short8, fields.short9 ];
    var stepRecord = [];
    var stepRecordsArray = [];
    Object.keys(stepArray).forEach(function(index) {
        if (stepArray[index]) {
            //keys of the fields, so the value with the key can be accessed via fields[short]
            var short = "short" + index;
            var desc = "desc" + index;
            var video = "video" + index;
            var thumb = "thumb" + index;
            //"-0" so the string part parses to int type
            var stepIndex = (index-0) + 1;
            stepRecord = [ id, stepIndex, fields[short], fields[desc], fields[video], fields[thumb] ];
            stepRecordsArray.push(stepRecord);
        }
    });
    // if no records then no need to upload
    if (stepRecordsArray.length == 0) return;
    connection.query('INSERT INTO steps (recipeId, stepId, shortDescription, description, videoURL, thumbnailURL) VALUES ?', 
        [stepRecordsArray], function(err, res){
        if (err) throw err;
        console.log('Insert new steps record to DB');

        //determine when to disconnect the DB
        isDoneUploadStep = true;
        if (isDoneUploadIngr && isDoneUploadStep) {
            console.log("Start downloading the data");
            downloadRecipesData();
        }
    });
}
              
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
	fs.writeFile(jsonFile, JSON.stringify(content), 'utf8', function(err) {
   		if (err) throw err;
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

server.listen(8086);

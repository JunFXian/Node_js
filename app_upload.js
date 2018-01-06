
//reference:
// Abbas Suterwala: https://www.sitepoint.com/creating-and-handling-forms-in-node-js/

const http = require('http');
const fs = require('fs');
const formidable = require('formidable');
const util = require('util');
const mysql = require('mysql');

//create a connection to the DB
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'yourDB'
});

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
        endConnect();
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
    connection.query('INSERT INTO ingredients (recipeId, quantity, measure, ingredient) VALUES ?', 
        [ingredientRecordsArray], function(err, res){
        if (err) throw err;
        console.log('Insert new ingredients record to DB');
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
    connection.query('INSERT INTO steps (recipeId, stepId, shortDescription, description, videoURL, thumbnailURL) VALUES ?', 
        [stepRecordsArray], function(err, res){
        if (err) throw err;
        console.log('Insert new steps record to DB');
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

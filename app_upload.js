
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
    user: 'yourusername',
    password: 'yourpassword',
    database: 'yourDB'
});

var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        processForm(req, res);
    }
});

// replace this with the location to save uploaded files
var upload_path = "/Users/junfx/Desktop/node_js/UploadRecipes/Recipes";
 
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
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based on your 
        //application.
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('received the data: \n\n');
        res.end(util.inspect({fields: fields, files: files}));
        connection.connect(function(err){
            if (err) throw err;
            console.log('Connected!');
        });
        var recipeRecord = { name: fields.name, servings: fields.servings, image: fields.image };
        connection.query('INSERT INTO recipes SET ?', recipeRecord, function(err, res){
            if (err) throw err;
            console.log('Insert new recipe record to DB');

        })
        connection.end(function(err){
            if (err) {
                console.log('Disconnection DB error.');
                return;
            }
        })
    });
}

server.listen(8086);

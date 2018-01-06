//this node.js is to download the json file

const http = require('http');
const fs = require('fs');
const mysql = require('mysql');

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
	connection.query('SELECT * FROM recipes', function(err,rows) {
  		if(err) throw err;
  		console.log('Data received from DB:\n');
  		console.log(rows);
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


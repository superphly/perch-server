"use strict";

console.log("\nInitializing perched server on... " + determineEnv());
function determineEnv() {
	return process.env.herokuLive ? "Heroku": "Local";
};


// Get required components
var server = require('./app/server.js');

//Start the server

server.Start(server.port);
console.log('server started on index.js');



console.log('Completed index.js\n');
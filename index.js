console.log("\nInitializing perched server...");

// Get required components
var server = require('./app/server.js');

//Start the server

server.Start(server.port);
console.log('server started on index.js');



console.log('Completed index.js\n');
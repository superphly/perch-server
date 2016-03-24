
///////////  REQUIREMENTS ///////////

var express = require('express');
var app = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var nodemailer = require('nodemailer');
var socketio = require('socket.io');

var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var http		 = require('http');


// =========== CONFIGURE MONGOOSE  =============== //

var configDB = require('./config/env/mongoose-config.js');
var dbURI = configDB.mongooseURI;
mongoose.connect(dbURI);



// ========= set up our EXPRESS application =========== //
	app.use(morgan('dev')); // log every request to the console
	app.use(cookieParser()); // read cookies (needed for auth)
	app.use(bodyParser.json()); // get information from html forms
	app.use(bodyParser.urlencoded({ extended: true }));

	app.set('view engine', 'ejs'); // set up ejs for templating

// ========== set up PASSPORT ========================== //
	app.use(session({ secret: 'thenisawanewheavenandanewearth' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

// ^^^^^^^^^^^^^ THIS NEEDS TO CHANGE ^^^^^^^^^^^^^^^^^^^^^^
// NOTE: passport setup needs to use token-based authentication rather than session-based
// ^^^^^^^^^^^^^ THIS NEEDS TO CHANGE ^^^^^^^^^^^^^^^^^^^^^^


//////////// CONFIGURE ROUTES /////////////
require('./routes.js')(app, passport, express); // load our routes and pass in our app and fully configured passport

// ========== CONFIGURE API ROUTES ================//
require('./api/v1/apiroutes.js')(app, passport, express, http);


//////////// CONFIGURE LAUNCH /////////////

var Start = function(port) {
	app.listen(port);
	console.log('The magic happens on port ' + port);
}

 console.log('exporting Start');
 exports.Start = Start;
 exports.app = app;
 exports.port = port;
 exports.passport = passport;

 console.log('Start exported');


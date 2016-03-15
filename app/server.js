
///////////  REQUIREMENTS ///////////

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var nodemailer = require('nodemailer');
var socketio = require('socket.io');
var app = express();


var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');



//////////// CONFIGURE MONGOOSE ////////////

var configDB = require('./app/config/env/mongoose-config.js');
var dbURI = configDB.mongooseURI;
mongoose.connect(dbURI);



//////////// CONFIGURE EXPRESS /////////////

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating


//////////// CONFIGURE PASSPORT /////////////
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


//////////// CONFIGURE ROUTES /////////////
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


//////////// CONFIGURE LAUNCH /////////////
app.listen(port);
console.log('The magic happens on port ' + port);
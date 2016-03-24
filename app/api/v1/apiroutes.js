//app/api/v1/apiroutes.js



module.exports = function(app, passport, express, http) {


	// routes for the API
	var api = express.Router(); //get an instance of the Express Router
	api.all('*'/*, apiAuth*/);

	// get the required models
	var Ping         = require('../../models/ping.js');
	var Location 	 = require('../../models/location.js');
	var User 		 = require('../../models/user.js');

	// require the promise engine
	var Promise = require('promise');

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api/v1)
	app.get('/api/v1/', function(req, res){
		res.status(200).json({ 'message': 'Welcome to the Perched API. Documentation is at /api/v1/help'});
	});

	// api documentation at /help
	app.get('/api/v1/help', function(req, res) {
	    res.status(200).json({ message: 'Documentation here...' });  
	});

	//user pings the server

	var pingPost = require('./modules/pingPost.js');
	var geoPing = pingPost.geoPing;

	api.post('/ping', apiAuth, function(req, res){geoPing(req, res)}); //uses the geoPing function chain at pingPost.js. Check ./modules


	// REGISTER OUR ROUTES -------------------------------
	// all of our routes will be prefixed with /api
	app.use('/api/v1', api);




function apiAuth(req, res, next) {
	// if user is authenticated in the session, carry on 
    if (req.isAuthenticated()){
    	req.flash('You are authenticated.');
        return next();
    };

    // if they aren't send 400 code.
    res.status(400).json({
    	message: 'error: you are not authenticated. Please sign up or log in.'
    });
};

};
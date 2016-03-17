//app/api/v1/apiroutes.js

module.exports = function(app, express) {

	// routes for the API
	var api = express.Router(); //get an instance of the Express Router

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	api.get('/', function(req, res) {
	    res.json({ message: 'hooray! welcome to our api!' });  
	});

	//user pings the server
	api.route('/ping')
		.post(function(req, res) {
			res.json({message: 'you sent a ping to the server!'});
		});

	// REGISTER OUR ROUTES -------------------------------
	// all of our routes will be prefixed with /api
	app.use('/api/v1', api);


};
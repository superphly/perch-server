/*
* A PingPost should contain:
* {
*	user: String,
*	timestamp: Date,
*	[vr: true | false], //(returns verbose messaging. default is false)
*	macAddress: String,
*	SSID: String,
*	token: String
*
* }
* A PingPost returns:
* {
*	req: {The original request body object},
*	status: ie, 200,
*	msg: 	['messages from server'],
*   location: {
		[inDatabase: true | false], //returns true if the location is already recorded. False if it is being pinged from the Google Places API.
		[location: {name, etc.}] //most likely location, in Google Places format
		[]
}
*/

//required modules

const https = require('https');
// get the required models
var Ping         = require('../../../models/ping.js');
var Location 	 = require('../../../models/location.js');
var User 		 = require('../../../models/user.js');

// require the promise engine
var Promise = require('promise');

//include vr = true for a verbose response, given as an array of messages at {msg = [msg1, msg2...]}.

var validateRequest = function(req, res) {
	return new Promise(function(resolve, reject){

		var postRequest = req.body;
		console.log(postRequest);
		//construct JSON response to Ping. pR = pingResponse.
		var pR = {};
			pR.req = postRequest;
			pR.status = 202;
			pR.vr = true;
		//if(postRequest.vr) pR.vr = true; //verbose response
		if(pR.vr) {pR.msg = ["Verbose messaging enabled. Processing Ping request."]
			} else {pR.msg = "Enable verbose messaging with {vr = true}"};
		//validate the incoming json here !!!
		if(
			postRequest.hasOwnProperty('user') && 
			postRequest.hasOwnProperty('timestamp') && 
			postRequest.hasOwnProperty('macAddress') && 
			postRequest.hasOwnProperty('SSID') && 
			postRequest.hasOwnProperty('token')
			) 
			{
				pR.req.valid = true;
				pR.SSID = {};
				pR.SSID.value = pR.req.SSID;
				pR.macAddress = {};
				pR.macAddress.value = pR.req.macAddress;
				pR.status = 202;
				if (pR.vr) pR.msg.push("Processing "+pR.status+": valid request at " + new Date());
				pR.location = {};
				pR.nearbyUsers = {};
				console.log(pR.msg);

				resolve(pR);
			} else {
				pR.req.valid = false;
				pR.err = true;
				pR.status = 400;
				if (pR.vr) pR.msg.push("Error "+pR.status+": validation error: invalid request");
				if(pR.vr) console.error(pR.msg);
				reject(pR);
			};
	});
};

var recordPing = function(pR) { 
	return new Promise(function(resolve, reject){
				//record the ping into the database here !!!
				try{
					var newPing = new Ping();
					newPing.user = pR.req.user;
					newPing.timestamp = pR.req.timestamp;
					newPing.macAddress = pR.req.macAddress;
					newPing.SSID = pR.SSID.value;
					//record ping

						//...CODE SHOULD GO HERE!!!...//

					//resolve pR for next promise
					pR.status = 200;
					resolve(pR)
					//error handling
					if(!newPing) throw "internal error: failed to record Ping.";
				} catch(e) {
					if(pR.vr) pR.msg.push(e);
					pR.status = 500;
					if(pR.vr) console.log(pR.msg);
					reject(pR);
				};
	});
};

var checkForLocation = function(pR) {
	return new Promise(function(resolve, reject){
		//lookup location here !!!
		try{//lookup location
			var location = undefined;
			if(location === undefined) throw "Could not find location in database, checking geolocation APIs";
			pR.location.inDatabase = true;
			pR.location.location = location.name;
			pR.location.msg = "You checked in at..." + location.name;
			pR.location.lat = location.lat;
			pR.location.lng = location.lng;
			pR.msg = "Found location in database. Checking for users.";
			resolve(pR);
		} catch(e) {
			pR.location.inDatabase = false;
			pR.msg.push(e);
			if(pR.vr) console.log(pR.msg);
			reject(pR);
		}
	});
};

//Get location from Google API and return it
//https://developers.google.com/maps/documentation/geolocation/intro?hl=en_US#cell_tower_object
	//construct JSON request to Google API. 
var geoRequest = function(pR) {
	return new Promise(function(resolve, reject){
		if(pR.vr) pR.msg.push('Looking for location of ' + pR.req.macAddress);
		// construct json request 
		var geoLocJSONReq = {
			"considerIp" : "false",
			"wifiAccessPoints": [
				{
					"macAddress"	: 	"pR.req.macAddress[0]" //pR.req.macAddress // we are looking for this wifi address.
				},
				{
					"macAddress" 	: 	"pR.req.macAddress[1]" // the Google geolocation API requires two wifi addresses. The second request is always the Joule Hotel.
				}
			]
		};
		//store geoLoc API response here
		var latLng = {};
		//Google API key
		var apiKey = require('../../../config/env/auth.js').geoLocAPI.key;
		//options for API request
		var geoOptions = {
			host  :  'www.googleapis.com',
			path	: '/geolocation/v1/geolocate?key=' + apiKey,
			method	: 	'POST'
		};
		//construct the request to geolocation api 
		//(.request and .response)
		var geoResponseJSON = {};
		var geoResponseBody = "";
		var geoRequest = https.request(geoOptions, function(response){
			//record the API response in "var body"
			response.on('data', function(data) {
				geoResponseBody += data;
			});

			//store the response in latLng(.lat and .lng)
			response.on('end', function() {
				//parse response as JSON
				geoResponseJSON = JSON.parse(geoResponseBody);
				//store lat and lng
				console.log('locations returned:' + geoResponseBody);
				pR.SSID.lat = geoResponseJSON.location.lat;
				pR.SSID.lng = geoResponseJSON.location.lng;
				//store accuracy
				pR.SSID.acc = geoResponseJSON.accuracy;
				//print lat and lng
				console.info('estimated latLng of SSID:' +pR.SSID.lat + ', ' + pR.SSID.lng);
				pR.status = 202;
				if(pR.vr) pR.msg.push(pR.status + ': Pinged geolocation server, waiting for response.');
				if(pR.vr) console.log(pR.msg);
				resolve(pR);
			});
		});
		//try make the request to the geolocation API 
		try{
			//pR.location.lat = "";
			//pR.location.lng = "";
			geoRequest.on('error', function(e) {
				throw('Problem with request to geolocation server: ' + e.message);
			});
			geoRequest.write(JSON.stringify(geoLocJSONReq));
			geoRequest.end();

		} catch(e) {
			pR.status = 502;
			if(pR.vr) pR.msg.push(pR.status+ ': ' + e);
			if(pR.vr) console.error(pR.msg);
			reject(pR);
		};

	});
};

//produce list of possible locations using Google Places API
//https://developers.google.com/places/web-service/search#PlaceSearchRequests
var searchRequest = function(pR) {
	return new Promise(function(resolve, reject){
		//Google API key
		var apiKey = require('../../../config/env/auth.js').geoLocAPI.key;
		//Configure parameters
		if(pR.vr) console.info(pR.SSID.lat + ', ' + pR.SSID.lng);
		var nearbySearchRequestParams = 'location='+pR.SSID.lat+','+pR.SSID.lng+'&radius='+pR.SSID.acc+'&rankby=prominence&key='+apiKey;
		//Configure search options
		var searchOptions = {
			host 	: 	'maps.googleapis.com',
			path 	: 	'/maps/api/place/nearbysearch/json?' + nearbySearchRequestParams,
			method 	: 	'GET'
		};
		if(pR.vr) pR.msg.push('Querying this path for search Request: ' + searchOptions.host+searchOptions.path);
		if(pR.vr) console.log(pR.msg);

		//store the search response here
		var searchAPIbody = "";
		var searchAPIJSON = {};

		//construct the search request
		var searchRequest = https.request(searchOptions, (response) => {
			console.log('statusCode: ', response.statusCode);
			console.log('headers: ', response.headers);

			response.on('data', (data) => {
				searchAPIbody += data;
			});

			response.on('end', function(){
				//console.info('the response body:' + searchAPIbody);
				//searchAPIJSON is the result of the query
				searchAPIJSON = JSON.parse(searchAPIbody);
				if(searchAPIJSON.status === "INVALID_REQUEST") throw('There was a problem handling the location request.')

				//we should filter out certain types of nearby places (like neighborhoods, pet stores, or hair salons). !!!

				//set pR.location.possibleLocs to the results of the query
				pR.location.possibleLocs = searchAPIJSON.results;
				pR.status = 202;
				if(pR.vr) pR.msg.push(pR.status+': Successfully retrieved locations from nearbySearch server');
				pR.location.location = pR.location.possibleLocs[0];
				if(pR.vr) pR.msg.push(pR.status+': User is most likely at ' + pR.location.location.name + ', located at/in ' + pR.location.location.vicinity);
				if(pR.vr) pR.msg.push(pR.status+': Also possible at/in ' + pR.location.possibleLocs[1].name + ', ' + pR.location.possibleLocs[2].name + ', or ' +pR.location.possibleLocs[3].name);		
				if(pR.vr) pR.msg.push(pR.status+': Locations for locationpicker at {location.possibleLocs}. Allow user to pick different location if incorrect.');

				resolve(pR);
			});
		});

		//try the search request
		try{

			searchRequest.on('error', (e) => {
				throw "Problem with search request: " + e.message;
			});
			searchRequest.end();


		} catch(e) {
			pR.status = 502;
			if(pR.vr) pR.msg.push(pR.status+': ' + e)
			reject(pR);
		};

	});
};


var getNearbyUsers = function(pR) {
	return new Promise(function(resolve, reject){
		resolve(pR);
	});
};


var geoPing = function(req, res) {
		console.log('geoPing');
		validateRequest(req, res)
			.then(val1 => {
				return recordPing(val1);
			})
			.catch(err1 => {
				console.log(err1);
				return err1;
			})
			.then(val2 => {
				return checkForLocation(val2);
			})
			.catch(err2 => {
				return geoRequest(err2)
					.then(val3 => {
						return searchRequest(val3);
					})
					.catch(err3 => {
						console.log(err3);
					})
				})
			.then(val4 => {
				return getNearbyUsers(val4);
			})
		.then(val5 => {
			val5.msg.push('sending server response');
			val5.status=200;
			console.log(val5.msg);
			res.status(val5.status).json(val5); //send response
		});
	};

exports.geoPing = geoPing;
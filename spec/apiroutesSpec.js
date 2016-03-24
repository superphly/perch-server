
var frisby = require('frisby');
var apiroutes = require('../app/api/v1/apiroutes.js');
apiroutes.apiAuth = function(req, res, next) {return next()};
var domain = 'http://localhost:8080'

frisby.create('Get basic API')
	.get(domain+'/api/v1/')
	.expectStatus(200)
	.toss();

frisby.create('Get docs test')
	.get(domain+'/api/v1/help')
	.expectStatus(200)
	.toss();

describe("Authentication should be required here.", function() {



	frisby.create('Post a ping. Should get locations back.')
		.post(domain+'/api/v1/ping',
			{
				user: "John Backes",
				timestamp: Math.floor(new Date() / 1000),
				macAddress: ["5c:a3:9d:18:f:1a", "0:1c:23:e2:9a:44"],
				SSID: "Joule Lobby",
				token: "oiwejfoiwjefoiwejf"
			})
		.expectStatus(200)
		.inspectBody()
		.expectJSONTypes({
			location 	: {
				possibleLocs : Array }
		})
		.toss();


})


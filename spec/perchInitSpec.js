var request = require('request');

var base_url = "http://localhost:8080/";

describe("start Perched server", function () {

	describe("server up at GET /", function () {
		it("returns status code 200", function () {
			request.get(base_url, function(error, response, body) {
				expect(response.statusCode).toBe(200);
				done();
			});
		});
	});
});
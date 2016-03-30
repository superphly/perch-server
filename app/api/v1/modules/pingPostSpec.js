//pingPostSpec

"use strict";

function require(val){};

describe("Jasmine is working", function(){
	it("expect _jasmineWorking_ to be true", function(){
		expect(jasmineWorking).toBe(true);
	});
});

describe("Create a new Geographic query", function(){
	beforeEach(function(){
		let lat = 52;
		let lng = -25;
		let maxDistance = 8000;
		let spherical = true;
		let testGeoQuery = new geoQuery(lat, lng);
		let testGeoOptions = {
			maxDistance: maxDistance,
			spherical: spherical
		};
		testGeoQuery = testGeoQuery.geoNearOptions(testGeoOptions);
	});
	it("create a new object with coords x, y (should be an array), and empty set of options", function(){
		expect(typeof testGeoQuery.coords[0]).toBe("number");
		expect(typeof testGeoQuery.coords[1]).toBe("number");
		expect(typeof testGeoQuery.options).toBe("object");
	});
	it("lat of " + lat + " and lng of " + lng + " should pass to testGeoQuery.", function(){
		expect(testGeoQuery.coords).toBe([52,-25]); //coordinates should be an array.
	});
	it("GeoGraphic Query Options must have maxDistance", function() {
		expect(typeof testGeoQuery.options.maxDistance).toBe("number");
	});
	it("Max Distance should be 5 miles (8000 meters)", function() {
		expect(testGeoQuery.options.maxDistance).toBe(8000)
	});
	it("set Geographic Query Options", function() {
		it("An options object is passed to the query", function(){
			expect(JSON.stringify(testGeoQuery.options) === JSON.stringify(testGeoOptions)).toBe(true);
		});
	});
});

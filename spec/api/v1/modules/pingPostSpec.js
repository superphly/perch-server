//pingPostSpec

"use strict";

//context constructor
function Context(dependencies) {
	let currentKeys = [];
	try{
		let context = {};
		dependencies.forEach(function(element, index, array){
			let oldContext = context;
			Object.assign(context, element(oldContext));
			currentKeys.push(Object.keys(context));
		});

		return context;
	} catch(e){console.log(e, currentKeys)};
};



//contexts

function envSetup(oldContext) {

	let context = (typeof oldContext == 'object') ? Object.create(oldContext) : {};
		//requires
		context.rewire = require('rewire');
		context.pingPost = context.rewire('../../../../app/api/v1/modules/pingPost.js');
		context.get = function(property) {return context[property]};
		//return context
		return context;
};

function geoQueryContext(oldContext) {
	//requires
	let context = (typeof oldContext === 'object') ? Object.create(oldContext) : {};

	//environment setup
		context.User = "";
		context.geoQuery = getFunction("geoQuery");
		context.lat = 52;
		context.lng = -25;
		context.maxDistance = 8000;
		context.collection = "User";
		context.spherical = true;
		context.testGeoQuery = new context.geoQuery(context.lat, context.lng);
		context.testGeoOptions = {
			maxDistance: context.maxDistance,
			spherical: context.spherical,
			collection: context.collection
		};
		context.testGeoQuery = context.testGeoQuery.geoNearOptions(context.testGeoOptions);
	return context;
};

function getFunction(funcName) {return envSetup().get("pingPost").__get__(funcName)};

function userQueryContext(oldContext) {

	//requires
	let context = (typeof oldContext === 'object') ? Object.create(oldContext) : {};

	return context;


};

// ======= pingPost Test Suite ==============//
describe("Testing pingPost.js.\n...", function(){

	describe("Jasmine is working.\n", function(){
		//before
		beforeEach(function() {
			this.context = new Context([envSetup]);
		});
		//assertions
		it("...expect _jasmineWorking_ to be true.\n", function(){
			//let jasmineWorking = this.env.pingPost.__get__("jasmineWorking");
			expect(this.context.pingPost.__get__("jasmineWorking")).toBe(true);
		});
	});

	//run tests

	describe("Create a new GeoNear query.", function(){
		beforeEach(function(){
			//this.context = new geoQueryContext();
			this.context = new Context([envSetup, geoQueryContext])
		});

		it("create a new object with coords x, y (should be an array), and empty set of options", function(){
			expect(typeof this.context.testGeoQuery.coords[0]).toBe("number");
			expect(typeof this.context.testGeoQuery.coords[1]).toBe("number");
			expect(typeof this.context.testGeoQuery.options).toBe("object");
		});
		it("lat and lng should pass to testGeoQuery.", function(){
			expect(this.context.testGeoQuery.coords[0]).toBe(52); //coordinates should be an array.
			expect(this.context.testGeoQuery.coords[1]).toBe(-25); //coordinates should be an array.
		});
		it("should have the property GeoNearOptions", function(){
			expect(typeof this.context.testGeoQuery.geoNearOptions).toBe('function');
		});
		it("GeoGraphic Query Options must have maxDistance", function() {
			expect(typeof this.context.testGeoQuery.options.maxDistance).toBe("number");
		});
		it("Max Distance should be 5 miles (8000 meters)", function() {
			expect(this.context.testGeoQuery.options.maxDistance).toBe(8000)
		});
		it("An options object is passed to the query", function(){
			expect(JSON.stringify(this.context.testGeoQuery.options) === JSON.stringify(this.context.testGeoOptions)).toBe(true);
		});
		it("The collection should be 'User'", function(){
			expect(this.context.testGeoQuery.options.collection).toBe("User");
		});
	});

	describe("Return Nearby Users with getNearbyUsers function", function() {

		beforeEach(function(){
			this.context = new Context([envSetup, geoQueryContext, userQueryContext])

		});
		it("should have the function returnUsers", function(){
			expect(typeof this.context.testGeoQuery.returnUsers).toBe('function');
		});
		it("the getNearbyUsers function should not throw an error", function() {
			expect(this.context.testGeoQuery.returnUsers()).not.toThrow();
		});
		it("the function should be an array", function() {
			expect(this.context.testGeoQuery.returnUsers().isArray()).toBe('true');
		});
	});

});
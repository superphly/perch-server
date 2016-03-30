// app/models/location.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our ping model
var locationSchema = mongoose.Schema({

    wifi      : {
    	macAddress	: 	String,
    	SSID 		: 	String,
    	acc 	 	: 	Number,
    	lat 		: 	Number,
    	lng 		: 	Number
    	},
    location 		: { 
    	name 	: String, 
    	id 		: String, 
    	types 	: Array,
    	icon 	: String,
    	vicinity: String,
    	geometry: {
    		location: 		{
    			lat 	: 	Number,
    			lng 	: 	Number
    		}
    	},
    	reference: String,
    	scope: 	String,
    	opening_hours 	: 	Object,
    	rating 			: 	Number,
    	price_level 	: 	Number,
    	photos 			: 	Array
    },
    alternateLocs 	: Array,
    createDate      : { type : Date, default: Date.now },
    createdBy 		: String


});

// create the model for users and expose it to our app
module.exports = mongoose.model('Location', locationSchema);
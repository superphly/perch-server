// app/models/ping.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our ping model
var pingSchema = mongoose.Schema({

    user            : String, //replace this with user id
    timestamp       : { type : Date, default: Date.now },
    macAddress      : String,
    SSID            : String


});

// methods ======================
// match ping to location
pingSchema.methods.findLocation = function(macAddress, SSID) {
    // get the API key
    app.get('/ping/location', function(req, res) {
        var apiKey = require('../config/env/auth.js').geoLocAPI.key;
        var options = {
            host  :  'www.googleapis.com',
            path    : '/geolocation/v1/geolocate?key=' + apiKey,
            method  :   'POST',
            port: 80

        }
        var request = http.request(options, function(response){
            var body = "";
            response.on('data', function(data) {
                body += data;
            });
            response.on('end', function() {
                res.send(JSON.parse(body));
            });
        });
        
        request.on('error', function(e) {
            console.log('Problem with request: ' + e.message);
        });
        request.end();
    });
};

// find nearby users
pingSchema.methods.findUsers = function(radius) {
    // stuff
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Ping', pingSchema);
// config/auth-heroku.js

//this file is safe for git deployments and heroku, and refers to the global configuration variables.

module.exports = {

    'facebookAuth' : {
        'clientID'      : process.env.facebookClientID, // your App ID
        'clientSecret'  : process.env.facebookClientSecret, // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : process.env.twitterConsumerKey,
        'consumerSecret'    : process.env.twitterConsumerSecret,
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : process.env.googleClientID,
        'clientSecret'  : process.env.googleClientSecret,
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    },

    'geoLocAPI' : {
        'key'           : process.env.geoLocAPIKey
    },

    mongooseURI : process.env.mongooseURI

};
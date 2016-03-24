// ============!!!!!!!==========================
// NOTE: THERE'S A LOT ON THIS PAGE THAT NEEDS TO CHANGE
// ===== passport setup needs to use token-based authentication rather than session-based
// ============!!!!!!!=========================


// app/routes.js
module.exports = function(app, passport, express) {



    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        //res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        //res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        //res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // appAuth.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        /*res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });*/
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// ===== AUTHENTICATION APIS =============================

    var appAuth = express.Router();

// ===== LOCAL ============================================

    // AUTHORIZE EMAIL --------------------------------

        appAuth.get('/connect/local', function(req, res) {
            //res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        appAuth.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // UNLINK EMAIL --------------------------------------
    appAuth.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

// ===== FACEBOOK =========================================


    // AUTHENTICATE WITH FACEBOOK =====================

    // route for facebook authentication and login
    appAuth.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    appAuth.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

    // AUTHORIZE FACEBOOK -------------------------------

        // send to facebook to do the authentication
        appAuth.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        appAuth.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // UNLINK FACEBOOK ------------------------------------------

    appAuth.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


// ===== TWITTER ROUTES ========================================

    // =====================================
    // AUTHENTICATE WITH TWITTER ======================
    // =====================================
    // route for twitter authentication and login
    appAuth.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    appAuth.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

    // AUTHORIZE TWITTER --------------------------------

        // send to twitter to do the authentication
        appAuth.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        appAuth.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // UNLINK TWITTER --------------------------------

    appAuth.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });



// ===== GOOGLE ROUTES ===========================================


    // AUTHENTICATE WITH GOOGLE =======================

    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    appAuth.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    appAuth.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/',
                    failureRedirect : '/'
            }));

    // AUTHORIZE GOOGLE ---------------------------------

        // send to google to do the authentication
        appAuth.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        appAuth.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

        // UNLINK GOOGLE ----------------------------------

    appAuth.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api/v1', appAuth);

};



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
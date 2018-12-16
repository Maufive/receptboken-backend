const passport = require("passport");
const passportJWT = require('passport-jwt');
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('./models/User');
require("dotenv").config({ path: "./variables.env" });

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SECRET
}, function(jwtPayload, callback) {
	// find the user in the db if needed. 
	return User.findById(jwtPayload.id)
	.then(user => {
		return callback(null, user);
	})
	.catch(err => {
		return callback(err)
	});
}));
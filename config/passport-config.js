var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('../models/User');
var settings = require('./settings');

module.exports = function(passport) {
    var options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    options.secretOrKey = settings.secret;
    passport.use(new JwtStrategy(options, function(payload, done) {
        User.findOne({id: payload.id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};
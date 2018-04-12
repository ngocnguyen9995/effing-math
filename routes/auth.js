var mongoose = require('mongoose');
var passport = require('passport');
var settings = require('../config/settings');
require('../config/passport-config')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require('../models/User');

// route: api/auth/register -- register new user
router.post('/register', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({
            success: false,
            msg: 'Error: Username or Password is empty!'
        });
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password
        });
    }

    // save new user
    newUser.save(function(err) {
        if (err)  {
            return res.json({
                success: false,
                msg: 'Username already exists, please pick another username.'
            });
        }
        res.json({
            success: true,
            msg: 'New user registered'
        });
    });
});

// route: api/auth/login -- logging in
router.post('/login', function(req, res) {
    User.findOne(
        { username: req.body.username },
        function(err, user) {
            if (err) throw err;

            if (!user) {
                console.log("Wrong username");
                res.status(401).send({
                    success: false,
                    msg: 'Wrong username'
                });
            }
            else {
                user.comparePassword(req.body.password, function(err, isMatch) {
                    if (isMatch && !err) {
                        console.log("signed in, good");
                        var token = jwt.sign(user.toJSON(), settings.secret);
                        res.json({
                            success: true,
                            token: 'JWT ' + token
                        });
                    }
                    else {
                        console.log("Wrong pass");
                        res.status(401).send({
                            success: false,
                            msg: 'Wrong password'
                        });
                    }
                });
            }
        }
    );
});

module.exports = router;
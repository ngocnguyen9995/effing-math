var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport-config')(passport);
var User = require('../models/User');

// APIs
router.get('/', passport.authenticate('jwt', { session: false }), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        console.log("Success, game on");
    } else {
        return res.status(403).send({
            success: false,
            msg: 'Unauthorized'
        });
    }
});

router.get('/leaderboard', function(req, res){
    User.find({})
        .sort({highscore: -1})
        .limit(10)
        .exec(cb = (err, result) => {
            if (err) throw err;
            if (!result) {
                res.status(500).send({
                    success: false,
                    msg: 'Server error'
                })
            } else {
                let scoreMap = [];
                result.forEach((user) => {
                    let entry = {};
                    entry['Username'] = user.username;
                    entry['Highscore'] = user.highscore;
                    scoreMap.push(entry);
                });
                res.json({
                    success: true,
                    msg: 'Returning leaderboard',
                    leaderboard: scoreMap
                });
            }
        });
    
});

router.get('/user/:username', function(req, res){
    const reqUsername = req.params.username;
    User.findOne(
        { username: reqUsername },
        function(err, user) {
            if (err) throw err;
            if (!user) {
                res.status(404).send({
                    success: false,
                    msg: 'No such username ' + reqUsername,
                    request: req.params
                });
            } else {
                const reqUsername = user.username;
                const reqHighScore = user.highscore;
                res.json({
                    success: true,
                    username: reqUsername,
                    highscore: reqHighScore
                });
            }
        }
    );
});

router.post('/gameover', function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        
        User.update(
            { username: req.body.username },
            { $set: { highscore: req.body.score }},
            function (err, raw) {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        msg: 'Server error, raw response: ' + raw 
                    });
                } else {
                    console.log("Success, updating highscore");
                    return res.status(200).send({
                        succes: true,
                        msg: 'Updated'
                    })
                }
            }
        );
    } else {
        return res.status(403).send({
            success: false,
            msg: 'Unauthorized'
        });
    }
});

getToken = (headers) => {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        }
        return null;
    }
    return null;
};

module.exports = router;
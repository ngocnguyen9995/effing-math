var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport-config')(passport);
var User = require('../models/User');

// Game page
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
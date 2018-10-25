const jwt = require('jsonwebtoken');

const User = require('../models/User');
const config = require('../config');


const tokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.sign({ sub: user.id, iat: timestamp }, config.secret);
}


exports.signup = (req, res, next) => {
    const { email, password} = req.body;

    if(!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password' });
    }

    //See if a user with the given email exists
    User.findOne({ email }, (err, existingUser) => {
        if(err) { return next(err); }

        // If a user with email does exist, return an error
        if(existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        }

        // If a user with email does NOT exist, create and save user record
        const user = new User({
            email,
            password
        });

        user.save((err) => {
            if (err) { return next(err); }

            // Respond to request indicating the user was created
            res.json({ token: tokenForUser(user) }); 
        });

        

    });
    
}

exports.signin = (req, res, next) => {
    // User has already had their email and password auth'd
    // We just need to given them a token
    res.send({ token: tokenForUser(req.user) });
}
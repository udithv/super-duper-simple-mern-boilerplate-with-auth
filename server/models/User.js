const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: String
});

// On Save Hook , encrypt password
// Before saving this model run this function.
userSchema.pre('save', function (next) {
    // get access to the user model

    const user = this;
    // generate a salt then run callback
    bcrypt.genSalt(10, (err, salt) => {
        if(err) { return next(err); }

        // hash (encrypt) our password using salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) { return next(err); }

            // overwrite plain text password with encrypted password
            user.password = hash;
            next();

        });
    });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if(err) { return callback(err); }

        callback(null, isMatch);
    });
}

// Create a model class
const User = mongoose.model('user', userSchema);

//Export the model
module.exports = User;


const bcrypt = require('bcrypt')
const User = require("./models/UserModel")
const localStrategy = require('passport-local')

module.exports = function (passport) {
    passport.use(
        new localStrategy((username, password, done) => {
            try {
                User.findOne({ username: username }, (err, user) => {
                    if (err) throw err;
                    if (!user) return done(null, false);
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (err) throw err;
                        if (result === true) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    });
                });
            } catch (e) {
                res.status(400).send({ message: 'Database error' })
            }
        })
    );

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });
    passport.deserializeUser((id, cb) => {
        User.findOne({ _id: id }, (err, user) => {
            cb(err, user);
        });
    });
};
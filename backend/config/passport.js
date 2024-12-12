const { Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const configurePassport = (passport) => {
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    };

    passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
        try {
            const user = await User.findById(payload._id);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (err) {
            return done(err, false);
        }
    })
    );
};

module.exports = configurePassport;
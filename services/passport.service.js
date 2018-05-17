const passport = require('passport');
const keys = (process.env.NODE_ENV ? require('../environments/environment.prod') : require('../environments/environment.dev')).keys;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

// Get the users collection from the database
const User = mongoose.model('users');

// Define the serialize function for passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Define the de-serialize function for passport
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback',
  proxy: true
},
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ googleId: profile.id })
    if (existingUser) {
      return done(null, existingUser);
    }
    const user = await new User({ googleId: profile.id }).save()
    done(null, user);
  }
));
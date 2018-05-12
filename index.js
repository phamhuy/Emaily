const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const env = (process.env.NODE_ENV ? require('./environments/environment.prod') : require('./environments/environment.dev'));
require('./models/User');
require('./services/passport.service');
const app = express();

// Connecting to MongoDB
mongoose.connect(env.mongoURI);

// Enable cookie sessions
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [env.keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
const auth_routes = require('./routes/auth.routes');
const temp_routes = require('./routes/temp.routes');
app.use('/auth/google/', auth_routes);
app.use('/', temp_routes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
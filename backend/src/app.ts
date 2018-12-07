import express from 'express';
import passport from 'passport';
import passportTwitter from 'passport-twitter';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoConnect from 'connect-mongo';
import mongoose from 'mongoose';
import path from 'path';
const MongoStore = MongoConnect(session);

// Mongo models
import { User, IUserModel } from './schemas/user';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.get('/', (req, res) => res.sendFile(path.resolve() + '/public/'));
app.use('/static', express.static(path.resolve() + '/public/static/'));

// Session Handling
app.use(cookieParser());
const mongoURL = `mongodb://flxwu:${
  process.env.MLAB_PASSWORD
}@ds125574.mlab.com:25574/twitter-notifications-inbox`;
app.use(
  session({
    secret: 'foo',
    store: new MongoStore({
      url: mongoURL
    }),
    resave: true,
    saveUninitialized: true
  })
);

// MongoDB
mongoose.connect(mongoURL);
const db = mongoose.connection;
db.on('error', () => console.error('test'));

// PassportJS Twitter Signup
const TwitterStrategy = passportTwitter.Strategy;
passport.serializeUser((user: IUserModel, done: Function) => {
  done(null, user);
});

passport.deserializeUser((user: IUserModel, done: Function) => {
  done(null, user);
});
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: 'http://localhost:5000/auth/callback'
    },
    function(token: String, tokenSecret: String, profile, cb: Function) {
      const newUser = new User({ name: profile.username, token, tokenSecret });
      updateUser(newUser, cb);
    }
  )
);

const updateUser = (user: IUserModel, cb: Function) => {
  User.find({ name: user.name }, function(err, docs) {
    if (!docs.length) {
      user.save(err =>
        err
          ? console.error('Error while saving:', err)
          : console.log('Successfully saved ', user.name)
      );
    }
    return cb(null, user);
  });
};

app.get('/auth', passport.authenticate('twitter'));

app.get('/auth/callback', passport.authenticate('twitter'), function(req, res) {
  console.log(req.user);
  // Successful authentication, redirect home.
  res.redirect('/');
});

export default app;

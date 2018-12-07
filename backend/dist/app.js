"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_twitter_1 = __importDefault(require("passport-twitter"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const MongoStore = connect_mongo_1.default(express_session_1.default);
// Mongo models
const user_1 = require("./schemas/user");
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(morgan_1.default('dev'));
app.use(express_1.default.static(path_1.default.resolve() + '/public/'));
// Session Handling
app.use(cookie_parser_1.default());
const mongoURL = `mongodb://flxwu:${process.env.MLAB_PASSWORD}@ds125574.mlab.com:25574/twitter-notifications-inbox`;
app.use(express_session_1.default({
    secret: 'foo',
    store: new MongoStore({
        url: mongoURL
    }),
    resave: true,
    saveUninitialized: true
}));
// MongoDB
mongoose_1.default.connect(mongoURL);
const db = mongoose_1.default.connection;
db.on('error', () => console.error('test'));
// PassportJS Twitter Signup
const TwitterStrategy = passport_twitter_1.default.Strategy;
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
passport_1.default.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: 'http://localhost:5000/auth/callback'
}, function (token, tokenSecret, profile, cb) {
    const newUser = new user_1.User({ name: profile.username, token, tokenSecret });
    updateUser(newUser, cb);
}));
const updateUser = (user, cb) => {
    user_1.User.find({ name: user.name }, function (err, docs) {
        if (!docs.length) {
            user.save(err => err
                ? console.error('Error while saving:', err)
                : console.log('Successfully saved ', user.name));
        }
        return cb(null, user);
    });
};
app.get('/auth', passport_1.default.authenticate('twitter'));
app.get('/auth/callback', passport_1.default.authenticate('twitter'), function (req, res) {
    console.log(req.user);
    // Successful authentication, redirect home.
    res.redirect('/');
});
exports.default = app;
//# sourceMappingURL=app.js.map
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const { User, Agency } = require('../models/database');
const MongoStore = require('connect-mongo');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function (app) {

    // setting up express session
    app.use(session({
        secret: process.env.SECRET_STRING,
        resave: false, //resaves a session even if no changes were made
        saveUninitialized: false, //saves a cookie when it is new but unmodified. false is good for gdpr compliance and logins.
        cookie: {
            path: '/',
            secure: "auto",  // this will set to false on developement, but true on Heroku since is https so this setting is required
            maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
            sameSite: process.env.COOKIE_SAME_SITE, //by default in developement this is false if you're in developement mode
        
        },

        store: MongoStore.create({
            mongoUrl: process.env.DB_PATH,
            ttl: 14 * 24 * 60 * 60, //14 days
            crypto: {
                secret: process.env.SECRET_STRING,
            }
        })
    }));

    //setting up passport
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        const type = req.body.type;
        
        if (type === 'agency') {
            Agency.authenticate()(email, password, done); // This comes from passport-local-mongoose and handles password comparison for you
        } 
        else { // Assuming here that if it's not 'agency', it'll be 'user'
          User.authenticate()(email, password, done);
        }
    }
    ));

    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        }, async function (accessToken, refreshToken, profile, cb) {
            try {
                const user = await User.findOne({ googleId: profile._json.sub },{chatBots: 0});
                
                // console.log(profile._json)
                if (!user) {
                    const newUser = new User({
                        googleId: profile._json.sub,
                        name: profile._json.name,
                        givenName: profile._json.given_name,
                        familyName: profile._json.family_name,
                        picture: profile._json.picture,
                        email: profile._json.email,
                        emailVerified: profile._json.email_verified,
                        locale: profile._json.locale,
                        totalConversations: 30,
                        usedConversations: 0,
                        plan: 'free'
                    })
                    await newUser.save()
                    return cb(null,  newUser);
                }
                else if (user) {
                    return cb(null,  user);
                }
            }
            catch (err) {
                return cb(err);
            }
        }
    ));

    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            if (user instanceof User) {
                cb(null, { id: user.id, type: 'user' });
            } else if (user instanceof Agency) {
                cb(null, { id: user.id, type: 'agency' });
            }
        });
    });


    passport.deserializeUser((user, done) => {
        if (user.type === 'user') {
            User.findById(user.id)
                .then(user => {
                    done(null, { id: user.id, type: 'user' });
                })
                .catch(err => {
                    console.log(err)
                    done(new Error("Failed to deserialize an user"));
                });
        }
        else if (user.type === 'agency') {
            Agency.findById(user.id)
                .then(agency => done(null, { id: agency.id, type: 'agency' }))
                .catch(err => {
                    console.log(err),
                        done(err)
                });
        }
    });
}
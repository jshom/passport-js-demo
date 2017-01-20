const express = require('express')
const session = require('express-session')
const app = express()
const passport = require('passport')
const bodyParser = require('body-parser')
const passportSession = require('passport-session')
const cookieParser = require('cookie-parser')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;


app.set('trust proxy', 1)
app.use(cookieParser())
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized : true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended : false }))

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  done(null, id)
})

passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username === 'JACOB' && password === 'SHOM') {
      return done(null, {username, password})
    } else {
      return done(null, false)
    }
  }
))

passport.use(new GoogleStrategy({
    clientID            : "599844124264-0l0qasvi0ql9rmv1vqdf78prtvkjq1mv.apps.googleusercontent.com",
    clientSecret        : "5EPoNILjwvgeXltYw40Nio-n",
    callbackURL         : "https://496bdcf5.eu.ngrok.io/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(err, profile);
  }
));

const pug = require('pug')
app.listen(3200)
app.set('view engine', 'pug')

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/google', (req, res) => {
  res.render('google')
})

// app.post('/login', (req, res) => {
//   res.send(req.body)
// })

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/success' }))

app.post('/google', passport.authenticate('google', { failureRedirect: '/google', successRedirect: '/success', scope: [ 'https://www.googleapis.com/auth/plus.login' ] }))

app.get('/success', (req, res) => {
  res.send('success')
})

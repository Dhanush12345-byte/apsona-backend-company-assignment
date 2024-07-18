const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const User = require('./models/user');
const Note = require('./models/note');

const app = express();
mongoose.connect('mongodb://localhost:27017/note_app', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'noteappsecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) return res.status(500).send(err);
    passport.authenticate('local')(req, res, () => {
      res.status(200).send('Registered successfully');
    });
  });
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).send('Logged in successfully');
});

app.post('/logout', (req, res) => {
  req.logout();
  res.status(200).send('Logged out successfully');
});

app.post('/note', isLoggedIn, (req, res) => {
  const { title, content, tags, color, reminder } = req.body;
  const note = new Note({
    title,
    content,
    tags,
    color,
    reminder,
    user: req.user._id
  });
  note.save((err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Note saved successfully');
  });
});

app.get('/notes', isLoggedIn, (req, res) => {
  Note.find({ user: req.user._id }, (err, notes) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(notes);
  });
});

app.get('/note/:id', isLoggedIn, (req, res) => {
  Note.findById(req.params.id, (err, note) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(note);
  });
});

app.put('/note/:id', isLoggedIn, (req, res) => {
  Note.findByIdAndUpdate(req.params.id, req.body, (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Note updated successfully');
  });
});

app.delete('/note/:id', isLoggedIn, (req, res) => {
  Note.findByIdAndRemove(req.params.id, (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Note deleted successfully');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).send('Unauthorized');
}

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import expressSession from 'express-session';
import users from './users.js';
import auth from './auth.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = process.env.port || 3000;

const sessionConfig = {
  secret: process.env.SECRET || 'SECRET',
  resave: false,
  saveUninitialized: false,
};

app.use(expressSession(sessionConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('client'));
app.use(logger('dev'));
app.use('/', express.static('client'));
auth.configure(app);

function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('Login to use this protected service.');
  }
}



// app.post('/uploadFile', checkLoggedIn, async (req, res) => {
//   res.send('IT sort of works')
// });

// app.get('/loadHTML', checkLoggedIn, async (req, res) => {

// });

// app.post('/updateFile', checkLoggedIn, async (req, res) => {

// });

// app.get('/loadFile', checkLoggedIn, async (req, res) => {

// });

// app.get('/userFiles', checkLoggedIn, async (req, res) => {

// });

app.get('/isAuthenticated', checkLoggedIn, async (res, req) => {
  res.status(200).send('ok');
});

// app.post('/login', async (req, res) => {
//   auth.authenticate('local', {
//     // use username/password authentication
//     successRedirect: '/', // when we login, go to /private
//     failureRedirect: '/', // otherwise, back to login
//   })
// });

app.post('/login', 
  await auth.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.post('/register', async (req, res) => {

});

app.get('/logout', (req, res) => {
  req.logout();
  req.status(200).send(JSON.stringify('ok'));
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
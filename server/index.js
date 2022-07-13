import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import expressSession from 'express-session';
import users from './users.js';
import auth from './auth.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import fileUpload from 'express-fileupload';
import database from './database.js';
import convert from './converter.js';

const app = express();
const port = process.env.port || 3000;

const sessionConfig = {
  secret: process.env.SECRET || 'SECRET',
  resave: false,
  saveUninitialized: false,
};

app.use(logger('dev'));
app.use('/', express.static('client'));
app.use(fileUpload());
app.use(expressSession(sessionConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('client'));
auth.configure(app);

function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('Login to use this protected service.');
  }
}



app.post('/uploadFile', checkLoggedIn, async (req, res) => {
  let file_name = req.files.upload.name;
  await req.files.upload.mv(`./server/userfiles/${req.user}/${file_name}`, (error) => console.log(error));
  await database.addFile(req.user, file_name);
  res.redirect('/')
});

app.get('/loadHTML', checkLoggedIn, async (req, res) => {
  let file = req.query.file;
  let extension = path.extname(file);
  let file_path = `./server/userfiles/${req.user}/${file}`;
  let ret = await convert(file_path, extension);
  let tmp_path = `./server/userfiles/${req.user}/${path.basename(file, extension)}.html`;
  fs.writeFileSync(tmp_path, ret, err => {if (err) { throw err; }});
  res.sendFile(`${path.resolve()}/server/userfiles/${req.user}/${path.basename(file, extension)}.html`);
});

// app.post('/updateFile', checkLoggedIn, async (req, res) => {

// });

// app.get('/loadFile', checkLoggedIn, async (req, res) => {

// });

app.get('/userFiles', checkLoggedIn, async (req, res) => {
  let files = await database.getFileNames(req.user);
  let ret = files.rows[0].filenames === null ? [] : files.rows[0].filenames;
  res.send(ret);
});

app.get('/userName', async (req, res) => {
  res.status(200).send({ username: req.user });
});

app.get('/isAuthenticated', async (req, res) => {
  if (req.user !== undefined) {
    res.status(200);
    res.send('ok');
  } else {
    res.status(401);
    res.send('not authorized');
  }
});

app.post('/login', 
  await auth.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    res.send('authenticated');
  });

  app.post('/register', async (req, res) => {
    const { username, password } = req.query;
    if (await users.addUser(username, password)) {
      await fs.mkdir(`./server/userfiles/${username}`, { recursive: true }, (err) => {
        if (err) throw err;
      });
      res.status(201);
      res.send('created');
    } else {
      res.status(401);
      res.send('user not created');
    }
  });

app.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if(err) return next(err);
    res.redirect("/");
  });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
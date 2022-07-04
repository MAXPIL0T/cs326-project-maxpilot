import express from 'express';
import logger from 'morgan';

const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use('/', express.static('client'));

app.post('/uploadFile', async (req, res) => {

});

app.get('/loadHTML', async (req, res) => {

});

app.post('/updateFile', async (req, res) => {

});

app.get('/loadFile', async (req, res) => {

});

app.get('/userFiles', async (req, res) => {

});

app.get('/isAuthenticated', async (res, req) => {

});

app.post('/login', async (req, res) => {

});

app.post('/register', async (req, res) => {

});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');

const app = express();

app.use(bodyParser.json());
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello po sainyo!');
});

app.get('/blog', (req, res)=> {
    res.send('Yoooo blog!');
});

module.exports = app;
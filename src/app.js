const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send({message: 'Welcome to the default endpoint'});
});

module.exports = app;
'user strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const util = require('util');

//Initialize the port where the server should listen
const port = 5001;

//Use bodyParser to read the data in the form of json
app.use(bodyParser.json());

//Handle routing
app.use('/', require('./routes/users'));

//Listen on declared port
app.listen(port, () => console.log(`Server is listening on the port ${port}`));

//Add client to the request so that, services can use to access the database
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    // req.query = query;
    next();
});

//Catch errors
app.use((err,req, res) => {
    const status = err.status || 500;
    console.log(`Error ${status} (${err.message}) on ${req.method} ${req.url} with payload ${req.body}.`);
    res.status(status).send({ status, error: 'Server error' });
});

module.exports = app;
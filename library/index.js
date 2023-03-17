var express = require('express');
var dotenv = require('dotenv');
dotenv.config();
var app = express();
var port = process.env.PORT;
app.get('/', function (req, res) {
    res.send('hello');
});
app.listen(port, function () {
    console.log("Listening on ".concat(port));
});

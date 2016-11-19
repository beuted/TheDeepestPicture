var express = require('express');

var app = express();
var port = process.env.PORT || 3000;


// declare routes
app.use(express.static('public'));

app.use(function (error, request, response, next) {
    console.error(error.stack);
    response.status(400).send(error.message);
});

app.listen(port, function() {
    console.log('The Deepest Picture is running at localhost:' + port);
});


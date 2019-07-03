var express = require('express');
var app = express();

// Static serve options
var options = {
    index: 'index.html'
};

// Static serve dist directory on root
app.use('/', express.static('src', options));

app.listen(3000);
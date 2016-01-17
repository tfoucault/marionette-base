// Require libraries for server
var express = require('express');
var app = express();

// Require file with mocked datas
var datas = require('./mock-datas');

// Require useful library
var _ = require('lodash');
var path = require('path');

// ==> Mocking our server side pagination
app.get('/test/data', function (req, res) {

    var pageSize = req.query.page_size;
    var currentPage = req.query.current_page;
    var chunkedArray;

    if(typeof(pageSize) != 'undefined' && pageSize != null) {
        chunkedArray = _.chunk(datas, pageSize);
    } else {
        chunkedArray = _.chunk(datas, 10);
    }

    // Headers for pagination informations
    var totalPages = Math.floor(datas.length / pageSize);
    if(datas.length % pageSize > 0) {
        ++totalPages;
    }

    res.set('Total-Pages', totalPages);
    res.set('Current-Page', currentPage);

    res.json(chunkedArray[currentPage - 1]);
});

// Serves the main file index.html
app.get('/', function (req, res) {
    "use strict";

    res.sendFile(path.join(__dirname + '../../public/index.html'));
});

// Set directory base for static files to serve (relative to index)
app.use(express.static('public'));

// Starts our express server !
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
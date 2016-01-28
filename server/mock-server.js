// Require libraries for server
var express = require('express');
var app = express();

// Require file with mocked datas
var datas = require('./mock-datas');

// Require useful library
var _ = require('lodash');
var path = require('path');

// Default page size
var DEFAUL_PAGE_SIZE = 10;

// ==> Mocking our server side pagination
app.get('/test/data', function (req, res) {

    // Get the query param
    var order = req.query.order;
    var sortKey = req.query.sort_key;

    // If sort key and sort order are defined, sort datas
    if(typeof(sortKey) != 'undefined' && sortKey != null
        && typeof(order) != 'undefined' && order != null) {

        datas = _.orderBy(datas, [sortKey], [order]);
    }

    var pageSize = req.query.page_size;
    var currentPage = req.query.current_page;

    // If pagination is required
    if(typeof(currentPage) != 'undefined' && currentPage != null) {

        // Data to return
        var chunkedArray;

        // If no page size defined, apply our default page size
        if(typeof(pageSize) == 'undefined' || pageSize == null) {
            pageSize = DEFAUL_PAGE_SIZE;
        }

        // Header to give information about total page count
        var totalPages = Math.floor(datas.length / pageSize);
        if(datas.length % pageSize > 0) {
            ++totalPages;
        }
        res.set('Page-Count', totalPages);
        res.set('Current-Page', currentPage);

        chunkedArray = _.chunk(datas, pageSize);
        res.json(chunkedArray[currentPage - 1]);

    } else {
        // No pagination
        res.json(datas);
    }
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

/**
 * Utility function
 */


/**
 * Created by tfoucault on 10/12/2015.
 */

define(['marionette','backbone.radio','../views/table-view'], function(Marionette, Radio, TableView) {
    "use strict";

    /**
     * Default values for table params
     */
    var DEFAULT_PAGINATION_INTERVAL = 5;

    var tableChannel = Radio.channel('table');

    var TableController = Marionette.Object.extend({

        initialize: function() {

            this.tables = {};

            this.listenTo(tableChannel, 'init', this.init);
            this.listenTo(tableChannel, 'sort', this.sort);
        },

        init: function(params) {

            // Copy of option to keep a ref
            var tableOptions = _.clone(params.options);

            // Check that if columns are described, all
            // have a label to display, otherwise, dont
            // display any headers and display an error

            if(params.options.columns) {
                if((_.pluck(params.options.columns, 'label')).length === params.options.columns.length) {
                    tableOptions.columns.hasLabels = true;
                } else {
                    console.log('Columns configuration is not valid. All columns need a label !');
                }

                if((_.pluck(params.options.columns, 'target')).length === params.options.columns.length) {
                    tableOptions.columns.hasTargets = true;
                } else {
                    console.log('Columns configuration is not valid. All columns need a target !');
                }
            } else {
                tableOptions.columns = {};
            }

            // Pagination options
            if(params.options.pagination) {

                // Check interval
                if(!params.options.pagination.interval) {
                    tableOptions.pagination.interval = DEFAULT_PAGINATION_INTERVAL;
                }
            } else {
                // Default pagination params
                tableOptions.pagination = {
                    interval: DEFAULT_PAGINATION_INTERVAL
                };
            }

            // Get region where to display table
            var tableRegion = params.region;

            // Get collection linked to this table
            var tableCollection = params.collection;

            // Keep reference on this
            var _this = this;

            /* When collection is fetched, show the populated paginated table
             -- If we use fetch on pageable collection, it get the page which
             is defined in the pageable collection, by order of prioroty :
             1 - state.currentPage if defined
             2 - state.firstPage if defined and currentPage not defined
             3 - default value 1 if firstPage and currentPage not defined
             -- If we want to get an other page, we should replace fetch() by
             getPage(pageNumber) where pageNumber is the page we want to have
            */

            tableCollection.fetch().done(function(collection, status, response) {

                var interval = tableOptions.pagination.interval;
                var pageNumber = parseInt(response.getResponseHeader('Current-Page'));
                var totalPages = parseInt(response.getResponseHeader('Total-Pages'));
                var intervalNumber = Math.ceil(pageNumber / interval);
                var intervalMin = (intervalNumber-1) * interval + 1;
                var intervalMax = intervalNumber * interval;
                tableOptions.pagination.pages = [];

                for(var i=intervalMin; i<=intervalMax && i<= totalPages; ++i) {
                    tableOptions.pagination.pages.push({
                        label: i,
                        value: i,
                        current: i == pageNumber ? true : false
                    });
                }

                // Set rows for our table with fetched datas
                tableOptions.rows = collection;

                // Get sortKey and order from our pageable collection
                tableOptions.sortKey = tableCollection.state.sortKey;
                tableOptions.order = tableCollection.state.order;

                // Create a new table view with specified options
                var tableView = new TableView(tableOptions);

                _this.tables[tableView.cid] = {
                    view: tableView,
                    collection: tableCollection
                };

                // Display populated table
                tableRegion.show(tableView);
                tableView.render();
            });
        },

        sort: function(params) {

            var sortOrder = params.order;
            var sortField = params.field;
            var sortTable = params.table;

            // Get table and collection
            var tableView = this.tables[sortTable].view;
            var tableCollection = this.tables[sortTable].collection;

            tableCollection.setSorting(sortField, sortOrder);
            tableCollection.sort();
            tableView.options.rows = tableCollection.toJSON();
            tableView.options.sortField = tableCollection.state.sortKey;
            tableView.options.sortOrder = tableCollection.state.order;
            tableView.render();
        }
    });

    return TableController;
});

/**
 * Created by tfoucault on 10/12/2015.
 */

define(['marionette','backbone.radio','../views/table-view'], function(Marionette, Radio, TableView) {
    "use strict";

    /**
     * Default values for table params
     */
    var DEFAULT_PAGINATION_INTERVAL = 5;

    /*
     Constants for pagination action
     */
    var PAGE_ACTIONS = {
        FIRST: 'first',
        PREVIOUS: 'previous',
        NEXT: 'next',
        LAST: 'last'
    };

    var tableChannel = Radio.channel('table');

    var TableController = Marionette.Object.extend({

        initialize: function() {

            this.tables = {};

            this.listenTo(tableChannel, 'init', this.init);
            this.listenTo(tableChannel, 'sort', this.sort);
            this.listenTo(tableChannel, 'page', this.page);
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

                // Check if interval option is not null
                if(!params.options.pagination.interval) {
                    tableOptions.pagination.interval = DEFAULT_PAGINATION_INTERVAL;
                }
            } else {
                // Default pagination params
                tableOptions.pagination = {
                    interval: DEFAULT_PAGINATION_INTERVAL
                };
            }

            tableOptions.pagination.actions = PAGE_ACTIONS;

            // Get region where to display table
            var tableRegion = params.region;

            // Get collection linked to this table
            var tableCollection = params.collection;

            // Keep reference on this
            var _this = this;

            /* When collection is fetched, show the populated paginated table
             -- If we use fetch on pageable collection, it get the page which
             is defined in the pageable collection, by order of priority :
             1 - state.currentPage if defined
             2 - state.firstPage if defined and currentPage not defined
             3 - default value 1 if firstPage and currentPage not defined
             -- If we want to get an other page, we should replace fetch() by
             getPage(pageNumber) where pageNumber is the page we want to have
            */

            tableCollection.fetch().done(function(collection, status, response) {

                // Total pages for pagination
                var totalPages = parseInt(response.getResponseHeader('Total-Pages'));
                tableOptions.pagination.total = totalPages;

                // Create a new table view with specified options
                var tableView = new TableView(tableOptions);

                _this.tables[tableView.cid] = {
                    view: tableView,
                    collection: tableCollection
                };

                // Display populated table
                tableRegion.show(tableView);

                // Initialize pagination
                _this.setPagination(_this.tables[tableView.cid]);

                // Initial sorting and render
                _this.doSort(_this.tables[tableView.cid], tableCollection.state.sortKey, tableCollection.state.order);

                // Render
                tableView.render();
            });
        },

        sort: function(params) {

            var sortOrder = params.order;
            var sortField = params.field;
            var _tableCID = params.table;

            // Get table and collection
            var table = this.getTable(_tableCID);
            // Set sorting
            table.collection.setSorting(sortField, sortOrder);
            // Sort
            this.doSort(table, sortField, sortOrder);
            // Render
            table.view.render();
        },

        doSort: function(table, sortField, sortOrder) {

            table.collection.sort();
            table.view.options.rows = table.collection.toJSON();
            table.view.options.sortField = sortField;
            table.view.options.sortOrder = sortOrder;
        },

        setPagination: function(table) {

            var interval = table.view.options.pagination.interval;
            var pageNumber = table.collection.state.currentPage;
            var totalPages = table.view.options.pagination.total;
            var intervalNumber = Math.ceil(pageNumber / interval);
            var intervalMin = (intervalNumber-1) * interval + 1;
            var intervalMax = intervalNumber * interval;
            table.view.options.pagination.pages = [];

            for(var i=intervalMin; i<=intervalMax && i<= totalPages; ++i) {
                table.view.options.pagination.pages.push({
                    label: i,
                    value: i,
                    current: i == pageNumber ? true : false
                });
            }
        },

        page: function(params) {

            var pageAction = params.action;
            var _tableCID_ = params.table;

            // Get table and collection
            var table = this.getTable(_tableCID_);

            // Get the current page
            var currentPage = table.collection.state.currentPage;
            var totalPages = table.view.options.pagination.total;
            var targetPage = null;

            switch(pageAction) {
                case PAGE_ACTIONS.FIRST:
                    targetPage = 1;
                break;
                case PAGE_ACTIONS.PREVIOUS:
                    targetPage = currentPage > 1 ? currentPage - 1 : currentPage;
                break;
                case PAGE_ACTIONS.NEXT:
                    targetPage = currentPage == totalPages ? totalPages : currentPage + 1;
                break;
                case PAGE_ACTIONS.LAST:
                    targetPage = totalPages;
                break;
                default:
            }

            // Keep the context
            var _this = this;

            table.collection.getPage(targetPage).done(function(collection, status, response) {

                // Initialize pagination
                _this.setPagination(table);

                // Initial sorting and render
                _this.doSort(table, table.collection.state.sortKey, table.collection.state.order);

                // Render
                table.view.render();
            });
        },

        /*
        Private function to get table and collection from cid
         */
        getTable: function(cid) {

            var tableView = this.tables[cid].view;
            var tableCollection = this.tables[cid].collection;
            return {
                view: tableView,
                collection: tableCollection
            };
        }
    });

    return TableController;
});

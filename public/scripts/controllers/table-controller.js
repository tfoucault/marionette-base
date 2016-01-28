/**
 * Created by tfoucault on 10/12/2015.
 */

define(['marionette','backbone.radio', '../collections/table-collection', '../views/table-view'], function(Marionette, Radio, TableCollection, TableView) {
    "use strict";

    /**
     * Default values for table params
     */
    var DEFAULT_PAGINATION_INTERVAL = 5;

    var DEFAULT_PAGE_SIZE = 10;

    var DEFAULT_MODE = 'server';

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

            // Copy of option to keep a reference on it
            var tableOptions = _.clone(params.options);

            // Check that url is defined to load datas
            if(!params.options.url) {
                console.log('Url is mandatory in order to get data from server');
                return;
            }

            // Check if mode is defined
            if(!params.options.mode) {
                tableOptions.mode = DEFAULT_MODE;
            }

            // Check if page size is defined
            if(!params.options.pageSize) {
                tableOptions.pageSize = DEFAULT_PAGE_SIZE;
            }

            // Check that if columns are described, all
            // have a label to display, otherwise, dont
            // display any headers and display an error

            if(params.options.columns) {
                if((_.pluck(params.options.columns, 'label')).length === params.options.columns.length) {
                    tableOptions.columns.hasLabels = true;
                } else {
                    console.log('Columns configuration is not valid. All columns need a label !');
                    return;
                }

                if((_.pluck(params.options.columns, 'key')).length === params.options.columns.length) {
                    tableOptions.columns.hasKeys = true;
                } else {
                    console.log('Columns configuration is not valid. All columns need a key !');
                    return;
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

            // State for pageable collection initialization
            tableOptions.state = {
                pageSize: tableOptions.pageSize
            };

            if(params.options.sort && params.options.sort.key) {
                tableOptions.state.sortKey = params.options.sort.key;
            }

            if(params.options.sort && params.options.sort.order) {
                switch(params.options.sort.order) {
                    case 'desc':
                        tableOptions.state.order = '1';
                    break;
                    case 'asc':
                    default:
                        tableOptions.state.order = '-1';
                }
            }

            if(!params.options.sort) {
                tableOptions.sort = {};
            }

            // Create a new collection for this table
            var tableCollection = new TableCollection({
                url: tableOptions.url,
                mode: tableOptions.mode,
                state: tableOptions.state
            });

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

                var pageCount = 1;

                // Get total pages number for pagination
                if(tableOptions.mode == 'client') {
                    // We get all the collection, so number of page is :
                    pageCount = Math.floor(collection.length / tableOptions.pageSize);
                    if(collection.length % tableOptions.pageSize > 0) {
                        ++pageCount;
                    }
                } else {
                    pageCount = parseInt(response.getResponseHeader('Page-Count'));
                }

                tableOptions.pagination.count = pageCount;

                // Create a new table view with specified options
                var tableView = new TableView(tableOptions);

                // Register table in table list
                _this.tables[tableView.cid] = {
                    view: tableView,
                    collection: tableCollection
                };

                // Display populated table
                tableRegion.show(tableView);

                _this.loadTable(_this.tables[tableView.cid]);
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
        },

        doSort: function(table, sortField, sortOrder) {

            table.view.options.sort = {
                key: sortField,
                order: sortOrder == -1 ? 'asc' : 'desc'
            };

            table.view.options.sortOrder = sortOrder;

            if(table.view.options.mode == 'client') {
                table.collection.fullCollection.sort();
                this.loadRows(table);
            } else {
                // Get current page with new sorting
                var _this = this;
                table.collection.fetch().done(function() {
                    _this.loadRows(table);
                });
            }
        },

        setPagination: function(table) {

            var interval = table.view.options.pagination.interval;
            var pageNumber = table.collection.state.currentPage;
            var totalPages = table.view.options.pagination.count;
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
            var totalPages = table.view.options.pagination.count;
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
                    targetPage = pageAction;
            }

            var _this = this;

            // Keep the context
            var _this = this;

            if(table.view.options.mode == 'client') {
                table.collection.getPage(targetPage);
                _this.loadTable(table);
            } else {
                table.collection.getPage(targetPage).done(function() {
                    _this.loadTable(table);
                });
            }
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
        },

        /*
        Private function to reload table view with pagination and order
         */
        loadTable: function(table) {

            // Initialize pagination
            this.setPagination(table);

            if(table.view.options.sort && table.view.options.sort.sortKey && table.view.options.order) {
                this.doSort(table, table.collection.state.sortKey, table.collection.state.order);
            } else {
                this.loadRows(table);
            }
        },

        /*
        Private function to reload only row in table
         */
        loadRows: function(table) {
            table.view.options.rows = table.collection.toJSON();
            table.view.render();
        }
    });

    return TableController;
});

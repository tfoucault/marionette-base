/**
 * Created by tfoucault on 10/12/2015.
 */

define(['marionette','backbone.radio','../views/table-view'], function(Marionette, Radio, TableView) {
    "use strict";

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

            // Get region where to display table
            var tableRegion = params.region;

            // Get collection linked to this table
            var tableCollection = params.collection;

            // Keep reference on this
            var _this = this;

            /* When collection is fetched, show the populated paginated table
             -- If we use fetch on pageable collection, it get the page which
             is defined in the pageable collection, attribute state.firstPage
             -- If we want to get an other page, we should replace fetch() by
             getPage(pageNumber) where pageNumber is the page we want to have
            */
            tableCollection.fetch().done(function(collection, response) {

                // Set rows for our table with fetched datas
                tableOptions.rows = collection;

                // Get sortKey and order from our pageable collection
                tableOptions.sortKey = tableCollection.state.sortKey;
                tableOptions.sortOrder = tableCollection.state.sortOrder;

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

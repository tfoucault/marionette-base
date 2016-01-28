/**
 * Created by tfoucault on 27/01/2016.
 */

define(['backbone','models/table-model','backbone.paginator'], function(Backbone, TableModel) {
    "use strict";

    var TableCollection = Backbone.PageableCollection.extend({

        initialize: function(params) {
            this.url = params.url;
            this.mode = params.mode;
            this.state = params.state;
        },

        model: TableModel,
        queryParams: {
            currentPage: 'current_page',
            pageSize: 'page_size',
            totalPages: 'total_pages',
            totalRecords: 'total_records',
            sortKey: 'sort_key',
            order: 'order',
            directions: {"1": "desc", "-1": "asc"}
        }
    });

    return TableCollection;
});
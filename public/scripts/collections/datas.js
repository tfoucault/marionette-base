/**
 * Created by tfoucault on 04/12/2015.
 */
define(['backbone','../models/data','backbone.paginator'], function(Backbone, Data) {
    "use strict";

    var Datas = Backbone.PageableCollection.extend({

        model: Data,
        url: '/test/data',
        // Initial pagination state
        state: {
            pageSize: 15
        },
        mode: 'server',
        queryParams: {
            currentPage: 'current_page',
            pageSize: 'page_size',
            totalPages: 'total_pages',
            totalRecords: 'total_records',
            sortKey: 'sort_key',
            order: 'order',
            direction: {"1": "asc", "-1": "desc"}
        },
        comparator: function(a, b) {

            if(this.state.order == 1) {
                // Ascending sort
                if(a.get(this.state.sortKey) > b.get(this.state.sortKey)) {
                    return 1;
                } else {
                    return -1;
                }
            } else if(this.state.order == -1) {
                // Descending sort
                if(a.get(this.state.sortKey) > b.get(this.state.sortKey)) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                return 1;
            }
        }
    });

    return Datas;
});

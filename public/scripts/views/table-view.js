/**
 * Created by tfoucault on 03/12/2015.
 */

define(['marionette','backbone.radio','templates'], function(Marionette, Radio, JST) {
    "use strict";

    var tableChannel = Radio.channel('table');

    var TableView = Marionette.View.extend({

        tagName: 'div',
        className: 'table-view',
        template: JST['public/templates/table-template.hbs'],

        initialize: function(options) {
            this.options = options;
        },

        events: {
            "click thead i": "toggleSort"
        },

        // Display table with options
        render: function() {

            // If targets, keep only targeted field ordered by set columns
            if(this.options.columns.hasTargets) {
                this.options.rows = _.map(this.options.rows, function(row){
                    return _.pick(row, _.pluck(this.options.columns, 'target'));
                }, this);
            }

            this.$el.html(this.template(this.options));

            var sortClass = "";
            var sortOrder = "";

            if(this.options.sortOrder == 1) {
                sortOrder = "asc";
                sortClass = "fa fa-sort-amount-asc"
            } else if(this.options.sortOrder == -1) {
                sortOrder = "desc";
                sortClass = "fa fa-sort-amount-desc";
            } else {
                sortOrder = "any";
                sortClass = "fa fa-sort";
            }

            // Initialization of sorted columns
            $('[data-sort-field="' + this.options.sortField + '"]')
                .removeClass().addClass(sortClass)
                .data('sort-order', sortOrder);
        },

        toggleSort: function(e) {

            var el = e.target || e.srcElement();
            var sortField = $(el).data('sort-field');
            var sortOrder = $(el).data('sort-order');

            // Toggle the sort direction
            if(sortOrder == 'asc') {
                sortOrder = -1;
            } else {
                sortOrder = 1;
            }

            tableChannel.trigger('sort',{table: this.cid, field: sortField, order: sortOrder});
        }
    });

    return TableView;
});

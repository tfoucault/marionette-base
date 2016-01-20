/**
 * Created by tfoucault on 03/12/2015.
 */

define(['marionette','backbone.radio','templates','fixed-header'], function(Marionette, Radio, JST) {
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
            "click thead a": "toggleSort",
            "click .page-action": "actionPage"
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

            // Set header fixed and body scrollable
            this.$el.children('table').fixedHeaderTable({
                height: 500,
                footer: true,
                cloneHeadToFoot: true
            });

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
                .data('sort-order', sortOrder)
                .next().removeClass().addClass(sortClass);
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
        },

        actionPage: function(e) {
            var el = e.target || e.srcElement();
            var pageAction = $(el).data('page-action');
            tableChannel.trigger('page', {table: this.cid, action: pageAction});
        }
    });

    return TableView;
});

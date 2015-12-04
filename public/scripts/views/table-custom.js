/**
 * Created by tfoucault on 03/12/2015.
 */

define(['marionette','templates'], function(Marionette, JST) {
    "use strict";

    var TableCustom = Marionette.View.extend({

        tagName: 'div',
        className: 'table-custom',
        template: JST['public/templates/table-custom.hbs'],

        initialize: function(options) {

            // Copy of option to kee a ref
            this.options = _.clone(options);

            // Check that if columns are described, all
            // have a label to display, otherwise, dont
            // display any headers and display an error

            if(options.columns) {
                if((_.pluck(options.columns, 'label')).length === options.columns.length) {
                    this.options.columns.hasLabels = true;
                } else {
                    console.log('Columns configuration is not valid. All columns need a label !');
                }

                if((_.pluck(options.columns, 'target')).length === options.columns.length) {
                    this.options.columns.hasTargets = true;
                } else {
                    console.log('Columns configuration is not valid. All columns need a target !');
                }
            } else {
                this.options.columns = {};
            }

            // If targets, keep only targeted field ordered by set columns
            if(this.options.columns.hasTargets) {
                this.options.rows = _.map(options.rows, function(row){
                    return _.pick(row, _.pluck(options.columns, 'target'));
                });
            }
        },

        // Display table with options
        render: function() {
            this.$el.html(this.template(this.options));
        }
    });

    return TableCustom;
});

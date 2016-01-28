/**
 * Created by tfoucault on 13/12/2015.
 */

define(['marionette','backbone.radio','views/main-view','views/modal-view'], function(Marionette, Radio, MainView, ModalView) {
    "use strict";

    var tableChannel = Radio.channel('table');
    var mainChannel = Radio.channel('main');

    var MainController = Marionette.Object.extend({

        initialize: function() {
            this.mainView = new MainView();
            this.listenTo(mainChannel, 'init', this.init);
            this.listenTo(mainChannel, 'table:init', this.initTable);
            this.listenTo(mainChannel, 'modal:show', this.showModal);
        },

        init: function(region) {
            region.show(this.mainView);
        },

        initTable: function() {

            var tableRegion = this.mainView.getRegion('tableRegion');

            var tableOptions = {
                url: '/test/data',
                columns: [
                    {label: 'Couleur', key: 'eyeColor', sortable: true},
                    {label: 'Age', key: 'age', sortable: true},
                    {label: 'Repartition', key: 'balance', sortable: true},
                    {label: 'Photo', key: 'picture', sortable: true}
                ],
                sort: {
                    key: 'age',
                    order: 'desc'
                },
                pageSize: 15,
                pagination: {
                    interval: 5
                },
                mode: 'server'
            };

            tableChannel.trigger('init',{region: tableRegion, options: tableOptions});
        },

        showModal: function() {
            this.mainView.getRegion('modalRegion').show(new ModalView());
        }
    });

    return MainController;
});
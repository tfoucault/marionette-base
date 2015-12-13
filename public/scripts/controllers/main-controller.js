/**
 * Created by tfoucault on 13/12/2015.
 */


define(['marionette','backbone.radio','views/main-view','views/modal-view','collections/datas'], function(Marionette, Radio, MainView, ModalView, Datas) {
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
                columns: [
                    {label: 'Couleur', target: 'eyeColor'},
                    {label: 'Age', target: 'age'},
                    {label: 'Repartition', target: 'balance'},
                    {label: 'Photo', target: 'picture'}
                ]
            };

            var tableCollection = new Datas([]);

            tableChannel.trigger('init',{region: tableRegion, options: tableOptions, collection: tableCollection});
        },

        showModal: function() {
            this.mainView.getRegion('modalRegion').show(new ModalView());
        }
    });

    return MainController;
});
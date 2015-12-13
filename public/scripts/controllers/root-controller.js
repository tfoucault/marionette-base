/**
 * Created by tfoucault on 02/12/2015.
 */

define(['marionette','backbone.radio','views/root-view','views/main-view'], function(Marionette, Radio, RootView, MainView) {
    "use strict";

    var tableChannel = Radio.channel('table');
    var mainChannel = Radio.channel('main');

    var RootController = Marionette.Object.extend({

        initialize: function() {
            this.rootView = new RootView();
        },

        home: function() {
            this.rootView.render();
            mainChannel.trigger('init', this.rootView.getRegion('mainRegion'));
        }
    });

    return RootController;
});

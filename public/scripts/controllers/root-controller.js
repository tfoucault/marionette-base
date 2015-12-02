/**
 * Created by tfoucault on 02/12/2015.
 */

define(['marionette','views/root-view','views/main-view'], function(Marionette, RootView, MainView) {
    "use strict";

    var RootController = Marionette.Object.extend({

        initialize: function() {
            this.rootView = new RootView();
        },

        home: function() {
            this.rootView.render();
            this.rootView.getRegion('mainRegion').show(new MainView());
        }
    });

    return RootController;
});

/**
 * Created by tfoucault on 02/12/2015.
 */

define(['marionette','controllers/root-controller','backbone.routefilter'], function(Marionette, RootController) {
    "use strict";

    var IndexRouter = Marionette.AppRouter.extend({

        controller: new RootController(),
        appRoutes: {
            '': 'home'
        },
        before: function(route) {
            // Here go code to process before routing
        }
    });

    return IndexRouter;
});
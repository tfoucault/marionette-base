/**
 * Created by tfoucault on 04/12/2015.
 */
define(['backbone','../models/data'], function(Backbone, Data) {
    "use strict";

    var Datas = Backbone.Collection.extend({

        model: Data,
        url: '/test/data'
    });

    return Datas;
});

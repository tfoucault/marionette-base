/**
 * Created by tfoucault on 04/12/2015.
 */

define(['backbone'], function(Backbone) {
    "use strict";

    var Data = Backbone.Model.extend({

        defaults: {
            _id: '_id',
            index: 'index',
            guid: 'guid',
            isActive: 'bool',
            balance: 'floating',
            picture: 'http://placehold.it/32x32',
            age: 'integer',
            eyeColor: 'blue',
            name: {
                first: 'firstName',
                last: 'surname'
            }
        }
    });

    return Data;
});

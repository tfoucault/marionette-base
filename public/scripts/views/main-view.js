/**
 * Created by tfoucault on 28/11/2015.
 */
define(['marionette','templates'], function(Marionette, JST) {
	'use strict';

	var MainView = Marionette.ItemView.extend({
		tagName: 'div',
		className: 'starter-template',
		template: JST["public/templates/main-view.hbs"]
    });

    return MainView;
});
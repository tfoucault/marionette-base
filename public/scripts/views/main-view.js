/**
 * Created by tfoucault on 28/11/2015.
 */
define(['marionette','backbone.radio','templates'], function(Marionette, Radio, JST) {
	'use strict';

	var mainChannel = Radio.channel('main');

	var MainView = Marionette.LayoutView.extend({
		tagName: 'div',
		className: 'starter-template',
		template: JST["public/templates/main-template.hbs"],
		regions: {
			tableRegion: "#table-content",
			modalRegion: "#modal-content"
		},

		events: {
			"click .open-modal": "openModal",
			"click .init-table": "initTable"
		},

		openModal: function() {
			mainChannel.trigger('modal:show');
		},

		initTable: function() {
			mainChannel.trigger('table:init');
		}
    });

    return MainView;
});
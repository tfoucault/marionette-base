/**
 * Created by tfoucault on 28/11/2015.
 *
 * Simple modal window to display confirmation for an ui action
 *
 */
define(['marionette','templates','bootstrap/modal'], function(Marionette, JST) {
	'use strict';

	var ModalSimple = Marionette.View.extend({

		tagName: 'div',
		className: 'modal fade',
		template: JST["public/templates/modal-template.hbs"],

		initialize: function() {

			// Default values are set
			this.model = this.model ||
			{
				modalTitle: "Confirmation",
				modalMessage: "Would you confirme this choice ?",
				modalConfirm: "Yes",
				modalDismiss: "No"
			};
		},

		events: {
			'click .dismiss': "dismissModal",
			'click .confirm': "confirmModal",
			'hidden.bs.modal': "closedModal"
		},

		dismissModal: function() {
			this.$el.modal('hide');
			this.callback.dismiss();
		},

		confirmModal: function() {
			this.$el.modal('hide');
			this.callback.confirm();
		},

		closedModal: function() {
			this.callback.done();
		},

		onResponse: function(callback) {
			this.callback = {
				confirm: callback.confirm,
				dismiss: callback.dismiss,
				done: callback.done
			};
		},

		render: function() {
			this.$el.html(this.template(this.model));
			this.$el.modal('show');
			return this.$el;
		}
	});

	return ModalSimple;
});
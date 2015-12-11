/**
 * Created by tfoucault on 29/11/2015.
 */

define(['marionette','templates','backbone.radio'], function(Marionette, JST, Radio){

  // Root view for our application
  var RootView = Marionette.LayoutView.extend({

    el: 'body',
    template: JST['public/templates/root-template.hbs'],

    // Add regions to our main layout
    regions: {
      mainRegion: "#main-content",
      modalRegion: "#modal-content"
    },

    initialize: function() {
      // Get the channel whom name is 'main'
      var mainChannel = Radio.channel('main');
      // Listen to views that want to display a modal content
      this.listenTo(mainChannel, 'modal:show', this.showModal);
    },

    showModal: function(params) {
      var modal = params.modal;
      this.modalRegion.show(modal);
    }
  });

  return RootView;
});
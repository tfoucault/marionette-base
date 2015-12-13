/**
 * Created by tfoucault on 29/11/2015.
 */

define(['marionette','templates'], function(Marionette, JST){

  // Root view for our application
  var RootView = Marionette.LayoutView.extend({

    el: 'body',
    template: JST['public/templates/root-template.hbs'],

    // Add regions to our main layout
    regions: {
      mainRegion: "#main-content"
    }
  });

  return RootView;
});
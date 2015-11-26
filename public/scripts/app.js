/**
 * Created by tfoucault on 26/11/2015.
 *
 * Application main file
 */

define(function(require) {
  'use strict';

  var Marionette = require('marionette'),
      Radio = require('backbone.radio');

  // Creation of marionette application
  var app = new Marionette.Application();

  // Definition of a main channel
  var mainChannel = Radio.channel('main');

  // Test that backbone radio is working
  mainChannel.on('app:started', function() {
    console.log('Application started successfully');
  });

  return app;
});
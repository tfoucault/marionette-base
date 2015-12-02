/**
 * Created by tfoucault on 26/11/2015.
 *
 * Application main file
 */

define(function(require) {
  'use strict';

  var Marionette = require('marionette'),
      Backbone = require('backbone'),
      Radio = require('backbone.radio'),
      IndexRouter = require('routers/index');

  // Creation of marionette application
  var app = new Marionette.Application();

  // Definition of a main channel
  var mainChannel = Radio.channel('main');

  // Test that backbone radio is working
  mainChannel.on('app:started', function() {
    console.log('Application started successfully');
    this.status = 'running';
  });

  mainChannel.reply('app:status', function() {
    return this.status;
  });

  // When app is started, show main view
  app.on('start', function() {
    new IndexRouter();
    Backbone.history.start();
  });

  return app;
});
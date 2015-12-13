/**
 * Created by tfoucault on 26/11/2015.
 *
 * Application main file
 */

define(function(require) {
  'use strict';

  var Marionette = require('marionette'),
      Radio = require('backbone.radio'),
      IndexRouter = require('routers/index'),
      MainController = require('controllers/main-controller'),
      TableController = require('controllers/table-controller');

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
    new MainController();
    new TableController();
    Backbone.history.start();
  });

  return app;
});
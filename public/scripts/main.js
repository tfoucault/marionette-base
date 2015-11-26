/**
 * Created by tfoucault on 26/11/2015.
 *
 * Main entry where require.js is set
 * and our application is bootstraped
 */
require.config({
  paths: {
    'underscore' : '../vendors/underscore/underscore-min',
    'backbone' : '../vendors/backbone/backbone-min',
    'backbone.radio' : '../vendors/backbone.radio/build/backbone.radio.min',
    'backbone.wreqr' : '../vendors/backbone.wreqr/lib/backbone.wreqr.min',
    'backbone.babysitter' : '../vendors/backbone.babysitter/lib/backbone.babysitter.min',
    'marionette' : '../vendors/marionette/lib/core/backbone.marionette.min',
    'marionette.radio' : './utils/marionette.radio',
    'jquery' : '../vendors/jquery/dist/jquery.min',
    'handlebars' : '../vendors/handlebars/handlebars.min',
    'bootstrap' : '../vendors/bootstrap/dist/js/bootstrap.min'
  },
  enforceDefine: true,
  map: {
    //We map calls to marionette to use our own "augment" module
    //we also map backbone.wreqr calls to use the Radio module.
    '*': {
      'marionette': 'marionette.radio',
      'backbone.wreqr': 'backbone.radio'
    },
    //For our "augment" module, we want the real Marionette
    'marionette.radio' : {
      'marionette': 'marionette'
    }
  },
  shim: {
    'underscore' : {
      exports : '_'
    },
    'backbone' : {
      exports : 'Backbone',
      deps : ['jquery','underscore']
    },
    'marionette' : {
      exports : 'Backbone.Marionette',
      deps : ['backbone','backbone.wreqr','backbone.babysitter']
    },
    deps : ['jquery','underscore']
  }
});

define(['app', 'backbone.radio'], function(app, Radio) {
  'use strict';

  app.start();

  // Test that bacbone radio is working
  var mainChannel = Radio.channel('main');
  mainChannel.trigger('app:started');

});

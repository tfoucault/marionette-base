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
    'backbone.routefilter' : '../vendors/backbone.routefilter/dist/backbone.routefilter.min',
    'backbone.paginator': '../vendors/backbone.paginator/lib/backbone.paginator.min',
    'marionette' : '../vendors/marionette/lib/core/backbone.marionette.min',
    'marionette.radio' : './utils/marionette.radio',
    'jquery' : '../vendors/jquery/dist/jquery.min',
    'jquery.mockjax': '../vendors/jquery-mockjax/dist/jquery.mockjax.min',
    'handlebars' : '../vendors/handlebars/handlebars.min',
    'bootstrap' : '../vendors/bootstrap/js',
    'templates' : './tpls/precompiled.handlebars',
    'fixed-header' : '../vendors/fixed-header/jquery.fixedheadertable.min'
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
    'bootstrap/alert':      { deps: ['jquery'], exports: '$.fn.alert' },
    'bootstrap/button':     { deps: ['jquery'], exports: '$.fn.button' },
    'bootstrap/carousel':   { deps: ['jquery'], exports: '$.fn.carousel' },
    'bootstrap/collapse':   { deps: ['jquery'], exports: '$.fn.collapse' },
    'bootstrap/dropdown':   { deps: ['jquery'], exports: '$.fn.dropdown' },
    'bootstrap/modal':      { deps: ['jquery'], exports: '$.fn.modal' },
    'bootstrap/popover':    { deps: ['jquery'], exports: '$.fn.popover' },
    'bootstrap/scrollspy':  { deps: ['jquery'], exports: '$.fn.scrollspy' },
    'bootstrap/tab':        { deps: ['jquery'], exports: '$.fn.tab'        },
    'bootstrap/tooltip':    { deps: ['jquery'], exports: '$.fn.tooltip' },
    'bootstrap/transition': { deps: ['jquery'], exports: '$.fn.transition' },
    'fixed-header': { deps: ['jquery'], exports: '$.fn.fixedHeaderTable'}
  }
});

/*
If we want to mock data on client side, just uncomment ,'utils/mock.webservice'
The webapp could be served by a local webserver (wamp) or one embedded in your
ide. If you use IntelliJIDEA, a local server is available at localhost:63342 so
it can serve static files from public directory.

Else, if you want to mock data from server keep commented it above and run the
mock-server.js file which is in "server" directory with node.js. It will serve
index.html file and all associated static resources at localhost:3000

==> By default, mock data from server by launching mock-server.js !
 */
define(['app', 'backbone.radio'/*,'utils/mock.webservice'*/], function(app, Radio) {
  'use strict';

  app.start();

  // Test that bacbone radio is working
  var mainChannel = Radio.channel('main');
  mainChannel.trigger('app:started');

  var appStatus = mainChannel.request('app:status');
  console.log('Application is ' + appStatus);
});

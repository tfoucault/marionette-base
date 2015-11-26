/**
 * Created by tfoucault on 26/11/2015.
 *
 * Channel initialisation before Marionette
 * when using backbone radio. More info see :
 * ==> https://gist.github.com/jmeas/7992474cdb1c5672d88b
 */

define([
  'underscore',
  'marionette',
  'backbone.radio'

], function (_, Marionette, Radio) {
  Marionette.Radio = Radio;

  Marionette.Application.prototype._initChannel = function () {
    this.channelName = _.result(this, 'channelName') || 'global';
    this.channel = _.result(this, 'channel') ||
      Radio.channel(this.channelName);
  };

  return Marionette;
});

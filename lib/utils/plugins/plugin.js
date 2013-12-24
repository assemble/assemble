/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var events = require('events');
var logger = new require('../log');
var log = new logger({level: logger.levels.info});

// Create a new Plugin object that inherits EventEmitter
var Plugin = module.exports = function (name, description, options, fn, line) {
  var self = this;
  events.EventEmitter.call(self);
  self.name = name;
  self.description = description;
  self.fn = fn;
  self.line = line;
};

require('util').inherits(Plugin, events.EventEmitter);

Plugin.prototype.listen = function(stage) {
	this.line.on(stage, this.run.bind(this));
};

/**
 * Run the plugin when the event is emitted.
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
Plugin.prototype.run = function(params) {
	log.info('Plugin "' + this.name + '" starting...');
  this.fn.call(this.line, params, this.done.bind(this));
};

/**
 * Called when the plugin is finished
 * @param  {[type]}   err [description]
 * @return {Function}     [description]
 */
Plugin.prototype.done = function(err) {
	log.info(['Plugin "' + this.name + '" finished.']);
  if(err) {
    // do something
  }
  this.emit('done');
};
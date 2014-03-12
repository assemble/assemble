/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var async = require('async');
var _ = require('lodash');
var Handlebars = require('handlebars');
var helpers = require('handlebars-helpers');

// local
var notifier = require('../../middleware/notifier');
var layouts = require('./layouts');

// events that handlebars might emit
var events = {
  handlebarsBeforeRegisterPartial: 'handlebars:before:registerPartial',
  handlebarsAfterRegisterPartial: 'handlebars:after:registerPartial',
  handlebarsBeforeRegisterHelper: 'handlebars:before:registerHelper',
  handlebarsAfterRegisterHelper: 'handlebars:after:registerHelper',
  handlebarsBeforeParse: 'handlebars:before:parse',
  handlebarsAfterParse: 'handlebars:after:parse',
  handlebarsBeforeCompile: 'handlebars:before:compile',
  handlebarsAfterCompile: 'handlebars:after:compile',
  handlebarsBeforeRender: 'handlebars:before:render',
  handlebarsAfterRender: 'handlebars:after:render'
};

var HandlebarsEngine = function (assemble, options) {
  this.assemble = assemble;
  this.dovetail = assemble.dovetail;
  this.options = options || {};
  this.handlesLayouts = true;

  this.params = {};
  this.params.assemble = this.assemble;
  this.params.grunt = this.options.grunt || {};

  this.assemble.Handlebars = Handlebars;

  helpers.register(Handlebars, this.options, this.params);
};

HandlebarsEngine.prototype.registerPartial = function (name, partial, done) {
  var params = {
    name: name,
    partial: partial
  };
  var notify = notifier(this.assemble, params);

  async.series([
      notify(events.handlebarsBeforeRegisterPartial),
      function (next) {
        Handlebars.registerPartial(params.name, params.partial);
        next();
      },
      notify(events.handlebarsAfterRegisterPartial)
    ],
    done
  );
};

HandlebarsEngine.prototype.registerHelper = function(name, helper, done) {
  var params = {
    name: name,
    helper: helper
  };
  var notify = notifier(this.assemble, params);

  async.series([
      notify(events.handlebarsBeforeRegisterHelper),
      function (next) {
        if (typeof params.helper !== 'undefined') {
          Handlebars.registerHelper(params.name, params.helper);
        }
        next();
      },
      notify(events.handlebarsAfterRegisterHelper)
    ],
    done
  );
};

HandlebarsEngine.prototype.compile = function (tmpl, options, done) {

  var self = this;
  var params = {
    tmpl: tmpl,
    options: options,
    ast: null,
    fn: null
  };

  var notify = notifier(self.assemble, params);

  async.series(
    [
      notify(events.handlebarsBeforeParse),
      function (next) {
        params.ast = Handlebars.parse(params.tmpl);
        next();
      },
      notify(events.handlebarsAfterParse),
      notify(events.handlebarsBeforeCompile),
      function (next) {
        params.fn = Handlebars.compile(params.ast, params.options);
        next();
      },
      notify(events.handlebarsAfterCompile)
    ],
    function (err) {
      done(err, params.fn);
    });

};

HandlebarsEngine.prototype.render = function (tmpl, data, options, done) {

  var self = this;
  var params = {
    tmpl: tmpl,
    data: data,
    options: options,
    content: null
  };

  if (_.isFunction(tmpl)) {

    var notify = notifier(self.assemble, params);

    async.series(
      [
        notify(events.handlebarsBeforeRender),
        function (next) {
          params.content = params.tmpl(data, options);
          next();
        },
        notify(events.handlebarsAfterRender)
      ],
      function (err) {
        done(err, params.content);
      }
    );

  } else {
    self.compile(params.tmpl, params.options, function (err, fn) {
      self.render(fn, params.data, params.options, done);
    });
  }
};

HandlebarsEngine.prototype.loadDefaultLayout = function(done) {
  layouts.loadDefaultLayout(this.assemble, done);
};

HandlebarsEngine.prototype.loadComponentLayout = function(component, done) { 
  layouts.loadComponentLayout(this.assemble, component, done);
};

module.exports = function (assemble, options) {
  return new HandlebarsEngine(assemble, options);
};
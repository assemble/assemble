/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var handlebarsHelpers = require('handlebars-helpers');
var Handlebars = require('handlebars');
var async = require('async');
var _ = require('lodash');

// local
var notifier = require('../../core/notifier');
var componentHandler = require('./components');
var asyncHelpers = require('./async');
var layouts = require('./layouts');

// events that handlebars might emit
var events = {
  handlebarsBeforeRegisterComponent: 'handlebars:before:registerComponent',
  handlebarsAfterRegisterComponent: 'handlebars:after:registerComponent',
  handlebarsBeforeRegisterPartial: 'handlebars:before:registerPartial',
  handlebarsAfterRegisterPartial: 'handlebars:after:registerPartial',
  handlebarsBeforeRegisterHelper: 'handlebars:before:registerHelper',
  handlebarsAfterRegisterHelper: 'handlebars:after:registerHelper',
  handlebarsBeforeCompile: 'handlebars:before:compile',
  handlebarsAfterCompile: 'handlebars:after:compile',
  handlebarsBeforeRender: 'handlebars:before:render',
  handlebarsAfterRender: 'handlebars:after:render',
  handlebarsBeforeParse: 'handlebars:before:parse',
  handlebarsAfterParse: 'handlebars:after:parse'
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
};


HandlebarsEngine.prototype.init = function (done) {
  this.asyncHelpers = asyncHelpers(this.assemble);
  Handlebars.registerAsyncHelper = this.assemble.engine.registerAsyncHelper = this.asyncHelpers.registerAsyncHelper;

  // load the helpers
  var helpers = handlebarsHelpers(this.assemble);
  // register the helpers with the assemble engine to get logging
  this.assemble.engine.registerHelpers(helpers, done);
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

HandlebarsEngine.prototype.registerComponents = function (components, done) {
  var self = this;
  var params = {
    components: components
  };

  var notify = notifier(this.assemble, params);

  async.series([
      notify(events.handlebarsBeforeRegisterComponents),
      function (next) {
        componentHandler.loadComponents(components, self.assemble, next);
      },
      notify(events.handlebarsAfterRegisterComponents)
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
        params.fn = Handlebars.compile(params.ast, _.merge({data: true}, params.options));
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
          params.content = params.tmpl(params.data, { data: params.data });
          self.asyncHelpers.complete(params, function (output) {
            params.content = output;
            next();
          });
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

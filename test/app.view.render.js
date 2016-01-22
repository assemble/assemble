'use strict';

require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('app.view.render', function() {
  describe('rendering', function() {
    beforeEach(function() {
      app = new App();
      app.engine('tmpl', require('engine-base'));
      app.create('page');
    });

    it('should use helpers to render a view:', function(cb) {
      var locals = {name: 'Halle'};

      app.helper('upper', function(str) {
        return str.toUpperCase(str);
      });

      var buffer = new Buffer('a <%= upper(name) %> b');
      app.page('a.tmpl', {contents: buffer, locals: locals})
        .render(function(err, res) {
          if (err) return cb(err);

          assert(res.contents.toString() === 'a HALLE b');
          cb();
        });
    });

    it('should support helpers as an array:', function(cb) {
      var locals = {name: 'Halle'};

      app.helpers([
        {
          lower: function(str) {
            return str.toLowerCase(str);
          }
        }
      ]);

      var buffer = new Buffer('a <%= lower(name) %> b');
      app.page('a.tmpl', {contents: buffer, locals: locals})
        .render(function(err, res) {
          if (err) return cb(err);

          assert(res.contents.toString() === 'a halle b');
          cb();
        });
    });

    it('should support helpers as an object:', function(cb) {
      var locals = {name: 'Halle'};

      app.helpers({
        prepend: function(prefix, str) {
          return prefix + str;
        }
      });

      var buffer = new Buffer('a <%= prepend("foo ", name) %> b');
      app.page('a.tmpl', {contents: buffer, locals: locals})
        .render(function(err, res) {
          if (err) return cb(err);
          assert(res.contents.toString() === 'a foo Halle b');
          cb();
        });
    });

    it('should use the engine defined on view options:', function(cb) {
      app.engine('hbs', require('engine-handlebars'));
      var locals = {name: 'Halle'};

      app.helpers({
        prepend: function(prefix, str) {
          return prefix + str;
        }
      });

      var buffer = new Buffer('a {{prepend "foo " name}} b');
      app.page('a.tmpl', {contents: buffer, locals: locals, options: {engine: 'hbs'}})
        .render(function(err, res) {
          if (err) return cb(err);
          assert(res.contents.toString() === 'a foo Halle b');
          cb();
        });
    });
  });
});


/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');
var Layouts = require('layouts');


describe('assemble view layout', function () {

  describe('new Layouts()', function () {
    it('should create a new layouts object', function () {
      var layout = new Layouts();
      should.exist(layout);
    });
  });

  describe('options', function () {
    it('should use options loaded earlier', function () {
      var layout = new Layouts({
        layout: 'base'
      });

      layout.setLayout('base', {title: 'Base'}, '<html><head><title>{{title}}</title></head><body><div>Base Layout {{title}}</div>\n<pre>\n{{body}}\n</pre>\n</body></html>');
      layout.setLayout('foo', {title: 'Foo'}, 'Hi There. Layout {{title}}\n{{body}}\nGood bye. Layout {{title}}');

      var page = layout.inject('\nLook at this BODY!!!\n', 'foo');
      // console.log(page);
    });
  });

});
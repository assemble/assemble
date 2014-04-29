/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var assemble = require('../');

describe('assemble', function() {

  describe('context', function() {

    it('should contain a utils module', function () {
      var actual = assemble();
      expect(actual).to.have.property('utils');
    });

    it('should create a context function on assemble', function() {
      var actual = assemble();
      expect(actual).to.have.property('context');
    });

    it('should return a context object', function () {
      var actual = assemble().context();
      expect(actual).to.not.eql(null);
    });

    it('should return a context object based on page data', function () {
      var pageOpts = {
        src: 'test-page',
        name: 'test-page',
        data: {
          title: 'This is a test page'
        },
        orig: '{{title}}',
        content: '{{title}}'
      };
      var page = new assemble.models.Component(pageOpts);

      var params = {};
      params.page = page;

      var app = assemble();
      app.utils.context(app, params);

      expect(params.context).to.have.property('title');
      expect(params.context.title).to.eql('This is a test page');

    });


    it('should return a context object with expanded properties', function () {
      var pageOpts = {
        src: 'test-page',
        name: 'test-page',
        data: {
          title: '<%= site.title %>: Page Title',
        },
        orig: '{{title}}',
        content: '{{title}}'
      };
      var page = new assemble.models.Component(pageOpts);

      var assembleOpts = {
        site: {
          title: 'Site Title'
        }
      };

      var params = {};
      params.page = page;

      var app = assemble(assembleOpts);
      app.utils.context(app, params);

      expect(params.context).to.have.property('title');
      expect(params.context.site).to.have.property('title');
      expect(params.context).to.have.property('title');
      expect(params.context).to.have.property('page');

      expect(params.context.title).to.eql('Site Title: Page Title');

    });

  });

});

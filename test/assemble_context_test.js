
/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var assemble = require('../');

describe('assemble', function() {

  describe('context', function() {

    it('should contain a config module', function () {
      var actual = assemble();
      expect(actual).to.have.property('config');
    });

    it('should create a context function on assemble', function() {
      var actual = assemble();
      expect(actual).to.have.property('context');
    });

    it('should return a context object', function () {
      var actual = assemble().context();
      expect(actual).to.not.eql(null);
    });

    it('should return a context object based on page metadata', function () {
      var pageOpts = {
        src: 'test-page',
        name: 'test-page',
        metadata: {
          title: 'This is a test page'
        },
        raw: '{{title}}',
        content: '{{title}}'
      };
      var page = new assemble.models.Component(pageOpts);

      var params = {};
      params.page = page;

      var app = assemble();
      app.config.context(app, params);

      expect(params.context).to.have.property('title');
      expect(params.context.title).to.eql('This is a test page');

    });


    it('should return a context object with expanded properties', function () {
      var pageOpts = {
        src: 'test-page',
        name: 'test-page',
        metadata: {
          title: '<%= site.title %>: Page Title',
        },
        raw: '{{title}}',
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
      app.config.context(app, params);

      expect(params.context).to.have.property('title');
      expect(params.context.site).to.have.property('title');
      expect(params.context).to.have.property('title');
      expect(params.context).to.have.property('page');

      expect(params.context.title).to.eql('Site Title: Page Title');

    });

  });

});

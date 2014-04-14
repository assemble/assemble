
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

    var testid = 1;

    it('should contain a config module', function () {
      var actual = assemble({name: 'assemble-context-test-'+(testid++)});
      expect(actual).to.have.property('config');
    });

    it('should create a context function on assemble', function() {
      var actual = assemble({name: 'assemble-context-test-'+(testid++)});
      expect(actual).to.have.property('context');
    });

    it('should return a context object', function () {
      var actual = assemble({name: 'assemble-context-test-'+(testid++)}).context();
      expect(actual).to.not.eql(null);
    });

    it('should return a context object based on component metadata', function () {
      var componentOpts = {
        src: 'test-component',
        name: 'test-component',
        metadata: {
          title: 'This is a test component'
        },
        raw: '{{title}}',
        content: '{{title}}'
      };
      var component = new assemble.models.Component(componentOpts);

      var params = {};
      params.component = component;

      var app = assemble({name: 'assemble-context-test-'+(testid++)});
      app.config.context(app, params);

      expect(params.context).to.have.property('title');
      expect(params.context.title).to.eql('This is a test component');

    });


    it('should return a context object with expanded properties', function () {
      var componentOpts = {
        src: 'test-component',
        name: 'test-component',
        metadata: {
          title: '<%= site.title %>: Component Title',
        },
        raw: '{{title}}',
        content: '{{title}}'
      };
      var component = new assemble.models.Component(componentOpts);

      var assembleOpts = {
        name: 'assemble-context-test-'+(testid++),
        metadata: {
          site: {
            title: 'Site Title'
          }
        }
      };

      var params = {};
      params.component = component;

      var app = assemble(assembleOpts);
      app.config.context(app, params);

      expect(params.context).to.have.property('title');
      expect(params.context.site).to.have.property('title');
      expect(params.context).to.have.property('title');
      expect(params.context).to.have.property('page');
      expect(params.context).to.have.property('component');

      expect(params.context.title).to.eql('Site Title: Component Title');

    });

  });

});

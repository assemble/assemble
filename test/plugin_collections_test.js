
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

describe('plugins collections', function() {

  var testid = 1;
  var name = function () {
    return 'plugins-collections-test-' + (testid++);
  };

  it('should create a collections object on assemble', function (done) {
    var assembleOpts = {
      name: name(),
      metadata: {
        collections: [
          {
            name: 'tag',
            plural: 'tags'
          }
        ]
      }
    };
    assemble(assembleOpts).build(function(err, results) {
      if (err) {
        console.log('Error', err);
        return done(err);
      }
      expect(results).to.have.property('collections');
      expect(results.collections).to.have.property('tags');
      done();
    });

  });

  it('should create a collection index page for a collection', function (done) {

    // each page will have 10 tags
    var componentOpts = {
      src: 'test-component',
      name: 'test-component',
      metadata: {
        title: 'This is a test component',
        tags: [
          'first',
          'second',
          'third',
          'fourth',
          'fifth',
          'sixth',
          'seventh',
          'eight',
          'ninth',
          'tenth'
        ]
      },
      raw: '{{title}}',
      content: '{{title}}'
    };

    // create a bunch of pages to test
    var components = [];
    for (var i = 1; i <= 20; i++) {
      var component = new assemble.models.Component(componentOpts);
      component.src += ' ' + i;
      component.name += ' ' + i;
      component.metadata.title += ' ' + i;
      components.push(component);
    }

    var assembleOpts = {
      name: name(),
      metadata: {
        components: components,

        // setup a tags collection
        collections: [
          {
            name: 'tag',
            plural: 'tags',
            // Index of all tags
            // only show 3 tags on each page
            index: {
              template: 'test/fixtures/templates/collections/tags/index.hbs',
              pagination: {
                prop: ':num',
                limit: 3,
                sortby: '',
                sortOrder: 'ASC'
              },
              permalinks: {
                structure: 'tags/:num/index.html'
              }
            }
          }
        ]
      }
    };
    assemble(assembleOpts).build(function(err, results) {
      if (err) {
        console.log('Error', err);
        return done(err);
      }
      //console.log('components', results.components);
      expect(results.components).to.have.property('collections-tags-1');
      expect(results.components).to.have.property('collections-tags-2');
      expect(results.components).to.have.property('collections-tags-3');
      expect(results.components).to.have.property('collections-tags-4');

      expect(results.components['collections-tags-1'].metadata.tags.length).to.eql(3);
      expect(results.components['collections-tags-2'].metadata.tags.length).to.eql(3);
      expect(results.components['collections-tags-3'].metadata.tags.length).to.eql(3);
      expect(results.components['collections-tags-4'].metadata.tags.length).to.eql(1);

      done();
    });
  });

});

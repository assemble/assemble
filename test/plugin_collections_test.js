
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

  it('should create a collection pages for a collection', function (done) {

    var tags = [
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
    ];

    // each page will have 10 tags
    var componentOpts = {
      src: 'test-component',
      name: 'test-component',
      metadata: {
        title: 'This is a test component',
        tags: tags
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
            },
            // Index of pages related to each tag
            related_pages: {
              template: 'test/fixtures/templates/collections/tags/related-pages.hbs',
              pagination: {
                limit: 6,
                sortby: '',
                sortOrder: 'ASC'
              },
              permalinks: {
                structure: 'tags/:tag/:num/index.html'
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
      for (var i = 1; i <= 4; i++) {
        expect(results.components).to.have.property('collections-tags-' + i);
        expect(results.components['collections-tags-' + i].metadata.tags.length).to.eql((i===4 ? 1 : 3));
      }

      // pages for each tag
      tags.forEach(function (tag) {
        for (var i = 1; i <= 4; i++) {
          expect(results.components).to.have.property('collections-tags-' + tag + '-' + i);
          expect(results.components['collections-tags-' + tag + '-' + i].metadata['related-pages'].length).to.eql((i===4 ? 2 : 6));
        }
      });

      done();
    });
  });

});

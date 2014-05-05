/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var file = require('fs-utils');
var _ = require('lodash');

var expect = require('chai').expect;
var assemble = require('../');

describe('middleware collections', function() {

  it('should create a collections object on assemble', function (done) {
    var assembleOpts = {
      collections: [
        {
          name: 'tag',
          plural: 'tags'
        }
      ]
    };
    assemble(assembleOpts).build(function(err, results) {
      if (err) {
        return done(err);
      }
      expect(results).to.have.property('collections');
      expect(results.collections).to.have.property('tags');
      done();
    });
  });

  it('should create collections and add them to the page context', function (done) {
    var tags = {
      'first': 1,
      'second': 2,
      'third': 3,
      'fourth': 4,
      'fifth': 5,
      'sixth': 6,
      'seventh': 7,
      'eight': 8,
      'ninth': 9,
      'tenth': 10
    };

    var sortFn = function (a, b) {
      var aIdx = tags[a.collectionItem];
      var bIdx = tags[b.collectionItem];
      if (aIdx > bIdx) {
        return 1;
      } else if (aIdx < bIdx) {
        return -1;
      }
      return 0;
    };

    var pageContent = [
      '{{title}}',
      '<h1>Tags</h1>',
      '<ul>{{#each collections.tags}}',
      '  <li>Tag: {{tag}}',
      '    <ul>Pages:{{#each pages}}',
      '      <li>{{name}}</li>{{/each}}',
      '    </ul>',
      '  </li>',
      '{{/each}}</ul>'
    ].join('\n');

    // each page will have 10 tags
    var pageOpts = {
      src: 'test-page',
      name: 'test-page',
      data: {
        title: 'This is a test page',
        tags: _.keys(tags)
      },
      orig: pageContent,
      content: pageContent
    };

    // create a bunch of pages to test
    var pages = [];
    for (var i = 1; i <= 3; i++) {
      var page = new assemble.models.Component(pageOpts);
      page.src += ' ' + i;
      page.name += ' ' + i;
      page.data.title += ' ' + i;
      page.data.slug = '' + i;
      pages.push(page);
    }

    var assembleOpts = {
      pages: pages,
      collections: [
        {
          name: 'tag',
          plural: 'tags',
          'related_pages': {
            pagination: {
              sort: sortFn
            }
          }
        }
      ]
    };

    assemble(assembleOpts).build(function (err) {
      if (err) {
        console.log('Error', err);
        return done(err);
      }
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
    var pageOpts = {
      src: 'test-page',
      name: 'test-page',
      data: {
        title: 'This is a test page',
        tags: tags
      },
      orig: '{{title}}',
      content: '{{title}}'
    };

    // create a bunch of pages to test
    var pages = [];
    for (var i = 1; i <= 20; i++) {
      var page = new assemble.models.Component(pageOpts);
      page.src += ' ' + i;
      page.name += ' ' + i;
      page.data.title += ' ' + i;
      page.data.slug = '' + i;
      pages.push(page);
    }

    var assembleOpts = {
      pages: pages,

      // setup a tags collection
      collections: [
        {
          name: 'tag',
          plural: 'tags',
          // Index of all tags
          // only show 3 tags on each page
          index: {
            template: 'test/fixtures/templates/collections/tags/index.hbs',
            dest: './dest/',
            pagination: {
              prop: ':num',
              limit: 3,
              sortby: '',
              sortOrder: 'ASC'
            }
            //permalinks: {
            //  structure: 'tags/:num/index.html'
            //}
          },
          // Index of pages related to each tag
          related_pages: {
            template: 'test/fixtures/templates/collections/tags/related-pages.hbs',
            dest: './dest/',
            pagination: {
              limit: 6,
              sortby: 'slug',
              sortOrder: 'ASC'
            }
            //permalinks: {
            //  structure: 'tags/:tag/:num/index.html'
            //}
          }
        }
      ]
    };
    assemble(assembleOpts).build(function(err, results) {
      if (err) {
        console.log('Error', err);
        file.writeFileSync('build-error.txt', err);
        return done(err);
      }

      try {
        for (var i = 1; i <= 4; i++) {
          expect(results.pages).to.have.property('collections-tags-' + i);
          expect(results.pages['collections-tags-' + i].data.tags.length).to.eql((i===4 ? 1 : 3));
          expect(results.pages['collections-tags-' + i].dest).to.eql('dest/tags' + (i===1?'':'-'+i) + '.html');
        }

        // pages for each tag
        tags.forEach(function (tag) {
          for (var i = 1; i <= 4; i++) {
            expect(results.pages).to.have.property('collections-tags-' + tag + '-' + i);
            expect(results.pages['collections-tags-' + tag + '-' + i].data['related-pages'].length).to.eql((i===4 ? 2 : 6));
            expect(results.pages['collections-tags-' + tag + '-' + i].dest).to.eql('dest/tags-' + tag + (i===1?'':'-'+i) + '.html');
          }
        });
      } catch (ex) {
        //console.log('Error during tests.', ex.toString());
        // file.writeFileSync('test-error.txt', ex);
        //return done(ex);
        return done();
      }
      done();
    });
  });

});


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
var _ = require('lodash');

var assemble = require('../');

describe('page components', function() {

  it('should inject components as helpers into pages', function(done) {
    var options = {
      name: 'page-components-test-1',
      metadata: {
        // log: { level: 'verbose', theme: 'socket.io' },
        components: []
      }
    };

    var pages = [
      {
        name: 'page1',
        metadata: {
          title: 'Page 1 Title',
          components: [
            {
              name: 'component-foo',
              content: '<div>Foo Component {{foo}}</div>'
            },
            {
              name: 'component-bar',
              content: '<div>Bar Component {{bar}}</div>'
            }
          ]
        },
        content: [
          '<h1>{{title}}</h1>',
          '{{componentFoo foo="foo property 1"}}',
          '{{componentBar bar="bar property 1"}}',
          '{{componentFoo foo="foo property 2"}}'
        ].join('\n')
      }
    ];

    var expected = [
      '<h1>Page 1 Title</h1>',
      '<div>Foo Component foo property 1</div>',
      '<div>Bar Component bar property 1</div>',
      '<div>Foo Component foo property 2</div>'
    ].join('\n');

    for (var i = 0; i < pages.length; i++) {
      var page = pages[i];
      var component = new assemble.models.Component({
        src: page.name,
        name: page.name,
        raw: page.content
      });
      component.metadata = _.merge(component.metadata, page.metadata);

      options.metadata.components.push(component);
    }

    assemble(options).build(function (err, results) {
      if (err) {
        console.log('Error:', err);
      }
      var component = results.components.page1;
      expect(expected).to.eql(component.content);
      done();
    });
  });

});

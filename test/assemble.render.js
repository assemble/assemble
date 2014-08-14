/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');
var should = require('should');
var Assemble = require('..');

var actual = __dirname + '/render-actual';

describe('assemble render', function () {
  describe('assemble.render()', function () {
    var assemble = null;
    beforeEach(function () {
      assemble = Assemble.create();
    });

    it('should render a file', function () {
      assemble.partials('test/fixtures/includes/*.hbs');
      assemble.layouts('test/fixtures/layouts/*.hbs');
      assemble.src('test/fixtures/pages/*.hbs')
        .pipe(assemble.dest(actual));
    });
  });
});
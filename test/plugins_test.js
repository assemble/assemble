/*global require:true */
/**
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var assemble = require('../lib/assemble');
var expect   = require('chai').expect;

describe("plugins", function() {

  it('should load plugins from node modules', function() {
    // pretend some node modules are plugins
    var plugins = assemble.plugins.resolve(['lodash', 'inflection']);

    expect(plugins.length).to.equal(2);
    expect(plugins[0].VERSION).to.be.a('string');
    expect(plugins[1].version).to.be.a('string');
  });

  it('should load plugins from glob', function() {
    var plugins = assemble.plugins.resolve(['./test/plugins/*one.js', ]);

    expect(plugins.length).to.equal(1);
    expect(plugins[0]).to.be.a('function');
  });

  it('should load plugins as functions', function() {
    var plugin = function () {};
    var plugins = assemble.plugins.resolve([plugin]);
    
    expect(plugins.length).to.equal(1);
    expect(plugins[0]).to.be.a('function');
  });
});


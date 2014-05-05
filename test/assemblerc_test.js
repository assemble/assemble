/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

// Node.js
var path = require('path');

// node_modules
var expect = require('chai').expect;
var _ = require('lodash');
var relative = require('relative');
var file = require('fs-utils');

// local modules
var assemble = require('../');


describe('assemble', function() {

  describe('runtime configuration file', function() {


    var filenames = [
      '.assemblerc',
      '.test-assemblerc',
      'assemble.config.yml',
      'assemble.config.json'
    ];

    var configFiles = _.flatten(_.map(filenames, function (filename) {
      var results = _.map(['./tmp/foo', './tmp/bar'], function (base) {
        var results = path.resolve(path.join(base, filename));
        results = relative(results);
        return results;
      });
      return results;
    }));

    var backupFilename = function (filename) {
      return filename + '.bk-assemble-test';
    };

    var backupFiles = function () {
      // ensure there is no assemble runtime config files
      _.each(configFiles, function (filename) {
        if (file.exists(filename)) {
          file.writeFileSync(backupFilename(filename), file.readFileSync(filename));
          file.delete(filename);
        }
      });
    };

    var restoreFiles = function () {
      _.each(configFiles, function (filename) {
        if (file.exists(filename)) {
          file.delete(filename);
        }
        if (file.exists(backupFilename(filename))) {
          file.writeFileSync(filename, file.readFileSync(backupFilename(filename)));
          file.delete(backupFilename(filename));
        }
      });
    };

    before(function () {
      backupFiles();
    });

    after(function () {
      if(file.exists('tmp')) {
        file.delete('tmp');
      }
      restoreFiles();
    });

    it('should create an instance of App with no runtime configuration', function() {
      var actual = assemble();
      expect(actual).to.be.an.instanceof(assemble);
    });

    _.each(configFiles, function (filename) {

      it('should use ' + filename, function () {
        file.writeFileSync(filename, JSON.stringify({ test: { rcfile: filename }}));
        var actual = assemble({ assemblerc: filename });
        expect(actual.config.test.rcfile).to.eql(filename);
      });

    });
  });
});

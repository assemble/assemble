/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var logger = require('../').utils.log;
var streams = require('memory-streams');
var _ = require('lodash');

var runLogs = function(options) {
  var writer = new streams.WritableStream();
  options = _.extend({ stream: writer, theme: 'minimalistic' }, options);
  var log = new logger(options);
  log.verbose('verbose');
  log.debug('debug');
  log.info('info');
  log.warning('warning');
  log.error('error');
  log.critical('critical');
  log.inspect({foo: 'bar'});

  return writer.toString();
};

describe('log', function() {

  it('should log out error and critical messages', function() {
    var expected = 'error: error\ncritical: critical\n';
    var actual = runLogs();
    expect(actual).to.eql(expected);
  });

  it('should log out every message', function() {
    var expected = 'verbose: verbose\ndebug: debug\ninfo: info\nwarning: warning\nerror: error\ncritical: critical\ndebug: { \u001b[1mfoo\u001b[22m: \u001b[32m\'bar\'\u001b[36m }\u001b[39m\n';
    var actual = runLogs({level: logger.levels.verbose});
    expect(actual).to.eql(expected);
  });

});

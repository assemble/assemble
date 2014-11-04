/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var Orchestrator = require('orchestrator');
var _ = require('lodash');
var session = require('../session');

module.exports = function (Assemble) {

  Assemble.onCreate(Orchestrator);
  _.extend(Assemble.prototype, Orchestrator.prototype);

  /**
   * Define an assemble task.
   *
   * **Example**
   *
   * ```js
   * assemble.task('site', function() {
   *   // do stuff
   * });
   * ```
   *
   * @type method
   * @param {String} `name`
   * @param {Function} `fn`
   * @api public
   */

  Assemble.prototype.task = Assemble.prototype.add;


  /**
   * Wrapper around Orchestrator.start to normalize task arguments.
   *
   * @api private
   */

  Assemble.prototype.run = function () {
    var tasks = arguments.length ? arguments : ['default'];
    this.start.apply(this, tasks);
  };


  /**
   * Wrapper around Orchestrator._runTask to enable `sessions`
   *
   * @param  {Object} `task` Task to run
   * @api private
   */

  Assemble.prototype._runTask = function(task) {
    var assemble = this;
    session.run(function () {
      session.set('task name', task.name);
      Orchestrator.prototype._runTask.call(assemble, task);
    });
  };

};
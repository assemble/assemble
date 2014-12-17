/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var Task = require('orchestrator');

module.exports = function (Assemble) {

  Assemble.onCreate(Task);
  _.extend(Assemble.prototype, Task.prototype);

  /**
   * Define an assemble task.
   *
   * **Example**
   *
   * ```js
   * assemble.task('default', function() {
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
   * Wrapper around Orchestrator.start to normalize
   * task arguments.
   *
   * @api private
   */

  Assemble.prototype.run = function () {
    var tasks = !arguments.length
      ? ['default']
      : arguments;
    this.start.apply(this, tasks);
  };

  /**
   * Wrapper around Orchestrator._runTask to enable
   * `sessions`
   *
   * @param  {Object} `task` Task to run
   * @api private
   */

  Assemble.prototype._runTask = function(task) {
    var assemble = this;
    assemble.session.run(function () {
      assemble.session.set('task name', task.name);
      Task.prototype._runTask.call(assemble, task);
    });
  };
};

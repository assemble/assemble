/*!
 * Borrowed from gulp
 * https://github.com/gulpjs/gulp
 *
 * Copyright (c) 2014 Fractal <contact@wearefractal.com>
 * Licensed under the MIT license.
 * https://github.com/gulpjs/gulp/blob/master/LICENSE
 */

'use strict';

module.exports = function(tasks) {
  return Object.keys(tasks).reduce(function(prev, task) {
    prev.nodes.push({
      label: task,
      nodes: tasks[task].dep
    });

    return prev;
  }, {nodes: []});
};

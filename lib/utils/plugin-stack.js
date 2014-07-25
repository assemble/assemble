'use strict';

/**
 * Module dependencies
 */

var es = require('event-stream');
var _ = require('lodash');


/**
 * Create the default plugin stack to use based on
 * user-defined settings.
 *
 * Disable a plugin by passing the name of the default plugin
 * plus ` plugin` to `assemble.disable()`,
 *
 * **Example:**
 *
 * ```js
 * assemble.disable('renderer plugin');
 * assemble.disable('drafts plugin');
 * ```
 */

module.exports = function createPluginStack(assemble, plugins) {
  if (assemble.enabled('minimal config')) {
    return es.pipe.apply(es, []);
  }

  var pipeline = [];
  Object.keys(plugins).forEach(function(plugin) {
    var fn = plugins[plugin];
    if (assemble.enabled(plugin + ' plugin')) {
      pipeline = pipeline.concat(fn);
    }
  });
  return es.pipe.apply(es, pipeline);
};
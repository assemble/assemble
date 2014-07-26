'use strict';

/**
 * Module dependencies
 */

var es = require('event-stream');


/**
 * Create the default plugin stack based on user settings.
 *
 * Disable a plugin by passing the name of the plugin + ` plugin`
 * to `assemble.disable()`,
 *
 * **Example:**
 *
 * ```js
 * assemble.disable('renderer plugin');
 * assemble.disable('drafts plugin');
 * ```
 *
 * In the future we may not include any default plugins,
 * but we're deferring that decision until the API is set.
 */

module.exports = function createStack(plugins) {
  var assemble = this;

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
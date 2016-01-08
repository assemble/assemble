'use strict';

var commands = require('./commands');
var utils = require('./utils');

/**
 * Assemble CLI
 *
 *  Custom extensions to the built-in mappings
 *  provided by the `base-cli` plugin.
 */

module.exports = function(options) {
  return function(app) {
    if (!app.cli) {
      app.use(utils.cli());
    }

    /**
     * Help and information-related
     */

    app.cli
      .map('init', function(fp) {
        console.log('cli > init (implement me!)');
        app.set('questions.options.forceAll', true);
      })
      .map('help', commands.help(app))
      .map('show', commands.show(app))
      .map('open', commands.open(app))
      .map('diff', function(val) {
        app.option('diff', val);
      })

    /**
     * Options, settings and context related
     */

    app.cli
      .map('ask', commands.ask(app))
      .map('cwd', function(val) {
        app.option('cwd', val);
      })
      .map('save', function(val) {
        app.store.config.set(val);
        val = utils.tableize(val);
        console.log('saved > "%j" %s', val, 'in global config store.');
      })
      .map('data', function(val) {
        app.data(val);
      })
      .map('option', function(val) {
        app.option(val);
      })
      .map('config', function(val) {
        app.config.process({
          update: val
        });
      });

    /**
     * Task-related
     */

    app.cli
      .map('choose', function(key) {
        if (key === true) {
          app.enable('tasks.choose');
        }
      })
      .map('tasks', function(key) {
        if (key === true) {
          app.enable('tasks.display');
        }
      });

  };
};

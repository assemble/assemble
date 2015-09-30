'use strict';

var utils = require('../utils');

/**
 * reload view collections when plugins are loaded
 * or options are defined by the user.
 */

module.exports = function () {
  return function (app) {
    app.on('option', function (key) {
      reloadViews(app, key);
    });

    app.on('use', function () {
      reloadViews(app);
    });
  };
};

function reloadViews(app, key) {
  for (var name in app.views) {
    if (app.views.hasOwnProperty(name)) {
      var views = app.views[name];

      if (!key || typeof app[name][key] !== 'function') {
        app.create(name, utils.merge({}, views.options, app.options));
        delete views.options;
        app[name].addViews(views);
      }
    }
  }
}

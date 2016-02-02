'use strict';

var utils = require('../utils');

module.exports = function(app) {
  return function(val) {
    if (val === true) {
      app.enable('questions.init');
      return;
    }

    var keys;
    if (utils.isObject(val)) {
      keys = Object.keys(utils.tableize(val));
      app.questions.enqueue(keys);
      app.option('questions.init', keys);
      return;
    }

    keys = utils.arrayify(val);
    app.questions.enqueue(keys);
    app.option('questions.init', keys);
  };
};

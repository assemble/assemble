'use strict';

var utils = require('../utils');

module.exports = function(app) {
  return function(key) {
    if (utils.isObject(key)) {
      key = utils.tableize(key);
    }

    if (key === 'answers') {
      app.on('answers', console.log);
      return;
    }

    if (key === 'commands') {
      console.log(app.commands.sort());
      return;
    }
  };
};

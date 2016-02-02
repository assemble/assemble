'use strict';

var utils = require('../utils');

module.exports = function(app) {
  return function(key) {
    if (typeof key === 'string') {
      var val = this.get(key)
        || this.get(['cache', key])
        || this.get(['cache.data', key])
        || this.get(['options', key]);

      if (val) {
        console.log('showing >', key, val);
      }
    }

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

/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var async = require('async');
var _ = require('lodash');

// async helpers code inspired from walmart labs static project
// https://github.com/walmartlabs/static
module.exports = function (assemble) {

  var asyncTolkens = {};

  var registerAsyncHelper = function (name, callback) {
    var helpers = {};
    helpers[name] = function () {
      var tolken = String(new Date().getTime() + Math.random());
      var args = _.toArray(arguments);
      var data = args[args.length - 1].data;

      asyncTolkens[tolken] = {
        src: data.root.page.src || 'default',
        args: args,
        callback: callback
      };
      return tolken;
    };

    assemble.engine.registerHelpers(helpers);
  };

  var complete = function (params, callback) {
    var filteredAsyncTolkens = {};
    _.each(asyncTolkens, function (tolkenData, tolken) {
      if ((params.data.page.src || 'default') === tolkenData.src) {
        filteredAsyncTolkens[tolken] = tolkenData;
      }
    });

    if (!_.keys(filteredAsyncTolkens).length) {
      callback(params.content);
    } else {
      var output = params.content;
      async.series(_.map(filteredAsyncTolkens, function (tolkenData, tolken) {
        return function (next) {
          var args = tolkenData.args;
          args.push(function (callbackOutput) {
            output = output.replace(tolken, callbackOutput.toString());
            next();
          });
          tolkenData.callback.apply(tolkenData.callback, args);
        };
      }), function () {
        callback(output);
      });
    }
  };

  return {
    registerAsyncHelper: registerAsyncHelper,
    complete: complete
  };
};


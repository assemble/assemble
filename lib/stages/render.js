/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var file = require('fs-utils');
var async = require('async');
var _ = require('lodash');

// Local libs
var notifier = require('./notifier');
var config = require('../config');

var events = config.plugins.events;

module.exports = function(assemble) {

  return function(next) {
    assemble.log.debug('Running render steps');

    var params = {};
    var notify = notifier(assemble, params);

    async.series([
        notify(events.renderBeforePages),
        function (done) {
          assemble.log.debug('Doing some render pages work here.');

          var pageKeys = _.keys(assemble.pages);
          async.each(
            pageKeys,
            function (pageKey, next) {

              params.page = assemble.pages[pageKey];
              params.context = {};

              _.each(assemble.data, function (data) {
                var name = file.basename(data.src);
                params.context[name] = _.extend({}, params.context[name] || {}, JSON.parse(data.content));
                params.context = _.extend({}, params.context, params.context[name]);
              });

              params.context = _.extend({}, params.context, params.page.metadata);

              async.series([
                  notify(events.renderBeforePage),
                  function (donePage) {
                    assemble.log.debug('Doing some page rending here.');

                    assemble.engine.render(params.page.content, params.context, assemble.options, function (err, content) {
                      assemble.log.debug('rending finished');
                      if (err) {
                        assemble.log.err(err);
                        return donePage();
                      }
                      file.writeFileSync(params.page.dest, content);
                      donePage();
                    });
                  },
                  notify(events.renderAfterPage)
                ],
                next
              );

            },
            done
          );
        },
        notify(events.renderAfterPages)
      ],
      next
    );
  };
};
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

// Local libs
var notifier = require('./notifier');
var config = require('../config');

var events = config.plugins.events;

module.exports = function(assemble) {

  return function(next) {
    assemble.log.debug('Running render pages steps');

    var params = {};
    var notify = notifier(assemble, params);

    async.series([
        notify(events.renderBeforePages),
        function (done) {
          assemble.log.debug('Doing some render pages work here.');

          async.each(
            assemble.pages,
            function (page, next) {

              async.series([
                  notify(events.renderBeforePage),
                  function (donePage) {
                    assemble.log.debug('Doing some page rending here.');

                    assemble.engine.render(page.content, page.metadata, assemble.options, function (err, content) {
                      assemble.log.debug('rending finished');
                      if (err) {
                        assemble.log.err(err);
                        return donePage();
                      }
                      file.writeFileSync(page.dest, content);
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
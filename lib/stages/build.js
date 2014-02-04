/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var async = require('async');

// Local libs
var notifier = require('./notifier');
var config = require('../config');

var events = config.plugins.events;

module.exports = function(assemble) {

  var fileInfo = assemble.utils.file;
  var models = assemble.models;

  return function(next) {
    assemble.log.debug('Running build steps');

    var params = {};
    var notify = notifier(assemble, params);

    params.files = assemble.options.files;

    async.series([
        notify(events.assembleBeforePages),
        function (done) {
          assemble.log.debug('Doing some pages work here.');

          assemble.pages = assemble.pages || {};

          var index = 0; // keep the order the pages were given

          async.eachSeries(
            params.files,
            function (page, next) {

              params.page = page;

              async.series([
                notify(events.assembleBeforePage),
                function (donePage) {
                  assemble.log.debug('Doing some page work here.');

                  var options = {
                    type: models.FileTypes.PAGE,
                    newer: true
                  };

                  fileInfo.load(assemble, params.page.src, options, function (err, pageFile) {
                    if (err) {
                      assemble.log.error(err);
                      return donePage(err);
                    }
                    pageFile.metadata.index = index++;
                    pageFile.dest = page.dest;
                    assemble.pages[pageFile.src] = pageFile;

                    params.page = assemble.pages[pageFile.src];
                    donePage();
                  });

                },
                notify(events.assembleAfterPage)
                ],
                next
              );

            },
            done
          );
        },
        notify(events.assembleAfterPages)
      ],
      next
    );
  };
};
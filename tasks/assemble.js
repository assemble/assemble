/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */


module.exports = function(grunt) {
  'use strict';

  var path = require('path');
  var fs = require('fs');
  var async = require('async');
  var file = grunt.file;
  var matter = require('gray-matter');
  var _ = require('lodash');

  var collection = require('../lib/collection');
  var assemble = require('../lib/assemble');
  var utils = require('../lib/utils');


  grunt.registerMultiTask('assemble', 'Compile template files with specified engines', function() {
    var done = this.async();


    // functions for use in build steps
    var optionsConfiguration = function(assemble, next) {

      grunt.verbose.writeln('Validating options');

      if(utils.endsWithDot(assemble.options.ext)) {
        grunt.warn('Invalid ext "' + assemble.options.ext + '". ext cannot end with a period.');
        done(false);
      }

      // find an engine to use
      assemble.options.engine = assemble.options.engine || 'handlebars';
      grunt.verbose.ok(">> Current engine:".yellow, assemble.options.engine);

      assemble.engine.load(assemble.options.engine);

      var initializeEngine = function(engine, options) { engine.init(options, { grunt: grunt, assemble: assemble }); };
      assemble.options.initializeEngine = assemble.options.initializeEngine || initializeEngine;

      var registerFunctions = function(engine) { engine.registerFunctions(); };
      assemble.options.registerFunctions = assemble.options.registerFunctions || registerFunctions;

      var registerPartial = function(engine, filename, content) { engine.registerPartial(filename, content); };
      assemble.options.registerPartial = assemble.options.registerPartial || registerPartial;

      assemble.partials = file.expand(assemble.options.partials);

      if(_.isArray(assemble.options.data)) {
        assemble.dataFiles = file.expand(assemble.options.data);
        assemble.options.data = {};
      }

      assemble.options.initializeEngine(assemble.engine, assemble.options);
      assemble.options.registerFunctions(assemble.engine);

      next(assemble);
    };



    /**
     * Layout
     * @param  {[type]}   assemble [description]
     * @param  {Function} next     [description]
     * @return {[type]}            [description]
     */
    var assembleDefaultLayout = function(assemble, next) {
      grunt.verbose.writeln('Assembling default layout'.cyan);

      // load default layout
      loadLayout(
        assemble.options.layout,
        assemble,
        function(err, results) {
          if(!err) {
            assemble.options.defaultLayout = results;
          } else {
            grunt.warn(err.message);
          }
        });

      next(assemble);
    };


    /**
     * Partials
     * @param  {[type]}   assemble [description]
     * @param  {Function} next     [description]
     * @return {[type]}            [description]
     */

    var assemblePartials = function(assemble, next) {
      grunt.verbose.writeln('Assembling partials'.cyan);

      // load partials if specified
      var partials = assemble.partials;
      if(partials && partials.length > 0) {
        grunt.verbose.write(('\n' + 'Processing partials...\n').grey);

        partials.forEach(function(filepath) {
          var filename = path.basename(filepath, path.extname(filepath));
          grunt.verbose.ok(('Processing ' + filename.cyan + ' partial'));

          var partial = grunt.file.read(filepath);

          // If the partial is empty, pass a placeholder string to get around
          // handlebars limitations
          if(partial === '') {
            partial = '{{!}}';
          }

          // get the data
          var parsedPartial = matter(partial);
          assemble.options.data[filename] = _.extend({}, parsedPartial.data || {}, assemble.options.data[filename] || {});

          // register the partial
          assemble.options.registerPartial(assemble.engine, filename, parsedPartial.content);
        });
      }

      next(assemble);
    };


    /**
     * Data
     * @param  {[type]}   assemble [description]
     * @param  {Function} next     [description]
     * @return {[type]}            [description]
     */
    var assembleData = function(assemble, next) {
      grunt.verbose.writeln('Assembling data'.cyan);

      // load data if specified
      var dataFiles = assemble.dataFiles;
      if(dataFiles && dataFiles.length > 0) {
        grunt.verbose.writeln(('\n' + 'Processing data...').grey);

        dataFiles.forEach(function(filepath) {
          var ext = path.extname(filepath);
          var filename = path.basename(filepath, ext);
          var fileReader = utils.dataFileReaderFactory(ext);
          var filecontent = grunt.file.read(filepath);

          //Skip empty data files, as they'd cause an error with compiler
          if (filecontent === '') {
            grunt.verbose.writeln('Reading ' + filepath + '...empty, ' + 'skipping'.yellow);
          } else {

            if (filename === 'data') {
              // if this is the base data file, load it into the options.data object directly
              assemble.options.data = _.extend({}, (assemble.options.data || {}), fileReader(filepath));
            } else {
              // otherwise it's an element in options.data
              var d = fileReader(filepath);
              var obj = null;
              if (d[filename]) {
                obj = d[filename];
              } else {
                obj = d;
              }

              if (_.isArray(obj)) {
                // if the object is an Array, union the results
                assemble.options.data[filename] = _.union((assemble.options.data[filename] || []) , obj);
              } else {
                // extend the object
                assemble.options.data[filename] = _.extend({}, (assemble.options.data[filename] || {}), obj);
              }

            }
          }
        });
      }
      next(assemble);
    };



    /**
     * Pages
     * @param  {[type]}   assemble [description]
     * @param  {Function} next     [description]
     * @return {[type]}            [description]
     */
    var assemblePages = function(assemble, next) {
      grunt.verbose.writeln(('\n' + 'Building pages...').grey);
      var src = false;
      var assetsPath = assemble.options.originalAssets;

      async.waterfall([
        function(stepDone){
          async.forEach(assemble.task.files, function(filePair, done) {

            // validate that the source object exists and there are files at the source.
            if(!filePair.src) {
              grunt.warn('Missing src property.');
              done();
              return false;
            }
            if(filePair.src.length === 0 && (!assemble.options.pages)) {
              grunt.warn('Source files not found.');
              done();
              return false;
            }

            // validate that the dest object exists
            if(!filePair.dest || filePair.dest.length === 0) {
              grunt.warn('Missing dest property.');
              done();
              return false;
            }

            src = src || filePair.src;
            //var basePath = utils.findBasePath(src, true);

            // some of the code for calculating destination paths files was
            // inspired by https://github.com/gruntjs/grunt-contrib-copy
            var isExpandedPair = filePair.orig.expand || false;
            var destFile;

            var buildPage = function(srcFile, fileInfo) {

              var useFileInfo = (typeof fileInfo !== 'undefined');

              srcFile  = utils.pathNormalize(path.normalize(srcFile));
              var filename = path.basename(srcFile, path.extname(srcFile));


              if(utils.detectDestType(filePair.dest) === 'directory') {
                destFile = (isExpandedPair) ? filePair.dest : path.join(
                  filePair.dest, (assemble.options.flatten ? path.basename(srcFile) : srcFile)
                );
              } else {
                destFile = filePair.dest;
              }

              var destDirname = path.dirname(destFile);
              var destBasename = path.basename(destFile, path.extname(destFile));
              destFile = utils.pathNormalize(path.join(destDirname, destBasename)) + assemble.options.ext;

              grunt.verbose.writeln('Reading ' + filename.magenta);


              /**
               * Calculate "assets" path
               */
              grunt.verbose.writeln('assetsPath: ' + assetsPath);
              grunt.verbose.writeln('DestFile: ' + destDirname);

              // `options.assets` generate the relative path to the dest "assets"
              // directory from the location of the newly generated dest file
              assemble.options.assets = utils.calculatePath(destDirname, assetsPath, assemble.options.assets);


              grunt.verbose.writeln(('\t' + 'srcFile: '  + srcFile));
              grunt.verbose.writeln(('\t' + 'destFile: ' + destFile));
              grunt.verbose.writeln(('\t' + 'assets: '   + assemble.options.assets));


              /**
               * Page
               */
              var page = useFileInfo ? (fileInfo.content || '') : grunt.file.read(srcFile);
              try {
                grunt.verbose.writeln('Compiling page ' + filename.magenta);
                var pageContext = {};

                // If the page file is empty, we still want to process it. Since the compiler
                // will choke on empty files let's pass it a non-rendering string instead.
                if(page === '') {
                  page = '{{!}}';
                }

                var parsedPage = matter(page);
                pageContext = useFileInfo ? (fileInfo.data || fileInfo.metadata || {}) : parsedPage.data;

                // Page object
                var pageObj = {
                  '_page': 'all',

                  dirname : path.dirname(destFile),
                  filename: path.basename(destFile),
                  pageName: path.basename(destFile), // deprecated, use pagename or filename
                  pagename: path.basename(destFile),
                  basename: path.basename(filename, path.extname(filename)),
                  src     : srcFile,
                  dest    : destFile,
                  assets  : assemble.options.assets,
                  ext     : assemble.options.ext,
                  extname : assemble.options.ext,
                  page    : parsedPage.content,
                  data    : pageContext,
                  filePair: filePair
                };

                if(pageObj.data.published === false) {
                  grunt.verbose.writeln('>> Skipping '.yellow + '"' + path.basename(srcFile).grey + '" since ' + '"published: false"'.cyan + ' was set.');
                  return;
                }

                assemble.options.collections.pages.items[0].pages.push(pageObj);
                _(assemble.options.collections).forEach(function(item, key) {
                  if(key !== 'pages') {
                    assemble.options.collections[key] = collection.update(item, pageObj, pageContext);
                  }
                });

              } catch(err) {
                grunt.warn(err);
                return false;
              }
              return true;
            };

            async.parallel([
              function(buildDone){
                // build all the pages defined in the source property
                async.forEach(filePair.src, function(srcFile, pairDone) {
                  if(!buildPage(srcFile)) {
                    pairDone();
                    return false;
                  }
                  pairDone();
                }, buildDone); // filePair.src.forEach
              },

              // Build options.pages
              function(buildDone){
                // if there is a pages property, build the pages contained therein.
                if(assemble.options.pages) {
                  _.forOwn(assemble.options.pages, function(fileInfo, filename) {

                    // Quick and dirty check to ensure we only build these pages once. Prevents multiplication of assemble.task.files by assemble.options.pages as highlighted in https://github.com/assemble/assemble/issues/611
                    // Ideally would un-nest this for the main assemble.task.files loop but would require more of a refactor
                    if(fileInfo.built === true) {
                      return;
                    } else {
                      fileInfo.built = true;
                    }

                    if(!filename || filename.length === 0) {
                      grunt.warn('Pages need a filename.');
                      buildDone();
                      return false;
                    }
                    if(!buildPage(filename, fileInfo)) {
                      buildDone();
                      return false;
                    }
                  });
                }
                buildDone();
              }
            ], done);
          }, stepDone); // this.files.forEach
        },
        function(stepDone){
          grunt.verbose.writeln('Information compiled');

          assemble.options.pages = collection.sort(assemble.options.collections.pages).items[0].pages;
          _(assemble.options.collections).forEach(function(item, key) {
            if(key !== 'pages') {
              assemble.options[key] = collection.sort(item).items;
            }
          });

          stepDone();
        }
      ], function(){ next(assemble); });
    };



    /**
     * Render pages
     * @param  {[type]}   assemble [description]
     * @param  {Function} next     [description]
     * @return {[type]}            [description]
     */
    var renderPages = function(assemble, next) {
      grunt.verbose.writeln(('\n' + 'Assembling pages...').yellow);

      async.forEach(assemble.options.pages, function(page, done) {
        grunt.verbose.writeln(require('util').inspect(page));

        build(page, assemble, function(err, result) {
          grunt.log.write('Assembling ' + (page.dest).cyan +' ');
          if(err) {
            grunt.verbose.write(' ');
            grunt.log.error();
            grunt.warn(err);
            done(false);
            return;
          }
          // Run any plugins for the 'render:post:page' stage
          var params = {
            grunt: grunt,       // the `grunt` object
            assemble: assemble, // the `assemble` object
            page: page,         // the raw page
            content: result     // the rendered page
          };
          assemble.plugins.runner('render:post:page', params)(function() {
            // Write the file.
            file.write(page.dest, params.content);
            grunt.verbose.writeln('Assembled ' + (page.dest).cyan +' OK'.green);
            grunt.log.notverbose.ok();
            done();
          });
        }); // build

      }, function(){
        grunt.log.ok(((assemble.options.pages).length).toString() + ' pages assembled.');
        next(assemble);
      });
    };


    // setup plugin params
    var pluginParams = {
      grunt: grunt,
      assemble: assemble
    };

    // assemble everything
    assemble.init(this, grunt)

      // Options configuration
      .step(assemble.plugins.buildStep('options:pre:configuration', pluginParams))
      .step(optionsConfiguration)
      .step(assemble.plugins.buildStep('options:post:configuration', pluginParams))

      // Assemble layout
      .step(assemble.plugins.buildStep('assemble:pre:layout', pluginParams))
      .step(assembleDefaultLayout)
      .step(assemble.plugins.buildStep('assemble:post:layout', pluginParams))

      // Assemble partials
      .step(assemble.plugins.buildStep('assemble:pre:partials', pluginParams))
      .step(assemblePartials)
      .step(assemble.plugins.buildStep('assemble:post:partials', pluginParams))

      // Assemble data
      .step(assemble.plugins.buildStep('assemble:pre:data', pluginParams))
      .step(assembleData)
      .step(assemble.plugins.buildStep('assemble:post:data', pluginParams))

      // Assemble pages
      .step(assemble.plugins.buildStep('assemble:pre:pages', pluginParams))
      .step(assemblePages)
      .step(assemble.plugins.buildStep('assemble:post:pages', pluginParams))

      // Render pages
      .step(assemble.plugins.buildStep('render:pre:pages', pluginParams))
      .step(renderPages)
      .step(assemble.plugins.buildStep('render:post:pages', pluginParams))

      .build(function(err) {
        if(err) {
          grunt.warn(err);
          done(false);
        }
        done();
      });

  });




  // ==========================================================================
  // BUILD
  // ==========================================================================

  var build = function(currentPage, assemble, callback) {
    var options  = assemble.options;

    grunt.verbose.writeln('Currentpage: ' + currentPage);

    var pageContext  = currentPage.data,
        layout       = _.cloneDeep(options.defaultLayout),
        data         = options.data,
        pages        = options.pages,
        collections  = options.collections,
        context      = {};

    grunt.verbose.writeln('Variables loaded');


    try {

      // omit the collections from pageContext when merging
      var pageCollections = _.pick(pageContext, _.keys(collections));
      pageContext = _.omit(pageContext, _.keys(collections));

      options.data    = undefined;
      options.pages   = undefined;
      options.layout  = undefined;
      options.collections = undefined;
      context         = _.extend({}, context, assemble.util.filterProperties(options), data, pageContext);
      options.data    = data;
      options.pages   = pages;
      options.collections = collections;

      // if pageContext contains a layout, use that one instead
      // of the default layout
      if(pageContext && (pageContext.layout || pageContext.layout === false || pageContext.layout === 'none')) {

        var pageLayout = null;

        context = processContext(grunt, context);

        loadLayout(
          context.layout,
          assemble,
          function(err, results) {
            if(!err) {
              pageLayout = results;
            } else {
              grunt.warn(err.message);
            }
          }
        );

        if(pageLayout) {
          layout = pageLayout;
          context.layoutName = pageLayout.layoutName;
          data = _.extend({}, data, pageLayout.data);

        }
      }

      // extend again
      options.data = undefined;
      options.pages = undefined;
      options.layout = undefined;
      options.collections = undefined;
      context = _.extend({}, context, assemble.util.filterProperties(options), layout.data, data, pageContext);
      options.data = data;
      options.pages = pages;
      options.collections = collections;


      // add omitted collections back to pageContext
      pageContext = _.merge(pageContext, pageCollections);
      context = processContext(grunt, context);

      // process the current page data
      currentPage.data = processContext(grunt, context, currentPage.data);

      // add the list of pages back to the context so it's available in the templates
      context.pages = pages;
      context.page = currentPage;

      // apply any data for this page to the page object
      context.page = _.extend({}, (context[currentPage.basename] || {}), currentPage.data, context.page);

      // make sure the currentPage assets is used
      context.assets = currentPage.assets;


      // add other page variables to the main context
      context.dirname  = path.dirname(currentPage.dest);
      context.absolute = currentPage.dest;
      context.filename = currentPage.filename;
      context.pageName = currentPage.filename; // "pageName" is deprecated, use "pagename" or "filename"
      context.pagename = currentPage.filename;
      context.basename = currentPage.basename;
      context.extname  = currentPage.ext;

      context.page.page = injectBody(layout.layout, context.page.page);

      // Run any plugins for the 'render:pre:page' stage
      assemble.plugins.runner('render:pre:page', {
        grunt: grunt,
        assemble: assemble,
        context: context
      })(function () {
        assemble.engine.render(context.page.page, context, function (err, content) {
          if (err) {
            callback(err);
          }
          callback(null, content);
        });
      });

    } catch(err) {
      callback(err);
      return;
    }
  };


  /**
   * Process Context
   * @param  {[type]} grunt   [description]
   * @param  {[type]} context [description]
   * @param  {[type]} data    [description]
   * @return {[type]}         [description]
   */
  var processContext = function(grunt, context, data) {
    grunt.config.data = _.extend({}, grunt.config.data, context, data);
    return grunt.config.process(data || context);
  };


  /**
   * Load Layout
   * @param  {[type]}   src      [description]
   * @param  {[type]}   assemble [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  var loadLayout = function(src, assemble, callback) {

    var layoutStack   = [];
    var layoutName    = 'layout';
    var defaultLayout = assemble.engine.startDelimiter + ' body ' + assemble.engine.endDelimiter; // '{{> body }}';

    var layoutext     = assemble.options.layoutext || '';
    var layout        = '';
    var layoutdir     = assemble.options.layoutdir || assemble.options.layouts || '';

    var load = function(src) {

      var loadFile = true;

      // if the src is empty, create a default layout in memory
      if(!src || src === false || src === '' || src.length === 0 || src === 'none') {
        loadFile = false;
        layout = defaultLayout; // '{{>body}}';
      }

      if(loadFile) {
        // validate that the layout file exists
        grunt.verbose.writeln(src);
        layout = path.normalize(path.join(layoutdir, src + layoutext));
        grunt.verbose.writeln(layout);

        if(!fs.existsSync(layout)) {
          var err = 'Layout file (' + layout + ') not found.';
          grunt.warn(err);
          if(callback) {
            callback({message: err}, null);
          }
          return false;
        }

        // load layout
        layoutName = path.basename(layout, path.extname(layout));

        layout = grunt.file.read(layout);
        layout = layout.replace(/\{{>\s*body\s*}}/, defaultLayout);
      }

      var parsedLayout = matter(layout);
      var layoutData = parsedLayout.data;

      var results = {
        layoutName: layoutName,
        layout: parsedLayout.content,
        data: layoutData
      };

      layoutStack.push(results);

      if(layoutData && (layoutData.layout || layoutData.layout === false || layoutData.layout === 'none')) {
        load(layoutData.layout);
      }
    };

    load(src);

    var layoutInfo;
    var finalResults = {
      layoutName: '',
      layout: defaultLayout, // '{{>body}}',
      data: {}
    };

    while (layoutInfo = layoutStack.pop()) {
      finalResults.layout = injectBody(finalResults.layout, layoutInfo.layout);
      finalResults.data = _.extend({}, finalResults.data, layoutInfo.data);
      finalResults.layoutName = layoutInfo.layoutName;
    }

    if(callback) {
      callback(null, finalResults);
    }
    return finalResults;
  };


  /**
   * Inject content from a page into a layout at the `{{> body }}` insertion point
   * @param  {String} layout  The raw layout
   * @param  {String} body    The raw page
   * @return {String}         The raw, assembled, uncompiled and unprocessed page
   */
  var injectBody = function(layout, body) {
    return layout.replace(assemble.engine.bodyRegex, body);
  };

};

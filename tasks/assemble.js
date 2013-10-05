/*
 * Assemble
 * https://github.com/assemble/
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Grunt utils
  var async  = grunt.util.async;
  var _str   = grunt.util._.str;
  var file   = grunt.file;

  // Node.js
  var path = require('path');
  var fs   = require('fs');
  var util = require('util');

  // node_modules
  var inflection = require('inflection');
  var yfm        = require('assemble-yaml');
  var _          = require('lodash');

  // Assemble utils
  var collection = require('../lib/collection');
  var assemble   = require('../lib/assemble');
  var Utils      = require('./utils/utils');



  grunt.registerMultiTask('assemble', 'Compile template files with specified engines', function() {

    var done = this.async();
    var self = this;

    // functions for use in build steps
    var optionsConfiguration = function(assemble, next) {

      grunt.verbose.writeln('Validating options');

      if(_str.endsWith(assemble.options.ext, '.')) {
        grunt.warn('Invalid ext "' + assemble.options.ext + '". ext cannot end with a period.');
        done(false);
      }

      var src = false;
      assemble.files.forEach(function(fp) {
        if(!src) {
          src = fp.src;
        }
      });

      if(!src || src.length === 0) {
        // check if there's a pages
        if(!assemble.options.pages) {
          grunt.warn('No source files found.');
          done(false);
        } else {
          src = _.keys(assemble.options.pages);
        }
      }

      // find an engine to use
      assemble.options.engine = assemble.options.engine || getEngineOf(src);
      if(!assemble.options.engine) {
        grunt.warn('No compatible engine available');
        done(false);
      }

      assemble.fileExtRegex = new RegExp('\\.' + Utils.extension(src) + '$');


      assemble.engine.load(assemble.options.engine);

      var initializeEngine = function(engine, options) { engine.init(options); };
      assemble.options.initializeEngine = assemble.options.initializeEngine || initializeEngine;

      var registerFunctions = function(engine) { engine.registerFunctions(); };
      assemble.options.registerFunctions = assemble.options.registerFunctions || registerFunctions;

      var registerPartial = function(engine, filename, content) { engine.registerPartial(filename, content); };
      assemble.options.registerPartial = assemble.options.registerPartial || registerPartial;

      assemble.partials = file.expand(assemble.options.partials);
      assemble.dataFiles = file.expand(assemble.options.data);
      assemble.options.data = {};

      assemble.options.initializeEngine(assemble.engine, assemble.options);
      assemble.options.registerFunctions(assemble.engine);

      // save original plugins option
      assemble.options._plugins = assemble.options.plugins;
      assemble.options.plugins = assemble.plugins.resolve(assemble.options.plugins, assemble.options);

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

      var complete = 0;
      var increment = 10;

      // load partials if specified
      var partials = assemble.partials;
      if(partials && partials.length > 0) {
        complete = 0;
        increment = Math.round(partials.length / 10);
        grunt.verbose.write(('\n' + 'Processing partials...\n').grey);

        partials.forEach(function(filepath) {
          var filename = _.first(filepath.match(Utils.filenameRegex)).replace(assemble.fileExtRegex, '');
          grunt.verbose.ok(('Processing ' + filename.cyan + ' partial'));

          var partial = grunt.file.read(filepath);

          //If the partial is empty, lets still allow it to be used.
          if(partial === '') {
            partial = '{{!}}';
          }

          // If options.removeHbsWhitespace is true
          partial = removeHbsWhitespace(assemble,partial);

          // get the data
          var partialInfo = yfm.extract(partial, {fromFile: false});
          assemble.options.data[filename] = _.extend({}, partialInfo.context || {}, assemble.options.data[filename] || {});

          // register the partial
          assemble.options.registerPartial(assemble.engine, filename, partialInfo.content);

          complete++;
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
        complete = 0;
        increment = Math.round(dataFiles.length / 10);
        grunt.verbose.writeln(('\n' + 'Processing data...').grey);

        dataFiles.forEach(function(filepath) {
          var ext = path.extname(filepath);
          var filename = path.basename(filepath, ext);
          var fileReader = Utils.dataFileReaderFactory(ext);
          var filecontent = grunt.file.read(filepath);

          //Skip empty data files, as they'd cause an error with compiler
          if(filecontent === '') {
            grunt.log.verbose.writeln('Reading ' + filepath + '...empty, ' + 'skipping'.yellow);
          } else {

            if(filename === 'data') {
              // if this is the base data file, load it into the options.data object directly
              assemble.options.data = _.extend({}, (assemble.options.data || {}), fileReader(filepath));
            } else {
              // otherwise it's an element in options.data
              var d = fileReader(filepath);
              if(d[filename]) {
                // json object contains root object name so extend it in options.json
                assemble.options.data[filename] = _.extend({}, (assemble.options.data[filename] || {}), d[filename]);
              } else {
                // add the entire object
                assemble.options.data[filename] = _.extend({}, (assemble.options.data[filename] || {}), d);
              }
            }
            complete ++;
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
      var assetsPath = assemble.options.assets;

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
            //var basePath = Utils.findBasePath(src, true);

            // some of the code for calculating destination paths files was
            // inspired by https://github.com/gruntjs/grunt-contrib-copy
            var isExpandedPair = filePair.orig.expand || false;
            var destFile;

            var buildPage = function(srcFile, fileInfo) {

              var useFileInfo = (typeof fileInfo !== 'undefined');

              srcFile  = Utils.pathNormalize(path.normalize(srcFile));
              var filename = path.basename(srcFile, path.extname(srcFile));


              if(Utils.detectDestType(filePair.dest) === 'directory') {
                destFile = (isExpandedPair) ? filePair.dest : path.join(
                  filePair.dest, (assemble.options.flatten ? path.basename(srcFile) : srcFile)
                );
              } else {
                destFile = filePair.dest;
              }

              var destDirname = path.dirname(destFile);
              var destBasename = path.basename(destFile, path.extname(destFile));
              destFile = Utils.pathNormalize(path.join(destDirname, destBasename)) + assemble.options.ext;

              grunt.verbose.writeln('Reading ' + filename.magenta);


              /**
               * Calculate "assets" path
               */

              // `options.assets` generate the relative path to the dest "assets"
              // directory from the location of the newly generated dest file
              grunt.verbose.writeln('assetsPath: ' + assetsPath);
              grunt.verbose.writeln('DestFile: ' + destDirname);
              assemble.options.assets = Utils.pathNormalize(
                path.relative(path.resolve(destDirname), path.resolve(assetsPath))
              );
              // if the assets relative path is blank, then it's the same folder
              // so update to be '' or './'
              if (!assemble.options.assets || assemble.options.assets.length === 0) {
                // if the original path had a trailing slash
                if (Utils.hasTrailingSlash(assetsPath)) {
                  // return './'
                  assemble.options.assets = './';
                } else {
                  // otherwise return ''
                  assemble.options.assets = '.';
                }
              }
              // if the original path had a trailing slash and the calculated path does
              // not, add a trailing slash
              if (Utils.hasTrailingSlash(assetsPath) && !Utils.hasTrailingSlash(assemble.options.assets)) {
                assemble.options.assets += '/';
                // if the original path did not have a trailing slash and the calculated
                // path does, remove the trailing slash
              } else if (!Utils.hasTrailingSlash(assetsPath) && Utils.hasTrailingSlash(assemble.options.assets)) {
                assemble.options.assets = assemble.options.assets.substring(0, assemble.options.assets.length - 2);
              }

              grunt.verbose.writeln(('\t' + 'srcFile: '  + srcFile));
              grunt.verbose.writeln(('\t' + 'destFile: ' + destFile));
              grunt.verbose.writeln(('\t' + 'assets: '   + assemble.options.assets));


              var page = useFileInfo ? (fileInfo.content || '') : grunt.file.read(srcFile);
              try {
                grunt.verbose.writeln('Compiling page ' + filename.magenta);
                var pageContext = {};

                // If the page file is empty, we still want to process it. Since the compiler
                // will choke on empty files let's pass it a non-rendering string instead.
                if(page === '') {
                  page = '{{!}}';
                }

                // If options.removeHbsWhitespace is true
                page = removeHbsWhitespace(assemble, page);

                var pageInfo = yfm.extract(page, {fromFile: false});
                pageContext = useFileInfo ? (fileInfo.data || fileInfo.metadata || {}) : pageInfo.context;

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
                  page    : pageInfo.content,
                  data    : pageContext,
                  filePair: filePair
                };

                if(pageObj.data.published === false) {
                  grunt.log.write('\n>> Skipping "' + path.basename(srcFile).grey + '" since ' + '"published: false"'.cyan + ' was set.');
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

              function(buildDone){
                // if there is a pages property, build all those
                if(assemble.options.pages) {
                  _.forOwn(assemble.options.pages, function(fileInfo, filename) {
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
          grunt.verbose.writeln('..');

          function postprocess(src, fn) {return fn(src);}
          var processFn = function(src) {return src;};

          // Write the file.
          file.write(page.dest, postprocess(result, assemble.options.postprocess || processFn));

          grunt.verbose.writeln('Assembled ' + (page.dest).cyan +' OK'.green);
          grunt.log.notverbose.ok();
          done();
        }); // build


      }, function(){
        grunt.log.ok(((assemble.options.pages).length).toString() + ' pages assembled.');
        next(assemble);
      });
    };

    grunt.verbose.writeflags(assemble.options, 'Assemble options');

    // assemble everything
    var assembler = assemble.init(this, grunt)
      .step(optionsConfiguration)
      .step(assembleDefaultLayout)
      .step(assemblePartials)
      .step(assembleData)
      .step(assemblePages)
      .step(renderPages)
      .build(function(err, results) {
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
    var src      = currentPage.srcFile;
    var filename = currentPage.filename;
    var options  = assemble.options;

    grunt.verbose.writeln('Currentpage: ' + currentPage);

    var page         = currentPage.page,
        pageContext  = currentPage.data,
        layout       = _.cloneDeep(options.defaultLayout),
        data         = options.data,
        pages        = options.pages,
        collections  = options.collections,
        engine       = options.engine,
        EngineLoader = options.EngineLoader,
        context      = {};

    grunt.verbose.writeln('Variables loaded');

    //options.data = null;

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

          // extend again
          options.data = undefined;
          options.pages = undefined;
          options.layout = undefined;
          options.collections = undefined;
          context = _.extend({}, context, assemble.util.filterProperties(options), data, pageContext);
          options.data = data;
          options.pages = pages;
          options.collections = collections;
        }
      }


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


      //assemble.options.registerPartial(assemble.engine, 'body', page);
      page = injectBody(layout.layout, page);

      async.forEachSeries(assemble.options.plugins, function (plugin, next) {
        plugin({
          grunt: grunt,
          assemble: assemble,
          context: context
        }, next);
      }, function (err) {
        if(err) {
          callback(err);
        }
        assemble.engine.render(page, context, function(err, content) {
          if(err) {
            callback(err);
          }
          page = content;
          callback(null, page);
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
        layoutName = _.first(layout.match(Utils.filenameRegex)).replace(assemble.fileExtRegex,'');

        layout = grunt.file.read(layout);
        layout = layout.replace(/\{{>\s*body\s*}}/, defaultLayout);
      }


      // If options.removeHbsWhitespace is true
      layout = removeHbsWhitespace(assemble, layout);

      var layoutInfo = yfm.extract(layout, {fromFile: false});
      var layoutData = layoutInfo.context;

      var results = {
        layoutName: layoutName,
        layout: layoutInfo.content,
        data: layoutData
      };

      layoutStack.push(results);

      if(layoutData && (layoutData.layout || layoutData.layout === false || layoutData.layout === 'none')) {
        load(layoutData.layout);
      }
    };

    load(src);

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
    return layout.replace(assemble.engine.bodyRegex, function() { return body; });
  };


  var getEngineOf = function(fileName) {
    var ext = Utils.extension(fileName);
    return  _( _(assemble.engine.extensions).keys() ).include(ext) ? assemble.engine.extensions[ext] : false;
  };

  // Deprecated. This will be removed. Processing options and plugins
  // can do this now.
  //
  // Attempt to remove extra whitespace around Handlebars expressions
  // in generated HTML, similar to what mustache.js does
  var removeHbsWhitespace = function(assemble, filecontent) {
    if(assemble.options.removeHbsWhitespace) {
      filecontent = filecontent.replace(/(\n|\r|\n\r)[\t ]*(\{\{\{[^}]+?\}\}\})(?=(\n|\r|\n\r))/gi,'$2');
      filecontent = filecontent.replace(/(\n|\r|\n\r)[\t ]*(\{\{[^}]+?\}\})(?=(\n|\r|\n\r))/gi,'$2');
    }
    return filecontent;
  };

};
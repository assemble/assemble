/*
 * Assemble
 * https://github.com/assemble/
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Grunt utils
  var file   = grunt.file;
  var log    = grunt.log;
  var kindOf = grunt.util.kindOf;
  var _      = grunt.util._;

  // Node utils
  var path   = require('path');
  var fs     = require('fs');
  var util   = require('util');

  // NPM utils
  var inflection = require('inflection');
  var lodash = require('lodash'); // required to ensure correct version is used

  // Assemble utils
  var assemble = require('../lib/assemble');

  grunt.registerMultiTask('assemble', 'Compile template files with specified engines', function() {


    var done = this.async();
    var self = this;


    // functions for use in build steps
    var optionsConfiguration = function(assemble, next) {

      grunt.verbose.writeln('validating options');

      if(_.endsWith(assemble.options.ext, '.')) {
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
          src = lodash.keys(assemble.options.pages);
        }
      }

      // find an engine to use
      assemble.options.engine = assemble.options.engine || getEngineOf(src);
      if(!assemble.options.engine) {
        grunt.warn('No compatible engine available');
        done(false);
      }

      assemble.engine.load(assemble.options.engine);

      var initializeEngine = function(engine, options) { engine.init(options); };
      assemble.options.initializeEngine = assemble.options.initializeEngine || initializeEngine;

      var registerFunctions = function(engine) { engine.registerFunctions(); };
      assemble.options.registerFunctions = assemble.options.registerFunctions || registerFunctions;

      var registerPartial = function(engine, filename, content) { engine.registerPartial(filename, content); };
      assemble.options.registerPartial = assemble.options.registerPartial || registerPartial;

      assemble.fileExt = extension(src);
      assemble.filenameRegex = /[^\\\/:*?"<>|\r\n]+$/i;
      assemble.fileExtRegex = new RegExp('\\.' + assemble.fileExt + '$');

      assemble.partials = file.expand(assemble.options.partials);
      assemble.options.partials = {};

      assemble.dataFiles = file.expand(assemble.options.data);
      assemble.options.data = {};

      assemble.options.initializeEngine(assemble.engine, assemble.options);
      assemble.options.registerFunctions(assemble.engine);

      next(assemble);
    };

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
          var filename = _.first(filepath.match(assemble.filenameRegex)).replace(assemble.fileExtRegex, '');
          grunt.verbose.ok(('Processing ' + filename.cyan + ' partial'));

          var partial = grunt.file.read(filepath);

          //If the partial is empty, lets still allow it to be used.
          if(partial === '') {
            partial = '{{!}}';
          }

          // If options.removeHbsWhitespace is true
          partial = removeHbsWhitespace(assemble,partial);

          // get the data
          var partialInfo = assemble.data.readYFM(partial, {fromFile: false});
          assemble.options.data[filename] = _.extend(partialInfo.context || {}, assemble.options.data[filename] || {});

          // register the partial
          assemble.options.registerPartial(assemble.engine, filename, partialInfo.content);

          complete++;
        });
      }

      next(assemble);
    };

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

          var fileReader = dataFileReaderFactory(ext);

          var filecontent = grunt.file.read(filepath);

          //Skip empty data files, as they'd cause an error with compiler
          if(filecontent === '') {
            grunt.log.verbose.writeln('Reading ' + filepath + '...empty, ' + 'skipping'.yellow);
          } else {

            if(filename === 'data') {
              // if this is the base data file, load it into the options.data object directly
              assemble.options.data = _.extend(assemble.options.data || {}, fileReader(filepath));
            } else {
              // otherwise it's an element in options.data
              var d = fileReader(filepath);
              if(d[filename]) {
                // json object contains root object name so extend it in options.json
                assemble.options.data[filename] = _.extend(assemble.options.data[filename] || {}, d[filename]);
              } else {
                // add the entire object
                assemble.options.data[filename] = _.extend(assemble.options.data[filename] || {}, d);
              }
            }
            complete ++;
          }
        });
      }

      next(assemble);
    };

    var assemblePages = function(assemble, next) {

      // build each page
      grunt.verbose.writeln(('\n' + 'Building pages...').grey);

      var src = false;

      var assetsPath = assemble.options.assets;

      assemble.task.files.forEach(function(filePair) {

        // validate that the source object exists
        // and there are files at the source.
        if(!filePair.src) {
          grunt.warn('Missing src property.');
          return false;
        }
        if(filePair.src.length === 0 && (!assemble.options.pages)) {
          grunt.warn('Source files not found.');
          return false;
        }

        // validate that the dest object exists
        if(!filePair.dest || filePair.dest.length === 0) {
          grunt.warn('Missing dest property.');
          return false;
        }

        src = src || filePair.src;
        //var basePath = findBasePath(src, true);

        // some of the following code for figuring out
        // the destination files has been taken/inspired
        // by the grunt-contrib-copy project
        //https://github.com/gruntjs/grunt-contrib-copy
        var isExpandedPair = filePair.orig.expand || false;
        var destFile;

        var buildPage = function(srcFile, fileInfo) {

          var useFileInfo = (typeof fileInfo !== 'undefined');

          srcFile  = urlNormalize(path.normalize(srcFile));
          var filename = path.basename(srcFile, path.extname(srcFile));

          if(detectDestType(filePair.dest) === 'directory') {
            destFile = (isExpandedPair) ? filePair.dest : path.join(
              filePair.dest, (assemble.options.flatten ? path.basename(srcFile) : srcFile)
            );
          } else {
            destFile = filePair.dest;
          }

          destFile = urlNormalize(path.join(path.dirname(destFile), path.basename(destFile, path.extname(destFile)))) + assemble.options.ext;

          grunt.verbose.writeln('Reading ' + filename.magenta);

          // setup options.assets so it's the relative path to the
          // dest assets folder from the new dest file
          // TODO: this needs to be looked at again after the
          // other dest changes
          grunt.verbose.writeln('AssetsPath: ' + assetsPath);
          grunt.verbose.writeln('DestFile: ' + path.dirname(destFile));
          assemble.options.assets = urlNormalize(
            path.relative(path.resolve(path.dirname(destFile)), path.resolve(assetsPath))
          );

          // if the assets relative path is blank, then it's the same folder
          // so update to be '' or './'
          if (!assemble.options.assets || assemble.options.assets.length === 0) {
            // if the original path had a trailing slash
            if (hasTrailingSlash(assetsPath)) {
              // return './'
              assemble.options.assets = './';
            } else {
              // otherwise return ''
              assemble.options.assets = '';
            }
          }

          // if the original path had a trailing slash
          // and the calculated path does not,
          // add a trailing slash
          if (hasTrailingSlash(assetsPath) && !hasTrailingSlash(assemble.options.assets)) {

            assemble.options.assets += '/';

          // if the original path did not have a trailing slash
          // and the calculated path does,
          // remove the trailing slash
          } else if (!hasTrailingSlash(assetsPath) && hasTrailingSlash(assemble.options.assets)) {

            assemble.options.assets = assemble.options.assets.substring(0, assemble.options.assets.length - 2);

          }

          grunt.verbose.writeln(('\t' + 'Src: '    + srcFile));
          grunt.verbose.writeln(('\t' + 'Dest: '   + destFile));
          grunt.verbose.writeln(('\t' + 'Assets: ' + assemble.options.assets));

          var page = useFileInfo ? (fileInfo.content || '') : grunt.file.read(srcFile);
          try {
            grunt.verbose.writeln('compiling page ' + filename.magenta);
            var pageContext = {};

            // If the page file is empty, we still want to process it. Since the compiler
            // will choke on empty files let's pass it a non-rendering string instead.
            if(page === '') {
              page = '{{!}}';
            }

            // If options.removeHbsWhitespace is true
            page = removeHbsWhitespace(assemble, page);

            var pageInfo = assemble.data.readYFM(page, {fromFile: false});
            pageContext = useFileInfo ? (fileInfo.data || fileInfo.metadata || {}) : pageInfo.context;

            // // compile
            // assemble.engine.compile(pageInfo.content, null, function(err, tmpl) {
            //   if(err) {
            //     grunt.warn(err);
            //     done(false);
            //   }
            //   page = tmpl;
            // });

            var pageObj = {
              '_page': 'all',
              dirname : path.dirname(destFile),
              filename: path.basename(destFile),
              pageName: path.basename(destFile),
              pagename: path.basename(destFile),
              basename: path.basename(filename, path.extname(filename)),
              src: srcFile,
              dest: destFile,
              assets: assemble.options.assets,
              ext: assemble.options.ext,
              extname: assemble.options.ext,
              page: pageInfo.content,
              data: pageContext
            };

            if(pageObj.data.published === false) {
              grunt.log.write('\n>> Skipping "' + path.basename(srcFile).grey + '" since ' + '"published: false"'.cyan + ' was set.');
              return;
            }

            assemble.options.collections.pages.items[0].pages.push(pageObj);

            lodash.each(assemble.options.collections, function(item, key) {
              if(key !== 'pages') {
                assemble.options.collections[key] = assemble.util.collection.update(item, pageObj, pageContext);
              }
            });

          } catch(err) {
            grunt.warn(err);
            return false;
          }

          return true;
        };

        // build all the pages defined in the source property
        filePair.src.forEach(function(srcFile) {
          if(!buildPage(srcFile)) {
            return false;
          }
        }); // filePair.src.forEach

        // if there is a pages property, build all those
        if(assemble.options.pages) {
          lodash.forOwn(assemble.options.pages, function(fileInfo, filename) {
            if(!filename || filename.length === 0) {
              grunt.warn('Pages need a filename.');
              return false;
            }
            if(!buildPage(filename, fileInfo)) {
              return false;
            }
          });
        }

      }); // this.files.forEach

      grunt.verbose.writeln('information compiled');

      assemble.options.pages = assemble.util.collection.sort(assemble.options.collections.pages).items[0].pages;
      lodash.each(assemble.options.collections, function(item, key) {
        if(key !== 'pages') {
          assemble.options[key] = assemble.util.collection.sort(item).items;
        }
      });


      next(assemble);
    };

    var renderPages = function(assemble, next) {

      grunt.verbose.writeln(('\n' + 'Assembling pages...').yellow);

      assemble.options.pages.forEach(function(page) {

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
          file.write(page.dest, result);

          grunt.verbose.writeln('Assembled ' + (page.dest).cyan +' OK'.green);

          grunt.log.notverbose.ok();
        }); // build
      });
      grunt.log.ok(((assemble.options.pages).length).toString() + ' pages assembled.');

      next(assemble);
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
  // HELPERS
  // ==========================================================================
  var findBasePath = function(srcFiles, basePath) {
    if (basePath === false) {
      return '';
    }

    if (grunt.util.kindOf(basePath) === 'string' && basePath.length >= 1) {
      return grunt.util._(path.normalize(basePath)).trim(path.sep);
    }

    var foundPath;
    var basePaths = [];
    var dirName;

    srcFiles.forEach(function(srcFile) {
      srcFile = path.normalize(srcFile);
      dirName = path.dirname(srcFile);

      basePaths.push(dirName.split(path.sep));
    });

    basePaths = grunt.util._.intersection.apply([], basePaths);

    foundPath = path.join.apply(path, basePaths);

    if (foundPath === '.') {
      foundPath = '';
    }

    return foundPath;
  };


  var build = function(currentPage, assemble, callback) {

    var src = currentPage.srcFile;
    var filename = currentPage.filename;
    var options = assemble.options;

    grunt.verbose.writeln('currentPage: ' + currentPage);
    var page         = currentPage.page,
        pageContext  = currentPage.data,
        layout       = lodash.cloneDeep(options.defaultLayout),
        data         = options.data,
        pages        = options.pages,
        collections  = options.collections,
        engine       = options.engine,
        EngineLoader = options.EngineLoader,
        context      = {};

    grunt.verbose.writeln('variables loaded');

    //options.data = null;

    try {

      // omit the collections from pageContext when merging
      var pageCollections = lodash.pick(pageContext, lodash.keys(collections));
      pageContext = lodash.omit(pageContext, lodash.keys(collections));

      options.data    = undefined;
      options.pages   = undefined;
      options.layout  = undefined;
      options.collections = undefined;
      context         = _.extend(context, assemble.util.filterProperties(options), data, pageContext);
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
          data = _.extend(data, pageLayout.data);

          // extend again
          options.data = undefined;
          options.pages = undefined;
          options.layout = undefined;
          options.collections = undefined;
          context = _.extend(context, assemble.util.filterProperties(options), data, pageContext);
          options.data = data;
          options.pages = pages;
          options.collections = collections;
        }
      }


      // add omitted collections back to pageContext
      pageContext = lodash.merge(pageContext, pageCollections);
      context = processContext(grunt, context);

      // process the current page data
      currentPage.data = processContext(grunt, context, currentPage.data);

      // add the list of pages back to the context so
      // it's available in the templates
      context.pages = pages;
      context.page = currentPage;

      // apply any data for this page to the page object
      context.page = _.extend(context[currentPage.basename] || {}, currentPage.data, context.page);

      // make sure the currentPage assets is used
      context.assets = currentPage.assets;

      // add other page variables to the main context
      context.extname = currentPage.ext;
      context.basename = currentPage.basename;
      context.absolute = currentPage.dest;
      context.dirname = path.dirname(currentPage.dest);
      context.pagename = currentPage.filename;
      context.filename = currentPage.filename;
      // "pageName" is deprecated, use "pagename" or "filename"
      context.pageName = currentPage.filename;

      //assemble.options.registerPartial(assemble.engine, 'body', page);
      page = injectBody(layout.layout, page);

      assemble.engine.render(page, context, function(err, content) {
        if(err) {
          callback(err);
        }
        page = content;
        callback(null, page);
      });


    } catch(err) {
      callback(err);
      return;
    }
  };

  var processContext = function(grunt, context, data) {

      var originalConfigData = lodash.cloneDeep(grunt.config.data);
      grunt.config.data = _.extend(originalConfigData, context, data || {});

      if(data) {
        data = grunt.config.process(data);
      } else {
        context = grunt.config.process(context);
      }
      grunt.config.data = lodash.cloneDeep(originalConfigData);

      return data || context;
  };

  var loadLayout = function(src, assemble, callback) {

    var layoutStack = [];

    var load = function(src) {

      var loadFile = true;
      var layout = '';
      var layoutName = 'layout';

      // if the src is empty, create a default layout in memory
      if(!src || src === false || src === '' || src.length === 0 || src === 'none') {
        loadFile = false;
        layout = assemble.engine.startDelimiter + ' body ' + assemble.engine.endDelimiter; // '{{>body}}';
      }

      if(loadFile) {
        // validate that the layout file exists
        grunt.verbose.writeln(src);
        layout = path.normalize(path.join(assemble.options.layoutdir || '', src));
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
        layoutName = _.first(layout.match(assemble.filenameRegex)).replace(assemble.fileExtRegex,'');
        layout = grunt.file.read(layout);
        layout = layout.replace(/{{>\s*body\s*}}/, assemble.engine.startDelimiter + ' body ' + assemble.engine.endDelimiter);
      }

      // If options.removeHbsWhitespace is true
      layout = removeHbsWhitespace(assemble, layout);

      var layoutInfo = assemble.data.readYFM(layout, {fromFile: false});
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
      layout: assemble.engine.startDelimiter + 'body' + assemble.engine.endDelimiter, // '{{>body}}',
      data: {}
    };

    while (layoutInfo = layoutStack.pop()) {
      finalResults.layout = injectBody(finalResults.layout, layoutInfo.layout);
      finalResults.data = _.extend(finalResults.data, layoutInfo.data);
      finalResults.layoutName = layoutInfo.layoutName;
    }
    
    // assemble.engine.compile(finalResults.layout, null, function(err, tmpl) {
    //   if(err) {
    //     grunt.warn(err);
    //     if(callback) {
    //       callback(err);
    //     }
    //   }
    //   finalResults.layout = tmpl;
    // });

    if(callback) {
      callback(null, finalResults);
    }
    return finalResults;
  };

  var injectBody = function(layout, body) {
    return layout.replace(assemble.engine.bodyRegex, function() { return body; });
  };

  var detectDestType = function(dest) {
    if(_.endsWith(path.normalize(dest), path.sep)) {
      return 'directory';
    } else {
      return 'file';
    }
  };

  var hasTrailingSlash = function(filePath) {
    return _.endsWith(path.normalize(filePath), path.sep);
  };

  var logBlock = function(heading, message) {
    grunt.verbose.writeln(heading.cyan);
    grunt.verbose.writeln(message);
    grunt.verbose.writeln();
  };

  var getEngineOf = function(fileName) {
    var ext = extension(fileName);
    return  _( _(assemble.engine.extensions).keys() ).include(ext) ? assemble.engine.extensions[ext] : false;
  };

  var extension = function(fileName) {
    grunt.verbose.writeln('extension');
    grunt.verbose.writeln(fileName);
    if(kindOf(fileName) === 'array' && fileName.length > 0) {
      fileName = fileName[0];
    }
    return _(fileName.match(/[^.]*$/)).last();
  };

  // Windows? (from grunt.file)
  var win32 = process.platform === 'win32';
  var urlNormalize = function(urlString) {
    if (win32) {
    return urlString.replace(/\\/g, '/');
    } else {
      return urlString;
    }
  };

  var dataFileReaderFactory = function(ext) {
    var reader = grunt.file.readJSON;
    switch(ext) {
      case '.json':
        reader = grunt.file.readJSON;
        break;

      case '.yml':
      case '.yaml':
        reader = grunt.file.readYAML;
        break;
    }
    return reader;
  };

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

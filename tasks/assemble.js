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
  var lodash = require('lodash'); // required to ensure correct version is used

  // Assemble utils
  var assemble = require('../lib/assemble');

  grunt.registerMultiTask('assemble', 'Compile template files with specified engines', function(){

    var done = this.async();
    var self = this;

    // functions for use in build steps
    var optionsConfiguration = function(assemble, next) {
      grunt.verbose.writeln('validating options');

      if(_.endsWith(assemble.options.ext, '.')) {
        grunt.warn("Invalid ext '" + assemble.options.ext + "'. ext cannot end with a period.");
        done(false);
      }

      var src = false;
      assemble.files.forEach(function(fp) {
        if(!src) {
          src = fp.src;
        }
      });

      if(!src || src.length === 0) {
        grunt.warn('No source files found.');
        done(false);
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
      assemble.fileExtRegex = new RegExp("\\." + assemble.fileExt + "$");

      assemble.partials = file.expand(assemble.options.partials);
      assemble.options.partials = {};

      assemble.dataFiles = file.expand(assemble.options.data);
      assemble.options.data = {};

      assemble.options.initializeEngine(assemble.engine, assemble.options);
      assemble.options.registerFunctions(assemble.engine);

      next(assemble);
    };

    var assembleDefaultLayout = function(assemble, next) {
      grunt.verbose.writeln('assembling default layout');
      grunt.log.writeln('assembling'  + ' default layout'.cyan);

      // load default layout
      var defaultLayoutData = {};

      loadLayout(
        assemble.options.layout,
        assemble,
        function(err, results) {
          if(!err) {
            assemble.options.defaultLayoutName = results.layoutName;
            assemble.options.defaultLayout = results.layout;
            defaultLayoutData = results.data;
          } else {
            grunt.warn(err.message);
          }
        });

      // merge any layoutData with options
      assemble.options.data = _.extend(defaultLayoutData.context || {}, assemble.options.data || {});
      grunt.verbose.writeln(assemble.options.data);

      next(assemble);
    };

    var assemblePartials = function(assemble, next) {
      grunt.verbose.writeln('assembling partials');
      grunt.log.writeln('assembling'  + ' partials'.cyan);

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
      grunt.log.writeln('assembling' + ' data'.cyan);

      // load data if specified
      var dataFiles = assemble.dataFiles;
      if(dataFiles && dataFiles.length > 0) {
        complete = 0;
        increment = Math.round(dataFiles.length / 10);
        grunt.verbose.writeln(('\n' + 'Begin processing data...').grey);

        dataFiles.forEach(function(filepath) {
          var ext = path.extname(filepath);
          var filename = path.basename(filepath, ext);

          var fileReader = dataFileReaderFactory(ext);

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
          complete++;
        });
      }

      next(assemble);
    };

    var assemblePages = function(assemble, next) {
      grunt.verbose.writeln('assembling pages');
      // build each page
      grunt.verbose.writeln(('\n' + 'Building pages...').grey);

      var src = false;

      var pages = [];
      var collections = {};
      assemble.options.collections.forEach(function(item) {
        collections[item] = [];
      });

      var assetsPath = assemble.options.assets;

      assemble.task.files.forEach(function(filePair) {

        // validate that the source object exists
        // and there are files at the source.
        if(!filePair.src) {
          grunt.warn('Missing src property.');
          return false;
        }
        if(filePair.src.length === 0) {
          grunt.warn('Source files not found.');
          return false;
        }

        // validate that the dest object exists
        if(!filePair.dest || filePair.dest.length === 0) {
          grunt.warn('Missing dest property.');
          return false;
        }

        src = src || filePair.src;
        var basePath = findBasePath(src, true);

        // some of the following code for figuring out
        // the destination files has been taken/inspired
        // by the grunt-contrib-copy project
        //https://github.com/gruntjs/grunt-contrib-copy
        var isExpandedPair = filePair.orig.expand || false;
        var destFile;

        filePair.src.forEach(function(srcFile) {

          srcFile  = urlNormalize(path.normalize(srcFile));
          filename = path.basename(srcFile, path.extname(srcFile));

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
          // so update to be ''
          if(!assemble.options.assets || assemble.options.assets.length === 0) {
            assemble.options.assets = '';
          }

          grunt.verbose.writeln(('\t' + 'Src: '    + srcFile));
          grunt.verbose.writeln(('\t' + 'Dest: '   + destFile));
          grunt.verbose.writeln(('\t' + 'Assets: ' + assemble.options.assets));

          var page = grunt.file.read(srcFile);
          try {
            grunt.verbose.writeln('compiling page ' + filename.magenta);
            var pageContext = {};

            // If options.removeHbsWhitespace is true
            page = removeHbsWhitespace(assemble,page);

            var pageInfo = assemble.data.readYFM(page, {fromFile: false});
            pageContext = pageInfo.context;

            // compile
            assemble.engine.compile(pageInfo.content, null, function(err, tmpl) {
              if(err) {
                grunt.warn(err);
                done(false);
              }
              page = tmpl;
            });

            var pageObj = {
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
              page: page,
              data: pageContext
            };

            if(pageObj.data.published === false){
              grunt.log.write('\n>> Skipping "' + path.basename(srcFile).grey + '" since ' + '"published: false"'.cyan + ' was set.');
              return;
            }

            pages.push(pageObj);

            assemble.options.collections.forEach(function(item) {
              collections[item] = assemble.util.collection.update(item, collections[item], pageObj, pageContext);
            });

          } catch(err) {
            grunt.warn(err);
            return;
          }
        }); // filePair.src.forEach
      }); // this.files.forEach

      grunt.verbose.writeln('information compiled');

      assemble.options.pages = pages;
      assemble.options.collections.forEach(function(item) {
        assemble.options[item] = collections[item];
      });


      next(assemble);
    };

    var renderPages = function(assemble, next) {

      grunt.log.writeln(('\n' + 'Assembling pages...').grey);

      assemble.options.pages.forEach(function(page) {

        grunt.verbose.writeln(require('util').inspect(page));

        build(page, assemble, function(err, result) {
          grunt.log.notverbose.write('File "' + path.basename(page.dest).magenta +'" assembled...');
          grunt.verbose.write('File "' + page.dest.magenta +'" assembled...');

          if(err) {
            grunt.verbose.write(" ");
            grunt.log.error();
            grunt.warn(err);
            done(false);
            return;
          }
          grunt.verbose.writeln('..');
          file.write(page.dest, result);

          grunt.verbose.writeln('...File "' + (page.basename + page.ext).magenta +'" assembled. '+'OK'.green);
          grunt.log.notverbose.ok();
        }); // build
      });
      grunt.log.ok('Assembled ' + ((assemble.options.pages).length).toString().cyan + ' pages.');

      next(assemble);
    };

    grunt.verbose.writeflags(assemble.options, 'Assemble options');

    // assemble everything
    var assembler = assemble.init(this)
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
        layout       = options.defaultLayout,
        data         = options.data,
        pages        = options.pages,
        engine       = options.engine,
        EngineLoader = options.EngineLoader,
        context      = {};

    context.layoutName = _(options.defaultLayoutName).humanize();
    grunt.verbose.writeln('variables loaded');

    //options.data = null;

    try {

      // omit the collections from pageContext when merging
      var pageCollections = lodash.pick(pageContext, options.collections);
      pageContext = lodash.omit(pageContext, options.collections);

      options.data   = undefined;
      options.pages  = undefined;
      options.layout = undefined;
      context        = _.extend(context, options, data, pageContext);
      options.data   = data;
      options.pages  = pages;

      // if pageContext contains a layout, use that one instead
      // of the default layout
      if(pageContext && pageContext.layout) {

        var pageLayoutName = null,
            pageLayout = null,
            pageLayoutContext = {};

        context = processContext(grunt, context);

        loadLayout(
          context.layout,
          assemble,
          function(err, results) {
            if(!err) {
              pageLayoutName = results.layoutName;
              pageLayout = results.layout;
              pageLayoutContext = results.data.context;
            } else {
              grunt.warn(err.message);
            }
          }
        );

        if(pageLayout) {
          layout = pageLayout;
          context.layoutName = pageLayoutName;
          data = _.extend(data, pageLayoutContext);

          // extend again
          options.data   = undefined;
          options.pages  = undefined;
          options.layout = undefined;
          context        = _.extend(context, options, data, pageContext);
          options.data   = data;
          options.pages  = pages;
        }
      }


      // add omitted collections back to pageContext
      pageContext = lodash.merge(pageContext, pageCollections);
      context = processContext(grunt, context);

      // add the list of pages back to the context so
      // it's available in the templates
      context.pages = pages;
      context.page = currentPage;

      // apply any data for this page to the page object
      context.page = _.extend(context[filename] || {}, currentPage.data, context.page);

      // make sure the currentPage assets is used
      context.assets = currentPage.assets;

      // add other page variables to the main context
      context.extname  = currentPage.ext;
      context.basename = currentPage.basename;
      context.absolute = currentPage.dest;
      context.dirname  = path.dirname(currentPage.dest);
      context.pagename = currentPage.filename;
      context.filename = currentPage.filename;
      // "pageName" is deprecated, use "pagename" or "filename"
      context.pageName = currentPage.filename;

      assemble.options.registerPartial(assemble.engine, 'body', page);

      assemble.engine.render(layout, context, function(err, content) {
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

  var processContext = function(grunt, context) {
      var originalConfigData = grunt.config.data;
      grunt.config.data = _.extend(originalConfigData, context);
      context = grunt.config.process(context);
      grunt.config.data = originalConfigData;

      return context;
  };

  var loadLayout = function(src, assemble, callback) {

    var loadFile = true;
    var layout = '';
    var layoutName = 'layout';

    // if the src is empty, create a default layout in memory
    if(src === '' || src.length === 0) {
      loadFile = false;
      layout = "{{>body}}";
    }
    
    if(loadFile) {
      // validate that the layout file exists
      grunt.verbose.writeln(src);
      layout = path.normalize(src);
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
    }

    // If options.removeHbsWhitespace is true
    layout = removeHbsWhitespace(assemble, layout);

    var layoutInfo = assemble.data.readYFM(layout, {fromFile: false});
    var layoutData = layoutInfo.context;
    assemble.engine.compile(layoutInfo.content, null, function(err, tmpl) {
      if(err) {
        grunt.warn(err);
        if(callback) {
          callback(err);
        }
      }
      layout = tmpl;
    });

    var results = {
      layoutName: layoutName,
      layout: layout,
      data: layoutData
    };

    if(callback) {
      callback(null, results);
    }
    return results;
  };

  var detectDestType = function(dest) {
    if(_.endsWith(path.normalize(dest), path.sep)) {
      return "directory";
    } else {
      return "file";
    }
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
    if(kindOf(fileName) === "array" && fileName.length > 0) {
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
  var removeHbsWhitespace = function(assemble, filecontent){
    if(assemble.options.removeHbsWhitespace){
      filecontent = filecontent.replace(/(\n|\r|\n\r)[\t ]*(\{\{\{[^}]+?\}\}\})(?=(\n|\r|\n\r))/gi,"$2");
      filecontent = filecontent.replace(/(\n|\r|\n\r)[\t ]*(\{\{[^}]+?\}\})(?=(\n|\r|\n\r))/gi,"$2");
    }
    return filecontent;
  };

  var mergeOptionsArrays = function(target, name) {
    var globalArray = grunt.config(['assemble', 'options', name]) || [];
    var targetArray = grunt.config(['assemble', target, 'options', name]) || [];
    return _.union(globalArray, targetArray);
  };

  var updateTags = function(tags, page, context) {
    return assemble.util.collection.update('tags', tags, page, context);
  };

  var updateCategories = function(categories, page, context) {
    return assemble.util.collection.update('categories', categories, page, context);
  };

};
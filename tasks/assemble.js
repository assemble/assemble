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
  var assemble   = require('../lib/assemble');
  var utils      = assemble.Utils;
  var extensions = utils.ExtensionMap;

  //Removes extra whitespace around {{}}-elements somewhat like .mustache does.
  var removeHbsWhitespace = function(assemble,filecontent){
    if(assemble.options.removeHbsWhitespace){
      filecontent = filecontent.replace(/(\n|\r|\n\r)[\t ]*(\{\{\{[^}]+?\}\}\})(?=(\n|\r|\n\r))/gi,"$2");
      filecontent = filecontent.replace(/(\n|\r|\n\r)[\t ]*(\{\{[^}]+?\}\})(?=(\n|\r|\n\r))/gi,"$2");
    }
    return filecontent;
  };

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

      assemble.engineLoader = utils.EngineLoader(assemble.options);
      var engine = null;
      assemble.engineLoader.getEngine(function(err, results) {
        if(err) {
          console.log(err);
          return;
        }
        engine = assemble.engine = results;
      });

      assemble.yamlPreprocessor = assemble.engineLoader.getPreprocessor('YamlPreprocessor');

      assemble.fileExt = extension(src);
      assemble.filenameRegex = /[^\\\/:*?"<>|\r\n]+$/i;
      assemble.fileExtRegex = new RegExp("\\." + assemble.fileExt + "$");

      assemble.partials = file.expand(assemble.options.partials);
      assemble.options.partials = {};

      assemble.dataFiles = file.expand(assemble.options.data);
      assemble.options.data = {};

      next(assemble);
    };

    var assembleDefaultLayout = function(assemble, next) {
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
      assemble.options.data = _.extend(defaultLayoutData.context, assemble.options.data || {});

      next(assemble);
    };

    var assemblePartials = function(assemble, next) {
      grunt.log.writeln('assembling'  + ' partials'.cyan);

      var complete = 0;
      var increment = 10;

      // load partials if specified
      var partials = assemble.partials;
      if(partials && partials.length > 0) {
        complete = 0;
        increment = Math.round(partials.length / 10);
        grunt.verbose.write(('\n' + 'Processing partials...').grey);

        partials.forEach(function(filepath) {
          var filename = _.first(filepath.match(assemble.filenameRegex)).replace(assemble.fileExtRegex, '');
          grunt.verbose.ok(('Processing ' + filename.cyan + ' partial'));
          if(complete%increment === 0) {
            grunt.log.write('.'.cyan);
          }

          var partial = fs.readFileSync(filepath, 'utf8');

          //If remove hbs whitespace...
          partial = removeHbsWhitespace(assemble,partial);

          partial = assemble.engine.compile(partial, {
            preprocessers: [
              assemble.yamlPreprocessor(filename, function(output) {
                assemble.options.data[output.name] = _.extend(output.output.context, assemble.options.data[output.name] || {});
              })
            ]
          });

          // register the partial with the engine
          assemble.engine.engine.registerPartial(filename, partial);
          complete++;
        });
        grunt.log.notverbose.writeln('\n');
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

          if(complete%increment === 0) {
            grunt.log.notverbose.write('.'.cyan);
          }

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
      // build each page
      grunt.verbose.writeln(('\n' + 'Building pages...').grey);

      var src = false;

      var pages = [];
      var tags = [];
      var categories = [];
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

          srcFile  = path.normalize(srcFile);
          filename = path.basename(srcFile, path.extname(srcFile));

          if(detectDestType(filePair.dest) === 'directory') {
            destFile = (isExpandedPair) ?
                        filePair.dest :
                        path.join(filePair.dest,
                                  (assemble.options.flatten ?
                                    path.basename(srcFile) :
                                    srcFile));
          } else {
            destFile = filePair.dest;
          }

          destFile = path.join(path.dirname(destFile),
                               path.basename(destFile, path.extname(destFile))
                              ) + assemble.options.ext;

          grunt.verbose.writeln('Reading ' + filename.magenta);

          // setup options.assets so it's the relative path to the
          // dest assets folder from the new dest file
          // TODO: this needs to be looked at again after the
          // other dest changes
          grunt.verbose.writeln('AssetsPath: ' + assetsPath);
          grunt.verbose.writeln('DestFile: ' + path.dirname(destFile));
          assemble.options.assets = urlNormalize(
            path.relative(
              path.resolve(path.dirname(destFile)),
              path.resolve(assetsPath)
            ));

          grunt.verbose.writeln(('\t' + 'Src: '    + srcFile));
          grunt.verbose.writeln(('\t' + 'Dest: '   + destFile));
          grunt.verbose.writeln(('\t' + 'Assets: ' + assemble.options.assets));

          var page = fs.readFileSync(srcFile, 'utf8');
          try {
            grunt.verbose.writeln('compiling page ' + filename.magenta);
            var pageContext = {};

            //If remove hbs whitespace...
            page = removeHbsWhitespace(assemble,page);

            page = assemble.engine.compile(page, {
              preprocessers: [
                assemble.yamlPreprocessor(filename, function(output) {
                  grunt.verbose.writeln(output.name + ' data retreived');
                  pageContext = output.output.context;
                })
              ]
            });

            var pageObj = {
              filename: filename,
              basename: filename,
              src: srcFile,
              dest: destFile,
              assets: assemble.options.assets,
              ext: assemble.options.ext,
              page: page,
              data: pageContext
            };

            pages.push(pageObj);

            tags = updateTags(tags, pageObj, pageContext);
            categories = updateCategories(categories, pageObj, pageContext);

          } catch(err) {
            grunt.warn(err);
            return;
          }
        }); // filePair.src.forEach
      }); // this.files.forEach

      grunt.verbose.writeln('information compiled');

      assemble.options.pages = pages;
      assemble.options.tags = tags;
      assemble.options.categories = categories;


      next(assemble);
    };

    var renderPages = function(assemble, next) {

      grunt.log.writeln(('\n' + 'Rendering pages...').grey);

      assemble.options.pages.forEach(function(page) {

        grunt.verbose.writeln(require('util').inspect(page));

        build(page, assemble, function(err, result) {
          grunt.log.notverbose.write('File ' + (page.basename + page.ext).magenta +' processing. ');
          grunt.verbose.write('File ' + (page.basename + page.ext).magenta +' processing.');

          if(err) {
            grunt.verbose.write(" ");
            grunt.log.error();
            grunt.warn(err);
            done(false);
            return;
          }
          grunt.verbose.writeln('..');
          file.write(page.dest, result);

          grunt.verbose.writeln('...File ' + (page.basename + page.ext).magenta +' processed. '+'OK'.green);
          grunt.log.notverbose.ok();
        }); // build
      });
      grunt.log.ok((assemble.options.pages).length + ' pages rendered successfully.');

      next(assemble);
    };

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
    var page           = currentPage.page,
        pageContext    = currentPage.data,
        layout         = options.defaultLayout,
        data           = options.data,
        pages          = options.pages,
        engine         = options.engine,
        EngineLoader   = options.EngineLoader,
        context        = {};

    context.layoutName = _(options.defaultLayoutName).humanize();
    context.pageName   = _(filename).humanize();
    context.pageName   = filename;

    grunt.verbose.writeln('variables loaded');

    //options.data = null;

    try {

      // omit the tags and categories from pageContext when merging
      var pageTags = pageContext.tags || [];
      var pageCategories = pageContext.categories || [];
      pageContext = lodash.omit(pageContext, ['tags', 'categories']);

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


      pageContext.tags = pageTags;
      pageContext.categories = pageCategories;

      context = processContext(grunt, context);

      // add the list of pages back to the context so
      // it's available in the templates
      context.pages = pages;
      context.currentPage = currentPage;

      // make sure the currentPage assets is used
      context.assets = currentPage.assets;

      // add a sections array to the engine to be used by
      // helpers
      assemble.engine.engine.sections = [];

      assemble.engine.engine.registerPartial("body", page);
      page = layout(context);

      callback(null, page);
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
      layout = fs.readFileSync(layout, 'utf8');
    }

    //If remove hbs whitespace...
    layout = removeHbsWhitespace(assemble,layout);

    var layoutData = {};
    layout = assemble.engine.compile(layout, {
      preprocessers: [
        assemble.yamlPreprocessor(layoutName, function(output) {
          grunt.verbose.writeln(output.name + ' data retreived');
          layoutData = output.output;
        })
      ]
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
    return  _( _(extensions).keys() ).include(ext) ? extensions[ext] : false;
  };

  var extension = function(fileName) {
    grunt.verbose.writeln('extension');
    grunt.verbose.writeln(fileName);
    if(kindOf(fileName) === "array" && fileName.length > 0) {
      fileName = fileName[0];
    }
    return _(fileName.match(/[^.]*$/)).last();
  };

  var urlNormalize = function(urlString) {
    return urlString.replace(/\\/g, '/');
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

  var mergeOptionsArrays = function(target, name) {
    var globalArray = grunt.config(['assemble', 'options', name]) || [];
    var targetArray = grunt.config(['assemble', target, 'options', name]) || [];
    return _.union(globalArray, targetArray);
  };

  var updateTags = function(tags, page, context) {
    if(!context.tags) {
      return tags;
    }

    var pageTags = context.tags || [];
    if(toString.call(pageTags) !== '[object Array]') {
      pageTags = [pageTags];
    }

    pageTags.forEach(function(pageTag) {
      var tagIndex = lodash.findIndex(tags, function(tag) {
        return tag.tag === pageTag;
      });
      if(tagIndex === -1) {
        tags.push({ tag: pageTag, pages: [page] });
      } else {
        tags[tagIndex].pages.push(page);
      }
    });
    return tags;
  };

  var updateCategories = function(categories, page, context) {
    if(!context.categories) {
      return categories;
    }

    var pageCategories = context.categories || [];
    if(toString.call(pageCategories) !== '[object Array]') {
      pageCategories = [pageCategories];
    }

    pageCategories.forEach(function(pageCategory) {
      var categoryIndex = lodash.findIndex(categories, function(category) {
        return category.category === pageCategory;
      });
      if(categoryIndex === -1) {
        categories.push({ category: pageCategory, pages: [page] });
      } else {
        categories[categoryIndex].pages.push(page);
      }
    });
    return categories;
  };

};

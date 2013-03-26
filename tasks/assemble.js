/*
 * Assemble
 * https://github.com/assemble/assemble
 *
 * Copyright (c) 2012 Brian Woodward
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Grunt utilities
  var file     = grunt.file;
  var log      = grunt.log;
  var kindOf   = grunt.util.kindOf;
  var _        = grunt.util._;

  var assemble = require('../lib/assemble');

  // external dependencies
  var path     = require('path');
  var fs       = require('fs');
  var util     = require('util');

  var extensions = assemble.Utils.ExtensionMap;

  grunt.registerMultiTask('assemble', 'Compile template files with specified engines', function(){


    var options = this.options({
      layout        : '',
      partials      : [],
      data          : [],
      assets        : 'dist/assets',
      ext           : '.html'
    });

    logBlock("options: ", util.inspect(options));
    logBlock("this.files: ", util.inspect(this.files));

    options.data = mergeOptionsArrays(this.target, 'data');
    options.partials = mergeOptionsArrays(this.target, 'partials');

    // try to get a src to use for configuration
    var src = false;
    this.files.forEach(function(fp) {
      if(!src) {
        src = fp.src;
      }
    });

    if(!src || src.length === 0) {
      grunt.warn('No source files found.');
      return false;
    }

    // find an engine to use
    options.engine = options.engine || getEngineOf(src);
    if(!options.engine) {
      grunt.warn('No compatible engine available');
      return false;
    }

    var EngineLoader = options.EngineLoader = assemble.EngineLoader(options);
    var engine = null;
    EngineLoader.getEngine(function(err, results) {
      if(err) {
        console.log(err);
        return;
      }
      engine = options.engine = results;
    });

    var yamlPreprocessor = EngineLoader.getPreprocessor('YamlPreprocessor');

    var partials      = file.expand(options.partials);
    var dataFiles     = file.expand(options.data);
    var fileExt       = extension(src);
    var filenameRegex = /[^\\\/:*?"<>|\r\n]+$/i;
    var fileExtRegex  = new RegExp("\\." + fileExt + "$");

    options.filenameRegex = filenameRegex;
    options.fileExtRegex = fileExtRegex;

    var done = this.async();

    // clear out the partials and data objects on options
    options.partials = {};
    options.data = {};

    // load default layout
    var defaultLayoutName,
        defaultLayout,
        defaultLayoutData = {};

    loadLayout(
      options.layout,
      {
        filenameRegex: filenameRegex,
        fileExtRegex: fileExtRegex,
        EngineLoader: EngineLoader,
        engine: engine
      },
      function(err, results) {
        if(!err) {
          defaultLayoutName = results.layoutName;
          defaultLayout = results.layout;
          defaultLayoutData = results.data;
        } else {
          grunt.warn(err.message);
        }
      });

    // merge any layoutData with options
    options.data = _.extend(defaultLayoutData.context, options.data || {});

    var complete = 0;
    var increment = 10;

    // load partials if specified
    if(partials && partials.length > 0) {
      complete = 0;
      increment = Math.round(partials.length / 10);
      log.write(('\n' + 'Processing partials...').grey);

      partials.forEach(function(filepath) {
        var filename = _.first(filepath.match(filenameRegex)).replace(fileExtRegex, '');
        grunt.verbose.writeln(('Processing ' + filename + ' partial').cyan);
        if(complete%increment === 0) {
          log.write('.'.cyan);
        }

        var partial = fs.readFileSync(filepath, 'utf8');

        partial = engine.compile(partial, {
          preprocessers: [
            yamlPreprocessor(filename, function(output) {
              options.data[output.name] = _.extend(output.output.context, options.data[output.name] || {});
            })
          ]
        });

        // register the partial with the engine
        engine.engine.registerPartial(filename, partial);
        complete++;
      });
      log.notverbose.writeln('\n');
    }

    // load data if specified
    if(dataFiles && dataFiles.length > 0) {
      complete = 0;
      increment = Math.round(dataFiles.length / 10);
      log.writeln(('\n' + 'Begin processing data...').grey);

      dataFiles.forEach(function(filepath) {
        var ext = path.extname(filepath);
        var filename = path.basename(filepath, ext);

        var fileReader = dataFileReaderFactory(ext);

        if(complete%increment === 0) {
          log.notverbose.write('.'.cyan);
        }

        if(filename === 'data') {
          // if this is the base data file, load it into the options.data object directly
          options.data = _.extend(options.data || {}, fileReader(filepath));
        } else {
          // otherwise it's an element in options.data
          var d = fileReader(filepath);
          if(d[filename]) {
            // json object contains root object name so extend it in options.json
            options.data[filename] = _.extend(options.data[filename] || {}, d[filename]);
          } else {
            // add the entire object
            options.data[filename] = _.extend(options.data[filename] || {}, d);
          }
        }
        complete++;
      });
      log.writeln('\n');
    }

    options.defaultLayout     = defaultLayout;
    options.defaultLayoutName = defaultLayoutName;

    // build each page
    log.writeln(('\n' + 'Building partials...').grey);

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


    var basePath = findBasePath(src, true);
    //var assetsPath = path.join(dest, options.assets);
    var assetsPath = options.assets;
    if(assetsPath === "." || assetsPath.length === 0) {
      assetsPath = dest;
    }


    this.files.forEach(function(filePair) {
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
      var dest = path.normalize(filePair.dest);

      filePair.src.forEach(function(srcFile) {
        srcFile  = path.normalize(srcFile);
        filename = path.basename(srcFile).replace(fileExtRegex,'');

        grunt.verbose.writeln('Reading ' + filename.magenta);

        relative = path.dirname(srcFile);
        relative = _(relative).strRight(basePath).trim(path.sep);
        relative = relative.replace(/\.\.(\/|\\)/g, '');

        destFile = path.join(dest, relative, filename + options.ext);

        // setup options.assets so it's the relative path to the
        // dest assets folder from the new dest file
        options.assets = urlNormalize(
          path.relative(
            path.resolve(path.join(dest, relative)),
            path.resolve(assetsPath)
          ));

        grunt.verbose.writeln(('\t' + 'Src: '    + srcFile));
        grunt.verbose.writeln(('\t' + 'Dest: '   + destFile));
        grunt.verbose.writeln(('\t' + 'Assets: ' + options.assets));

        build(srcFile, filename, options, function(err, result) {
          if(err) {
            grunt.warn(err);
            done(false);
            return;
          }

          file.write(destFile, result);
          grunt.log.ok('File ' + (filename + options.ext).magenta + ' created.' + ' ok '.green);
        }); // build

      }); // filePair.src.forEach
    }); // this.files.forEach

    if(done) {
      done();
    }

  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================
  var build = function(src, filename, options, callback) {

    var page           = fs.readFileSync(src, 'utf8'),
        layout         = options.defaultLayout,
        data           = options.data,
        engine         = options.engine,
        EngineLoader   = options.EngineLoader,
        context        = {};

    context.layoutName = _(options.defaultLayoutName).humanize();
    context.pageName   = _(filename).humanize();
    context.pageName   = filename;

    //options.data = null;

    try {

      var pageContext = {};
      var yamlPreprocessor = EngineLoader.getPreprocessor('YamlPreprocessor');

      page = engine.compile(page, {
        preprocessers: [
          yamlPreprocessor(filename, function(output) {
            grunt.verbose.writeln(output.name + ' data retreived');
            pageContext = output.output.context;
          })
        ]
      });

      options.data   = undefined;
      options.layout = undefined;
      options.engine = undefined;
      options.EngineLoader = undefined;
      context        = _.extend(context, options, data, pageContext);
      options.data   = data;
      options.layout = layout;
      options.engine = engine;
      options.EngineLoader = EngineLoader;

      // if pageContext contains a layout, use that one instead
      // of the default layout
      if(pageContext && pageContext.layout) {

        var pageLayoutName = null,
            pageLayout = null,
            pageLayoutContext = {};

        context = processContext(grunt, context);

        loadLayout(
          context.layout,
          {
            filenameRegex: options.filenameRegex,
            fileExtRegex: options.fileExtRegex,
            EngineLoader: EngineLoader,
            engine: engine
          },
          function(err, results) {
            if(!err) {
              pageLayoutName = results.layoutName;
              pageLayout = results.layout;
              pageLayoutContext = results.data;
            } else {
              grunt.warn(err.message);
            }
          }
        );

        if(pageLayout) {
          layout = pageLayout;
          context.layoutName = pageLayoutName;
          data = _.extend(data, pageLayoutContext);
        }

      }

      engine.engine.registerPartial("body", page);

      context = processContext(grunt, context);
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

  var loadLayout = function(src, options, callback) {

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
      grunt.log.writeln(src);
      layout = path.normalize(src);
      grunt.log.writeln(layout);

      if(!fs.existsSync(layout)) {
        var err = 'Layout file (' + layout + ') not found.';
        grunt.warn(err);
        if(callback) {
          callback({message: err}, null);
        }
        return false;
      }

      // load layout
      layoutName = _.first(layout.match(options.filenameRegex)).replace(options.fileExtRegex,'');
      layout = fs.readFileSync(layout, 'utf8');
    }

    var layoutData = {};
    var yamlPreprocessor = options.EngineLoader.getPreprocessor('YamlPreprocessor');
    layout = options.engine.compile(layout, {
      preprocessers: [
        yamlPreprocessor(layoutName, function(output) {
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
    if(_.endsWith(dest, path.sep)) {
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

};

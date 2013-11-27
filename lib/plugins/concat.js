/**
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var async = require('async');

var options = {
  stage: 'render:*:*'
};

var dest = '';
var src = '';
var template = '';
var separator = '';
var context = {};
var content = '';
var pages = {};

var plugin = function(params, next) {

  var options = params.assemble.options;
  if(!options.concat || options.concat === 'undefined') {
    next();
    return;
  }

  var assemble = params.assemble;
  var grunt = params.grunt;

  var render = function(tmpl, context) {
    var rtn = '';
    async.series([
      function(callback) {
        assemble.engine.render(tmpl, context, callback);
      }
    ],
    function(err, results) {
      rtn = results[0];
    });
    return rtn;
  };

  var prePages = function () {
    dest = options.concat.dest;
    src = options.concat.src || options.concat.template || '';
    separator = options.concat.separator || '\n\n';
    template = src;
    context = {};
    content = '';
    pages = {};

    for(var i = 0; i < options.pages.length; i++) {
      pages[options.pages[i].dest] = options.pages[i].page;
    }

    next();
  };

  var prePage = function () {

    var pageContext = params.context;

    async.waterfall([
      // render heading
      function(callback) {
        var ctx = {
          page: {
            title: pageContext.page.title || pageContext.basename
          }
        };
        var heading = render(separator, ctx);
        callback(null, heading);
      },

      // render page
      function(heading, callback) {
        var pageContent = render(pages[pageContext.page.dest], pageContext);
        var rtn = heading + pageContent;
        callback(null, rtn);
      }
    ],
    function(err, results) {
      content += results;
      next();
    });

  };

  var postPages = function () {
    var tmpl = template.replace('{{content}}', content);
    grunt.file.write(dest, tmpl);
    next();
  };


  switch(params.stage) {
    case 'render:pre:pages':
      prePages();
      break;
    case 'render:pre:page':
      prePage();
      break;
    case 'render:post:page':
      next();
      break;
    case 'render:post:pages':
      postPages();
      break;
    default:
      next();
      break;
  }

};


// export options
plugin.options = options;
module.exports = plugin;

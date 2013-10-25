/**
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */


// This plugin will run before the pages are rendered to
// generate a pagination object that can be used to find
// the previous and next pages
var options = {
  stage: 'render:pre:*'
};


var plugin = function(params, next) {

  var buildPaginationInfo = function() {
    
    var pages = params.assemble.options.pages;

    var prevPage = null;
    for (var i = 0; i < pages.length; i++) {
    
      pages[i].index = i;
    
      if(prevPage !== null) {
        pages[i].prev = prevPage;
      }
    
      if(i < pages.length - 1){
        pages[i].next = i + 1;
      }
    
      prevPage = i;
    }

  };

  var addPaginationInfoToContext = function() {

    var context = params.context;
    var currentPage = context.page;

    params.context.pagination = {
      prev: context.pages[currentPage.prev || 0],
      next: context.pages[currentPage.next || (context.pages.length - 1)],
      totalPages: context.pages.length,
      currentPage: currentPage.index + 1
    };

  };

  if (params.stage === 'render:pre:pages') {
    buildPaginationInfo();
  } else if (params.stage === 'render:pre:page') {
    addPaginationInfoToContext();
  }

  next();
};

// export options
plugin.options = options;

module.exports = plugin;

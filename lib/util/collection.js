
var inflection = require('inflection');
var _          = require('lodash');

var collection = {

  update: function(colName, col, page, context) {

    if(!context[colName]) {
      return col;
    }

    var singularName = inflection.singularize(colName);

    var pageCol = context[colName] || [];
    if(toString.call(pageCol) !== '[object Array]') {
      pageCol = [pageCol];
    }

    pageCol.forEach(function(pageItem) {
      if(!col[pageItem]) {
        var obj = {};
        obj[singularName] = pageItem;
        obj.pages = [page];
        col[pageItem] = obj;
      } else {
        col[pageItem].pages.push(page);
      }
    });
    return col;
  }

};


module.exports = exports = collection;

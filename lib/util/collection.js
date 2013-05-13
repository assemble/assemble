
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

      var i = _.findIndex(col, function(item) {
        return item[singularName] === pageItem;
      });

      if(i === -1) {
        var obj = {};
        obj[singularName] = pageItem;
        obj.pages = [page];
        col.push(obj);
      } else {
        col[i].pages.push(page);
      }
    });
    return col;
  }

};


module.exports = exports = collection;

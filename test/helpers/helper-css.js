(function() {
  module.exports.register = function(Handlebars, options) {
    var path = require('path');

    var getExt = function(str) {
      var extname = path.extname(str);
      if (extname) {
        str = extname;
      }
      if (str[0] === ".") {
        str = str.substring(1);
      }
      return str;
    };

    Handlebars.registerHelper("css", function(context) {
      var time = new Date().getTime();
      if (!Array.isArray(context)) {
        context = [context];
      }
      return new Handlebars.SafeString(context.map(function(item) {
        var ext = getExt(item);
        var css = '<link rel="stylesheet" href="' + options.assets + '/css/' + item + '?v=' + time + '">';
        var less = '<link rel="stylesheet/less" href="' + options.assets + '/less/' + item + '?v=' + time + '">';
        switch (ext) {
          case "less":
            return less;
          case "css":
            return css;
          default:
            return css;
        }
      }).join("\n"));
    });


  };
}).call(this);

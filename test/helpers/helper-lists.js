(function() {
  module.exports.register = function(Handlebars, options) {

    var toString = function(val) {
      if (val == null) {
        return "";
      } else {
        return val.toString();
      }
    };
    var switchOutput = function(ext, md, html) {
      var output;
      switch (ext) {
        case "":
        case ".md":
          output = md;
          break;
        case ".html":
        case ".htm":
          output = html;
      }
      return output;
    };
    var isUndefined = function(value) {
      return value === 'undefined' || toString.call(value) === '[object Function]' || (value.hash != null);
    };

    var parseAttributes = function(hash) {
      return Object.keys(hash).map(function(key) {
        return "" + key + "=\"" + hash[key] + "\"";
      }).join(' ');
    };

    Handlebars.registerHelper("_link", function(url, text, linkClass) {
      url = Handlebars.Utils.escapeExpression(url);
      text = Handlebars.Utils.escapeExpression(text);
      if (isUndefined(linkClass)) {
        linkClass = "";
      }
      var md = '[' + text + '](' + url + ')';
      var html = '<a class="' + linkClass + '" href="' + url + '" title="' + text + '">' + text + '</a>';
      var result = switchOutput(options.ext, md, html);
      return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper("ul", function(context, options) {
      return ("<ul " + (parseAttributes(options.hash)) + ">") + context.map(function(item) {
        return "<li>" + (options.fn(item)) + "</li>";
      }).join("\n") + "</ul>";
    });
    Handlebars.registerHelper("ol", function(context, options) {
      return ("<ol " + (parseAttributes(options.hash)) + ">") + context.map(function(item) {
        return "<li>" + (options.fn(item)) + "</li>";
      }).join("\n") + "</ol>";
    });

  };
}).call(this);

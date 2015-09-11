var Handlebars = require('handlebars');

module.exports = function (context, pattern, options) {
  var match = new RegExp(pattern).test(context);
  if(match) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

Handlebars.registerHelper('test', function (context, pattern, options) {
  var match = new RegExp(pattern).test(context);
  if(match) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
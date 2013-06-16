module.exports.register = register = function(Handlebars, options) {

  Handlebars.registerHelper('foo2', function(msg) {
    return '<!-- foo2 -->\n<!-- ' + msg + ' -->';
  });

  Handlebars.registerHelper('opt', function(key) {
    return options[key] || '';
  });

};

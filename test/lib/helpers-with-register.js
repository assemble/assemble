module.exports.register = register = function(Handlebars, options) {

  console.log('registering helpers');
  Handlebars.registerHelper('foo2', function(msg) {
    return '<!-- foo2 -->\n<!-- ' + msg + ' -->';
  });

};

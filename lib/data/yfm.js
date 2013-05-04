var fs = require('fs'),
    _  = require('lodash'),
    yaml = require('js-yaml');


var yamlOptions = ['filename', 'strict', 'schema'];

var yfm = {
  extract: function(src, opts) {

    var options = _.extend({fromFile: true}, opts);
    var data = {
      originalContent: '',
      content: '',
      context: {}
    };

    var delim = '---';

    if(options.fromFile) {
      if(!fs.existsSync(src)) {
        console.log('File: ' + src + ' not found.');
        return false;
      }

      // read in file
      data.originalContent = fs.readFileSync(src, 'utf8');
    } else {
      data.originalContent = src;
    }

    // find front matter
    if(data.originalContent.indexOf(delim) !== 0) {
      data.content = data.originalContent;
      return data;
    }

    // end of yaml
    var eoy = data.originalContent.indexOf(delim, delim.length);
    var yamlText = '';
    if(eoy === -1) {
      yamlText = data.originalContent;
    } else {
      yamlText = data.originalContent.substring(0, eoy);
    }

    try {
      data.context = _.extend(data.context, yaml.load(yamlText, _.pick(options, yamlOptions)));
    } catch(e) {
      console.log(e);
      return false;
    }

    data.content = data.originalContent.substring(eoy + delim.length);
    return data;
  }
};

module.exports = exports = yfm;

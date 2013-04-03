


module.exports = function(grunt) {

  var _    = require('lodash');
  var fs   = require('fs');
  var path = require('path');


  /* the manifest for component.json is used by Bower */
  grunt.registerMultiTask('manifest', 'Generates component.json file.', function() {

    /* See https://github.com/component/component/wiki/Spec for more info */
    var component = {
      name: 'assemble',
      description: 'Get the rocks out of your socks. Assemble helps you quickly launch static web projects by emphasizing a strong separation of concerns between structure, style, content and configuration.',
      version: '<%= pkg.version %>',
      repo: 'assemble/assemble',
      main: [
        './lib/assemble.js'
      ],
      dependencies: {
        'amdefine': '0.0.4',
        'chai': '~1.5.0',
        'grunt': '~0.4.0',
        'grunt-contrib-jshint': '~0.1.0',
        'grunt-contrib-watch': '~0.2.0',
        'grunt-mocha-test': '~0.2.0',
        'grunt-release': '~0.2.0',
        'handlebars': '~1.0.9',
        'testem': '~0.2.68'
      },
      styles: [],
      scripts: [],
      images: [],
      fonts: [],
      files: []
    };

    var done = this.async();
    var base = path.join(__dirname, '../new');

    function addFilesToCollection(collection, basePath, localPath) {
      fs.readdirSync(path.join(basePath, localPath)).forEach(function(file) {
        if (fs.statSync(path.join(basePath, localPath, file)).isDirectory()) {
          addFilesToCollection(collection, basePath, path.join(localPath, file));
        } else {
          collection.push(path.join("../new", localPath, file));
        }
      });
    }
    fs.readdirSync(base).forEach(function(dir) {
      switch (dir) {
        case "css":
          addFilesToCollection(component.styles, base, dir);
          break;
        case "scripts":
          addFilesToCollection(component.scripts, base, dir);
          break;
        case "font":
          addFilesToCollection(component.fonts, base, dir);
          break;
        case "img":
          addFilesToCollection(component.images, base, dir);
          break;
         default:
          addFilesToCollection(component.images, base, dir);
          break;
      }

      /* bower needs everything to be pushed in main */
      addFilesToCollection(component.main, base, dir);
    });
    var c = JSON.stringify(component, null, 2);
    fs.writeFileSync(path.join(__dirname, '../component.json'), c, 'utf8');

    done();
  });
};


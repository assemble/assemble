Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

In your project's Gruntfile, add a section named `assemble` to the data object passed into `grunt.initConfig()`.

```js
assemble: {
  options: {
    assets: 'assets',
    partials: ['docs/includes/**/*.hbs'],
    data: ['docs/data/**/*.{json,yml}']
  },
  pages: {
    src: ['docs/*.hbs'],
    dest: './'
  }
},
```

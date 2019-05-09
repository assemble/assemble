# Generate "targets"

In this example we demonstrate how to create and use "targets" with assemble. If you're familiar with build-systems such as [make][] or [grunt][], you might also be familiar with the concept of "targets".

Targets provide a declarative way of specifying and organizing the files to be operated on by the build-system, and as you'll see this can work quite nicely with assemble's imperitive API.

## Creating a target

TBC...

```js
var Target = require('expand-target');
var target = new Target({
  data: {title: 'My Site'},
  options: {
    cwd: 'src',
    destBase: 'dist'
  },
  files: [
    {src: 'posts/*.md', dest: 'blog/', data: {title: 'My Blog'}},
    {src: 'pages/*.hbs'}
  ]
});
```

TBC...


## Build

From the same directory as this example, in the command line run:

```sh
$ npm install && assemble
```

From the root of the assemble project, run:

```sh
$ npm install && assemble --cwd examples/targets
```

[make]: http://www.gnu.org/software/make/manual/make.html#Phony-Targets
[grunt]: http://gruntjs.com/configuring-tasks#task-configuration-and-targets
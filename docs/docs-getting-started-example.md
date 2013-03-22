_You must use Grunt.js version 0.4.0 with Assemble. Please upgrade if you're still using grunt v0.3.x. If you haven't used [grunt][grunt] before, be sure to check out the [Getting Started][Getting Started] guide._

 From the same directory as your project's [Gruntfile][Getting Started] and [package.json][packageJSON], install this plugin with the following command:

``` bash
npm install assemble --save-dev
```

Once that's done, add this line to your project's Gruntfile:

``` js
grunt.loadNpmTasks('assemble');
```

If Assemble has been installed correctly, running `grunt --help` at the command line should list Assemble's task or tasks. In addition, Assemble should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.


These options will be passed through directly to [Less.js][]. See the [Less.js documentation](http://github.com/cloudhead/less.js) for a list of supported options.

#### paths
Type: `String|Array`
Default: _Directory of input files_

Specifies directories to scan for `@import` directives when parsing. The default value is the directory of the specified source files. In other words, the `paths` option allows you to specify paths for your @import statements in the [styles](http://github.com/assemble/styles) task, as an alternative to specifying a path on every `@import` statement that appears throughout your LESS files. So instead of doing this:

``` css
@import "path/to/my/less/files/mixins/mixins.less";
```
you can do this:

``` css
@import "mixins.less";
```
#### compress
Type: `Boolean`
Default: _false_

Specifies if we should compress the compiled css by removing some whitespaces.

#### yuicompress
Type: `Boolean`
Default: _false_

Compress output using cssmin.js.

#### optimization
Type: `Integer`
Default: null

Set the parser's optimization level. The lower the number, the less nodes it will create in the tree. This could matter for debugging, or if you want to access the individual nodes in the tree.

#### strictImports
Type: `Boolean`
Default: _false_

Force evaluation of imports.

#### strictMaths
Type: `Boolean`
Default: _true_

Force operations to be enclosed within parenthesis, `(2 / 6)`.

#### strictUnits
Type: `Boolean`
Default: _true_

Force strict evaluation of units. If set to `false` the compiler will not throw an error with operations such as `(3 * 1em)`. 

#### dumpLineNumbers
Type: `String`
Default: _false_

Configures -sass-debug-info support.

Accepts following values: `comments`, `mediaquery`, `all`.



## Custom Options

#### require
Type: `String|Array`
Default: _empty string_

Specified files will be _prepended_ to the beginning of src files, **_not_** to the concatenated output. This feature is useful for "inlining" globaly-required LESS files, such as `variables` or `mixins`, so that _they do not need to be referenced with `@import` statements inside any individual files_.

#### concat
Type: `Boolean`
Default: _true_

Concatenate all source files by default. If you change the value to false, all source files will compile into individual files.

#### lessrc
{{> externalize-options.md }}



### Under Consideration

#### globals
Type: `Object`
Default: _null_

Data object for defining global variables inside the Gruntfile which will be accessible in LESS files. Templates can be used to 

---

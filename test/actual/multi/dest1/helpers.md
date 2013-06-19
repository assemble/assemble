# Helpers and custom variables

## Content


<div class="page-header">
  <h1>Helpers and custom variables</h1>
  <p class="lead">Here we are using the &quot;css&quot; and &quot;js&quot; helpers to output the stylesheets and scripts that we want for this page. To show another approach (as well as the advantage of using helpers), we also demonstrate adding styles and scrips with custom variables.
</p>
</div>

<h2>css helper</h2>
Example of using the "css" helper from <a href="http://github.com/assemble/helper-lib">helper-lib</a>.
<link rel="stylesheet" href="../../assets/css/css/bootstrap.css">
<link rel="stylesheet" href="../../assets/css/css/responsive.css">
<link rel="stylesheet" href="../../assets/css/css/main.css">


<h2>js helper</h2>
Example of using the "js" helper from <a href="http://github.com/assemble/helper-lib">helper-lib</a>.
<script src="../../assets/js/js/bootstrap.js"></script>
<script src="../../assets/js/js/responsive.js"></script>
<script src="../../assets/js/js/main.js"></script>


<h2>custom variables</h2>
<link rel="stylesheet" href="css/index.css"/>
<script>document.write('foo bar!');</script>



## Debug Info
``` json
{ javascripts: 
   [ 'js/bootstrap.js',
     'js/responsive.js',
     'js/main.js',
     [length]: 3 ],
  dirname: 'test/actual/multi/dest1',
  dest: 'test/actual/multi/dest1/helpers.md',
  title: 'Helpers and custom variables',
  data: 
   { title: 'Helpers and custom variables',
     description: 'Here we are using the "css" and "js" helpers to output the stylesheets and scripts that we want for this page. To show another approach (as well as the advantage of using helpers), we also demonstrate adding styles and scrips with custom variables.\n',
     stylesheets: 
      [ 'css/bootstrap.css',
        'css/responsive.css',
        'css/main.css',
        [length]: 3 ],
     javascripts: 
      [ 'js/bootstrap.js',
        'js/responsive.js',
        'js/main.js',
        [length]: 3 ],
     styles: '<link rel="stylesheet" href="css/index.css"/>',
     scripts: 'document.write(\'foo bar!\');' },
  assets: '../../assets',
  styles: '<link rel="stylesheet" href="css/index.css"/>',
  ext: '.md',
  src: 'test/templates/pages/helpers.hbs',
  pagename: 'helpers.md',
  basename: 'helpers',
  page: 
   { [Function]
     [length]: 2,
     [name]: '',
     [arguments]: null,
     [caller]: null,
     [prototype]: { [constructor]: [Circular] } },
  stylesheets: 
   [ 'css/bootstrap.css',
     'css/responsive.css',
     'css/main.css',
     [length]: 3 ],
  scripts: 'document.write(\'foo bar!\');',
  pageName: 'helpers.md',
  filename: 'helpers.md',
  extname: '.md',
  description: 'Here we are using the "css" and "js" helpers to output the stylesheets and scripts that we want for this page. To show another approach (as well as the advantage of using helpers), we also demonstrate adding styles and scrips with custom variables.\n' }
```


### "{{#each pages}}" Links
[alert](alert.md)
[assets](assets.md)
[collections-categories](collections-categories.md)
[collections-categories2](collections-categories2.md)
[collections-tags-2](collections-tags-2.md)
[collections-tags](collections-tags.md)
[complex](complex.md)
[debug-helpers](debug-helpers.md)
[example](example.md)
[gist-helper](gist-helper.md)
[helpers](helpers.md)
[home](home.md)
[html-helpers](html-helpers.md)
[page](page.md)
[simple3](simple3.md)



### {{#each pages}} "this" context

#### alert.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/alert.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: alert.md
this.pagename: alert.md
this.basename: alert
this.extname:  .md
this.ext:      .md

#### assets.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/assets.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: assets.md
this.pagename: assets.md
this.basename: assets
this.extname:  .md
this.ext:      .md

#### collections-categories.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/collections-categories.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: collections-categories.md
this.pagename: collections-categories.md
this.basename: collections-categories
this.extname:  .md
this.ext:      .md

#### collections-categories2.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/collections-categories2.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: collections-categories2.md
this.pagename: collections-categories2.md
this.basename: collections-categories2
this.extname:  .md
this.ext:      .md

#### collections-tags-2.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/collections-tags-2.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: collections-tags-2.md
this.pagename: collections-tags-2.md
this.basename: collections-tags-2
this.extname:  .md
this.ext:      .md

#### collections-tags.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/collections-tags.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: collections-tags.md
this.pagename: collections-tags.md
this.basename: collections-tags
this.extname:  .md
this.ext:      .md

#### complex.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/complex.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: complex.md
this.pagename: complex.md
this.basename: complex
this.extname:  .md
this.ext:      .md

#### debug-helpers.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/debug-helpers.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: debug-helpers.md
this.pagename: debug-helpers.md
this.basename: debug-helpers
this.extname:  .md
this.ext:      .md

#### example.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/example.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: example.md
this.pagename: example.md
this.basename: example
this.extname:  .md
this.ext:      .md

#### gist-helper.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/gist-helper.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: gist-helper.md
this.pagename: gist-helper.md
this.basename: gist-helper
this.extname:  .md
this.ext:      .md

#### helpers.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/helpers.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: helpers.md
this.pagename: helpers.md
this.basename: helpers
this.extname:  .md
this.ext:      .md

#### home.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/home.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: home.md
this.pagename: home.md
this.basename: home
this.extname:  .md
this.ext:      .md

#### html-helpers.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/html-helpers.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: html-helpers.md
this.pagename: html-helpers.md
this.basename: html-helpers
this.extname:  .md
this.ext:      .md

#### page.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/page.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: page.md
this.pagename: page.md
this.basename: page
this.extname:  .md
this.ext:      .md

#### simple3.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/simple3.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: simple3.md
this.pagename: simple3.md
this.basename: simple3
this.extname:  .md
this.ext:      .md


### {{#each pages}}

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md

#### helpers.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/helpers.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: helpers.md
page.pagename: helpers.md
page.basename: helpers
page.extname:  .md
page.ext:      .md


### {{#each pages}} "page" context

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md

#### helpers.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/helpers.md
dirname:       test/actual/multi/dest1
filename:      helpers.md
pagename:      helpers.md
basename:      helpers
extname:       .md
ext:           .md



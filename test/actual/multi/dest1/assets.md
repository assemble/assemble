# assets.md output

## Content

<p>Examples to test the "relative" and "assets" variables, and to show how they work</p>





<h1>Relative Helper</h1>
<script src="../../../../css/one/two/three.js"></script>
<script src="../../../../js/one/two/three.js"></script>
<script src="../../../../jsone/two/three.js"></script>
<script src="./../../../../jsone/two/three.js"></script>

<h1>Assets Helper</h1>
<script src="../../assetsone/two/three.js"></script>
<script src="../../assets/one/two/three.js"></script>




## Debug Info
``` json
{ dirname: 'test/actual/multi/dest1',
  filename: 'assets.md',
  pageName: 'assets.md',
  pagename: 'assets.md',
  basename: 'assets',
  src: 'test/templates/pages/assets.hbs',
  dest: 'test/actual/multi/dest1/assets.md',
  assets: '../../assets',
  ext: '.md',
  extname: '.md',
  page: 
   { [Function]
     [length]: 2,
     [name]: '',
     [arguments]: null,
     [caller]: null,
     [prototype]: { [constructor]: [Circular] } },
  data: {} }
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

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md

#### assets.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/assets.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: assets.md
page.pagename: assets.md
page.basename: assets
page.extname:  .md
page.ext:      .md


### {{#each pages}} "page" context

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md

#### assets.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/assets.md
dirname:       test/actual/multi/dest1
filename:      assets.md
pagename:      assets.md
basename:      assets
extname:       .md
ext:           .md



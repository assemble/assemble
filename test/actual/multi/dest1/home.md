# YFM title

## Content



Properties from "example.json" and "example.hbs" should be on the page object.

<div class="page-header">
  <h1>Home</h1>
  <p class="lead">Welcome to my amazing and mysterious site!</p>
</div>

<hr>

<div class="page-header">
  <h1>YFM title</h1>
  <p class="lead">YFM description</p>
</div>

<hr>

<div class="page-header">
  <h1>YFM title</h1>
  <p class="lead">YFM description</p>
</div>





## Debug Info
``` json
{ filename: 'home.md',
  extname: '.md',
  dest: 'test/actual/multi/dest1/home.md',
  basename: 'home',
  description: 'YFM description',
  _page: 'all',
  dirname: 'test/actual/multi/dest1',
  data: { title: 'YFM title', description: 'YFM description' },
  assets: '../../assets',
  filePair: 
   { src: [Getter],
     dest: 'test/actual/multi/dest1/',
     orig: 
      { src: [ 'test/fixtures/pages/*.hbs', [length]: 1 ],
        dest: 'test/actual/multi/dest1/' } },
  title: 'YFM title',
  ext: '.md',
  pageName: 'home.md',
  page: '\n\nProperties from "example.json" and "example.hbs" should be on the page object.\n\n<div class="page-header">\n  <h1>{{home.title}}</h1>\n  <p class="lead">{{home.description}}</p>\n</div>\n\n<hr>\n\n<div class="page-header">\n  <h1>{{page.title}}</h1>\n  <p class="lead">{{page.description}}</p>\n</div>\n\n<hr>\n\n<div class="page-header">\n  <h1>{{title}}</h1>\n  <p class="lead">{{description}}</p>\n</div>\n\n\n',
  src: 'test/fixtures/pages/home.hbs',
  pagename: 'home.md' }
```


### "{{#each pages}}" Links
[gist-helper](gist-helper.md)
[alert](alert.md)
[collections-categories](collections-categories.md)
[collections-categories2](collections-categories2.md)
[collections-tags-2](collections-tags-2.md)
[collections-tags](collections-tags.md)
[complex](complex.md)
[context](context.md)
[debug-helpers](debug-helpers.md)
[deep-nested-layouts](deep-nested-layouts.md)
[example](example.md)
[assets](assets.md)
[home](home.md)
[index](index.md)
[md-helper](md-helper.md)
[nested-layouts](nested-layouts.md)
[no-layout-none](no-layout-none.md)
[no-layout](no-layout.md)
[no-yfm](no-yfm.md)
[page](page.md)
[postprocess](postprocess.md)
[postprocess2](postprocess2.md)
[simple3](simple3.md)



### {{#each pages}} "this" context

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

#### context.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/context.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: context.md
this.pagename: context.md
this.basename: context
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

#### deep-nested-layouts.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/deep-nested-layouts.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: deep-nested-layouts.md
this.pagename: deep-nested-layouts.md
this.basename: deep-nested-layouts
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

#### index.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/index.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: index.md
this.pagename: index.md
this.basename: index
this.extname:  .md
this.ext:      .md

#### md-helper.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/md-helper.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: md-helper.md
this.pagename: md-helper.md
this.basename: md-helper
this.extname:  .md
this.ext:      .md

#### nested-layouts.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/nested-layouts.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: nested-layouts.md
this.pagename: nested-layouts.md
this.basename: nested-layouts
this.extname:  .md
this.ext:      .md

#### no-layout-none.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/no-layout-none.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: no-layout-none.md
this.pagename: no-layout-none.md
this.basename: no-layout-none
this.extname:  .md
this.ext:      .md

#### no-layout.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/no-layout.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: no-layout.md
this.pagename: no-layout.md
this.basename: no-layout
this.extname:  .md
this.ext:      .md

#### no-yfm.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/no-yfm.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: no-yfm.md
this.pagename: no-yfm.md
this.basename: no-yfm
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

#### postprocess.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/postprocess.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: postprocess.md
this.pagename: postprocess.md
this.basename: postprocess
this.extname:  .md
this.ext:      .md

#### postprocess2.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/postprocess2.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: postprocess2.md
this.pagename: postprocess2.md
this.basename: postprocess2
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

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md

#### home.md
page.assets:   ../../assets
page.dest:     test/actual/multi/dest1/home.md
page.absolute: 
page.dirname:  test/actual/multi/dest1
page.filename: home.md
page.pagename: home.md
page.basename: home
page.extname:  .md
page.ext:      .md


### {{#each pages}} "page" context

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md

#### home.md
assets:        ../../assets
dest:          
absolute:      test/actual/multi/dest1/home.md
dirname:       test/actual/multi/dest1
filename:      home.md
pagename:      home.md
basename:      home
extname:       .md
ext:           .md



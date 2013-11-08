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
<pre><code class="json">
{
  "_page": "all",
  "assets": "../assets",
  "basename": "home",
  "data": {
    "title": "YFM title",
    "description": "YFM description"
  },
  "description": "YFM description",
  "dest": "test/actual/markdown/home.md",
  "dirname": "test/actual/markdown",
  "ext": ".md",
  "extname": ".md",
  "filePair": {
    "src": [
      "test/fixtures/pages/alert.hbs",
      "test/fixtures/pages/assets.hbs",
      "test/fixtures/pages/collections-categories.hbs",
      "test/fixtures/pages/collections-categories2.hbs",
      "test/fixtures/pages/collections-tags-2.hbs",
      "test/fixtures/pages/collections-tags.hbs",
      "test/fixtures/pages/complex.hbs",
      "test/fixtures/pages/context.hbs",
      "test/fixtures/pages/debug-helpers.hbs",
      "test/fixtures/pages/deep-nested-layouts.hbs",
      "test/fixtures/pages/example.hbs",
      "test/fixtures/pages/gist-helper.hbs",
      "test/fixtures/pages/home.hbs",
      "test/fixtures/pages/index.hbs",
      "test/fixtures/pages/md-helper.hbs",
      "test/fixtures/pages/nested-layouts.hbs",
      "test/fixtures/pages/no-layout-none.hbs",
      "test/fixtures/pages/no-layout.hbs",
      "test/fixtures/pages/no-yfm.hbs",
      "test/fixtures/pages/page.hbs",
      "test/fixtures/pages/postprocess.hbs",
      "test/fixtures/pages/postprocess2.hbs",
      "test/fixtures/pages/simple3.hbs"
    ],
    "dest": "test/actual/markdown/",
    "orig": {
      "src": [
        "test/fixtures/pages/*.hbs"
      ],
      "dest": "test/actual/markdown/"
    }
  },
  "filename": "home.md",
  "first": false,
  "index": 12,
  "last": false,
  "middle": true,
  "next": 13,
  "number": 13,
  "page": "\n\nProperties from \"example.json\" and \"example.hbs\" should be on the page object.\n\n<div class=\"page-header\">\n  <h1>{{home.title}}</h1>\n  <p class=\"lead\">{{home.description}}</p>\n</div>\n\n<hr>\n\n<div class=\"page-header\">\n  <h1>{{page.title}}</h1>\n  <p class=\"lead\">{{page.description}}</p>\n</div>\n\n<hr>\n\n<div class=\"page-header\">\n  <h1>{{title}}</h1>\n  <p class=\"lead\">{{description}}</p>\n</div>\n\n\n",
  "pageName": "home.md",
  "pagename": "home.md",
  "prev": 11,
  "src": "test/fixtures/pages/home.hbs",
  "title": "YFM title"
}
</code></pre>


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



### {{#each pages}} "root" context

#### gist-helper.md
src:      test/fixtures/pages/gist-helper.hbs
dest:     test/actual/markdown/gist-helper.md
assets:   ../assets
dirname:  test/actual/markdown
filename: gist-helper.md
pagename: gist-helper.md
basename: gist-helper
ext:      .md

#### alert.md
src:      test/fixtures/pages/alert.hbs
dest:     test/actual/markdown/alert.md
assets:   ../assets
dirname:  test/actual/markdown
filename: alert.md
pagename: alert.md
basename: alert
ext:      .md

#### collections-categories.md
src:      test/fixtures/pages/collections-categories.hbs
dest:     test/actual/markdown/collections-categories.md
assets:   ../assets
dirname:  test/actual/markdown
filename: collections-categories.md
pagename: collections-categories.md
basename: collections-categories
ext:      .md

#### collections-categories2.md
src:      test/fixtures/pages/collections-categories2.hbs
dest:     test/actual/markdown/collections-categories2.md
assets:   ../assets
dirname:  test/actual/markdown
filename: collections-categories2.md
pagename: collections-categories2.md
basename: collections-categories2
ext:      .md

#### collections-tags-2.md
src:      test/fixtures/pages/collections-tags-2.hbs
dest:     test/actual/markdown/collections-tags-2.md
assets:   ../assets
dirname:  test/actual/markdown
filename: collections-tags-2.md
pagename: collections-tags-2.md
basename: collections-tags-2
ext:      .md

#### collections-tags.md
src:      test/fixtures/pages/collections-tags.hbs
dest:     test/actual/markdown/collections-tags.md
assets:   ../assets
dirname:  test/actual/markdown
filename: collections-tags.md
pagename: collections-tags.md
basename: collections-tags
ext:      .md

#### complex.md
src:      test/fixtures/pages/complex.hbs
dest:     test/actual/markdown/complex.md
assets:   ../assets
dirname:  test/actual/markdown
filename: complex.md
pagename: complex.md
basename: complex
ext:      .md

#### context.md
src:      test/fixtures/pages/context.hbs
dest:     test/actual/markdown/context.md
assets:   ../assets
dirname:  test/actual/markdown
filename: context.md
pagename: context.md
basename: context
ext:      .md

#### debug-helpers.md
src:      test/fixtures/pages/debug-helpers.hbs
dest:     test/actual/markdown/debug-helpers.md
assets:   ../assets
dirname:  test/actual/markdown
filename: debug-helpers.md
pagename: debug-helpers.md
basename: debug-helpers
ext:      .md

#### deep-nested-layouts.md
src:      test/fixtures/pages/deep-nested-layouts.hbs
dest:     test/actual/markdown/deep-nested-layouts.md
assets:   ../assets
dirname:  test/actual/markdown
filename: deep-nested-layouts.md
pagename: deep-nested-layouts.md
basename: deep-nested-layouts
ext:      .md

#### example.md
src:      test/fixtures/pages/example.hbs
dest:     test/actual/markdown/example.md
assets:   ../assets
dirname:  test/actual/markdown
filename: example.md
pagename: example.md
basename: example
ext:      .md

#### assets.md
src:      test/fixtures/pages/assets.hbs
dest:     test/actual/markdown/assets.md
assets:   ../assets
dirname:  test/actual/markdown
filename: assets.md
pagename: assets.md
basename: assets
ext:      .md

#### home.md
src:      test/fixtures/pages/home.hbs
dest:     test/actual/markdown/home.md
assets:   ../assets
dirname:  test/actual/markdown
filename: home.md
pagename: home.md
basename: home
ext:      .md

#### index.md
src:      test/fixtures/pages/index.hbs
dest:     test/actual/markdown/index.md
assets:   ../assets
dirname:  test/actual/markdown
filename: index.md
pagename: index.md
basename: index
ext:      .md

#### md-helper.md
src:      test/fixtures/pages/md-helper.hbs
dest:     test/actual/markdown/md-helper.md
assets:   ../assets
dirname:  test/actual/markdown
filename: md-helper.md
pagename: md-helper.md
basename: md-helper
ext:      .md

#### nested-layouts.md
src:      test/fixtures/pages/nested-layouts.hbs
dest:     test/actual/markdown/nested-layouts.md
assets:   ../assets
dirname:  test/actual/markdown
filename: nested-layouts.md
pagename: nested-layouts.md
basename: nested-layouts
ext:      .md

#### no-layout-none.md
src:      test/fixtures/pages/no-layout-none.hbs
dest:     test/actual/markdown/no-layout-none.md
assets:   ../assets
dirname:  test/actual/markdown
filename: no-layout-none.md
pagename: no-layout-none.md
basename: no-layout-none
ext:      .md

#### no-layout.md
src:      test/fixtures/pages/no-layout.hbs
dest:     test/actual/markdown/no-layout.md
assets:   ../assets
dirname:  test/actual/markdown
filename: no-layout.md
pagename: no-layout.md
basename: no-layout
ext:      .md

#### no-yfm.md
src:      test/fixtures/pages/no-yfm.hbs
dest:     test/actual/markdown/no-yfm.md
assets:   ../assets
dirname:  test/actual/markdown
filename: no-yfm.md
pagename: no-yfm.md
basename: no-yfm
ext:      .md

#### page.md
src:      test/fixtures/pages/page.hbs
dest:     test/actual/markdown/page.md
assets:   ../assets
dirname:  test/actual/markdown
filename: page.md
pagename: page.md
basename: page
ext:      .md

#### postprocess.md
src:      test/fixtures/pages/postprocess.hbs
dest:     test/actual/markdown/postprocess.md
assets:   ../assets
dirname:  test/actual/markdown
filename: postprocess.md
pagename: postprocess.md
basename: postprocess
ext:      .md

#### postprocess2.md
src:      test/fixtures/pages/postprocess2.hbs
dest:     test/actual/markdown/postprocess2.md
assets:   ../assets
dirname:  test/actual/markdown
filename: postprocess2.md
pagename: postprocess2.md
basename: postprocess2
ext:      .md

#### simple3.md
src:      test/fixtures/pages/simple3.hbs
dest:     test/actual/markdown/simple3.md
assets:   ../assets
dirname:  test/actual/markdown
filename: simple3.md
pagename: simple3.md
basename: simple3
ext:      .md


### {{#each pages}} "this" context

#### gist-helper.md
this.src:      test/fixtures/pages/gist-helper.hbs
this.dest:     test/actual/markdown/gist-helper.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: gist-helper.md
this.pagename: gist-helper.md
this.basename: gist-helper
this.ext:      .md

#### alert.md
this.src:      test/fixtures/pages/alert.hbs
this.dest:     test/actual/markdown/alert.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: alert.md
this.pagename: alert.md
this.basename: alert
this.ext:      .md

#### collections-categories.md
this.src:      test/fixtures/pages/collections-categories.hbs
this.dest:     test/actual/markdown/collections-categories.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: collections-categories.md
this.pagename: collections-categories.md
this.basename: collections-categories
this.ext:      .md

#### collections-categories2.md
this.src:      test/fixtures/pages/collections-categories2.hbs
this.dest:     test/actual/markdown/collections-categories2.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: collections-categories2.md
this.pagename: collections-categories2.md
this.basename: collections-categories2
this.ext:      .md

#### collections-tags-2.md
this.src:      test/fixtures/pages/collections-tags-2.hbs
this.dest:     test/actual/markdown/collections-tags-2.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: collections-tags-2.md
this.pagename: collections-tags-2.md
this.basename: collections-tags-2
this.ext:      .md

#### collections-tags.md
this.src:      test/fixtures/pages/collections-tags.hbs
this.dest:     test/actual/markdown/collections-tags.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: collections-tags.md
this.pagename: collections-tags.md
this.basename: collections-tags
this.ext:      .md

#### complex.md
this.src:      test/fixtures/pages/complex.hbs
this.dest:     test/actual/markdown/complex.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: complex.md
this.pagename: complex.md
this.basename: complex
this.ext:      .md

#### context.md
this.src:      test/fixtures/pages/context.hbs
this.dest:     test/actual/markdown/context.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: context.md
this.pagename: context.md
this.basename: context
this.ext:      .md

#### debug-helpers.md
this.src:      test/fixtures/pages/debug-helpers.hbs
this.dest:     test/actual/markdown/debug-helpers.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: debug-helpers.md
this.pagename: debug-helpers.md
this.basename: debug-helpers
this.ext:      .md

#### deep-nested-layouts.md
this.src:      test/fixtures/pages/deep-nested-layouts.hbs
this.dest:     test/actual/markdown/deep-nested-layouts.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: deep-nested-layouts.md
this.pagename: deep-nested-layouts.md
this.basename: deep-nested-layouts
this.ext:      .md

#### example.md
this.src:      test/fixtures/pages/example.hbs
this.dest:     test/actual/markdown/example.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: example.md
this.pagename: example.md
this.basename: example
this.ext:      .md

#### assets.md
this.src:      test/fixtures/pages/assets.hbs
this.dest:     test/actual/markdown/assets.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: assets.md
this.pagename: assets.md
this.basename: assets
this.ext:      .md

#### home.md
this.src:      test/fixtures/pages/home.hbs
this.dest:     test/actual/markdown/home.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: home.md
this.pagename: home.md
this.basename: home
this.ext:      .md

#### index.md
this.src:      test/fixtures/pages/index.hbs
this.dest:     test/actual/markdown/index.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: index.md
this.pagename: index.md
this.basename: index
this.ext:      .md

#### md-helper.md
this.src:      test/fixtures/pages/md-helper.hbs
this.dest:     test/actual/markdown/md-helper.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: md-helper.md
this.pagename: md-helper.md
this.basename: md-helper
this.ext:      .md

#### nested-layouts.md
this.src:      test/fixtures/pages/nested-layouts.hbs
this.dest:     test/actual/markdown/nested-layouts.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: nested-layouts.md
this.pagename: nested-layouts.md
this.basename: nested-layouts
this.ext:      .md

#### no-layout-none.md
this.src:      test/fixtures/pages/no-layout-none.hbs
this.dest:     test/actual/markdown/no-layout-none.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: no-layout-none.md
this.pagename: no-layout-none.md
this.basename: no-layout-none
this.ext:      .md

#### no-layout.md
this.src:      test/fixtures/pages/no-layout.hbs
this.dest:     test/actual/markdown/no-layout.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: no-layout.md
this.pagename: no-layout.md
this.basename: no-layout
this.ext:      .md

#### no-yfm.md
this.src:      test/fixtures/pages/no-yfm.hbs
this.dest:     test/actual/markdown/no-yfm.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: no-yfm.md
this.pagename: no-yfm.md
this.basename: no-yfm
this.ext:      .md

#### page.md
this.src:      test/fixtures/pages/page.hbs
this.dest:     test/actual/markdown/page.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: page.md
this.pagename: page.md
this.basename: page
this.ext:      .md

#### postprocess.md
this.src:      test/fixtures/pages/postprocess.hbs
this.dest:     test/actual/markdown/postprocess.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: postprocess.md
this.pagename: postprocess.md
this.basename: postprocess
this.ext:      .md

#### postprocess2.md
this.src:      test/fixtures/pages/postprocess2.hbs
this.dest:     test/actual/markdown/postprocess2.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: postprocess2.md
this.pagename: postprocess2.md
this.basename: postprocess2
this.ext:      .md

#### simple3.md
this.src:      test/fixtures/pages/simple3.hbs
this.dest:     test/actual/markdown/simple3.md
this.assets:   ../assets
this.dirname:  test/actual/markdown
this.filename: simple3.md
this.pagename: simple3.md
this.basename: simple3
this.ext:      .md


### {{#each pages}} "page" context

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md

#### home.md
page.src:      test/fixtures/pages/home.hbs
page.dest:     test/actual/markdown/home.md
page.assets:   ../assets
page.dirname:  test/actual/markdown
page.filename: home.md
page.pagename: home.md
page.basename: home
page.ext:      .md


### {{#each pages}} "root" context

#### gist-helper.md
src:           test/fixtures/pages/gist-helper.hbs
dest:          test/actual/markdown/gist-helper.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      gist-helper.md
pagename:      gist-helper.md
basename:      gist-helper
ext:           .md

#### alert.md
src:           test/fixtures/pages/alert.hbs
dest:          test/actual/markdown/alert.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      alert.md
pagename:      alert.md
basename:      alert
ext:           .md

#### collections-categories.md
src:           test/fixtures/pages/collections-categories.hbs
dest:          test/actual/markdown/collections-categories.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      collections-categories.md
pagename:      collections-categories.md
basename:      collections-categories
ext:           .md

#### collections-categories2.md
src:           test/fixtures/pages/collections-categories2.hbs
dest:          test/actual/markdown/collections-categories2.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      collections-categories2.md
pagename:      collections-categories2.md
basename:      collections-categories2
ext:           .md

#### collections-tags-2.md
src:           test/fixtures/pages/collections-tags-2.hbs
dest:          test/actual/markdown/collections-tags-2.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      collections-tags-2.md
pagename:      collections-tags-2.md
basename:      collections-tags-2
ext:           .md

#### collections-tags.md
src:           test/fixtures/pages/collections-tags.hbs
dest:          test/actual/markdown/collections-tags.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      collections-tags.md
pagename:      collections-tags.md
basename:      collections-tags
ext:           .md

#### complex.md
src:           test/fixtures/pages/complex.hbs
dest:          test/actual/markdown/complex.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      complex.md
pagename:      complex.md
basename:      complex
ext:           .md

#### context.md
src:           test/fixtures/pages/context.hbs
dest:          test/actual/markdown/context.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      context.md
pagename:      context.md
basename:      context
ext:           .md

#### debug-helpers.md
src:           test/fixtures/pages/debug-helpers.hbs
dest:          test/actual/markdown/debug-helpers.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      debug-helpers.md
pagename:      debug-helpers.md
basename:      debug-helpers
ext:           .md

#### deep-nested-layouts.md
src:           test/fixtures/pages/deep-nested-layouts.hbs
dest:          test/actual/markdown/deep-nested-layouts.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      deep-nested-layouts.md
pagename:      deep-nested-layouts.md
basename:      deep-nested-layouts
ext:           .md

#### example.md
src:           test/fixtures/pages/example.hbs
dest:          test/actual/markdown/example.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      example.md
pagename:      example.md
basename:      example
ext:           .md

#### assets.md
src:           test/fixtures/pages/assets.hbs
dest:          test/actual/markdown/assets.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      assets.md
pagename:      assets.md
basename:      assets
ext:           .md

#### home.md
src:           test/fixtures/pages/home.hbs
dest:          test/actual/markdown/home.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      home.md
pagename:      home.md
basename:      home
ext:           .md

#### index.md
src:           test/fixtures/pages/index.hbs
dest:          test/actual/markdown/index.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      index.md
pagename:      index.md
basename:      index
ext:           .md

#### md-helper.md
src:           test/fixtures/pages/md-helper.hbs
dest:          test/actual/markdown/md-helper.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      md-helper.md
pagename:      md-helper.md
basename:      md-helper
ext:           .md

#### nested-layouts.md
src:           test/fixtures/pages/nested-layouts.hbs
dest:          test/actual/markdown/nested-layouts.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      nested-layouts.md
pagename:      nested-layouts.md
basename:      nested-layouts
ext:           .md

#### no-layout-none.md
src:           test/fixtures/pages/no-layout-none.hbs
dest:          test/actual/markdown/no-layout-none.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      no-layout-none.md
pagename:      no-layout-none.md
basename:      no-layout-none
ext:           .md

#### no-layout.md
src:           test/fixtures/pages/no-layout.hbs
dest:          test/actual/markdown/no-layout.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      no-layout.md
pagename:      no-layout.md
basename:      no-layout
ext:           .md

#### no-yfm.md
src:           test/fixtures/pages/no-yfm.hbs
dest:          test/actual/markdown/no-yfm.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      no-yfm.md
pagename:      no-yfm.md
basename:      no-yfm
ext:           .md

#### page.md
src:           test/fixtures/pages/page.hbs
dest:          test/actual/markdown/page.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      page.md
pagename:      page.md
basename:      page
ext:           .md

#### postprocess.md
src:           test/fixtures/pages/postprocess.hbs
dest:          test/actual/markdown/postprocess.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      postprocess.md
pagename:      postprocess.md
basename:      postprocess
ext:           .md

#### postprocess2.md
src:           test/fixtures/pages/postprocess2.hbs
dest:          test/actual/markdown/postprocess2.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      postprocess2.md
pagename:      postprocess2.md
basename:      postprocess2
ext:           .md

#### simple3.md
src:           test/fixtures/pages/simple3.hbs
dest:          test/actual/markdown/simple3.md
assets:        ../assets
dirname:       test/actual/markdown
filename:      simple3.md
pagename:      simple3.md
basename:      simple3
ext:           .md



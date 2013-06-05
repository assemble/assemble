# helpers.md output

## Debug Info

``` json
{ extname: '.md',
  pagename: 'helpers.md',
  data: 
   { url: 'http://gist.github.com/jonschlinkert/5193239',
     text: 'helpers.js',
     links: [ 'one', 'two', 'three', [length]: 3 ],
     moreLinks: 
      [ { url: 'one', text: 'two' },
        { url: 'three', text: 'four' },
        { url: 'five', text: 'size' },
        [length]: 3 ] },
  page: 
   { [Function]
     [length]: 2,
     [name]: '',
     [arguments]: null,
     [caller]: null,
     [prototype]: { [constructor]: [Circular] } },
  assets: '../../assets',
  src: 'test/templates/pages/helpers.hbs',
  filename: 'helpers.md',
  dest: 'test/actual/multi/dest1/helpers.md',
  pageName: 'helpers.md',
  links: [ 'one', 'two', 'three', [length]: 3 ],
  text: 'helpers.js',
  moreLinks: 
   [ { url: 'one', text: 'two' },
     { url: 'three', text: 'four' },
     { url: 'five', text: 'size' },
     [length]: 3 ],
  dirname: 'test/actual/multi/dest1',
  url: 'http://gist.github.com/jonschlinkert/5193239',
  basename: 'helpers',
  ext: '.md' }
```

### "{{#each pages}}" Links
[alert](alert.md)
[assets](assets.md)
[category](category.md)
[category2](category2.md)
[complex](complex.md)
[dates](dates.md)
[example](example.md)
[helpers](helpers.md)
[page](page.md)
[simple3](simple3.md)
[tags_test](tags_test.md)
[tags_test2](tags_test2.md)



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

#### category.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/category.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: category.md
this.pagename: category.md
this.basename: category
this.extname:  .md
this.ext:      .md

#### category2.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/category2.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: category2.md
this.pagename: category2.md
this.basename: category2
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

#### dates.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/dates.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: dates.md
this.pagename: dates.md
this.basename: dates
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

#### tags_test.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/tags_test.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: tags_test.md
this.pagename: tags_test.md
this.basename: tags_test
this.extname:  .md
this.ext:      .md

#### tags_test2.md
this.assets:   ../../assets
this.dest:     test/actual/multi/dest1/tags_test2.md
this.absolute:
this.dirname:  test/actual/multi/dest1
this.filename: tags_test2.md
this.pagename: tags_test2.md
this.basename: tags_test2
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



<h2>ul</h2>
<ul class="nav"><li>
  one
</li>
<li>
  two
</li>
<li>
  three
</li></ul>

<ul class="nav"><li>
  <a href="one">two</a>
</li>
<li>
  <a href="three">four</a>
</li>
<li>
  <a href="five">size</a>
</li></ul>

<h2>ol</h2>
<ol class="nav"><li>
  one
</li>
<li>
  two
</li>
<li>
  three
</li></ol>

<ol class="nav"><li>
  <a href="one">two</a>
</li>
<li>
  <a href="three">four</a>
</li>
<li>
  <a href="five">size</a>
</li></ol>




<h2>href</h2>
<p><a href="http://gist.github.com/jonschlinkert/5193239">helpers.js</a>
<a href="http://github.com">GitHub</a>
<a href="http://github.com">GitHub</a></p>
<h2>gist</h2>
<script src="https://gist.github.com/5193239.js"></script>


<h2>debug</h2>



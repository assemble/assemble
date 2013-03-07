### Markdown

Wouldn't it be awesome if you could just _use markdown however you wanted, wherever you needed it_? One of the advantages of writing content using markdown is that it is free of the angle brackets and tags used in HTML, so it feels and looks more like "content" than "code".

Assemble gives you the flexibility to _write code when you need to_ and _write content when, where and in whatever format you want_, You can:

  * Write entire documents in markdown, and later compile them to HTML
  * Keep sections of documents in externalized markdown files, similar to includes or partials, so they can be reused and imported into other documents
  * Embed markdown, or write it "inline" inside HTML documents.


#### Features

**"Include" or import externalized content**

Use the markdown block helper, `{{md}}`, to enable importing of external markdown content.

Example:

``` handlebars
{{md ../path/to/content.md}}
```

Or use a variable instead of setting the path directly inside the template. For example you can add the content variable to a YAML header:


``` yaml
---
page:
  title: Home
content: ../path/to/content.md
---
```
then use it like this:

``` handlebars
{{md content}}
```

**Write "inline" markdown**

Using either the `{{#markdown}}{{/markdown}}` or `{{#md}}{{/md}}` block helpers to wrap markdown inside HTML and handlebars templates:

``` handlebars
{{#markdown}}
# Inline Markdown is awesome

> this is markdown content

  * useful for simple content
  * great for blog posts
  * easier on the eyes than angle brackets
  * even links look prettier

### Pretty links
[Visit Assemble](http://github.com/assemble/assemble)

### Even Prettier links
Embed handlebars templates to make them even prettier.
{{#page.links}}
[{{text}}]({{href}})
{{/page.links}}

{{/markdown}}
```
or...

``` handlebars
<section>
  {{#md}}
    # Page Header
    This is written in markdown.
  {{/md}}
</section>
```


### Markdown options*

Default markdown options are from [marked](marked), so the following options are available for changing behavior:

  * **pedantic**: Conform to obscure parts of `markdown.pl` as much as possible.
  Don't fix any of the original markdown bugs or poor behavior.
  * **gfm**: Enable github flavored markdown (enabled by default).
  * **sanitize**: Sanitize the output. Ignore any HTML that has been input.
  * **highlight**: A callback to highlight code blocks.
  * **tables**: Enable GFM tables. This is enabled by default. (Requires the
  `gfm` option in order to be enabled).
  * **breaks**: Enable GFM line breaks. Disabled by default.
  * **smartLists**: Use smarter list behavior than the original markdown.
  Disabled by default. May eventually be default with the old behavior
  moved into `pedantic`.
  * **langPrefix**: Set the prefix for code block classes. Defaults to `lang-`.


### Usage

``` js
// Set default options
marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  langPrefix: 'language-',
  highlight: function(code, lang) {
    if (lang === 'js') {
      return highlighter.javascript(code);
    }
    return code;
  }
});
console.log(marked('i am using **markdown**.'));
```


You also have direct access to the marked lexer and parser if you so desire.

``` js
var tokens = marked.lexer(text, options);
console.log(marked.parser(tokens));
```

``` js
var lexer = new marked.Lexer(options);
var tokens = lexer.lex(text);
console.log(tokens);
console.log(lexer.rules);
```

``` bash
$ node
> require('marked').lexer('> i am using marked.')
[ { type: 'blockquote_start' },
  { type: 'paragraph',
    text: 'i am using marked.' },
  { type: 'blockquote_end' },
  links: {} ]
```

### CLI

``` bash
$ marked -o hello.html
hello world
^D
$ cat hello.html
<p>hello world</p>
```

### License

Marked Copyright (c) 2011-2013, Christopher Jeffrey. (MIT License). See Marked [LICENSE](https://github.com/chjj/marked/blob/master/LICENSE) and [repo](marked) for more info.



* Some of this documentation was copied directly from the marked readme.


[marked]: https://github.com/chjj/marked "Marked Repo on GitHub"

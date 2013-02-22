## Markdown Support


### Markdown Features*


Assemble's default markdown engine is [marked](marked), so the following options are available for changing behavior:

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

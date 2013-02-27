# First-level heading

## Second-level Heading

### Third-level Heading

#### Fourth-level heading

``` md
# First-level heading

## Second-level Heading

### Third-level Heading

#### Fourth-level heading
```


## Paragraphs

This is a paragraph. It has two sentences.

This is another paragraph. It also has
two sentences.


``` md
This is a paragraph. It has two sentences.

This is another paragraph. It also has
two sentences.
```

## Lists

* An item in a bulleted (unordered) list
    * A subitem, indented with 4 spaces
* Another item in a bulleted list
1. An item in an enumerated (ordered) list
   1.1. A subitem, indented with 4 spaces
2. Another item in an enumerated list

``` md
* An item in a bulleted (unordered) list
    * A subitem, indented with 4 spaces
* Another item in a bulleted list
1. An item in an enumerated (ordered) list
   1.1. A subitem, indented with 4 spaces
2. Another item in an enumerated list
```


## Line return

Line breaks inserted in the text are removed from the final result: the web browser is in charge of breaking lines depending on the available space. To force a line break, insert two spaces at the end of the line.


## Emphasized text

*emphasis* or _emphasis_  (e.g., italics)

**strong emphasis** or __strong emphasis__ (e.g., boldface)

``` md
*emphasis* or _emphasis_  (e.g., italics)

**strong emphasis** or __strong emphasis__ (e.g., boldface)
```

## Code

To include code (formatted in monospace font), you can either surround inline code with backticks (`), like in:

Some text with `some code` inside.

``` md
Some text with `some code` inside.
```

Or indent several lines of code by at least four spaces, as in:

    line 1 of code
    line 2 of code
    line 3 of code

``` md
    line 1 of code
    line 2 of code
    line 3 of code
```

The latter option makes Markdown retain all whitespace—as opposed to the usual behaviour, which, by removing line breaks and excess spaces, would break indentation and code layout.

## Escaping

Use `\` for escaping code, such as handlebars templates, so the following:

``` md
\{{ page.title }}
```
would translate literally.


## Line breaks
When you do want to insert a break tag using Markdown, you end a line with two or more spaces, then type return. For example:

``` md
def show_results
tag_br space space
end
```

Result:

``` html
def show_results

end
```

You can also use two newlines. For example:
```
sentence A

sentence B
```
Result:

``` html
sentence A
sentence B
```

## Blockquotes

> "This entire paragraph of text will be enclosed in an HTML blockquote element.
Blockquote elements are reflowable. You may arbitrarily
wrap the text to your liking, and it will all be parsed
into a single blockquote element."

``` md
> "This entire paragraph of text will be enclosed in an HTML blockquote element.
Blockquote elements are reflowable. You may arbitrarily
wrap the text to your liking, and it will all be parsed
into a single blockquote element."
```

The above would translate into the following HTML:

``` html
<blockquote><p>This entire paragraph of text will be enclosed in an HTML blockquote element. Blockquote
elements are reflowable. You may arbitrarily wrap the text to your liking, and it will all
be parsed into a single blockquote element.</p></blockquote>
```

## External links

Links may be included inline:

``` md
[link text here](link.address.here)
Ex. [Markdown](http://en.wikipedia.com/wiki/Markdown)
```

Alternatively, links can be placed in footnotes outside of the paragraph, being referenced with some sort of reference tag. For example, including the following inline:

``` md
[link text here][linkref]
```

would produce a link if the following showed up outside of the paragraph (or at the end of the document):

``` md

[linkref]: link.address.here "link title here"
```

## Images

Images have similar syntax to links with a preceding exclamation point.

``` md
![Alt text](/path/to/img.jpg)
```

or
``` md
![Alt text](/path/to/img.jpg "Optional title")
```

Like links, Images also have a footnote style syntax

``` md
![Alt text][id]
```
with a reference later in the document defining the url location

``` md

[id]: url/to/image  "Optional title attribute"
```


## Horizontal rules
Horizontal rules are created by placing three or more hyphens, asterisks, or underscores on a line by themselves. You may use spaces between the hyphens or asterisks. Each of the following lines will produce a horizontal rule:

``` md
* * *
***
*****
- - -
---------------------------------------
```


# More



Here is a Markdown link to [Assemble](http://assemble.io), and a literal <http://assemble.io/>.
Now some simple links, like one to &#91;google&#93; (automagically links to are-you-
feeling-lucky), a &#91;wiki: test&#93; link to a Wikipedia page, and a link to
&#91;foldoc: CPU&#93;s at foldoc.

Now some inline markup like _italics_,  **bold**, and `code()`. Note that underscores in
words are ignored in Markdown Extra.

![picture alt](/images/photo.jpg "Title is optional")

> Blockquotes are like quoted text in email replies
>> And, they can be nested

* Bullet lists are easy too
- Another one
+ Another one

1. A numbered list
2. Which is numbered
3. With periods and a space

And now some code:

    // Code is just text indented a bit
    which(is_easy) to_remember();

~~~

// Markdown extra adds un-indented code blocks too

if (this_is_more_code == true && !indented) {
    // tild wrapped code blocks, also not indented
}

~~~

Text with
two trailing spaces
(on the right)
can be used
for things like poems

### Horizontal rules

* * * *
****
--------------------------

<div class="alert"> This is a div wrapping some **Markdown** plus. Without the DIV attribute, it ignores the block. </div>


&lt;div class="alert"&gt;
This is a div wrapping some **Markdown** plus.  Without the DIV attribute, it ignores the
block.
&lt;/div&gt;

## Markdown plus tables ##

| Header | Header | Right  |
| ------ | ------ | -----: |
|  Cell  |  Cell  |   $10  |
|  Cell  |  Cell  |   $20  |

* Outer pipes on tables are optional
* Colon used for alignment (right versus left)


*[ABBR]: Markdown plus abbreviations (produces an &lt;abbr&gt; tag)


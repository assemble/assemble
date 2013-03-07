# Assemble Helpers

A growing collection of useful helpers for Assemble.

TODO:
- [ ] this needs to be better organized.
- [ ] Add links to unit tests, CONTRIBUTING.md.
- [ ] Combine redundant helpers.


- [Handlebars Helpers](#handlebars-helpers)
- [Credit](#credit)



## Handlebars Helpers

[Handlebars.js](https://github.com/wycats/handlebars.js).

### Equals

#### If x Equals y

**Parameters**:
**Usage**:


    {{#if_eq x compare=y}} ... {{/if_eq}}


#### Unless x Equals y

**Parameters**:
**Usage**:

    {{#unless_eq x compare=y}} ... {{/unless_eq}}



### Greater Than

#### If x > y

**Parameters**:
**Usage**:

    {{#if_gt x compare=y}} ... {{/if_gt}}


#### Unless x > y

**Parameters**:
**Usage**:

    {{#unless_gt x compare=y}} ... {{/unless_gt}}



### Greater Than or Equal To

#### If x >= y

**Parameters**:
**Usage**:

    {{#if_gteq x compare=y}} ... {{/if_gteq}}


#### Unless x >= y

**Parameters**:
**Usage**:

    {{#unless_gteq x compare=y}} ... {{/unless_gteq}}



### Less Than

#### If x < y

**Parameters**:
**Usage**:

    {{#if_lt x compare=y}} ... {{/if_lt}}


#### Unless x < y

**Parameters**:
**Usage**:

    {{#unless_lt x compare=y}} ... {{/unless_lt}}




### Less Than or Equal To

#### If x <= y

**Parameters**:
**Usage**:

    {{#if_lteq x compare=y}} ... {{/if_lteq}}


#### Unless x <= y

**Parameters**:
**Usage**:

    {{#unless_lteq x compare=y}} ... {{/unless_lteq}}


### nl2br
Convert new lines (`\r\n`, `\n\r`, `\r`, `\n`) to line breaks

`{{nl2br description}}`




### Strings

#### lowercase

Turns a string to lowercase.

**Parameters**: none.
**Usage**:

    {{lowercase "MAKE THIS ALL LOWERCASE"}}

**result**
    make this all lowercase

#### uppercase

Turns a string to uppercase. Opposite of `{{lowercase}}`.

**Parameters**: none.
**Usage**:

    {{uppercase "make this all uppercase"}}

**result**
    MAKE THIS ALL UPPERCASE

#### capitalizeFirst

Capitalizes the first word in a string.

**Parameters**: none.
**Usage**:

    {{capitalizeFirst "capitalize first word in this sentence"}}

**result**
    Capitalize first word in this sentence

#### capitalizeEach

Capitalizes each word in a string.

**Parameters**: none.
**Usage**:

    {{capitalizeEach "capitalize EACH word in this sentence"}}

**result**
    Capitalize EACH Word In This Sentence

#### titleize

Capitalizes all words within a string. Taken from the templating library [Walrus](https://github.com/jeremyruppel/walrus) by [Jeremy Ruppel](https://github.com/jeremyruppel).

**Parameters**: none.
**Usage**:

    {{titleize "capitalize EACH word in this sentence"}}

**result**
    Capitalize Each Word In This Sentence.

#### sentence

Capitalizes the first word of each sentence in a string and converts the rest of the sentence to lowercase.

**Parameters**: none.
**Usage**:

    {{sentence "capitalize the FIRST word in each sentence. but make the OTHER words lowercase."}}

**result**
    Capitalize the first word in each sentence. But make the other words lowercase.

#### reverse

Reverses a string.

**Parameters**: none.
**Usage**:

    {{reverse "bender should NOT be allowed on TV."}}

**result**
    .VT no dewolla eb TON dluohs redneb

#### truncate

Truncates a string given a specified `length`, providing a custom string to denote an `omission`.

**Parameters**:

    length [int] - The number of characters to keep (Required)
    omission [string] - A string to denote an omission (Optional)
**Usage**:

    {{truncate "Bender should not be allowed on tv." 31 "..."}}

**result**
    Bender should not be allowed...

#### center

Centers a string using non-breaking spaces.

**Parameters**:

    spaces [int] - The number of spaces. (Required)
**Usage**:

    {{center "Bender should not be allowed on tv." 10}}

**result**
```
|              Bender should not be allowed on tv.              |
```

#### newLineToBr

Converts new line characters `\n` to line breaks `<br>`.

**Parameters**: none.
**Usage**:

    {{{newLineToBr "Bender \n should \n not \n be allowed on tv."}}}

**result**
    Bender <br> should <br> not <br> be allowed on tv.

### Collections

#### first

Returns the first item in a collection.

**Parameters**: none.
**Usage**:

    collection = ['Amy Wong', 'Bender', 'Dr. Zoidberg', 'Fry', 'Hermes Conrad', 'Leela', 'Professor Farnsworth', 'Scruffy']

    {{first collection}}

**result**
    Amy Wong

#### withFirst

Use the first item in a collection inside a block.

**Parameters**: none.
**Usage**:

    collection = ['Amy Wong', 'Bender', 'Dr. Zoidberg', 'Fry', 'Hermes Conrad', 'Leela', 'Professor Farnsworth', 'Scruffy']

    {{#withFirst collection}}
        <p>{{this}} is smart.</p>
    {{/withFirst}}

**result**
    <p>Amy Wong is smart.</p>

#### last

Returns the last item in a collection. Opposite of `first`.

**Parameters**: none.
**Usage**:

    collection = ['Amy Wong', 'Bender', 'Dr. Zoidberg', 'Fry', 'Hermes Conrad', 'Leela', 'Professor Farnsworth', 'Scruffy']

    {{last collection}}

**result**
    Scruffy

#### withLast

Use the last item in a collection inside a block. Opposite of `withFirst`.

**Parameters**: none.
**Usage**:

    collection = ['Amy Wong', 'Bender', 'Dr. Zoidberg', 'Fry', 'Hermes Conrad', 'Leela', 'Professor Farnsworth', 'Scruffy']

    {{#withLast collection}}
        <p>{{this}} is lazy.</p>
    {{/withLast}}

**result**
    <p>Scruffy is lazy.</p>

#### after

Returns all of the items in the collection after the specified count.

**Parameters**:

    count [int] - How many items to omit from the beginning. (Required)
**Usage**:

    collection = ['Amy Wong', 'Bender', 'Dr. Zoidberg', 'Fry', 'Hermes Conrad', 'Leela', 'Professor Farnsworth', 'Scruffy']

    {{after collection 5}}

**result**
    Leela, Professor Farnsworth, Scruffy

#### withAfter

Use all of the items in the collection after the specified count inside a block.

**Parameters**:

    count [int] - How many items to omit from the beginning. (Required)
**Usage**:

    collection = ['Amy Wong', 'Bender', 'Dr. Zoidberg', 'Fry', 'Hermes Conrad', 'Leela', 'Professor Farnsworth', 'Scruffy']

    {{#withAfter collection 5}}
        {{titleize this}}
    {{/withAfter}}

**result**
    Leela Professor Farnsworth Scruffy

#### before

Returns all of the items in the collection before the specified count. Opposite of `after`.

**Parameters**:

    count [int] - How many items to omit from the end. (Required)
**Usage**:

    collection = ['Amy Wong', 'Bender', 'Dr. Zoidberg', 'Fry', 'Hermes Conrad', 'Leela', 'Professor Farnsworth', 'Scruffy']

    {{before collection 5}}

**result**
    Amy Wong, Bender, Dr. Zoidberg

#### withBefore

Use all of the items in the collection before the specified count inside a block. Opposite of `withAfter`.

**Parameters**:

    count [int] - How many items to omit from the end. (Required)
**Usage**:

    collection = ['Amy Wong', 'Bender', 'Dr. Zoidberg', 'Fry', 'Hermes Conrad', 'Leela', 'Professor Farnsworth', 'Scruffy']

    {{#withBefore collection 5}}
        {{reverse this}}
    {{/withBefore}}

**result**
    gnoW ymA redneB grebdioZ .rD

#### join

Joins all elements of a collection into a string using a separator if specified.

**Parameters**:

    separator [string] - A string to use as a separator between the items. (Optional)
**Usage**:

    collection = ['Amy Wong', 'Bender', 'Dr. Zoidberg', 'Fry', 'Hermes Conrad', 'Leela', 'Professor Farnsworth', 'Scruffy']

    {{join collection " & "}}

**result**
    Amy Wong & Bender & Dr. Zoidberg & Fry & Hermes Conrad & Leela & Professor Farnsworth & Scruffy

#### sort

Returns the collection sorted.

**Parameters**:

    none.
**Usage**:

    collection = ['Dr. Zoidberg', 'Fry', 'Amy Wong', 'Professor Farnsworth', 'Bender', 'Hermes Conrad', 'Leela', 'Scruffy']

    {{sort collection}}

**result**
    Amy Wong, Bender, Dr. Zoidberg, Fry, Hermes Conrad, Leela, Professor Farnsworth, Scruffy

#### withSort

Uses the sorted collection inside the block.

**Parameters**:

    field [string] - String name of the field or property to sort by. (Optional)
**Usage**:

    collection = [
            name: 'Leela'
            deliveries: 8021
        ,
            name: 'Bender'
            deliveries: 239
        ,
            name: 'Fry'
            deliveries: -12
    ]

    {{#withSort collection "deliveries"}}
        {{name}}: {{deliveries}} <br>
    {{/withSort}}

**result**
    Fry: -12
    Bender: 239
    Leela: 8021

#### length

Returns the length of the collection.

**Parameters**: none.

    collection = ['Dr. Zoidberg', 'Fry', 'Amy Wong', 'Professor Farnsworth', 'Bender', 'Hermes Conrad', 'Leela', 'Scruffy']

    {{length collection}}

**result**
    8

#### lengthEqual

Conditionally render a block based on the length of a collection.

**Parameters**:

    length [int] - The value to test against. (Required)
**Usage**:

    collection = [
            name: 'Leela'
            deliveries: 8021
        ,
            name: 'Bender'
            deliveries: 239
        ,
            name: 'Fry'
            deliveries: -12
    ]


    {{#lengthEqual collection 3}}
        There are 3 people in Planet Express.
    {{else}}
        This is not Planet Express.
    {{/lengthEqual}}

**result**
    There are 3 people in Planet Express.

#### empty

Conditionally render a block if the collection is empty.

**Parameters**: none.
**Usage**:

    collection = []

    {{#empty collection}}
        Good news everyone!
    {{else}}
        Bad news everyone!
    {{/empty}}

**result**
    Good news everyone!

#### any

Conditionally render a block if the collection isn't empty. Opposite of `empty`

**Parameters**: none.
**Usage**:

    collection = ['Professor Farnsworth']

    {{#any collection}}
        Good news everyone!
    {{else}}
        Bad news everyone!
    {{/any}}

**result**
    Good news everyone!

#### inArray

Conditionally render a block if a specified value is in the collection.

**Parameters**:

    value [string|int] - A value to test against. (Required)
**Usage**:

    collection = ['Professor Farnsworth', 'Fry', 'Bender']

    {{#inArray collection "Fry"}}
        I'm walking on sunshine!
    {{else}}
        I'm walking on darkness.
    {{/any}}

**result**
    I'm walking on sunshine!

#### eachIndex

Current implementation of the default Handlebars loop helper {{#each}} adding index (0-based index) to the loop context.

**Parameters**: none.
**Usage**:

    collection = ['Professor Farnsworth', 'Fry', 'Bender']

    {{#eachIndex collection}}
        {{this}} is {{index}}
    {{/eachIndex}}

**result**
    Professor Farnsworth is 0, Fry is 1, Bender is 2

### Math

#### add

Returns the sum of two numbers.

**Parameters**:

    value [int] - The number to add to the expression. (Required)
**Usage**:

    value = 5

    {{add value 5}}

**result**
    10

#### subtract

Returns the difference of two numbers. Opposite of `add`

**Parameters**:

    value [int] - The number to subtract from the expression. (Required)
**Usage**:

    value = 5

    {{subtract value 5}}

**result**
    0

#### divide

Returns the division of two numbers.

**Parameters**:

    value [int] - The number to divide the expression. (Required)
**Usage**:

    value = 5

    {{divide value 5}}

**result**
    1

#### multiply

Returns the multiplication of two numbers.

**Parameters**:

    value [int] - The number to multiply the expression. (Required)
**Usage**:

    value = 5

    {{multiply value 5}}

**result**
    25

#### floor

Returns the value rounded down to the nearest integer.

**Parameters**: none.
**Usage**:

    value = 5.6

    {{floor value}}

**result**
    5

#### ceil

Returns the value rounded up to the nearest integer.

**Parameters**: none.
**Usage**:

    value = 5.6

    {{ceil value}}

**result**
    6

#### round

Returns the value rounded to the nearest integer.

**Parameters**: none.
**Usage**:

    value = 5.69

    {{round value}}

**result**
    6

### Numbers

#### toFixed

Returns exactly `digits` after the decimal place. The number is rounded if necessary, and the fractional part is padded with zeros if necessary so that it has the specified length.

**Parameters**:

    digits [int] - The number of digits to appear after the decimal point. (Optional)
**Usage**:

    value = 5.53231

    {{toFixed value 3}}

**result**
    5.532

#### toPrecision

Returns the number in fixed-point or exponential notation rounded to `precision` significant digits.

**Parameters**:

    precision [int] - The number of digits. If omitted, it returns the entire number (without any formatting). (Optional)
**Usage**:

    value = 555.322

    {{toPrecision value 4}}

**result**
    555.3


#### toExponential

Returns the number in exponential notation with one digit before the decimal point, rounded to `fractions` digits after the decimal point.

**Parameters**:

    fractions [int] - An integer specifying the number of digits after the decimal point. (Optional)
**Usage**:

    value = 5

    {{toExponential value 5}}

**result**
    5.00000e+0

#### toInt

Returns an integer.

**Parameters**: none.
**Usage**:

    value = '22.2abc'

    {{toInt value}}

**result**
    22

#### toFloat

Returns a floating point number.

**Parameters**: none.
**Usage**:

    value = '22.2abc'

    {{toFloat value}}

**result**
    22.2

#### addCommas

Adds commas to a number.

**Parameters**: none.
**Usage**:

    value = 2222222

    {{addCommas value}}

**result**
    2,222,222



### Comparisons

#### is

Conditionally render a block if the condition is true.

**Parameters**:

    value [string|int] - the value to test against.
**Usage**:

    number = 5

    {{#is number 5}}
        Kiss my shiny metal ass!
    {{else}}
        Never mind :(
    {{/is}}

**result**
    Kiss my shiny metal ass!

#### isnt

Conditionally render a block if the condition is false. Opposite of `is`.

**Parameters**:

    value [string|int] - the value to test against.
**Usage**:

    number = 5

    {{#isnt number 5}}
        Kiss my shiny metal ass!
    {{else}}
        Never mind :(
    {{/isnt}}

**result**
    Never mind :(

#### gt

Conditionally render a block if the value is greater than a given number.

**Parameters**:

    value [string|int] - the value to test against.
**Usage**:

    number = 5

    {{#gt number 8}}
        Kiss my shiny metal ass!
    {{else}}
        Never mind :(
    {{/gt}}

**result**
   Never mind :(

#### gte

Conditionally render a block if the value is greater or equal than a given number.

**Parameters**:

    value [string|int] - the value to test against.
**Usage**:

    number = 5

    {{#gte number 5}}
        Kiss my shiny metal ass!
    {{else}}
        Never mind :(
    {{/gte}}

**result**
    Kiss my shiny metal ass!

#### lt

Conditionally render a block if the value is less than a given number. Opposite of `gt`.

**Parameters**:

    value [string|int] - the value to test against.
**Usage**:

    number = 5

    {{#lt number 3}}
        Kiss my shiny metal ass!
    {{else}}
        Never mind :(
    {{/lt}}

**result**
    Never mind :(

#### lte

Conditionally render a block if the value is less or equal than a given number. Opposite of `gte`.

**Parameters**:

    value [string|int] - the value to test against.
**Usage**:

    number = 5

    {{#lte number 5}}
        Kiss my shiny metal ass!
    {{else}}
        Never mind :(
    {{/lte}}

**result**
    Kiss my shiny metal ass!

#### or

Conditionally render a block if one of the values is truthy.

**Parameters**:

    values [string|int] - the values to test against.
**Usage**:

    great = no
    magnificent = true

    {{#or great magnificent}}
        Kiss my shiny metal ass!
    {{else}}
        Never mind :(
    {{/or}}

**result**
    Kiss my shiny metal ass!

#### and

Conditionally render a block if both values are truthy.

**Parameters**:

    values [string|int] - the values to test against.
**Usage**:

    great = true
    magnificent = true

    {{#and great magnificent}}
        Kiss my shiny metal ass!
    {{else}}
        Never mind :(
    {{/and}}

**result**
    Kiss my shiny metal ass!

### Dates

#### formatDate

Formats a date into a string given a format. Accepts any value that can be passed to `new Date()`. This helper is a port of the [formatDate-js](http://https://github.com/michaelbaldry/formatDate-js) library by [Michael Baldry](https://github.com/michaelbaldry).

**Parameters**:

    format [string] - The format string, according to these tokens: (http://www.ruby-doc.org/core-1.9.3/Time.html#method-i-strftime) (Required)
**Usage**:

    date = new Date()

    {{formatDate date "%m/%d/%Y"}}
    {{formatDate date "%I:%M%p"}}
    {{formatDate date "%F"}}
    {{formatDate date "%Y%m%dT%H%M%S%z"}}

**result**
    07/26/2012
    11:38PM
    2012-07-26
    20120726T233805-0004

#### now

Returns the current date.

**Parameters**:

    format [string] - The format string, according to these tokens: http://www.ruby-doc.org/core-1.9.3/Time.html#method-i-strftime (Optional)
**Usage**:

    {{now}}
    {{now "%m/%d/%Y"}}

**result**
    Thu Jul 26 2012 23:41:02 GMT-0400 (AST)
    07/26/2012

#### timeago

Returns a human-readable time phrase from the given date.

**Parameters**: none.
**Usage**:

    date = 'Thu Jul 22 2012 23:41:02 GMT-0400 (AST)'

    {{timeago date}}

**result**
    4 days ago

### Inflections

#### inflect

Returns the plural or singular form of a word based on a count.

**Parameters**:

    singular [string] - The singular form of the word. (Required)
    plural [string] - The plural form of the word. (Required)
    include [boolean] - whether or not to include the count before the word. (Optional)
**Usage**:

    enemies = 0
    friends = 1

    {{inflect enemies "enemy" "enemies"}}
    {{inflect friends "friend" "friends" true}}

**result**
    enemies
    1 friend

#### ordinalize

Turns a number into an ordinal string. Taken from the templating library [Walrus](https://github.com/jeremyruppel/walrus) by [Jeremy Ruppel](https://github.com/jeremyruppel).

**Parameters**: none.
**Usage**:

    {{ordinalize 3}}
    {{ordinalize 1}}
    {{ordinalize 22}}

**result**
    3rd
    1st
    22nd

### HTML

#### ul

Creates an unordered list.

**Parameters**:

    hash [html attributes] - HTML attributes to use on the ul element. (Optional)
**Usage**:

    collection = [
            name: 'Leela'
            deliveries: 8021
        ,
            name: 'Bender'
            deliveries: 239
        ,
            name: 'Fry'
            deliveries: 1
    ]

    {{#ul collection class="deliveries-list"}}
        {{name}} - {{inflect deliveries "delivery" "deliveries" true}}
    {{/ul}}

**result**
    <ul class="deliveries-list">
        <li>
            Leela - 8021 deliveries
        </li>
        <li>
            Bender - 239 deliveries
        </li>
        <li>
            Fry - 1 delivery
        </li>
    </ul>

#### ol

Same as the `ul` helper but creates and ordered list.

#### br

Returns `<br>` tags based on a count.

**Parameters**:

    count [int] - The number of `br` elements to render. (Optional)
**Usage**:

    {{br 5}}

**result**
    <br><br><br><br><br>

### Logging

#### log

Simple console.log()

**Parameters**: none.
**Usage**:

    {{log "Hi console :)"}}

**result**
    Hi console :)

#### debug

Simple console.debug() that shows the current context.

**Parameters**: none.
**Usage**:

    collection = [
            name: 'Leela'
            deliveries: 8021
        ,
            name: 'Bender'
            deliveries: 239
        ,
            name: 'Fry'
            deliveries: 1
    ]

    {{#withFirst collection}}
        {{debug name}}
    {{/withFirst}}

**result**
    Context: { deliveries: 8021, name: "Leela" }
    Value: Leela
    -----------------------------------------------

### Miscellaneous

#### default

Provides a default or fallback value if a value doesn't exist.

**Parameters**:

    defaultValue [string|int] - The default value to use.
**Usage**:

    title = ''

    {{default title "Not title available."}}

**result**
    Not title available.

#### partial

Provides an easy way to register and use partials inside your templates. This helper only works if you define your templates as common.js modules, since it uses the common.js `require` function to find and register your templates with `Handlebars.registerPartial`. It was created with [brunch](http://brunch.io) in mind (which I use a lot), because brunch automatically wraps your scripts and templates in common.js modules to use in the browser.

**Parameters**:

    name [string] - The name or path of the file in which your template is define. You can tell swag where your templates folder is by overriding Swag.Config.partialsPath. (Required)

    data [int|string|collection] - The data you want to use inside the partial. (Optional)
**Usage**:

    # Path to your templates from where yo override Swag.Config.partialsPath
    # The path must finish with a foward slash '/'
    Swag.Config.partialsPath = '../views/templates/'

    collection = ['Professor Farnsworth', 'Fry', 'Bender']

    # Your Partial (planet_express.hbs)
    {{sort this}}

    # Your template
    <p>
        {{partial "planet_express" collection}}
    </p>

**result**
    <p>Bender, Fry, Professor Farnsworth</p>



## Credit

Many of these helpers come from the following repos:
  * [Handlebars Helpers, by Dan Harper](http://github.com/danharper)
  * [Swag v0.2.1, by Elving Rodriguez](http://elving.github.com/swag/)



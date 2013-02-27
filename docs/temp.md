# Filters and Helpers

Filters manipulate the output of variables. Filters look like this `{{ filter_name variable_name }}`. For example:

```
<title>{{ uppercase page.title }}</title>
```
Output

```
<title>YOUR PAGE TITLE</title>
```

## HTML Filters

  * [[Img_tag|img_tag]] ''Wraps element in &lt;img&gt; tag.'' '''img_tag(url, alt=&quot;&quot;)'''
  * [[Script_tag|script_tag]] ''Wraps element in &lt;script&gt; tag''
  * [[Stylesheet_tag|stylesheet_tag]] ''Wraps link in a stylesheet &lt;link&gt; tag''

## URL Filters

  * [[Asset_url|asset_url]] ''Returns the url for an asset.''
  * [[Global_asset_url|global_asset_url]] ''Returns the url for a global asset.''
  * [[Link_to|link_to]] ''Creates a &lt;a href=&quot;&quot;&gt; tag.'' '''link_to: 'http://example.com', 'title tag text''''
  * [[Link_to_vendor|link_to_vendor]] ''Creates a link to the vendor page''
  * [[Link_to_type|link_to_type]] ''Creates a link to the type page''
  * [[Link_to_tag|link_to_tag]] ''Creates a link to the tag page''
  * [[Link_to_theme|link_to_theme]] ''Generates a link to switch to a different theme by role''
  * [[Link_to_add_tag|link_to_add_tag]] ''Links to products that have the given tag and any previously applied tags''
  * [[Link_to_remove_tag|link_to_remove_tag]]
  * [[Product_img_url|product_img_url]] ''Generates a product image's URL for a particular size'' '''img_url: 'size''''
  * [[Collection img url|collection_img_url]] ''Generates a collection image's URL for a particular size'' '''img_url: 'size''''
  * [[Theme_url|theme_url]] ''Generates a URL to switch to a different theme by role''
  * [[Url_for_vendor|url_for_vendor]] ''Creates an url for a vendor name''
  * [[Url_for_type|url_for_type]] ''Creates an url for type name''
  * [[Url_for_product|url_for_product]] ''Creates an url to a product page based on a handleized product title''

## Money Filters

  * [[Money_with_currency|money_with_currency]] ''Takes a number and wraps in the currency symbol and descriptor''
  * [[Money_without_currency|money_without_currency]] ''Formats the number, but displays no currency symbol or descriptor''
  * [[Money|money]] ''Converts a number into a string based on your currency''

## Math Filters

  * [[Plus|plus]] ''Adding input to operand'' '''plus: 10'''
  * [[Minus|minus]] ''Subtracting input from operand'' '''minus: 10'''
  * [[Times|times]] ''Multiplying input by operand'' '''times: 10'''
  * [[Divided_by|divided_by]] ''Dividing input by operand'' '''divided_by: 10'''

## Manipulation Filters

  * [[Append|append]] ''Append characters to a string''
  * [[Camelize|camelize]] ''Converts into CamelCase, strips spaces and irregular characters''
  * [[Capitalize|capitalize]] ''Capitalizes a string''
  * [[Date|date]] ''Reformat a date''
  * [[Paginate#The_easy_way:_default_pagination|default_pagination]] ''Use with the paginate liquid tag to create pagination''
  * [[Downcase|downcase]] ''Converts a string into lowercase''
  * [[Escape|escape]] ''Escapes a string''
  * [[First|first]] ''Get the first element of the passed in array''
  * [[Handleize|handleize]] ''Non-word characters are stripped out and characters are lowercased''
  * [[Highlight_active_tag|highlight_active_tag]] ''Creats a span with the class &quot;active&quot;''
  * [[Join|join]] ''Joins an array with a specified character'' '''join: ', ''''
  * [[Last|last]] ''Get the last element in an array''
  * [[Replace_first|replace_first]] ''Replace the first occurrence of a string with another''
  * [[Remove|remove]] ''Removes all occurrences of the substring from the input'' '''remove: 'red''''
  * [[Remove_first|remove_first]] ''Removes only the first occurrence of the substring from the input'' '''remove_first: 'red''''
  * [[Newline_to_br|newline_to_br]] ''Inserts a &lt;br /&gt; tag in front of every \n linebreak character.''
  * [[Pluralize|pluralize]] ''Can make a word plural'' '''pluralize: 'item', 'items''''
  * [[Prepend|prepend]] ''Append characters to a string''
  * [[Size|size]] ''Return the size of an array or string''
  * [[Split|split]] ''Divides a string into substrings based on a delimiter, returning an array of these substrings''
  * [[Strip_html|strip_html]] ''Striple all html tags from string''
  * [[Strip_newlines|strip_newlines]] ''Removes all newlines from the input''
  * [[Replace|replace]] ''Will replace all occurrences of a string with another''
  * [[Truncate|truncate]] ''Truncate a string down to x characters''
  * [[Truncatewords|truncatewords]] ''Truncate string down to x words''
  * [[Upcase|upcase]] ''Convert a input string to uppercase''
  * [[Weight_with_unit|weight_with_unit]] ''Converts a weight into the unit system of the shop''
  * [[Json|json]] ''Converts some content into a JSON string''
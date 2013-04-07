

#### global


`site` Sitewide information and configuration settings from [some-file].{yml,json}

`page` This data if from the YAML Front Matter or [page].json, with additional pre-defined variables for url and content.

`content` In layout files, this contains the content of the subview(s). This is the variable used to insert the rendered content into the layout. This is not used in post files or page files.

`pagination` When the paginate configuration option is set, this variable becomes available for use.

`custom` Any other variable that you add to the options in the assemble task/target will be added to the root of the data context and be available in any templates

`root` Root url of the generated site?

`url` URL of the current page?



#### site


`time` Current time the site was generated.

`pages` List of all the page objects

`` Is this needed?

`related` This should be in the page object.

`categories` List of all the category objects

`tags` List of all tag objects



#### page


`title` page title provided by the page yaml header

`url` full URL of the page from the page root

`date` date the page was generated

`categories` List of category objects that are associated with this page. These should be provided in the yaml header.

`tags` List of tag objects that are associated with this page. These should be provided in the yaml header.

`next` The full/relative? URL to the &quot;next&quot; page. The next page will be the next page from the pages list. Can be overridden in the yaml header.

`previous` The full/relative? URL to the &quot;previous&quot; page. The previous page will the previous page from the pages list. Can be overridden in the yaml header.

`content` Rendered page content... Is this needed?

`custom` Any custom front matter that you specify will be available under &#x60;page&#x60;. For example, if you specify &#x60;something: true&#x60; in a page&#x27;s front matter, that value will be available in templates as &#x60;page.something&#x60;



#### pagination


`per_page` Number of &quot;pages&quot; shown per list page.

`total_pages` Total number of pagination pages.?

`page` Current pagination page.?

`previous_page` Previous pagination page.?

`next_page` Next pagination page.?






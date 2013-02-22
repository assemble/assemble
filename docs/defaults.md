## Default Configuration Objects

A reference of the default variables included with Assemble.

Note that you are not limited to these variables, you may add any custom variables you require to any configuration files (such as `defaults.json`, `config.json`, `.build`, `.buildignore`, `global.json`). You may also change any of the default values to whatever works best for you, as long as you are aware that with customization comes potential for conflicting variables.


## Default Variables

* **defaults**: set the defaults to use across projects. For example, `author name` and `email`.

`defaults.json`

``` json
{
  "author": {
    "name": "Jon Schlinkert",
    "email": "jon@sellside.com",
    "url": "https://jonschlinkert.github.com/"
  }
}
```


**Configuration Variables**
* **config**: build configuation. Example: path to custom helpers.
  * **build** and **buildignore**: project file paths and path-exclude patterns, respectively.

**Project Variables**
* **global**: global variable for a single project.
  * **site**:
    * **page**:
    * **post**:




## build / buildignore

TODO...



## config

TODO...


## global

| **Variable** | **Description** |
| `global` | Default information and configuration settings from `global.json` |
| `site` | Project-wide information and configuration settings from `global.json` |
| `page` | This is just the [[YAML Front Matter]] with 2 additions: `url` and `content`. |
| `post` | This is just the [[YAML Front Matter]] with 2 additions: `url` and `content`. |
| `content` | In layout files, this contains the content of the subview(s). This is the variable used to insert the rendered content into the layout. This is not used in post files or page files. |
| `paginator`| When the `paginate` configuration option is set, this variable becomes available for use. |


### site

| **Variable** | **Description** |
| `site.time` | The current Time (when you run the Assemble command). |
| `site.posts` | A reverse chronological list of all Posts. |
| `site.related_posts` |If the page being processed is a Post, this contains a list of up to ten related Posts. By default, these are low quality but fast to compute. For high quality but slow to compute results, run the Assemble command with the `--lsi` (latent semantic indexing) option. |
| `site.categories.CATEGORY` | The list of all Posts in category `CATEGORY`. |
| `site.tags.TAG` | The list of all Posts with tag `TAG`. |
| `site.[CONFIGURATION_DATA]` | As of **0.5.2**, all data inside of your `global.json` or `global.yml` is now available through the `site` variable. So for example, if you have `url: http://mysite.com` in your configuration file, then in your posts and pages it can be used like so: <code>{{ site.url }}</code>. Assemble does not parse a changed `global.json` or `global.yml` in `auto` mode, you have to restart Assemble. |
| `site.pages` | The list of all (non-post) pages which contain YAML front matter. |


#### page

| **Variable** | **Description** |
| `page.content` | The un-rendered content of the Page. |
| `page.title` | The title of the Post. |
| `page.url` | The URL of the Post without the domain. e.g. `/2013/12/14/my-post.html` |
| `page.date` | The Date assigned to the Post. This can be overridden in a post's front matter by specifying a new date/time in the format `YYYY-MM-DD HH:MM:SS` |
| `page.id` | An identifier unique to the Post (useful in RSS feeds). e.g. `/2013/12/14/my-post` |
| `page.categories` | The list of categories to which this post belongs. Categories are derived from the directory structure above the ==_posts== directory. For example, a post at `/work/code/_posts/2013-12-24-closures.textile` would have this field set to `['work', 'code']`. These can also be specified in the [[YAML Front Matter]] |
| `page.tags` | The list of tags to which this post belongs. These can be specified in the [[YAML Front Matter]] |
| `page.next` | The chronologically newer post |
| `page.previous` | The chronologically older post |

Note: Any custom front matter that you specify will be available under `page`. For example, if you specify `custom_css: true` in a page's front matter, that value will be available in templates as `page.custom_css`


#### post



#### paginator

**note: only available in index files, can be in subdirectory /blog/index.html**

| **Variable** | **Description** |
| `paginator.per_page` | Number of posts per page. |
| `paginator.posts` | Posts available for that page. |
| `paginator.total_posts` | Total number of posts. |
| `paginator.total_pages` | Total number of pages. |
| `paginator.page` | The number of the current page. |
| `paginator.previous_page` | The number of the previous page. |
| `paginator.next_page` | The number of the next page. |



Assemble supports a flexible way to build your site's URLs. You can specify the permalinks for your site through the [[Configuration]] or on the [[YAML Front Matter]] for each post. You're free to choose one of the built-in styles to create your links or craft your own. The default style is always `date`.

*Note that even with <code>--auto</code> enabled, making changes to the permalink setting while Assemble is running will require you restart Assemble before new permalink templates will take effect.*

h2. Template Variables

| *Variable* | *Description* |
| `year` | Year from the post's filename |
| `month` | Month from the post's filename |
| `day` | Day from the post's filename |
| `title` | Title from the post's filename |
| `categories` | The specified categories for this post. Assemble automatically parses out double slashes in the URLs, so if no categories are present, it basically ignores this. |
| `i_month` | Month from the post's filename without leading zeros. |
| `i_day` | Day from the post's filename without leading zeros. |

h2. Built-in styles

| *Name*  | *Template* |
| `date` | `/:categories/:year/:month/:day/:title.html` |
| `pretty` | `/:categories/:year/:month/:day/:title/` |
| `none` | `/:categories/:title.html` |

h2. Examples

Given a post named: `/2009-04-29-slap-chop.textile`

| *Setting* | *Result* |
| None specified. | `/2009/04/29/slap-chop.html` |
| `permalink: pretty` | `/2009/04/29/slap-chop/index.html` |
| `permalink: /:month-:day-:year/:title.html` | `/04-29-2009/slap-chop.html` |
| `permalink: /blog/:year/:month/:day/:title` | `/blog/2009/04/29/slap-chop/index.html` |



## Overriding Defaults

Inside a task configuration (in your Gruntfile), an `options` property may be specified to override built-in defaults. In addition, each target may have an `options` property which is specific to that target. So task-level options will override global defaults, and target-level options will override task-level options.

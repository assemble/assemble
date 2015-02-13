# Build-in options

> If defined, these options will be used as configuration settings for assemble's built-in features

- `assets`
- `base`
- `defaults`
- `delims`
- `destExt`
- `encoding`
- `env`
- `ext`
- `flatten` (WIP - not working yet)
- `layout`
- `layoutext`
- `layouts`
- `renameKey`
- `root`
- `templates`
- `viewEngine`
- `views`


- `viewEngine`: (default: `.hbs`)
- `destExt`: (default: `.html`)
- `ext`: (default: `.hbs`)
- `defaults', {
- `renameKey', function(filepath) {
- `defaults');

- `env`:  `process.env.NODE_ENV` or `dev`
- `encoding`: (default: `utf8`)
- `base`: `this.cache.cwd);`
- `assets`: (default: `assets`)
- `root`: (default: `dist`)
- `delims`: `['{{', '}}']`
- `views`: (default: `templates`)
- `templates`: (default: `templates`)


### Enabled by default

The following boolean options are enabled by default, but can be disabled using `assemble.disable('foo')`.

- `case sensitive routing`
- `strict routing`
- `src:init plugin`
- `src:assets plugin`
- `src:extend plugin`
- `src:drafts plugin`
- `src:paginate plugin`
- `dest:extend plugin`
- `dest:collections plugin`
- `dest:paths plugin`
- `dest:ext plugin`
- `dest:render plugin`

### Disabled by default

The following boolean options are disabled by default, but can be enabled using `assemble.enable('foo')`.

- `default engines`
- `default routes`
- `minimal config`

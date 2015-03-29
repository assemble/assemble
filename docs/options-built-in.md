# Build-in options

> If defined, these options will be used as configuration settings for assemble's built-in features

- `assets`: (default: `assets`)
- `base`:  (default: `cwd`)
- `delims`: `['{{', '}}']`
- `destExt`: (default: `.html`)
- `encoding`: (default: `utf8`)
- `env`:  (default: `process.env.NODE_ENV` or `dev`)
- `ext`: (default: `.hbs`)
- `flatten` (WIP - not working yet)
- `layout`: (default: `default`)
- `layoutext`: (default: `.hbs`)
- `layouts`: (default: `undefined`)
- `renameKey`: (default: uses `path.basename()`)
- `root`: (default: `dist`)
- `templates`: (default: `templates`)
- `viewEngine`: (default: `.hbs`)
- `views`: (default: `templates`)

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

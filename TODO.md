# TODO

>

## Have to have:

* README.md
* assemble.io updated
* examples
* grunt plugin?
* gulp plugin?


## PR

- [ ] docs
- [ ] blog post
			* uses vinyl
			* uses orchestrator
			* express-like
			* 10 pages in ??? seconds (complexity?)
			* 100 pages in ??? seconds (complexity?)
			* 1k pages in ??? seconds (complexity?)
			* 10k pages in 40 seconds
			* 100k pages in 40 seconds
- [ ] * speed

> Since we're hitting a limited number of small files repeatedly, we want the advantages of caching the data for these files. In these cases, we read all of the files with `fs.readFile` during the `init` phase, parse the files into `file` objects that are stored in a hash, allowing them to be accessed directly from memory on each request. It will always be fastest to avoid the file system entirely during this request cycle.

> We use streams in cases where files are read, parsed and rendered in one step.

## Docs

- [x] plugin guide (use gulp's docs)
- [x] engine guide (use consolidate)
- [x] template guide (use whichever one you want)


## Code

- [ ] update/publish plugins


## Methods

The following methods still need to be finished

- [ ] `.config`
- [ ] `.options`
- [ ] `.page`
- [ ] `.pages`
- [ ] `.partial`
- [ ] `.partials`
- [ ] `.layout`
- [ ] `.layouts`


### Features

- [x] options/config
- [ ] permalinks
- [x] rte

- [x] data files
- [x] context
- [ ] assets
- [x] front-matter parsing: gray-matter

- [x] engines/consolidate
- [ ] helpers

Views

- [x] layouts
- [ ] pages
- [ ] posts
- [x] partials

- [x] index
- [x] pagination


## Handlebars

- [x] partials
- [ ] helpers

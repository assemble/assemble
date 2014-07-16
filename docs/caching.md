## Caching


```js
{
  // as originally defined
	"orig": {
	  "options": {
 			"partials": ["templates/*.hbs"]
	  },
		"context": {},
		"data": {}
	},
	// expanded and resolved
	"staging": {
	  "options": {
 			"partials": [
 				"templates/a.hbs",
 				"templates/b.hbs"
 			]
	  },
		"context": {},
		"data": {}
	},
	// read in, parsed
	"cache": {
	  "options": {
 			"partials": {
 				"templates/a.hbs" {
 					"matter": {
 						"title": "I'm A"
					},
 					"contents": "\n{{title}}",
 					"original": "---\ntitle: I'm A\n---\n\n{{title}}"
 				}
 			}
	  },
		"context": {},
		"data": {}
	},

	// root is reserved for methods
	options: [Function],
	context: [Function],
	data: [Function]
}


assemble.set('a', 'b'); /// emit('set', {a: 'b'});
assemble.get('a');
```

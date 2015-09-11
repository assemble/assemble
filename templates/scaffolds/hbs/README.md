# CLI Help


## Flags

 - `--local`: only search and use local scaffolds 
 - `--global`: only search and use global scaffolds 
- `--find`: find a file/template that matches the given pattern. Example `--find:post...something`


## Data


```sh
$ assemble new data:button > data/button-success.json
```

## Posts


```sh
$ assemble new post --type=list tags.hbs
$ assemble new post:list tags.hbs --data
```

**Find data**

```sh
$ assemble new post --find:data/*post
```


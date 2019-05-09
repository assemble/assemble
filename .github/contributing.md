# Contributing to Assemble

First and foremost, thank you! We appreciate that you want to contribute to Assemble, your time is valuable, and your contributions mean a lot to us.

**What does "contributing" mean?**

Creating an issue is the simplest form of contributing to a project. But there are many ways to contribute, including the following:

- Updating or correcting documentation
- Feature requests
- Bug reports

## Issues

**Before creating an issue**

Please make sure you're creating one in the right place:

- do you have a template syntax question? Like how to accomplish something with handlebars? The best place to get answers for this is [stackoverflow.com][so], the [handlebars docs](handlebarsjs.com), or the documentation for the template engine you're using.
- Are you having an issue with an Assemble feature that is powered by an underlying lib? This is sometimes difficult to know, but sometimes it can be pretty easy to find out. For example, if you use a glob pattern somewhere and you found what you believe to be a matching bug, that would probably be an issue for [node-glob][] or [micromatch][]

**Creating an issue**

Please be as descriptive as possible when creating an issue. Give us the information we need to successfully answer your question or address your issue by answering the following in your issue:

- what version of assemble are you using? 
- is the issue helper-related? If so, this issue should probably be opened on the repo related to the helper being used.
- do you have any custom helpers defined? Is the issue related to the helper itself, data (context) being passed to the helper, or actually registering the helper in the first place?
- are you using middleware?
- any plugins?


## Above and beyond

Here are some tips for creating idiomatic issues. Taking just a little bit extra time will make your issue easier to read, easier to resolve, more likely to be found by others who have the same or similar issue in the future. 

- take some time to learn basic markdown. This [markdown cheatsheet](https://gist.github.com/jonschlinkert/5854601) is super helpful, as is the GitHub guide to [basic markdown](https://help.github.com/articles/markdown-basics/).
- Learn about [GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown/). And if you want to really go above and beyond, read [mastering markdown](https://guides.github.com/features/mastering-markdown/).
- use backticks to wrap code. This ensures that code will retain its format, making it much more readable to others 
- use syntax highlighting by adding the correct language name after the first "code fence"

[node-glob]: https://github.com/isaacs/node-glob
[micromatch]: https://github.com/jonschlinkert/micromatch
[so]: http://stackoverflow.com/questions/tagged/assemble
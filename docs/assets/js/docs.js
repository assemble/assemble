
!function ($) {

  $(function(){
    initVersions();
    initSearch();
  });

  function initVersions() {
    var versions = $('#dropdown-versions');

    // build the versions dropdown list
    $.ajax('/versions.json')
      .done(function(data) {
        var version = 'v' + site.version;
        var current = data[version];
        var currentPage = currentPath.replace(destBase, '');
        if (currentPage[0] === '/') {
          currentPage = currentPage.substr(1);
        }
        currentPage = currentPage.split('/').slice(2).join('/');

        var list = Object.keys(data)
          // remove current version
          .filter(function(key) {
            return key !== version;
          }).map(function(key) {
            var old = data[key];

            // find any pages that might match the current page from an old version
            var matches = old.filter(function(page) {
              return currentPage === page.split('/').slice(2).join('/');
            });
            if (matches.length) {
              return matches[0];
            }

            // otherwise return the index of the version
            var first = old.filter(function(page) {
              return page.split('/').slice(2).join('/').indexOf('index.html') === 0;
            });
            return first.length ? first[0] : undefined;
          }).filter(Boolean);

        // sort higher versions to the top
        list.reverse();

        // list the current version first
        versions.append('<li><a href="/' + currentPath.replace(destBase, '').substr(1) + '">' + version + ' (Current)</a></li>');
        versions.append('<li role="separator" class="nav-divider"></li>');

        var i = 0;
        // list all matching versions
        list.forEach(function(page) {
          var v = page.split('/')[1];
          if (i !== 0 && v === 'v0.4.42') {
            versions.append('<li role="separator" class="nav-divider"></li>');
          }
          versions.append('<li><a href="/' + page + '">' + v + (v === 'v0.4.42' ? ' (grunt-assemble)' : '') + '</a></li>');
          i++;
        });
      })
      .fail(function(err) {
        console.log(err.responseText);
      });
  }

  function initSearch() {
    var searchIdx = null;
    var files = null;

    var search = $('#search');
    if (!search || !search.length) {
      return;
    }

    search.keypress(function(event) {
      if (event.which == 13) {
        event.preventDefault();
      }
    });

    search.autocomplete({
      // use lunr search index to find a page based on specified search term
      source: function(req, res) {
        if (!searchIdx) return res();
        var results = searchIdx.search(req.term)
          .map(function(result) {
            return {
              label: files[result.ref].title,
              value: files[result.ref]
            };
          });

        res(results);
      },

      // disable populating the search box with the focused result
      focus: function(event, ui) {
        return false;
      },

      // when selected, clear the sarch box and navigate to the selected page
      select: function(event, ui) {
        search.val('');
        window.location = ui.item.value.url.replace('_gh_pages', '');
        return false;
      }
    });

    // modify the <li> being rendered for each item to provide more context to the
    // found search results
    search.data('uiAutocomplete')._renderItem =function(ul, item) {
      return $('<li class="list-group-item">')
        .attr('data-value', item.value)
        .append($('<h4 class="list-group-item-heading">').append(`[${item.value.category.toUpperCase()}] ${item.label}`))
        .append($('<p class="list-group-item-text">').append(item.value.description))
        .appendTo(ul);
    };

    // add additional class information to the <ul> being rendered
    search.data('uiAutocomplete')._renderMenu = function( ul, items ) {
      var that = this;
      ul.attr('class', 'list-group');
      $.each(items, function(index, item) {
        that._renderItemData(ul, item);
      });
    };

    // load the search index and file results
    $.ajax('/en/v' + site.version + '/search.json')
      .done(function(data) {
        files = Object.keys(data.files).reduce(function(acc, key) {
          var file = data.files[key];
          acc[file.url] = file;
          return acc;
        }, {});
        searchIdx = lunr.Index.load(data.idx);
      })
      .fail(function(err) {
        console.log(err.responseText);
      });
  }


}(window.jQuery);

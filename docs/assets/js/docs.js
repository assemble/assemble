
!function ($) {

  $(function(){
    var versions = $('#dropdown-versions');
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
  });

}(window.jQuery);

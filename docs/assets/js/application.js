// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

!function ($) {

  $(function(){

    var $window = $(window);

    var versions = $('#dropdown-versions');

    $.ajax('/versions.json')
      .done(function(data) {
        var version = 'v' + site.version;
        var current = data[version];
        var currentPage = currentPath.replace(destBase, '');
        if (currentPage[0] === '/') {
          currentPage = currentPage.substr(1);
        }
        currentPage = currentPage.split('/').slice(3).join('/');

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
        versions.append('<li><a href="/' + currentPath.replace(destBase, '').substr(1) + '">Current (' + version + ')</a></li>');
        versions.append('<li role="separator" class="nav-divider"></li>');

        // list all matching versions
        list.forEach(function(page) {
          versions.append('<li><a href="/' + page + '">' + page.split('/')[1] + '</a></li>');
        });
      })
      .fail(function(err) {
        console.log(err.responseText);
      });

    // Disable certain links in docs
    $('section [href^=#]').click(function (e) {
      e.preventDefault()
    })

    // back to top
    setTimeout(function () {
      $('.sidebar').affix({
        offset: {
          top: function () { return $window.width() <= 980 ? 290 : 210 }
        , bottom: 270
        }
      })
    }, 100)

    setTimeout(function () {
      $('.bs-top').affix()
    }, 100)

    // add tipsies to grid for scaffolding
    if ($('#grid-system').length) {
      $('#grid-system').tooltip({
          selector: '.show-grid > [class*="span"]'
        , title: function () { return $(this).width() + 'px' }
      })
    }

    // tooltip demo
    $('.tooltip-demo').tooltip({
      selector: "a[data-toggle=tooltip]"
    })

    $('.tooltip-test').tooltip()
    $('.popover-test').popover()

    $('.bs-docs-navbar').tooltip({
      selector: "a[data-toggle=tooltip]",
      container: ".bs-docs-navbar .nav"
    })

    // popover demo
    $("a[data-toggle=popover]")
      .popover()
      .click(function(e) {
        e.preventDefault()
      })

    // button state demo
    $('#fat-btn')
      .click(function () {
        var btn = $(this)
        btn.button('loading')
        setTimeout(function () {
          btn.button('reset')
        }, 3000)
      })

    // carousel demo
    $('.bs-docs-carousel-example').carousel()

    // javascript build logic
    var inputsComponent = $("#less input")
      , inputsPlugin = $("#plugins input")
      , inputsVariables = $("#variables input")

    // toggle all plugin checkboxes
    $('#components .toggle').on('click', function (e) {
      e.preventDefault()
      inputsComponent.prop('checked', !inputsComponent.is(':checked'))
    })

    $('#plugins .toggle').on('click', function (e) {
      e.preventDefault()
      inputsPlugin.prop('checked', !inputsPlugin.is(':checked'))
    })

    $('#variables .toggle').on('click', function (e) {
      e.preventDefault()
      inputsVariables.val('')
    })

    // request built javascript
    $('.download-btn .btn').on('click', function () {

      var css = $("#components input:checked")
            .map(function () { return this.value })
            .toArray()
        , js = $("#plugins input:checked")
            .map(function () { return this.value })
            .toArray()
        , vars = {}
        , img = ['glyphicons-halflings.png', 'glyphicons-halflings-white.png']

    $("#variables input")
      .each(function () {
        $(this).val() && (vars[ $(this).prev().text() ] = $(this).val())
      })

      $.ajax({
        type: 'POST'
      , url: /\?dev/.test(window.location) ? 'http://localhost:3000' : 'http://bootstrap.herokuapp.com'
      , dataType: 'jsonpi'
      , params: {
          js: js
        , css: css
        , vars: vars
        , img: img
      }
      })
    })
  })

// Modified from the original jsonpi https://github.com/benvinegar/jquery-jsonpi
$.ajaxTransport('jsonpi', function(opts, originalOptions, jqXHR) {
  var url = opts.url;

  return {
    send: function(_, completeCallback) {
      var name = 'jQuery_iframe_' + jQuery.now()
        , iframe, form

      iframe = $('<iframe>')
        .attr('name', name)
        .appendTo('head')

      form = $('<form>')
        .attr('method', opts.type) // GET or POST
        .attr('action', url)
        .attr('target', name)

      $.each(opts.params, function(k, v) {

        $('<input>')
          .attr('type', 'hidden')
          .attr('name', k)
          .attr('value', typeof v == 'string' ? v : JSON.stringify(v))
          .appendTo(form)
      })

      form.appendTo('body').submit()
    }
  }
})

}(window.jQuery)

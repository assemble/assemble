// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

!function ($) {

  $(function(){

    var $window = $(window)

    // Disable certain links in docs
    $('section [href^=#]').click(function (e) {
      e.preventDefault()
    })

    // side bar
    $('.bs-docs-sidenav').affix({
      offset: {
        top: function () { return $window.width() <= 980 ? 290 : 210 }
      , bottom: 270
      }
    })

    // make code pretty
    window.prettyPrint && prettyPrint()

    // add-ons
    $('.add-on :checkbox').on('click', function () {
      var $this = $(this)
        , method = $this.attr('checked') ? 'addClass' : 'removeClass'
      $(this).parents('.add-on')[method]('active')
    })

    // add tipsies to grid for scaffolding
    if ($('#gridSystem').length) {
      $('#gridSystem').tooltip({
          selector: '.show-grid > div'
        , title: function () { return $(this).width() + 'px' }
      })
    }

    // tooltip demo
    $('.tooltip-demo').tooltip({
      selector: "a[rel=tooltip]"
    })

    $('.tooltip-test').tooltip()
    $('.popover-test').popover()

    // popover demo
    $("a[rel=popover]")
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
    $('#myCarousel').carousel()

    // javascript build logic
    var inputsComponent = $("#components.download input")
      , inputsPlugin = $("#plugins.download input")
      , inputsVariables = $("#variables.download input")

    // toggle all plugin checkboxes
    $('#components.download .toggle-all').on('click', function (e) {
      e.preventDefault()
      inputsComponent.attr('checked', !inputsComponent.is(':checked'))
    })

    $('#plugins.download .toggle-all').on('click', function (e) {
      e.preventDefault()
      inputsPlugin.attr('checked', !inputsPlugin.is(':checked'))
    })

    $('#variables.download .toggle-all').on('click', function (e) {
      e.preventDefault()
      inputsVariables.val('')
    })

    // request built javascript
    $('.download-btn').on('click', function () {

      var css = $("#components.download input:checked")
            .map(function () { return this.value })
            .toArray()
        , js = $("#plugins.download input:checked")
            .map(function () { return this.value })
            .toArray()
        , vars = {}
        , img = ['glyphicons-halflings.png', 'glyphicons-halflings-white.png']

    $("#variables.download input")
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



var metas = document.getElementsByTagName('meta');
var i;
if (navigator.userAgent.match(/iPhone/i)) {
  for (i=0; i<metas.length; i++) {
    if (metas[i].name == "viewport") {
      metas[i].content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
    }
  }
  document.addEventListener("gesturestart", gestureStart, false);
}
function gestureStart() {
  for (i=0; i<metas.length; i++) {
    if (metas[i].name == "viewport") {
      metas[i].content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
    }
  }
}




/*

Holder - 1.3 - client side image placeholders
(c) 2012 Ivan Malopinsky / http://imsky.co

Provided under the Apache 2.0 License: http://www.apache.org/licenses/LICENSE-2.0
Commercial use requires attribution.

*/

var Holder = Holder || {};
(function (app, win) {

var preempted = false,
fallback = false,
canvas = document.createElement('canvas');

//http://javascript.nwbox.com/ContentLoaded by Diego Perini with modifications
function contentLoaded(n,t){var l="complete",s="readystatechange",u=!1,h=u,c=!0,i=n.document,a=i.documentElement,e=i.addEventListener?"addEventListener":"attachEvent",v=i.addEventListener?"removeEventListener":"detachEvent",f=i.addEventListener?"":"on",r=function(e){(e.type!=s||i.readyState==l)&&((e.type=="load"?n:i)[v](f+e.type,r,u),!h&&(h=!0)&&t.call(n,null))},o=function(){try{a.doScroll("left")}catch(n){setTimeout(o,50);return}r("poll")};if(i.readyState==l)t.call(n,"lazy");else{if(i.createEventObject&&a.doScroll){try{c=!n.frameElement}catch(y){}c&&o()}i[e](f+"DOMContentLoaded",r,u),i[e](f+s,r,u),n[e](f+"load",r,u)}};

//https://gist.github.com/991057 by Jed Schmidt with modifications
function selector(a){
  a=a.match(/^(\W)?(.*)/);var b=document["getElement"+(a[1]?a[1]=="#"?"ById":"sByClassName":"sByTagName")](a[2]);
  var ret=[]; b!=null&&(b.length?ret=b:b.length==0?ret=b:ret=[b]);  return ret;
}

//shallow object property extend
function extend(a,b){var c={};for(var d in a)c[d]=a[d];for(var e in b)c[e]=b[e];return c}

function draw(ctx, dimensions, template) {
  var dimension_arr = [dimensions.height, dimensions.width].sort();
  var maxFactor = Math.round(dimension_arr[1] / 16),
    minFactor = Math.round(dimension_arr[0] / 16);
  var text_height = Math.max(template.size, maxFactor);
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = template.background;
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);
  ctx.fillStyle = template.foreground;
  ctx.font = "bold " + text_height + "px sans-serif";
  var text = template.text ? template.text : (dimensions.width + "x" + dimensions.height);
  if (Math.round(ctx.measureText(text).width) / dimensions.width > 1) {
    text_height = Math.max(minFactor, template.size);
  }
  ctx.font = "bold " + text_height + "px sans-serif";
  ctx.fillText(text, (dimensions.width / 2), (dimensions.height / 2), dimensions.width);
  return canvas.toDataURL("image/png");
}

if (!canvas.getContext) {
  fallback = true;
} else {
  if (canvas.toDataURL("image/png").indexOf("data:image/png") < 0) {
    //Android doesn't support data URI
    fallback = true;
  } else {
    var ctx = canvas.getContext("2d");
  }
}

var settings = {
  domain: "img.js",
  images: "img",
  themes: {
    "gray": {
      background: "#eee",
      foreground: "#aaa",
      size: 12
    },
    "social": {
      background: "#0C7E9E",
      foreground: "#fff",
      size: 12
    },
    "industrial": {
      background: "#434A52",
      foreground: "#C2F200",
      size: 12
    }
  }
};



app.flags = {
  dimensions: {
    regex: /([0-9]+)x([0-9]+)/,
    output: function(val){
      var exec = this.regex.exec(val);
      return {
        width: +exec[1],
        height: +exec[2]
      }
    }
  },
  colors: {
    regex: /#([0-9a-f]{3,})\:#([0-9a-f]{3,})/i,
    output: function(val){
      var exec = this.regex.exec(val);
      return {
          size: settings.themes.gray.size,
          foreground: "#" + exec[2],
          background: "#" + exec[1]
          }
    }
  },
  text: {
    regex: /text\:(.*)/,
    output: function(val){
      return this.regex.exec(val)[1];
    }
  }
}

for(var flag in app.flags){
  app.flags[flag].match = function (val){
    return val.match(this.regex)
  }
}

app.add_theme = function (name, theme) {
  name != null && theme != null && (settings.themes[name] = theme);
  return app;
};

app.add_image = function (src, el) {
  var node = selector(el);
  if (node.length) {
    for (var i = 0, l = node.length; i < l; i++) {
      var img = document.createElement("img")
      img.setAttribute("data-src", src);
      node[i].appendChild(img);
    }
  }
  return app;
};

app.run = function (o) {
  var options = extend(settings, o),
    images = selector(options.images),
    preempted = true;

  for (var l = images.length, i = 0; i < l; i++) {
    var theme = settings.themes.gray;
    var src = images[i].getAttribute("data-src") || images[i].getAttribute("src");
    if ( src !== null ) {
      if ( !! ~src.indexOf(options.domain)) {
        var render = false,
          dimensions = null,
          text = null;
        var flags = src.substr(src.indexOf(options.domain) + options.domain.length + 1).split("/");
        for (sl = flags.length, j = 0; j < sl; j++) {
          if (app.flags.dimensions.match(flags[j])) {
            render = true;
            dimensions = app.flags.dimensions.output(flags[j]);
          } else if (app.flags.colors.match(flags[j])) {
            theme = app.flags.colors.output(flags[j]);
          } else if (options.themes[flags[j]]) {
            //If a theme is specified, it will override custom colors
            theme = options.themes[flags[j]];
          } else if (app.flags.text.match(flags[j])) {
            text = app.flags.text.output(flags[j]);
          }
        }
        if (render) {
          images[i].setAttribute("data-src", src);
          var dimensions_caption = dimensions.width + "x" + dimensions.height;
          images[i].setAttribute("alt", text ? text : theme.text ? theme.text + " [" + dimensions_caption + "]" : dimensions_caption);

          //Fallback
          images[i].style.width = dimensions.width + "px";
          images[i].style.height = dimensions.height + "px";
          images[i].style.backgroundColor = theme.background;

          var theme = (text ? extend(theme, {
              text: text
            }) : theme);

          if (!fallback) {
            images[i].setAttribute("src", draw(ctx, dimensions, theme));
          }
        }
      }
    }
  }
  return app;
};
contentLoaded(win, function () {
  preempted || app.run()
})

})(Holder, window);


Holder.add_theme("inverse", {background:"#323334", foreground:"#545454", size:11}).run()
Holder.add_theme("grayMed", {background:"#545454", foreground:"#646464", size:11}).run()
Holder.add_theme("grayDark", {background:"#646464", foreground:"#747474", size:11}).run()
Holder.add_theme("grayDarker", {background:"#747474", foreground:"#848484", size:11}).run()
Holder.add_theme("green", {background:"#7BBA55", foreground:"#fff", size:11}).run()

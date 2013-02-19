!function ($) {

  $(document).ready(function() {
    init();
  });



  /* ========================================================================= */
  /*                                                                           */
  /* Initialize Application                                                    */
  /*                                                                           */
  /* ========================================================================= */

  function init() {

    // Define namespace
    $.themestack = {};


    // Define variables
    $.themestack.page = $("#page"); // stage


    // Disable certain links in docs
    $('[href^=#]').click(function (e) {
      e.preventDefault();
    });


    // Establish default window resize event
    $(window).resize(function () {
      window_resize();
    });
    window_resize();


    // Establish default window scroll event
    $(window).scroll(function () {
      window_scroll();
    });
    window_scroll();


    // Initialize Bootstrap Tooltip Plugn
    $('.has-tooltip').each(function() {

      if($(this).hasClass('tooltip-on-focus')) {
        $(this).tooltip({
          'html'    : true,
          'trigger' : 'focus'
        });
      } else {
        $(this).tooltip({
          'html'    : true,
          'trigger' : 'hover'
        });
      }
    });


    // Simulate placeholders for older browsers
    simulate_placeholders()


    // Display Tweet in Footer
    get_lastTweet();


    // Call Page Specific init() functions
    init_pages();


    // Call Forms Specific form handler functions
    init_formhandlers();

  }


  /* ========================================================================= */
  /*                                                                           */
  /* Initialize Current Page                                                   */
  /*                                                                           */
  /* ========================================================================= */

  function init_pages() {

    if($.themestack.page.hasClass("home")) {

      init_home();

    } else if($.themestack.page.hasClass("support-center")) {

      init_features_support_center();

    } else if($.themestack.page.hasClass("pricing")) {

      init_pricing();

    } else if($.themestack.page.hasClass("contact")) {

      init_contact();

    } else if($.themestack.page.hasClass("trust")) {

      init_trust();

    } else if($.themestack.page.hasClass("register")) {

      init_register();

    } else if($.themestack.page.hasClass("support")) {

      init_support();

    }

  }



  /* ========================================================================= */
  /*                                                                           */
  /* Draw Home Page                                                            */
  /*                                                                           */
  /* ========================================================================= */

  function init_home() {

    $("#company_name").focus();

    $('.heros').rotational({
      delay       : 8000
    });

    $('#hero-device-screenshots').addClass("animate");

    $('.press-quotes').rotational({
      delay       : 6000
    });

    $('#cases .screens').rotational({

      delay           : 6000,
      prevButton      : $('#cases-screenshots-prev'),
      nextButton      : $('#cases-screenshots-next'),
      afterSlideChange: function(e) {
        if(e.data('feature')) {
          var feature = e.data('feature');
          $('#cases .features').find('.feature').each(function() {
            if($(this).hasClass(e.data('feature'))) {
              $(this).addClass('active');
            } else {
              $(this).removeClass('active');
            }
          });
        }
      }
    });

    $('.scroll-to-view').click(function() {
      $('html,body').animate({
        scrollTop: $('#scroll-to-here').offset().top
      }, {
        duration: 'slow',
        easing: 'swing'
      });
    });

    $(window).scroll(function () {

      init_home_resize();
    });

    $(window).resize(function () {

      init_home_resize();
    });

    init_home_resize();
  }

  function init_home_resize() {

    if(($(window).height() < 980) && ($(window).width() >= 768)) {

      if($(window).scrollTop() < 300) {

        $('.scroll-to-view').css({

          'opacity' : 1,
          'bottom'  : '0px'
        });

      } else if($(window).scrollTop() > 500) {

        $('.scroll-to-view').css({

          'opacity' : 0,
          'bottom'  : '-200px'
        });

      } else {

        var new_opacity = (500 - $(window).scrollTop()) / (500-300);

        $('.scroll-to-view').css({

          'opacity' : new_opacity,
          'bottom'  : '0px'
        });
      }
    } else {

      $('.scroll-to-view').css({

        'opacity' : 0,
        'bottom'  : '-200px'
      });
    }
  }



  /* ========================================================================= */
  /*                                                                           */
  /* Support Center Page                                                       */
  /*                                                                           */
  /* ========================================================================= */

  function init_features_support_center() {

    $('.branding-examples').rotational({

      delay       : 3000
    });
  }

  /* ========================================================================= */
  /*                                                                           */
  /* Pricing Page                                                              */
  /*                                                                           */
  /* ========================================================================= */

  function init_pricing() {

  }

  /* ========================================================================= */
  /*                                                                           */
  /* Contact Page                                                              */
  /*                                                                           */
  /* ========================================================================= */

  function init_contact() {

    var map_options = {

      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      zoomControl: true
    }


    /* Draw Cincinnati Map */
    var sanfrancisco_pos = new google.maps.LatLng(37.794539, -122.394717);

    map_options.center = sanfrancisco_pos;

    var sanfrancisco_map = new google.maps.Map(document.getElementById("map-office-california"), map_options);

    var sanfrancisco_map_marker = new google.maps.Marker({

      position: sanfrancisco_pos,
      map: sanfrancisco_map,
      title: "Themestack.io Cincinnati Office"

    });

    var sanfrancisco_map_window_content =
      "<div id='content'>"+
        "<h4 class='short'>Themestack.io</h4>" +
        "<h5 class=''>Cincinnati Office</h5>" +
        "<p class='nomargin-bottom'>" +
          "1208 Lancashire Dr.</br>" +
          "Union, KY 41091" +
        "</p>" +
      "</div>";

    var sanfrancisco_map_window = new google.maps.InfoWindow({

      content: sanfrancisco_map_window_content
    });

    google.maps.event.addListener(sanfrancisco_map_marker, 'click', function() {

      sanfrancisco_map_window.open(sanfrancisco_map, sanfrancisco_map_marker);
    });


    /* Draw New York Map */

    var newyork_pos = new google.maps.LatLng(40.784701,-73.414764);

    map_options.center = newyork_pos;

    var newyork_map = new google.maps.Map(document.getElementById("map-office-newyork"), map_options);

    var newyork_map_marker = new google.maps.Marker({

      position: newyork_pos,
      map: newyork_map,
      title: "Themestack.io New York Office"

    });

    var newyork_map_window_content =
      "<div id='content'>"+
        "<h4 class='short'>Themestack.io</h4>" +
        "<h5 class=''>New York Office</h5>" +
        "<p class='nomargin-bottom'>" +
          "225 Broadhollow Rd</br>" +
          "Suite 102E</br>" +
          "Melville, NY 11747" +
        "</p>" +
      "</div>";

    var newyork_map_window = new google.maps.InfoWindow({

      content: newyork_map_window_content

    });

    google.maps.event.addListener(newyork_map_marker, 'click', function() {

      newyork_map_window.open(newyork_map, newyork_map_marker);

    });

    /* Draw Cincinnati Map */

    var shipping_pos = new google.maps.LatLng(37.794539, -122.394717);

    map_options.center = shipping_pos;

    var shipping_map = new google.maps.Map(document.getElementById("map-shipping"), map_options);

    var shipping_map_marker = new google.maps.Marker({

      position: shipping_pos,
      map: shipping_map,
      title: "Themestack.io Shipping"

    });

    var shipping_map_window_content =
      "<div id='content'>"+
        "<h4 class='short'>Themestack.io</h4>" +
        "<h5 class=''>Shipping Address</h5>" +
        "<p class='nomargin-bottom'>" +
          "1 Market Street</br>" +
          "Suite 300</br>" +
          "Cincinnati, CA 94105" +
        "</p>" +
      "</div>";

    var shipping_map_window = new google.maps.InfoWindow({

      content: shipping_map_window_content

    });

    google.maps.event.addListener(shipping_map_marker, 'click', function() {

      shipping_map_window.open(shipping_map, shipping_map_marker);

    });

  }

  /* ========================================================================= */
  /*                                                                           */
  /* Trust Page                                                                */
  /*                                                                           */
  /* ========================================================================= */

  function init_trust() {

    draw_twitter_widget("Themestack_Ops", "{{twitter_username}}");

    $(window).resize(function() {

      draw_twitter_widget("Themestack_Ops", "{{twitter_username}}");

    });

  }

  /* ========================================================================= */
  /*                                                                           */
  /* Support Page                                                              */
  /*                                                                           */
  /* ========================================================================= */

  function init_support() {

    draw_twitter_widget("Themestack", "{{twitter_username}}");

    $(window).resize(function() {

      draw_twitter_widget("Themestack", "{{twitter_username}}");

    });

  }

  /* ========================================================================= */
  /*                                                                           */
  /* Draw Register Page                                                        */
  /*                                                                           */
  /* ========================================================================= */

  function init_register() {

    $("#user_name").focus();

  }

  /* ========================================================================= */
  /*                                                                           */
  /* Initialize all visible forms                                              */
  /*                                                                           */
  /* ========================================================================= */

  function init_formhandlers() {

    if($('#form_register').length) {

        form_register_init();

    }

  }

  /* ========================================================================= */
  /*                                                                           */
  /* Form: Register                                                            */
  /*                                                                           */
  /* ========================================================================= */

  function form_register_init() {

    var form = $('#form_register');
    var server = $('#form_register').attr('action').split('.')[1];
    form.attr('data-server', server);


    // Handle form submit event

    form.submit(function(e) {

      form_register_submit(e);

    });

    // Associate click event for 'submit' button with form submit function

    $('#form_register_submit').click(function() {

      form.submit();
      return false;

    });

    // Submit form on "enter" (needed because we're using <button/> instead of <input type="submit"/>

      form.find('input').keypress(function(e) {

      if(e.which == 13) {

        form.submit();

      }

      });

    // Check if form has current step index

    if((form.attr('current-step') != 'undefined') && (form.attr('current-step') != false)) {

      form.attr('current-step', 1);

    }

    // Update URL with Company Name

    form.find('#company_name').bind('keyup blur', function() {

      var urlValue = $(this).val().toLowerCase().replace(/[^\w+-]+/g, '');

      form.find('#user_site_attributes_subdomain').val(urlValue);

      if (urlValue.length == 0) {

        form.find('#user_site_attributes_subdomain').val('');

      } else {

        form.find('#user_site_attributes_subdomain').val(urlValue);

      }

    }).blur();

    // Password confirm sync

    form.find('#user-password').bind('keyup blur', function(){

      form.find('#user-password-confirm').val($(this).val());

    }).blur();

    // Staff size reveal personalized demo

    form.find('#extras_staffsize').change(function() {

      if($(this).val().length > 1) {

        form.find('#freedemo').removeClass('hide');
        form.find('#extras_currenttool').parent().parent().removeClass('nomargin-bottom');

      } else {

        $('#freedemo').addClass('hide');
        form.find('#extras_currenttool').parent().parent().addClass('nomargin-bottom');

      }

    });

    // Serialize extra form inputs

    form.find('.extras').bind('change keyup', function() {

      var serializedVals = [];

      $('.extras').each(function() {

        var inputVal = '';

        if($(this).is(':checkbox')) {

          inputVal = ($(this).is(':checked'))? $(this).val() :'not-' + $(this).val();

        } else {

          inputVal = $(this).val();

        }

        serializedVals.push(inputVal);

      });

      var concatVals = serializedVals.join('|');

      form.find('#source_9').val(concatVals);

    });

    // Define Source fields

    var referer = (readCookie('Referer') == null) ? '' : readCookie('Referer').replace(/http(s*)%3A%2F%2F/, '');
    //form.find('#source_1').val('new-Themestack-reg');
    form.find('#source_2').val(multitouch_value());
    form.find('#source_3').val($.themestackGACookie('keywords').substr(0,254));
    form.find('#source_4').val(encodeURIComponent(document.location.toString().split('#')[0].substr(0,254)));
    form.find('#source_5').val(referer.substr(0,254));
    form.find('#source_6').val((readCookie('PID') != null) ? readCookie('PID').substr(0,254) : '');
    form.find('#source_7').val((readCookie('SalesForceLead') != null) ? readCookie('SalesForceLead').substr(0,254) : '');
    form.find('#source_8').val((readCookie('coupon') != null) ? readCookie('coupon').substr(0,254) : '');
    form.find('#source_9').val('');
    form.find('#source_10').val('');

  }

  function form_register_submit(e) {

    // prevent form submit if we have errors

    e.preventDefault();

    var form = $('#form_register');
    var form_register_step1 = form.find('#form_register_step1');
    var form_register_step2 = form.find('#form_register_step2');
    var form_register_submit = $('#form_register_submit');
    var server = form.attr('data-server');

    // Check current step

    if(form.attr('current-step') == 1) {

      // Disabled form for current step

      form_register_step1.addClass('disabled');
      form_register_submit.addClass('disabled');
      form_register_submit.attr("disabled", "disabled");

      // Validate current step of form

      if(form_register_step1_validate()) {

        // Increment form to next step
        form_register_sitename_validate();
        /**form.attr('current-step', 2);

        form_register_step1.addClass('hide');
        form_register_step2.removeClass('hide');

        formFocusOnFirstEmptyField(form_register_step2);**/

      } else {

        formFocusOnFirstEmptyField(form_register_step1);

      }

      // Remove form disabled state

      form_register_step1.removeClass('disabled');
      form_register_submit.removeClass('disabled');
      form_register_submit.removeAttr("disabled");

    } else if(form.attr('current-step') == 2) {

      // Disabled form for current step

      form_register_step2.addClass('disabled');
      form_register_submit.addClass('disabled');
      form_register_submit.attr("disabled", "disabled");

      // Validate current step of form

      if(form_register_step2_validate() == true) {

        // Update form action URL to point to newly created site

        form.attr('action', 'https://' + form.find('#user_site_attributes_subdomain').val() + '.' + server + '.com/site');

        // Fetch a fresh auth token

        $.getJSON('https://reg.' + server + '.com/users/new.json?callback=?', function(data) {

          // Update authenticity_token

          var authenticity_token = data.html.split('value="')[2].toString().split('"')[0];
          form.find('input[name=authenticity_token]').val(authenticity_token);

          // Submit form

          form.unbind('submit')
          form.submit();

        });

      }

      // Remove form disabled state

      form_register_step2.removeClass('disabled');
      form_register_submit.removeClass('disabled');
      form_register_submit.removeAttr("disabled");

      formFocusOnFirstEmptyField(form_register_step2);

    }

    // Prevent default form submit

    return false;

  }

  function form_register_sitename_validate() {

    var validated = true;

    var form = $('#form_register');
    var form_register_step1 = form.find('#form_register_step1');
    var form_register_step2 = form.find('#form_register_step2');
    var form_register_submit = $('#form_register_submit');
    var server = form.attr('data-server');

    // Validate URL

    var user_site_attributes_subdomain_field = $('#user_site_attributes_subdomain');

    if(user_site_attributes_subdomain_field.val().length < 4) {

      user_site_attributes_subdomain_field.parent().parent().addClass('error');
      showTooltipErrorMessage(user_site_attributes_subdomain_field);
      validated = false;

      return validated;

    } else {

      $.ajax({

        url     : 'https://reg.' + server + '.com/users/check_sitename.json?sitename=' + user_site_attributes_subdomain_field.val(),
        //async   : false,
        cache   : false,
        timeout : 8000,
        dataType  : 'jsonp',
        error     : function() {

          user_site_attributes_subdomain_field.parent().parent().addClass('error');
          showTooltipErrorMessage(user_site_attributes_subdomain_field);
          validated = false;

          return validated;
        },
        success   : function(data, textStatus, jqXHR) {

          if(data.response !== 'success') {

            user_site_attributes_subdomain_field.parent().parent().addClass('error');
            showTooltipErrorMessage(user_site_attributes_subdomain_field);
            validated = false;

          } else {

             hideTooltipErrorMessage(user_site_attributes_subdomain_field);

             // progress to next step
            form.attr('current-step', 2);

            form_register_step1.addClass('hide');
            form_register_step2.removeClass('hide');

            formFocusOnFirstEmptyField(form_register_step2);
          }
        }
      });
      return validated;
    }
  }

  function form_register_step1_validate() {

    // Remove errors on all form elements
    var validated = true;

    $("#form_register_step1 .control-group").removeClass("error");

    // Validate Name
    var user_name_field = $("#user-name");

    if(user_name_field.val().length < 2) {

      user_name_field.parent().addClass('error');
      showTooltipErrorMessage(user_name_field);
      validated = false;

    } else {
      hideTooltipErrorMessage(user_name_field);
    }

    // Validate Email
    var user_email_field = $('#user-email');

    if(!isValidEmailAddress(user_email_field.val())) {

      user_email_field.parent().addClass('error');
      showTooltipErrorMessage(user_email_field);
      validated = false;

    } else {
      hideTooltipErrorMessage(user_email_field);
    }

    // Validate Password
    var user_password_field = $('#user-password');

    if(user_password_field.val().length < 8) {

      user_password_field.parent().addClass('error');
      showTooltipErrorMessage(user_password_field);
      validated = false;

    } else {
      hideTooltipErrorMessage(user_password_field);
    }

    return validated;
  }

  function form_register_step2_validate() {

    // Remove errors on all form elements
    var validated = true;

    $("#form_register_step2 .control-group").removeClass("error");

    return validated;
  }

  /* ========================================================================= */
  /*                                                                           */
  /* Focus on first empty field in form                                        */
  /*                                                                           */
  /* ========================================================================= */

  function formFocusOnFirstEmptyField(form) {

    form.find('*:input[type!=hidden]').each(function() {

      if( (!$(this).val() || $(this).hasClass('error') || $(this).parent().hasClass('error')) && $(this).attr('data-error-title').length > 0 ) {

        $(this).focus();
        return false;

      }

    })

  }

  /* ========================================================================= */
  /*                                                                           */
  /* Toggle form tooltip error messages                                        */
  /*                                                                           */
  /* ========================================================================= */

  function showTooltipErrorMessage(element) {

    element.data('tooltip').options.originalTitle = element.data('tooltip').options.title;
    element.data('tooltip').options.title = element.data('tooltip').options.errorTitle;
    element.tooltip('fixTitle');

  }

  function hideTooltipErrorMessage(element) {

    if(element.data('tooltip').options.originalTitle) {

      element.data('tooltip').options.title = element.data('tooltip').options.originalTitle;
    } else {

      element.data('tooltip').options.title = null;
    }

    element.tooltip('fixTitle').tooltip('hide');
  }

  /* ========================================================================= */
  /*                                                                           */
  /* Check if email is valid                                                   */
  /*                                                                           */
  /* ========================================================================= */

  function isValidEmailAddress(emailAddress) {

    // Validates email address
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);

  }

  /* ========================================================================= */
  /*                                                                           */
  /* Draw Twitter Widget                                                       */
  /*                                                                           */
  /* ========================================================================= */

  function draw_twitter_widget(twitter_username, twitter_widget_id) {

    var window_width = $(window).width();
    var draw = false;

    if(!$.Themestack.twitter_widget_width) {

      $.Themestack.twitter_widget_width;

    }

    if(window_width >= 1200) {

      if($.Themestack.twitter_widget_width != 1200) {

        $.Themestack.twitter_widget_width = 1200;
        draw = true;

      }

    } else if(window_width >= 980) {

      if($.Themestack.twitter_widget_width != 980) {

        $.Themestack.twitter_widget_width = 980;
        draw = true;

      }

    } else if(window_width >= 768) {

      if($.Themestack.twitter_widget_width != 768) {

        $.Themestack.twitter_widget_width = 768;
        draw = true;

      }

    }

    if(draw == true) {

      $("#twitter_widget").empty();
      $("#twitter_widget").html(
        "<a class='twitter-timeline' height='700' href='https://twitter.com/" + twitter_username + "' data-widget-id='" + twitter_widget_id + "'>" +
          "Tweets by @" + twitter_username +
        "</a>"
      );

      draw_twitter_widget_helper(document, "script", "twitter-wjs");

      draw = false;

    }

  }


  function draw_twitter_widget_helper(d, s, id) {

    var js, fjs = d.getElementsByTagName(s)[0];

    if(!d.getElementById(id)){

      js=d.createElement(s);
      js.id=id;
      js.src="//platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js,fjs);

    }

  }

  /* ========================================================================= */
  /*                                                                           */
  /* Get Last Tweet from specified username and place in footer                */
  /*                                                                           */
  /* ========================================================================= */

  function get_lastTweet() {

    var user = 'Themestack';

    $("#footer").find(".tweet").html("Loading......");

    $.ajax({

      type: "GET",
      dataType: "json",
      url: "https://search.twitter.com/search.json?q=from:" + user + "&rpp=1&callback=?",

      success: function(data) {

        $("#footer").find(".tweet").html(data.results[0].text);

      }

    });

  }

  /* ========================================================================= */
  /*                                                                           */
  /* Resolve placeholder text in older browsers                                */
  /*                                                                           */
  /* ========================================================================= */

  function simulate_placeholders() {

    var input = document.createElement("input");

    if(('placeholder' in input) == false) {

      $('[placeholder]').not(':password').focus(function() {

        var i = $(this);

        if(i.val() == i.attr('placeholder')) {

          i.val('').removeClass('placeholder');

          if(i.hasClass('password')) {

            i.removeClass('password');
            this.attr('type','password');

          }

        }

      }).blur(function() {

        var i = $(this);

        if(i.val() == '' || i.val() == i.attr('placeholder')) {

          if(this.attr('type')=='password') {

            i.addClass('password');
            this.attr('type','text');

          }

          i.addClass('placeholder').val(i.attr('placeholder'));

        }

      }).blur().parents('form').submit(function() {

        $(this).find('[placeholder]').each(function() {

          var i = $(this);

          if(i.val() == i.attr('placeholder')) {

            i.val('');

          }
        })
      });
    }
  }

  /* ========================================================================= */
  /*                                                                           */
  /* Resize Modals                                                             */
  /*                                                                           */
  /* ========================================================================= */

  function modal_resize() {

    $('.modal').each(function(index, value) {

      // Add display:block for resizing calculations

      if($(this).hasClass('fade') && !$(this).hasClass('in')) {

        $(this).css({

          display:    'block'

        });
      }

      var modal_header            = $(this).find('.modal-header');
      var modal_footer            = $(this).find('.modal-footer');
      var modal_body              = $(this).find('.modal-body');
      var modal_body_inner        = $(this).find('.modal-body-inner');

      var window_height           = $(window).height();
      var modal_header_height     = modal_header.outerHeight();
      var modal_footer_height     = modal_footer.outerHeight();
      var modal_body_height       = modal_body.height();
      var modal_body_padding      = modal_body.outerHeight() - modal_body_height;
      var modal_body_inner_height = modal_body_inner.outerHeight();
      var modal_total_height      = modal_header_height + modal_body_padding + modal_body_inner_height + modal_footer_height;
      var modal_margins           = 15;

      if ((modal_total_height + (2 * modal_margins)) > window_height) {

        modal_body.css({

          'height'  : window_height - modal_header_height - modal_body_padding - modal_footer_height - (2 * modal_margins)
        });
      } else {

        modal_body.css({

          'height'  : modal_body_inner_height
        });
      }

      $(this).css({

        'margin-top'  : -1 * ($(this).outerHeight() / 2)
      });

      // Remove display:block for resizing calculations to avoid element covering screen

      if($(this).hasClass('fade') && !$(this).hasClass('in')) {

        $(this).css({

          display:    'none'

        });
      }
    });
  }

  /* ========================================================================= */
  /*                                                                           */
  /* Window Resize                                                             */
  /*                                                                           */
  /* ========================================================================= */

  function window_resize() {

    if($(window).width() >= 768) {

      $('#nav-links').show();
      $('#nav-btns').find('.btn').removeClass('btn-small');

      $('#nav-links').find('.dropdown-toggle').unbind().each(function() {

        $(this).click(function (e) {

          return true;

        });

      });

    } else {

      $('#nav-links').hide();
      $('#nav-btns').find('.btn').addClass('btn-small');

      $('#nav-links').find('.dropdown-toggle').each(function() {

        $(this).click(function (e) {

          e.preventDefault();

        });

      });

    }

    modal_resize();

  }

  /* ========================================================================= */
  /*                                                                           */
  /* Window Scroll                                                             */
  /*                                                                           */
  /* ========================================================================= */

  function window_scroll() {

  }

  /* ========================================================================= */
  /*                                                                           */
  /* Get Browser Dimensions                                                    */
  /*                                                                           */
  /* ========================================================================= */

  function get_browserDimensions() {

    var dimensions = {

      width: 0,
      height: 0

    };

    if ($(window)) {

      dimensions.width = $(window).width();
      dimensions.height = $(window).height();

    }

    return dimensions;

  }


}(window.jQuery)
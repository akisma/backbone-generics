// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
          c = c.substring(1,c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length,c.length);
      }
  }
  return null;
}

function createCookie(name, value, days) {
  var expires;
  if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      expires = "; expires="+date.toGMTString();
  }
  else {
      expires = "";
  }
  document.cookie = name+"="+value+expires+"; path=/";
}

require.config({
  baseUrl: '/src/js/',
  // Initialize the application with the main application file.
  deps: ['main'],

  paths: {

    // Libraries.
    jquery:               'vendor/jquery-2.1.4',
    underscore:           'vendor/underscore-1.8.3',
    backbone:             'vendor/backbone-1.2.3',
    highcharts:           'vendor/highcharts-4.1.9',
    chartist:             'vendor/chartist-0.9.5',
    messenger:            'vendor/messenger',
    bootstrap:            'vendor/theme/bootstrap',
    bootstrapDatepicker:  'vendor/theme/bootstrap-datepicker',
    //My components
    errors:       'components/errors'
  },

  shim: {
    backbone: {
      exports: 'Backbone',
      deps: ['underscore', 'jquery']
    },

    highcharts: {
      exports: 'Highcharts',
      deps: ['jquery']
    },

    messenger: {
      exports: 'Messenger',
      deps: ['jquery', 'underscore', 'backbone']
    },

    bootstrap: {
      exports: 'bootstrap',
      deps: ['jquery']
    },

    bootstrapDatepicker: {
      exports: 'bootstrap',
      deps: ['bootstrap', 'jquery']
    }
  }
});

require([
  // Application.
  'app',

  // Main Router.
  'router',
  'underscore',
  'jquery'
],

function(app, Router, _, $) {

  //let's use different syntax since underscore is the same as ejs (which is the server side template)
  _.templateSettings = {
    evaluate: /{{(.+?)}}/g,
    interpolate: /{{=(.+?)}}/g,
    escape: /{{-(.+?)}}/g
  };

  // Define your master router on the application namespace and trigger all
  // navigation from this instance.
  app.router = new Router();

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router. If the link has a `data-bypass`
  // attribute, bypass the delegation completely.
  $(document).on('click', 'a:not([data-bypass])', function(evt) {
    // Get the absolute anchor href.
    var href = $(this).attr('href');

    // If the href exists and is a hash route, run it through Backbone.
    if (href && href.indexOf('#') === -1) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // `Backbone.history.navigate` is sufficient for all Routers and will
      // trigger the correct events. The Router's internal `navigate` method
      // calls this anyways.  The fragment is sliced from the root.
      Backbone.history.navigate(href, true);
    }
  });

  if (!Backbone.History.started){
    Backbone.history.start({ root: app.root });
  }
});


define([
  'app',
  'backbone'
],
function(app, bb) {

  var Router = Backbone.Router.extend({
    routes: {
      '':                       'client',

      //system ops
      'entry':                  'entry',
      'logout':                 'logout',

      //DEV ONLY
      'test':                    'test'
    },

    //helper functions
    loadModule: function(module){
      if (app.user.get('authenticated')){
        app.loadModule(module);
      } else {
        require(['pages/entry'], app.loadModule);
      }
    },

    //              //
    //    ROUTES    //
    //              //

    //
    //    SYSTEM OPS
    //

    index: function() {

      //add logic, 'if logged in'

      // require(['pages/entry'], this.loadModule);
    },

    entry: function() {
      require(['pages/entry'], this.loadModule);
    },

    logout: function(){
      function eraseCookie(name) {
          createCookie(name,"",-1);
      }

      eraseCookie('_bp');

      this.navigate('entry', { trigger: true });
    },

    //
    //    USER OPS
    //

    //settings should include user info (account user, not client)
    settings: function(){
      this.cookie();
      //in settings, request settings ONLY for cookied user
      require(['pages/settings'], this.loadModule);
    },

    pwReset: function(){

    },

    //
    //    PAGES OPS
    //

    // your routes here

    //
    //  DEV ONLY
    //

    test: function() {
      require(['pages/test'], this.loadModule);
    }
  });

  return Router;
});

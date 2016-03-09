/* user model */
define([
  'backbone',
  'jquery'
	], function(backbone, $){
    var model,
        modelClass;

    modelClass = backbone.Model.extend({
      defaults: {
        authenticated: false,
      },

      checkLoginStatus: function(app){
        var model = this;

        $.ajaxSetup({
          headers: {'x-access-token': readCookie('_bp') }
        });

        $.ajax({
          method: 'GET',
          url: 'client/info'
        }).then(function(resp){
          if (resp.success == false){
            model.set({ authenticated: false });
            app.router.navigate('entry', { trigger: true });
          } else {
            model.set({ authenticated: true });
            app.router.navigate('client', { trigger: true });
            $('body').removeClass('entry-state'); // DEFINITELY BETTER PLACES TO DO THIS
          }
        });
      }
    });

    model = new modelClass();

    return model;
	}
);
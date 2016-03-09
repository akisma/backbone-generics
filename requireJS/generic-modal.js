//#Generic Modal
//widget to deal with the global shared modal
//{ headline: 'headline for modal', message: 'message for modal body', button: 'button text'}

define(
  [
    'backbone',
    'generics/generic-view'
  ],
  function(bb, gV){
    return bb.View.extend({
      initialize: function(){
        var view = this;

        gV.prototype.precompileTemplates.call(this);

        $('.js-global-modal').on('hidden', this.destroy);
        $('.js-global-modal').find('.js-close').on('click', function(e){
          e.preventDefault();
          view.destroy();
        });
      },

      events: {
        'click .js-close ': 'destroy'
      },

      templates: {
        main: '#template-global-modal'
      },

      render: function(data){
        $('body').append(this.templates.main(data));
        this.setElement($('.js-global-modal'));
        $('.js-global-modal').modal();

        //logging event can go here, but execute calls from a model
      },

      //no op
      beforeClose: function(){

      },

      destroy: function(){
        this.$el.modal('hide');
        gV.prototype.close.call(this);
      }
    });
  }
);
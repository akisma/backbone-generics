//#Generic View
//a generic view object that all other views can inherit from to receive useful functions such as:
//- precompileTemplates
//- save, cancel, message close, and breadcrumb events already bound
//- close
//- getData
//
//see individual functions for more specific documentation.

//arguments/extensions necessary:
//- templates (required): must be an object, must have at least one template, must be at the key 'main'. must be made of selectors findable by $().
//- customInit: a secondary init can be passed that will be executed after the generic init.
//- customEvents: a secondary events hash can be passed that will be combined with the generic events hash.
//- messageClose: override
//- loadPrevious: override
//- save: override
//- cancel: override

//pass in templates hash at instance level to override default templates. must be complete, though, can't be piecemeal - yet
//TODO customGetData
//TODO make extended inits go into an array instead of providing only one... limitless amounts of inits.
//TODO make extended events go into an array, also
define([ 
    'jquery', 
    'underscore',
    'backbone'
  ],
  
  function($, _, bb){
    return bb.View.extend({

      initialize: function(){
        var events = {};

        if ('options' in this && 'templates' in this.options){ //THIS LINE IS A PATCH FOR THE BACKBONE UPGRADE WHICH NO LONGER AUTO-COPIES OPTIONS OBJECT
          if ('templates' in this){
            _.extend(this.templates, this.options.templates);
          } else {
            this.templates = this.options.templates || {};
          }     
        }
        

        if ('templates' in this){
          this.precompileTemplates();
        }
      },

      events: {
        'click .js-save':           'save',
        'click .js-cancel':         'cancel',
        'click .js-message-close':  'messageClose',
        'click .js-breadcrumb':     'loadPrevious',
        'click .js-submit':         'submit',
        'keypress form':            'keycatch'
      },

      keycatch: function(){
        
      },

      //OVERRIDE for functionality upon click of submit button
      submit: function(){

      },

      //OVERRIDE for functionality upon click of a close button
      messageClose: function(){

      },

      //OVERRIDE this for functionality upon click of a breadcrumb
      loadPrevious: function(){

      },

      //##renderOps
      //operations performed by all renders. does not replace render; must be passed a new rendered element.
      renderOps: function(newEl){
        var events = {};

        this.setElement(newEl); 

        if ('customRender' in this){
          this.customRender();
        }

        if ('customEvents' in this){
          _.extend(events, this.events);
          _.extend(events, this.customEvents);
          this.delegateEvents(events);
          this.events = events;
        }
      },

      //##precompileTemplates
      //precompile underscore templates for faster rendering.
      precompileTemplates: function(){
        for (var templateName in this.templates){
          //check to see if they have already been compiled, i dont understand why this is an issue
          if (typeof this.templates[templateName] != 'function'){
            if ($(this.templates[templateName]).length > 0){
              this.templates[templateName] = _.template($(this.templates[templateName]).html());
            } else {
              console.log('WARNING: Template \'' + templateName + '\' with selector \'' + this.templates[templateName] + '\' not found!');
            }
          }
        }
      },

      close: function(){
        this.beforeClose();
        this.remove();
        this.unbind();
        this.trigger('close');
      },

      //this must be defined, override for functionality
      beforeClose: function(){

      },

      //OVERRIDE for custom functionality upon click of cancel
      save: function(){

      },

      //OVERRIDE for functionality upon click of cancel
      cancel: function(){

      },

      //##getData
      //a universal form combing function that harvests data from inputs, selects, and textareas within either the contextual view element
      //via a passed in scope parameter (jquery object) to narrow the field.
      getData: function(scope){
        var formData = {},
            $fields = (arguments.length > 0) ? scope.find('input, select, textarea') : this.$('input, select, textarea');
            
        $.each($fields,function(idx,itm){
          formData[$(itm).attr('name')] = $(itm).val();

          //catch numbers and parseInt
          if ($(itm).attr('type') == 'number'){
            formData[$(itm).attr('name')] = parseInt(formData[$(itm).attr('name')]);
          }

          if ($(itm).is('textarea')){
            formData[$(itm).attr('name')] = $(itm).val();
          }
          if ($(itm).is('input[type="checkbox"]')){
            formData[$(itm).attr('name')] = $(itm)[0].checked;
          }

          //catch nulls
          if (formData[$(itm).attr('name')] == null) { formData[$(itm).attr('name')] = ""; }
        });
        
        return formData;
      }
    });
  }
);


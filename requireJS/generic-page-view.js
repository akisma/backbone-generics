//##Generic Page View
//Generic View further enhanced for common needs among views
//must define:
//  eventHub - needs an event emitter to work with
//  templates: (normal templates object)
//  customEvents: if any
//  customRender: if any
define(
  [
    'generics/generic-view',
    'jquery',
    'underscore',
    'app',
    'errors'
  ],
  function(gV, $, _, app, errors){
    return gV.extend({
      initialize: function(){
        gV.prototype.initialize.call(this);
      },

      //##loadPrevious
      //load the module for the base menu category the current module is part of
      loadPrevious: function(){
        this.eventHub.trigger('load:module', app.activeModule.view.options.cameFrom);
        return false;
      },

      //##errorHandler
      ////massage data, API and validators return different objects
      //todo: abstract
      errorHandler: function(model, data){
        var toParse = ('errors' in data) ? data : data.error;
        errors.issueError(toParse);
      },

      //##render
      //renders itself in the editor way, calls custom render if needed to complete module-specific ops
      render: function(){
        var data = (this.model) ? this.model.toJSON() : this.data,
            newEl;

        if (typeof data == 'undefined') { data = {}; }

        newEl = app.replaceContent(this.templates.main(data));

        this.renderOps(newEl); //todo prototype

        return this; //chaining
      }
    });
  }
);
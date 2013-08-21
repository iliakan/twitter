define(["backbone", "./user"], function(Backbone, User) {

  return Backbone.Model.extend({
    url: "session",

    initialize: function() {
      var userData = this.get('user');
      if (userData) {
        this.set('user', new User(userData, {parse: true}));
      }
    },

    isAuthorized: function(){
      return !!this.get("user");
    }

  });

});
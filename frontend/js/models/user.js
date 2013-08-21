define(["backbone"], function(Backbone) {

  return Backbone.Model.extend({
    url: "user",

    parse: function(modelData) {
      modelData.created = new Date(modelData.created);
      return modelData;
    },

    follow: function(userId) {
      this.get('follows').push(userId);
      socket.emit("user:follow", userId);
    },

    unfollow: function(userId) {
      this.get('follows').splice( this.get('follows').indexOf(userId), 1 );
      socket.emit("user:unfollow", userId);
    },

    fetchByUsername: function(username) {

    }
  });

});
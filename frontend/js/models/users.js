define(["./user", "backbone"], function(User, Backbone) {

  return Backbone.Collection.extend({
    url: 'user',
    model: User,

    initialize: function() {
      _.bindAll(this);
    },

    onCreate: function(model) {
      // parse server-side seriaized data to Date
      var user = new User(model, {parse: true});
      this.add(user);
    },

    comparator: function(user) {
      return -user.get('messagesCount');
    }
  });

});
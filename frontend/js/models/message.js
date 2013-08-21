define(["backbone", "./user"], function(Backbone, User) {

  return Backbone.Model.extend({
    url: "message",

    parse: function(data) {
      if (typeof data.created == 'string') {
        data.created = new Date(data.created);
      }
      data.user = new User(data.user, {parse: true});
      return data;
    },

    validate: function(attrs, options) {

      if (!attrs.content) {
        return 'Отсутствует текст';
      }

    }
  });


});
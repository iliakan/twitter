
define(["tpl!template/usersList.html", "tpl!template/usersListUser.html",
  "tpl!template/usersListEmpty.html",
  "models/users", "marionette", "iosync"],
  function(template, templateItem, templateEmpty, Users) {

  return Marionette.CompositeView.extend({
    tagName: "li",
    template: template,
    className: "well users-list",

    itemView: Marionette.ItemView.extend({
      tagName: "li",
      template: templateItem
    }),

    emptyView: Marionette.ItemView.extend({
      template: templateEmpty
    }),

    appendHtml: function(collectionView, itemView, index){
      collectionView.$('ul').append(itemView.$el);
    },

    initialize: function() {
      var users = new Users;
      this.collection = users;
      users.fetch({
        data: {
          top: true
        },
        success: function(collection, response, options) {
        }
      });

      _.bindAll(this);
    }


  });

});
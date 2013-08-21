define(["tpl!template/ownerMenuLocal.html", "socket", "marionette"], function(template, socket) {

  return Marionette.ItemView.extend({
    tagName: "li",
    template: template,
    className: "well owner-menu-local",

    events: {
      "click .follow": "onFollowClick",
      "click .unfollow": "onUnfollowClick"
    },

    onFollowClick: function() {
      socket.session.get('user').follow(this.model.id);
      this.render();
    },

    onUnfollowClick: function() {
      socket.session.get('user').unfollow(this.model.id);
      this.render();
    },

    templateHelpers: function() {
      var templateData = {
        isAuthorized: socket.session.isAuthorized()
      };

      var user = socket.session.get('user');
      templateData.isOwnerUser = user && (user.id == this.model.id);
      templateData.isFollowing = user && (user.get('follows').indexOf(this.model.id) != -1);

      return templateData;
    }

  });

});
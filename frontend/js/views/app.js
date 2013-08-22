define([
  "tpl!template/app.html", "views/userInfo", "models/users", "views/usersList",
  "socket", "models/messages", "views/messages", "router", "models/user",
  "views/login", "views/socketStatus", "views/ownerMenuLocal", "views/messageCreate",
  "marionette", "backbone.babysitter"],
  function(template, UserInfoView, Users, UsersListView, socket, Messages, MessagesView, Router, User, LoginView, SocketStatusView, OwnerMenuLocalView, MessageCreateView) {

    return Marionette.Layout.extend({

      template: template,

      regions: {
        regionMessages: ".region-messages",
        regionUser: ".region-user",
        socketStatus: ".socket-status"
      },

      events: {
        "click .owner-menu-local a[data-navigate]": "onOwnerMenuLocalNavigate"
      },

      initialize: function() {
        _.bindAll(this);
      },

      // коллекция
      containerLeftViews: new Backbone.ChildViewContainer(),

      render: function() {
        Marionette.Layout.prototype.render.apply(this, arguments);
        this.containerLeft = this.$('.container-left');
      },

      routeIndex: function() {
        var self = this;
        var view;

        this.renderLayout();

        view = new UsersListView();
        this.containerLeftViews.add(view);

        this.containerLeftViews.forEach(function(view) {
          view.render();
          self.containerLeft.append(view.$el);
        });

        var fetchMode = Messages.FETCH_BY_USERNAME_AND_FOLLOWING;
        var messages = new Messages();

        this.regionMessages.show(new MessagesView({
          collection: messages,
          subscribe: {
            username: socket.session.get('user').get('username'),
            mode: fetchMode
          }
        }));

        return this;
      },

      onOwnerMenuLocalNavigate: function(e) {
        var navigate = $(e.currentTarget).attr('data-navigate');

        navigate = navigate.split('/');
        if (navigate[0] == 'username') {
          this._routeOwnerMessages(navigate[1]);
          this.router.navigateToHref(e.currentTarget, {trigger: false});
          return false;
        }
      },

      // get data for auto-rendering with template /for ItemView/
      serializeData: function() {
        var user = socket.session.get('user');
        return {
          user: user && user.attributes
        };
      },

      routeOwner: function(ownerName, subMenu) {
        var self = this;

        this.renderLayout();

        this.owner = new User();
        this.owner.fetch({
          data: {
            username: ownerName
          },
          success: function(model, response) {
            self._routeOwnerSubmenu(subMenu);
          },
          error: function(model, response) {
            if (response == 404) {
              alert("Нет такого пользователя");
              App.Router.navigate("/", {trigger: true});
              return;
            }
            throw response;
          }
        });

      },

      renderLayout: function() {
        var self = this;
        this.socketStatus.show(new SocketStatusView());

        this.containerLeftViews.forEach(function(view) {
          view.close();
          self.containerLeftViews.remove(view);
        });

        if (socket.session.isAuthorized()) {
          var view = new MessageCreateView().render();
          this.containerLeftViews.add(view);
        }

      },

      _routeOwnerSubmenu: function(subMenu) {
        var self = this;

        this.containerLeftViews.add(new OwnerMenuLocalView({
          model: this.owner
        }));

        this.containerLeftViews.add(new UsersListView());

        this.regionUser.show(new UserInfoView({
          model: this.owner
        }));

        this.containerLeftViews.forEach(function(view) {
          view.render();
          self.containerLeft.append(view.$el);
        });

        this._routeOwnerMessages(subMenu);
      },

      _routeOwnerMessages: function(fetchMode) {

        fetchMode = (fetchMode == 'following') ? Messages.FETCH_BY_USERNAME_AND_FOLLOWING :
          Messages.FETCH_BY_USERNAME;

        var messages = new Messages();

        this.regionMessages.show(new MessagesView({
          collection: messages,
          subscribe: {
            username: this.owner.get('username'),
            mode: fetchMode
          }
        }));

      }


    })
  });
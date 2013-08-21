define(["tpl!template/messageCreate.html", "views/alert", "socket", "models/message", "marionette"],
  function(template, AlertView, socket, Message) {

    return Marionette.ItemView.extend({

      className: "well message-create",
      tagName: "li",

      template: template,
      events: {
        "submit form": "onSubmit"
      },

      initialize: function() {
        _.bindAll(this);
      },

      onSubmit: function() {
        var self = this;

        var content = this.$el.find('[name="content"]').val();
        if (!content) return false;

        this.$el.addClass('loading');
        this.$('button:submit').button('loading');

        var message = new Message;

        message.save({
          content: content
        }, {
          success: function() {
            // clear the form
            self.$el.removeClass('loading');
            self.$('button:submit').button('reset');
            self.$el.find('[name="content"]').val('');

            AlertView.show({
              title: "Сообщение доставлено.",
              alert: 'success'
            });
          },
          error: function(err) {
            self.$el.removeClass('loading');
            self.$e('button:submit').button('reset');
            AlertView.show({
              title: "Ошибка при отправке.",
              alert: 'error'
            });

            throw err;
          }
        });

        return false;
      },

      serializeData: function() {
        if (!socket.session.isAuthorized()) {
          throw new Error("Must be authorized to see this view");
        }

        return {
          user: socket.session.get('user').attributes
        };
      }
    });

  });
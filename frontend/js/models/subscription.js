define(["backbone", "socket"], function(Backbone, socket) {

  return Backbone.Model.extend({

    initialize: function() {
      _.bindAll(this);
    },

    start: function() {
      var self = this;
      socket.emit(self.get('url') + ":subscribe", this.get('filter'), function(err, id) {
        if (err) console.error(err);
        self.subscribeId = id;
      });

      socket.on(self.get('url') + ":create", this.onCreate);

      // on next connect, AFTER session is established
      // try to restore the subscription, BUT only if not unsubscribed
      socket.once('session', function() {
        if (!self.subscribeId) return; // no active subscription
        self.start();
      })

    },

    onCreate: function(data) {
      this.get('filter').lastCreated = new Date(data.created);
      this.trigger('create', data);
    },

    end: function() {
      socket.emit(this.get('url') + ":unsubscribe", this.subscribeId, function(err) {
        err && console.error(err);
      });

      socket.removeListener(this.get('url') + ":create", this.onCreate);
      delete this.subscribeId;
    }
  });


});
/**
 * Shows current status in a tiny window (if not connected)
 */
define(["backbone", "socket"], function(Backbone, socket) {
  return Backbone.View.extend({
    events: {
      "click .connect": "disconnect",
      "click .disconnect": "connect"
    },

    disconnect: function() {
      // HELP!!! HELP!!! Network failure!!!
      socket.socket.transport.xhr.abort();
    },

    connect: function() {
      socket.socket.reconnect();
    },

    initialize: function() {
      _.bindAll(this);
      // https://github.com/LearnBoost/socket.io/wiki/Exposed-events
      socket.on('status', this.render);
    },

    render: function(status) {
      if (!status) status = socket.status;

      this.$el.empty().append(
        $('<button>', {class: status + " btn btn-default", html: status})
      );
    }
  })
});
define(["models/session", "socket.io"], function(Session) {

  var socket = window.socket = io.connect();

  socket.once('session', function(data) {
    socket.session = new Session(data);
  });

  var statuses = ['connect', 'connecting', 'disconnect', 'connect_failed', 'error', 'reconnect_failed', 'reconnect', 'reconnecting' ];

  // usually socket has no status string inside
  // we add it here to use in socketStatus view
  $(statuses).each(function(k, status) {
    socket.on(status, function() {
      socket.status = status;
      socket.$emit('status', status);
    });
  });

  return socket;
});
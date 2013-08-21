var loadSession = require('./loadSession');
var handlers = require('./handlers');
var error = require('error');

module.exports = function(io, sessionConfig) {

  io.sockets.on('connection', function(socket) {
    loadSession(socket, sessionConfig, function(err) {

      if (err) {
        if (err instanceof error.UserError) {
          socket.emit('error', err);
        } else {
          console.error(err);
        }
      } else {
        handlers(socket);
      }
    });
  });

};
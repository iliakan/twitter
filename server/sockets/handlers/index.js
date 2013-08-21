
module.exports = function(socket) {

  socket.on('message:create', function(data, callback) {
    require('./message').create(socket, data, callback);
  });

  socket.on('messages:subscribe', function(filter, callback) {
    require('./messages').subscribe(socket, filter, callback);
  });

  socket.on('messages:unsubscribe', function(id, callback) {
    require('./messages').unsubscribe(socket, id, callback);
  });

  socket.on('user:read', function(filter, callback) {
    require('./user').read(socket, filter, callback);
  });

  socket.on('user:follow', function(userId, callback) {
    require('./user').follow(socket, userId, callback);
  });

  socket.on('user:unfollow', function(userId, callback) {
    require('./user').unfollow(socket, userId, callback);
  });

};


var User = require('models/user');
var log = require('log')(module);
var error = require('error');


function read(socket, filter, callback) {
  if (filter.username) {
    return readByUsername(socket, String(filter.username), callback);
  }

  if (filter.top) {
    return readTop(socket, callback);
  }

}

// Stub: any users with messages
function readTop(socket, callback) {
  User.find({ messagesCount: { $gt: 0 } }, function(err, users) {
    if (err) return callback(err);

    if (users) callback(null, users);
    else callback(new error.NotFound("Users not found"));
  });
}

function readByUsername(socket, username, callback) {
  User.findOne({username: username}, function(err, user) {
    if (err) {
      log(err);
      callback("Internal error");
    } else {
      if (user) callback(null, user);
      else callback(404);
    }
  });
}

function follow(socket, userId, callback) {
  socket.session.user.follows.addToSet(userId);
  socket.session.user.save(function(err, user) {
    log(user);
  });
}

function unfollow(socket, userId, callback) {
  socket.session.user.follows.pull(userId);
  socket.session.user.save(function(err, user) {
    log(user);
  });
}

this.read = read;
this.follow = follow;
this.unfollow = unfollow;

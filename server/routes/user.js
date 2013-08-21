var User = require('models/user');
var log = require('log')(module);
var async = require('async');
var error = require('error');

exports.login = function(req, res, next) {

  async.waterfall([
    function(callback) {
      User.findOne({ username: req.body.username }).exec(callback);
    },
    function(user, callback) {
      if (!user) {
        user = new User({
          username: req.body.username,
          password: req.body.password,
          avatar: (Math.random() * 40 + 1 ^ 0) + '.jpg'
        });
        // если просто user.save(callback), то будет лишний аргумент у следующей функции
        user.save(function(err, user, affected) {
          callback(err, user);
        });
      } else {
        if (user.checkPassword(req.body.password)) {
          callback(null, user);
        } else {
          callback(new error.HttpError(403, 'Логин или пароль неверен.'));
        }
      }
    }
  ],
    function(err, user) {
      if (err instanceof error.HttpError && err.status == 403) {
        return res.send(403, err.message);
      }

      if (err) {
        return next(err);
      }

      req.session.user = user._id;
      res.json(user.getPublicFields());
    }
  );

};

exports.logout = function(req, res) {
  var userId = req.session.user;
  if (typeof userId == 'object') userId = userId._id;
  if (!userId) {
    res.send(401);
    return;
  }

  req.session.destroy();

  killSocketsForUser(req.app.get('io'), userId);

  res.redirect('/');
};

function killSocketsForUser(io, userId) {

  var clients = io.sockets.clients();

  for (var i = 0; i < clients.length; i++) {
    var socket = clients[i];
    if (socket.session && socket.session.user && socket.session.user._id == userId) {
      log("Killing socket " + socket.id);
      delete socket.session;
      socket.emit("logout"); // client should react on it, warn and redirect the user
      socket.disconnect();
    }
  }
}
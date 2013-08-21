var Message = require('models/message');
var User = require('models/user');
var log = require('log')(module);
var error = require('error');
var async = require('async');

function create(socket, messageData, callback) {

  if (!socket.session.user) {
    return callback(new error.HttpError(403, "Deny anonymous request"));
  }

  async.waterfall([
    function(callback) {
      messageData.user = socket.session.user._id;
      var message = new Message(messageData);
      message.save(callback);
    },
    function(message, affected, callback) {
      log("inc ", socket.session.user._id);
      User.update({
          _id: socket.session.user._id
        }, {
          $inc: { messagesCount: 1 }
        },
        function(err, numberAffected, raw) {
          if (err) return callback(err);
          callback(null, message);
        }
      );

    }
  ], callback)

}

exports.create = create;
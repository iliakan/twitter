var log = require('log')(module);
var express = require('express');
var cookieParser = express.cookieParser();
var connect = require('connect');
var User = require('models/user');
var async = require('async');
var error = require('error');


module.exports = function(socket, sessionConfig, callback) {

  async.waterfall([
    function(callback) {
      cookieParser(socket.handshake, {}, callback);
    },
    function(callback) {
      var sid = socket.handshake.cookies['connect.sid'];
      sid = connect.utils.parseSignedCookie(sid, sessionConfig.secret);

      log("sid: " + sid);
      if (!sid) {
        // session MUST exist, because the referring page created it!
        return callback(new error.HttpError(403, "No sid"));
      }

      socket.refreshSession = function(callback) {
        refreshSocketSession(socket, sessionConfig, sid, callback);
      };

      socket.refreshSession(function(err, session) {
        // can filter here: send only allowed user/session data to user
        if (err) return callback(err);
        socket.emit("session", session);
        callback(null, session);
      });
    }],
    function(err, session) {
      if (err) {
        log(err);
        socket.disconnect();
      }

      callback(err, session);

    });
};


function refreshSocketSession(socket, sessionConfig, sid, callback) {
  async.waterfall([

    function(callback) {
      sessionConfig.store.load(sid, callback);
    },
    function(session, callback) {
      if (!session) {
        return callback(new error.HttpError(403, "Session not found:" + sid));
      }

      socket.session = session;

      if (session.user) {
        log("retrieving user ", session.user);
        User.findById(session.user, function(err, user) {
          if (err) return callback(err);

          log("user findbyId result: " + user);
          session.user = user;
          return callback(null, session);
        });
      } else {
        return callback(null, session);
      }

    }],
    callback);
}
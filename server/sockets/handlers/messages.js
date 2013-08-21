var Message = require('models/message');
var User = require('models/user');
var log = require('log')(module);
var async = require('async');
var error = require('error');

var HttpStatus = require('http-status');

var FETCH_BY_USERNAME = 1;
var FETCH_BY_USERNAME_AND_FOLLOWING = 2;

/**
 * At the first connect get all recent messages (limit 10)
 * Then we only query for new messages
 * @param socket
 */
var queryStreams = {};

/**
 * Converts userFilter to query filter
 *    userFilter.lastCreated: date to start
 *    userFilter.username: user name to filter
 *    userFilter.mode: query mode
 *
 * @param userFilter
 * @param callback(err, query) on completion
 */
function convertFilterToQuery(userFilter, callback) {
  var query = { };

  if (!userFilter.username) {
    return callback(new error.HttpError(HttpStatus.BAD_REQUEST, "No username"));
  }

  log("userFilter: ", userFilter);

  query.created = {
    $gt: userFilter.lastCreated ? new Date(userFilter.lastCreated) : new Date(new Date - 86400 * 1000 * 100)
  };

  async.waterfall([
    function(callback) {
      User.findOne({
        username: String(userFilter.username)
      }, callback);

    },
    function(user, callback) {
      if (!user) {
        return callback(new error.HttpError(404, "No such user"));
      }

      if (userFilter.mode == FETCH_BY_USERNAME_AND_FOLLOWING) {
        query.user = { $in: user.follows.slice() };
        query.user.$in.push(user._id);
      } else if (userFilter.mode == FETCH_BY_USERNAME) {
        query.user = user._id;
      } else {
        return callback(new error.HttpError(HttpStatus.BAD_REQUEST, "unknown filter mode") );
      }

      callback(null, query);
    }
  ],
  callback);

}

function subscribe(socket, userFilter, callback) {
  // one subscription => one ID, which may be replaced by reopened queries

  async.waterfall([
    function(callback) {
      convertFilterToQuery(userFilter, callback);
    },
    function(query, callback) {
      log('messages query', query);

      var subscriptionId = Math.random();

      subscribeToQuery(socket, query, subscriptionId);
      callback(null, subscriptionId);
    }
  ], callback);

}

function subscribeToQuery(socket, query, subscriptionId) {

  if (socket.disconnected) {
    // может произойти после рекурсивного вызова через setTimeout
    log("subscribeToQuery on disconnected socket: ignore");
    return;
  }

  var queryStream = Message
    .find(query)
    .populate('user')
    .limit(10).tailable({awaitdata: true}).stream();

  queryStreams[subscriptionId] = queryStream;

  queryStream
    .on('error', function(err) {
      log('DB error', err);
      // error also triggers close for additional processing
    })
    .on('close', function() {
      // GC happens on any close, including destroy and error
      delete queryStreams[subscriptionId];
      if (!queryStream.isDestroyed) {
        log('collection empty or db error, scheduling retry');
        setTimeout(subscribeToQuery.bind(this, socket, query, subscriptionId), 3000);
      }
    })
    .on('data', function(data) {
      log("message:" + data);
      socket.emit('messages:create', data);
    });

  // clean up on disconnects
  socket.on('disconnect', function() {
    log("Disconnected socket " + socket.id);
    queryStream.isDestroyed = true;
    queryStream.destroy(); // triggers close
  });

}

function unsubscribe(socket, subscriptionId, callback) {
  if (!queryStreams[subscriptionId]) {
    callback(new error.NotFound("No such stream"));
    return;
  }

  var queryStream = queryStreams[subscriptionId];
  queryStream.isDestroyed = true;
  queryStream.destroy(); // triggers close
  log("unsubscribed from stream " + subscriptionId);
  callback(null, "OK");
}

exports.subscribe = subscribe;
exports.unsubscribe = unsubscribe;

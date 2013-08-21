var mongoose = require('db');
var async = require('async');

var Model = {};
var Data = {};

function create(callback) {

  async.waterfall([
    connect,
    dropDatabase,
    initModel,
    createUsers,
    createFollowers,
    createMessages
  ],
    callback
  );

}

function connect(callback) {
  if (mongoose.connection.readyState == 1) {
    process.nextTick(callback); // maybe db is already connected
  } else {
    mongoose.connection.on('open', callback);
  }
}

function dropDatabase(callback) {
  mongoose.connection.db.dropDatabase(callback);
}

// require models AFTER dropDatabase is complete
// mongo will create structures for them immediately
function initModel() {
  Model.User = require('models/user');
  Model.Message = require('models/message');
  process.nextTick(arguments[arguments.length-1]);
}

function createUsers(callback) {
  Data.users = [];
  var i = 0;

  async.each(["tester", "ilya", "vasya"], createUser, callback);

  function createUser(username, callback) {
    new Model.User({
      username: username,
      password: "123",
      avatar: ++i + ".jpg",
      messagesCount: 2
    }).save(function(err, user) {
        if (err) return callback(err);

        Data.users.push(user);
        callback();
      });
  }

}

function createFollowers(callback) {

  Data.users.forEach(function(user, index) {
    for (var i = index + 1; i < Data.users.length; i++) {
      // console.log(user._id + " follows " + users[i]._id);
      user.follows.push(Data.users[i]._id);
    }
  });

  async.each(Data.users, function(user, callback) {
    user.save(callback);
  }, callback);
}

function createMessages(callback) {
  var date = new Date(new Date - 86400 * 1000 * 10);

  var messages = [];

  for (var i = 0; i < Data.users.length; i++) {
    var message = new Model.Message({
      content: "Сообщение 1 от " + Data.users[i].username,
      user: Data.users[i]._id,
      created: new Date(date)
    });

    messages.push(message);
    date.setDate(date.getDate() + 1);

    message = new Model.Message({
      content: "Сообщение 2 от " + Data.users[i].username,
      user: Data.users[i]._id,
      created: new Date(date)
    });

    messages.push(message);
    date.setDate(date.getDate() + 1);
  }


  async.each(messages, function(message, cb) {
    message.save(cb)
  }, callback);

}


if (!module.parent) {
  create(function(err) {
    if (err) console.error(err);
    else console.log("OK");
    process.exit(0);
  });
} else {
  exports.create = create;
}

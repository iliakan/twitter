var createSampleDb = require('createSampleDb');
var should = require("should");

var db = require('db');

describe('createDb', function(){
  before(function(done) {
    createSampleDb.create(done);
  });

  describe('create', function(done) {
    it('should create users', testUsers);
    it('should create messages', testMessages);
  });

  after(function(done) {
    db.connection.db.dropDatabase(function() {
      done();
    });
  })
});


function testUsers(done) {
  var User = require('models/user');

  User.find().exec(function(err, users) {
    if (err) throw err;
    users.length.should.equal(3);
    done();
  });

}

function testMessages(done) {
  var Message = require('models/message');

  Message.find().exec(function(err, messages) {
    if (err) throw err;
    messages.length.should.equal(6);
    done();
  });

}
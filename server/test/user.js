var app = require('app');
var createSampleDb = require('createSampleDb');
var request = require('supertest');
var should = require('should');

var db = require('db');

describe('user', function() {
  before(function(done) {
    createSampleDb.create(done);
  });

  it('GET / returns login-form', function(done){
    request(app)
      .get('/')
      .end(function(err, res) {
        if (err) return done(err);

        if (!res.text.match(/login-form/)) {
          done( new Error("No login form in body") );
        } else {
          done();
        }
      })
  });

  it('POST /user/login creates user', function(done) {
    request(app)
      .post('/user/login')
      .send({
        username: "Ilya",
        password: "qwerty"
      })
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);

        res.body.username.should.equal("Ilya");
        done();
      });
  });

  it('POST /user/login checks existing user', function(done) {
    request(app)
      .post('/user/login')
      .send({
        username: "Ilya",
        password: "qwerty"
      })
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.username.should.equal("Ilya");
        done();
      });
  });


  it('POST /user/login fails for existing user with wrong password', function(done) {
    request(app)
      .post('/user/login')
      .send({
        username: "Ilya",
        password: "wrong"
      })
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);

        res.statusCode.should.equal(403);
        res.body.should.have.property('error');
        done();
      });
  });

});
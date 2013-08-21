var crypto = require('crypto');

var mongoose = require('db'),
  Schema = mongoose.Schema;

var schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: '1.jpg'
  },
  messagesCount: {
    type: Number,
    default: 0
  },
  follows:[{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });


schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

schema.methods.getPublicFields = function() {
  return {
    username: this.username,
    created: this.created,
    id: this.id,
    avatar: this.avatar,
    messagesCount: this.messagesCount,
    follows: this.follows
  };
};

module.exports = mongoose.model('User', schema);

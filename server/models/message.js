var mongoose = require('db'),
  Schema = mongoose.Schema;

var messageSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // ref: "model to use for population"
    required: true
  }
}, { capped: 3 }); // can archive from capped by another reading thread

module.exports = mongoose.model('Message', messageSchema);

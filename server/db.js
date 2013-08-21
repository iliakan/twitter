var log = require('log')(module);

// Установим соединение с базой
var mongoose = require('mongoose');

if ( process.env.NODE_ENV == 'test' ) {
  mongoose.connect('mongodb://localhost/test');
} else {
  mongoose.connect('mongodb://localhost/twitter');
}

if (process.env.NODE_ENV == 'development') {
  mongoose.set('debug', true);
}

log("DB initialized");

module.exports = mongoose;
var http = require('http')
  , path = require('path')
  , log = require('log')(module);

// Создадим "приложение" express
var express = require('express');
var app = express();

// Установим соединение с базой
var mongoose = require('db');

// Базовые настройки
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');


// Встроенные Middleware
app.use(express.favicon());
if (app.get('env') == 'development') {
  app.use(express.logger('dev'));
}
app.use(express.bodyParser());
app.use(express.cookieParser());

// Хранилище сессий в MongoDB
var MongoStore = require('connect-mongo')(express);

// Будем использовать одно соединение с Mongoose для сессий
var sessionConfig = {
  secret: 'session-secret', // подпись для куков с сессией
  store: new MongoStore({mongoose_connection: mongoose.connection})
};

app.use(express.session(sessionConfig)); // можно подключать не для всех запросов

// Конфигурируем стандартные запросы
app.use(app.router);
require('./routes')(app);

// статика (можно отдельный сервер)
app.use(express.static(path.join(__dirname, '../frontend')));

// В конце - обработчик ошибок
if (app.get('env') == 'development') {
  app.use(express.errorHandler());
}

// Создаем сервер и конфигурируем socket.io
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
// Делаем io доступным через req.app.get('io')
app.set('io', io);

if (app.get('env') == 'development') {
  io.set('log level', 3); // reduce logging
  io.set('transports', ['xhr-polling']);
}

// Сокетам тоже нужна работа с сессиями, они действуют сами, без express
require('./sockets')(io, sessionConfig);


server.listen(app.get('port'), function() {
  log("Express server listening on port " + app.get('port'));
});

// Для тестов
module.exports = app;

# Пример приложения а-ля твиттер на Backbone/Marionette + Node.JS/Express/Socket.IO

## Node.JS

Аспекты реализации.

### Логирование

 - модуль `debug`
 - `log.js`

Подключение лога:
```
var log = require('log')(module);
```

Использование:
```
log("DB initialized");
```

Чтобы вывод срабатывал - включить отладку
```
DEBUG=server:* ./node my.js
DEBUG=server:db ./node my.js
```

### Сессии

 - `express-session`
 - хранилище `mongo-connect`, настройки из `mongoose.connection`
 -
### Асинхронность

 - модуль `async`
 - пример `try..catch`: `routes/user.js`


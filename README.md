"Твиттер" - пример приложения на Node/Mongo/Backbone.

Чтобы запустить: 
```
git clone
cd server
npm install
// Mongo 2.4+ должна быть запущена
npm run sampleDb
npm run dev
```

После этого "твиттер" будет доступен по адресу: `http://127.0.0.1:3000`.

Если запуск завершается ошибкой `sh: supervisor: command not found` нужно установить supervisor с помощью команды: 
```
npm i -g supervisor
```

Todo: добавить тесты, поправить редкие баги, но как пример более-менее сложного приложения уже подойдёт ;)

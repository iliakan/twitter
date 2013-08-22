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

Если запуск завершается ошибкой `sh: supervisor: command not found` нужно установить supervisor с помощью команды: 
```
npm i -g supervisor
```

Todo: добавить тесты, поправить редкие баги, как пример более-менее сложного приложения уже подойдёт ;)

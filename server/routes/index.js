
module.exports = function(app) {

  app.get('/', function(req, res) {
    if (req.session.user) {
      res.render('app');
    } else {
      res.render('login');
    }
  });

  app.get(/^[^.]+$/, function(req, res) {
    res.render('app');
  });

  app.post('/user/login', require('./user').login);
  app.post('/user/logout', require('./user').logout);
};
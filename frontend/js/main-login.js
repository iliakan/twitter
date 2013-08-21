define(["views/login"],
  function(LoginView) {

    return function() {
      new LoginView({
        el: document.body
      }).render();
    };

  });
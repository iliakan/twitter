define(["views/app", "socket", "router" ], function(App, socket, Router) {

  return function() {
    var app = window.App = new App({
      el: $('#app')
    });

    if (!socket.session) {
      socket.once('session', function() {
        // timeout to make sure that the session is processed
        setTimeout(onInitSession, 0);
      });
    } else {
      onInitSession();
    }

    function updateActiveLink() {

      var activeLinks = $('a.active');

      for (var i = 0; i < activeLinks.length; i++) {
        var activeLink = activeLinks.eq(i);

        if ( activeLink.attr('href') == document.location.pathname ) {
          // up to date already
          return;
        }

        activeLink.removeClass('active');
      }

      $('a[href="'+ document.location.pathname + '"]').addClass('active');
    }

    function onInitSession() {
      app.render();

      var router = app.router = new Router({
        controller: app
      });
      Backbone.history.start({pushState: true});

      // all links with data-navigate use router
      // but href still has the correct url to allow right-click & SEO
      $(document).on('click', 'a[data-navigate]', function(e) {
        if (e.isDefaultPrevented()) return false; // someone processed already
        router.navigate($(this).attr('href').replace(/^\//, ''), {trigger: true});
        return false;
      });

      setInterval(updateActiveLink, 100);


      $(document).on('error', function(event) {
        alert(event.error); // fixme: show modal view with error
      });

    }
  };

});

define(["marionette"],
  function(Marionette) {

  return Marionette.AppRouter.extend({

    appRoutes: {
      "": "routeIndex",
      ":ownername": "routeOwner",
      ":ownername/:submenu": "routeOwner"
    },

    navigateToHref: function(a, options) {
      this.navigate($(a).attr('href').replace(/^\//, ''), options);
    }

  });
});

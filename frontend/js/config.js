requirejs.config({
  baseUrl: "/js",

  paths: {
    "template": "../template",
    "tpl": "../vendor/bower_components/requirejs-tpl/tpl",
    jquery: '../vendor/bower_components/jquery/jquery',
    underscore: '../vendor/bower_components/lodash/dist/lodash',
    "backbone.source": '../vendor/bower_components/backbone/backbone',
    "backbone.babysitter": '../vendor/bower_components/backbone.babysitter/lib/amd/backbone.babysitter',
    "backbone": "backbone.id",
    iosync: '../vendor/bower_components/backbone.iobind/dist/backbone.iosync',
    iobind: '../vendor/bower_components/backbone.iobind/dist/backbone.iobind',
    "backbone.marionette": '../vendor/bower_components/backbone.marionette/lib/backbone.marionette',
    "socket.io": '../vendor/socket.io',
    "jquery.bootstrap": "../vendor/bower_components/bootstrap/dist/js/bootstrap"
  },

  shim: {
    "backbone.source": {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    underscore: {
      exports: '_'
    },
    iosync: {
      deps: ["jquery", "backbone"],
      exports: "iosync"
    },
    iobind: {
      deps: ["jquery", "backbone", "iosync"],
      exports: "iobind"
    },
    "backbone.marionette" : {
      deps : ['jquery', 'underscore', 'backbone'],
      exports : 'Marionette'
    },
    "jquery.bootstrap": {
      deps: ["jquery"]
    }

  },


  callback: onRequireInit

});

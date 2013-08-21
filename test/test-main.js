var tests = Object.keys(window.__karma__.files).filter(function(file) {
    return /Spec\.js$/.test(file);
});

var deps = ["chai"].concat(tests);

requirejs.config({
    // Karma serves files from '/base' + URL for requirejs of my main site
    baseUrl: '/base/client/js',

    paths: {
        "template": "../template",
        "tpl": "../components/requirejs-tpl/tpl",
        jquery: '../components/jquery/jquery',
        underscore: '../components/lodash/dist/lodash',
        "backbone.source": '../components/backbone/backbone',
        "backbone": "backbone.patch",
        iosync: '../components/backbone.iobind/backbone.iosync',
        iobind: '../components/backbone.iobind/backbone.iobind',
        "backbone.marionette": '../components/backbone.marionette/lib/backbone.marionette',
        "socket.io": '../components/socket.io',
        'chai': '../components/chai/chai',
        'sinon' : '../components/sinon/lib/sinon',
        'sinon-chai' : '../components/sinon-chai/lib/sinon-chai'
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
        "backbone.marionette": {
            deps: ['jquery', 'underscore', 'backbone'],
            exports: 'Marionette'
        }

    }

});

require(deps, function(chai) {
    // Put chai to global scope
    window.assert = chai.assert;
    window.should = chai.should();
    window.expect = chai.expect;

    window.__karma__.start();
});

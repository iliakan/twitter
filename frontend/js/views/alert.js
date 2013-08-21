define(["tpl!template/alert.html", "marionette"], function(template) {


  var AlertView = Backbone.View.extend({

    className: "alert",
    template: template,
    initialize: function (options) {

      _.bindAll(this, "render", "remove");

      if (options) {
        this.alert = options.alert || "info";
        this.title = options.title || "";
        this.message = options.message || "";
        this.fixed = options.fixed || true;
      }


    },

    render: function () {
      var output = this.template({ title: this.title, message: this.message });

      this.$el.addClass("alert-" + this.alert).html(output).alert();

      if (this.fixed) {
        this.$el.addClass("fixed");
      }

      this.$el.fadeIn('fast');

      return this;
    },

    remove: function () {
      this.$el.fadeOut('fast');
    }
  });

  AlertView.show = function (options) {
    var alert = new AlertView(options);

    $(document.body).append(alert.render().el);

    window.setTimeout(function () {
      alert.remove();
    }, 1500);

    return alert;
  };


  return AlertView;
});
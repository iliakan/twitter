define(["tpl!template/userInfo.html", "marionette"], function(template) {

  return Marionette.ItemView.extend({
    template: template,
    className: "well user-info"
  });

});
define(["tpl!template/message.html", "marionette"], function(template, Marionette) {

  return Marionette.ItemView.extend({
    tagName: "li",
    className: "message clearfix",
    template: template
  });
});
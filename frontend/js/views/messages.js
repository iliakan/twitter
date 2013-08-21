/**
 * A CompositeView extends from CollectionView to be used as a composite view for scenarios
 * where it should represent both a branch and leaf in a tree structure, or for scenarios
 * where a collection needs to be rendered within a wrapper template.
 */
define(["tpl!template/messages.html", "tpl!template/messagesEmpty.html", "views/message", "marionette"],
  function(template, templateEmpty, MessageView) {

  return Marionette.CompositeView.extend({
    template: template,
    className: "well messages",

    onBeforeRender: function() {
      this.collection.subscribe(this.options.subscribe);
    },

    itemView: MessageView,

    emptyView: Marionette.ItemView.extend({
      template: templateEmpty
    }),

    appendHtml: function(collectionView, itemView, index){
      collectionView.$('ul').prepend(itemView.$el.hide().fadeIn());
    },
    
    onClose: function() {
      this.collection.unsubscribe();
    }
  })
});
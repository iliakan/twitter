define(["backbone", "./message", "socket", "./subscription"], function(Backbone, Message, socket, Subscription) {

  var Messages = Backbone.Collection.extend({
    url: 'messages',
    model: Message,

    initialize: function() {
      _.bindAll(this);
    },

    onCreate: function(model) {
      // parse server-side seriaized data to Date
      var message = new Message(model, {parse: true});
      this.add(message);
    },

    comparator: function(message) {
      var created = message.get('created');
      return created ? -created.getTime() : 0;
    },

    subscribe: function(filter) {
      var self = this;

      this.subscription = new Subscription({url: self.url, filter: filter});
      this.listenTo(this.subscription, 'create', this.onCreate);
      this.subscription.start();
    },

    unsubscribe: function() {
      this.subscription.end();
    }
  });

  Messages.FETCH_BY_USERNAME = 1;
  Messages.FETCH_BY_USERNAME_AND_FOLLOWING = 2;

  return Messages;

});
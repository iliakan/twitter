define(["backbone.source"], function(Backbone) {

  // MongoDB uses _id for id
  // https://github.com/documentcloud/backbone/issues/161
  Backbone.Model.prototype.idAttribute = "_id";

  return Backbone;
});
define(["backbone", "jquery.bootstrap"], function() {

  return Backbone.View.extend({
    events: {
      "submit form": "onSubmit"
    },

    initialize: function() {
      _.bindAll(this);

    },

    hasEmptyRequired: function() {
      return this.$form.find('[required]')
        .filter(function() { return this.value == '' })
        .length;
    },

    onSubmit: function() {
      var self = this;

      if (this.hasEmptyRequired()) {
        return false;
      }

      this.$form.removeClass('error');
      this.$('button:submit').button('loading');

      $.post(this.$form.attr('action'), this.$form.serialize())
        .done(function(result) {
          self.$('button:submit').button('complete');
          window.location.reload(true);
         })
        .fail(function(xhr) {
          self.$('button:submit').button('reset');
          self.renderError(xhr.responseText);
        });

      return false;
    },

    renderError: function(error) {
      var $form = this.$form;

      $form.addClass('error');

      $form.find('.help-block').html(error);

      setTimeout(function() {
        $form.find('input[name="username"]').focus();
      }, 0);
    },

    render: function() {
      var $form = this.$form = this.$el.find('form');

      setTimeout(function() {
        $form.find('input[name="username"]').focus();
      }, 0);
      return this;
    }
  });

});
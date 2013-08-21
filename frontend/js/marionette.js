define(["backbone.marionette"], function(Marionette) {

  var templateHelpers = {
    escapeHtml: function(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    escapeAttr: function(s, preserveCR) {
      preserveCR = preserveCR ? '&#13;' : '\n';
      return ('' + s)/* Forces the conversion to string. */
        .replace(/&/g, '&amp;')/* This MUST be the 1st replacement. */
        .replace(/'/g, '&apos;')/* The 4 other predefined entities, required. */
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\r\n/g, preserveCR)/* Must be before the next replacement. */
        .replace(/[\r\n]/g, preserveCR);
    },

    formatDate: function(date, mode) {
      mode = mode || 'dd.mm.yyyy';

      var format = {
        dd: ('0' + date.getDate()).slice(-2),
        mm: ('0' + (1 + date.getMonth())).slice(-2),
        yyyy: date.getFullYear(),
        hh: ('0' + date.getHours()).slice(-2),
        ii: ('0' + date.getMinutes()).slice(-2),
        ss: ('0' + date.getSeconds()).slice(-2)
      };

      for(var prop in format) {
        mode = mode.replace(prop, format[prop]);
      }

      return mode;
    }
  };


  var mixinTemplateHelpers = Marionette.View.prototype.mixinTemplateHelpers;
  Marionette.View.prototype.mixinTemplateHelpers = function(target) {
    target = target || {};
    for (var key in templateHelpers) target[key] = templateHelpers[key];
    return mixinTemplateHelpers.call(this, target);
  };


  return Marionette;
});
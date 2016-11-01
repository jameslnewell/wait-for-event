'use strict';

module.exports = {

  addListener: function(emitters, event, listener) {
    emitters.forEach(emitter => {
      if (typeof emitter.on === 'function') {
        emitter.on(event, listener);
      }
    });
  },

  removeListener: function(emitters, event, listener) {
    emitters.forEach(emitter => {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener(event, listener);
      } else if (typeof emitter.off === 'function') {
        emitter.off(event, listener);
      }
    });
  }

};

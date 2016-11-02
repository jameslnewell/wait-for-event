'use strict';

module.exports = {

  addListener: function(emitter, event, listener) {
    if (typeof emitter.on === 'function') {
      emitter.on(event, listener);
    }
  },

  removeListener: function(emitter, event, listener) {
    if (typeof emitter.removeListener === 'function') {
      emitter.removeListener(event, listener);
    } else if (typeof emitter.off === 'function') {
      emitter.off(event, listener);
    }
  }

};

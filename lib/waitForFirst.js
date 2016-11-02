'use strict';
const utils = require('./utils');

/**
 * Wait for a single event or error to be emitted
 *
 *  The `callback` is called when:
 *    - the next event is emitted OR
 *    - the next error is emitted
 *
 *  The `callback` is called with the error, if one occurred
 *
 * @param   {string}          event
 * @param   {Array.<object>}  emitters
 * @param   {function}        callback
 */
module.exports = function(event, emitters, callback) {
  let emitted = false;

  const onNext = function(error) {
    if (emitted) return;

    //mark as emitted
    emitted = true;

    //stop listening
    emitters.forEach(emitter => utils.removeListener(emitter, event, onNext));
    emitters.forEach(emitter => utils.removeListener(emitter, 'error', onNext));

    //call the callback
    if (typeof callback === 'function') {
      callback.call(null, error);
    }

  };

  //start listening
  emitters.forEach(emitter => utils.addListener(emitter, event, onNext));
  emitters.forEach(emitter => utils.addListener(emitter, 'error', onNext));

  //call the callback right away if there are no emitters
  if (emitters.length === 0) {
    if (typeof callback === 'function') {
      callback.call(null, null);
    }
  }

};

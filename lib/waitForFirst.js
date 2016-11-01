'use strict';
const utils = require('./utils');

/**
 * Wait for a single event or error to be emitted
 *
 *  The callback is called when:
 *    - the next event is emitted OR
 *    - the next error is emitted
 *
 *  The callback is called with the error, if one occurred.
 *
 * @param   {string}          event
 * @param   {Array.<object>}  emitters
 * @param   {function}        callback
 */
module.exports = function(event, emitters, callback) {
  let emitted = false;

  const onNext = function(error) {
    if (emitted) return;

    //stop listening
    emitted = true;
    utils.removeListener(emitters, event, onNext);
    utils.removeListener(emitters, 'error', onNext);

    if (typeof callback === 'function') {
      callback.call(null, error);
    }

  };

  //start listening
  utils.addListener(emitters, event, onNext);
  utils.addListener(emitters, 'error', onNext);

};

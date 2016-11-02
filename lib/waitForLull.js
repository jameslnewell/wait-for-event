'use strict';
const utils = require('./utils');

/**
 * Wait for events and errors to stop being emitted for a period of time
 *
 *  The `callback` is called when:
 *    - no events or errors have been emitted for the specified period of time
 *
 *  The `callback` is called with an array of errors, if any occurred
 *
 * @param   {string}          event
 * @param   {Array.<object>}  emitters
 * @param   {number}          [period]
 * @param   {function}        callback
 */
module.exports = function(event, emitters, period, callback) {
  let timeout = null;
  const errors = [];

  if (arguments.length === 3) {
    callback = period;
    period = 100;
  }

  const onNext = function(error) {
    clearTimeout(timeout);

    //record the error
    if (error) {
      errors.push(error);
    }

    //wait to see if any other events are emitted
    timeout = setTimeout(() => {

      //stop listening
      emitters.forEach(emitter => utils.removeListener(emitter, event, onNext));
      emitters.forEach(emitter => utils.removeListener(emitter, 'error', onNext));

      //call the callback
      if (typeof callback === 'function') {
        callback.call(null, errors);
      }

    }, period);

  };

  //start listening
  emitters.forEach(emitter => utils.addListener(emitter, event, onNext));
  emitters.forEach(emitter => utils.addListener(emitter, 'error', onNext));

  //start the timeout
  onNext();

};

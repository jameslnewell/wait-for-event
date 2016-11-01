'use strict';
const utils = require('./utils');

/**
 * Wait for events and errors to stop for a period of time
 *
 *  The callback is called when:
 *    - no events or errors have been emitted for the specified period of time
 *
 *  The callback is called with the error, if one occurred.
 *
 * @param   {string}          event
 * @param   {Array.<object>}  emitters
 * @param   {function}        done
 */
module.exports = function(event, emitters, done) {
  let timeout = null;
  const errors = [];

  const onNext = function(error) {
    clearTimeout(timeout);

    //record the error
    if (error) {
      errors.push(error);
    }

    //wait to see if any other events are emitted
    timeout = setTimeout(() => {

      //stop listening
      utils.removeListener(emitters, event, onNext);
      utils.removeListener(emitters, 'error', onNext);

      if (typeof done === 'function') {
        done.call(null, errors);
      }

    }, 100);

  };

  //start listening
  utils.addListener(emitters, event, onNext);
  utils.addListener(emitters, 'error', onNext);

};

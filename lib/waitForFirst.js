'use strict';
const utils = require('./utils');

/**
 * Wait for the first event
 *  The callback is called when:
 *    - the next time the event is emitted OR
 *    - the next time an error event is emitted
 *
 * @param   {string}          event
 * @param   {Array.<object>}  emitters
 * @param   {function}        done
 */
module.exports = function(event, emitters, done) {
  let emitted = false;

  const onEach = function() {
    if (emitted) return;

    //stop listening
    emitted = true;
    utils.removeListener(emitters, event, onEach);
    utils.removeListener(emitters, 'error', onEach);

    if (typeof done === 'function') {
      done.call(null, null);
    }

  };

  const onError = function(error) {
    if (emitted) return;

    //stop listening
    emitted = true;
    utils.removeListener(emitters, event, onEach);
    utils.removeListener(emitters, 'error', onEach);

    if (typeof done === 'function') {
      done.call(null, error);
    }

  };

  //start listening
  utils.addListener(emitters, event, onEach);
  utils.addListener(emitters, 'error', onError);

};

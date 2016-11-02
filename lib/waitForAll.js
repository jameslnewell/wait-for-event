'use strict';
const utils = require('./utils');

/**
 * Wait for an event or error to be emitted by every emitter
 *
 *  The `callback` is called when:
 *    - the event, or an error, has been emitted by each emitter
 *
 *  The `callback` is called with the error, if one occurred
 *
 * @param   {string}          event
 * @param   {Array.<object>}  emitters
 * @param   {function}        callback
 */
module.exports = function(event, emitters, callback) {
  const errors = [];
  const statuses = new Array(emitters.length).fill(false);
  let handlers;

  const createHandler = function(i) {
    return function(error) {

      //record the error
      if (error) {
        errors.push(error);
      }

      //record the event/error was emitted
      statuses[i] = true;

      //check if each of the emitters have emitted
      if (statuses.every(status => status)) {

        //stop listening
        emitters.forEach((emitter, i) => utils.removeListener(emitter, event, handlers[i]));
        emitters.forEach((emitter, i) => utils.removeListener(emitter, 'error', handlers[i]));

        //call the callback
        if (typeof callback === 'function') {
          callback.call(null, errors);
        }

      }

    };
  };

  //create the handler functions
  handlers = new Array(emitters.length).fill(null).map((_, i) => createHandler(i));

  //start listening
  emitters.forEach((emitter, i) => utils.addListener(emitter, event, handlers[i]));
  emitters.forEach((emitter, i) => utils.addListener(emitter, 'error', handlers[i]));

  //call the callback right away if there are no emitters
  if (emitters.length === 0) {
    if (typeof callback === 'function') {
      callback.call(null, errors);
    }
  }

};

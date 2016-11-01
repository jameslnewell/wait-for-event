'use strict';

/**
 * Start listening for an event on all emitters
 * @param {string}    event
 * @param {array}     emitters
 * @param {function}  onEvent
 * @param {function}  onError
 */
function startListening(event, emitters, onEvent, onError) {
  for (let i = 0; i < emitters.length; ++i) {
    const emitter = emitters[i];

    emitter.once(event, onEvent);

    if (onError) {
      emitter.once('error', onError);
    }

  }
}

/**
 * Remove a listener from an emitter
 * @param {string}    event
 * @param {object}    emitter
 * @param {function}  onEvent
 * @param {function}  onError
 */
function removeListener(event, emitter, onEvent, onError) {

  //support both nodejs' `EventEmitter` and `component-emitter`
  const off = emitter.removeListener ? 'removeListener' : 'off';

  emitter[off](event, onEvent);

  if (onError) {
    emitter[off]('error', onError);
  }

}

/**
 * Stop listening for an event on all emitters
 * @param {string}    event
 * @param {array}     emitters
 * @param {function}  onEvent
 * @param {function}  onError
 */
function stopListening(event, emitters, onEvent, onError) {
  for (let i = 0; i < emitters.length; ++i) {
    const emitter = emitters[i];
    removeListener(event, emitter, onEvent, onError);
  }
}

/**
 * Wait for an event to be emitted on all the emitters
 * @param {string}    event
 * @param {array}     emitters
 * @param {function}  [each]
 * @param {function}  done
 */
function waitForAll(event, emitters, each, done) {


  if (arguments.length < 4) {
    done = each;
    each = null;
  }

  let errors = [];
  let waiting = emitters.length;

  /** the expected event has occurred, check if we're done waiting */
  const onEvent = function() { //using a `function` so `this` is the emitter
    waiting -= 1;
    removeListener(event, this, onEvent, onError);

    if (each) {
      const args = Array.from(arguments);
      args.unshift(this);
      each.apply(this, args);
    }

    finish();
  };

  /** an unexpected event has occurred, check if we're done waiting */
  const onError = function(error) { //using a `function` so `this` is the emitter
    errors.push(error);
    waiting -= 1; //TODO: add option to ignore errors
    removeListener(event, this, onEvent, onError);
    finish();
  };

  const finish = () => {
    if (waiting <= 0) {
      stopListening(event, emitters, onEvent, onError);
      done(errors.length ? errors : null);
    }
  };

  startListening(event, emitters, onEvent, onError);

  finish();
}

module.exports = {
  waitForAll
};
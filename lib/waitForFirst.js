'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.waitForFirst = void 0;

var _utils = require('./utils');

/**
 * Wait for a single event or error to be emitted
 *
 *  The `callback` is called when:
 *    - the next event is emitted OR
 *    - the next error is emitted
 *
 *  The `callback` is called with the error, if one occurred
 *
 * @param   event
 * @param   emitters
 * @param   callback
 */
var waitForFirst = function waitForFirst(event, emitters, callback) {
  var promise = new Promise(function (resolve, reject) {
    var startListening = function startListening() {
      emitters.forEach(function (emitter) {
        (0, _utils.addListener)(emitter, event, handleEvent);
        (0, _utils.addListener)(emitter, 'error', handleError);
      });
    };

    var stopListening = function stopListening() {
      emitters.forEach(function (emitter) {
        (0, _utils.removeListener)(emitter, event, handleEvent);
        (0, _utils.removeListener)(emitter, 'error', handleError);
      });
    };

    var handleEvent = function handleEvent() {
      stopListening();
      resolve();
    }; // eslint-disable-next-line @typescript-eslint/no-explicit-any

    var handleError = function handleError(error) {
      stopListening();
      reject(error);
    };

    if (emitters.length === 0) {
      resolve();
    } else {
      startListening();
    }
  });

  if (callback) {
    promise.then(
      function () {
        return callback(undefined);
      },
      function (error) {
        return callback(error);
      },
    );
  }

  return promise;
};

exports.waitForFirst = waitForFirst;

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.waitForAll = void 0;

var _utils = require('./utils');

/**
 * Wait for an event or error to be emitted by every emitter
 *
 *  The `callback` is called when:
 *    - the event, or an error, has been emitted by each emitter
 *
 *  The `callback` is called with the error, if one occurred
 *
 * @param   event
 * @param   emitters
 * @param   callback
 */
var waitForAll = function waitForAll(event, emitters, callback) {
  var promise = new Promise(function (resolve, reject) {
    var emitted = new WeakMap();
    var handlers = new WeakMap();

    var startListening = function startListening() {
      emitters.forEach(function (emitter) {
        var boundHandleEvent = handleEvent(emitter);
        var boundHandleError = handleError(emitter);
        emitted.set(emitter, false);
        handlers.set(emitter, {
          boundHandleEvent: boundHandleEvent,
          boundHandleError: boundHandleError,
        });
        (0, _utils.addListener)(emitter, event, boundHandleEvent);
        (0, _utils.addListener)(emitter, 'error', boundHandleError);
      });
    };

    var stopListening = function stopListening() {
      emitters.forEach(function (emitter) {
        var _ref = handlers.get(emitter) || {},
          boundHandleEvent = _ref.boundHandleEvent,
          boundHandleError = _ref.boundHandleError;

        (0, _utils.removeListener)(emitter, event, boundHandleEvent);
        (0, _utils.removeListener)(emitter, 'error', boundHandleError);
      });
    };

    var handleEvent = function handleEvent(emitter) {
      return function () {
        emitted.set(emitter, true);

        if (
          emitters.every(function (emitter) {
            return emitted.get(emitter) === true;
          })
        ) {
          stopListening();
          resolve();
        }
      };
    }; // eslint-disable-next-line @typescript-eslint/no-explicit-any

    var handleError = function handleError(_unused_emitter) {
      return function (error) {
        stopListening();
        reject(error);
      };
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

exports.waitForAll = waitForAll;

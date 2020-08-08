'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.waitForLull = waitForLull;

var _utils = require('./utils');

function waitForLull(event, emitters, periodOrCallback, callback) {
  var period = 100;

  if (typeof periodOrCallback === 'function') {
    callback = periodOrCallback;
  } else if (typeof periodOrCallback !== 'undefined') {
    period = periodOrCallback;
  }

  var promise = new Promise(function (resolve, reject) {
    var timeout = undefined;

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
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(function () {
        stopListening();
        resolve();
      }, period);
    }; // eslint-disable-next-line @typescript-eslint/no-explicit-any

    var handleError = function handleError(error) {
      stopListening();
      reject(error);
    };

    if (emitters.length === 0) {
      resolve();
    } else {
      startListening();
      handleEvent();
    }
  });
  var cb = callback;

  if (cb) {
    promise.then(
      function () {
        return cb(undefined);
      },
      function (error) {
        return cb(error);
      },
    );
  }

  return promise;
}

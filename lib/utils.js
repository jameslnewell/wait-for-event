"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeListener = exports.addListener = void 0;

var addListener = function addListener(emitter, event, listener) {
  if (typeof emitter.on === 'function') {
    emitter.on(event, listener);
  } else if (typeof emitter.addListener === 'function') {
    emitter.addListener(event, listener);
  }
};

exports.addListener = addListener;

var removeListener = function removeListener(emitter, event, listener) {
  if (typeof emitter.off === 'function') {
    emitter.off(event, listener);
  } else if (typeof emitter.removeListener === 'function') {
    emitter.removeListener(event, listener);
  }
};

exports.removeListener = removeListener;
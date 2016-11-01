'use strict';
const EventEmitter = require('events').EventEmitter;
const waitForAll = require('..').waitForAll;

const controls = [
  new EventEmitter(),
  new EventEmitter(),
  new EventEmitter()
];

let allControlsAreValid = true;
waitForAll(
  'validate', controls,
  controlIsValid => allControlsAreValid = allControlsAreValid && controlIsValid,
  error => console.log('validation finished', error, allControlsAreValid)
);

controls[2].emit('validate', true);
controls[0].emit('validate', true);
controls[1].emit('validate', false);


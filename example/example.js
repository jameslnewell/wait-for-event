var
  emitter = require('component-emitter'),
  waitForAll = require('..').waitForAll
;

var
  valid = true,
  controls = [
    new emitter(),
    new emitter(),
    new emitter()
  ]
;

waitForAll(
  'validate',
  controls,
  function (v) {
    valid = valid && v;
    console.log('control is', v, '- all is', valid);
  },
  function () {
    console.log('And the result is: ', valid);
  }
);

controls[2].emit('validate', true);
controls[0].emit('validate', false);
controls[1].emit('validate', true);

console.log('done');

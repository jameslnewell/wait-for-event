'use strict';
const assert = require('assert');
const Emitter = require('events').EventEmitter
const waitForLull = require('../lib/waitForLull');

describe.only('waitForLull()', () => {

  it('should call done() once when the events have stopped emitting', done => {
    let count = 0, interval;

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForLull('exit', [emitter1, emitter2], errors => {
      assert.equal(errors.length, 0);
      assert.equal(count, 100);
      done();
    });

    interval = setInterval(() => {
      ++count;

      if (count === 100) {
        clearInterval(interval);
      }

      emitter1.emit('exit');

    }, 15);

  });


  it('should call done() once when the errors have stopped emitting', done => {
    let count = 0, interval;

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForLull('exit', [emitter1, emitter2], errors => {
      assert.equal(errors.length, 100);
      assert.equal(count, 100);
      done();
    });

    interval = setInterval(() => {
      ++count;

      if (count === 100) {
        clearInterval(interval);
      }

      emitter1.emit('error', new Error());

    }, 15);

  });

});

const assert = require('assert');
const Emitter = require('events').EventEmitter
const waitForFirst = require('../lib/waitForFirst');

describe('waitForFirst()', () => {

  it('should call done() once when the event is emitted more than once', done => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForFirst('exit', [emitter1, emitter2], error => {
      assert.equal(error, null);
      done();
    });

    emitter1.emit('exit');
    emitter1.emit('exit');
    emitter2.emit('exit');

  });

  it('should call done() with an error once when the error is emitted more than once', done => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForFirst('exit', [emitter1, emitter2], error => {
      assert(error instanceof Error);
      done();
    });

    emitter1.emit('error', new Error());
    emitter1.emit('error', new Error());
    emitter2.emit('error', new Error());

  });

  it('should call done() with an error once when an error is emitted first', done => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForFirst('exit', [emitter1, emitter2], error => {
      assert(error instanceof Error);
      done();
    });

    emitter1.emit('error', new Error());
    emitter1.emit('exit');
    emitter2.emit('exit');

  });

  it('should call done() once when an event is emitted first', done => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForFirst('exit', [emitter1, emitter2], error => {
      assert.equal(error, null);
      done();
    });

    emitter1.emit('exit');
    emitter1.emit('error', new Error());
    emitter2.emit('error', new Error());

  });

});

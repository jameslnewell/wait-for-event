const assert = require('assert');
const Emitter = require('events').EventEmitter
const waitForFirst = require('../lib/waitForFirst');

describe('waitForFirst()', () => {

  it('should call done() once when the event is emitted once by one emitter', done => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForFirst('exit', [emitter1, emitter2], error => {
      assert.equal(error, null);
      done();
    });

    emitter1.emit('exit');

  });

  it('should call done() once when the event is emitted twice by one emitter', done => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForFirst('exit', [emitter1, emitter2], error => {
      assert.equal(error, null);
      done();
    });

    emitter1.emit('exit');
    emitter1.emit('exit');

  });

  it('should call done() once when the event is emitted once by both emitters', done => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForFirst('exit', [emitter1, emitter2], error => {
      assert.equal(error, null);
      done();
    });

    emitter1.emit('exit');
    emitter2.emit('exit');

  });

  it('should call done() once with an error when an error is emitted by one emitter', done => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForFirst('exit', [emitter1, emitter2], error => {
      assert(error instanceof Error);
      done();
    });

    emitter1.emit('error', new Error());

  });

  it('should call done() once with an error when an error is emitted twice by one emitter', done => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForFirst('exit', [emitter1, emitter2], error => {
      assert(error instanceof Error);
      done();
    });

    emitter1.on('error', () => {/*do nothing*/});

    emitter1.emit('error', new Error());
    emitter1.emit('error', new Error());

  });

  it('should call done() once with an error when an error is emitted once by both emitters', done => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForFirst('exit', [emitter1, emitter2], error => {
      assert(error instanceof Error);
      done();
    });

    emitter2.on('error', () => {/*do nothing*/});

    emitter1.emit('error', new Error());
    emitter2.emit('error', new Error());

  });

});

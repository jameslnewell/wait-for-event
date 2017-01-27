const assert = require('assert');
const sinon = require('sinon');
const Emitter = require('events').EventEmitter;
const waitForFirst = require('../lib/waitForFirst');

describe('waitForFirst()', () => {

  it('should call callback when there are no emitters', done => {

    waitForFirst('exit', [], error => {
      done(error);
    });

  });

  it('should call callback() once when the event is emitted once by one emitter', done => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForFirst('exit', [emitter1, emitter2], error => {
      assert.equal(error, null);
      done();
    });

    emitter1.emit('exit');

  });

  it('should call callback() once when the event is emitted twice by one emitter', done => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForFirst('exit', [emitter1, emitter2], error => {
      assert.equal(error, null);
      done();
    });

    emitter1.emit('exit');
    emitter1.emit('exit');

  });

  it('should call callback() once when the event is emitted once by both emitters', done => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForFirst('exit', [emitter1, emitter2], error => {
      assert.equal(error, null);
      done();
    });

    emitter1.emit('exit');
    emitter2.emit('exit');

  });

  it('should call callback() once with an error when an error is emitted by one emitter', done => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForFirst('exit', [emitter1, emitter2], error => {
      assert(error instanceof Error);
      done();
    });

    emitter1.emit('error', new Error());

  });

  it('should call callback() once with an error when an error is emitted twice by one emitter', done => {

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

  it('should call callback() once with an error when an error is emitted once by both emitters', done => {

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

  it('it should not call callback() when no events or errors are emitted', () => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();
    const callback = sinon.spy();

    waitForFirst('foo', [emitter1, emitter2], callback);

    assert(callback.notCalled);

  });

});

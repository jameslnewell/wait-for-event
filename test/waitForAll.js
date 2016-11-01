'use strict';
const assert = require('assert');
const sinon = require('sinon');
const Emitter = require('events').EventEmitter;
const waitForAll = require('..').waitForAll;

describe('waitForAll()', () => {

  it('should call done when there are no emitters', (done) => {

    waitForAll('foo', [], () => {
      done();
    });

  });

  it('should call done after all emitters emit the event', (done) => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForAll('foo', [emitter1, emitter2], () => {
      done();
    });

    emitter1.emit('foo');
    emitter2.emit('foo');

  });

  it('should call done when an emitter emits an error', (done) => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForAll('foo', [emitter1, emitter2], () => {
      done();
    });

    emitter1.emit('foo');
    emitter2.emit('error');

  });

  it('should not call done more than once', (done) => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForAll('foo', [emitter1, emitter2], () => {
      done();
    });

    emitter1.emit('foo');
    emitter1.emit('foo');
    emitter2.emit('foo');
    emitter2.emit('foo');

  });

  it('it should not finish when not all the emitters finish', (done) => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForAll('foo', [emitter1, emitter2], () => {
      done();
    });

    emitter1.emit('foo');

  });

  it('it should not finish when not all the emitters finish', (done) => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();

    waitForAll('foo', [emitter1, emitter2], (args) => {console.log(args)}, () => {
      done();
    });

    emitter1.emit('foo');

  });

  it('should call each() for each event emitted', (done) => {

    const emitter1 = new Emitter();
    const emitter2 = new Emitter();
    const each = sinon.spy();

    waitForAll('foo', [emitter1, emitter2], each, () => {
      assert(each.calledTwice);
      done();
    });

    emitter1.emit('foo');
    emitter2.emit('foo');

  });

});
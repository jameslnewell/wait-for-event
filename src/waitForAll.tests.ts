'use strict';
import {EventEmitter} from 'events';
import {waitForAll} from './waitForAll';

const event = 'done';

describe('waitForAll()', () => {
  test('resolves when there are no emitters', async () => {
    await expect(waitForAll(event, [])).resolves.toBeUndefined();
  });

  test('resolves when the event is emitted by each of the emitters', async () => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    setImmediate(() => {
      emitter1.emit(event);
      emitter2.emit(event);
    });
    await expect(
      waitForAll(event, [emitter1, emitter2]),
    ).resolves.toBeUndefined();
  });

  test('rejects when an error event is emitted', async () => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    setImmediate(() => emitter1.emit('error', 'Uh oh!'));
    await expect(waitForAll(event, [emitter1, emitter2])).rejects.toEqual(
      'Uh oh!',
    );
  });

  test('calls the callback when resolved', (done) => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    setImmediate(() => {
      emitter1.emit(event);
      emitter2.emit(event);
    });
    waitForAll(event, [emitter1, emitter2], (error) => {
      expect(error).toBeUndefined();
      done();
    });
  });

  test('calls the callback when rejected', (done) => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    setImmediate(() => emitter1.emit('error', 'Uh oh!'));
    waitForAll(event, [emitter1, emitter2], (error) => {
      expect(error).not.toBeUndefined();
      done();
    });
  });

  test('does not resolve or reject when no event is emitted', (done) => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    const resolved = jest.fn();
    const rejected = jest.fn();
    setTimeout(() => {
      expect(resolved).not.toBeCalled();
      expect(rejected).not.toBeCalled();
      done();
    }, 100);
    waitForAll(event, [emitter1, emitter2]).then(resolved, rejected);
  });
});

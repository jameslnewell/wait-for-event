import {EventEmitter} from 'events';
import {waitForLull} from './waitForLull';

const event = 'done';

describe('waitForLull()', () => {

  test('resolves when there are no emitters', async () => {
    await expect(waitForLull(event, [])).resolves.toBeUndefined();
  });

  test('resolves when no events or errors have been emitted', async () => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    await expect(waitForLull(event, [emitter1, emitter2])).resolves.toBeUndefined();
  });

  test('resolves when events have stopped emitting', async () => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();

    // emit 100 events 
    let count = 0;
    const interval = setInterval(() => {
      ++count;
      if (count === 100) clearInterval(interval);
      emitter1.emit(event);
    }, 1);

    await expect(waitForLull(event, [emitter1, emitter2], 10)).resolves.toBeUndefined();
    // ensure we haven't resolved before the events have stopped emitting
    expect(count).toEqual(100);
  });

  test('rejects when an error event is emitted', async () => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    setImmediate(() => emitter1.emit('error', 'Uh oh!')); 
    await expect(waitForLull(event, [emitter1, emitter2], 10)).rejects.toEqual('Uh oh!');
  });

  test('calls the callback when resolved', done => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    waitForLull(event, [emitter1, emitter2], error => {
      expect(error).toBeUndefined();
      done();
    });
  });

  test('calls the callback when rejected', done => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    setImmediate(() => emitter1.emit('error', 'Uh oh!'));
    waitForLull(event, [emitter1, emitter2], error => {
      expect(error).not.toBeUndefined();
      done();
    });
  });

});

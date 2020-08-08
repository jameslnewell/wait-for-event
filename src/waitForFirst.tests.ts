import {EventEmitter} from 'events';
import {waitForFirst} from './waitForFirst';

const event = 'done';

describe('waitForFirst()', () => {
  test('resolves when there are no emitters', async () => {
    await expect(waitForFirst(event, [])).resolves.toBeUndefined();
  });

  test('resolves when the event is emitted by one emitter', async () => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    setImmediate(() => emitter1.emit(event));
    await expect(
      waitForFirst(event, [emitter1, emitter2]),
    ).resolves.toBeUndefined();
  });

  test('resolves when the event is emitted twice by the same emitter', async () => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    setImmediate(() => {
      emitter1.emit(event);
      emitter1.emit(event);
    });
    await expect(
      waitForFirst(event, [emitter1, emitter2]),
    ).resolves.toBeUndefined();
  });

  test('resolves when the event is emitted once by each emitter', async () => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    setImmediate(() => {
      emitter1.emit(event);
      emitter2.emit(event);
    });
    await expect(
      waitForFirst(event, [emitter1, emitter2]),
    ).resolves.toBeUndefined();
  });

  test('rejects when an error is emitted by one emitter', async () => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    setImmediate(() => emitter1.emit('error', 'Uh oh!'));
    await expect(waitForFirst(event, [emitter1, emitter2])).rejects.toEqual(
      'Uh oh!',
    );
  });

  test('rejects when an error is emitted twice by the same emitter', async () => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    emitter1.on('error', () => {
      /* noop */
    });
    setImmediate(() => {
      emitter1.emit('error', 'Uh oh!');
      emitter1.emit('error', 'Uh oh!');
    });
    await expect(waitForFirst(event, [emitter1, emitter2])).rejects.toEqual(
      'Uh oh!',
    );
  });

  test('rejects when an error is emitted once by each emitter', async () => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    emitter2.on('error', () => {
      /* noop */
    });
    setImmediate(() => {
      emitter1.emit('error', 'Uh oh!');
      emitter2.emit('error', 'Uh oh!');
    });
    await expect(waitForFirst(event, [emitter1, emitter2])).rejects.toEqual(
      'Uh oh!',
    );
  });

  test('calls the callback when resolved', (done) => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    setImmediate(() => {
      emitter1.emit(event);
    });
    waitForFirst(event, [emitter1, emitter2], (error) => {
      expect(error).toBeUndefined();
      done();
    });
  });

  test('calls the callback when rejected', (done) => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    setImmediate(() => emitter1.emit('error', 'Uh oh!'));
    waitForFirst(event, [emitter1, emitter2], (error) => {
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
    waitForFirst(event, [emitter1, emitter2]).then(resolved, rejected);
  });
});

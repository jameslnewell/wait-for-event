import {EventEmitter} from 'events';
import {waitFor} from './waitFor';

const event = 'done';

describe('waitFor()', () => {

  test('resolves when the event is emitted', () => {
    const emitter = new EventEmitter();
    setImmediate(() => emitter.emit(event));
    return expect(waitFor(event, emitter)).resolves.toBeUndefined();
  });

  test('rejects when the error event is emitted', () => {
    const emitter = new EventEmitter();
    setImmediate(() => emitter.emit('error', 'Uh oh!'));
    return expect(waitFor(event, emitter)).rejects.toEqual('Uh oh!');
  });

  test('calls the callback when resolved', (done) => {
    expect.assertions(1);
    const emitter = new EventEmitter();
    setImmediate(() => emitter.emit(event));
    waitFor(event, emitter, (error) => {
      expect(error).toBeUndefined();
      done();
    });
  });

  test('calls the callback when rejected', (done) => {
    expect.assertions(1);
    const emitter = new EventEmitter();
    setImmediate(() => emitter.emit('error', 'Uh oh!'));
    waitFor(event, emitter, (error) => {
      expect(error).toEqual('Uh oh!');
      done();
    });
  });

  test('does not resolve or reject when no event is emitted', done => { 
    const emitter = new EventEmitter();
    const resolved = jest.fn();
    const rejected = jest.fn();
    setTimeout(() => {
      expect(resolved).not.toBeCalled();
      expect(rejected).not.toBeCalled();
      done();
    }, 100);
    waitFor(event, emitter).then(resolved, rejected);
  });

});

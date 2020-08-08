import {addListener, removeListener} from './utils';
import {EventEmitter, Callback} from './types';

/**
 * Wait for an event or error to be emitted by every emitter
 *
 *  The `callback` is called when:
 *    - the event, or an error, has been emitted by each emitter
 *
 *  The `callback` is called with the error, if one occurred
 *
 * @param   event
 * @param   emitters
 * @param   callback
 */
export const waitForAll = <Event extends string>(
  event: Event,
  emitters: EventEmitter<Event>[],
  callback?: Callback,
): Promise<void> => {
  const promise = new Promise<void>((resolve, reject) => {
    const emitted = new WeakMap<EventEmitter<Event>, boolean>();
    const handlers = new WeakMap<
      EventEmitter<Event>,
      {
        boundHandleEvent: () => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        boundHandleError: (error: any) => void;
      }
    >();

    const startListening = (): void => {
      emitters.forEach((emitter) => {
        const boundHandleEvent = handleEvent(emitter);
        const boundHandleError = handleError(emitter);
        emitted.set(emitter, false);
        handlers.set(emitter, {boundHandleEvent, boundHandleError});
        addListener(emitter, event, boundHandleEvent);
        addListener(emitter, 'error', boundHandleError);
      });
    };

    const stopListening = (): void => {
      emitters.forEach((emitter) => {
        const h = handlers.get(emitter);
        if (h) {
          removeListener(emitter, event, h.boundHandleEvent);
          removeListener(emitter, 'error', h.boundHandleError);
        }
      });
    };

    const handleEvent = (emitter: EventEmitter<Event>) => (): void => {
      emitted.set(emitter, true);
      if (emitters.every((emitter) => emitted.get(emitter) === true)) {
        stopListening();
        resolve();
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleError = (_unused_emitter: EventEmitter<Event>) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: any,
    ): void => {
      stopListening();
      reject(error);
    };

    if (emitters.length === 0) {
      resolve();
    } else {
      startListening();
    }
  });

  if (callback) {
    promise.then(
      () => callback(undefined),
      (error) => callback(error),
    );
  }

  return promise;
};

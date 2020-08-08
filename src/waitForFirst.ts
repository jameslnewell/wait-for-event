import {addListener, removeListener} from './utils';
import {EventEmitter, Callback} from './types';

/**
 * Wait for a single event or error to be emitted
 *
 *  The `callback` is called when:
 *    - the next event is emitted OR
 *    - the next error is emitted
 *
 *  The `callback` is called with the error, if one occurred
 *
 * @param   event
 * @param   emitters
 * @param   callback
 */
export const waitForFirst = <Event extends string>(
  event: Event,
  emitters: EventEmitter<Event>[],
  callback?: Callback,
): Promise<void> => {
  const promise = new Promise<void>((resolve, reject) => {
    const startListening = (): void => {
      emitters.forEach((emitter) => {
        addListener(emitter, event, handleEvent);
        addListener(emitter, 'error', handleError);
      });
    };

    const stopListening = (): void => {
      emitters.forEach((emitter) => {
        removeListener(emitter, event, handleEvent);
        removeListener(emitter, 'error', handleError);
      });
    };

    const handleEvent = (): void => {
      stopListening();
      resolve();
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleError = (error: any): void => {
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

import {addListener, removeListener} from './utils';
import {EventEmitter, Callback} from './types';

/**
 * Wait for events and errors to stop being emitted for a period of time
 *
 *  The `callback` is called when:
 *    - no events or errors have been emitted for the specified period of time
 *
 *  The `callback` is called with an array of errors, if any occurred
 *
 * @param   event
 * @param   emitters
 * @param   period
 * @param   callback
 */
export function waitForLull<Event extends string>(
  event: Event,
  emitters: EventEmitter<Event>[],
  callback?: Callback,
): Promise<void>;
export function waitForLull<Event extends string>(
  event: Event,
  emitters: EventEmitter<Event>[],
  period?: number,
  callback?: Callback,
): Promise<void>;
export function waitForLull<Event extends string>(
  event: Event,
  emitters: EventEmitter<Event>[],
  periodOrCallback?: number | Callback,
  callback?: Callback,
): Promise<void> {
  let period = 100;

  if (typeof periodOrCallback === 'function') {
    callback = periodOrCallback;
  } else if (typeof periodOrCallback !== 'undefined') {
    period = periodOrCallback;
  }

  const promise = new Promise<void>((resolve, reject) => {
    let timeout: NodeJS.Timeout | undefined = undefined;

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
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        stopListening();
        resolve();
      }, period);
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
      handleEvent();
    }
  });

  const cb = callback;
  if (cb) {
    promise.then(
      () => cb(undefined),
      (error) => cb(error),
    );
  }

  return promise;
}

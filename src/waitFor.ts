import {Callback, EventEmitter} from './types';
import {addListener, removeListener} from './utils';

export const waitFor = <Event extends string>(
  event: Event,
  emitter: EventEmitter<Event>,
  callback?: Callback,
): Promise<void> => {
  const promise = new Promise<void>((resolve, reject) => {
    const startListening = (): void => {
      addListener(emitter, event, handleEvent);
      addListener(emitter, 'error', handleError);
    };

    const stopListening = (): void => {
      removeListener(emitter, event, handleEvent);
      removeListener(emitter, 'error', handleError);
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

    startListening();
  });

  if (callback) {
    promise.then(
      () => callback(undefined),
      (error) => callback(error),
    );
  }

  return promise;
};

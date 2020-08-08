import {
  EventListener,
  EventEmitterOn,
  EventEmitterOff,
  EventEmitterAddListener,
  EventEmitterRemoveListener,
} from './types';

export const addListener = <Event extends string>(
  emitter: EventEmitterOn<Event> | EventEmitterAddListener<Event>,
  event: Event | 'error',
  listener: EventListener,
): void => {
  if (typeof (emitter as EventEmitterOn<Event>).on === 'function') {
    (emitter as EventEmitterOn<Event>).on(event, listener);
  } else if (
    typeof (emitter as EventEmitterAddListener<Event>).addListener ===
    'function'
  ) {
    (emitter as EventEmitterAddListener<Event>).addListener(event, listener);
  }
};

export const removeListener = <Event extends string>(
  emitter: EventEmitterOff<Event> | EventEmitterRemoveListener<Event>,
  event: Event | 'error',
  listener: EventListener,
): void => {
  if (typeof (emitter as EventEmitterOff<Event>).off === 'function') {
    (emitter as EventEmitterOff<Event>).off(event, listener);
  } else if (
    typeof (emitter as EventEmitterRemoveListener<Event>).removeListener ===
    'function'
  ) {
    (emitter as EventEmitterRemoveListener<Event>).removeListener(
      event,
      listener,
    );
  }
};

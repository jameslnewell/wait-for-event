export interface Callback {
  (error: any): void;
}

export interface EventListener {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): void;
}

export interface EventEmitterOn<Event extends string> {
  on(event: Event | 'error', listener: EventListener): void;
}

export interface EventEmitterOff<Event extends string> {
  off(event: Event | 'error', listener: EventListener): void;
}

export interface EventEmitterAddListener<Event extends string> {
  addListener(event: Event | 'error', listener: EventListener): void;
}

export interface EventEmitterRemoveListener<Event extends string> {
  removeListener(event: Event | 'error', listener: EventListener): void;
}

export type EventEmitter<Event extends string> = (
  | EventEmitterOn<Event>
  | EventEmitterAddListener<Event>
) &
  (EventEmitterOff<Event> | EventEmitterRemoveListener<Event>);

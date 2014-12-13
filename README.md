# wait-for-event

Wait for events to be emitted.

## waitForAll(event, emitters, each, done)

Wait for an event to be emitted on each emitter before calling `done`.

- `event` - the event to listen for
- `emitters` - the event emitters to listen to
- `each` - *optional* - called each time the event is emitted
- `done` - called when the event has been emitted on each emitter
- `options` - *optional* - The options
    - `passMeTheEmitter` - Whether the source emitter is passed as the first argument to the `each` event
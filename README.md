# wait-for-event

Wait for events to be emitted.

## Installation

    npm install --save wait-for-event

## Usage

  

## .waitForAll(event, emitters, [each], done)

Wait for an event to be emitted on each emitter before calling `done`.

- `event : String` - the name of the event to wait for
- `emitters : Array<EventEmitter>` - the event emitters to wait on
- `each : Function` - *optional* - called each time the event is emitted
- `done : Function` - called when the event has been emitted on each emitter
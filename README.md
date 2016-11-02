# wait-for-event

Wait for events to be emitted.

## Installation

    npm install --save wait-for-event

## Usage
  
```js
const EventEmitter = require('events').EventEmitter;
const waitForAll = require('wait-for-event').waitForAll;

const emitters = [
  new EventEmitter(),
  new EventEmitter(),
  new EventEmitter()
];

waitForAll('done', emitters, err => console.log('Yay, all the things are done!'));

emitters[0].emit('done');
emitters[1].emit('done');
emitters[2].emit('done');

```

## API

### .waitForFirst(event, emitters, callback)

Wait for a the first event or error event to be emitted.

- `event : string` - the event to wait for
- `emitters : Array<EventEmitter>` - the event emitters to wait for
- `callback : function` - called when the event has been emitted on each emitter

The `callback` is called when:
- the next event is emitted OR
- the next error event is emitted

The `callback` is called with the error, if one occurred.

### .waitForLull(event, emitters, [period,] callback)

Wait for an event or error event to stop being emitted for a period of time.

- `event : string` - the event to wait for
- `emitters : Array<EventEmitter>` - the event emitters to wait for
- `period : number` - the number of milliseconds to wait for after the most recent event
- `callback : function` - called when the event has been emitted on each emitter

The `callback` is called when:
- no events or error events have been emitted for the specified period of time

The `callback` is called with an array of errors that occurred.

### .waitForAll(event, emitters, callback)

Wait for an event or error event to be emitted by each emitter.

- `event : string` - the event to wait for
- `emitters : Array<EventEmitter>` - the event emitters to wait for
- `callback : function` - called when the event has been emitted on each emitter

The `callback` is called when:
- the event or error event has been emitted by each emitter

The `callback` is called with an array of errors that occurred.

## Change log

# 1.0.0

- **changed:** Removed the `each` callback from `waitForAll()` - you can register your own event handlers on the emitters to achieve the same outcome.
- **changed:** `waitForAll()` now handles `error` events 
- **changed:** Removed support for ComponentJS 
- **added:** `waitForLull()`
- **added:** `waitForLull()`
- **fix:** `waitForAll()` no longer uses the primative method of counting the number of events that have been emitted - this method results in the callback being incorrectly called if an emitter emits the same event more than once. 
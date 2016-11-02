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

Wait for a the first event or error to be emitted.

- `event : string` - the event to wait for
- `emitters : Array<EventEmitter>` - the event emitters to wait for
- `callback : function` - called when the event has been emitted on each emitter

The `callback` is called when:
- the next event is emitted OR
- the next error is emitted

The `callback` is called with the error, if one occurred.

### .waitForLull(event, emitters, callback)

Wait for an event or error to stop being emitted for a period of time.

- `event : string` - the event to wait for
- `emitters : Array<EventEmitter>` - the event emitters to wait for
- `callback : function` - called when the event has been emitted on each emitter

The `callback` is called when:
- no events or errors have been emitted for the specified period of time

The `callback` is called with an array of errors, if any occurred.

### .waitForAll(event, emitters, callback)

Wait for an event or error to be emitted by every emitter.

- `event : string` - the event to wait for
- `emitters : Array<EventEmitter>` - the event emitters to wait for
- `callback : function` - called when the event has been emitted on each emitter

The `callback` is called when:
- the event, or an error, has been emitted by each emitter

The `callback` is called with an array of errors, if any occurred.

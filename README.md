# wait-for-event

![main](https://github.com/jameslnewell/wait-for-event/workflows/main/badge.svg)

Wait for events to be emitted.

- works with [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter)s and [`Stream`](https://nodejs.org/api/stream.html)s in NodeJS
- works with [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)s in the browser (via a bundler)

## Installation

NPM:

```bash
npm install --save wait-for-event
```

Yarn:

```
yarn add wait-for-event
```

## API

### `.waitFor(event, emitter, [callback])`

Wait for the event to be emitted by the emitter.

- `event` - The event name
- `emitter` - The event emitter
- `callback` - An optional callback which is called when the function resolves or rejects

Resolves when the `event` is emitted by the `emitter`. Rejects when the `error` event is emitted by the `emitter`.

#### Example

```js
import {EventEmitter} from 'events';
import {waitFor} from 'wait-for-event';

const emitter = new EventEmitter();

setImmediate(() => emitter.emit('done'));

await waitFor('done', emitter);
```

### `.waitForAll(event, emitters, [callback])`

Wait for the event to be emitted by _each_ of the emitters.

- `event` - The event name
- `emitters` - The event emitters
- `callback` - An optional callback which is called when the function resolves or rejects

Resolves when `emitters` is an empty array. Resolves when the `event` is emitted by each of the `emitters`. Rejects when the `error` event is emitted by any of the `emitters`.

#### Example

```js
import {EventEmitter} from 'events';
import {waitForAll} from 'wait-for-event';

const emitters = [new EventEmitter(), new EventEmitter(), new EventEmitter()];

setImmediate(() => {
  emitters[0].emit('done');
  emitters[1].emit('done');
  emitters[2].emit('done');
});

await waitForAll('done', emitters);
```

### .waitForFirst(event, emitters, callback)

Wait for the event to be emitted by _any_ of the emitters.

- `event` - The event name
- `emitters` - The event emitters
- `callback` - An optional callback which is called when the function resolves or rejects

Resolves when `emitters` is an empty array. Resolves when the `event` is emitted by _any_ of the `emitters`. Rejects when the `error` event is emitted by _any_ of the `emitters`.

```js
import {EventEmitter} from 'events';
import {waitForFirst} from 'wait-for-event';

const emitters = [new EventEmitter(), new EventEmitter(), new EventEmitter()];

setImmediate(() => {
  emitters[1].emit('done');
});

await waitForFirst('done', emitters);
```

### `.waitForLull(event, emitters, [period,] [callback])`

Wait for the event to stop being emitted by _any_ of the emitters for a period of time.

- `event` - The event name
- `emitters` - The event emitters
- `period` - The period of time the function will wait for no events to be emitted
- `callback` - An optional callback which is called when the function resolves or rejects

Resolves when the period has elapsed and no events have been emitted. Rejects when the `error` event is emitted by _any_ of the `emitters`.

```js
import {EventEmitter} from 'events';
import {waitForLull} from 'wait-for-event';

const emitters = [new EventEmitter(), new EventEmitter(), new EventEmitter()];

setImmediate(() => {
  emitters[0].emit('msg');
  emitters[1].emit('msg');
  emitters[2].emit('msg');
  emitters[2].emit('msg');
  emitters[3].emit('msg');
});

await waitForLull('msg', emitters, 3000);
```

## Change log

# 2.0.0

- **changed:** The handling of error events has changed. If any emmitter emits an error event then the method rejects immediately with the error
- **changed:** Rewritten in Typescript
- **added:** Added support for `Promise`s

# 1.0.0

- **changed:** Removed the `each` callback from `waitForAll()` - you can register your own event handlers on the emitters to achieve the same outcome.
- **changed:** `waitForAll()` now handles `error` events
- **changed:** Removed support for ComponentJS
- **added:** `waitForFirst()`
- **added:** `waitForLull()`
- **fix:** `waitForAll()` no longer uses the primative method of counting the number of events that have been emitted - this method results in the callback being incorrectly called if an emitter emits the same event more than once.

## License

Copyright 2014 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

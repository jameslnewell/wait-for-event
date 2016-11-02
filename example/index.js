const EventEmitter = require('events').EventEmitter;
const waitForAll = require('..').waitForAll;

const emitters = [
  new EventEmitter(),
  new EventEmitter(),
  new EventEmitter()
];

waitForAll('done', emitters, err => console.log('Yay, all the things are done!'));

emitters[0].emit('done');
emitters[1].emit('done');
emitters[2].emit('done');

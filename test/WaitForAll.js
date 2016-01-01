var assert      = require('assert');
var WaitForAll  = typeof(process) !== 'undefined' ? require('../lib/WaitForAll') : require('wait-for-event/lib/WaitForAll.js');
/**
 * Create an emitter
 * @returns {EventEmitter}
 */
function emitter() {
	var emitter;
	if (typeof(process) !== 'undefined' && process.exit) {
		emitter = new (require('events').EventEmitter);
	} else {
		emitter = new (require('emitter'));
	}
	return emitter;
}

describe('WaitForAll', function() {

	describe('constructor', function() {

		it('should create a new instance', function () {
			var wfa = new WaitForAll();
			assert(wfa instanceof WaitForAll);
		});

		it('should create a new instance with emitter methods mixed in', function () {
			var wfa = new WaitForAll();
			assert(typeof(wfa.emit), 'function');
			assert(typeof(wfa.once), 'function');
		});

	});

	describe('.wait()', function() {

		it('should not wait when no emitters are passed', function(done) {
			var start = new Date(), end;

			var wfa = new WaitForAll();
			wfa.on('done', function() {
				end = new Date();
				assert(end-start < 150);//browser is slower to clear the stack
				done();
			});
			wfa.wait();

		});

		it('should emit `done` when all emitters emit the `done` event', function(done) {

			var emitter1 = emitter();
			var emitter2 = emitter();

			var wfa = new WaitForAll({
				emitters: [emitter1, emitter2]
			});

			wfa.on('done', function() {
				done();
			});

			wfa.wait();

			emitter1.emit('done');
			emitter2.emit('done');

		});

		it('should not emit `done` when not all emitters emit the `done` event', function() {
			var called = false;

			var emitter1 = emitter();
			var emitter2 = emitter();

			var wfa = new WaitForAll({
				emitters: [emitter1, emitter2]
			});

			wfa.on('done', function() {
				called = true;
				throw new Error();
			});

			wfa.wait();

			emitter1.emit('done');
			emitter1.emit('done');

			assert(called === false);
		});

		it('should emit `each` event for each emitter that emits the `done` event', function(done) {
			var called = 0;

			var emitter1 = emitter();
			var emitter2 = emitter();

			var wfa = new WaitForAll({
				emitters: [emitter1, emitter2]
			});

			wfa.on('each', function() {
				++called;
			});

			wfa.on('done', function() {
				assert.equal(called, 2);
				done();
			});

			wfa.wait();

			emitter1.emit('done');
			emitter2.emit('done');

		});

		it('should emit `each` event for each emitter that emits the `done` event', function(done) {
			var called = 0;

			var emitter1 = emitter();
			var emitter2 = emitter();

			var wfa = new WaitForAll({
				emitters: [emitter1, emitter2]
			});

			wfa.on('each', function() {
				++called;
			});

			wfa.on('done', function() {
				assert.equal(called, 2);
				done();
			});

			wfa.wait();

			emitter1.emit('done');
			emitter2.emit('done');

		});

		it('should emit `each` event with the emitter for each emitter that emits the `done` event', function(done) {
			var called = 0;

			var emitter1 = emitter();
			var emitter2 = emitter();

			var wfa = new WaitForAll({
				emitters: [emitter1, emitter2],
				passMeTheEmitter: true
			});

			wfa.on('each', function(emitter) {
				++called;
				assert(emitter === emitter1 || emitter2);
			});

			wfa.on('done', function() {
				assert.equal(called, 2);
				done();
			});

			wfa.wait();

			emitter1.emit('done');
			emitter2.emit('done');

		});

		it('should pass the emitter when I use the `passMeTheEmitter` option', function(done) {

			var emitter1 = emitter();
			var emitter2 = emitter();

			var wfa = new WaitForAll({
				emitters:         [emitter1, emitter2],
				passMeTheEmitter: true
			});

			wfa.once('each', function(emitter) {

				assert.equal(emitter, emitter1);

				wfa.once('each', function(emitter) {
					assert.equal(emitter, emitter2);
				});

			});

			wfa.once('done', function() {
				done();
			});

			wfa.wait();
			emitter1.emit('done');
			emitter2.emit('done');

		});

	});

	describe('.stopListening()', function() {

		it('should remove event listeners so emitter events do not trigger events again', function() {
			var called = 0;

			var emitter1 = emitter();

			var wfa = new WaitForAll({
				emitters: [emitter1]
			});

			wfa.on('each', function() {
				++called;
			});

			wfa.on('done', function() {
				throw new Error();
			});

			wfa.wait();
			wfa.stopListening();

			emitter1.emit('done');

		});

	})

});

var emitter = require('component-emitter');

/**
 * Wait for an event
 * @constructor
 * @param   {Object}  [object]
 * @param   {String}  [object.event]              The event to wait for
 * @param   {Array}   [object.emitters]           The emitters to wait for
 * @param   {Boolean} [object.passMeTheEmitter]   Whether the events should be raised with the emitter that triggered the event
 */
function WaitFor(options) {
	this.event              = options && options.event || 'done';
	this.emitters           = options && options.emitters || [];
	this.passMeTheEmitter   = options && options.passMeTheEmitter || false;
}
emitter(WaitFor.prototype);

/**
 * Start listening for the event on the emitters
 * @protected
 * @returns {WaitFor}
 */
WaitFor.prototype.startListening = function() {
	var self = this;
	function emitTheEachEventAndCheckIfWeCanStopWaiting() {

		//emit the `each` event
		var args = Array.prototype.slice.call(arguments, 0);
		if (self.passMeTheEmitter) args.unshift(this); //prepend the source emitter to the event arguments
		args.unshift('each'); //prepend the event name to the event arguments
		self.emit.apply(self, args);

		//call the `done` method
		var args = Array.prototype.slice.call(arguments, 0);
		if (self.passMeTheEmitter) args.unshift(this); //prepend the source emitter to the event arguments
		var finished = self.done.apply(self, args);

		if (finished) {
			self.stopListening();
			self.emit('done');
		}

	}

	for (var i=0; i<this.emitters.length; ++i) {
		this.emitters[i].once(
			this.event,
			this.emitTheEachEventAndCheckIfWeCanStopWaiting = emitTheEachEventAndCheckIfWeCanStopWaiting
		);
	}

	return this;
};

/**
 * Stop listening for the event on the emitter
 * @protected
 * @returns {WaitFor}
 */
WaitFor.prototype.stopListening = function() {
	for (var i=0; i<this.emitters.length; ++i) {
		var emitter = this.emitters[i];
		var emitterOffMethod = emitter.removeListener ? emitter.removeListener : emitter.off;
		emitterOffMethod.call(emitter, this.event, this.emitTheEachEventAndCheckIfWeCanStopWaiting); //FIXME:

	}
	return this;
};

/**
 * Check if we've waited long enough when an emitter emits the event
 * @protected
 */
WaitFor.prototype.done = function() {
};

/**
 * Wait for the result
 * @returns {WaitFor}
 */
WaitFor.prototype.wait = function() {
	
	if (this.emitters.length === 0) {
		var self = this;
		setTimeout(function() {
			self.emit('done'); //no emitters so emit `done` immediately
		}, 0);
	} else {
		this.startListening();  //wait for the emitters to emit events
	}
	
	return this;
};

module.exports = WaitFor;

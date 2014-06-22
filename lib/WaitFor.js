var emitter = require('emitter');

/**
 * Waits for an event
 * @constructor
 * @param   {Object} [object]
 * @param   {Object} [object.event]
 * @param   {Array}  [object.emitters]
 */
function WaitFor(options) {
	this.event      = options && options.event || 'done';
	this.emitters   = options && options.emitters || [];
}
emitter(WaitFor.prototype);

/**
 * Start listening for the event on the emitters
 * @protected
 * @returns {WaitFor}
 */
WaitFor.prototype.startListening = function() {
	for (var i=0; i<this.emitters.length; ++i) {
		this.emitters[i].once(this.event, this.done.bind(this));
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
		this.emitters[i].off(this.event, this.done.bind(this));
	}
	return this;
};

/**
 * Handle when an emitter fires the event
 * @protected
 */
WaitFor.prototype.done = function() {
};

/**
 * Wait for the result
 * @returns {WaitFor}
 */
WaitFor.prototype.wait = function() {
	this.startListening();
	return this;
};

module.exports = WaitFor;
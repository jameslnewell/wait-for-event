var WaitForAll = require('./lib/WaitForAll');

module.exports = {

	WaitForAll: WaitForAll,

	/**
	 * Wait for the event to fire on all emitters
	 * @param {String}      event                       The event
	 * @param {Emitter}     emitters                    The emitters
	 * @param {Function}    [each]                      Called when the event fires on a single emitter
	 * @param {Function}    done                        Called when the event has fired on all emitters
	 * @param {Object}      options                     The options
	 * @param {Object}      options.passMeTheEmitter    Whether the source emitter is passed as the first argument to the `each` event
	 */
	waitForAll: function(event, emitters, each, done, options) {
		options = options || {};

		options.event     = event;
		options.emitters  = emitters;

		var wait = new WaitForAll(options);

		if (arguments.length >= 4) {
			wait.on('each', each);
			wait.on('done', done);
		} else {
			wait.on('done', each);
		}

		wait.wait();
	}

};
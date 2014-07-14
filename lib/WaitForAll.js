var extend = require('extend');
var WaitFor = require('./WaitFor');

module.exports = extend(WaitFor, {

	construct: function() {
		WaitFor.apply(this, arguments);
		this.tick = 0;
	},

	done: function() {
		++this.tick;

		//emit the `each` event
		var args = Array.prototype.slice.call(arguments, 0);
		args.unshift('each');
		this.emit.apply(this, args);

		//check if we're `done`
		if (this.tick === this.emitters.length) {
			this.tick = 0;
			this.stopListening();
			this.emit('done');
		}

	}

});
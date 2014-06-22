/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("component~emitter@1.1.3", function (exports, module) {

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});

require.register("digitaledgeit~js-extend@0.1.0", function (exports, module) {
/**
 * Create a new class extending from a parent class
 * @param   {Function}  parentClass       The parent class which will be extended
 * @param   {Object}    [childPrototype]  The child prototype which will be copied
 * @returns {Child}
 */
module.exports = function(parentClass, childPrototype) {

  //create the child class
  function Child() {
    if (childPrototype && childPrototype.construct) {
      childPrototype.construct.apply(this, arguments);
    } else {
      parentClass.prototype.constructor.apply(this, arguments);
    }
  }

  //extend the parent class
  if (Object.create) {
    Child.prototype = Object.create(parentClass.prototype);
  } else {
    Child.prototype = new parentClass;
  }
  Child.prototype.constructor = parentClass;

  //copy the prototype methods into the child class
  if (childPrototype) {
    for (var key in childPrototype) {
      if (Object.prototype.hasOwnProperty.call(childPrototype, key)) {
        Child.prototype[key] = childPrototype[key];
      }
    }
  }

  return Child;
}
});

require.register("wait-for-event", function (exports, module) {
var WaitForAll = require("wait-for-event/lib/WaitForAll.js");

module.exports = {

	WaitForAll: WaitForAll,

	/**
	 * Wait for the event to fire on all emitters
	 * @param {String}      event       The event
	 * @param {Emitter}     emitters    The emitters
	 * @param {Function}    [each]      Called when the event fires on a single emitter
	 * @param {Function}    done        Called when the event has fired on all emitters
	 */
	waitForAll: function(event, emitters, each, done) {

		var wait = new WaitForAll({
			event:      event,
			emitters:   emitters
		});

		if (arguments.length === 4) {
			wait.on('each', each);
			wait.on('done', done);
		} else {
			wait.on('done', each);
		}

		wait.wait();
	}

};
});

require.register("wait-for-event/lib/WaitFor.js", function (exports, module) {
var emitter = require("component~emitter@1.1.3");

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
});

require.register("wait-for-event/lib/WaitForAll.js", function (exports, module) {
var extend = require("digitaledgeit~js-extend@0.1.0");
var WaitFor = require("wait-for-event/lib/WaitFor.js");

module.exports = extend(WaitFor, {

	construct: function() {
		WaitFor.apply(this, arguments);
		this.tick = 0;
	},

	done: function() {
		++this.tick;

		var args = Array.prototype.slice.call(arguments, 0);
		args.unshift('each');
		this.emit.apply(this, args);

		if (this.tick === this.emitters.length) {
			this.tick = 0;
			this.stopListening();
			this.emit('done');
		}
	}

});
});

require("wait-for-event")

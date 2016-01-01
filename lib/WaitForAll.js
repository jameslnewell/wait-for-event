var extend = require('extend-class');
var WaitFor = require('./WaitFor');

/**
 * Wait for all
 * @class
 * @extends {WaitFor}
 */
module.exports = extend(WaitFor, /** @lends {WaitForAll} */{

  construct: function () {
    WaitFor.apply(this, arguments);

    /**
     * The number of emitters which have finished
     * @private
     * @type  {Number}
     */
    this.finished = 0;

  },

  done: function () {
    ++this.finished;

    //check if we're `done`
    if (this.finished === this.emitters.length) {
      this.finished = 0;
      return true;
    } else {
      return false;
    }

  }

});
var env = process.env.NODE_ENV || 'development';
var http = require('http');

module.exports = function error(opts) {
  opts = opts || {};
  /**
   * defaultSettings for hander error
   */
  var defaultSettings = {
    text: function (err) {
      if ('development' == env) return err.message;
      else if (err.expose) return err.message;
      else throw err;
    },
    json: function (err) {
      if ('development' == env) return { error: err.message };
      else if (err.expose) return { error: err.message };
      else return { error: http.STATUS_CODES[this.status] };
    }
  };

  return function *error(next) {
    try {
      yield* next;
      if (404 == this.response.status && !this.response.body) this.throw(404);
    } catch (err) {
      if (opts.debug) console.error(err.stack);
      if (opts.alias && ('object' === typeof opts.alias)) {
        this.status = opts.alias[err.status] || 500;
      } else {
        this.status = err.status || 500;
      }

      // application
      this.app.emit('error', err, this);

      if (opts.all) {
        this.body = opts.all.call(this, err) || this.body;
        return;
      }

      var acceptType = this.accepts('json', 'text');
      if (acceptType) {
        this.body = (opts[acceptType] || defaultSettings[acceptType]).call(this, err) || this.body;
      }
    }
  }
}
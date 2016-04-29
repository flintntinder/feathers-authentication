'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'hashPassword\' hook should only be used as a \'before\' hook.');
    }

    options = Object.assign({}, defaults, hook.app.get('auth'), options);

    var crypto = options.bcrypt || _bcryptjs2.default;

    if (hook.data === undefined) {
      return hook;
    }

    var password = hook.data[options.passwordField];

    if (password === undefined) {
      if (!hook.params.provider) {
        return hook;
      }

      throw new _feathersErrors2.default.BadRequest('\'' + options.passwordField + '\' field is missing.');
    }

    return new Promise(function (resolve, reject) {
      crypto.genSalt(10, function (error, salt) {
        crypto.hash(password, salt, function (error, hash) {
          if (error) {
            return reject(error);
          }

          hook.data[options.passwordField] = hash;
          resolve(hook);
        });
      });
    });
  };
};

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = { passwordField: 'password' };

module.exports = exports['default'];
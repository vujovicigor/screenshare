/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 26);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

var toSJISFunction
var CODEWORDS_COUNT = [
  0, // Not used
  26, 44, 70, 100, 134, 172, 196, 242, 292, 346,
  404, 466, 532, 581, 655, 733, 815, 901, 991, 1085,
  1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185,
  2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706
]

/**
 * Returns the QR Code size for the specified version
 *
 * @param  {Number} version QR Code version
 * @return {Number}         size of QR code
 */
exports.getSymbolSize = function getSymbolSize (version) {
  if (!version) throw new Error('"version" cannot be null or undefined')
  if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40')
  return version * 4 + 17
}

/**
 * Returns the total number of codewords used to store data and EC information.
 *
 * @param  {Number} version QR Code version
 * @return {Number}         Data length in bits
 */
exports.getSymbolTotalCodewords = function getSymbolTotalCodewords (version) {
  return CODEWORDS_COUNT[version]
}

/**
 * Encode data with Bose-Chaudhuri-Hocquenghem
 *
 * @param  {Number} data Value to encode
 * @return {Number}      Encoded value
 */
exports.getBCHDigit = function (data) {
  var digit = 0

  while (data !== 0) {
    digit++
    data >>>= 1
  }

  return digit
}

exports.setToSJISFunction = function setToSJISFunction (f) {
  if (typeof f !== 'function') {
    throw new Error('"toSJISFunc" is not a valid function.')
  }

  toSJISFunction = f
}

exports.isKanjiModeEnabled = function () {
  return typeof toSJISFunction !== 'undefined'
}

exports.toSJIS = function toSJIS (kanji) {
  return toSJISFunction(kanji)
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var Version = __webpack_require__(23)
var Regex = __webpack_require__(24)

/**
 * Numeric mode encodes data from the decimal digit set (0 - 9)
 * (byte values 30HEX to 39HEX).
 * Normally, 3 data characters are represented by 10 bits.
 *
 * @type {Object}
 */
exports.NUMERIC = {
  id: 'Numeric',
  bit: 1 << 0,
  ccBits: [10, 12, 14]
}

/**
 * Alphanumeric mode encodes data from a set of 45 characters,
 * i.e. 10 numeric digits (0 - 9),
 *      26 alphabetic characters (A - Z),
 *   and 9 symbols (SP, $, %, *, +, -, ., /, :).
 * Normally, two input characters are represented by 11 bits.
 *
 * @type {Object}
 */
exports.ALPHANUMERIC = {
  id: 'Alphanumeric',
  bit: 1 << 1,
  ccBits: [9, 11, 13]
}

/**
 * In byte mode, data is encoded at 8 bits per character.
 *
 * @type {Object}
 */
exports.BYTE = {
  id: 'Byte',
  bit: 1 << 2,
  ccBits: [8, 16, 16]
}

/**
 * The Kanji mode efficiently encodes Kanji characters in accordance with
 * the Shift JIS system based on JIS X 0208.
 * The Shift JIS values are shifted from the JIS X 0208 values.
 * JIS X 0208 gives details of the shift coded representation.
 * Each two-byte character value is compacted to a 13-bit binary codeword.
 *
 * @type {Object}
 */
exports.KANJI = {
  id: 'Kanji',
  bit: 1 << 3,
  ccBits: [8, 10, 12]
}

/**
 * Mixed mode will contain a sequences of data in a combination of any of
 * the modes described above
 *
 * @type {Object}
 */
exports.MIXED = {
  bit: -1
}

/**
 * Returns the number of bits needed to store the data length
 * according to QR Code specifications.
 *
 * @param  {Mode}   mode    Data mode
 * @param  {Number} version QR Code version
 * @return {Number}         Number of bits
 */
exports.getCharCountIndicator = function getCharCountIndicator (mode, version) {
  if (!mode.ccBits) throw new Error('Invalid mode: ' + mode)

  if (!Version.isValid(version)) {
    throw new Error('Invalid version: ' + version)
  }

  if (version >= 1 && version < 10) return mode.ccBits[0]
  else if (version < 27) return mode.ccBits[1]
  return mode.ccBits[2]
}

/**
 * Returns the most efficient mode to store the specified data
 *
 * @param  {String} dataStr Input data string
 * @return {Mode}           Best mode
 */
exports.getBestModeForData = function getBestModeForData (dataStr) {
  if (Regex.testNumeric(dataStr)) return exports.NUMERIC
  else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC
  else if (Regex.testKanji(dataStr)) return exports.KANJI
  else return exports.BYTE
}

/**
 * Return mode name as string
 *
 * @param {Mode} mode Mode object
 * @returns {String}  Mode name
 */
exports.toString = function toString (mode) {
  if (mode && mode.id) return mode.id
  throw new Error('Invalid mode')
}

/**
 * Check if input param is a valid mode object
 *
 * @param   {Mode}    mode Mode object
 * @returns {Boolean} True if valid mode, false otherwise
 */
exports.isValid = function isValid (mode) {
  return mode && mode.bit && mode.ccBits
}

/**
 * Get mode object from its name
 *
 * @param   {String} string Mode name
 * @returns {Mode}          Mode object
 */
function fromString (string) {
  if (typeof string !== 'string') {
    throw new Error('Param is not a string')
  }

  var lcStr = string.toLowerCase()

  switch (lcStr) {
    case 'numeric':
      return exports.NUMERIC
    case 'alphanumeric':
      return exports.ALPHANUMERIC
    case 'kanji':
      return exports.KANJI
    case 'byte':
      return exports.BYTE
    default:
      throw new Error('Unknown mode: ' + string)
  }
}

/**
 * Returns mode from a value.
 * If value is not a valid mode, returns defaultValue
 *
 * @param  {Mode|String} value        Encoding mode
 * @param  {Mode}        defaultValue Fallback value
 * @return {Mode}                     Encoding mode
 */
exports.from = function from (value, defaultValue) {
  if (exports.isValid(value)) {
    return value
  }

  try {
    return fromString(value)
  } catch (e) {
    return defaultValue
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 4 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.



/*<replacement>*/

var pna = __webpack_require__(11);
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = __webpack_require__(7);
util.inherits = __webpack_require__(4);
/*</replacement>*/

var Readable = __webpack_require__(15);
var Writable = __webpack_require__(19);

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  pna.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  pna.nextTick(cb, err);
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Implementation of a subset of node.js Buffer methods for the browser.
 * Based on https://github.com/feross/buffer
 */

/* eslint-disable no-proto */



var isArray = __webpack_require__(13)

function typedArraySupport () {
  // Can typed array instances be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

var K_MAX_LENGTH = Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff

function Buffer (arg, offset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, offset, length)
  }

  if (typeof arg === 'number') {
    return allocUnsafe(this, arg)
  }

  return from(this, arg, offset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array

  // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true,
      enumerable: false,
      writable: false
    })
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

function createBuffer (that, length) {
  var buf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    buf = new Uint8Array(length)
    buf.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    buf = that
    if (buf === null) {
      buf = new Buffer(length)
    }
    buf.length = length
  }

  return buf
}

function allocUnsafe (that, size) {
  var buf = createBuffer(that, size < 0 ? 0 : checked(size) | 0)

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      buf[i] = 0
    }
  }

  return buf
}

function fromString (that, string) {
  var length = byteLength(string) | 0
  var buf = createBuffer(that, length)

  var actual = buf.write(string)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (that, array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    buf.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    buf = fromArrayLike(that, buf)
  }

  return buf
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(that, len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function byteLength (string) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  return utf8ToBytes(string).length
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function from (that, value, offset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, offset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, offset)
  }

  return fromObject(that, value)
}

Buffer.prototype.write = function write (string, offset, length) {
  // Buffer#write(string)
  if (offset === undefined) {
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
    } else {
      length = undefined
    }
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  return utf8Write(this, string, offset, length)
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    // Return an augmented `Uint8Array` instance
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

Buffer.prototype.fill = function fill (val, start, end) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return createBuffer(null, 0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = allocUnsafe(null, length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

Buffer.byteLength = byteLength

Buffer.prototype._isBuffer = true
Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

module.exports = Buffer


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9).Buffer))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*
	Ractive.js v0.8.14
	Tue May 23 2017 18:45:38 GMT+0000 (UTC) - commit 9cf380262b870f4fd676e2fd42accf8be9a22c5b

	http://ractivejs.org
	http://twitter.com/RactiveJS

	Released under the MIT License.
*/


(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	((function() { var current = global.Ractive; var next = factory(); next.noConflict = function() { global.Ractive = current; return next; }; return global.Ractive = next; })());
}(this, function () { 'use strict';

	var defaults = {
		// render placement:
		el:                     void 0,
		append:				    false,

		// template:
		template:               null,

		// parse:
		delimiters:             [ '{{', '}}' ],
		tripleDelimiters:       [ '{{{', '}}}' ],
		staticDelimiters:       [ '[[', ']]' ],
		staticTripleDelimiters: [ '[[[', ']]]' ],
		csp: 					true,
		interpolate:            false,
		preserveWhitespace:     false,
		sanitize:               false,
		stripComments:          true,
		contextLines:           0,

		// data & binding:
		data:                   {},
		computed:               {},
		magic:                  false,
		modifyArrays:           false,
		adapt:                  [],
		isolated:               false,
		twoway:                 true,
		lazy:                   false,

		// transitions:
		noIntro:                false,
		transitionsEnabled:     true,
		complete:               void 0,

		// css:
		css:                    null,
		noCssTransform:         false
	};

	// These are a subset of the easing equations found at
	// https://raw.github.com/danro/easing-js - license info
	// follows:

	// --------------------------------------------------
	// easing.js v0.5.4
	// Generic set of easing functions with AMD support
	// https://github.com/danro/easing-js
	// This code may be freely distributed under the MIT license
	// http://danro.mit-license.org/
	// --------------------------------------------------
	// All functions adapted from Thomas Fuchs & Jeremy Kahn
	// Easing Equations (c) 2003 Robert Penner, BSD license
	// https://raw.github.com/danro/easing-js/master/LICENSE
	// --------------------------------------------------

	// In that library, the functions named easeIn, easeOut, and
	// easeInOut below are named easeInCubic, easeOutCubic, and
	// (you guessed it) easeInOutCubic.
	//
	// You can add additional easing functions to this list, and they
	// will be globally available.


	var easing = {
		linear: function ( pos ) { return pos; },
		easeIn: function ( pos ) { return Math.pow( pos, 3 ); },
		easeOut: function ( pos ) { return ( Math.pow( ( pos - 1 ), 3 ) + 1 ); },
		easeInOut: function ( pos ) {
			if ( ( pos /= 0.5 ) < 1 ) { return ( 0.5 * Math.pow( pos, 3 ) ); }
			return ( 0.5 * ( Math.pow( ( pos - 2 ), 3 ) + 2 ) );
		}
	};

	var legacy = null;

	/*global console, navigator */

	var win = typeof window !== 'undefined' ? window : null;
	var doc = win ? document : null;

	var isClient = !!doc;
	var isJsdom = ( typeof navigator !== 'undefined' && /jsDom/.test( navigator.appName ) );
	var hasConsole = ( typeof console !== 'undefined' && typeof console.warn === 'function' && typeof console.warn.apply === 'function' );

	var magicSupported;
	try {
		Object.defineProperty({}, 'test', { value: 0 });
		magicSupported = true;
	} catch ( e ) {
		magicSupported = false;
	}

	var svg = doc ?
		doc.implementation.hasFeature( 'http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1' ) :
		false;

	var vendors = [ 'o', 'ms', 'moz', 'webkit' ];

	var html   = 'http://www.w3.org/1999/xhtml';
	var mathml = 'http://www.w3.org/1998/Math/MathML';
	var svg$1    = 'http://www.w3.org/2000/svg';
	var xlink  = 'http://www.w3.org/1999/xlink';
	var xml    = 'http://www.w3.org/XML/1998/namespace';
	var xmlns  = 'http://www.w3.org/2000/xmlns';

	var namespaces = { html: html, mathml: mathml, svg: svg$1, xlink: xlink, xml: xml, xmlns: xmlns };

	var createElement;
	var matches;
	var div;
	var methodNames;
	var unprefixed;
	var prefixed;
	var i;
	var j;
	var makeFunction;
	// Test for SVG support
	if ( !svg ) {
		createElement = function ( type, ns, extend ) {
			if ( ns && ns !== html ) {
				throw 'This browser does not support namespaces other than http://www.w3.org/1999/xhtml. The most likely cause of this error is that you\'re trying to render SVG in an older browser. See http://docs.ractivejs.org/latest/svg-and-older-browsers for more information';
			}

			return extend ?
				doc.createElement( type, extend ) :
				doc.createElement( type );
		};
	} else {
		createElement = function ( type, ns, extend ) {
			if ( !ns || ns === html ) {
				return extend ?
					doc.createElement( type, extend ) :
					doc.createElement( type );
			}

			return extend ?
				doc.createElementNS( ns, type, extend ) :
				doc.createElementNS( ns, type );
		};
	}

	function createDocumentFragment () {
		return doc.createDocumentFragment();
	}

	function getElement ( input ) {
		var output;

		if ( !input || typeof input === 'boolean' ) { return; }

		if ( !win || !doc || !input ) {
			return null;
		}

		// We already have a DOM node - no work to do. (Duck typing alert!)
		if ( input.nodeType ) {
			return input;
		}

		// Get node from string
		if ( typeof input === 'string' ) {
			// try ID first
			output = doc.getElementById( input );

			// then as selector, if possible
			if ( !output && doc.querySelector ) {
				output = doc.querySelector( input );
			}

			// did it work?
			if ( output && output.nodeType ) {
				return output;
			}
		}

		// If we've been given a collection (jQuery, Zepto etc), extract the first item
		if ( input[0] && input[0].nodeType ) {
			return input[0];
		}

		return null;
	}

	if ( !isClient ) {
		matches = null;
	} else {
		div = createElement( 'div' );
		methodNames = [ 'matches', 'matchesSelector' ];

		makeFunction = function ( methodName ) {
			return function ( node, selector ) {
				return node[ methodName ]( selector );
			};
		};

		i = methodNames.length;

		while ( i-- && !matches ) {
			unprefixed = methodNames[i];

			if ( div[ unprefixed ] ) {
				matches = makeFunction( unprefixed );
			} else {
				j = vendors.length;
				while ( j-- ) {
					prefixed = vendors[i] + unprefixed.substr( 0, 1 ).toUpperCase() + unprefixed.substring( 1 );

					if ( div[ prefixed ] ) {
						matches = makeFunction( prefixed );
						break;
					}
				}
			}
		}

		// IE8...
		if ( !matches ) {
			matches = function ( node, selector ) {
				var nodes, parentNode, i;

				parentNode = node.parentNode;

				if ( !parentNode ) {
					// empty dummy <div>
					div.innerHTML = '';

					parentNode = div;
					node = node.cloneNode();

					div.appendChild( node );
				}

				nodes = parentNode.querySelectorAll( selector );

				i = nodes.length;
				while ( i-- ) {
					if ( nodes[i] === node ) {
						return true;
					}
				}

				return false;
			};
		}
	}

	function detachNode ( node ) {
		if ( node && typeof node.parentNode !== 'unknown' && node.parentNode ) {
			node.parentNode.removeChild( node );
		}

		return node;
	}

	function safeToStringValue ( value ) {
		return ( value == null || !value.toString ) ? '' : '' + value;
	}

	function safeAttributeString ( string ) {
		return safeToStringValue( string )
			.replace( /&/g, '&amp;' )
			.replace( /"/g, '&quot;' )
			.replace( /'/g, '&#39;' );
	}

	var decamel = /[A-Z]/g;
	function decamelize ( string ) {
		return string.replace( decamel, function ( s ) { return ("-" + (s.toLowerCase())); } );
	}

	var create;
	var defineProperty;
	var defineProperties;
	try {
		Object.defineProperty({}, 'test', { get: function() {}, set: function() {} });

		if ( doc ) {
			Object.defineProperty( createElement( 'div' ), 'test', { value: 0 });
		}

		defineProperty = Object.defineProperty;
	} catch ( err ) {
		// Object.defineProperty doesn't exist, or we're in IE8 where you can
		// only use it with DOM objects (what were you smoking, MSFT?)
		defineProperty = function ( obj, prop, desc ) {
			if ( desc.get ) obj[ prop ] = desc.get();
			else obj[ prop ] = desc.value;
		};
	}

	try {
		try {
			Object.defineProperties({}, { test: { value: 0 } });
		} catch ( err ) {
			// TODO how do we account for this? noMagic = true;
			throw err;
		}

		if ( doc ) {
			Object.defineProperties( createElement( 'div' ), { test: { value: 0 } });
		}

		defineProperties = Object.defineProperties;
	} catch ( err ) {
		defineProperties = function ( obj, props ) {
			var prop;

			for ( prop in props ) {
				if ( props.hasOwnProperty( prop ) ) {
					defineProperty( obj, prop, props[ prop ] );
				}
			}
		};
	}

	try {
		Object.create( null );

		create = Object.create;
	} catch ( err ) {
		// sigh
		create = (function () {
			var F = function () {};

			return function ( proto, props ) {
				var obj;

				if ( proto === null ) {
					return {};
				}

				F.prototype = proto;
				obj = new F();

				if ( props ) {
					Object.defineProperties( obj, props );
				}

				return obj;
			};
		}());
	}

	function extendObj ( target ) {
		var sources = [], len = arguments.length - 1;
		while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

		var prop;

		sources.forEach( function ( source ) {
			for ( prop in source ) {
				if ( hasOwn.call( source, prop ) ) {
					target[ prop ] = source[ prop ];
				}
			}
		});

		return target;
	}

	function fillGaps ( target ) {
		var sources = [], len = arguments.length - 1;
		while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

		sources.forEach( function ( s ) {
			for ( var key in s ) {
				if ( hasOwn.call( s, key ) && !( key in target ) ) {
					target[ key ] = s[ key ];
				}
			}
		});

		return target;
	}

	var hasOwn = Object.prototype.hasOwnProperty;

	var toString = Object.prototype.toString;
	// thanks, http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
	function isArray ( thing ) {
		return toString.call( thing ) === '[object Array]';
	}

	function isEqual ( a, b ) {
		if ( a === null && b === null ) {
			return true;
		}

		if ( typeof a === 'object' || typeof b === 'object' ) {
			return false;
		}

		return a === b;
	}

	// http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
	function isNumeric ( thing ) {
		return !isNaN( parseFloat( thing ) ) && isFinite( thing );
	}

	function isObject ( thing ) {
		return ( thing && toString.call( thing ) === '[object Object]' );
	}

	function noop () {}

	var alreadyWarned = {};
	var log;
	var printWarning;
	var welcome;
	if ( hasConsole ) {
		var welcomeIntro = [
			("%cRactive.js %c0.8.14 %cin debug mode, %cmore..."),
			'color: rgb(114, 157, 52); font-weight: normal;',
			'color: rgb(85, 85, 85); font-weight: normal;',
			'color: rgb(85, 85, 85); font-weight: normal;',
			'color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;'
		];
		var welcomeMessage = "You're running Ractive 0.8.14 in debug mode - messages will be printed to the console to help you fix problems and optimise your application.\n\nTo disable debug mode, add this line at the start of your app:\n  Ractive.DEBUG = false;\n\nTo disable debug mode when your app is minified, add this snippet:\n  Ractive.DEBUG = /unminified/.test(function(){/*unminified*/});\n\nGet help and support:\n  http://docs.ractivejs.org\n  http://stackoverflow.com/questions/tagged/ractivejs\n  http://groups.google.com/forum/#!forum/ractive-js\n  http://twitter.com/ractivejs\n\nFound a bug? Raise an issue:\n  https://github.com/ractivejs/ractive/issues\n\n";

		welcome = function () {
			if ( Ractive.WELCOME_MESSAGE === false ) {
				welcome = noop;
				return;
			}
			var message = 'WELCOME_MESSAGE' in Ractive ? Ractive.WELCOME_MESSAGE : welcomeMessage;
			var hasGroup = !!console.groupCollapsed;
			if ( hasGroup ) console.groupCollapsed.apply( console, welcomeIntro );
			console.log( message );
			if ( hasGroup ) {
				console.groupEnd( welcomeIntro );
			}

			welcome = noop;
		};

		printWarning = function ( message, args ) {
			welcome();

			// extract information about the instance this message pertains to, if applicable
			if ( typeof args[ args.length - 1 ] === 'object' ) {
				var options = args.pop();
				var ractive = options ? options.ractive : null;

				if ( ractive ) {
					// if this is an instance of a component that we know the name of, add
					// it to the message
					var name;
					if ( ractive.component && ( name = ractive.component.name ) ) {
						message = "<" + name + "> " + message;
					}

					var node;
					if ( node = ( options.node || ( ractive.fragment && ractive.fragment.rendered && ractive.find( '*' ) ) ) ) {
						args.push( node );
					}
				}
			}

			console.warn.apply( console, [ '%cRactive.js: %c' + message, 'color: rgb(114, 157, 52);', 'color: rgb(85, 85, 85);' ].concat( args ) );
		};

		log = function () {
			console.log.apply( console, arguments );
		};
	} else {
		printWarning = log = welcome = noop;
	}

	function format ( message, args ) {
		return message.replace( /%s/g, function () { return args.shift(); } );
	}

	function fatal ( message ) {
		var args = [], len = arguments.length - 1;
		while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

		message = format( message, args );
		throw new Error( message );
	}

	function logIfDebug () {
		if ( Ractive.DEBUG ) {
			log.apply( null, arguments );
		}
	}

	function warn ( message ) {
		var args = [], len = arguments.length - 1;
		while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

		message = format( message, args );
		printWarning( message, args );
	}

	function warnOnce ( message ) {
		var args = [], len = arguments.length - 1;
		while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

		message = format( message, args );

		if ( alreadyWarned[ message ] ) {
			return;
		}

		alreadyWarned[ message ] = true;
		printWarning( message, args );
	}

	function warnIfDebug () {
		if ( Ractive.DEBUG ) {
			warn.apply( null, arguments );
		}
	}

	function warnOnceIfDebug () {
		if ( Ractive.DEBUG ) {
			warnOnce.apply( null, arguments );
		}
	}

	// Error messages that are used (or could be) in multiple places
	var badArguments = 'Bad arguments';
	var noRegistryFunctionReturn = 'A function was specified for "%s" %s, but no %s was returned';
	var missingPlugin = function ( name, type ) { return ("Missing \"" + name + "\" " + type + " plugin. You may need to download a plugin via http://docs.ractivejs.org/latest/plugins#" + type + "s"); };

	function findInViewHierarchy ( registryName, ractive, name ) {
		var instance = findInstance( registryName, ractive, name );
		return instance ? instance[ registryName ][ name ] : null;
	}

	function findInstance ( registryName, ractive, name ) {
		while ( ractive ) {
			if ( name in ractive[ registryName ] ) {
				return ractive;
			}

			if ( ractive.isolated ) {
				return null;
			}

			ractive = ractive.parent;
		}
	}

	function interpolate ( from, to, ractive, type ) {
		if ( from === to ) return null;

		if ( type ) {
			var interpol = findInViewHierarchy( 'interpolators', ractive, type );
			if ( interpol ) return interpol( from, to ) || null;

			fatal( missingPlugin( type, 'interpolator' ) );
		}

		return interpolators.number( from, to ) ||
		       interpolators.array( from, to ) ||
		       interpolators.object( from, to ) ||
		       null;
	}

	function snap ( to ) {
		return function () { return to; };
	}

	var interpolators = {
		number: function ( from, to ) {
			var delta;

			if ( !isNumeric( from ) || !isNumeric( to ) ) {
				return null;
			}

			from = +from;
			to = +to;

			delta = to - from;

			if ( !delta ) {
				return function () { return from; };
			}

			return function ( t ) {
				return from + ( t * delta );
			};
		},

		array: function ( from, to ) {
			var intermediate, interpolators, len, i;

			if ( !isArray( from ) || !isArray( to ) ) {
				return null;
			}

			intermediate = [];
			interpolators = [];

			i = len = Math.min( from.length, to.length );
			while ( i-- ) {
				interpolators[i] = interpolate( from[i], to[i] );
			}

			// surplus values - don't interpolate, but don't exclude them either
			for ( i=len; i<from.length; i+=1 ) {
				intermediate[i] = from[i];
			}

			for ( i=len; i<to.length; i+=1 ) {
				intermediate[i] = to[i];
			}

			return function ( t ) {
				var i = len;

				while ( i-- ) {
					intermediate[i] = interpolators[i]( t );
				}

				return intermediate;
			};
		},

		object: function ( from, to ) {
			var properties, len, interpolators, intermediate, prop;

			if ( !isObject( from ) || !isObject( to ) ) {
				return null;
			}

			properties = [];
			intermediate = {};
			interpolators = {};

			for ( prop in from ) {
				if ( hasOwn.call( from, prop ) ) {
					if ( hasOwn.call( to, prop ) ) {
						properties.push( prop );
						interpolators[ prop ] = interpolate( from[ prop ], to[ prop ] ) || snap( to[ prop ] );
					}

					else {
						intermediate[ prop ] = from[ prop ];
					}
				}
			}

			for ( prop in to ) {
				if ( hasOwn.call( to, prop ) && !hasOwn.call( from, prop ) ) {
					intermediate[ prop ] = to[ prop ];
				}
			}

			len = properties.length;

			return function ( t ) {
				var i = len, prop;

				while ( i-- ) {
					prop = properties[i];

					intermediate[ prop ] = interpolators[ prop ]( t );
				}

				return intermediate;
			};
		}
	};

	// TODO: deprecate in future release
	var deprecations = {
		construct: {
			deprecated: 'beforeInit',
			replacement: 'onconstruct'
		},
		render: {
			deprecated: 'init',
			message: 'The "init" method has been deprecated ' +
				'and will likely be removed in a future release. ' +
				'You can either use the "oninit" method which will fire ' +
				'only once prior to, and regardless of, any eventual ractive ' +
				'instance being rendered, or if you need to access the ' +
				'rendered DOM, use "onrender" instead. ' +
				'See http://docs.ractivejs.org/latest/migrating for more information.'
		},
		complete: {
			deprecated: 'complete',
			replacement: 'oncomplete'
		}
	};

	var Hook = function Hook ( event ) {
		this.event = event;
		this.method = 'on' + event;
		this.deprecate = deprecations[ event ];
	};

	Hook.prototype.call = function call ( method, ractive, arg ) {
		if ( ractive[ method ] ) {
			arg ? ractive[ method ]( arg ) : ractive[ method ]();
			return true;
		}
	};

	Hook.prototype.fire = function fire ( ractive, arg ) {
		this.call( this.method, ractive, arg );

		// handle deprecations
		if ( !ractive[ this.method ] && this.deprecate && this.call( this.deprecate.deprecated, ractive, arg ) ) {
			if ( this.deprecate.message ) {
				warnIfDebug( this.deprecate.message );
			} else {
				warnIfDebug( 'The method "%s" has been deprecated in favor of "%s" and will likely be removed in a future release. See http://docs.ractivejs.org/latest/migrating for more information.', this.deprecate.deprecated, this.deprecate.replacement );
			}
		}

		// TODO should probably use internal method, in case ractive.fire was overwritten
		arg ? ractive.fire( this.event, arg ) : ractive.fire( this.event );
	};

	function addToArray ( array, value ) {
		var index = array.indexOf( value );

		if ( index === -1 ) {
			array.push( value );
		}
	}

	function arrayContains ( array, value ) {
		for ( var i = 0, c = array.length; i < c; i++ ) {
			if ( array[i] == value ) {
				return true;
			}
		}

		return false;
	}

	function arrayContentsMatch ( a, b ) {
		var i;

		if ( !isArray( a ) || !isArray( b ) ) {
			return false;
		}

		if ( a.length !== b.length ) {
			return false;
		}

		i = a.length;
		while ( i-- ) {
			if ( a[i] !== b[i] ) {
				return false;
			}
		}

		return true;
	}

	function ensureArray ( x ) {
		if ( typeof x === 'string' ) {
			return [ x ];
		}

		if ( x === undefined ) {
			return [];
		}

		return x;
	}

	function lastItem ( array ) {
		return array[ array.length - 1 ];
	}

	function removeFromArray ( array, member ) {
		if ( !array ) {
			return;
		}

		var index = array.indexOf( member );

		if ( index !== -1 ) {
			array.splice( index, 1 );
		}
	}

	function toArray ( arrayLike ) {
		var array = [], i = arrayLike.length;
		while ( i-- ) {
			array[i] = arrayLike[i];
		}

		return array;
	}

	var _Promise;
	var PENDING = {};
	var FULFILLED = {};
	var REJECTED = {};
	if ( typeof Promise === 'function' ) {
		// use native Promise
		_Promise = Promise;
	} else {
		_Promise = function ( callback ) {
			var fulfilledHandlers = [],
				rejectedHandlers = [],
				state = PENDING,

				result,
				dispatchHandlers,
				makeResolver,
				fulfil,
				reject,

				promise;

			makeResolver = function ( newState ) {
				return function ( value ) {
					if ( state !== PENDING ) {
						return;
					}

					result = value;
					state = newState;

					dispatchHandlers = makeDispatcher( ( state === FULFILLED ? fulfilledHandlers : rejectedHandlers ), result );

					// dispatch onFulfilled and onRejected handlers asynchronously
					wait( dispatchHandlers );
				};
			};

			fulfil = makeResolver( FULFILLED );
			reject = makeResolver( REJECTED );

			try {
				callback( fulfil, reject );
			} catch ( err ) {
				reject( err );
			}

			promise = {
				// `then()` returns a Promise - 2.2.7
				then: function ( onFulfilled, onRejected ) {
					var promise2 = new _Promise( function ( fulfil, reject ) {

						var processResolutionHandler = function ( handler, handlers, forward ) {

							// 2.2.1.1
							if ( typeof handler === 'function' ) {
								handlers.push( function ( p1result ) {
									var x;

									try {
										x = handler( p1result );
										resolve( promise2, x, fulfil, reject );
									} catch ( err ) {
										reject( err );
									}
								});
							} else {
								// Forward the result of promise1 to promise2, if resolution handlers
								// are not given
								handlers.push( forward );
							}
						};

						// 2.2
						processResolutionHandler( onFulfilled, fulfilledHandlers, fulfil );
						processResolutionHandler( onRejected, rejectedHandlers, reject );

						if ( state !== PENDING ) {
							// If the promise has resolved already, dispatch the appropriate handlers asynchronously
							wait( dispatchHandlers );
						}

					});

					return promise2;
				}
			};

			promise[ 'catch' ] = function ( onRejected ) {
				return this.then( null, onRejected );
			};

			return promise;
		};

		_Promise.all = function ( promises ) {
			return new _Promise( function ( fulfil, reject ) {
				var result = [], pending, i, processPromise;

				if ( !promises.length ) {
					fulfil( result );
					return;
				}

				processPromise = function ( promise, i ) {
					if ( promise && typeof promise.then === 'function' ) {
						promise.then( function ( value ) {
							result[i] = value;
							--pending || fulfil( result );
						}, reject );
					}

					else {
						result[i] = promise;
						--pending || fulfil( result );
					}
				};

				pending = i = promises.length;
				while ( i-- ) {
					processPromise( promises[i], i );
				}
			});
		};

		_Promise.resolve = function ( value ) {
			return new _Promise( function ( fulfil ) {
				fulfil( value );
			});
		};

		_Promise.reject = function ( reason ) {
			return new _Promise( function ( fulfil, reject ) {
				reject( reason );
			});
		};
	}

	var Promise$1 = _Promise;

	// TODO use MutationObservers or something to simulate setImmediate
	function wait ( callback ) {
		setTimeout( callback, 0 );
	}

	function makeDispatcher ( handlers, result ) {
		return function () {
			var handler;

			while ( handler = handlers.shift() ) {
				handler( result );
			}
		};
	}

	function resolve ( promise, x, fulfil, reject ) {
		// Promise Resolution Procedure
		var then;

		// 2.3.1
		if ( x === promise ) {
			throw new TypeError( 'A promise\'s fulfillment handler cannot return the same promise' );
		}

		// 2.3.2
		if ( x instanceof _Promise ) {
			x.then( fulfil, reject );
		}

		// 2.3.3
		else if ( x && ( typeof x === 'object' || typeof x === 'function' ) ) {
			try {
				then = x.then; // 2.3.3.1
			} catch ( e ) {
				reject( e ); // 2.3.3.2
				return;
			}

			// 2.3.3.3
			if ( typeof then === 'function' ) {
				var called, resolvePromise, rejectPromise;

				resolvePromise = function ( y ) {
					if ( called ) {
						return;
					}
					called = true;
					resolve( promise, y, fulfil, reject );
				};

				rejectPromise = function ( r ) {
					if ( called ) {
						return;
					}
					called = true;
					reject( r );
				};

				try {
					then.call( x, resolvePromise, rejectPromise );
				} catch ( e ) {
					if ( !called ) { // 2.3.3.3.4.1
						reject( e ); // 2.3.3.3.4.2
						called = true;
						return;
					}
				}
			}

			else {
				fulfil( x );
			}
		}

		else {
			fulfil( x );
		}
	}

	var TransitionManager = function TransitionManager ( callback, parent ) {
		this.callback = callback;
		this.parent = parent;

		this.intros = [];
		this.outros = [];

		this.children = [];
		this.totalChildren = this.outroChildren = 0;

		this.detachQueue = [];
		this.outrosComplete = false;

		if ( parent ) {
			parent.addChild( this );
		}
	};

	TransitionManager.prototype.add = function add ( transition ) {
		var list = transition.isIntro ? this.intros : this.outros;
		list.push( transition );
	};

	TransitionManager.prototype.addChild = function addChild ( child ) {
		this.children.push( child );

		this.totalChildren += 1;
		this.outroChildren += 1;
	};

	TransitionManager.prototype.decrementOutros = function decrementOutros () {
		this.outroChildren -= 1;
		check( this );
	};

	TransitionManager.prototype.decrementTotal = function decrementTotal () {
		this.totalChildren -= 1;
		check( this );
	};

	TransitionManager.prototype.detachNodes = function detachNodes () {
		this.detachQueue.forEach( detach );
		this.children.forEach( _detachNodes );
		this.detachQueue = [];
	};

	TransitionManager.prototype.ready = function ready () {
		detachImmediate( this );
	};

	TransitionManager.prototype.remove = function remove ( transition ) {
		var list = transition.isIntro ? this.intros : this.outros;
		removeFromArray( list, transition );
		check( this );
	};

	TransitionManager.prototype.start = function start () {
		this.children.forEach( function ( c ) { return c.start(); } );
		this.intros.concat( this.outros ).forEach( function ( t ) { return t.start(); } );
		this.ready = true;
		check( this );
	};

	function detach ( element ) {
		element.detach();
	}

	function _detachNodes ( tm ) { // _ to avoid transpiler quirk
		tm.detachNodes();
	}

	function check ( tm ) {
		if ( !tm.ready || tm.outros.length || tm.outroChildren ) return;

		// If all outros are complete, and we haven't already done this,
		// we notify the parent if there is one, otherwise
		// start detaching nodes
		if ( !tm.outrosComplete ) {
			tm.outrosComplete = true;

			if ( tm.parent && !tm.parent.outrosComplete ) {
				tm.parent.decrementOutros( tm );
			} else {
				tm.detachNodes();
			}
		}

		// Once everything is done, we can notify parent transition
		// manager and call the callback
		if ( !tm.intros.length && !tm.totalChildren ) {
			if ( typeof tm.callback === 'function' ) {
				tm.callback();
			}

			if ( tm.parent && !tm.notifiedTotal ) {
				tm.notifiedTotal = true;
				tm.parent.decrementTotal();
			}
		}
	}

	// check through the detach queue to see if a node is up or downstream from a
	// transition and if not, go ahead and detach it
	function detachImmediate ( manager ) {
		var queue = manager.detachQueue;
		var outros = collectAllOutros( manager );

		var i = queue.length, j = 0, node, trans;
		start: while ( i-- ) {
			node = queue[i].node;
			j = outros.length;
			while ( j-- ) {
				trans = outros[j].element.node;
				// check to see if the node is, contains, or is contained by the transitioning node
				if ( trans === node || trans.contains( node ) || node.contains( trans ) ) continue start;
			}

			// no match, we can drop it
			queue[i].detach();
			queue.splice( i, 1 );
		}
	}

	function collectAllOutros ( manager, list ) {
		if ( !list ) {
			list = [];
			var parent = manager;
			while ( parent.parent ) parent = parent.parent;
			return collectAllOutros( parent, list );
		} else {
			var i = manager.children.length;
			while ( i-- ) {
				list = collectAllOutros( manager.children[i], list );
			}
			list = list.concat( manager.outros );
			return list;
		}
	}

	var changeHook = new Hook( 'change' );

	var batch;

	var runloop = {
		start: function ( instance, returnPromise ) {
			var promise, fulfilPromise;

			if ( returnPromise ) {
				promise = new Promise$1( function ( f ) { return ( fulfilPromise = f ); } );
			}

			batch = {
				previousBatch: batch,
				transitionManager: new TransitionManager( fulfilPromise, batch && batch.transitionManager ),
				fragments: [],
				tasks: [],
				immediateObservers: [],
				deferredObservers: [],
				ractives: [],
				instance: instance
			};

			return promise;
		},

		end: function () {
			flushChanges();

			if ( !batch.previousBatch ) batch.transitionManager.start();

			batch = batch.previousBatch;
		},

		addFragment: function ( fragment ) {
			addToArray( batch.fragments, fragment );
		},

		// TODO: come up with a better way to handle fragments that trigger their own update
		addFragmentToRoot: function ( fragment ) {
			if ( !batch ) return;

			var b = batch;
			while ( b.previousBatch ) {
				b = b.previousBatch;
			}

			addToArray( b.fragments, fragment );
		},

		addInstance: function ( instance ) {
			if ( batch ) addToArray( batch.ractives, instance );
		},

		addObserver: function ( observer, defer ) {
			addToArray( defer ? batch.deferredObservers : batch.immediateObservers, observer );
		},

		registerTransition: function ( transition ) {
			transition._manager = batch.transitionManager;
			batch.transitionManager.add( transition );
		},

		// synchronise node detachments with transition ends
		detachWhenReady: function ( thing ) {
			batch.transitionManager.detachQueue.push( thing );
		},

		scheduleTask: function ( task, postRender ) {
			var _batch;

			if ( !batch ) {
				task();
			} else {
				_batch = batch;
				while ( postRender && _batch.previousBatch ) {
					// this can't happen until the DOM has been fully updated
					// otherwise in some situations (with components inside elements)
					// transitions and decorators will initialise prematurely
					_batch = _batch.previousBatch;
				}

				_batch.tasks.push( task );
			}
		}
	};

	function dispatch ( observer ) {
		observer.dispatch();
	}

	function flushChanges () {
		var which = batch.immediateObservers;
		batch.immediateObservers = [];
		which.forEach( dispatch );

		// Now that changes have been fully propagated, we can update the DOM
		// and complete other tasks
		var i = batch.fragments.length;
		var fragment;

		which = batch.fragments;
		batch.fragments = [];
		var ractives = batch.ractives;
		batch.ractives = [];

		while ( i-- ) {
			fragment = which[i];

			// TODO deprecate this. It's annoying and serves no useful function
			var ractive = fragment.ractive;
			if ( Object.keys( ractive.viewmodel.changes ).length ) {
				changeHook.fire( ractive, ractive.viewmodel.changes );
			}
			ractive.viewmodel.changes = {};
			removeFromArray( ractives, ractive );

			fragment.update();
		}

		i = ractives.length;
		while ( i-- ) {
			var ractive$1 = ractives[i];
			changeHook.fire( ractive$1, ractive$1.viewmodel.changes );
			ractive$1.viewmodel.changes = {};
		}

		batch.transitionManager.ready();

		which = batch.deferredObservers;
		batch.deferredObservers = [];
		which.forEach( dispatch );

		var tasks = batch.tasks;
		batch.tasks = [];

		for ( i = 0; i < tasks.length; i += 1 ) {
			tasks[i]();
		}

		// If updating the view caused some model blowback - e.g. a triple
		// containing <option> elements caused the binding on the <select>
		// to update - then we start over
		if ( batch.fragments.length || batch.immediateObservers.length || batch.deferredObservers.length || batch.ractives.length || batch.tasks.length ) return flushChanges();
	}

	var refPattern = /\[\s*(\*|[0-9]|[1-9][0-9]+)\s*\]/g;
	var splitPattern = /([^\\](?:\\\\)*)\./;
	var escapeKeyPattern = /\\|\./g;
	var unescapeKeyPattern = /((?:\\)+)\1|\\(\.)/g;

	function escapeKey ( key ) {
		if ( typeof key === 'string' ) {
			return key.replace( escapeKeyPattern, '\\$&' );
		}

		return key;
	}

	function normalise ( ref ) {
		return ref ? ref.replace( refPattern, '.$1' ) : '';
	}

	function splitKeypathI ( keypath ) {
		var result = [],
			match;

		keypath = normalise( keypath );

		while ( match = splitPattern.exec( keypath ) ) {
			var index = match.index + match[1].length;
			result.push( keypath.substr( 0, index ) );
			keypath = keypath.substr( index + 1 );
		}

		result.push(keypath);

		return result;
	}

	function unescapeKey ( key ) {
		if ( typeof key === 'string' ) {
			return key.replace( unescapeKeyPattern, '$1$2' );
		}

		return key;
	}

	var fnBind = Function.prototype.bind;

	function bind ( fn, context ) {
		if ( !/this/.test( fn.toString() ) ) return fn;

		var bound = fnBind.call( fn, context );
		for ( var prop in fn ) bound[ prop ] = fn[ prop ];

		return bound;
	}

	function set ( ractive, pairs ) {
		var promise = runloop.start( ractive, true );

		var i = pairs.length;
		while ( i-- ) {
			var ref = pairs[i], model = ref[0], value = ref[1];
			if ( typeof value === 'function' ) value = bind( value, ractive );
			model.set( value );
		}

		runloop.end();

		return promise;
	}

	var star = /\*/;
	function gather ( ractive, keypath, base ) {
		if ( base === void 0 ) base = ractive.viewmodel;

		if ( star.test( keypath ) ) {
			return base.findMatches( splitKeypathI( keypath ) );
		} else {
			return [ base.joinAll( splitKeypathI( keypath ) ) ];
		}
	}

	function build ( ractive, keypath, value ) {
		var sets = [];

		// set multiple keypaths in one go
		if ( isObject( keypath ) ) {
			var loop = function ( k ) {
				if ( keypath.hasOwnProperty( k ) ) {
					sets.push.apply( sets, gather( ractive, k ).map( function ( m ) { return [ m, keypath[k] ]; } ) );
				}
			};

			for ( var k in keypath ) loop( k );

		}
		// set a single keypath
		else {
			sets.push.apply( sets, gather( ractive, keypath ).map( function ( m ) { return [ m, value ]; } ) );
		}

		return sets;
	}

	var errorMessage = 'Cannot add to a non-numeric value';

	function add ( ractive, keypath, d ) {
		if ( typeof keypath !== 'string' || !isNumeric( d ) ) {
			throw new Error( 'Bad arguments' );
		}

		var sets = build( ractive, keypath, d );

		return set( ractive, sets.map( function ( pair ) {
			var model = pair[0], add = pair[1], value = model.get();
			if ( !isNumeric( add ) || !isNumeric( value ) ) throw new Error( errorMessage );
			return [ model, value + add ];
		}));
	}

	function Ractive$add ( keypath, d ) {
		return add( this, keypath, ( d === undefined ? 1 : +d ) );
	}

	var noAnimation = Promise$1.resolve();
	defineProperty( noAnimation, 'stop', { value: noop });

	var linear = easing.linear;

	function getOptions ( options, instance ) {
		options = options || {};

		var easing;
		if ( options.easing ) {
			easing = typeof options.easing === 'function' ?
				options.easing :
				instance.easing[ options.easing ];
		}

		return {
			easing: easing || linear,
			duration: 'duration' in options ? options.duration : 400,
			complete: options.complete || noop,
			step: options.step || noop
		};
	}

	function protoAnimate ( ractive, model, to, options ) {
		options = getOptions( options, ractive );
		var from = model.get();

		// don't bother animating values that stay the same
		if ( isEqual( from, to ) ) {
			options.complete( options.to );
			return noAnimation; // TODO should this have .then and .catch methods?
		}

		var interpolator = interpolate( from, to, ractive, options.interpolator );

		// if we can't interpolate the value, set it immediately
		if ( !interpolator ) {
			runloop.start();
			model.set( to );
			runloop.end();

			return noAnimation;
		}

		return model.animate( from, to, options, interpolator );
	}

	function Ractive$animate ( keypath, to, options ) {
		if ( typeof keypath === 'object' ) {
			var keys = Object.keys( keypath );

			throw new Error( ("ractive.animate(...) no longer supports objects. Instead of ractive.animate({\n  " + (keys.map( function ( key ) { return ("'" + key + "': " + (keypath[ key ])); } ).join( '\n  ' )) + "\n}, {...}), do\n\n" + (keys.map( function ( key ) { return ("ractive.animate('" + key + "', " + (keypath[ key ]) + ", {...});"); } ).join( '\n' )) + "\n") );
		}


		return protoAnimate( this, this.viewmodel.joinAll( splitKeypathI( keypath ) ), to, options );
	}

	var detachHook = new Hook( 'detach' );

	function Ractive$detach () {
		if ( this.isDetached ) {
			return this.el;
		}

		if ( this.el ) {
			removeFromArray( this.el.__ractive_instances__, this );
		}

		this.el = this.fragment.detach();
		this.isDetached = true;

		detachHook.fire( this );
		return this.el;
	}

	function Ractive$find ( selector ) {
		if ( !this.el ) throw new Error( ("Cannot call ractive.find('" + selector + "') unless instance is rendered to the DOM") );

		return this.fragment.find( selector );
	}

	function sortByDocumentPosition ( node, otherNode ) {
		if ( node.compareDocumentPosition ) {
			var bitmask = node.compareDocumentPosition( otherNode );
			return ( bitmask & 2 ) ? 1 : -1;
		}

		// In old IE, we can piggy back on the mechanism for
		// comparing component positions
		return sortByItemPosition( node, otherNode );
	}

	function sortByItemPosition ( a, b ) {
		var ancestryA = getAncestry( a.component || a._ractive.proxy );
		var ancestryB = getAncestry( b.component || b._ractive.proxy );

		var oldestA = lastItem( ancestryA );
		var oldestB = lastItem( ancestryB );
		var mutualAncestor;

		// remove items from the end of both ancestries as long as they are identical
		// - the final one removed is the closest mutual ancestor
		while ( oldestA && ( oldestA === oldestB ) ) {
			ancestryA.pop();
			ancestryB.pop();

			mutualAncestor = oldestA;

			oldestA = lastItem( ancestryA );
			oldestB = lastItem( ancestryB );
		}

		// now that we have the mutual ancestor, we can find which is earliest
		oldestA = oldestA.component || oldestA;
		oldestB = oldestB.component || oldestB;

		var fragmentA = oldestA.parentFragment;
		var fragmentB = oldestB.parentFragment;

		// if both items share a parent fragment, our job is easy
		if ( fragmentA === fragmentB ) {
			var indexA = fragmentA.items.indexOf( oldestA );
			var indexB = fragmentB.items.indexOf( oldestB );

			// if it's the same index, it means one contains the other,
			// so we see which has the longest ancestry
			return ( indexA - indexB ) || ancestryA.length - ancestryB.length;
		}

		// if mutual ancestor is a section, we first test to see which section
		// fragment comes first
		var fragments = mutualAncestor.iterations;
		if ( fragments ) {
			var indexA$1 = fragments.indexOf( fragmentA );
			var indexB$1 = fragments.indexOf( fragmentB );

			return ( indexA$1 - indexB$1 ) || ancestryA.length - ancestryB.length;
		}

		throw new Error( 'An unexpected condition was met while comparing the position of two components. Please file an issue at https://github.com/ractivejs/ractive/issues - thanks!' );
	}

	function getParent ( item ) {
		var parentFragment = item.parentFragment;

		if ( parentFragment ) return parentFragment.owner;

		if ( item.component && ( parentFragment = item.component.parentFragment ) ) {
			return parentFragment.owner;
		}
	}

	function getAncestry ( item ) {
		var ancestry = [ item ];
		var ancestor = getParent( item );

		while ( ancestor ) {
			ancestry.push( ancestor );
			ancestor = getParent( ancestor );
		}

		return ancestry;
	}


	var Query = function Query ( ractive, selector, live, isComponentQuery ) {
		this.ractive = ractive;
		this.selector = selector;
		this.live = live;
		this.isComponentQuery = isComponentQuery;

		this.result = [];

		this.dirty = true;
	};

	Query.prototype.add = function add ( item ) {
		this.result.push( item );
		this.makeDirty();
	};

	Query.prototype.cancel = function cancel () {
		var liveQueries = this._root[ this.isComponentQuery ? 'liveComponentQueries' : 'liveQueries' ];
		var selector = this.selector;

		var index = liveQueries.indexOf( selector );

		if ( index !== -1 ) {
			liveQueries.splice( index, 1 );
			liveQueries[ selector ] = null;
		}
	};

	Query.prototype.init = function init () {
		this.dirty = false;
	};

	Query.prototype.makeDirty = function makeDirty () {
		var this$1 = this;

			if ( !this.dirty ) {
			this.dirty = true;

			// Once the DOM has been updated, ensure the query
			// is correctly ordered
			runloop.scheduleTask( function () { return this$1.update(); } );
		}
	};

	Query.prototype.remove = function remove ( nodeOrComponent ) {
		var index = this.result.indexOf( this.isComponentQuery ? nodeOrComponent.instance : nodeOrComponent );
		if ( index !== -1 ) this.result.splice( index, 1 );
	};

	Query.prototype.update = function update () {
		this.result.sort( this.isComponentQuery ? sortByItemPosition : sortByDocumentPosition );
		this.dirty = false;
	};

	Query.prototype.test = function test ( item ) {
		return this.isComponentQuery ?
			( !this.selector || item.name === this.selector ) :
			( item ? matches( item, this.selector ) : null );
	};

	function Ractive$findAll ( selector, options ) {
		if ( !this.el ) throw new Error( ("Cannot call ractive.findAll('" + selector + "', ...) unless instance is rendered to the DOM") );

		options = options || {};
		var liveQueries = this._liveQueries;

		// Shortcut: if we're maintaining a live query with this
		// selector, we don't need to traverse the parallel DOM
		var query = liveQueries[ selector ];
		if ( query ) {
			// Either return the exact same query, or (if not live) a snapshot
			return ( options && options.live ) ? query : query.slice();
		}

		query = new Query( this, selector, !!options.live, false );

		// Add this to the list of live queries Ractive needs to maintain,
		// if applicable
		if ( query.live ) {
			liveQueries.push( selector );
			liveQueries[ '_' + selector ] = query;
		}

		this.fragment.findAll( selector, query );

		query.init();
		return query.result;
	}

	function Ractive$findAllComponents ( selector, options ) {
		options = options || {};
		var liveQueries = this._liveComponentQueries;

		// Shortcut: if we're maintaining a live query with this
		// selector, we don't need to traverse the parallel DOM
		var query = liveQueries[ selector ];
		if ( query ) {
			// Either return the exact same query, or (if not live) a snapshot
			return ( options && options.live ) ? query : query.slice();
		}

		query = new Query( this, selector, !!options.live, true );

		// Add this to the list of live queries Ractive needs to maintain,
		// if applicable
		if ( query.live ) {
			liveQueries.push( selector );
			liveQueries[ '_' + selector ] = query;
		}

		this.fragment.findAllComponents( selector, query );

		query.init();
		return query.result;
	}

	function Ractive$findComponent ( selector ) {
		return this.fragment.findComponent( selector );
	}

	function Ractive$findContainer ( selector ) {
		if ( this.container ) {
			if ( this.container.component && this.container.component.name === selector ) {
				return this.container;
			} else {
				return this.container.findContainer( selector );
			}
		}

		return null;
	}

	function Ractive$findParent ( selector ) {

		if ( this.parent ) {
			if ( this.parent.component && this.parent.component.name === selector ) {
				return this.parent;
			} else {
				return this.parent.findParent ( selector );
			}
		}

		return null;
	}

	function enqueue ( ractive, event ) {
		if ( ractive.event ) {
			ractive._eventQueue.push( ractive.event );
		}

		ractive.event = event;
	}

	function dequeue ( ractive ) {
		if ( ractive._eventQueue.length ) {
			ractive.event = ractive._eventQueue.pop();
		} else {
			ractive.event = null;
		}
	}

	var starMaps = {};

	// This function takes a keypath such as 'foo.bar.baz', and returns
	// all the variants of that keypath that include a wildcard in place
	// of a key, such as 'foo.bar.*', 'foo.*.baz', 'foo.*.*' and so on.
	// These are then checked against the dependants map (ractive.viewmodel.depsMap)
	// to see if any pattern observers are downstream of one or more of
	// these wildcard keypaths (e.g. 'foo.bar.*.status')
	function getPotentialWildcardMatches ( keypath ) {
		var keys, starMap, mapper, i, result, wildcardKeypath;

		keys = splitKeypathI( keypath );
		if( !( starMap = starMaps[ keys.length ]) ) {
			starMap = getStarMap( keys.length );
		}

		result = [];

		mapper = function ( star, i ) {
			return star ? '*' : keys[i];
		};

		i = starMap.length;
		while ( i-- ) {
			wildcardKeypath = starMap[i].map( mapper ).join( '.' );

			if ( !result.hasOwnProperty( wildcardKeypath ) ) {
				result.push( wildcardKeypath );
				result[ wildcardKeypath ] = true;
			}
		}

		return result;
	}

	// This function returns all the possible true/false combinations for
	// a given number - e.g. for two, the possible combinations are
	// [ true, true ], [ true, false ], [ false, true ], [ false, false ].
	// It does so by getting all the binary values between 0 and e.g. 11
	function getStarMap ( num ) {
		var ones = '', max, binary, starMap, mapper, i, j, l, map;

		if ( !starMaps[ num ] ) {
			starMap = [];

			while ( ones.length < num ) {
				ones += 1;
			}

			max = parseInt( ones, 2 );

			mapper = function ( digit ) {
				return digit === '1';
			};

			for ( i = 0; i <= max; i += 1 ) {
				binary = i.toString( 2 );
				while ( binary.length < num ) {
					binary = '0' + binary;
				}

				map = [];
				l = binary.length;
				for (j = 0; j < l; j++) {
					map.push( mapper( binary[j] ) );
				}
				starMap[i] = map;
			}

			starMaps[ num ] = starMap;
		}

		return starMaps[ num ];
	}

	var wildcardCache = {};

	function fireEvent ( ractive, eventName, options ) {
		if ( options === void 0 ) options = {};

		if ( !eventName ) { return; }

		if ( !options.event ) {
			options.event = {
				name: eventName,
				// until event not included as argument default
				_noArg: true
			};
		} else {
			options.event.name = eventName;
		}

		var eventNames = getWildcardNames( eventName );

		return fireEventAs( ractive, eventNames, options.event, options.args, true );
	}

	function getWildcardNames ( eventName ) {
		if ( wildcardCache.hasOwnProperty( eventName ) ) {
			return wildcardCache[ eventName ];
		} else {
			return wildcardCache[ eventName ] = getPotentialWildcardMatches( eventName );
		}
	}

	function fireEventAs  ( ractive, eventNames, event, args, initialFire ) {

		if ( initialFire === void 0 ) initialFire = false;

		var subscribers, i, bubble = true;

		enqueue( ractive, event );

		for ( i = eventNames.length; i >= 0; i-- ) {
			subscribers = ractive._subs[ eventNames[ i ] ];

			if ( subscribers ) {
				bubble = notifySubscribers( ractive, subscribers, event, args ) && bubble;
			}
		}

		dequeue( ractive );

		if ( ractive.parent && bubble ) {

			if ( initialFire && ractive.component ) {
				var fullName = ractive.component.name + '.' + eventNames[ eventNames.length-1 ];
				eventNames = getWildcardNames( fullName );

				if( event && !event.component ) {
					event.component = ractive;
				}
			}

			bubble = fireEventAs( ractive.parent, eventNames, event, args );
		}

		return bubble;
	}

	function notifySubscribers ( ractive, subscribers, event, args ) {
		var originalEvent = null, stopEvent = false;

		if ( event && !event._noArg ) {
			args = [ event ].concat( args );
		}

		// subscribers can be modified inflight, e.g. "once" functionality
		// so we need to copy to make sure everyone gets called
		subscribers = subscribers.slice();

		for ( var i = 0, len = subscribers.length; i < len; i += 1 ) {
			if ( !subscribers[ i ].off && subscribers[ i ].callback.apply( ractive, args ) === false ) {
				stopEvent = true;
			}
		}

		if ( event && !event._noArg && stopEvent && ( originalEvent = event.original ) ) {
			originalEvent.preventDefault && originalEvent.preventDefault();
			originalEvent.stopPropagation && originalEvent.stopPropagation();
		}

		return !stopEvent;
	}

	function Ractive$fire ( eventName ) {
		var args = [], len = arguments.length - 1;
		while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

		return fireEvent( this, eventName, { args: args });
	}

	function badReference ( key ) {
		throw new Error( ("An index or key reference (" + key + ") cannot have child properties") );
	}

	function resolveAmbiguousReference ( fragment, ref ) {
		var localViewmodel = fragment.findContext().root;
		var keys = splitKeypathI( ref );
		var key = keys[0];

		var hasContextChain;
		var crossedComponentBoundary;
		var aliases;

		while ( fragment ) {
			// repeated fragments
			if ( fragment.isIteration ) {
				if ( key === fragment.parent.keyRef ) {
					if ( keys.length > 1 ) badReference( key );
					return fragment.context.getKeyModel( fragment.key );
				}

				if ( key === fragment.parent.indexRef ) {
					if ( keys.length > 1 ) badReference( key );
					return fragment.context.getKeyModel( fragment.index );
				}
			}

			// alias node or iteration
			if ( ( ( aliases = fragment.owner.aliases ) || ( aliases = fragment.aliases ) ) && aliases.hasOwnProperty( key ) ) {
				var model = aliases[ key ];

				if ( keys.length === 1 ) return model;
				else if ( typeof model.joinAll === 'function' ) {
					return model.joinAll( keys.slice( 1 ) );
				}
			}

			if ( fragment.context ) {
				// TODO better encapsulate the component check
				if ( !fragment.isRoot || fragment.ractive.component ) hasContextChain = true;

				if ( fragment.context.has( key ) ) {
					if ( crossedComponentBoundary ) {
						return localViewmodel.createLink( key, fragment.context.joinKey( keys.shift() ), key ).joinAll( keys );
					}

					return fragment.context.joinAll( keys );
				}
			}

			if ( fragment.componentParent && !fragment.ractive.isolated ) {
				// ascend through component boundary
				fragment = fragment.componentParent;
				crossedComponentBoundary = true;
			} else {
				fragment = fragment.parent;
			}
		}

		if ( !hasContextChain ) {
			return localViewmodel.joinAll( keys );
		}
	}

	var stack = [];
	var captureGroup;

	function startCapturing () {
		stack.push( captureGroup = [] );
	}

	function stopCapturing () {
		var dependencies = stack.pop();
		captureGroup = stack[ stack.length - 1 ];
		return dependencies;
	}

	function capture ( model ) {
		if ( captureGroup ) {
			captureGroup.push( model );
		}
	}

	var KeyModel = function KeyModel ( key, parent ) {
		this.value = key;
		this.isReadonly = this.isKey = true;
		this.deps = [];
		this.links = [];
		this.parent = parent;
	};

	KeyModel.prototype.get = function get ( shouldCapture ) {
		if ( shouldCapture ) capture( this );
		return unescapeKey( this.value );
	};

	KeyModel.prototype.getKeypath = function getKeypath () {
		return unescapeKey( this.value );
	};

	KeyModel.prototype.rebinding = function rebinding ( next, previous ) {
		var this$1 = this;

			var i = this.deps.length;
		while ( i-- ) this$1.deps[i].rebinding( next, previous, false );

		i = this.links.length;
		while ( i-- ) this$1.links[i].rebinding( next, previous, false );
	};

	KeyModel.prototype.register = function register ( dependant ) {
		this.deps.push( dependant );
	};

	KeyModel.prototype.registerLink = function registerLink ( link ) {
		addToArray( this.links, link );
	};

	KeyModel.prototype.unregister = function unregister ( dependant ) {
		removeFromArray( this.deps, dependant );
	};

	KeyModel.prototype.unregisterLink = function unregisterLink ( link ) {
		removeFromArray( this.links, link );
	};

	KeyModel.prototype.reference = noop;
	KeyModel.prototype.unreference = noop;

	function bind$1               ( x ) { x.bind(); }
	function cancel             ( x ) { x.cancel(); }
	function handleChange       ( x ) { x.handleChange(); }
	function mark               ( x ) { x.mark(); }
	function marked             ( x ) { x.marked(); }
	function markedAll          ( x ) { x.markedAll(); }
	function notifiedUpstream   ( x ) { x.notifiedUpstream(); }
	function render             ( x ) { x.render(); }
	function teardown           ( x ) { x.teardown(); }
	function unbind             ( x ) { x.unbind(); }
	function unrender           ( x ) { x.unrender(); }
	function unrenderAndDestroy ( x ) { x.unrender( true ); }
	function update             ( x ) { x.update(); }
	function toString$1           ( x ) { return x.toString(); }
	function toEscapedString    ( x ) { return x.toString( true ); }

	var KeypathModel = function KeypathModel ( parent, ractive ) {
		this.parent = parent;
		this.ractive = ractive;
		this.value = ractive ? parent.getKeypath( ractive ) : parent.getKeypath();
		this.deps = [];
		this.children = {};
		this.isReadonly = this.isKeypath = true;
	};

	KeypathModel.prototype.get = function get ( shouldCapture ) {
		if ( shouldCapture ) capture( this );
		return this.value;
	};

	KeypathModel.prototype.getChild = function getChild ( ractive ) {
		if ( !( ractive._guid in this.children ) ) {
			var model = new KeypathModel( this.parent, ractive );
			this.children[ ractive._guid ] = model;
			model.owner = this;
		}
		return this.children[ ractive._guid ];
	};

	KeypathModel.prototype.getKeypath = function getKeypath () {
		return this.value;
	};

	KeypathModel.prototype.handleChange = function handleChange$1 () {
		var this$1 = this;

			var keys = Object.keys( this.children );
		var i = keys.length;
		while ( i-- ) {
			this$1.children[ keys[i] ].handleChange();
		}

		this.deps.forEach( handleChange );
	};

	KeypathModel.prototype.rebindChildren = function rebindChildren ( next ) {
		var this$1 = this;

			var keys = Object.keys( this.children );
		var i = keys.length;
		while ( i-- ) {
			var child = this$1.children[keys[i]];
			child.value = next.getKeypath( child.ractive );
			child.handleChange();
		}
	};

	KeypathModel.prototype.rebinding = function rebinding ( next, previous ) {
		var this$1 = this;

			var model = next ? next.getKeypathModel( this.ractive ) : undefined;

		var keys = Object.keys( this.children );
		var i = keys.length;
		while ( i-- ) {
			this$1.children[ keys[i] ].rebinding( next, previous, false );
		}

		i = this.deps.length;
		while ( i-- ) {
			this$1.deps[i].rebinding( model, this$1, false );
		}
	};

	KeypathModel.prototype.register = function register ( dep ) {
		this.deps.push( dep );
	};

	KeypathModel.prototype.removeChild = function removeChild( model ) {
		if ( model.ractive ) delete this.children[ model.ractive._guid ];
	};

	KeypathModel.prototype.teardown = function teardown () {
		var this$1 = this;

			if ( this.owner ) this.owner.removeChild( this );

		var keys = Object.keys( this.children );
		var i = keys.length;
		while ( i-- ) {
			this$1.children[ keys[i] ].teardown();
		}
	};

	KeypathModel.prototype.unregister = function unregister ( dep ) {
		removeFromArray( this.deps, dep );
		if ( !this.deps.length ) this.teardown();
	};

	KeypathModel.prototype.reference = noop;
	KeypathModel.prototype.unreference = noop;

	var hasProp = Object.prototype.hasOwnProperty;

	var shuffleTasks = { early: [], mark: [] };
	var registerQueue = { early: [], mark: [] };

	var ModelBase = function ModelBase ( parent ) {
		this.deps = [];

		this.children = [];
		this.childByKey = {};
		this.links = [];

		this.keyModels = {};

		this.unresolved = [];
		this.unresolvedByKey = {};

		this.bindings = [];
		this.patternObservers = [];

		if ( parent ) {
			this.parent = parent;
			this.root = parent.root;
		}
	};

	ModelBase.prototype.addUnresolved = function addUnresolved ( key, resolver ) {
		if ( !this.unresolvedByKey[ key ] ) {
			this.unresolved.push( key );
			this.unresolvedByKey[ key ] = [];
		}

		this.unresolvedByKey[ key ].push( resolver );
	};

	ModelBase.prototype.addShuffleTask = function addShuffleTask ( task, stage ) { if ( stage === void 0 ) stage = 'early';

		shuffleTasks[stage].push( task ); };
	ModelBase.prototype.addShuffleRegister = function addShuffleRegister ( item, stage ) { if ( stage === void 0 ) stage = 'early';

		registerQueue[stage].push({ model: this, item: item }); };

	ModelBase.prototype.clearUnresolveds = function clearUnresolveds ( specificKey ) {
		var this$1 = this;

			var i = this.unresolved.length;

		while ( i-- ) {
			var key = this$1.unresolved[i];

			if ( specificKey && key !== specificKey ) continue;

			var resolvers = this$1.unresolvedByKey[ key ];
			var hasKey = this$1.has( key );

			var j = resolvers.length;
			while ( j-- ) {
				if ( hasKey ) resolvers[j].attemptResolution();
				if ( resolvers[j].resolved ) resolvers.splice( j, 1 );
			}

			if ( !resolvers.length ) {
				this$1.unresolved.splice( i, 1 );
				this$1.unresolvedByKey[ key ] = null;
			}
		}
	};

	ModelBase.prototype.findMatches = function findMatches ( keys ) {
		var len = keys.length;

		var existingMatches = [ this ];
		var matches;
		var i;

		var loop = function (  ) {
			var key = keys[i];

			if ( key === '*' ) {
				matches = [];
				existingMatches.forEach( function ( model ) {
					matches.push.apply( matches, model.getValueChildren( model.get() ) );
				});
			} else {
				matches = existingMatches.map( function ( model ) { return model.joinKey( key ); } );
			}

			existingMatches = matches;
		};

			for ( i = 0; i < len; i += 1 ) loop(  );

		return matches;
	};

	ModelBase.prototype.getKeyModel = function getKeyModel ( key, skip ) {
		if ( key !== undefined && !skip ) return this.parent.getKeyModel( key, true );

		if ( !( key in this.keyModels ) ) this.keyModels[ key ] = new KeyModel( escapeKey( key ), this );

		return this.keyModels[ key ];
	};

	ModelBase.prototype.getKeypath = function getKeypath ( ractive ) {
		if ( ractive !== this.ractive && this._link ) return this._link.target.getKeypath( ractive );

		if ( !this.keypath ) {
			this.keypath = this.parent.isRoot ? this.key : ("" + (this.parent.getKeypath( ractive )) + "." + (escapeKey( this.key )));
		}

		return this.keypath;
	};

	ModelBase.prototype.getValueChildren = function getValueChildren ( value ) {
		var this$1 = this;

			var children;
		if ( isArray( value ) ) {
			children = [];
			if ( 'length' in this && this.length !== value.length ) {
				children.push( this.joinKey( 'length' ) );
			}
			value.forEach( function ( m, i ) {
				children.push( this$1.joinKey( i ) );
			});
		}

		else if ( isObject( value ) || typeof value === 'function' ) {
			children = Object.keys( value ).map( function ( key ) { return this$1.joinKey( key ); } );
		}

		else if ( value != null ) {
			return [];
		}

		return children;
	};

	ModelBase.prototype.getVirtual = function getVirtual ( shouldCapture ) {
		var this$1 = this;

			var value = this.get( shouldCapture, { virtual: false } );
		if ( isObject( value ) ) {
			var result = isArray( value ) ? [] : {};

			var keys = Object.keys( value );
			var i = keys.length;
			while ( i-- ) {
				var child = this$1.childByKey[ keys[i] ];
				if ( !child ) result[ keys[i] ] = value[ keys[i] ];
				else if ( child._link ) result[ keys[i] ] = child._link.getVirtual();
				else result[ keys[i] ] = child.getVirtual();
			}

			i = this.children.length;
			while ( i-- ) {
				var child$1 = this$1.children[i];
				if ( !( child$1.key in result ) && child$1._link ) {
					result[ child$1.key ] = child$1._link.getVirtual();
				}
			}

			return result;
		} else return value;
	};

	ModelBase.prototype.has = function has ( key ) {
		if ( this._link ) return this._link.has( key );

		var value = this.get();
		if ( !value ) return false;

		key = unescapeKey( key );
		if ( hasProp.call( value, key ) ) return true;

		// We climb up the constructor chain to find if one of them contains the key
		var constructor = value.constructor;
		while ( constructor !== Function && constructor !== Array && constructor !== Object ) {
			if ( hasProp.call( constructor.prototype, key ) ) return true;
			constructor = constructor.constructor;
		}

		return false;
	};

	ModelBase.prototype.joinAll = function joinAll ( keys, opts ) {
		var model = this;
		for ( var i = 0; i < keys.length; i += 1 ) {
			if ( opts && opts.lastLink === false && i + 1 === keys.length && model.childByKey[keys[i]] && model.childByKey[keys[i]]._link ) return model.childByKey[keys[i]];
			model = model.joinKey( keys[i], opts );
		}

		return model;
	};

	ModelBase.prototype.notifyUpstream = function notifyUpstream () {
		var parent = this.parent, path = [ this.key ];
		while ( parent ) {
			if ( parent.patternObservers.length ) parent.patternObservers.forEach( function ( o ) { return o.notify( path.slice() ); } );
			path.unshift( parent.key );
			parent.links.forEach( notifiedUpstream );
			parent.deps.forEach( handleChange );
			parent = parent.parent;
		}
	};

	ModelBase.prototype.rebinding = function rebinding ( next, previous, safe ) {
		// tell the deps to move to the new target
		var this$1 = this;

			var i = this.deps.length;
		while ( i-- ) {
			if ( this$1.deps[i].rebinding ) this$1.deps[i].rebinding( next, previous, safe );
		}

		i = this.links.length;
		while ( i-- ) {
			var link = this$1.links[i];
			// only relink the root of the link tree
			if ( link.owner._link ) link.relinking( next, true, safe );
		}

		i = this.children.length;
		while ( i-- ) {
			var child = this$1.children[i];
			child.rebinding( next ? next.joinKey( child.key ) : undefined, child, safe );
		}

		i = this.unresolved.length;
		while ( i-- ) {
			var unresolved = this$1.unresolvedByKey[ this$1.unresolved[i] ];
			var c = unresolved.length;
			while ( c-- ) {
				unresolved[c].rebinding( next, previous );
			}
		}

		if ( this.keypathModel ) this.keypathModel.rebinding( next, previous, false );

		i = this.bindings.length;
		while ( i-- ) {
			this$1.bindings[i].rebinding( next, previous, safe );
		}
	};

	ModelBase.prototype.reference = function reference () {
		'refs' in this ? this.refs++ : this.refs = 1;
	};

	ModelBase.prototype.register = function register ( dep ) {
		this.deps.push( dep );
	};

	ModelBase.prototype.registerChange = function registerChange ( key, value ) {
		if ( !this.isRoot ) {
			this.root.registerChange( key, value );
		} else {
			this.changes[ key ] = value;
			runloop.addInstance( this.root.ractive );
		}
	};

	ModelBase.prototype.registerLink = function registerLink ( link ) {
		addToArray( this.links, link );
	};

	ModelBase.prototype.registerPatternObserver = function registerPatternObserver ( observer ) {
		this.patternObservers.push( observer );
		this.register( observer );
	};

	ModelBase.prototype.registerTwowayBinding = function registerTwowayBinding ( binding ) {
		this.bindings.push( binding );
	};

	ModelBase.prototype.removeUnresolved = function removeUnresolved ( key, resolver ) {
		var resolvers = this.unresolvedByKey[ key ];

		if ( resolvers ) {
			removeFromArray( resolvers, resolver );
		}
	};

	ModelBase.prototype.shuffled = function shuffled () {
		var this$1 = this;

			var i = this.children.length;
		while ( i-- ) {
			this$1.children[i].shuffled();
		}
		if ( this.wrapper ) {
			this.wrapper.teardown();
			this.wrapper = null;
			this.rewrap = true;
		}
	};

	ModelBase.prototype.unreference = function unreference () {
		if ( 'refs' in this ) this.refs--;
	};

	ModelBase.prototype.unregister = function unregister ( dep ) {
		removeFromArray( this.deps, dep );
	};

	ModelBase.prototype.unregisterLink = function unregisterLink ( link ) {
		removeFromArray( this.links, link );
	};

	ModelBase.prototype.unregisterPatternObserver = function unregisterPatternObserver ( observer ) {
		removeFromArray( this.patternObservers, observer );
		this.unregister( observer );
	};

	ModelBase.prototype.unregisterTwowayBinding = function unregisterTwowayBinding ( binding ) {
		removeFromArray( this.bindings, binding );
	};

	ModelBase.prototype.updateFromBindings = function updateFromBindings$1 ( cascade ) {
		var this$1 = this;

			var i = this.bindings.length;
		while ( i-- ) {
			var value = this$1.bindings[i].getValue();
			if ( value !== this$1.value ) this$1.set( value );
		}

		// check for one-way bindings if there are no two-ways
		if ( !this.bindings.length ) {
			var oneway = findBoundValue( this.deps );
			if ( oneway && oneway.value !== this.value ) this.set( oneway.value );
		}

		if ( cascade ) {
			this.children.forEach( updateFromBindings );
			this.links.forEach( updateFromBindings );
			if ( this._link ) this._link.updateFromBindings( cascade );
		}
	};

	function updateFromBindings ( model ) {
		model.updateFromBindings( true );
	}

	function findBoundValue( list ) {
		var i = list.length;
		while ( i-- ) {
			if ( list[i].bound ) {
				var owner = list[i].owner;
				if ( owner ) {
					var value = owner.name === 'checked' ?
						owner.node.checked :
						owner.node.value;
					return { value: value };
				}
			}
		}
	}

	function fireShuffleTasks ( stage ) {
		if ( !stage ) {
			fireShuffleTasks( 'early' );
			fireShuffleTasks( 'mark' );
		} else {
			var tasks = shuffleTasks[stage];
			shuffleTasks[stage] = [];
			var i = tasks.length;
			while ( i-- ) tasks[i]();

			var register = registerQueue[stage];
			registerQueue[stage] = [];
			i = register.length;
			while ( i-- ) register[i].model.register( register[i].item );
		}
	}

	KeyModel.prototype.addShuffleTask = ModelBase.prototype.addShuffleTask;
	KeyModel.prototype.addShuffleRegister = ModelBase.prototype.addShuffleRegister;
	KeypathModel.prototype.addShuffleTask = ModelBase.prototype.addShuffleTask;
	KeypathModel.prototype.addShuffleRegister = ModelBase.prototype.addShuffleRegister;

	// this is the dry method of checking to see if a rebind applies to
	// a particular keypath because in some cases, a dep may be bound
	// directly to a particular keypath e.g. foo.bars.0.baz and need
	// to avoid getting kicked to foo.bars.1.baz if foo.bars is unshifted
	function rebindMatch ( template, next, previous ) {
		var keypath = template.r || template;

		// no valid keypath, go with next
		if ( !keypath || typeof keypath !== 'string' ) return next;

		// completely contextual ref, go with next
		if ( keypath === '.' || keypath[0] === '@' || (next || previous).isKey || (next || previous).isKeypath ) return next;

		var parts = keypath.split( '/' );
		var keys = splitKeypathI( parts[ parts.length - 1 ] );

		// check the keypath against the model keypath to see if it matches
		var model = next || previous;
		var i = keys.length;
		var match = true, shuffling = false;

		while ( model && i-- ) {
			if ( model.shuffling ) shuffling = true;
			// non-strict comparison to account for indices in keypaths
			if ( keys[i] != model.key ) match = false;
			model = model.parent;
		}

		// next is undefined, but keypath is shuffling and previous matches
		if ( !next && match && shuffling ) return previous;
		// next is defined, but doesn't match the keypath
		else if ( next && !match && shuffling ) return previous;
		else return next;
	}

	var LinkModel = (function (ModelBase) {
		function LinkModel ( parent, owner, target, key ) {
			ModelBase.call( this, parent );

			this.owner = owner;
			this.target = target;
			this.key = key === undefined ? owner.key : key;
			if ( owner.isLink ) this.sourcePath = "" + (owner.sourcePath) + "." + (this.key);

			target.registerLink( this );

			this.isReadonly = parent.isReadonly;

			this.isLink = true;
		}

		LinkModel.prototype = Object.create( ModelBase && ModelBase.prototype );
		LinkModel.prototype.constructor = LinkModel;

		LinkModel.prototype.animate = function animate ( from, to, options, interpolator ) {
			return this.target.animate( from, to, options, interpolator );
		};

		LinkModel.prototype.applyValue = function applyValue ( value ) {
			this.target.applyValue( value );
		};

		LinkModel.prototype.get = function get ( shouldCapture, opts ) {
			if ( shouldCapture ) {
				capture( this );

				// may need to tell the target to unwrap
				opts = opts || {};
				opts.unwrap = true;
			}

			return this.target.get( false, opts );
		};

		LinkModel.prototype.getKeypath = function getKeypath ( ractive ) {
			if ( ractive && ractive !== this.root.ractive ) return this.target.getKeypath( ractive );

			return ModelBase.prototype.getKeypath.call( this, ractive );
		};

		LinkModel.prototype.getKeypathModel = function getKeypathModel ( ractive ) {
			if ( !this.keypathModel ) this.keypathModel = new KeypathModel( this );
			if ( ractive && ractive !== this.root.ractive ) return this.keypathModel.getChild( ractive );
			return this.keypathModel;
		};

		LinkModel.prototype.handleChange = function handleChange$1 () {
			this.deps.forEach( handleChange );
			this.links.forEach( handleChange );
			this.notifyUpstream();
		};

		LinkModel.prototype.joinKey = function joinKey ( key ) {
			// TODO: handle nested links
			if ( key === undefined || key === '' ) return this;

			if ( !this.childByKey.hasOwnProperty( key ) ) {
				var child = new LinkModel( this, this, this.target.joinKey( key ), key );
				this.children.push( child );
				this.childByKey[ key ] = child;
			}

			return this.childByKey[ key ];
		};

		LinkModel.prototype.mark = function mark () {
			this.target.mark();
		};

		LinkModel.prototype.marked = function marked$1 () {
			this.links.forEach( marked );

			this.deps.forEach( handleChange );
			this.clearUnresolveds();
		};

		LinkModel.prototype.markedAll = function markedAll$1 () {
			this.children.forEach( markedAll );
			this.marked();
		};

		LinkModel.prototype.notifiedUpstream = function notifiedUpstream$1 () {
			this.links.forEach( notifiedUpstream );
			this.deps.forEach( handleChange );
		};

		LinkModel.prototype.relinked = function relinked () {
			this.target.registerLink( this );
			this.children.forEach( function ( c ) { return c.relinked(); } );
		};

		LinkModel.prototype.relinking = function relinking ( target, root, safe ) {
			var this$1 = this;

			if ( root && this.sourcePath ) target = rebindMatch( this.sourcePath, target, this.target );
			if ( !target || this.target === target ) return;

			this.target.unregisterLink( this );
			if ( this.keypathModel ) this.keypathModel.rebindChildren( target );

			this.target = target;
			this.children.forEach( function ( c ) {
				c.relinking( target.joinKey( c.key ), false, safe );
			});

			if ( root ) this.addShuffleTask( function () {
				this$1.relinked();
				if ( !safe ) this$1.notifyUpstream();
			});
		};

		LinkModel.prototype.set = function set ( value ) {
			this.target.set( value );
		};

		LinkModel.prototype.shuffle = function shuffle ( newIndices ) {
			// watch for extra shuffles caused by a shuffle in a downstream link
			var this$1 = this;

			if ( this.shuffling ) return;

			// let the real model handle firing off shuffles
			if ( !this.target.shuffling ) {
				this.target.shuffle( newIndices );
			} else {
				this.shuffling = true;

				var i = newIndices.length;
				while ( i-- ) {
					var idx = newIndices[ i ];
					// nothing is actually changing, so move in the index and roll on
					if ( i === idx ) {
						continue;
					}

					// rebind the children on i to idx
					if ( i in this$1.childByKey ) this$1.childByKey[ i ].rebinding( !~idx ? undefined : this$1.joinKey( idx ), this$1.childByKey[ i ], true );

					if ( !~idx && this$1.keyModels[ i ] ) {
						this$1.keyModels[i].rebinding( undefined, this$1.keyModels[i], false );
					} else if ( ~idx && this$1.keyModels[ i ] ) {
						if ( !this$1.keyModels[ idx ] ) this$1.childByKey[ idx ].getKeyModel( idx );
						this$1.keyModels[i].rebinding( this$1.keyModels[ idx ], this$1.keyModels[i], false );
					}
				}

				var upstream = this.source().length !== this.source().value.length;

				this.links.forEach( function ( l ) { return l.shuffle( newIndices ); } );

				i = this.deps.length;
				while ( i-- ) {
					if ( this$1.deps[i].shuffle ) this$1.deps[i].shuffle( newIndices );
				}

				this.marked();

				if ( upstream ) this.notifyUpstream();

				this.shuffling = false;
			}

		};

		LinkModel.prototype.source = function source () {
			if ( this.target.source ) return this.target.source();
			else return this.target;
		};

		LinkModel.prototype.teardown = function teardown$1 () {
			if ( this._link ) this._link.teardown();
			this.target.unregisterLink( this );
			this.children.forEach( teardown );
		};

		return LinkModel;
	}(ModelBase));

	ModelBase.prototype.link = function link ( model, keypath ) {
		var lnk = this._link || new LinkModel( this.parent, this, model, this.key );
		lnk.sourcePath = keypath;
		if ( this._link ) this._link.relinking( model, true, false );
		this.rebinding( lnk, this, false );
		fireShuffleTasks();

		var unresolved = !this._link;
		this._link = lnk;
		if ( unresolved ) this.parent.clearUnresolveds();
		lnk.markedAll();
		return lnk;
	};

	ModelBase.prototype.unlink = function unlink () {
		if ( this._link ) {
			var ln = this._link;
			this._link = undefined;
			ln.rebinding( this, this._link );
			fireShuffleTasks();
			ln.teardown();
		}
	};

	var requestAnimationFrame;

	// If window doesn't exist, we don't need requestAnimationFrame
	if ( !win ) {
		requestAnimationFrame = null;
	} else {
		// https://gist.github.com/paulirish/1579671
		(function(vendors, lastTime, win) {

			var x, setTimeout;

			if ( win.requestAnimationFrame ) {
				return;
			}

			for ( x = 0; x < vendors.length && !win.requestAnimationFrame; ++x ) {
				win.requestAnimationFrame = win[vendors[x]+'RequestAnimationFrame'];
			}

			if ( !win.requestAnimationFrame ) {
				setTimeout = win.setTimeout;

				win.requestAnimationFrame = function(callback) {
					var currTime, timeToCall, id;

					currTime = Date.now();
					timeToCall = Math.max( 0, 16 - (currTime - lastTime ) );
					id = setTimeout( function() { callback(currTime + timeToCall); }, timeToCall );

					lastTime = currTime + timeToCall;
					return id;
				};
			}

		}( vendors, 0, win ));

		requestAnimationFrame = win.requestAnimationFrame;
	}

	var rAF = requestAnimationFrame;

	var getTime = ( win && win.performance && typeof win.performance.now === 'function' ) ?
		function () { return win.performance.now(); } :
		function () { return Date.now(); };

	// TODO what happens if a transition is aborted?

	var tickers = [];
	var running = false;

	function tick () {
		runloop.start();

		var now = getTime();

		var i;
		var ticker;

		for ( i = 0; i < tickers.length; i += 1 ) {
			ticker = tickers[i];

			if ( !ticker.tick( now ) ) {
				// ticker is complete, remove it from the stack, and decrement i so we don't miss one
				tickers.splice( i--, 1 );
			}
		}

		runloop.end();

		if ( tickers.length ) {
			rAF( tick );
		} else {
			running = false;
		}
	}

	var Ticker = function Ticker ( options ) {
		this.duration = options.duration;
		this.step = options.step;
		this.complete = options.complete;
		this.easing = options.easing;

		this.start = getTime();
		this.end = this.start + this.duration;

		this.running = true;

		tickers.push( this );
		if ( !running ) rAF( tick );
	};

	Ticker.prototype.tick = function tick$1 ( now ) {
		if ( !this.running ) return false;

		if ( now > this.end ) {
			if ( this.step ) this.step( 1 );
			if ( this.complete ) this.complete( 1 );

			return false;
		}

		var elapsed = now - this.start;
		var eased = this.easing( elapsed / this.duration );

		if ( this.step ) this.step( eased );

		return true;
	};

	Ticker.prototype.stop = function stop () {
		if ( this.abort ) this.abort();
		this.running = false;
	};

	var prefixers = {};

	// TODO this is legacy. sooner we can replace the old adaptor API the better
	function prefixKeypath ( obj, prefix ) {
		var prefixed = {}, key;

		if ( !prefix ) {
			return obj;
		}

		prefix += '.';

		for ( key in obj ) {
			if ( obj.hasOwnProperty( key ) ) {
				prefixed[ prefix + key ] = obj[ key ];
			}
		}

		return prefixed;
	}

	function getPrefixer ( rootKeypath ) {
		var rootDot;

		if ( !prefixers[ rootKeypath ] ) {
			rootDot = rootKeypath ? rootKeypath + '.' : '';

			prefixers[ rootKeypath ] = function ( relativeKeypath, value ) {
				var obj;

				if ( typeof relativeKeypath === 'string' ) {
					obj = {};
					obj[ rootDot + relativeKeypath ] = value;
					return obj;
				}

				if ( typeof relativeKeypath === 'object' ) {
					// 'relativeKeypath' is in fact a hash, not a keypath
					return rootDot ? prefixKeypath( relativeKeypath, rootKeypath ) : relativeKeypath;
				}
			};
		}

		return prefixers[ rootKeypath ];
	}

	var Model = (function (ModelBase) {
		function Model ( parent, key ) {
			ModelBase.call( this, parent );

			this.ticker = null;

			if ( parent ) {
				this.key = unescapeKey( key );
				this.isReadonly = parent.isReadonly;

				if ( parent.value ) {
					this.value = parent.value[ this.key ];
					if ( isArray( this.value ) ) this.length = this.value.length;
					this.adapt();
				}
			}
		}

		Model.prototype = Object.create( ModelBase && ModelBase.prototype );
		Model.prototype.constructor = Model;

		Model.prototype.adapt = function adapt () {
			var this$1 = this;

			var adaptors = this.root.adaptors;
			var len = adaptors.length;

			this.rewrap = false;

			// Exit early if no adaptors
			if ( len === 0 ) return;

			var value = this.wrapper ? ( 'newWrapperValue' in this ? this.newWrapperValue : this.wrapperValue ) : this.value;

			// TODO remove this legacy nonsense
			var ractive = this.root.ractive;
			var keypath = this.getKeypath();

			// tear previous adaptor down if present
			if ( this.wrapper ) {
				var shouldTeardown = this.wrapperValue === value ? false : !this.wrapper.reset || this.wrapper.reset( value ) === false;

				if ( shouldTeardown ) {
					this.wrapper.teardown();
					this.wrapper = null;

					// don't branch for undefined values
					if ( this.value !== undefined ) {
						var parentValue = this.parent.value || this.parent.createBranch( this.key );
						if ( parentValue[ this.key ] !== value ) parentValue[ this.key ] = value;
					}
				} else {
					delete this.newWrapperValue;
					this.wrapperValue = value;
					this.value = this.wrapper.get();
					return;
				}
			}

			var i;

			for ( i = 0; i < len; i += 1 ) {
				var adaptor = adaptors[i];
				if ( adaptor.filter( value, keypath, ractive ) ) {
					this$1.wrapper = adaptor.wrap( ractive, value, keypath, getPrefixer( keypath ) );
					this$1.wrapperValue = value;
					this$1.wrapper.__model = this$1; // massive temporary hack to enable array adaptor

					this$1.value = this$1.wrapper.get();

					break;
				}
			}
		};

		Model.prototype.animate = function animate ( from, to, options, interpolator ) {
			var this$1 = this;

			if ( this.ticker ) this.ticker.stop();

			var fulfilPromise;
			var promise = new Promise$1( function ( fulfil ) { return fulfilPromise = fulfil; } );

			this.ticker = new Ticker({
				duration: options.duration,
				easing: options.easing,
				step: function ( t ) {
					var value = interpolator( t );
					this$1.applyValue( value );
					if ( options.step ) options.step( t, value );
				},
				complete: function () {
					this$1.applyValue( to );
					if ( options.complete ) options.complete( to );

					this$1.ticker = null;
					fulfilPromise();
				}
			});

			promise.stop = this.ticker.stop;
			return promise;
		};

		Model.prototype.applyValue = function applyValue ( value ) {
			if ( isEqual( value, this.value ) ) return;

			// TODO deprecate this nonsense
			this.registerChange( this.getKeypath(), value );

			if ( this.parent.wrapper && this.parent.wrapper.set ) {
				this.parent.wrapper.set( this.key, value );
				this.parent.value = this.parent.wrapper.get();

				this.value = this.parent.value[ this.key ];
				if ( this.wrapper ) this.newWrapperValue = this.value;
				this.adapt();
			} else if ( this.wrapper ) {
				this.newWrapperValue = value;
				this.adapt();
			} else {
				var parentValue = this.parent.value || this.parent.createBranch( this.key );
				parentValue[ this.key ] = value;

				this.value = value;
				this.adapt();
			}

			this.parent.clearUnresolveds();
			this.clearUnresolveds();

			// keep track of array stuff
			if ( isArray( value ) ) {
				this.length = value.length;
				this.isArray = true;
			} else {
				this.isArray = false;
			}

			// notify dependants
			this.links.forEach( handleChange );
			this.children.forEach( mark );
			this.deps.forEach( handleChange );

			this.notifyUpstream();

			if ( this.parent.isArray ) {
				if ( this.key === 'length' ) this.parent.length = value;
				else this.parent.joinKey( 'length' ).mark();
			}
		};

		Model.prototype.createBranch = function createBranch ( key ) {
			var branch = isNumeric( key ) ? [] : {};
			this.set( branch );

			return branch;
		};

		Model.prototype.get = function get ( shouldCapture, opts ) {
			if ( this._link ) return this._link.get( shouldCapture, opts );
			if ( shouldCapture ) capture( this );
			// if capturing, this value needs to be unwrapped because it's for external use
			if ( opts && opts.virtual ) return this.getVirtual( false );
			return ( shouldCapture || ( opts && opts.unwrap ) ) && this.wrapper ? this.wrapperValue : this.value;
		};

		Model.prototype.getKeypathModel = function getKeypathModel ( ractive ) {
			if ( !this.keypathModel ) this.keypathModel = new KeypathModel( this );
			return this.keypathModel;
		};

		Model.prototype.joinKey = function joinKey ( key, opts ) {
			if ( this._link ) {
				if ( opts && !opts.lastLink === false && ( key === undefined || key === '' ) ) return this;
				return this._link.joinKey( key );
			}

			if ( key === undefined || key === '' ) return this;


			if ( !this.childByKey.hasOwnProperty( key ) ) {
				var child = new Model( this, key );
				this.children.push( child );
				this.childByKey[ key ] = child;
			}

			if ( this.childByKey[ key ]._link ) return this.childByKey[ key ]._link;
			return this.childByKey[ key ];
		};

		Model.prototype.mark = function mark$1 () {
			if ( this._link ) return this._link.mark();

			var value = this.retrieve();

			if ( !isEqual( value, this.value ) ) {
				var old = this.value;
				this.value = value;

				// make sure the wrapper stays in sync
				if ( old !== value || this.rewrap ) {
					if ( this.wrapper ) this.newWrapperValue = value;
					this.adapt();
				}

				// keep track of array stuff
				if ( isArray( value ) ) {
					this.length = value.length;
					this.isArray = true;
				} else {
					this.isArray = false;
				}

				this.children.forEach( mark );
				this.links.forEach( marked );

				this.deps.forEach( handleChange );
				this.clearUnresolveds();
			}
		};

		Model.prototype.merge = function merge ( array, comparator ) {
			var oldArray = this.value, newArray = array;
			if ( oldArray === newArray ) oldArray = recreateArray( this );
			if ( comparator ) {
				oldArray = oldArray.map( comparator );
				newArray = newArray.map( comparator );
			}

			var oldLength = oldArray.length;

			var usedIndices = {};
			var firstUnusedIndex = 0;

			var newIndices = oldArray.map( function ( item ) {
				var index;
				var start = firstUnusedIndex;

				do {
					index = newArray.indexOf( item, start );

					if ( index === -1 ) {
						return -1;
					}

					start = index + 1;
				} while ( ( usedIndices[ index ] === true ) && start < oldLength );

				// keep track of the first unused index, so we don't search
				// the whole of newArray for each item in oldArray unnecessarily
				if ( index === firstUnusedIndex ) {
					firstUnusedIndex += 1;
				}
				// allow next instance of next "equal" to be found item
				usedIndices[ index ] = true;
				return index;
			});

			this.parent.value[ this.key ] = array;
			this.shuffle( newIndices );
		};

		Model.prototype.retrieve = function retrieve () {
			return this.parent.value ? this.parent.value[ this.key ] : undefined;
		};

		Model.prototype.set = function set ( value ) {
			if ( this.ticker ) this.ticker.stop();
			this.applyValue( value );
		};

		Model.prototype.shuffle = function shuffle ( newIndices ) {
			var this$1 = this;

			this.shuffling = true;
			var i = newIndices.length;
			while ( i-- ) {
				var idx = newIndices[ i ];
				// nothing is actually changing, so move in the index and roll on
				if ( i === idx ) {
					continue;
				}

				// rebind the children on i to idx
				if ( i in this$1.childByKey ) this$1.childByKey[ i ].rebinding( !~idx ? undefined : this$1.joinKey( idx ), this$1.childByKey[ i ], true );

				if ( !~idx && this$1.keyModels[ i ] ) {
					this$1.keyModels[i].rebinding( undefined, this$1.keyModels[i], false );
				} else if ( ~idx && this$1.keyModels[ i ] ) {
					if ( !this$1.keyModels[ idx ] ) this$1.childByKey[ idx ].getKeyModel( idx );
					this$1.keyModels[i].rebinding( this$1.keyModels[ idx ], this$1.keyModels[i], false );
				}
			}

			var upstream = this.length !== this.value.length;

			this.links.forEach( function ( l ) { return l.shuffle( newIndices ); } );
			fireShuffleTasks( 'early' );

			i = this.deps.length;
			while ( i-- ) {
				if ( this$1.deps[i].shuffle ) this$1.deps[i].shuffle( newIndices );
			}

			this.mark();
			fireShuffleTasks( 'mark' );

			if ( upstream ) this.notifyUpstream();
			this.shuffling = false;
		};

		Model.prototype.teardown = function teardown$1 () {
			if ( this._link ) this._link.teardown();
			this.children.forEach( teardown );
			if ( this.wrapper ) this.wrapper.teardown();
			if ( this.keypathModel ) this.keypathModel.teardown();
		};

		return Model;
	}(ModelBase));

	function recreateArray( model ) {
		var array = [];

		for ( var i = 0; i < model.length; i++ ) {
			array[ i ] = (model.childByKey[i] || {}).value;
		}

		return array;
	}

	var GlobalModel = (function (Model) {
		function GlobalModel ( ) {
			Model.call( this, null, '@global' );
			this.value = typeof global !== 'undefined' ? global : window;
			this.isRoot = true;
			this.root = this;
			this.adaptors = [];
		}

		GlobalModel.prototype = Object.create( Model && Model.prototype );
		GlobalModel.prototype.constructor = GlobalModel;

		GlobalModel.prototype.getKeypath = function getKeypath() {
			return '@global';
		};

		// global model doesn't contribute changes events because it has no instance
		GlobalModel.prototype.registerChange = function registerChange () {};

		return GlobalModel;
	}(Model));

	var GlobalModel$1 = new GlobalModel();

	var keypathExpr = /^@[^\(]+\(([^\)]+)\)/;

	function resolveReference ( fragment, ref ) {
		var context = fragment.findContext();

		// special references
		// TODO does `this` become `.` at parse time?
		if ( ref === '.' || ref === 'this' ) return context;
		if ( ref.indexOf( '@keypath' ) === 0 ) {
			var match = keypathExpr.exec( ref );
			if ( match && match[1] ) {
				var model = resolveReference( fragment, match[1] );
				if ( model ) return model.getKeypathModel();
			}
			return context.getKeypathModel();
		}
		if ( ref.indexOf( '@rootpath' ) === 0 ) {
			// check to see if this is an empty component root
			while ( context.isRoot && context.ractive.component ) {
				context = context.ractive.component.parentFragment.findContext();
			}

			var match$1 = keypathExpr.exec( ref );
			if ( match$1 && match$1[1] ) {
				var model$1 = resolveReference( fragment, match$1[1] );
				if ( model$1 ) return model$1.getKeypathModel( fragment.ractive.root );
			}
			return context.getKeypathModel( fragment.ractive.root );
		}
		if ( ref === '@index' || ref === '@key' ) {
			var repeater = fragment.findRepeatingFragment();
			// make sure the found fragment is actually an iteration
			if ( !repeater.isIteration ) return;
			return repeater.context.getKeyModel( repeater[ ref[1] === 'i' ? 'index' : 'key' ] );
		}
		if ( ref === '@this' ) {
			return fragment.ractive.viewmodel.getRactiveModel();
		}
		if ( ref === '@global' ) {
			return GlobalModel$1;
		}

		// ancestor references
		if ( ref[0] === '~' ) return fragment.ractive.viewmodel.joinAll( splitKeypathI( ref.slice( 2 ) ) );
		if ( ref[0] === '.' ) {
			var parts = ref.split( '/' );

			while ( parts[0] === '.' || parts[0] === '..' ) {
				var part = parts.shift();

				if ( part === '..' ) {
					context = context.parent;
				}
			}

			ref = parts.join( '/' );

			// special case - `{{.foo}}` means the same as `{{./foo}}`
			if ( ref[0] === '.' ) ref = ref.slice( 1 );
			return context.joinAll( splitKeypathI( ref ) );
		}

		return resolveAmbiguousReference( fragment, ref );
	}

	function Ractive$get ( keypath, opts ) {
		if ( typeof keypath !== 'string' ) return this.viewmodel.get( true, keypath );

		var keys = splitKeypathI( keypath );
		var key = keys[0];

		var model;

		if ( !this.viewmodel.has( key ) ) {
			// if this is an inline component, we may need to create
			// an implicit mapping
			if ( this.component && !this.isolated ) {
				model = resolveReference( this.component.parentFragment, key );

				if ( model ) {
					this.viewmodel.map( key, model );
				}
			}
		}

		model = this.viewmodel.joinAll( keys );
		return model.get( true, opts );
	}

	function gatherRefs( fragment ) {
		var key = {}, index = {};

		// walk up the template gather refs as we go
		while ( fragment ) {
			if ( fragment.parent && ( fragment.parent.indexRef || fragment.parent.keyRef ) ) {
				var ref = fragment.parent.indexRef;
				if ( ref && !( ref in index ) ) index[ref] = fragment.index;
				ref = fragment.parent.keyRef;
				if ( ref && !( ref in key ) ) key[ref] = fragment.key;
			}

			if ( fragment.componentParent && !fragment.ractive.isolated ) {
				fragment = fragment.componentParent;
			} else {
				fragment = fragment.parent;
			}
		}

		return { key: key, index: index };
	}

	// This function takes an array, the name of a mutator method, and the
	// arguments to call that mutator method with, and returns an array that
	// maps the old indices to their new indices.

	// So if you had something like this...
	//
	//     array = [ 'a', 'b', 'c', 'd' ];
	//     array.push( 'e' );
	//
	// ...you'd get `[ 0, 1, 2, 3 ]` - in other words, none of the old indices
	// have changed. If you then did this...
	//
	//     array.unshift( 'z' );
	//
	// ...the indices would be `[ 1, 2, 3, 4, 5 ]` - every item has been moved
	// one higher to make room for the 'z'. If you removed an item, the new index
	// would be -1...
	//
	//     array.splice( 2, 2 );
	//
	// ...this would result in [ 0, 1, -1, -1, 2, 3 ].
	//
	// This information is used to enable fast, non-destructive shuffling of list
	// sections when you do e.g. `ractive.splice( 'items', 2, 2 );

	function getNewIndices ( length, methodName, args ) {
		var spliceArguments, newIndices = [], removeStart, removeEnd, balance, i;

		spliceArguments = getSpliceEquivalent( length, methodName, args );

		if ( !spliceArguments ) {
			return null; // TODO support reverse and sort?
		}

		balance = ( spliceArguments.length - 2 ) - spliceArguments[1];

		removeStart = Math.min( length, spliceArguments[0] );
		removeEnd = removeStart + spliceArguments[1];
		newIndices.startIndex = removeStart;

		for ( i = 0; i < removeStart; i += 1 ) {
			newIndices.push( i );
		}

		for ( ; i < removeEnd; i += 1 ) {
			newIndices.push( -1 );
		}

		for ( ; i < length; i += 1 ) {
			newIndices.push( i + balance );
		}

		// there is a net shift for the rest of the array starting with index + balance
		if ( balance !== 0 ) {
			newIndices.touchedFrom = spliceArguments[0];
		} else {
			newIndices.touchedFrom = length;
		}

		return newIndices;
	}


	// The pop, push, shift an unshift methods can all be represented
	// as an equivalent splice
	function getSpliceEquivalent ( length, methodName, args ) {
		switch ( methodName ) {
			case 'splice':
				if ( args[0] !== undefined && args[0] < 0 ) {
					args[0] = length + Math.max( args[0], -length );
				}

				if ( args[0] === undefined ) args[0] = 0;

				while ( args.length < 2 ) {
					args.push( length - args[0] );
				}

				if ( typeof args[1] !== 'number' ) {
					args[1] = length - args[0];
				}

				// ensure we only remove elements that exist
				args[1] = Math.min( args[1], length - args[0] );

				return args;

			case 'sort':
			case 'reverse':
				return null;

			case 'pop':
				if ( length ) {
					return [ length - 1, 1 ];
				}
				return [ 0, 0 ];

			case 'push':
				return [ length, 0 ].concat( args );

			case 'shift':
				return [ 0, length ? 1 : 0 ];

			case 'unshift':
				return [ 0, 0 ].concat( args );
		}
	}

	var arrayProto = Array.prototype;

	function makeArrayMethod ( methodName ) {
		function path ( keypath ) {
			var args = [], len = arguments.length - 1;
			while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

			return model( this.viewmodel.joinAll( splitKeypathI( keypath ) ), args );
		}

		function model ( mdl, args ) {
			var array = mdl.get();

			if ( !isArray( array ) ) {
				if ( array === undefined ) {
					array = [];
					var result$1 = arrayProto[ methodName ].apply( array, args );
					var promise$1 = runloop.start( this, true ).then( function () { return result$1; } );
					mdl.set( array );
					runloop.end();
					return promise$1;
				} else {
					throw new Error( ("shuffle array method " + methodName + " called on non-array at " + (mdl.getKeypath())) );
				}
			}

			var newIndices = getNewIndices( array.length, methodName, args );
			var result = arrayProto[ methodName ].apply( array, args );

			var promise = runloop.start( this, true ).then( function () { return result; } );
			promise.result = result;

			if ( newIndices ) {
				mdl.shuffle( newIndices );
			} else {
				mdl.set( result );
			}

			runloop.end();

			return promise;
		}

		return { path: path, model: model };
	}

	var comparators = {};

	function getComparator ( option ) {
		if ( !option ) return null; // use existing arrays
		if ( option === true ) return JSON.stringify;
		if ( typeof option === 'function' ) return option;

		if ( typeof option === 'string' ) {
			return comparators[ option ] || ( comparators[ option ] = function ( thing ) { return thing[ option ]; } );
		}

		throw new Error( 'If supplied, options.compare must be a string, function, or `true`' ); // TODO link to docs
	}

	function merge$1 ( ractive, model, array, options ) {
		var promise = runloop.start( ractive, true );
		var value = model.get();

		if ( !isArray( value ) || !isArray( array ) ) {
			throw new Error( 'You cannot merge an array with a non-array' );
		}

		var comparator = getComparator( options && options.compare );
		model.merge( array, comparator );

		runloop.end();
		return promise;
	}

	function thisRactive$merge ( keypath, array, options ) {
		return merge$1( this, this.viewmodel.joinAll( splitKeypathI( keypath ) ), array, options );
	}

	var updateHook = new Hook( 'update' );

	function update$2 ( ractive, model ) {
		// if the parent is wrapped, the adaptor will need to be updated before
		// updating on this keypath
		if ( model.parent && model.parent.wrapper ) {
			model.parent.adapt();
		}

		var promise = runloop.start( ractive, true );

		model.mark();
		model.registerChange( model.getKeypath(), model.get() );

		if ( !model.isRoot ) {
			// there may be unresolved refs that are now resolvable up the context tree
			var parent = model.parent, key = model.key;
			while ( parent && !parent.isRoot ) {
				if ( parent.clearUnresolveds ) parent.clearUnresolveds( key );
				key = parent.key;
				parent = parent.parent;
			}
		}

		// notify upstream of changes
		model.notifyUpstream();

		runloop.end();

		updateHook.fire( ractive, model );

		return promise;
	}

	function Ractive$update ( keypath ) {
		if ( keypath ) keypath = splitKeypathI( keypath );

		return update$2( this, keypath ? this.viewmodel.joinAll( keypath ) : this.viewmodel );
	}

	var modelPush = makeArrayMethod( 'push' ).model;
	var modelPop = makeArrayMethod( 'pop' ).model;
	var modelShift = makeArrayMethod( 'shift' ).model;
	var modelUnshift = makeArrayMethod( 'unshift' ).model;
	var modelSort = makeArrayMethod( 'sort' ).model;
	var modelSplice = makeArrayMethod( 'splice' ).model;
	var modelReverse = makeArrayMethod( 'reverse' ).model;

	// TODO: at some point perhaps this could support relative * keypaths?
	function build$1 ( el, keypath, value ) {
		var sets = [];

		// set multiple keypaths in one go
		if ( isObject( keypath ) ) {
			for ( var k in keypath ) {
				if ( keypath.hasOwnProperty( k ) ) {
					sets.push( [ findModel( el, k ).model, keypath[k] ] );
				}
			}

		}
		// set a single keypath
		else {
			sets.push( [ findModel( el, keypath ).model, value ] );
		}

		return sets;
	}

	// get relative keypaths and values
	function get ( keypath ) {
		if ( !keypath ) return this._element.parentFragment.findContext().get( true );

		var model = resolveReference( this._element.parentFragment, keypath );

		return model ? model.get( true ) : undefined;
	}

	function resolve$1 ( path, ractive ) {
		var ref = findModel( this, path ), model = ref.model, instance = ref.instance;
		return model ? model.getKeypath( ractive || instance ) : path;
	}

	function findModel ( el, path ) {
		var frag = el._element.parentFragment;

		if ( typeof path !== 'string' ) {
			return { model: frag.findContext(), instance: path };
		}

		return { model: resolveReference( frag, path ), instance: frag.ractive };
	}

	// the usual mutation suspects
	function add$1 ( keypath, value ) {
		if ( value === undefined ) value = 1;
		if ( !isNumeric( value ) ) throw new Error( 'Bad arguments' );
		return set( this.ractive, build$1( this, keypath, value ).map( function ( pair ) {
			var model = pair[0], val = pair[1], value = model.get();
			if ( !isNumeric( val ) || !isNumeric( value ) ) throw new Error( 'Cannot add non-numeric value' );
			return [ model, value + val ];
		}) );
	}

	function animate ( keypath, value, options ) {
		var model = findModel( this, keypath ).model;
		return protoAnimate( this.ractive, model, value, options );
	}

	function link ( source, dest ) {
		var there = findModel( this, source ).model, here = findModel( this, dest ).model;
		var promise = runloop.start( this.ractive, true );
		here.link( there, source );
		runloop.end();
		return promise;
	}

	function merge ( keypath, array, options ) {
		return merge$1( this.ractive, findModel( this, keypath ).model, array, options );
	}

	function pop ( keypath ) {
		return modelPop( findModel( this, keypath ).model, [] );
	}

	function push ( keypath ) {
		var values = [], len = arguments.length - 1;
		while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];

		return modelPush( findModel( this, keypath ).model, values );
	}

	function reverse ( keypath ) {
		return modelReverse( findModel( this, keypath ).model, [] );
	}

	function set$1 ( keypath, value ) {
		return set( this.ractive, build$1( this, keypath, value ) );
	}

	function shift ( keypath ) {
		return modelShift( findModel( this, keypath ).model, [] );
	}

	function splice ( keypath, index, drop ) {
		var add = [], len = arguments.length - 3;
		while ( len-- > 0 ) add[ len ] = arguments[ len + 3 ];

		add.unshift( index, drop );
		return modelSplice( findModel( this, keypath ).model, add );
	}

	function sort ( keypath ) {
		return modelSort( findModel( this, keypath ).model, [] );
	}

	function subtract ( keypath, value ) {
		if ( value === undefined ) value = 1;
		if ( !isNumeric( value ) ) throw new Error( 'Bad arguments' );
		return set( this.ractive, build$1( this, keypath, value ).map( function ( pair ) {
			var model = pair[0], val = pair[1], value = model.get();
			if ( !isNumeric( val ) || !isNumeric( value ) ) throw new Error( 'Cannot add non-numeric value' );
			return [ model, value - val ];
		}) );
	}

	function toggle ( keypath ) {
		var ref = findModel( this, keypath ), model = ref.model;
		return set( this.ractive, [ [ model, !model.get() ] ] );
	}

	function unlink ( dest ) {
		var here = findModel( this, dest ).model;
		var promise = runloop.start( this.ractive, true );
		if ( here.owner && here.owner._link ) here.owner.unlink();
		runloop.end();
		return promise;
	}

	function unshift ( keypath ) {
		var add = [], len = arguments.length - 1;
		while ( len-- > 0 ) add[ len ] = arguments[ len + 1 ];

		return modelUnshift( findModel( this, keypath ).model, add );
	}

	function update$1 ( keypath ) {
		return update$2( this.ractive, findModel( this, keypath ).model );
	}

	function updateModel ( keypath, cascade ) {
		var ref = findModel( this, keypath ), model = ref.model;
		var promise = runloop.start( this.ractive, true );
		model.updateFromBindings( cascade );
		runloop.end();
		return promise;
	}

	// two-way binding related helpers
	function isBound () {
		var ref = getBindingModel( this ), model = ref.model;
		return !!model;
	}

	function getBindingPath ( ractive ) {
		var ref = getBindingModel( this ), model = ref.model, instance = ref.instance;
		if ( model ) return model.getKeypath( ractive || instance );
	}

	function getBinding () {
		var ref = getBindingModel( this ), model = ref.model;
		if ( model ) return model.get( true );
	}

	function getBindingModel ( ctx ) {
		var el = ctx._element;
		return { model: el.binding && el.binding.model, instance: el.parentFragment.ractive };
	}

	function setBinding ( value ) {
		var ref = getBindingModel( this ), model = ref.model;
		return set( this.ractive, [ [ model, value ] ] );
	}

	// deprecated getters
	function keypath () {
		warnOnceIfDebug( ("Object property keypath is deprecated, please use resolve() instead.") );
		return this.resolve();
	}

	function rootpath () {
		warnOnceIfDebug( ("Object property rootpath is deprecated, please use resolve( ractive.root ) instead.") );
		return this.resolve( this.ractive.root );
	}

	function context () {
		warnOnceIfDebug( ("Object property context is deprecated, please use get() instead.") );
		return this.get();
	}

	function index () {
		warnOnceIfDebug( ("Object property index is deprecated, you can use get( \"indexName\" ) instead.") );
		return gatherRefs( this._element.parentFragment ).index;
	}

	function key () {
		warnOnceIfDebug( ("Object property key is deprecated, you can use get( \"keyName\" ) instead.") );
		return gatherRefs( this._element.parentFragment ).key;
	}

	function addHelpers ( obj, element ) {
		defineProperties( obj, {
			_element: { value: element },
			ractive: { value: element.parentFragment.ractive },
			resolve: { value: resolve$1 },
			get: { value: get },

			add: { value: add$1 },
			animate: { value: animate },
			link: { value: link },
			merge: { value: merge },
			pop: { value: pop },
			push: { value: push },
			reverse: { value: reverse },
			set: { value: set$1 },
			shift: { value: shift },
			sort: { value: sort },
			splice: { value: splice },
			subtract: { value: subtract },
			toggle: { value: toggle },
			unlink: { value: unlink },
			unshift: { value: unshift },
			update: { value: update$1 },
			updateModel: { value: updateModel },

			isBound: { value: isBound },
			getBindingPath: { value: getBindingPath },
			getBinding: { value: getBinding },
			setBinding: { value: setBinding },

			keypath: { get: keypath },
			rootpath: { get: rootpath },
			context: { get: context },
			index: { get: index },
			key: { get: key }
		});

		return obj;
	}

	var query = doc && doc.querySelector;

	function staticInfo( node ) {
		if ( typeof node === 'string' && query ) {
			node = query.call( document, node );
		}

		if ( !node || !node._ractive ) return undefined;

		var storage = node._ractive;

		return addHelpers( {}, storage.proxy );
	}

	function getNodeInfo( node ) {
		if ( typeof node === 'string' ) {
			node = this.find( node );
		}

		return staticInfo( node );
	}

	var insertHook = new Hook( 'insert' );

	function Ractive$insert ( target, anchor ) {
		if ( !this.fragment.rendered ) {
			// TODO create, and link to, documentation explaining this
			throw new Error( 'The API has changed - you must call `ractive.render(target[, anchor])` to render your Ractive instance. Once rendered you can use `ractive.insert()`.' );
		}

		target = getElement( target );
		anchor = getElement( anchor ) || null;

		if ( !target ) {
			throw new Error( 'You must specify a valid target to insert into' );
		}

		target.insertBefore( this.detach(), anchor );
		this.el = target;

		( target.__ractive_instances__ || ( target.__ractive_instances__ = [] ) ).push( this );
		this.isDetached = false;

		fireInsertHook( this );
	}

	function fireInsertHook( ractive ) {
		insertHook.fire( ractive );

		ractive.findAllComponents('*').forEach( function ( child ) {
			fireInsertHook( child.instance );
		});
	}

	function link$1( there, here ) {
		if ( here === there || (there + '.').indexOf( here + '.' ) === 0 || (here + '.').indexOf( there + '.' ) === 0 ) {
			throw new Error( 'A keypath cannot be linked to itself.' );
		}

		var promise = runloop.start();
		var model;

		// may need to allow a mapping to resolve implicitly
		var sourcePath = splitKeypathI( there );
		if ( !this.viewmodel.has( sourcePath[0] ) && this.component ) {
			model = resolveReference( this.component.parentFragment, sourcePath[0] );
			model = model.joinAll( sourcePath.slice( 1 ) );
		}

		this.viewmodel.joinAll( splitKeypathI( here ) ).link( model || this.viewmodel.joinAll( sourcePath ), there );

		runloop.end();

		return promise;
	}

	var ReferenceResolver = function ReferenceResolver ( fragment, reference, callback ) {
		var this$1 = this;

			this.fragment = fragment;
		this.reference = normalise( reference );
		this.callback = callback;

		this.keys = splitKeypathI( reference );
		this.resolved = false;

		this.contexts = [];

		// TODO the consumer should take care of addUnresolved
		// we attach to all the contexts between here and the root
		// - whenever their values change, they can quickly
		// check to see if we can resolve
		while ( fragment ) {
			if ( fragment.context ) {
				fragment.context.addUnresolved( this$1.keys[0], this$1 );
				this$1.contexts.push( fragment.context );
			}

			fragment = fragment.componentParent || fragment.parent;
		}
	};

	ReferenceResolver.prototype.attemptResolution = function attemptResolution () {
		if ( this.resolved ) return;

		var model = resolveAmbiguousReference( this.fragment, this.reference );

		if ( model ) {
			this.resolved = true;
			this.callback( model );
		}
	};

	ReferenceResolver.prototype.forceResolution = function forceResolution () {
		if ( this.resolved ) return;

		var model = this.fragment.findContext().joinAll( this.keys );
		this.callback( model );
		this.resolved = true;
	};

	ReferenceResolver.prototype.rebinding = function rebinding ( next, previous ) {
		var this$1 = this;

			if ( previous ) previous.removeUnresolved( this.keys[0], this );

		this.next = next;
		if ( next ) runloop.scheduleTask( function () {
			if ( next === this$1.next ) {
				next.addUnresolved( this$1.keys[0], this$1 );
				this$1.next = null;
			}
		});
	};

	ReferenceResolver.prototype.unbind = function unbind () {
		var this$1 = this;

			if ( this.fragment ) removeFromArray( this.fragment.unresolved, this );

		if ( this.resolved ) return;

		this.contexts.forEach( function ( c ) { return c.removeUnresolved( this$1.keys[0], this$1 ); } );
	};

	function observe ( keypath, callback, options ) {
		var this$1 = this;

		if ( this.torndown ) return { cancel: function() {} };

		var observers = [];
		var map;

		if ( isObject( keypath ) ) {
			map = keypath;
			options = callback || {};

			Object.keys( map ).forEach( function ( keypath ) {
				var callback = map[ keypath ];

				var keypaths = keypath.split( ' ' );
				if ( keypaths.length > 1 ) keypaths = keypaths.filter( function ( k ) { return k; } );

				keypaths.forEach( function ( keypath ) {
					observers.push( createObserver( this$1, keypath, callback, options ) );
				});
			});
		}

		else {
			var keypaths;

			if ( typeof keypath === 'function' ) {
				options = callback;
				callback = keypath;
				keypaths = [ '' ];
			} else {
				keypaths = keypath.split( ' ' );
			}

			if ( keypaths.length > 1 ) keypaths = keypaths.filter( function ( k ) { return k; } );

			keypaths.forEach( function ( keypath ) {
				observers.push( createObserver( this$1, keypath, callback, options || {} ) );
			});
		}

		// add observers to the Ractive instance, so they can be
		// cancelled on ractive.teardown()
		this._observers.push.apply( this._observers, observers );

		return {
			cancel: function () {
				observers.forEach( function ( observer ) {
					removeFromArray ( this$1._observers, observer );
					observer.cancel();
				} );
			}
		};
	}

	function createObserver ( ractive, keypath, callback, options ) {
		var viewmodel = ractive.viewmodel;

		var keys = splitKeypathI( keypath );
		var wildcardIndex = keys.indexOf( '*' );
		options.keypath = keypath;

		// normal keypath - no wildcards
		if ( !~wildcardIndex ) {
			var key = keys[0];
			var model;

			// if not the root model itself, check if viewmodel has key.
			if ( key !== '' && !viewmodel.has( key ) ) {
				// if this is an inline component, we may need to create an implicit mapping
				if ( ractive.component && !ractive.isolated ) {
					model = resolveReference( ractive.component.parentFragment, key );
					if ( model ) {
						viewmodel.map( key, model );
						model = viewmodel.joinAll( keys );
					}
				}
			} else {
				model = viewmodel.joinAll( keys );
			}

			return new Observer( ractive, model, callback, options );
		}

		// pattern observers - more complex case
		var baseModel = wildcardIndex === 0 ?
			viewmodel :
			viewmodel.joinAll( keys.slice( 0, wildcardIndex ) );

		return new PatternObserver( ractive, baseModel, keys.splice( wildcardIndex ), callback, options );
	}

	var Observer = function Observer ( ractive, model, callback, options ) {
		var this$1 = this;

			this.context = options.context || ractive;
		this.callback = callback;
		this.ractive = ractive;

		if ( model ) this.resolved( model );
		else {
			this.keypath = options.keypath;
			this.resolver = new ReferenceResolver( ractive.fragment, options.keypath, function ( model ) {
				this$1.resolved( model );
			});
		}

		if ( options.init !== false ) {
			this.dirty = true;
			this.dispatch();
		} else {
			this.oldValue = this.newValue;
		}

		this.defer = options.defer;
		this.once = options.once;
		this.strict = options.strict;

		this.dirty = false;
	};

	Observer.prototype.cancel = function cancel () {
		this.cancelled = true;
		if ( this.model ) {
			this.model.unregister( this );
		} else {
			this.resolver.unbind();
		}
	};

	Observer.prototype.dispatch = function dispatch () {
		if ( !this.cancelled ) {
			this.callback.call( this.context, this.newValue, this.oldValue, this.keypath );
			this.oldValue = this.model ? this.model.get() : this.newValue;
			this.dirty = false;
		}
	};

	Observer.prototype.handleChange = function handleChange () {
		var this$1 = this;

			if ( !this.dirty ) {
			var newValue = this.model.get();
			if ( isEqual( newValue, this.oldValue ) ) return;

			this.newValue = newValue;

			if ( this.strict && this.newValue === this.oldValue ) return;

			runloop.addObserver( this, this.defer );
			this.dirty = true;

			if ( this.once ) runloop.scheduleTask( function () { return this$1.cancel(); } );
		}
	};

	Observer.prototype.rebinding = function rebinding ( next, previous ) {
		var this$1 = this;

			next = rebindMatch( this.keypath, next, previous );
		// TODO: set up a resolver if next is undefined?
		if ( next === this.model ) return false;

		if ( this.model ) this.model.unregister( this );
		if ( next ) next.addShuffleTask( function () { return this$1.resolved( next ); } );
	};

	Observer.prototype.resolved = function resolved ( model ) {
		this.model = model;
		this.keypath = model.getKeypath( this.ractive );

		this.oldValue = undefined;
		this.newValue = model.get();

		model.register( this );
	};

	var PatternObserver = function PatternObserver ( ractive, baseModel, keys, callback, options ) {
		var this$1 = this;

			this.context = options.context || ractive;
		this.ractive = ractive;
		this.baseModel = baseModel;
		this.keys = keys;
		this.callback = callback;

		var pattern = keys.join( '\\.' ).replace( /\*/g, '(.+)' );
		var baseKeypath = baseModel.getKeypath( ractive );
		this.pattern = new RegExp( ("^" + (baseKeypath ? baseKeypath + '\\.' : '') + "" + pattern + "$") );

		this.oldValues = {};
		this.newValues = {};

		this.defer = options.defer;
		this.once = options.once;
		this.strict = options.strict;

		this.dirty = false;
		this.changed = [];
		this.partial = false;

		var models = baseModel.findMatches( this.keys );

		models.forEach( function ( model ) {
			this$1.newValues[ model.getKeypath( this$1.ractive ) ] = model.get();
		});

		if ( options.init !== false ) {
			this.dispatch();
		} else {
			this.oldValues = this.newValues;
		}

		baseModel.registerPatternObserver( this );
	};

	PatternObserver.prototype.cancel = function cancel () {
		this.baseModel.unregisterPatternObserver( this );
	};

	PatternObserver.prototype.dispatch = function dispatch () {
		var this$1 = this;

			var newValues = this.newValues;
		this.newValues = {};
		Object.keys( newValues ).forEach( function ( keypath ) {
			if ( this$1.newKeys && !this$1.newKeys[ keypath ] ) return;

			var newValue = newValues[ keypath ];
			var oldValue = this$1.oldValues[ keypath ];

			if ( this$1.strict && newValue === oldValue ) return;
			if ( isEqual( newValue, oldValue ) ) return;

			var args = [ newValue, oldValue, keypath ];
			if ( keypath ) {
				var wildcards = this$1.pattern.exec( keypath );
				if ( wildcards ) {
					args = args.concat( wildcards.slice( 1 ) );
				}
			}

			this$1.callback.apply( this$1.context, args );
		});

		if ( this.partial ) {
			for ( var k in newValues ) {
				this.oldValues[k] = newValues[k];
			}
		} else {
			this.oldValues = newValues;
		}

		this.newKeys = null;
		this.dirty = false;
	};

	PatternObserver.prototype.notify = function notify ( key ) {
		this.changed.push( key );
	};

	PatternObserver.prototype.shuffle = function shuffle ( newIndices ) {
		var this$1 = this;

			if ( !isArray( this.baseModel.value ) ) return;

		var base = this.baseModel.getKeypath( this.ractive );
		var max = this.baseModel.value.length;
		var suffix = this.keys.length > 1 ? '.' + this.keys.slice( 1 ).join( '.' ) : '';

		this.newKeys = {};
		for ( var i = 0; i < newIndices.length; i++ ) {
			if ( newIndices[ i ] === -1 || newIndices[ i ] === i ) continue;
			this$1.newKeys[ ("" + base + "." + i + "" + suffix) ] = true;
		}

		for ( var i$1 = newIndices.touchedFrom; i$1 < max; i$1++ ) {
			this$1.newKeys[ ("" + base + "." + i$1 + "" + suffix) ] = true;
		}
	};

	PatternObserver.prototype.handleChange = function handleChange () {
		var this$1 = this;

			if ( !this.dirty || this.changed.length ) {
			if ( !this.dirty ) this.newValues = {};

			// handle case where previously extant keypath no longer exists -
			// observer should still fire, with undefined as new value
			// TODO huh. according to the test suite that's not the case...
			// NOTE: I don't think this will work with partial updates
			// Object.keys( this.oldValues ).forEach( keypath => {
			// this.newValues[ keypath ] = undefined;
			// });

			if ( !this.changed.length ) {
				this.baseModel.findMatches( this.keys ).forEach( function ( model ) {
					var keypath = model.getKeypath( this$1.ractive );
					this$1.newValues[ keypath ] = model.get();
				});
				this.partial = false;
			} else {
				var count = 0;
				var ok = this.baseModel.isRoot ?
					this.changed.map( function ( keys ) { return keys.map( escapeKey ).join( '.' ); } ) :
					this.changed.map( function ( keys ) { return this$1.baseModel.getKeypath( this$1.ractive ) + '.' + keys.map( escapeKey ).join( '.' ); } );

				this.baseModel.findMatches( this.keys ).forEach( function ( model ) {
					var keypath = model.getKeypath( this$1.ractive );
					var check = function ( k ) {
						return ( k.indexOf( keypath ) === 0 && ( k.length === keypath.length || k[ keypath.length ] === '.' ) ) ||
								   ( keypath.indexOf( k ) === 0 && ( k.length === keypath.length || keypath[ k.length ] === '.' ) );
					};

					// is this model on a changed keypath?
					if ( ok.filter( check ).length ) {
						count++;
						this$1.newValues[ keypath ] = model.get();
					}
				});

				// no valid change triggered, so bail to avoid breakage
				if ( !count ) return;

				this.partial = true;
			}

			runloop.addObserver( this, this.defer );
			this.dirty = true;
			this.changed.length = 0;

			if ( this.once ) this.cancel();
		}
	};

	function observeList ( keypath, callback, options ) {
		if ( typeof keypath !== 'string' ) {
			throw new Error( 'ractive.observeList() must be passed a string as its first argument' );
		}

		var model = this.viewmodel.joinAll( splitKeypathI( keypath ) );
		var observer = new ListObserver( this, model, callback, options || {} );

		// add observer to the Ractive instance, so it can be
		// cancelled on ractive.teardown()
		this._observers.push( observer );

		return {
			cancel: function () {
				observer.cancel();
			}
		};
	}

	function negativeOne () {
		return -1;
	}

	var ListObserver = function ListObserver ( context, model, callback, options ) {
		this.context = context;
		this.model = model;
		this.keypath = model.getKeypath();
		this.callback = callback;

		this.pending = null;

		model.register( this );

		if ( options.init !== false ) {
			this.sliced = [];
			this.shuffle([]);
			this.handleChange();
		} else {
			this.sliced = this.slice();
		}
	};

	ListObserver.prototype.handleChange = function handleChange () {
		if ( this.pending ) {
			// post-shuffle
			this.callback( this.pending );
			this.pending = null;
		}

		else {
			// entire array changed
			this.shuffle( this.sliced.map( negativeOne ) );
			this.handleChange();
		}
	};

	ListObserver.prototype.shuffle = function shuffle ( newIndices ) {
		var this$1 = this;

			var newValue = this.slice();

		var inserted = [];
		var deleted = [];
		var start;

		var hadIndex = {};

		newIndices.forEach( function ( newIndex, oldIndex ) {
			hadIndex[ newIndex ] = true;

			if ( newIndex !== oldIndex && start === undefined ) {
				start = oldIndex;
			}

			if ( newIndex === -1 ) {
				deleted.push( this$1.sliced[ oldIndex ] );
			}
		});

		if ( start === undefined ) start = newIndices.length;

		var len = newValue.length;
		for ( var i = 0; i < len; i += 1 ) {
			if ( !hadIndex[i] ) inserted.push( newValue[i] );
		}

		this.pending = { inserted: inserted, deleted: deleted, start: start };
		this.sliced = newValue;
	};

	ListObserver.prototype.slice = function slice () {
		var value = this.model.get();
		return isArray( value ) ? value.slice() : [];
	};

	var onceOptions = { init: false, once: true };

	function observeOnce ( keypath, callback, options ) {
		if ( isObject( keypath ) || typeof keypath === 'function' ) {
			options = extendObj( callback || {}, onceOptions );
			return this.observe( keypath, options );
		}

		options = extendObj( options || {}, onceOptions );
		return this.observe( keypath, callback, options );
	}

	function trim ( str ) { return str.trim(); };

	function notEmptyString ( str ) { return str !== ''; };

	function Ractive$off ( eventName, callback ) {
		// if no arguments specified, remove all callbacks
		var this$1 = this;

		if ( !eventName ) {
			// TODO use this code instead, once the following issue has been resolved
			// in PhantomJS (tests are unpassable otherwise!)
			// https://github.com/ariya/phantomjs/issues/11856
			// defineProperty( this, '_subs', { value: create( null ), configurable: true });
			for ( eventName in this._subs ) {
				delete this._subs[ eventName ];
			}
		}

		else {
			// Handle multiple space-separated event names
			var eventNames = eventName.split( ' ' ).map( trim ).filter( notEmptyString );

			eventNames.forEach( function ( eventName ) {
				var subscribers = this$1._subs[ eventName ];

				// If we have subscribers for this event...
				if ( subscribers ) {
					// ...if a callback was specified, only remove that
					if ( callback ) {
						// flag this callback as off so that any in-flight firings don't call
						// a cancelled handler - this is _slightly_ hacky
						var i = subscribers.length;
						while ( i-- ) {
							if ( subscribers[i].callback === callback ) {
								subscribers[i].off = true;
								subscribers.splice( i, 1 );
							}
						}
					}

					// ...otherwise remove all callbacks
					else {
						this$1._subs[ eventName ] = [];
					}
				}
			});
		}

		return this;
	}

	function Ractive$on ( eventName, callback ) {
		// allow multiple listeners to be bound in one go
		var this$1 = this;

		if ( typeof eventName === 'object' ) {
			var listeners = [];
			var n;

			for ( n in eventName ) {
				if ( eventName.hasOwnProperty( n ) ) {
					listeners.push( this.on( n, eventName[ n ] ) );
				}
			}

			return {
				cancel: function () { listeners.forEach( function ( l ) { return l.cancel(); } ); }
			};
		}

		// Handle multiple space-separated event names
		var eventNames = eventName.split( ' ' ).map( trim ).filter( notEmptyString );

		eventNames.forEach( function ( eventName ) {
			( this$1._subs[ eventName ] || ( this$1._subs[ eventName ] = [] ) ).push( { callback: callback } );
		});

		return {
			cancel: function () { return eventNames.forEach( function ( n ) { return this$1.off( n, callback ); } ); }
		};
	}

	function Ractive$once ( eventName, handler ) {
		var listener = this.on( eventName, function () {
			handler.apply( this, arguments );
			listener.cancel();
		});

		// so we can still do listener.cancel() manually
		return listener;
	}

	var pop$1 = makeArrayMethod( 'pop' ).path;

	var push$1 = makeArrayMethod( 'push' ).path;

	var PREFIX = '/* Ractive.js component styles */';

	// Holds current definitions of styles.
	var styleDefinitions = [];

	// Flag to tell if we need to update the CSS
	var isDirty = false;

	// These only make sense on the browser. See additional setup below.
	var styleElement = null;
	var useCssText = null;

	function addCSS( styleDefinition ) {
		styleDefinitions.push( styleDefinition );
		isDirty = true;
	}

	function applyCSS() {

		// Apply only seems to make sense when we're in the DOM. Server-side renders
		// can call toCSS to get the updated CSS.
		if ( !doc || !isDirty ) return;

		if ( useCssText ) {
			styleElement.styleSheet.cssText = getCSS( null );
		} else {
			styleElement.innerHTML = getCSS( null );
		}

		isDirty = false;
	}

	function getCSS( cssIds ) {

		var filteredStyleDefinitions = cssIds ? styleDefinitions.filter( function ( style ) { return ~cssIds.indexOf( style.id ); } ) : styleDefinitions;

		return filteredStyleDefinitions.reduce( function ( styles, style ) { return ("" + styles + "\n\n/* {" + (style.id) + "} */\n" + (style.styles)); }, PREFIX );

	}

	// If we're on the browser, additional setup needed.
	if ( doc && ( !styleElement || !styleElement.parentNode ) ) {

		styleElement = doc.createElement( 'style' );
		styleElement.type = 'text/css';

		doc.getElementsByTagName( 'head' )[ 0 ].appendChild( styleElement );

		useCssText = !!styleElement.styleSheet;
	}

	var renderHook = new Hook( 'render' );
	var completeHook = new Hook( 'complete' );

	function render$1 ( ractive, target, anchor, occupants ) {
		// if `noIntro` is `true`, temporarily disable transitions
		var transitionsEnabled = ractive.transitionsEnabled;
		if ( ractive.noIntro ) ractive.transitionsEnabled = false;

		var promise = runloop.start( ractive, true );
		runloop.scheduleTask( function () { return renderHook.fire( ractive ); }, true );

		if ( ractive.fragment.rendered ) {
			throw new Error( 'You cannot call ractive.render() on an already rendered instance! Call ractive.unrender() first' );
		}

		anchor = getElement( anchor ) || ractive.anchor;

		ractive.el = target;
		ractive.anchor = anchor;

		// ensure encapsulated CSS is up-to-date
		if ( ractive.cssId ) applyCSS();

		if ( target ) {
			( target.__ractive_instances__ || ( target.__ractive_instances__ = [] ) ).push( ractive );

			if ( anchor ) {
				var docFrag = doc.createDocumentFragment();
				ractive.fragment.render( docFrag );
				target.insertBefore( docFrag, anchor );
			} else {
				ractive.fragment.render( target, occupants );
			}
		}

		runloop.end();
		ractive.transitionsEnabled = transitionsEnabled;

		return promise.then( function () { return completeHook.fire( ractive ); } );
	}

	function Ractive$render ( target, anchor ) {
		if ( this.torndown ) {
			warnIfDebug( 'ractive.render() was called on a Ractive instance that was already torn down' );
			return Promise.resolve();
		}

		target = getElement( target ) || this.el;

		if ( !this.append && target ) {
			// Teardown any existing instances *before* trying to set up the new one -
			// avoids certain weird bugs
			var others = target.__ractive_instances__;
			if ( others ) others.forEach( teardown );

			// make sure we are the only occupants
			if ( !this.enhance ) {
				target.innerHTML = ''; // TODO is this quicker than removeChild? Initial research inconclusive
			}
		}

		var occupants = this.enhance ? toArray( target.childNodes ) : null;
		var promise = render$1( this, target, anchor, occupants );

		if ( occupants ) {
			while ( occupants.length ) target.removeChild( occupants.pop() );
		}

		return promise;
	}

	var adaptConfigurator = {
		extend: function ( Parent, proto, options ) {
			proto.adapt = combine( proto.adapt, ensureArray( options.adapt ) );
		},

		init: function () {}
	};

	function combine ( a, b ) {
		var c = a.slice();
		var i = b.length;

		while ( i-- ) {
			if ( !~c.indexOf( b[i] ) ) {
				c.push( b[i] );
			}
		}

		return c;
	}

	var remove = /\/\*(?:[\s\S]*?)\*\//g;
	var escape = /url\(\s*(['"])(?:\\[\s\S]|(?!\1).)*\1\s*\)|url\((?:\\[\s\S]|[^)])*\)|(['"])(?:\\[\s\S]|(?!\2).)*\2/gi;
	var value = /\0(\d+)/g;

	// Removes comments and strings from the given CSS to make it easier to parse.
	// Callback receives the cleaned CSS and a function which can be used to put
	// the removed strings back in place after parsing is done.
	function cleanCss ( css, callback, additionalReplaceRules ) {
		if ( additionalReplaceRules === void 0 ) additionalReplaceRules = [];

		var values = [];
		var reconstruct = function ( css ) { return css.replace( value, function ( match, n ) { return values[ n ]; } ); };
		css = css.replace( escape, function ( match ) { return ("\u0000" + (values.push( match ) - 1)); }).replace( remove, '' );

		additionalReplaceRules.forEach( function ( pattern ) {
			css = css.replace( pattern, function ( match ) { return ("\u0000" + (values.push( match ) - 1)); } );
		});

		return callback( css, reconstruct );
	}

	var selectorsPattern = /(?:^|\}|\{)\s*([^\{\}\0]+)\s*(?=\{)/g;
	var keyframesDeclarationPattern = /@keyframes\s+[^\{\}]+\s*\{(?:[^{}]+|\{[^{}]+})*}/gi;
	var selectorUnitPattern = /((?:(?:\[[^\]]+\])|(?:[^\s\+\>~:]))+)((?:::?[^\s\+\>\~\(:]+(?:\([^\)]+\))?)*\s*[\s\+\>\~]?)\s*/g;
	var excludePattern = /^(?:@|\d+%)/;
	var dataRvcGuidPattern = /\[data-ractive-css~="\{[a-z0-9-]+\}"]/g;

	function trim$1 ( str ) {
		return str.trim();
	}

	function extractString ( unit ) {
		return unit.str;
	}

	function transformSelector ( selector, parent ) {
		var selectorUnits = [];
		var match;

		while ( match = selectorUnitPattern.exec( selector ) ) {
			selectorUnits.push({
				str: match[0],
				base: match[1],
				modifiers: match[2]
			});
		}

		// For each simple selector within the selector, we need to create a version
		// that a) combines with the id, and b) is inside the id
		var base = selectorUnits.map( extractString );

		var transformed = [];
		var i = selectorUnits.length;

		while ( i-- ) {
			var appended = base.slice();

			// Pseudo-selectors should go after the attribute selector
			var unit = selectorUnits[i];
			appended[i] = unit.base + parent + unit.modifiers || '';

			var prepended = base.slice();
			prepended[i] = parent + ' ' + prepended[i];

			transformed.push( appended.join( ' ' ), prepended.join( ' ' ) );
		}

		return transformed.join( ', ' );
	}

	function transformCss ( css, id ) {
		var dataAttr = "[data-ractive-css~=\"{" + id + "}\"]";

		var transformed;

		if ( dataRvcGuidPattern.test( css ) ) {
			transformed = css.replace( dataRvcGuidPattern, dataAttr );
		} else {
			transformed = cleanCss( css, function ( css, reconstruct ) {
				css = css.replace( selectorsPattern, function ( match, $1 ) {
					// don't transform at-rules and keyframe declarations
					if ( excludePattern.test( $1 ) ) return match;

					var selectors = $1.split( ',' ).map( trim$1 );
					var transformed = selectors
						.map( function ( selector ) { return transformSelector( selector, dataAttr ); } )
						.join( ', ' ) + ' ';

					return match.replace( $1, transformed );
				});

				return reconstruct( css );
			}, [ keyframesDeclarationPattern ]);
		}

		return transformed;
	}

	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}

	function uuid() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	var cssConfigurator = {
		name: 'css',

		// Called when creating a new component definition
		extend: function ( Parent, proto, options ) {
			if ( !options.css ) return;

			var id = uuid();
			var styles = options.noCssTransform ? options.css : transformCss( options.css, id );

			proto.cssId = id;

			addCSS( { id: id, styles: styles } );

		},

		// Called when creating a new component instance
		init: function ( Parent, target, options ) {
			if ( !options.css ) return;

			warnIfDebug( ("\nThe css option is currently not supported on a per-instance basis and will be discarded. Instead, we recommend instantiating from a component definition with a css option.\n\nconst Component = Ractive.extend({\n\t...\n\tcss: '/* your css */',\n\t...\n});\n\nconst componentInstance = new Component({ ... })\n\t\t") );
		}

	};

	function validate ( data ) {
		// Warn if userOptions.data is a non-POJO
		if ( data && data.constructor !== Object ) {
			if ( typeof data === 'function' ) {
				// TODO do we need to support this in the new Ractive() case?
			} else if ( typeof data !== 'object' ) {
				fatal( ("data option must be an object or a function, `" + data + "` is not valid") );
			} else {
				warnIfDebug( 'If supplied, options.data should be a plain JavaScript object - using a non-POJO as the root object may work, but is discouraged' );
			}
		}
	}

	var dataConfigurator = {
		name: 'data',

		extend: function ( Parent, proto, options ) {
			var key;
			var value;

			// check for non-primitives, which could cause mutation-related bugs
			if ( options.data && isObject( options.data ) ) {
				for ( key in options.data ) {
					value = options.data[ key ];

					if ( value && typeof value === 'object' ) {
						if ( isObject( value ) || isArray( value ) ) {
							warnIfDebug( ("Passing a `data` option with object and array properties to Ractive.extend() is discouraged, as mutating them is likely to cause bugs. Consider using a data function instead:\n\n  // this...\n  data: function () {\n    return {\n      myObject: {}\n    };\n  })\n\n  // instead of this:\n  data: {\n    myObject: {}\n  }") );
						}
					}
				}
			}

			proto.data = combine$1( proto.data, options.data );
		},

		init: function ( Parent, ractive, options ) {
			var result = combine$1( Parent.prototype.data, options.data );

			if ( typeof result === 'function' ) result = result.call( ractive );

			// bind functions to the ractive instance at the top level,
			// unless it's a non-POJO (in which case alarm bells should ring)
			if ( result && result.constructor === Object ) {
				for ( var prop in result ) {
					if ( typeof result[ prop ] === 'function' ) result[ prop ] = bind( result[ prop ], ractive );
				}
			}

			return result || {};
		},

		reset: function ( ractive ) {
			var result = this.init( ractive.constructor, ractive, ractive.viewmodel );
			ractive.viewmodel.root.set( result );
			return true;
		}
	};

	function combine$1 ( parentValue, childValue ) {
		validate( childValue );

		var parentIsFn = typeof parentValue === 'function';
		var childIsFn = typeof childValue === 'function';

		// Very important, otherwise child instance can become
		// the default data object on Ractive or a component.
		// then ractive.set() ends up setting on the prototype!
		if ( !childValue && !parentIsFn ) {
			childValue = {};
		}

		// Fast path, where we just need to copy properties from
		// parent to child
		if ( !parentIsFn && !childIsFn ) {
			return fromProperties( childValue, parentValue );
		}

		return function () {
			var child = childIsFn ? callDataFunction( childValue, this ) : childValue;
			var parent = parentIsFn ? callDataFunction( parentValue, this ) : parentValue;

			return fromProperties( child, parent );
		};
	}

	function callDataFunction ( fn, context ) {
		var data = fn.call( context );

		if ( !data ) return;

		if ( typeof data !== 'object' ) {
			fatal( 'Data function must return an object' );
		}

		if ( data.constructor !== Object ) {
			warnOnceIfDebug( 'Data function returned something other than a plain JavaScript object. This might work, but is strongly discouraged' );
		}

		return data;
	}

	function fromProperties ( primary, secondary ) {
		if ( primary && secondary ) {
			for ( var key in secondary ) {
				if ( !( key in primary ) ) {
					primary[ key ] = secondary[ key ];
				}
			}

			return primary;
		}

		return primary || secondary;
	}

	var TEMPLATE_VERSION = 4;

	var pattern = /\$\{([^\}]+)\}/g;

	function fromExpression ( body, length ) {
		if ( length === void 0 ) length = 0;

		var args = new Array( length );

		while ( length-- ) {
			args[length] = "_" + length;
		}

		// Functions created directly with new Function() look like this:
		//     function anonymous (_0 /**/) { return _0*2 }
		//
		// With this workaround, we get a little more compact:
		//     function (_0){return _0*2}
		return new Function( [], ("return function (" + (args.join(',')) + "){return(" + body + ");};") )();
	}

	function fromComputationString ( str, bindTo ) {
		var hasThis;

		var functionBody = 'return (' + str.replace( pattern, function ( match, keypath ) {
			hasThis = true;
			return ("__ractive.get(\"" + keypath + "\")");
		}) + ');';

		if ( hasThis ) functionBody = "var __ractive = this; " + functionBody;
		var fn = new Function( functionBody );
		return hasThis ? fn.bind( bindTo ) : fn;
	}

	var functions = create( null );

	function getFunction ( str, i ) {
		if ( functions[ str ] ) return functions[ str ];
		return functions[ str ] = createFunction( str, i );
	}

	function addFunctions( template ) {
		if ( !template ) return;

		var exp = template.e;

		if ( !exp ) return;

		Object.keys( exp ).forEach( function ( str ) {
			if ( functions[ str ] ) return;
			functions[ str ] = exp[ str ];
		});
	}

	var Parser;
	var ParseError;
	var leadingWhitespace = /^\s+/;
	ParseError = function ( message ) {
		this.name = 'ParseError';
		this.message = message;
		try {
			throw new Error(message);
		} catch (e) {
			this.stack = e.stack;
		}
	};

	ParseError.prototype = Error.prototype;

	Parser = function ( str, options ) {
		var this$1 = this;

		var items, item, lineStart = 0;

		this.str = str;
		this.options = options || {};
		this.pos = 0;

		this.lines = this.str.split( '\n' );
		this.lineEnds = this.lines.map( function ( line ) {
			var lineEnd = lineStart + line.length + 1; // +1 for the newline

			lineStart = lineEnd;
			return lineEnd;
		}, 0 );

		// Custom init logic
		if ( this.init ) this.init( str, options );

		items = [];

		while ( ( this$1.pos < this$1.str.length ) && ( item = this$1.read() ) ) {
			items.push( item );
		}

		this.leftover = this.remaining();
		this.result = this.postProcess ? this.postProcess( items, options ) : items;
	};

	Parser.prototype = {
		read: function ( converters ) {
			var this$1 = this;

			var pos, i, len, item;

			if ( !converters ) converters = this.converters;

			pos = this.pos;

			len = converters.length;
			for ( i = 0; i < len; i += 1 ) {
				this$1.pos = pos; // reset for each attempt

				if ( item = converters[i]( this$1 ) ) {
					return item;
				}
			}

			return null;
		},

		getContextMessage: function ( pos, message ) {
			var ref = this.getLinePos( pos ), lineNum = ref[0], columnNum = ref[1];
			if ( this.options.contextLines === -1 ) {
				return [ lineNum, columnNum, ("" + message + " at line " + lineNum + " character " + columnNum) ];
			}

			var line = this.lines[ lineNum - 1 ];

			var contextUp = '';
			var contextDown = '';
			if ( this.options.contextLines ) {
				var start = lineNum - 1 - this.options.contextLines < 0 ? 0 : lineNum - 1 - this.options.contextLines;
				contextUp = this.lines.slice( start, lineNum - 1 - start ).join( '\n' ).replace( /\t/g, '  ' );
				contextDown = this.lines.slice( lineNum, lineNum + this.options.contextLines ).join( '\n' ).replace( /\t/g, '  ' );
				if ( contextUp ) {
					contextUp += '\n';
				}
				if ( contextDown ) {
					contextDown = '\n' + contextDown;
				}
			}

			var numTabs = 0;
			var annotation = contextUp + line.replace( /\t/g, function ( match, char ) {
				if ( char < columnNum ) {
					numTabs += 1;
				}

				return '  ';
			}) + '\n' + new Array( columnNum + numTabs ).join( ' ' ) + '^----' + contextDown;

			return [ lineNum, columnNum, ("" + message + " at line " + lineNum + " character " + columnNum + ":\n" + annotation) ];
		},

		getLinePos: function ( char ) {
			var this$1 = this;

			var lineNum = 0, lineStart = 0, columnNum;

			while ( char >= this$1.lineEnds[ lineNum ] ) {
				lineStart = this$1.lineEnds[ lineNum ];
				lineNum += 1;
			}

			columnNum = char - lineStart;
			return [ lineNum + 1, columnNum + 1, char ]; // line/col should be one-based, not zero-based!
		},

		error: function ( message ) {
			var ref = this.getContextMessage( this.pos, message ), lineNum = ref[0], columnNum = ref[1], msg = ref[2];

			var error = new ParseError( msg );

			error.line = lineNum;
			error.character = columnNum;
			error.shortMessage = message;

			throw error;
		},

		matchString: function ( string ) {
			if ( this.str.substr( this.pos, string.length ) === string ) {
				this.pos += string.length;
				return string;
			}
		},

		matchPattern: function ( pattern ) {
			var match;

			if ( match = pattern.exec( this.remaining() ) ) {
				this.pos += match[0].length;
				return match[1] || match[0];
			}
		},

		allowWhitespace: function () {
			this.matchPattern( leadingWhitespace );
		},

		remaining: function () {
			return this.str.substring( this.pos );
		},

		nextChar: function () {
			return this.str.charAt( this.pos );
		}
	};

	Parser.extend = function ( proto ) {
		var Parent = this, Child, key;

		Child = function ( str, options ) {
			Parser.call( this, str, options );
		};

		Child.prototype = create( Parent.prototype );

		for ( key in proto ) {
			if ( hasOwn.call( proto, key ) ) {
				Child.prototype[ key ] = proto[ key ];
			}
		}

		Child.extend = Parser.extend;
		return Child;
	};

	var Parser$1 = Parser;

	var TEXT              = 1;
	var INTERPOLATOR      = 2;
	var TRIPLE            = 3;
	var SECTION           = 4;
	var INVERTED          = 5;
	var CLOSING           = 6;
	var ELEMENT           = 7;
	var PARTIAL           = 8;
	var COMMENT           = 9;
	var DELIMCHANGE       = 10;
	var ATTRIBUTE         = 13;
	var CLOSING_TAG       = 14;
	var COMPONENT         = 15;
	var YIELDER           = 16;
	var INLINE_PARTIAL    = 17;
	var DOCTYPE           = 18;
	var ALIAS             = 19;

	var NUMBER_LITERAL    = 20;
	var STRING_LITERAL    = 21;
	var ARRAY_LITERAL     = 22;
	var OBJECT_LITERAL    = 23;
	var BOOLEAN_LITERAL   = 24;
	var REGEXP_LITERAL    = 25;

	var GLOBAL            = 26;
	var KEY_VALUE_PAIR    = 27;


	var REFERENCE         = 30;
	var REFINEMENT        = 31;
	var MEMBER            = 32;
	var PREFIX_OPERATOR   = 33;
	var BRACKETED         = 34;
	var CONDITIONAL       = 35;
	var INFIX_OPERATOR    = 36;

	var INVOCATION        = 40;

	var SECTION_IF        = 50;
	var SECTION_UNLESS    = 51;
	var SECTION_EACH      = 52;
	var SECTION_WITH      = 53;
	var SECTION_IF_WITH   = 54;

	var ELSE              = 60;
	var ELSEIF            = 61;

	var EVENT             = 70;
	var DECORATOR         = 71;
	var TRANSITION        = 72;
	var BINDING_FLAG      = 73;

	var delimiterChangePattern = /^[^\s=]+/;
	var whitespacePattern = /^\s+/;
	function readDelimiterChange ( parser ) {
		var start, opening, closing;

		if ( !parser.matchString( '=' ) ) {
			return null;
		}

		start = parser.pos;

		// allow whitespace before new opening delimiter
		parser.allowWhitespace();

		opening = parser.matchPattern( delimiterChangePattern );
		if ( !opening ) {
			parser.pos = start;
			return null;
		}

		// allow whitespace (in fact, it's necessary...)
		if ( !parser.matchPattern( whitespacePattern ) ) {
			return null;
		}

		closing = parser.matchPattern( delimiterChangePattern );
		if ( !closing ) {
			parser.pos = start;
			return null;
		}

		// allow whitespace before closing '='
		parser.allowWhitespace();

		if ( !parser.matchString( '=' ) ) {
			parser.pos = start;
			return null;
		}

		return [ opening, closing ];
	}

	var regexpPattern = /^(\/(?:[^\n\r\u2028\u2029/\\[]|\\.|\[(?:[^\n\r\u2028\u2029\]\\]|\\.)*])+\/(?:([gimuy])(?![a-z]*\2))*(?![a-zA-Z_$0-9]))/;

	function readNumberLiteral ( parser ) {
		var result;

		if ( result = parser.matchPattern( regexpPattern ) ) {
			return {
				t: REGEXP_LITERAL,
				v: result
			};
		}

		return null;
	}

	var pattern$1 = /[-/\\^$*+?.()|[\]{}]/g;

	function escapeRegExp ( str ) {
		return str.replace( pattern$1, '\\$&' );
	}

	var regExpCache = {};

	function getLowestIndex ( haystack, needles ) {
		return haystack.search( regExpCache[needles.join()] || ( regExpCache[needles.join()] = new RegExp( needles.map( escapeRegExp ).join( '|' ) ) ) );
	}

	// https://github.com/kangax/html-minifier/issues/63#issuecomment-37763316
	var booleanAttributes = /^(allowFullscreen|async|autofocus|autoplay|checked|compact|controls|declare|default|defaultChecked|defaultMuted|defaultSelected|defer|disabled|enabled|formNoValidate|hidden|indeterminate|inert|isMap|itemScope|loop|multiple|muted|noHref|noResize|noShade|noValidate|noWrap|open|pauseOnExit|readOnly|required|reversed|scoped|seamless|selected|sortable|translate|trueSpeed|typeMustMatch|visible)$/i;
	var voidElementNames = /^(?:area|base|br|col|command|doctype|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;

	var htmlEntities = { quot: 34, amp: 38, apos: 39, lt: 60, gt: 62, nbsp: 160, iexcl: 161, cent: 162, pound: 163, curren: 164, yen: 165, brvbar: 166, sect: 167, uml: 168, copy: 169, ordf: 170, laquo: 171, not: 172, shy: 173, reg: 174, macr: 175, deg: 176, plusmn: 177, sup2: 178, sup3: 179, acute: 180, micro: 181, para: 182, middot: 183, cedil: 184, sup1: 185, ordm: 186, raquo: 187, frac14: 188, frac12: 189, frac34: 190, iquest: 191, Agrave: 192, Aacute: 193, Acirc: 194, Atilde: 195, Auml: 196, Aring: 197, AElig: 198, Ccedil: 199, Egrave: 200, Eacute: 201, Ecirc: 202, Euml: 203, Igrave: 204, Iacute: 205, Icirc: 206, Iuml: 207, ETH: 208, Ntilde: 209, Ograve: 210, Oacute: 211, Ocirc: 212, Otilde: 213, Ouml: 214, times: 215, Oslash: 216, Ugrave: 217, Uacute: 218, Ucirc: 219, Uuml: 220, Yacute: 221, THORN: 222, szlig: 223, agrave: 224, aacute: 225, acirc: 226, atilde: 227, auml: 228, aring: 229, aelig: 230, ccedil: 231, egrave: 232, eacute: 233, ecirc: 234, euml: 235, igrave: 236, iacute: 237, icirc: 238, iuml: 239, eth: 240, ntilde: 241, ograve: 242, oacute: 243, ocirc: 244, otilde: 245, ouml: 246, divide: 247, oslash: 248, ugrave: 249, uacute: 250, ucirc: 251, uuml: 252, yacute: 253, thorn: 254, yuml: 255, OElig: 338, oelig: 339, Scaron: 352, scaron: 353, Yuml: 376, fnof: 402, circ: 710, tilde: 732, Alpha: 913, Beta: 914, Gamma: 915, Delta: 916, Epsilon: 917, Zeta: 918, Eta: 919, Theta: 920, Iota: 921, Kappa: 922, Lambda: 923, Mu: 924, Nu: 925, Xi: 926, Omicron: 927, Pi: 928, Rho: 929, Sigma: 931, Tau: 932, Upsilon: 933, Phi: 934, Chi: 935, Psi: 936, Omega: 937, alpha: 945, beta: 946, gamma: 947, delta: 948, epsilon: 949, zeta: 950, eta: 951, theta: 952, iota: 953, kappa: 954, lambda: 955, mu: 956, nu: 957, xi: 958, omicron: 959, pi: 960, rho: 961, sigmaf: 962, sigma: 963, tau: 964, upsilon: 965, phi: 966, chi: 967, psi: 968, omega: 969, thetasym: 977, upsih: 978, piv: 982, ensp: 8194, emsp: 8195, thinsp: 8201, zwnj: 8204, zwj: 8205, lrm: 8206, rlm: 8207, ndash: 8211, mdash: 8212, lsquo: 8216, rsquo: 8217, sbquo: 8218, ldquo: 8220, rdquo: 8221, bdquo: 8222, dagger: 8224, Dagger: 8225, bull: 8226, hellip: 8230, permil: 8240, prime: 8242, Prime: 8243, lsaquo: 8249, rsaquo: 8250, oline: 8254, frasl: 8260, euro: 8364, image: 8465, weierp: 8472, real: 8476, trade: 8482, alefsym: 8501, larr: 8592, uarr: 8593, rarr: 8594, darr: 8595, harr: 8596, crarr: 8629, lArr: 8656, uArr: 8657, rArr: 8658, dArr: 8659, hArr: 8660, forall: 8704, part: 8706, exist: 8707, empty: 8709, nabla: 8711, isin: 8712, notin: 8713, ni: 8715, prod: 8719, sum: 8721, minus: 8722, lowast: 8727, radic: 8730, prop: 8733, infin: 8734, ang: 8736, and: 8743, or: 8744, cap: 8745, cup: 8746, 'int': 8747, there4: 8756, sim: 8764, cong: 8773, asymp: 8776, ne: 8800, equiv: 8801, le: 8804, ge: 8805, sub: 8834, sup: 8835, nsub: 8836, sube: 8838, supe: 8839, oplus: 8853, otimes: 8855, perp: 8869, sdot: 8901, lceil: 8968, rceil: 8969, lfloor: 8970, rfloor: 8971, lang: 9001, rang: 9002, loz: 9674, spades: 9824, clubs: 9827, hearts: 9829, diams: 9830	};
	var controlCharacters = [ 8364, 129, 8218, 402, 8222, 8230, 8224, 8225, 710, 8240, 352, 8249, 338, 141, 381, 143, 144, 8216, 8217, 8220, 8221, 8226, 8211, 8212, 732, 8482, 353, 8250, 339, 157, 382, 376 ];
	var entityPattern = new RegExp( '&(#?(?:x[\\w\\d]+|\\d+|' + Object.keys( htmlEntities ).join( '|' ) + '));?', 'g' );
	var codePointSupport = typeof String.fromCodePoint === 'function';
	var codeToChar = codePointSupport ? String.fromCodePoint : String.fromCharCode;

	function decodeCharacterReferences ( html ) {
		return html.replace( entityPattern, function ( match, entity ) {
			var code;

			// Handle named entities
			if ( entity[0] !== '#' ) {
				code = htmlEntities[ entity ];
			} else if ( entity[1] === 'x' ) {
				code = parseInt( entity.substring( 2 ), 16 );
			} else {
				code = parseInt( entity.substring( 1 ), 10 );
			}

			if ( !code ) {
				return match;
			}

			return codeToChar( validateCode( code ) );
		});
	}

	var lessThan = /</g;
	var greaterThan = />/g;
	var amp = /&/g;
	var invalid = 65533;

	function escapeHtml ( str ) {
		return str
			.replace( amp, '&amp;' )
			.replace( lessThan, '&lt;' )
			.replace( greaterThan, '&gt;' );
	}

	// some code points are verboten. If we were inserting HTML, the browser would replace the illegal
	// code points with alternatives in some cases - since we're bypassing that mechanism, we need
	// to replace them ourselves
	//
	// Source: http://en.wikipedia.org/wiki/Character_encodings_in_HTML#Illegal_characters
	function validateCode ( code ) {
		if ( !code ) {
			return invalid;
		}

		// line feed becomes generic whitespace
		if ( code === 10 ) {
			return 32;
		}

		// ASCII range. (Why someone would use HTML entities for ASCII characters I don't know, but...)
		if ( code < 128 ) {
			return code;
		}

		// code points 128-159 are dealt with leniently by browsers, but they're incorrect. We need
		// to correct the mistake or we'll end up with missing € signs and so on
		if ( code <= 159 ) {
			return controlCharacters[ code - 128 ];
		}

		// basic multilingual plane
		if ( code < 55296 ) {
			return code;
		}

		// UTF-16 surrogate halves
		if ( code <= 57343 ) {
			return invalid;
		}

		// rest of the basic multilingual plane
		if ( code <= 65535 ) {
			return code;
		} else if ( !codePointSupport ) {
			return invalid;
		}

		// supplementary multilingual plane 0x10000 - 0x1ffff
		if ( code >= 65536 && code <= 131071 ) {
			return code;
		}

		// supplementary ideographic plane 0x20000 - 0x2ffff
		if ( code >= 131072 && code <= 196607 ) {
			return code;
		}

		return invalid;
	}

	var expectedExpression = 'Expected a JavaScript expression';
	var expectedParen = 'Expected closing paren';

	// bulletproof number regex from https://gist.github.com/Rich-Harris/7544330
	var numberPattern = /^(?:[+-]?)0*(?:(?:(?:[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/;

	function readNumberLiteral$1 ( parser ) {
		var result;

		if ( result = parser.matchPattern( numberPattern ) ) {
			return {
				t: NUMBER_LITERAL,
				v: result
			};
		}

		return null;
	}

	function readBooleanLiteral ( parser ) {
		var remaining = parser.remaining();

		if ( remaining.substr( 0, 4 ) === 'true' ) {
			parser.pos += 4;
			return {
				t: BOOLEAN_LITERAL,
				v: 'true'
			};
		}

		if ( remaining.substr( 0, 5 ) === 'false' ) {
			parser.pos += 5;
			return {
				t: BOOLEAN_LITERAL,
				v: 'false'
			};
		}

		return null;
	}

	var stringMiddlePattern;
	var escapeSequencePattern;
	var lineContinuationPattern;
	// Match one or more characters until: ", ', \, or EOL/EOF.
	// EOL/EOF is written as (?!.) (meaning there's no non-newline char next).
	stringMiddlePattern = /^(?=.)[^"'\\]+?(?:(?!.)|(?=["'\\]))/;

	// Match one escape sequence, including the backslash.
	escapeSequencePattern = /^\\(?:['"\\bfnrt]|0(?![0-9])|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|(?=.)[^ux0-9])/;

	// Match one ES5 line continuation (backslash + line terminator).
	lineContinuationPattern = /^\\(?:\r\n|[\u000A\u000D\u2028\u2029])/;

	// Helper for defining getDoubleQuotedString and getSingleQuotedString.
	function makeQuotedStringMatcher ( okQuote ) {
		return function ( parser ) {
			var literal = '"';
			var done = false;
			var next;

			while ( !done ) {
				next = ( parser.matchPattern( stringMiddlePattern ) || parser.matchPattern( escapeSequencePattern ) ||
					parser.matchString( okQuote ) );
				if ( next ) {
					if ( next === ("\"") ) {
						literal += "\\\"";
					} else if ( next === ("\\'") ) {
						literal += "'";
					} else {
						literal += next;
					}
				} else {
					next = parser.matchPattern( lineContinuationPattern );
					if ( next ) {
						// convert \(newline-like) into a \u escape, which is allowed in JSON
						literal += '\\u' + ( '000' + next.charCodeAt(1).toString(16) ).slice( -4 );
					} else {
						done = true;
					}
				}
			}

			literal += '"';

			// use JSON.parse to interpret escapes
			return JSON.parse( literal );
		};
	}

	var getSingleQuotedString = makeQuotedStringMatcher( ("\"") );
	var getDoubleQuotedString = makeQuotedStringMatcher( ("'") );

	function readStringLiteral ( parser ) {
		var start, string;

		start = parser.pos;

		if ( parser.matchString( '"' ) ) {
			string = getDoubleQuotedString( parser );

			if ( !parser.matchString( '"' ) ) {
				parser.pos = start;
				return null;
			}

			return {
				t: STRING_LITERAL,
				v: string
			};
		}

		if ( parser.matchString( ("'") ) ) {
			string = getSingleQuotedString( parser );

			if ( !parser.matchString( ("'") ) ) {
				parser.pos = start;
				return null;
			}

			return {
				t: STRING_LITERAL,
				v: string
			};
		}

		return null;
	}

	var namePattern = /^[a-zA-Z_$][a-zA-Z_$0-9]*/;

	var identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;

	// http://mathiasbynens.be/notes/javascript-properties
	// can be any name, string literal, or number literal
	function readKey ( parser ) {
		var token;

		if ( token = readStringLiteral( parser ) ) {
			return identifier.test( token.v ) ? token.v : '"' + token.v.replace( /"/g, '\\"' ) + '"';
		}

		if ( token = readNumberLiteral$1( parser ) ) {
			return token.v;
		}

		if ( token = parser.matchPattern( namePattern ) ) {
			return token;
		}

		return null;
	}

	function readKeyValuePair ( parser ) {
		var start, key, value;

		start = parser.pos;

		// allow whitespace between '{' and key
		parser.allowWhitespace();

		var refKey = parser.nextChar() !== '\'' && parser.nextChar() !== '"';

		key = readKey( parser );
		if ( key === null ) {
			parser.pos = start;
			return null;
		}

		// allow whitespace between key and ':'
		parser.allowWhitespace();

		// es2015 shorthand property
		if ( refKey && ( parser.nextChar() === ',' || parser.nextChar() === '}' ) ) {
			if ( !namePattern.test( key ) ) {
				parser.error( ("Expected a valid reference, but found '" + key + "' instead.") );
			}

			return {
				t: KEY_VALUE_PAIR,
				k: key,
				v: {
					t: REFERENCE,
					n: key
				}
			};
		}

		// next character must be ':'
		if ( !parser.matchString( ':' ) ) {
			parser.pos = start;
			return null;
		}

		// allow whitespace between ':' and value
		parser.allowWhitespace();

		// next expression must be a, well... expression
		value = readExpression( parser );
		if ( value === null ) {
			parser.pos = start;
			return null;
		}

		return {
			t: KEY_VALUE_PAIR,
			k: key,
			v: value
		};
	}

	function readKeyValuePairs ( parser ) {
		var start, pairs, pair, keyValuePairs;

		start = parser.pos;

		pair = readKeyValuePair( parser );
		if ( pair === null ) {
			return null;
		}

		pairs = [ pair ];

		if ( parser.matchString( ',' ) ) {
			keyValuePairs = readKeyValuePairs( parser );

			if ( !keyValuePairs ) {
				parser.pos = start;
				return null;
			}

			return pairs.concat( keyValuePairs );
		}

		return pairs;
	}

	function readObjectLiteral ( parser ) {
		var start, keyValuePairs;

		start = parser.pos;

		// allow whitespace
		parser.allowWhitespace();

		if ( !parser.matchString( '{' ) ) {
			parser.pos = start;
			return null;
		}

		keyValuePairs = readKeyValuePairs( parser );

		// allow whitespace between final value and '}'
		parser.allowWhitespace();

		if ( !parser.matchString( '}' ) ) {
			parser.pos = start;
			return null;
		}

		return {
			t: OBJECT_LITERAL,
			m: keyValuePairs
		};
	}

	function readExpressionList ( parser ) {
		parser.allowWhitespace();

		var expr = readExpression( parser );

		if ( expr === null ) return null;

		var expressions = [ expr ];

		// allow whitespace between expression and ','
		parser.allowWhitespace();

		if ( parser.matchString( ',' ) ) {
			var next = readExpressionList( parser );
			if ( next === null ) parser.error( expectedExpression );

			expressions.push.apply( expressions, next );
		}

		return expressions;
	}

	function readArrayLiteral ( parser ) {
		var start, expressionList;

		start = parser.pos;

		// allow whitespace before '['
		parser.allowWhitespace();

		if ( !parser.matchString( '[' ) ) {
			parser.pos = start;
			return null;
		}

		expressionList = readExpressionList( parser );

		if ( !parser.matchString( ']' ) ) {
			parser.pos = start;
			return null;
		}

		return {
			t: ARRAY_LITERAL,
			m: expressionList
		};
	}

	function readLiteral ( parser ) {
		return readNumberLiteral$1( parser )  ||
		       readBooleanLiteral( parser ) ||
		       readStringLiteral( parser )  ||
		       readObjectLiteral( parser )  ||
		       readArrayLiteral( parser )   ||
		       readNumberLiteral( parser );
	}

	var prefixPattern = /^(?:~\/|(?:\.\.\/)+|\.\/(?:\.\.\/)*|\.)/;
	var globals;
	var keywords;
	// if a reference is a browser global, we don't deference it later, so it needs special treatment
	globals = /^(?:Array|console|Date|RegExp|decodeURIComponent|decodeURI|encodeURIComponent|encodeURI|isFinite|isNaN|parseFloat|parseInt|JSON|Math|NaN|undefined|null|Object|Number|String|Boolean)\b/;

	// keywords are not valid references, with the exception of `this`
	keywords = /^(?:break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|void|while|with)$/;

	var legalReference = /^(?:[a-zA-Z$_0-9]|\\\.)+(?:(?:\.(?:[a-zA-Z$_0-9]|\\\.)+)|(?:\[[0-9]+\]))*/;
	var relaxedName = /^[a-zA-Z_$][-\/a-zA-Z_$0-9]*/;
	var specials = /^@(?:keypath|rootpath|index|key|this|global)/;
	var specialCall = /^\s*\(/;
	var spreadPattern = /^\s*\.{3}/;

	function readReference ( parser ) {
		var startPos, prefix, name, global, reference, fullLength, lastDotIndex, spread;

		startPos = parser.pos;

		name = parser.matchPattern( specials );

		if ( name === '@keypath' || name === '@rootpath' ) {
			if ( parser.matchPattern( specialCall ) ) {
				var ref = readReference( parser );
				if ( !ref ) parser.error( ("Expected a valid reference for a keypath expression") );

				parser.allowWhitespace();

				if ( !parser.matchString( ')' ) ) parser.error( ("Unclosed keypath expression") );
				name += "(" + (ref.n) + ")";
			}
		}

		spread = !name && parser.spreadArgs && parser.matchPattern( spreadPattern );

		if ( !name ) {
			prefix = parser.matchPattern( prefixPattern ) || '';
			name = ( !prefix && parser.relaxedNames && parser.matchPattern( relaxedName ) ) ||
			       parser.matchPattern( legalReference );

			if ( !name && prefix === '.' ) {
				prefix = '';
				name = '.';
			} else if ( !name && prefix ) {
				name = prefix;
				prefix = '';
			}
		}

		if ( !name ) {
			return null;
		}

		// bug out if it's a keyword (exception for ancestor/restricted refs - see https://github.com/ractivejs/ractive/issues/1497)
		if ( !prefix && !parser.relaxedNames && keywords.test( name ) ) {
			parser.pos = startPos;
			return null;
		}

		// if this is a browser global, stop here
		if ( !prefix && globals.test( name ) ) {
			global = globals.exec( name )[0];
			parser.pos = startPos + global.length;

			return {
				t: GLOBAL,
				v: ( spread ? '...' : '' ) + global
			};
		}

		fullLength = ( spread ? 3 : 0 ) + ( prefix || '' ).length + name.length;
		reference = ( prefix || '' ) + normalise( name );

		if ( parser.matchString( '(' ) ) {
			// if this is a method invocation (as opposed to a function) we need
			// to strip the method name from the reference combo, else the context
			// will be wrong
			// but only if the reference was actually a member and not a refinement
			lastDotIndex = reference.lastIndexOf( '.' );
			if ( lastDotIndex !== -1 && name[ name.length - 1 ] !== ']' ) {
				var refLength = reference.length;
				reference = reference.substr( 0, lastDotIndex );
				parser.pos = startPos + (fullLength - ( refLength - lastDotIndex ) );
			} else {
				parser.pos -= 1;
			}
		}

		return {
			t: REFERENCE,
			n: ( spread ? '...' : '' ) + reference.replace( /^this\./, './' ).replace( /^this$/, '.' )
		};
	}

	function readBracketedExpression ( parser ) {
		if ( !parser.matchString( '(' ) ) return null;

		parser.allowWhitespace();

		var expr = readExpression( parser );

		if ( !expr ) parser.error( expectedExpression );

		parser.allowWhitespace();

		if ( !parser.matchString( ')' ) ) parser.error( expectedParen );

		return {
			t: BRACKETED,
			x: expr
		};
	}

	function readPrimary ( parser ) {
		return readLiteral( parser )
			|| readReference( parser )
			|| readBracketedExpression( parser );
	}

	function readRefinement ( parser ) {
		// some things call for strict refinement (partial names), meaning no space between reference and refinement
		if ( !parser.strictRefinement ) {
			parser.allowWhitespace();
		}

		// "." name
		if ( parser.matchString( '.' ) ) {
			parser.allowWhitespace();

			var name = parser.matchPattern( namePattern );
			if ( name ) {
				return {
					t: REFINEMENT,
					n: name
				};
			}

			parser.error( 'Expected a property name' );
		}

		// "[" expression "]"
		if ( parser.matchString( '[' ) ) {
			parser.allowWhitespace();

			var expr = readExpression( parser );
			if ( !expr ) parser.error( expectedExpression );

			parser.allowWhitespace();

			if ( !parser.matchString( ']' ) ) parser.error( ("Expected ']'") );

			return {
				t: REFINEMENT,
				x: expr
			};
		}

		return null;
	}

	function readMemberOrInvocation ( parser ) {
		var expression = readPrimary( parser );

		if ( !expression ) return null;

		while ( expression ) {
			var refinement = readRefinement( parser );
			if ( refinement ) {
				expression = {
					t: MEMBER,
					x: expression,
					r: refinement
				};
			}

			else if ( parser.matchString( '(' ) ) {
				parser.allowWhitespace();
				var start = parser.spreadArgs;
				parser.spreadArgs = true;
				var expressionList = readExpressionList( parser );
				parser.spreadArgs = start;

				parser.allowWhitespace();

				if ( !parser.matchString( ')' ) ) {
					parser.error( expectedParen );
				}

				expression = {
					t: INVOCATION,
					x: expression
				};

				if ( expressionList ) expression.o = expressionList;
			}

			else {
				break;
			}
		}

		return expression;
	}

	var readTypeOf;
	var makePrefixSequenceMatcher;
	makePrefixSequenceMatcher = function ( symbol, fallthrough ) {
		return function ( parser ) {
			var expression;

			if ( expression = fallthrough( parser ) ) {
				return expression;
			}

			if ( !parser.matchString( symbol ) ) {
				return null;
			}

			parser.allowWhitespace();

			expression = readExpression( parser );
			if ( !expression ) {
				parser.error( expectedExpression );
			}

			return {
				s: symbol,
				o: expression,
				t: PREFIX_OPERATOR
			};
		};
	};

	// create all prefix sequence matchers, return readTypeOf
	(function() {
		var i, len, matcher, prefixOperators, fallthrough;

		prefixOperators = '! ~ + - typeof'.split( ' ' );

		fallthrough = readMemberOrInvocation;
		for ( i = 0, len = prefixOperators.length; i < len; i += 1 ) {
			matcher = makePrefixSequenceMatcher( prefixOperators[i], fallthrough );
			fallthrough = matcher;
		}

		// typeof operator is higher precedence than multiplication, so provides the
		// fallthrough for the multiplication sequence matcher we're about to create
		// (we're skipping void and delete)
		readTypeOf = fallthrough;
	}());

	var readTypeof = readTypeOf;

	var readLogicalOr;
	var makeInfixSequenceMatcher;
	makeInfixSequenceMatcher = function ( symbol, fallthrough ) {
		return function ( parser ) {
			var start, left, right;

			left = fallthrough( parser );
			if ( !left ) {
				return null;
			}

			// Loop to handle left-recursion in a case like `a * b * c` and produce
			// left association, i.e. `(a * b) * c`.  The matcher can't call itself
			// to parse `left` because that would be infinite regress.
			while ( true ) {
				start = parser.pos;

				parser.allowWhitespace();

				if ( !parser.matchString( symbol ) ) {
					parser.pos = start;
					return left;
				}

				// special case - in operator must not be followed by [a-zA-Z_$0-9]
				if ( symbol === 'in' && /[a-zA-Z_$0-9]/.test( parser.remaining().charAt( 0 ) ) ) {
					parser.pos = start;
					return left;
				}

				parser.allowWhitespace();

				// right operand must also consist of only higher-precedence operators
				right = fallthrough( parser );
				if ( !right ) {
					parser.pos = start;
					return left;
				}

				left = {
					t: INFIX_OPERATOR,
					s: symbol,
					o: [ left, right ]
				};

				// Loop back around.  If we don't see another occurrence of the symbol,
				// we'll return left.
			}
		};
	};

	// create all infix sequence matchers, and return readLogicalOr
	(function() {
		var i, len, matcher, infixOperators, fallthrough;

		// All the infix operators on order of precedence (source: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Operator_Precedence)
		// Each sequence matcher will initially fall through to its higher precedence
		// neighbour, and only attempt to match if one of the higher precedence operators
		// (or, ultimately, a literal, reference, or bracketed expression) already matched
		infixOperators = '* / % + - << >> >>> < <= > >= in instanceof == != === !== & ^ | && ||'.split( ' ' );

		// A typeof operator is higher precedence than multiplication
		fallthrough = readTypeof;
		for ( i = 0, len = infixOperators.length; i < len; i += 1 ) {
			matcher = makeInfixSequenceMatcher( infixOperators[i], fallthrough );
			fallthrough = matcher;
		}

		// Logical OR is the fallthrough for the conditional matcher
		readLogicalOr = fallthrough;
	}());

	var readLogicalOr$1 = readLogicalOr;

	// The conditional operator is the lowest precedence operator, so we start here
	function getConditional ( parser ) {
		var start, expression, ifTrue, ifFalse;

		expression = readLogicalOr$1( parser );
		if ( !expression ) {
			return null;
		}

		start = parser.pos;

		parser.allowWhitespace();

		if ( !parser.matchString( '?' ) ) {
			parser.pos = start;
			return expression;
		}

		parser.allowWhitespace();

		ifTrue = readExpression( parser );
		if ( !ifTrue ) {
			parser.error( expectedExpression );
		}

		parser.allowWhitespace();

		if ( !parser.matchString( ':' ) ) {
			parser.error( 'Expected ":"' );
		}

		parser.allowWhitespace();

		ifFalse = readExpression( parser );
		if ( !ifFalse ) {
			parser.error( expectedExpression );
		}

		return {
			t: CONDITIONAL,
			o: [ expression, ifTrue, ifFalse ]
		};
	}

	function readExpression ( parser ) {
		// The conditional operator is the lowest precedence operator (except yield,
		// assignment operators, and commas, none of which are supported), so we
		// start there. If it doesn't match, it 'falls through' to progressively
		// higher precedence operators, until it eventually matches (or fails to
		// match) a 'primary' - a literal or a reference. This way, the abstract syntax
		// tree has everything in its proper place, i.e. 2 + 3 * 4 === 14, not 20.
		return getConditional( parser );
	}

	function flattenExpression ( expression ) {
		var refs, count = 0, stringified;

		extractRefs( expression, refs = [] );
		stringified = stringify( expression );

		refs = refs.map( function ( r ) { return r.indexOf( '...' ) === 0 ? r.substr( 3 ) : r; } );

		return {
			r: refs,
			s: getVars(stringified)
		};

		function getVars(expr) {
			var vars = [];
			for ( var i = count - 1; i >= 0; i-- ) {
				vars.push( ("spread$" + i) );
			}
			return vars.length ? ("(function(){var " + (vars.join(',')) + ";return(" + expr + ");})()") : expr;
		}

		function stringify ( node ) {
			switch ( node.t ) {
				case BOOLEAN_LITERAL:
				case GLOBAL:
				case NUMBER_LITERAL:
				case REGEXP_LITERAL:
					return node.v;

				case STRING_LITERAL:
					return JSON.stringify( String( node.v ) );

				case ARRAY_LITERAL:
					return '[' + ( node.m ? node.m.map( stringify ).join( ',' ) : '' ) + ']';

				case OBJECT_LITERAL:
					return '{' + ( node.m ? node.m.map( stringify ).join( ',' ) : '' ) + '}';

				case KEY_VALUE_PAIR:
					return node.k + ':' + stringify( node.v );

				case PREFIX_OPERATOR:
					return ( node.s === 'typeof' ? 'typeof ' : node.s ) + stringify( node.o );

				case INFIX_OPERATOR:
					return stringify( node.o[0] ) + ( node.s.substr( 0, 2 ) === 'in' ? ' ' + node.s + ' ' : node.s ) + stringify( node.o[1] );

				case INVOCATION:
					if ( node.spread ) {
						var id = count++;
						return ("(spread$" + id + " = " + (stringify(node.x)) + ").apply(spread$" + id + ", [].concat(" + (node.o ? node.o.map( function ( a ) { return a.n && a.n.indexOf( '...' ) === 0 ? stringify( a ) : '[' + stringify(a) + ']'; } ).join( ',' ) : '') + ") )");
					} else {
						return stringify( node.x ) + '(' + ( node.o ? node.o.map( stringify ).join( ',' ) : '' ) + ')';
					}

				case BRACKETED:
					return '(' + stringify( node.x ) + ')';

				case MEMBER:
					return stringify( node.x ) + stringify( node.r );

				case REFINEMENT:
					return ( node.n ? '.' + node.n : '[' + stringify( node.x ) + ']' );

				case CONDITIONAL:
					return stringify( node.o[0] ) + '?' + stringify( node.o[1] ) + ':' + stringify( node.o[2] );

				case REFERENCE:
					return '_' + refs.indexOf( node.n );

				default:
					throw new Error( 'Expected legal JavaScript' );
			}
		}
	}

	// TODO maybe refactor this?
	function extractRefs ( node, refs ) {
		var i, list;

		if ( node.t === REFERENCE ) {
			if ( refs.indexOf( node.n ) === -1 ) {
				refs.unshift( node.n );
			}
		}

		list = node.o || node.m;
		if ( list ) {
			if ( isObject( list ) ) {
				extractRefs( list, refs );
			} else {
				i = list.length;
				while ( i-- ) {
					if ( list[i].n && list[i].n.indexOf('...') === 0 ) {
						node.spread = true;
					}
					extractRefs( list[i], refs );
				}
			}
		}

		if ( node.x ) {
			extractRefs( node.x, refs );
		}

		if ( node.r ) {
			extractRefs( node.r, refs );
		}

		if ( node.v ) {
			extractRefs( node.v, refs );
		}
	}

	// simple JSON parser, without the restrictions of JSON parse
	// (i.e. having to double-quote keys).
	//
	// If passed a hash of values as the second argument, ${placeholders}
	// will be replaced with those values

	var specials$1 = {
		'true': true,
		'false': false,
		'null': null,
		undefined: undefined
	};

	var specialsPattern = new RegExp( '^(?:' + Object.keys( specials$1 ).join( '|' ) + ')' );
	var numberPattern$1 = /^(?:[+-]?)(?:(?:(?:0|[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/;
	var placeholderPattern = /\$\{([^\}]+)\}/g;
	var placeholderAtStartPattern = /^\$\{([^\}]+)\}/;
	var onlyWhitespace = /^\s*$/;

	var JsonParser = Parser$1.extend({
		init: function ( str, options ) {
			this.values = options.values;
			this.allowWhitespace();
		},

		postProcess: function ( result ) {
			if ( result.length !== 1 || !onlyWhitespace.test( this.leftover ) ) {
				return null;
			}

			return { value: result[0].v };
		},

		converters: [
			function getPlaceholder ( parser ) {
				if ( !parser.values ) return null;

				var placeholder = parser.matchPattern( placeholderAtStartPattern );

				if ( placeholder && ( parser.values.hasOwnProperty( placeholder ) ) ) {
					return { v: parser.values[ placeholder ] };
				}
			},

			function getSpecial ( parser ) {
				var special = parser.matchPattern( specialsPattern );
				if ( special ) return { v: specials$1[ special ] };
			},

			function getNumber ( parser ) {
				var number = parser.matchPattern( numberPattern$1 );
				if ( number ) return { v: +number };
			},

			function getString ( parser ) {
				var stringLiteral = readStringLiteral( parser );
				var values = parser.values;

				if ( stringLiteral && values ) {
					return {
						v: stringLiteral.v.replace( placeholderPattern, function ( match, $1 ) { return ( $1 in values ? values[ $1 ] : $1 ); } )
					};
				}

				return stringLiteral;
			},

			function getObject ( parser ) {
				if ( !parser.matchString( '{' ) ) return null;

				var result = {};

				parser.allowWhitespace();

				if ( parser.matchString( '}' ) ) {
					return { v: result };
				}

				var pair;
				while ( pair = getKeyValuePair( parser ) ) {
					result[ pair.key ] = pair.value;

					parser.allowWhitespace();

					if ( parser.matchString( '}' ) ) {
						return { v: result };
					}

					if ( !parser.matchString( ',' ) ) {
						return null;
					}
				}

				return null;
			},

			function getArray ( parser ) {
				if ( !parser.matchString( '[' ) ) return null;

				var result = [];

				parser.allowWhitespace();

				if ( parser.matchString( ']' ) ) {
					return { v: result };
				}

				var valueToken;
				while ( valueToken = parser.read() ) {
					result.push( valueToken.v );

					parser.allowWhitespace();

					if ( parser.matchString( ']' ) ) {
						return { v: result };
					}

					if ( !parser.matchString( ',' ) ) {
						return null;
					}

					parser.allowWhitespace();
				}

				return null;
			}
		]
	});

	function getKeyValuePair ( parser ) {
		parser.allowWhitespace();

		var key = readKey( parser );

		if ( !key ) return null;

		var pair = { key: key };

		parser.allowWhitespace();
		if ( !parser.matchString( ':' ) ) {
			return null;
		}
		parser.allowWhitespace();

		var valueToken = parser.read();

		if ( !valueToken ) return null;

		pair.value = valueToken.v;
		return pair;
	}

	function parseJSON ( str, values ) {
		var parser = new JsonParser( str, { values: values });
		return parser.result;
	}

	var methodCallPattern = /^([a-zA-Z_$][a-zA-Z_$0-9]*)\(.*\)\s*$/;
	var ExpressionParser;
	var blank = /^\s*$/;

	ExpressionParser = Parser$1.extend({
		converters: [ readExpression ],
		spreadArgs: true
	});

	// TODO clean this up, it's shocking
	function processDirective ( tokens, parentParser, type ) {
		var result,
			match,
			token,
			colonIndex,
			directiveName,
			directiveArgs,
			parsed;

		if ( typeof tokens === 'string' ) {
			var pos = parentParser.pos - tokens.length;
			if ( type === DECORATOR || type === TRANSITION ) {
				var parser = new ExpressionParser( ("[" + tokens + "]") );
				return { a: flattenExpression( parser.result[0] ) };
			}

			if ( type === EVENT && ( match = methodCallPattern.exec( tokens ) ) ) {
				warnIfDebug( parentParser.getContextMessage( pos, ("Unqualified method events are deprecated. Prefix methods with '@this.' to call methods on the current Ractive instance.") )[2] );
				tokens = "@this." + (match[1]) + "" + (tokens.substr(match[1].length));
			}

			if ( type === EVENT && ~tokens.indexOf( '(' ) ) {
				var parser$1 = new ExpressionParser( '[' + tokens + ']' );
				if ( parser$1.result && parser$1.result[0] ) {
					if ( parser$1.remaining().length ) {
						parentParser.pos = pos + tokens.length - parser$1.remaining().length;
						parentParser.error( ("Invalid input after event expression '" + (parser$1.remaining()) + "'") );
					}
					return { x: flattenExpression( parser$1.result[0] ) };
				}

				if ( tokens.indexOf( ':' ) > tokens.indexOf( '(' ) || !~tokens.indexOf( ':' ) ) {
					parentParser.pos = pos;
					parentParser.error( ("Invalid input in event expression '" + tokens + "'") );
				}

			}

			if ( tokens.indexOf( ':' ) === -1 ) {
				return tokens.trim();
			}

			tokens = [ tokens ];
		}

		result = {};

		directiveName = [];
		directiveArgs = [];

		if ( tokens ) {
			while ( tokens.length ) {
				token = tokens.shift();

				if ( typeof token === 'string' ) {
					// ignore empty space
					if ( blank.test( token ) ) continue;

					colonIndex = token.indexOf( ':' );

					if ( colonIndex === -1 ) {
						directiveName.push( token );
					} else {
						// is the colon the first character?
						if ( colonIndex ) {
							// no
							directiveName.push( token.substr( 0, colonIndex ) );
						}

						// if there is anything after the colon in this token, treat
						// it as the first token of the directiveArgs fragment
						if ( token.length > colonIndex + 1 ) {
							directiveArgs[0] = token.substring( colonIndex + 1 );
						}

						break;
					}
				}

				else {
					directiveName.push( token );
				}
			}

			directiveArgs = directiveArgs.concat( tokens );
		}

		if ( !directiveName.length ) {
			result = '';
		} else if ( directiveArgs.length || typeof directiveName !== 'string' ) {
			result = {
				// TODO is this really necessary? just use the array
				n: ( directiveName.length === 1 && typeof directiveName[0] === 'string' ? directiveName[0] : directiveName )
			};

			if ( directiveArgs.length === 1 && typeof directiveArgs[0] === 'string' ) {
				parsed = parseJSON( '[' + directiveArgs[0] + ']' );
				result.a = parsed ? parsed.value : [ directiveArgs[0].trim() ];
			}

			else {
				result.d = directiveArgs;
			}
		} else {
			result = directiveName;
		}

		if ( directiveArgs.length && type ) {
			warnIfDebug( parentParser.getContextMessage( parentParser.pos, ("Proxy events with arguments are deprecated. You can fire events with arguments using \"@this.fire('eventName', arg1, arg2, ...)\".") )[2] );
		}

		return result;
	}

	var attributeNamePattern = /^[^\s"'>\/=]+/;
	var onPattern = /^on/;
	var proxyEventPattern = /^on-([a-zA-Z\\*\\.$_][a-zA-Z\\*\\.$_0-9\-]+)$/;
	var reservedEventNames = /^(?:change|reset|teardown|update|construct|config|init|render|unrender|detach|insert)$/;
	var decoratorPattern = /^as-([a-z-A-Z][-a-zA-Z_0-9]*)$/;
	var transitionPattern = /^([a-zA-Z](?:(?!-in-out)[-a-zA-Z_0-9])*)-(in|out|in-out)$/;
	var directives = {
					   'intro-outro': { t: TRANSITION, v: 't0' },
					   intro: { t: TRANSITION, v: 't1' },
					   outro: { t: TRANSITION, v: 't2' },
					   lazy: { t: BINDING_FLAG, v: 'l' },
					   twoway: { t: BINDING_FLAG, v: 't' },
					   decorator: { t: DECORATOR }
					 };
	var unquotedAttributeValueTextPattern = /^[^\s"'=<>\/`]+/;
	function readAttribute ( parser ) {
		var attr, name, value, i, nearest, idx;

		parser.allowWhitespace();

		name = parser.matchPattern( attributeNamePattern );
		if ( !name ) {
			return null;
		}

		// check for accidental delimiter consumption e.g. <tag bool{{>attrs}} />
		nearest = name.length;
		for ( i = 0; i < parser.tags.length; i++ ) {
			if ( ~( idx = name.indexOf( parser.tags[ i ].open ) ) ) {
				if ( idx < nearest ) nearest = idx;
			}
		}
		if ( nearest < name.length ) {
			parser.pos -= name.length - nearest;
			name = name.substr( 0, nearest );
			if ( !name ) return null;
			else return { n: name };
		}

		attr = { n: name };

		value = readAttributeValue( parser );
		if ( value != null ) { // not null/undefined
			attr.f = value;
		}

		return attr;
	}

	function readAttributeValue ( parser ) {
		var start, valueStart, startDepth, value;

		start = parser.pos;

		// next character must be `=`, `/`, `>` or whitespace
		if ( !/[=\/>\s]/.test( parser.nextChar() ) ) {
			parser.error( 'Expected `=`, `/`, `>` or whitespace' );
		}

		parser.allowWhitespace();

		if ( !parser.matchString( '=' ) ) {
			parser.pos = start;
			return null;
		}

		parser.allowWhitespace();

		valueStart = parser.pos;
		startDepth = parser.sectionDepth;

		value = readQuotedAttributeValue( parser, ("'") ) ||
				readQuotedAttributeValue( parser, ("\"") ) ||
				readUnquotedAttributeValue( parser );

		if ( value === null ) {
			parser.error( 'Expected valid attribute value' );
		}

		if ( parser.sectionDepth !== startDepth ) {
			parser.pos = valueStart;
			parser.error( 'An attribute value must contain as many opening section tags as closing section tags' );
		}

		if ( !value.length ) {
			return '';
		}

		if ( value.length === 1 && typeof value[0] === 'string' ) {
			return decodeCharacterReferences( value[0] );
		}

		return value;
	}

	function readUnquotedAttributeValueToken ( parser ) {
		var start, text, haystack, needles, index;

		start = parser.pos;

		text = parser.matchPattern( unquotedAttributeValueTextPattern );

		if ( !text ) {
			return null;
		}

		haystack = text;
		needles = parser.tags.map( function ( t ) { return t.open; } ); // TODO refactor... we do this in readText.js as well

		if ( ( index = getLowestIndex( haystack, needles ) ) !== -1 ) {
			text = text.substr( 0, index );
			parser.pos = start + text.length;
		}

		return text;
	}

	function readUnquotedAttributeValue ( parser ) {
		var tokens, token;

		parser.inAttribute = true;

		tokens = [];

		token = readMustache( parser ) || readUnquotedAttributeValueToken( parser );
		while ( token ) {
			tokens.push( token );
			token = readMustache( parser ) || readUnquotedAttributeValueToken( parser );
		}

		if ( !tokens.length ) {
			return null;
		}

		parser.inAttribute = false;
		return tokens;
	}

	function readQuotedAttributeValue ( parser, quoteMark ) {
		var start, tokens, token;

		start = parser.pos;

		if ( !parser.matchString( quoteMark ) ) {
			return null;
		}

		parser.inAttribute = quoteMark;

		tokens = [];

		token = readMustache( parser ) || readQuotedStringToken( parser, quoteMark );
		while ( token !== null ) {
			tokens.push( token );
			token = readMustache( parser ) || readQuotedStringToken( parser, quoteMark );
		}

		if ( !parser.matchString( quoteMark ) ) {
			parser.pos = start;
			return null;
		}

		parser.inAttribute = false;

		return tokens;
	}

	function readQuotedStringToken ( parser, quoteMark ) {
		var haystack = parser.remaining();

		var needles = parser.tags.map( function ( t ) { return t.open; } ); // TODO refactor... we do this in readText.js as well
		needles.push( quoteMark );

		var index = getLowestIndex( haystack, needles );

		if ( index === -1 ) {
			parser.error( 'Quoted attribute value must have a closing quote' );
		}

		if ( !index ) {
			return null;
		}

		parser.pos += index;
		return haystack.substr( 0, index );
	}

	function readAttributeOrDirective ( parser ) {
			var match,
				attribute,
			    directive;

			attribute = readAttribute( parser );

			if ( !attribute ) return null;

			// intro, outro, decorator
			if ( directive = directives[ attribute.n ] ) {
				attribute.t = directive.t;
				if ( directive.v ) attribute.v = directive.v;
				delete attribute.n; // no name necessary

				if ( directive.t === TRANSITION || directive.t === DECORATOR ) attribute.f = processDirective( attribute.f, parser );

				if ( directive.t === TRANSITION ) {
					warnOnceIfDebug( ("" + (directive.v === 't0' ? 'intro-outro' : directive.v === 't1' ? 'intro' : 'outro') + " is deprecated. To specify tranisitions, use the transition name suffixed with '-in', '-out', or '-in-out' as an attribute. Arguments can be specified in the attribute value as a simple list of expressions without mustaches.") );
				} else if ( directive.t === DECORATOR ) {
					warnOnceIfDebug( ("decorator is deprecated. To specify decorators, use the decorator name prefixed with 'as-' as an attribute. Arguments can be specified in the attribute value as a simple list of expressions without mustaches.") );
				}
			}

			// decorators
			else if ( match = decoratorPattern.exec( attribute.n ) ) {
				delete attribute.n;
				attribute.t = DECORATOR;
				attribute.f = processDirective( attribute.f, parser, DECORATOR );
				if ( typeof attribute.f === 'object' ) attribute.f.n = match[1];
				else attribute.f = match[1];
			}

			// transitions
			else if ( match = transitionPattern.exec( attribute.n ) ) {
				delete attribute.n;
				attribute.t = TRANSITION;
				attribute.f = processDirective( attribute.f, parser, TRANSITION );
				if ( typeof attribute.f === 'object' ) attribute.f.n = match[1];
				else attribute.f = match[1];
				attribute.v = match[2] === 'in-out' ? 't0' : match[2] === 'in' ? 't1' : 't2';
			}

			// on-click etc
			else if ( match = proxyEventPattern.exec( attribute.n ) ) {
				attribute.n = match[1];
				attribute.t = EVENT;
				attribute.f = processDirective( attribute.f, parser, EVENT );

				if ( reservedEventNames.test( attribute.f.n || attribute.f ) ) {
					parser.pos -= ( attribute.f.n || attribute.f ).length;
					parser.error( 'Cannot use reserved event names (change, reset, teardown, update, construct, config, init, render, unrender, detach, insert)' );
				}
			}

			else {
				if ( parser.sanitizeEventAttributes && onPattern.test( attribute.n ) ) {
					return { exclude: true };
				} else {
					attribute.f = attribute.f || ( attribute.f === '' ? '' : 0 );
					attribute.t = ATTRIBUTE;
				}
			}

			return attribute;
	}

	var delimiterChangeToken = { t: DELIMCHANGE, exclude: true };

	function readMustache ( parser ) {
		var mustache, i;

		// If we're inside a <script> or <style> tag, and we're not
		// interpolating, bug out
		if ( parser.interpolate[ parser.inside ] === false ) {
			return null;
		}

		for ( i = 0; i < parser.tags.length; i += 1 ) {
			if ( mustache = readMustacheOfType( parser, parser.tags[i] ) ) {
				return mustache;
			}
		}

		if ( parser.inTag && !parser.inAttribute ) {
			mustache = readAttributeOrDirective( parser );
			if ( mustache ) {
				parser.allowWhitespace();
				return mustache;
			}
		}
	}

	function readMustacheOfType ( parser, tag ) {
		var start, mustache, reader, i;

		start = parser.pos;

		if ( parser.matchString( '\\' + tag.open ) ) {
			if ( start === 0 || parser.str[ start - 1 ] !== '\\' ) {
				return tag.open;
			}
		} else if ( !parser.matchString( tag.open ) ) {
			return null;
		}

		// delimiter change?
		if ( mustache = readDelimiterChange( parser ) ) {
			// find closing delimiter or abort...
			if ( !parser.matchString( tag.close ) ) {
				return null;
			}

			// ...then make the switch
			tag.open = mustache[0];
			tag.close = mustache[1];
			parser.sortMustacheTags();

			return delimiterChangeToken;
		}

		parser.allowWhitespace();

		// illegal section closer
		if ( parser.matchString( '/' ) ) {
			parser.pos -= 1;
			var rewind = parser.pos;
			if ( !readNumberLiteral( parser ) ) {
				parser.pos = rewind - ( tag.close.length );
				if ( parser.inAttribute ) {
					parser.pos = start;
					return null;
				} else {
					parser.error( 'Attempted to close a section that wasn\'t open' );
				}
			} else {
				parser.pos = rewind;
			}
		}

		for ( i = 0; i < tag.readers.length; i += 1 ) {
			reader = tag.readers[i];

			if ( mustache = reader( parser, tag ) ) {
				if ( tag.isStatic ) {
					mustache.s = true; // TODO make this `1` instead - more compact
				}

				if ( parser.includeLinePositions ) {
					mustache.p = parser.getLinePos( start );
				}

				return mustache;
			}
		}

		parser.pos = start;
		return null;
	}

	function refineExpression ( expression, mustache ) {
		var referenceExpression;

		if ( expression ) {
			while ( expression.t === BRACKETED && expression.x ) {
				expression = expression.x;
			}

			if ( expression.t === REFERENCE ) {
				mustache.r = expression.n;
			} else {
				if ( referenceExpression = getReferenceExpression( expression ) ) {
					mustache.rx = referenceExpression;
				} else {
					mustache.x = flattenExpression( expression );
				}
			}

			return mustache;
		}
	}

	// TODO refactor this! it's bewildering
	function getReferenceExpression ( expression ) {
		var members = [], refinement;

		while ( expression.t === MEMBER && expression.r.t === REFINEMENT ) {
			refinement = expression.r;

			if ( refinement.x ) {
				if ( refinement.x.t === REFERENCE ) {
					members.unshift( refinement.x );
				} else {
					members.unshift( flattenExpression( refinement.x ) );
				}
			} else {
				members.unshift( refinement.n );
			}

			expression = expression.x;
		}

		if ( expression.t !== REFERENCE ) {
			return null;
		}

		return {
			r: expression.n,
			m: members
		};
	}

	function readTriple ( parser, tag ) {
		var expression = readExpression( parser ), triple;

		if ( !expression ) {
			return null;
		}

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
		}

		triple = { t: TRIPLE };
		refineExpression( expression, triple ); // TODO handle this differently - it's mysterious

		return triple;
	}

	function readUnescaped ( parser, tag ) {
		var expression, triple;

		if ( !parser.matchString( '&' ) ) {
			return null;
		}

		parser.allowWhitespace();

		expression = readExpression( parser );

		if ( !expression ) {
			return null;
		}

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
		}

		triple = { t: TRIPLE };
		refineExpression( expression, triple ); // TODO handle this differently - it's mysterious

		return triple;
	}

	var legalAlias = /^(?:[a-zA-Z$_0-9]|\\\.)+(?:(?:(?:[a-zA-Z$_0-9]|\\\.)+)|(?:\[[0-9]+\]))*/;
	var asRE = /^as/i;

	function readAliases( parser ) {
		var aliases = [], alias, start = parser.pos;

		parser.allowWhitespace();

		alias = readAlias( parser );

		if ( alias ) {
			alias.x = refineExpression( alias.x, {} );
			aliases.push( alias );

			parser.allowWhitespace();

			while ( parser.matchString(',') ) {
				alias = readAlias( parser );

				if ( !alias ) {
					parser.error( 'Expected another alias.' );
				}

				alias.x = refineExpression( alias.x, {} );
				aliases.push( alias );

				parser.allowWhitespace();
			}

			return aliases;
		}

		parser.pos = start;
		return null;
	}

	function readAlias( parser ) {
		var expr, alias, start = parser.pos;

		parser.allowWhitespace();

		expr = readExpression( parser, [] );

		if ( !expr ) {
			parser.pos = start;
			return null;
		}

		parser.allowWhitespace();

		if ( !parser.matchPattern( asRE ) ) {
			parser.pos = start;
			return null;
		}

		parser.allowWhitespace();

		alias = parser.matchPattern( legalAlias );

		if ( !alias ) {
			parser.error( 'Expected a legal alias name.' );
		}

		return { n: alias, x: expr };
	}

	function readPartial ( parser, tag ) {
		if ( !parser.matchString( '>' ) ) return null;

		parser.allowWhitespace();

		// Partial names can include hyphens, so we can't use readExpression
		// blindly. Instead, we use the `relaxedNames` flag to indicate that
		// `foo-bar` should be read as a single name, rather than 'subtract
		// bar from foo'
		parser.relaxedNames = parser.strictRefinement = true;
		var expression = readExpression( parser );
		parser.relaxedNames = parser.strictRefinement = false;

		if ( !expression ) return null;

		var partial = { t: PARTIAL };
		refineExpression( expression, partial ); // TODO...

		parser.allowWhitespace();

		// check for alias context e.g. `{{>foo bar as bat, bip as bop}}` then
		// turn it into `{{#with bar as bat, bip as bop}}{{>foo}}{{/with}}`
		var aliases = readAliases( parser );
		if ( aliases ) {
			partial = {
				t: ALIAS,
				z: aliases,
				f: [ partial ]
			};
		}

		// otherwise check for literal context e.g. `{{>foo bar}}` then
		// turn it into `{{#with bar}}{{>foo}}{{/with}}`
		else {
			var context = readExpression( parser );
			if ( context) {
				partial = {
					t: SECTION,
					n: SECTION_WITH,
					f: [ partial ]
				};

				refineExpression( context, partial );
			}
		}

		parser.allowWhitespace();

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
		}

		return partial;
	}

	function readComment ( parser, tag ) {
		var index;

		if ( !parser.matchString( '!' ) ) {
			return null;
		}

		index = parser.remaining().indexOf( tag.close );

		if ( index !== -1 ) {
			parser.pos += index + tag.close.length;
			return { t: COMMENT };
		}
	}

	function readExpressionOrReference ( parser, expectedFollowers ) {
		var start, expression, i;

		start = parser.pos;
		expression = readExpression( parser );

		if ( !expression ) {
			// valid reference but invalid expression e.g. `{{new}}`?
			var ref = parser.matchPattern( /^(\w+)/ );
			if ( ref ) {
				return {
					t: REFERENCE,
					n: ref
				};
			}

			return null;
		}

		for ( i = 0; i < expectedFollowers.length; i += 1 ) {
			if ( parser.remaining().substr( 0, expectedFollowers[i].length ) === expectedFollowers[i] ) {
				return expression;
			}
		}

		parser.pos = start;
		return readReference( parser );
	}

	function readInterpolator ( parser, tag ) {
		var start, expression, interpolator, err;

		start = parser.pos;

		// TODO would be good for perf if we could do away with the try-catch
		try {
			expression = readExpressionOrReference( parser, [ tag.close ]);
		} catch ( e ) {
			err = e;
		}

		if ( !expression ) {
			if ( parser.str.charAt( start ) === '!' ) {
				// special case - comment
				parser.pos = start;
				return null;
			}

			if ( err ) {
				throw err;
			}
		}

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "' after reference") );

			if ( !expression ) {
				// special case - comment
				if ( parser.nextChar() === '!' ) {
					return null;
				}

				parser.error( ("Expected expression or legal reference") );
			}
		}

		interpolator = { t: INTERPOLATOR };
		refineExpression( expression, interpolator ); // TODO handle this differently - it's mysterious

		return interpolator;
	}

	var yieldPattern = /^yield\s*/;

	function readYielder ( parser, tag ) {
		if ( !parser.matchPattern( yieldPattern ) ) return null;

		var name = parser.matchPattern( /^[a-zA-Z_$][a-zA-Z_$0-9\-]*/ );

		parser.allowWhitespace();

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("expected legal partial name") );
		}

		var yielder = { t: YIELDER };
		if ( name ) yielder.n = name;

		return yielder;
	}

	function readClosing ( parser, tag ) {
		var start, remaining, index, closing;

		start = parser.pos;

		if ( !parser.matchString( tag.open ) ) {
			return null;
		}

		parser.allowWhitespace();

		if ( !parser.matchString( '/' ) ) {
			parser.pos = start;
			return null;
		}

		parser.allowWhitespace();

		remaining = parser.remaining();
		index = remaining.indexOf( tag.close );

		if ( index !== -1 ) {
			closing = {
				t: CLOSING,
				r: remaining.substr( 0, index ).split( ' ' )[0]
			};

			parser.pos += index;

			if ( !parser.matchString( tag.close ) ) {
				parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
			}

			return closing;
		}

		parser.pos = start;
		return null;
	}

	var elsePattern = /^\s*else\s*/;

	function readElse ( parser, tag ) {
		var start = parser.pos;

		if ( !parser.matchString( tag.open ) ) {
			return null;
		}

		if ( !parser.matchPattern( elsePattern ) ) {
			parser.pos = start;
			return null;
		}

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
		}

		return {
			t: ELSE
		};
	}

	var elsePattern$1 = /^\s*elseif\s+/;

	function readElseIf ( parser, tag ) {
		var start = parser.pos;

		if ( !parser.matchString( tag.open ) ) {
			return null;
		}

		if ( !parser.matchPattern( elsePattern$1 ) ) {
			parser.pos = start;
			return null;
		}

		var expression = readExpression( parser );

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
		}

		return {
			t: ELSEIF,
			x: expression
		};
	}

	var handlebarsBlockCodes = {
		'each':    SECTION_EACH,
		'if':      SECTION_IF,
		'with':    SECTION_IF_WITH,
		'unless':  SECTION_UNLESS
	};

	var indexRefPattern = /^\s*:\s*([a-zA-Z_$][a-zA-Z_$0-9]*)/;
	var keyIndexRefPattern = /^\s*,\s*([a-zA-Z_$][a-zA-Z_$0-9]*)/;
	var handlebarsBlockPattern = new RegExp( '^(' + Object.keys( handlebarsBlockCodes ).join( '|' ) + ')\\b' );
	function readSection ( parser, tag ) {
		var start, expression, section, child, children, hasElse, block, unlessBlock, conditions, closed, i, expectedClose, aliasOnly = false;

		start = parser.pos;

		if ( parser.matchString( '^' ) ) {
			section = { t: SECTION, f: [], n: SECTION_UNLESS };
		} else if ( parser.matchString( '#' ) ) {
			section = { t: SECTION, f: [] };

			if ( parser.matchString( 'partial' ) ) {
				parser.pos = start - parser.standardDelimiters[0].length;
				parser.error( 'Partial definitions can only be at the top level of the template, or immediately inside components' );
			}

			if ( block = parser.matchPattern( handlebarsBlockPattern ) ) {
				expectedClose = block;
				section.n = handlebarsBlockCodes[ block ];
			}
		} else {
			return null;
		}

		parser.allowWhitespace();

		if ( block === 'with' ) {
			var aliases = readAliases( parser );
			if ( aliases ) {
				aliasOnly = true;
				section.z = aliases;
				section.t = ALIAS;
			}
		} else if ( block === 'each' ) {
			var alias = readAlias( parser );
			if ( alias ) {
				section.z = [ { n: alias.n, x: { r: '.' } } ];
				expression = alias.x;
			}
		}

		if ( !aliasOnly ) {
			if ( !expression ) expression = readExpression( parser );

			if ( !expression ) {
				parser.error( 'Expected expression' );
			}

			// optional index and key references
			if ( i = parser.matchPattern( indexRefPattern ) ) {
				var extra;

				if ( extra = parser.matchPattern( keyIndexRefPattern ) ) {
					section.i = i + ',' + extra;
				} else {
					section.i = i;
				}
			}
		}

		parser.allowWhitespace();

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
		}

		parser.sectionDepth += 1;
		children = section.f;

		conditions = [];

		var pos;
		do {
			pos = parser.pos;
			if ( child = readClosing( parser, tag ) ) {
				if ( expectedClose && child.r !== expectedClose ) {
					parser.pos = pos;
					parser.error( ("Expected " + (tag.open) + "/" + expectedClose + "" + (tag.close)) );
				}

				parser.sectionDepth -= 1;
				closed = true;
			}

			else if ( !aliasOnly && ( child = readElseIf( parser, tag ) ) ) {
				if ( section.n === SECTION_UNLESS ) {
					parser.error( '{{else}} not allowed in {{#unless}}' );
				}

				if ( hasElse ) {
					parser.error( 'illegal {{elseif...}} after {{else}}' );
				}

				if ( !unlessBlock ) {
					unlessBlock = [];
				}

				var mustache = {
					t: SECTION,
					n: SECTION_IF,
					f: children = []
				};
				refineExpression( child.x, mustache );

				unlessBlock.push( mustache );
			}

			else if ( !aliasOnly && ( child = readElse( parser, tag ) ) ) {
				if ( section.n === SECTION_UNLESS ) {
					parser.error( '{{else}} not allowed in {{#unless}}' );
				}

				if ( hasElse ) {
					parser.error( 'there can only be one {{else}} block, at the end of a section' );
				}

				hasElse = true;

				// use an unless block if there's no elseif
				if ( !unlessBlock ) {
					unlessBlock = [];
				}

				unlessBlock.push({
					t: SECTION,
					n: SECTION_UNLESS,
					f: children = []
				});
			}

			else {
				child = parser.read( READERS );

				if ( !child ) {
					break;
				}

				children.push( child );
			}
		} while ( !closed );

		if ( unlessBlock ) {
			section.l = unlessBlock;
		}

		if ( !aliasOnly ) {
			refineExpression( expression, section );
		}

		// TODO if a section is empty it should be discarded. Don't do
		// that here though - we need to clean everything up first, as
		// it may contain removeable whitespace. As a temporary measure,
		// to pass the existing tests, remove empty `f` arrays
		if ( !section.f.length ) {
			delete section.f;
		}

		return section;
	}

	var OPEN_COMMENT = '<!--';
	var CLOSE_COMMENT = '-->';
	function readHtmlComment ( parser ) {
		var start, content, remaining, endIndex, comment;

		start = parser.pos;

		if ( parser.textOnlyMode || !parser.matchString( OPEN_COMMENT ) ) {
			return null;
		}

		remaining = parser.remaining();
		endIndex = remaining.indexOf( CLOSE_COMMENT );

		if ( endIndex === -1 ) {
			parser.error( 'Illegal HTML - expected closing comment sequence (\'-->\')' );
		}

		content = remaining.substr( 0, endIndex );
		parser.pos += endIndex + 3;

		comment = {
			t: COMMENT,
			c: content
		};

		if ( parser.includeLinePositions ) {
			comment.p = parser.getLinePos( start );
		}

		return comment;
	}

	var leadingLinebreak = /^[ \t\f\r\n]*\r?\n/;
	var trailingLinebreak = /\r?\n[ \t\f\r\n]*$/;
	function stripStandalones ( items ) {
		var i, current, backOne, backTwo, lastSectionItem;

		for ( i=1; i<items.length; i+=1 ) {
			current = items[i];
			backOne = items[i-1];
			backTwo = items[i-2];

			// if we're at the end of a [text][comment][text] sequence...
			if ( isString( current ) && isComment( backOne ) && isString( backTwo ) ) {

				// ... and the comment is a standalone (i.e. line breaks either side)...
				if ( trailingLinebreak.test( backTwo ) && leadingLinebreak.test( current ) ) {

					// ... then we want to remove the whitespace after the first line break
					items[i-2] = backTwo.replace( trailingLinebreak, '\n' );

					// and the leading line break of the second text token
					items[i] = current.replace( leadingLinebreak, '' );
				}
			}

			// if the current item is a section, and it is preceded by a linebreak, and
			// its first item is a linebreak...
			if ( isSection( current ) && isString( backOne ) ) {
				if ( trailingLinebreak.test( backOne ) && isString( current.f[0] ) && leadingLinebreak.test( current.f[0] ) ) {
					items[i-1] = backOne.replace( trailingLinebreak, '\n' );
					current.f[0] = current.f[0].replace( leadingLinebreak, '' );
				}
			}

			// if the last item was a section, and it is followed by a linebreak, and
			// its last item is a linebreak...
			if ( isString( current ) && isSection( backOne ) ) {
				lastSectionItem = lastItem( backOne.f );

				if ( isString( lastSectionItem ) && trailingLinebreak.test( lastSectionItem ) && leadingLinebreak.test( current ) ) {
					backOne.f[ backOne.f.length - 1 ] = lastSectionItem.replace( trailingLinebreak, '\n' );
					items[i] = current.replace( leadingLinebreak, '' );
				}
			}
		}

		return items;
	}

	function isString ( item ) {
		return typeof item === 'string';
	}

	function isComment ( item ) {
		return item.t === COMMENT || item.t === DELIMCHANGE;
	}

	function isSection ( item ) {
		return ( item.t === SECTION || item.t === INVERTED ) && item.f;
	}

	function trimWhitespace ( items, leadingPattern, trailingPattern ) {
		var item;

		if ( leadingPattern ) {
			item = items[0];
			if ( typeof item === 'string' ) {
				item = item.replace( leadingPattern, '' );

				if ( !item ) {
					items.shift();
				} else {
					items[0] = item;
				}
			}
		}

		if ( trailingPattern ) {
			item = lastItem( items );
			if ( typeof item === 'string' ) {
				item = item.replace( trailingPattern, '' );

				if ( !item ) {
					items.pop();
				} else {
					items[ items.length - 1 ] = item;
				}
			}
		}
	}

	var contiguousWhitespace = /[ \t\f\r\n]+/g;
	var preserveWhitespaceElements = /^(?:pre|script|style|textarea)$/i;
	var leadingWhitespace$1 = /^[ \t\f\r\n]+/;
	var trailingWhitespace = /[ \t\f\r\n]+$/;
	var leadingNewLine = /^(?:\r\n|\r|\n)/;
	var trailingNewLine = /(?:\r\n|\r|\n)$/;

	function cleanup ( items, stripComments, preserveWhitespace, removeLeadingWhitespace, removeTrailingWhitespace ) {
		if ( typeof items === 'string' ) return;

		var i,
			item,
			previousItem,
			nextItem,
			preserveWhitespaceInsideFragment,
			removeLeadingWhitespaceInsideFragment,
			removeTrailingWhitespaceInsideFragment,
			key;

		// First pass - remove standalones and comments etc
		stripStandalones( items );

		i = items.length;
		while ( i-- ) {
			item = items[i];

			// Remove delimiter changes, unsafe elements etc
			if ( item.exclude ) {
				items.splice( i, 1 );
			}

			// Remove comments, unless we want to keep them
			else if ( stripComments && item.t === COMMENT ) {
				items.splice( i, 1 );
			}
		}

		// If necessary, remove leading and trailing whitespace
		trimWhitespace( items, removeLeadingWhitespace ? leadingWhitespace$1 : null, removeTrailingWhitespace ? trailingWhitespace : null );

		i = items.length;
		while ( i-- ) {
			item = items[i];

			// Recurse
			if ( item.f ) {
				var isPreserveWhitespaceElement = item.t === ELEMENT && preserveWhitespaceElements.test( item.e );
				preserveWhitespaceInsideFragment = preserveWhitespace || isPreserveWhitespaceElement;

				if ( !preserveWhitespace && isPreserveWhitespaceElement ) {
					trimWhitespace( item.f, leadingNewLine, trailingNewLine );
				}

				if ( !preserveWhitespaceInsideFragment ) {
					previousItem = items[ i - 1 ];
					nextItem = items[ i + 1 ];

					// if the previous item was a text item with trailing whitespace,
					// remove leading whitespace inside the fragment
					if ( !previousItem || ( typeof previousItem === 'string' && trailingWhitespace.test( previousItem ) ) ) {
						removeLeadingWhitespaceInsideFragment = true;
					}

					// and vice versa
					if ( !nextItem || ( typeof nextItem === 'string' && leadingWhitespace$1.test( nextItem ) ) ) {
						removeTrailingWhitespaceInsideFragment = true;
					}
				}

				cleanup( item.f, stripComments, preserveWhitespaceInsideFragment, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment );

				// clean up name templates (events, decorators, etc)
				if ( isArray( item.f.n ) ) {
					cleanup( item.f.n, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespace );
				}

				// clean up arg templates (events, decorators, etc)
				if ( isArray( item.f.d ) ) {
					cleanup( item.f.d, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespace );
				}
			}

			// Split if-else blocks into two (an if, and an unless)
			if ( item.l ) {
				cleanup( item.l, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment );

				item.l.forEach( function ( s ) { return s.l = 1; } );
				item.l.unshift( i + 1, 0 );
				items.splice.apply( items, item.l );
				delete item.l; // TODO would be nice if there was a way around this
			}

			// Clean up element attributes
			if ( item.a ) {
				for ( key in item.a ) {
					if ( item.a.hasOwnProperty( key ) && typeof item.a[ key ] !== 'string' ) {
						cleanup( item.a[ key ], stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment );
					}
				}
			}
			// Clean up conditional attributes
			if ( item.m ) {
				cleanup( item.m, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment );
				if ( item.m.length < 1 ) delete item.m;
			}
		}

		// final pass - fuse text nodes together
		i = items.length;
		while ( i-- ) {
			if ( typeof items[i] === 'string' ) {
				if ( typeof items[i+1] === 'string' ) {
					items[i] = items[i] + items[i+1];
					items.splice( i + 1, 1 );
				}

				if ( !preserveWhitespace ) {
					items[i] = items[i].replace( contiguousWhitespace, ' ' );
				}

				if ( items[i] === '' ) {
					items.splice( i, 1 );
				}
			}
		}
	}

	var closingTagPattern = /^([a-zA-Z]{1,}:?[a-zA-Z0-9\-]*)\s*\>/;

	function readClosingTag ( parser ) {
		var start, tag;

		start = parser.pos;

		// are we looking at a closing tag?
		if ( !parser.matchString( '</' ) ) {
			return null;
		}

		if ( tag = parser.matchPattern( closingTagPattern ) ) {
			if ( parser.inside && tag !== parser.inside ) {
				parser.pos = start;
				return null;
			}

			return {
				t: CLOSING_TAG,
				e: tag
			};
		}

		// We have an illegal closing tag, report it
		parser.pos -= 2;
		parser.error( 'Illegal closing tag' );
	}

	var tagNamePattern = /^[a-zA-Z]{1,}:?[a-zA-Z0-9\-]*/;
	var validTagNameFollower = /^[\s\n\/>]/;
	var exclude = { exclude: true };
	var disallowedContents;
	// based on http://developers.whatwg.org/syntax.html#syntax-tag-omission
	disallowedContents = {
		li: [ 'li' ],
		dt: [ 'dt', 'dd' ],
		dd: [ 'dt', 'dd' ],
		p: 'address article aside blockquote div dl fieldset footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol p pre section table ul'.split( ' ' ),
		rt: [ 'rt', 'rp' ],
		rp: [ 'rt', 'rp' ],
		optgroup: [ 'optgroup' ],
		option: [ 'option', 'optgroup' ],
		thead: [ 'tbody', 'tfoot' ],
		tbody: [ 'tbody', 'tfoot' ],
		tfoot: [ 'tbody' ],
		tr: [ 'tr', 'tbody' ],
		td: [ 'td', 'th', 'tr' ],
		th: [ 'td', 'th', 'tr' ]
	};

	function readElement ( parser ) {
		var start,
			element,
			attribute,
			selfClosing,
			children,
			partials,
			hasPartials,
			child,
			closed,
			pos,
			remaining,
			closingTag;

		start = parser.pos;

		if ( parser.inside || parser.inAttribute || parser.textOnlyMode ) {
			return null;
		}

		if ( !parser.matchString( '<' ) ) {
			return null;
		}

		// if this is a closing tag, abort straight away
		if ( parser.nextChar() === '/' ) {
			return null;
		}

		element = {};
		if ( parser.includeLinePositions ) {
			element.p = parser.getLinePos( start );
		}

		if ( parser.matchString( '!' ) ) {
			element.t = DOCTYPE;
			if ( !parser.matchPattern( /^doctype/i ) ) {
				parser.error( 'Expected DOCTYPE declaration' );
			}

			element.a = parser.matchPattern( /^(.+?)>/ );
			return element;
		}

		element.t = ELEMENT;

		// element name
		element.e = parser.matchPattern( tagNamePattern );
		if ( !element.e ) {
			return null;
		}

		// next character must be whitespace, closing solidus or '>'
		if ( !validTagNameFollower.test( parser.nextChar() ) ) {
			parser.error( 'Illegal tag name' );
		}

		parser.allowWhitespace();

		parser.inTag = true;

		// directives and attributes
		while ( attribute = readMustache( parser ) ) {
			if ( attribute !== false ) {
				if ( !element.m ) element.m = [];
				element.m.push( attribute );
			}

			parser.allowWhitespace();
		}

		parser.inTag = false;

		// allow whitespace before closing solidus
		parser.allowWhitespace();

		// self-closing solidus?
		if ( parser.matchString( '/' ) ) {
			selfClosing = true;
		}

		// closing angle bracket
		if ( !parser.matchString( '>' ) ) {
			return null;
		}

		var lowerCaseName = element.e.toLowerCase();
		var preserveWhitespace = parser.preserveWhitespace;

		if ( !selfClosing && !voidElementNames.test( element.e ) ) {
			parser.elementStack.push( lowerCaseName );

			// Special case - if we open a script element, further tags should
			// be ignored unless they're a closing script element
			if ( lowerCaseName === 'script' || lowerCaseName === 'style' || lowerCaseName === 'textarea' ) {
				parser.inside = lowerCaseName;
			}

			children = [];
			partials = create( null );

			do {
				pos = parser.pos;
				remaining = parser.remaining();

				if ( !remaining ) {
					parser.error( ("Missing end " + (parser.elementStack.length > 1 ? 'tags' : 'tag') + " (" + (parser.elementStack.reverse().map( function ( x ) { return ("</" + x + ">"); } ).join( '' )) + ")") );
				}

				// if for example we're in an <li> element, and we see another
				// <li> tag, close the first so they become siblings
				if ( !canContain( lowerCaseName, remaining ) ) {
					closed = true;
				}

				// closing tag
				else if ( closingTag = readClosingTag( parser ) ) {
					closed = true;

					var closingTagName = closingTag.e.toLowerCase();

					// if this *isn't* the closing tag for the current element...
					if ( closingTagName !== lowerCaseName ) {
						// rewind parser
						parser.pos = pos;

						// if it doesn't close a parent tag, error
						if ( !~parser.elementStack.indexOf( closingTagName ) ) {
							var errorMessage = 'Unexpected closing tag';

							// add additional help for void elements, since component names
							// might clash with them
							if ( voidElementNames.test( closingTagName ) ) {
								errorMessage += " (<" + closingTagName + "> is a void element - it cannot contain children)";
							}

							parser.error( errorMessage );
						}
					}
				}

				// implicit close by closing section tag. TODO clean this up
				else if ( child = readClosing( parser, { open: parser.standardDelimiters[0], close: parser.standardDelimiters[1] } ) ) {
					closed = true;
					parser.pos = pos;
				}

				else {
					if ( child = parser.read( PARTIAL_READERS ) ) {
						if ( partials[ child.n ] ) {
							parser.pos = pos;
							parser.error( 'Duplicate partial definition' );
						}

						cleanup( child.f, parser.stripComments, preserveWhitespace, !preserveWhitespace, !preserveWhitespace );

						partials[ child.n ] = child.f;
						hasPartials = true;
					}

					else {
						if ( child = parser.read( READERS ) ) {
							children.push( child );
						} else {
							closed = true;
						}
					}
				}
			} while ( !closed );

			if ( children.length ) {
				element.f = children;
			}

			if ( hasPartials ) {
				element.p = partials;
			}

			parser.elementStack.pop();
		}

		parser.inside = null;

		if ( parser.sanitizeElements && parser.sanitizeElements.indexOf( lowerCaseName ) !== -1 ) {
			return exclude;
		}

		return element;
	}

	function canContain ( name, remaining ) {
		var match, disallowed;

		match = /^<([a-zA-Z][a-zA-Z0-9]*)/.exec( remaining );
		disallowed = disallowedContents[ name ];

		if ( !match || !disallowed ) {
			return true;
		}

		return !~disallowed.indexOf( match[1].toLowerCase() );
	}

	function readText ( parser ) {
		var index, remaining, disallowed, barrier;

		remaining = parser.remaining();

		if ( parser.textOnlyMode ) {
			disallowed = parser.tags.map( function ( t ) { return t.open; } );
			disallowed = disallowed.concat( parser.tags.map( function ( t ) { return '\\' + t.open; } ) );

			index = getLowestIndex( remaining, disallowed );
		} else {
			barrier = parser.inside ? '</' + parser.inside : '<';

			if ( parser.inside && !parser.interpolate[ parser.inside ] ) {
				index = remaining.indexOf( barrier );
			} else {
				disallowed = parser.tags.map( function ( t ) { return t.open; } );
				disallowed = disallowed.concat( parser.tags.map( function ( t ) { return '\\' + t.open; } ) );

				// http://developers.whatwg.org/syntax.html#syntax-attributes
				if ( parser.inAttribute === true ) {
					// we're inside an unquoted attribute value
					disallowed.push( ("\""), ("'"), ("="), ("<"), (">"), '`' );
				} else if ( parser.inAttribute ) {
					// quoted attribute value
					disallowed.push( parser.inAttribute );
				} else {
					disallowed.push( barrier );
				}

				index = getLowestIndex( remaining, disallowed );
			}
		}

		if ( !index ) {
			return null;
		}

		if ( index === -1 ) {
			index = remaining.length;
		}

		parser.pos += index;

		if ( ( parser.inside && parser.inside !== 'textarea' ) || parser.textOnlyMode ) {
			return remaining.substr( 0, index );
		} else {
			return decodeCharacterReferences( remaining.substr( 0, index ) );
		}
	}

	var startPattern = /^<!--\s*/;
	var namePattern$1 = /s*>\s*([a-zA-Z_$][-a-zA-Z_$0-9]*)\s*/;
	var finishPattern = /\s*-->/;

	function readPartialDefinitionComment ( parser ) {
		var start = parser.pos;
		var open = parser.standardDelimiters[0];
		var close = parser.standardDelimiters[1];

		if ( !parser.matchPattern( startPattern ) || !parser.matchString( open ) ) {
			parser.pos = start;
			return null;
		}

		var name = parser.matchPattern( namePattern$1 );

		warnOnceIfDebug( ("Inline partial comments are deprecated.\nUse this...\n  {{#partial " + name + "}} ... {{/partial}}\n\n...instead of this:\n  <!-- {{>" + name + "}} --> ... <!-- {{/" + name + "}} -->'") );

		// make sure the rest of the comment is in the correct place
		if ( !parser.matchString( close ) || !parser.matchPattern( finishPattern ) ) {
			parser.pos = start;
			return null;
		}

		var content = [];
		var closed;

		var endPattern = new RegExp('^<!--\\s*' + escapeRegExp( open ) + '\\s*\\/\\s*' + name + '\\s*' + escapeRegExp( close ) + '\\s*-->');

		do {
			if ( parser.matchPattern( endPattern ) ) {
				closed = true;
			}

			else {
				var child = parser.read( READERS );
				if ( !child ) {
					parser.error( ("expected closing comment ('<!-- " + open + "/" + name + "" + close + " -->')") );
				}

				content.push( child );
			}
		} while ( !closed );

		return {
			t: INLINE_PARTIAL,
			f: content,
			n: name
		};
	}

	var partialDefinitionSectionPattern = /^\s*#\s*partial\s+/;

	function readPartialDefinitionSection ( parser ) {
		var start, name, content, child, closed;

		start = parser.pos;

		var delimiters = parser.standardDelimiters;

		if ( !parser.matchString( delimiters[0] ) ) {
			return null;
		}

		if ( !parser.matchPattern( partialDefinitionSectionPattern ) ) {
			parser.pos = start;
			return null;
		}

		name = parser.matchPattern( /^[a-zA-Z_$][a-zA-Z_$0-9\-\/]*/ );

		if ( !name ) {
			parser.error( 'expected legal partial name' );
		}

		parser.allowWhitespace();
		if ( !parser.matchString( delimiters[1] ) ) {
			parser.error( ("Expected closing delimiter '" + (delimiters[1]) + "'") );
		}

		content = [];

		do {
			// TODO clean this up
			if ( child = readClosing( parser, { open: parser.standardDelimiters[0], close: parser.standardDelimiters[1] }) ) {
				if ( !child.r === 'partial' ) {
					parser.error( ("Expected " + (delimiters[0]) + "/partial" + (delimiters[1])) );
				}

				closed = true;
			}

			else {
				child = parser.read( READERS );

				if ( !child ) {
					parser.error( ("Expected " + (delimiters[0]) + "/partial" + (delimiters[1])) );
				}

				content.push( child );
			}
		} while ( !closed );

		return {
			t: INLINE_PARTIAL,
			n: name,
			f: content
		};
	}

	function readTemplate ( parser ) {
		var fragment = [];
		var partials = create( null );
		var hasPartials = false;

		var preserveWhitespace = parser.preserveWhitespace;

		while ( parser.pos < parser.str.length ) {
			var pos = parser.pos, item, partial;

			if ( partial = parser.read( PARTIAL_READERS ) ) {
				if ( partials[ partial.n ] ) {
					parser.pos = pos;
					parser.error( 'Duplicated partial definition' );
				}

				cleanup( partial.f, parser.stripComments, preserveWhitespace, !preserveWhitespace, !preserveWhitespace );

				partials[ partial.n ] = partial.f;
				hasPartials = true;
			} else if ( item = parser.read( READERS ) ) {
				fragment.push( item );
			} else  {
				parser.error( 'Unexpected template content' );
			}
		}

		var result = {
			v: TEMPLATE_VERSION,
			t: fragment
		};

		if ( hasPartials ) {
			result.p = partials;
		}

		return result;
	}

	function insertExpressions ( obj, expr ) {

		Object.keys( obj ).forEach( function ( key ) {
			if  ( isExpression( key, obj ) ) return addTo( obj, expr );

			var ref = obj[ key ];
			if ( hasChildren( ref ) ) insertExpressions( ref, expr );
	 	});
	}

	function isExpression( key, obj ) {
		return key === 's' && isArray( obj.r );
	}

	function addTo( obj, expr ) {
		var s = obj.s, r = obj.r;
		if ( !expr[ s ] ) expr[ s ] = fromExpression( s, r.length );
	}

	function hasChildren( ref ) {
		return isArray( ref ) || isObject( ref );
	}

	// See https://github.com/ractivejs/template-spec for information
	// about the Ractive template specification

	var STANDARD_READERS = [ readPartial, readUnescaped, readSection, readYielder, readInterpolator, readComment ];
	var TRIPLE_READERS = [ readTriple ];
	var STATIC_READERS = [ readUnescaped, readSection, readInterpolator ]; // TODO does it make sense to have a static section?

	var StandardParser;

	function parse ( template, options ) {
		return new StandardParser( template, options || {} ).result;
	}

	parse.computedStrings = function( computed ) {
		if ( !computed ) return [];

		Object.keys( computed ).forEach( function ( key ) {
			var value = computed[ key ];
			if ( typeof value === 'string' ) {
				computed[ key ] = fromComputationString( value );
			}
		});
	};


	var READERS = [ readMustache, readHtmlComment, readElement, readText ];
	var PARTIAL_READERS = [ readPartialDefinitionComment, readPartialDefinitionSection ];

	StandardParser = Parser$1.extend({
		init: function ( str, options ) {
			var tripleDelimiters = options.tripleDelimiters || [ '{{{', '}}}' ],
				staticDelimiters = options.staticDelimiters || [ '[[', ']]' ],
				staticTripleDelimiters = options.staticTripleDelimiters || [ '[[[', ']]]' ];

			this.standardDelimiters = options.delimiters || [ '{{', '}}' ];

			this.tags = [
				{ isStatic: false, isTriple: false, open: this.standardDelimiters[0], close: this.standardDelimiters[1], readers: STANDARD_READERS },
				{ isStatic: false, isTriple: true,  open: tripleDelimiters[0],        close: tripleDelimiters[1],        readers: TRIPLE_READERS },
				{ isStatic: true,  isTriple: false, open: staticDelimiters[0],        close: staticDelimiters[1],        readers: STATIC_READERS },
				{ isStatic: true,  isTriple: true,  open: staticTripleDelimiters[0],  close: staticTripleDelimiters[1],  readers: TRIPLE_READERS }
			];

			this.contextLines = options.contextLines || 0;

			this.sortMustacheTags();

			this.sectionDepth = 0;
			this.elementStack = [];

			this.interpolate = {
				script: !options.interpolate || options.interpolate.script !== false,
				style: !options.interpolate || options.interpolate.style !== false,
				textarea: true
			};

			if ( options.sanitize === true ) {
				options.sanitize = {
					// blacklist from https://code.google.com/p/google-caja/source/browse/trunk/src/com/google/caja/lang/html/html4-elements-whitelist.json
					elements: 'applet base basefont body frame frameset head html isindex link meta noframes noscript object param script style title'.split( ' ' ),
					eventAttributes: true
				};
			}

			this.stripComments = options.stripComments !== false;
			this.preserveWhitespace = options.preserveWhitespace;
			this.sanitizeElements = options.sanitize && options.sanitize.elements;
			this.sanitizeEventAttributes = options.sanitize && options.sanitize.eventAttributes;
			this.includeLinePositions = options.includeLinePositions;
			this.textOnlyMode = options.textOnlyMode;
			this.csp = options.csp;
		},

		postProcess: function ( result ) {
			// special case - empty string
			if ( !result.length ) {
				return { t: [], v: TEMPLATE_VERSION };
			}

			if ( this.sectionDepth > 0 ) {
				this.error( 'A section was left open' );
			}

			cleanup( result[0].t, this.stripComments, this.preserveWhitespace, !this.preserveWhitespace, !this.preserveWhitespace );

			if ( this.csp !== false ) {
				var expr = {};
				insertExpressions( result[0].t, expr );
				if ( Object.keys( expr ).length ) result[0].e = expr;
			}

			return result[0];
		},

		converters: [
			readTemplate
		],

		sortMustacheTags: function () {
			// Sort in order of descending opening delimiter length (longer first),
			// to protect against opening delimiters being substrings of each other
			this.tags.sort( function ( a, b ) {
				return b.open.length - a.open.length;
			});
		}
	});

	var parseOptions = [
		'delimiters',
		'tripleDelimiters',
		'staticDelimiters',
		'staticTripleDelimiters',
		'csp',
		'interpolate',
		'preserveWhitespace',
		'sanitize',
		'stripComments',
		'contextLines'
	];

	var TEMPLATE_INSTRUCTIONS = "Either preparse or use a ractive runtime source that includes the parser. ";

	var COMPUTATION_INSTRUCTIONS = "Either use:\n\n\tRactive.parse.computedStrings( component.computed )\n\nat build time to pre-convert the strings to functions, or use functions instead of strings in computed properties.";


	function throwNoParse ( method, error, instructions ) {
		if ( !method ) {
			fatal( ("Missing Ractive.parse - cannot parse " + error + ". " + instructions) );
		}
	}

	function createFunction ( body, length ) {
		throwNoParse( fromExpression, 'new expression function', TEMPLATE_INSTRUCTIONS );
		return fromExpression( body, length );
	}

	function createFunctionFromString ( str, bindTo ) {
		throwNoParse( fromComputationString, 'compution string "${str}"', COMPUTATION_INSTRUCTIONS );
		return fromComputationString( str, bindTo );
	}

	var parser = {

		fromId: function ( id, options ) {
			if ( !doc ) {
				if ( options && options.noThrow ) { return; }
				throw new Error( ("Cannot retrieve template #" + id + " as Ractive is not running in a browser.") );
			}

			if ( id ) id = id.replace( /^#/, '' );

			var template;

			if ( !( template = doc.getElementById( id ) )) {
				if ( options && options.noThrow ) { return; }
				throw new Error( ("Could not find template element with id #" + id) );
			}

			if ( template.tagName.toUpperCase() !== 'SCRIPT' ) {
				if ( options && options.noThrow ) { return; }
				throw new Error( ("Template element with id #" + id + ", must be a <script> element") );
			}

			return ( 'textContent' in template ? template.textContent : template.innerHTML );

		},

		isParsed: function ( template) {
			return !( typeof template === 'string' );
		},

		getParseOptions: function ( ractive ) {
			// Could be Ractive or a Component
			if ( ractive.defaults ) { ractive = ractive.defaults; }

			return parseOptions.reduce( function ( val, key ) {
				val[ key ] = ractive[ key ];
				return val;
			}, {});
		},

		parse: function ( template, options ) {
			throwNoParse( parse, 'template', TEMPLATE_INSTRUCTIONS );
			var parsed = parse( template, options );
			addFunctions( parsed );
			return parsed;
		},

		parseFor: function( template, ractive ) {
			return this.parse( template, this.getParseOptions( ractive ) );
		}
	};

	var templateConfigurator = {
		name: 'template',

		extend: function ( Parent, proto, options ) {
			// only assign if exists
			if ( 'template' in options ) {
				var template = options.template;

				if ( typeof template === 'function' ) {
					proto.template = template;
				} else {
					proto.template = parseTemplate( template, proto );
				}
			}
		},

		init: function ( Parent, ractive, options ) {
			// TODO because of prototypal inheritance, we might just be able to use
			// ractive.template, and not bother passing through the Parent object.
			// At present that breaks the test mocks' expectations
			var template = 'template' in options ? options.template : Parent.prototype.template;
			template = template || { v: TEMPLATE_VERSION, t: [] };

			if ( typeof template === 'function' ) {
				var fn = template;
				template = getDynamicTemplate( ractive, fn );

				ractive._config.template = {
					fn: fn,
					result: template
				};
			}

			template = parseTemplate( template, ractive );

			// TODO the naming of this is confusing - ractive.template refers to [...],
			// but Component.prototype.template refers to {v:1,t:[],p:[]}...
			// it's unnecessary, because the developer never needs to access
			// ractive.template
			ractive.template = template.t;

			if ( template.p ) {
				extendPartials( ractive.partials, template.p );
			}
		},

		reset: function ( ractive ) {
			var result = resetValue( ractive );

			if ( result ) {
				var parsed = parseTemplate( result, ractive );

				ractive.template = parsed.t;
				extendPartials( ractive.partials, parsed.p, true );

				return true;
			}
		}
	};

	function resetValue ( ractive ) {
		var initial = ractive._config.template;

		// If this isn't a dynamic template, there's nothing to do
		if ( !initial || !initial.fn ) {
			return;
		}

		var result = getDynamicTemplate( ractive, initial.fn );

		// TODO deep equality check to prevent unnecessary re-rendering
		// in the case of already-parsed templates
		if ( result !== initial.result ) {
			initial.result = result;
			return result;
		}
	}

	function getDynamicTemplate ( ractive, fn ) {
		return fn.call( ractive, {
			fromId: parser.fromId,
			isParsed: parser.isParsed,
			parse: function ( template, options ) {
				if ( options === void 0 ) options = parser.getParseOptions( ractive );

				return parser.parse( template, options );
			}
		});
	}

	function parseTemplate ( template, ractive ) {
		if ( typeof template === 'string' ) {
			// parse will validate and add expression functions
			template = parseAsString( template, ractive );
		}
		else {
			// need to validate and add exp for already parsed template
			validate$1( template );
			addFunctions( template );
		}

		return template;
	}

	function parseAsString ( template, ractive ) {
		// ID of an element containing the template?
		if ( template[0] === '#' ) {
			template = parser.fromId( template );
		}

		return parser.parseFor( template, ractive );
	}

	function validate$1( template ) {

		// Check that the template even exists
		if ( template == undefined ) {
			throw new Error( ("The template cannot be " + template + ".") );
		}

		// Check the parsed template has a version at all
		else if ( typeof template.v !== 'number' ) {
			throw new Error( 'The template parser was passed a non-string template, but the template doesn\'t have a version.  Make sure you\'re passing in the template you think you are.' );
		}

		// Check we're using the correct version
		else if ( template.v !== TEMPLATE_VERSION ) {
			throw new Error( ("Mismatched template version (expected " + TEMPLATE_VERSION + ", got " + (template.v) + ") Please ensure you are using the latest version of Ractive.js in your build process as well as in your app") );
		}
	}

	function extendPartials ( existingPartials, newPartials, overwrite ) {
		if ( !newPartials ) return;

		// TODO there's an ambiguity here - we need to overwrite in the `reset()`
		// case, but not initially...

		for ( var key in newPartials ) {
			if ( overwrite || !existingPartials.hasOwnProperty( key ) ) {
				existingPartials[ key ] = newPartials[ key ];
			}
		}
	}

	var registryNames = [
		'adaptors',
		'components',
		'computed',
		'decorators',
		'easing',
		'events',
		'interpolators',
		'partials',
		'transitions'
	];

	var Registry = function Registry ( name, useDefaults ) {
		this.name = name;
		this.useDefaults = useDefaults;
	};

	Registry.prototype.extend = function extend ( Parent, proto, options ) {
		this.configure(
			this.useDefaults ? Parent.defaults : Parent,
			this.useDefaults ? proto : proto.constructor,
			options );
	};

	Registry.prototype.init = function init () {
		// noop
	};

	Registry.prototype.configure = function configure ( Parent, target, options ) {
		var name = this.name;
		var option = options[ name ];

		var registry = create( Parent[name] );

		for ( var key in option ) {
			registry[ key ] = option[ key ];
		}

		target[ name ] = registry;
	};

	Registry.prototype.reset = function reset ( ractive ) {
		var registry = ractive[ this.name ];
		var changed = false;

		Object.keys( registry ).forEach( function ( key ) {
			var item = registry[ key ];
				
			if ( item._fn ) {
				if ( item._fn.isOwner ) {
					registry[key] = item._fn;
				} else {
					delete registry[key];
				}
				changed = true;
			}
		});

		return changed;
	};

	var registries = registryNames.map( function ( name ) { return new Registry( name, name === 'computed' ); } );

	function wrap ( parent, name, method ) {
		if ( !/_super/.test( method ) ) return method;

		function wrapper () {
			var superMethod = getSuperMethod( wrapper._parent, name );
			var hasSuper = '_super' in this;
			var oldSuper = this._super;

			this._super = superMethod;

			var result = method.apply( this, arguments );

			if ( hasSuper ) {
				this._super = oldSuper;
			} else {
				delete this._super;
			}

			return result;
		}

		wrapper._parent = parent;
		wrapper._method = method;

		return wrapper;
	}

	function getSuperMethod ( parent, name ) {
		if ( name in parent ) {
			var value = parent[ name ];

			return typeof value === 'function' ?
				value :
				function () { return value; };
		}

		return noop;
	}

	function getMessage( deprecated, correct, isError ) {
		return "options." + deprecated + " has been deprecated in favour of options." + correct + "."
			+ ( isError ? (" You cannot specify both options, please use options." + correct + ".") : '' );
	}

	function deprecateOption ( options, deprecatedOption, correct ) {
		if ( deprecatedOption in options ) {
			if( !( correct in options ) ) {
				warnIfDebug( getMessage( deprecatedOption, correct ) );
				options[ correct ] = options[ deprecatedOption ];
			} else {
				throw new Error( getMessage( deprecatedOption, correct, true ) );
			}
		}
	}

	function deprecate ( options ) {
		deprecateOption( options, 'beforeInit', 'onconstruct' );
		deprecateOption( options, 'init', 'onrender' );
		deprecateOption( options, 'complete', 'oncomplete' );
		deprecateOption( options, 'eventDefinitions', 'events' );

		// Using extend with Component instead of options,
		// like Human.extend( Spider ) means adaptors as a registry
		// gets copied to options. So we have to check if actually an array
		if ( isArray( options.adaptors ) ) {
			deprecateOption( options, 'adaptors', 'adapt' );
		}
	}

	var custom = {
		adapt: adaptConfigurator,
		css: cssConfigurator,
		data: dataConfigurator,
		template: templateConfigurator
	};

	var defaultKeys = Object.keys( defaults );

	var isStandardKey = makeObj( defaultKeys.filter( function ( key ) { return !custom[ key ]; } ) );

	// blacklisted keys that we don't double extend
	var isBlacklisted = makeObj( defaultKeys.concat( registries.map( function ( r ) { return r.name; } ) ) );

	var order = [].concat(
		defaultKeys.filter( function ( key ) { return !registries[ key ] && !custom[ key ]; } ),
		registries,
		//custom.data,
		custom.template,
		custom.css
	);

	var config = {
		extend: function ( Parent, proto, options ) { return configure( 'extend', Parent, proto, options ); },

		init: function ( Parent, ractive, options ) { return configure( 'init', Parent, ractive, options ); },

		reset: function ( ractive ) {
			return order.filter( function ( c ) {
				return c.reset && c.reset( ractive );
			}).map( function ( c ) { return c.name; } );
		},

		// this defines the order. TODO this isn't used anywhere in the codebase,
		// only in the test suite - should get rid of it
		order: order
	};

	function configure ( method, Parent, target, options ) {
		deprecate( options );

		for ( var key in options ) {
			if ( isStandardKey.hasOwnProperty( key ) ) {
				var value = options[ key ];

				// warn the developer if they passed a function and ignore its value

				// NOTE: we allow some functions on "el" because we duck type element lists
				// and some libraries or ef'ed-up virtual browsers (phantomJS) return a
				// function object as the result of querySelector methods
				if ( key !== 'el' && typeof value === 'function' ) {
					warnIfDebug( ("" + key + " is a Ractive option that does not expect a function and will be ignored"),
						method === 'init' ? target : null );
				}
				else {
					target[ key ] = value;
				}
			}
		}

		// disallow combination of `append` and `enhance`
		if ( options.append && options.enhance ) {
			throw new Error( 'Cannot use append and enhance at the same time' );
		}

		registries.forEach( function ( registry ) {
			registry[ method ]( Parent, target, options );
		});

		adaptConfigurator[ method ]( Parent, target, options );
		templateConfigurator[ method ]( Parent, target, options );
		cssConfigurator[ method ]( Parent, target, options );

		extendOtherMethods( Parent.prototype, target, options );
	}

	function extendOtherMethods ( parent, target, options ) {
		for ( var key in options ) {
			if ( !isBlacklisted[ key ] && options.hasOwnProperty( key ) ) {
				var member = options[ key ];

				// if this is a method that overwrites a method, wrap it:
				if ( typeof member === 'function' ) {
					member = wrap( parent, key, member );
				}

				target[ key ] = member;
			}
		}
	}

	function makeObj ( array ) {
		var obj = {};
		array.forEach( function ( x ) { return obj[x] = true; } );
		return obj;
	}

	var shouldRerender = [ 'template', 'partials', 'components', 'decorators', 'events' ];

	var completeHook$1 = new Hook( 'complete' );
	var resetHook = new Hook( 'reset' );
	var renderHook$1 = new Hook( 'render' );
	var unrenderHook = new Hook( 'unrender' );

	function Ractive$reset ( data ) {
		data = data || {};

		if ( typeof data !== 'object' ) {
			throw new Error( 'The reset method takes either no arguments, or an object containing new data' );
		}

		// TEMP need to tidy this up
		data = dataConfigurator.init( this.constructor, this, { data: data });

		var promise = runloop.start( this, true );

		// If the root object is wrapped, try and use the wrapper's reset value
		var wrapper = this.viewmodel.wrapper;
		if ( wrapper && wrapper.reset ) {
			if ( wrapper.reset( data ) === false ) {
				// reset was rejected, we need to replace the object
				this.viewmodel.set( data );
			}
		} else {
			this.viewmodel.set( data );
		}

		// reset config items and track if need to rerender
		var changes = config.reset( this );
		var rerender;

		var i = changes.length;
		while ( i-- ) {
			if ( shouldRerender.indexOf( changes[i] ) > -1 ) {
				rerender = true;
				break;
			}
		}

		if ( rerender ) {
			unrenderHook.fire( this );
			this.fragment.resetTemplate( this.template );
			renderHook$1.fire( this );
			completeHook$1.fire( this );
		}

		runloop.end();

		resetHook.fire( this, data );

		return promise;
	}

	function collect( source, name, attr, dest ) {
		source.forEach( function ( item ) {
			// queue to rerender if the item is a partial and the current name matches
			if ( item.type === PARTIAL && ( item.refName ===  name || item.name === name ) ) {
				item.inAttribute = attr;
				dest.push( item );
				return; // go no further
			}

			// if it has a fragment, process its items
			if ( item.fragment ) {
				collect( item.fragment.iterations || item.fragment.items, name, attr, dest );
			}

			// or if it is itself a fragment, process its items
			else if ( isArray( item.items ) ) {
				collect( item.items, name, attr, dest );
			}

			// or if it is a component, step in and process its items
			else if ( item.type === COMPONENT && item.instance ) {
				// ...unless the partial is shadowed
				if ( item.instance.partials[ name ] ) return;
				collect( item.instance.fragment.items, name, attr, dest );
			}

			// if the item is an element, process its attributes too
			if ( item.type === ELEMENT ) {
				if ( isArray( item.attributes ) ) {
					collect( item.attributes, name, true, dest );
				}
			}
		});
	}

	function forceResetTemplate ( partial ) {
		partial.forceResetTemplate();
	}

	function resetPartial ( name, partial ) {
		var collection = [];
		collect( this.fragment.items, name, false, collection );

		var promise = runloop.start( this, true );

		this.partials[ name ] = partial;
		collection.forEach( forceResetTemplate );

		runloop.end();

		return promise;
	}

	var Item = function Item ( options ) {
		this.parentFragment = options.parentFragment;
		this.ractive = options.parentFragment.ractive;

		this.template = options.template;
		this.index = options.index;
		this.type = options.template.t;

		this.dirty = false;
	};

	Item.prototype.bubble = function bubble () {
		if ( !this.dirty ) {
			this.dirty = true;
			this.parentFragment.bubble();
		}
	};

	Item.prototype.destroyed = function destroyed () {
		if ( this.fragment ) this.fragment.destroyed();
	};

	Item.prototype.find = function find () {
		return null;
	};

	Item.prototype.findAll = function findAll () {
		// noop
	};

	Item.prototype.findComponent = function findComponent () {
		return null;
	};

	Item.prototype.findAllComponents = function findAllComponents () {
		// noop;
	};

	Item.prototype.findNextNode = function findNextNode () {
		return this.parentFragment.findNextNode( this );
	};

	Item.prototype.shuffled = function shuffled () {
		if ( this.fragment ) this.fragment.shuffled();
	};

	Item.prototype.valueOf = function valueOf () {
		return this.toString();
	};

	var ComputationChild = (function (Model) {
		function ComputationChild () {
			Model.apply(this, arguments);
		}

		ComputationChild.prototype = Object.create( Model && Model.prototype );
		ComputationChild.prototype.constructor = ComputationChild;

		ComputationChild.prototype.get = function get ( shouldCapture ) {
			if ( shouldCapture ) capture( this );

			var parentValue = this.parent.get();
			return parentValue ? parentValue[ this.key ] : undefined;
		};

		ComputationChild.prototype.handleChange = function handleChange$1 () {
			this.dirty = true;

			this.links.forEach( marked );
			this.deps.forEach( handleChange );
			this.children.forEach( handleChange );
			this.clearUnresolveds(); // TODO is this necessary?
		};

		ComputationChild.prototype.joinKey = function joinKey ( key ) {
			if ( key === undefined || key === '' ) return this;

			if ( !this.childByKey.hasOwnProperty( key ) ) {
				var child = new ComputationChild( this, key );
				this.children.push( child );
				this.childByKey[ key ] = child;
			}

			return this.childByKey[ key ];
		};

		return ComputationChild;
	}(Model));

	function createResolver ( proxy, ref, index ) {
		var resolver = proxy.fragment.resolve( ref, function ( model ) {
			removeFromArray( proxy.resolvers, resolver );
			proxy.models[ index ] = model;
			proxy.bubble();
		});

		proxy.resolvers.push( resolver );
	}

	var ExpressionProxy = (function (Model) {
		function ExpressionProxy ( fragment, template ) {
			var this$1 = this;

			Model.call( this, fragment.ractive.viewmodel, null );

			this.fragment = fragment;
			this.template = template;

			this.isReadonly = true;
			this.dirty = true;

			this.fn = getFunction( template.s, template.r.length );

			this.resolvers = [];
			this.models = this.template.r.map( function ( ref, index ) {
				var model = resolveReference( this$1.fragment, ref );

				if ( !model ) {
					createResolver( this$1, ref, index );
				}

				return model;
			});
			this.dependencies = [];

			this.shuffle = undefined;

			this.bubble();
		}

		ExpressionProxy.prototype = Object.create( Model && Model.prototype );
		ExpressionProxy.prototype.constructor = ExpressionProxy;

		ExpressionProxy.prototype.bubble = function bubble ( actuallyChanged ) {
			// refresh the keypath
			if ( actuallyChanged === void 0 ) actuallyChanged = true;

			if ( this.registered ) delete this.root.expressions[ this.keypath ];
			this.keypath = undefined;

			if ( actuallyChanged ) {
				this.dirty = true;
				this.handleChange();
			}
		};

		ExpressionProxy.prototype.get = function get ( shouldCapture ) {
			if ( shouldCapture ) capture( this );

			if ( this.dirty ) {
				this.dirty = false;
				this.value = this.getValue();
				if ( this.wrapper ) this.newWrapperValue = this.value;
				this.adapt();
			}

			return shouldCapture && this.wrapper ? this.wrapperValue : this.value;
		};

		ExpressionProxy.prototype.getKeypath = function getKeypath () {
			var this$1 = this;

			if ( !this.template ) return '@undefined';
			if ( !this.keypath ) {
				this.keypath = '@' + this.template.s.replace( /_(\d+)/g, function ( match, i ) {
					if ( i >= this$1.models.length ) return match;

					var model = this$1.models[i];
					return model ? model.getKeypath() : '@undefined';
				});

				this.root.expressions[ this.keypath ] = this;
				this.registered = true;
			}

			return this.keypath;
		};

		ExpressionProxy.prototype.getValue = function getValue () {
			var this$1 = this;

			startCapturing();
			var result;

			try {
				var params = this.models.map( function ( m ) { return m ? m.get( true ) : undefined; } );
				result = this.fn.apply( this.fragment.ractive, params );
			} catch ( err ) {
				warnIfDebug( ("Failed to compute " + (this.getKeypath()) + ": " + (err.message || err)) );
			}

			var dependencies = stopCapturing();
			// remove missing deps
			this.dependencies.filter( function ( d ) { return !~dependencies.indexOf( d ); } ).forEach( function ( d ) {
				d.unregister( this$1 );
				removeFromArray( this$1.dependencies, d );
			});
			// register new deps
			dependencies.filter( function ( d ) { return !~this$1.dependencies.indexOf( d ); } ).forEach( function ( d ) {
				d.register( this$1 );
				this$1.dependencies.push( d );
			});

			return result;
		};

		ExpressionProxy.prototype.handleChange = function handleChange$1 () {
			this.dirty = true;

			this.links.forEach( marked );
			this.deps.forEach( handleChange );
			this.children.forEach( handleChange );

			this.clearUnresolveds();
		};

		ExpressionProxy.prototype.joinKey = function joinKey ( key ) {
			if ( key === undefined || key === '' ) return this;

			if ( !this.childByKey.hasOwnProperty( key ) ) {
				var child = new ComputationChild( this, key );
				this.children.push( child );
				this.childByKey[ key ] = child;
			}

			return this.childByKey[ key ];
		};

		ExpressionProxy.prototype.mark = function mark () {
			this.handleChange();
		};

		ExpressionProxy.prototype.rebinding = function rebinding ( next, previous, safe ) {
			var idx = this.models.indexOf( previous );

			if ( ~idx ) {
				next = rebindMatch( this.template.r[idx], next, previous );
				if ( next !== previous ) {
					previous.unregister( this );
					this.models.splice( idx, 1, next );
					// TODO: set up a resolver if there is no next?
					if ( next ) next.addShuffleRegister( this, 'mark' );
				}
			}
			this.bubble( !safe );
		};

		ExpressionProxy.prototype.retrieve = function retrieve () {
			return this.get();
		};

		ExpressionProxy.prototype.teardown = function teardown () {
			var this$1 = this;

			this.unbind();
			this.fragment = undefined;
			if ( this.dependencies ) this.dependencies.forEach( function ( d ) { return d.unregister( this$1 ); } );
			Model.prototype.teardown.call(this);
		};

		ExpressionProxy.prototype.unreference = function unreference () {
			Model.prototype.unreference.call(this);
			if ( !this.deps.length && !this.refs ) this.teardown();
		};

		ExpressionProxy.prototype.unregister = function unregister( dep ) {
			Model.prototype.unregister.call( this, dep );
			if ( !this.deps.length && !this.refs ) this.teardown();
		};

		ExpressionProxy.prototype.unbind = function unbind$1 () {
			this.resolvers.forEach( unbind );
		};

		return ExpressionProxy;
	}(Model));

	var ReferenceExpressionChild = (function (Model) {
		function ReferenceExpressionChild ( parent, key ) {
			Model.call ( this, parent, key );
		}

		ReferenceExpressionChild.prototype = Object.create( Model && Model.prototype );
		ReferenceExpressionChild.prototype.constructor = ReferenceExpressionChild;

		ReferenceExpressionChild.prototype.applyValue = function applyValue ( value ) {
			if ( isEqual( value, this.value ) ) return;

			var parent = this.parent, keys = [ this.key ];
			while ( parent ) {
				if ( parent.base ) {
					var target = parent.model.joinAll( keys );
					target.applyValue( value );
					break;
				}

				keys.unshift( parent.key );

				parent = parent.parent;
			}
		};

		ReferenceExpressionChild.prototype.joinKey = function joinKey ( key ) {
			if ( key === undefined || key === '' ) return this;

			if ( !this.childByKey.hasOwnProperty( key ) ) {
				var child = new ReferenceExpressionChild( this, key );
				this.children.push( child );
				this.childByKey[ key ] = child;
			}

			return this.childByKey[ key ];
		};

		ReferenceExpressionChild.prototype.retrieve = function retrieve () {
			var parent = this.parent.get();
			return parent && parent[ this.key ];
		};

		return ReferenceExpressionChild;
	}(Model));

	var ReferenceExpressionProxy = (function (Model) {
		function ReferenceExpressionProxy ( fragment, template ) {
			var this$1 = this;

			Model.call( this, null, null );
			this.dirty = true;
			this.root = fragment.ractive.viewmodel;
			this.template = template;

			this.resolvers = [];

			this.base = resolve$2( fragment, template );
			var baseResolver;

			if ( !this.base ) {
				baseResolver = fragment.resolve( template.r, function ( model ) {
					this$1.base = model;
					this$1.bubble();

					removeFromArray( this$1.resolvers, baseResolver );
				});

				this.resolvers.push( baseResolver );
			}

			var intermediary = this.intermediary = {
				handleChange: function () { return this$1.handleChange(); },
				rebinding: function ( next, previous ) {
					if ( previous === this$1.base ) {
						next = rebindMatch( template, next, previous );
						if ( next !== this$1.base ) {
							this$1.base.unregister( intermediary );
							this$1.base = next;
							// TODO: if there is no next, set up a resolver?
						}
					} else {
						var idx = this$1.members.indexOf( previous );
						if ( ~idx ) {
							// only direct references will rebind... expressions handle themselves
							next = rebindMatch( template.m[idx].n, next, previous );
							if ( next !== this$1.members[idx] ) {
								this$1.members.splice( idx, 1, next );
								// TODO: if there is no next, set up a resolver?
							}
						}
					}

					if ( next !== previous ) previous.unregister( intermediary );
					if ( next ) next.addShuffleTask( function () { return next.register( intermediary ); } );

					this$1.bubble();
				}
			};

			this.members = template.m.map( function ( template, i ) {
				if ( typeof template === 'string' ) {
					return { get: function () { return template; } };
				}

				var model;
				var resolver;

				if ( template.t === REFERENCE ) {
					model = resolveReference( fragment, template.n );

					if ( model ) {
						model.register( intermediary );
					} else {
						resolver = fragment.resolve( template.n, function ( model ) {
							this$1.members[i] = model;

							model.register( intermediary );
							this$1.handleChange();

							removeFromArray( this$1.resolvers, resolver );
						});

						this$1.resolvers.push( resolver );
					}

					return model;
				}

				model = new ExpressionProxy( fragment, template );
				model.register( intermediary );
				return model;
			});

			this.isUnresolved = true;
			this.bubble();
		}

		ReferenceExpressionProxy.prototype = Object.create( Model && Model.prototype );
		ReferenceExpressionProxy.prototype.constructor = ReferenceExpressionProxy;

		ReferenceExpressionProxy.prototype.bubble = function bubble () {
			if ( !this.base ) return;
			if ( !this.dirty ) this.handleChange();
		};

		ReferenceExpressionProxy.prototype.forceResolution = function forceResolution () {
			this.resolvers.forEach( function ( resolver ) { return resolver.forceResolution(); } );
			this.dirty = true;
			this.bubble();
		};

		ReferenceExpressionProxy.prototype.get = function get ( shouldCapture ) {
			var this$1 = this;

			if ( this.dirty ) {
				this.bubble();

				var i = this.members.length, resolved = true;
				while ( resolved && i-- ) {
					if ( !this$1.members[i] ) resolved = false;
				}

				if ( this.base && resolved ) {
					var keys = this.members.map( function ( m ) { return escapeKey( String( m.get() ) ); } );
					var model = this.base.joinAll( keys );

					if ( model !== this.model ) {
						if ( this.model ) {
							this.model.unregister( this );
							this.model.unregisterTwowayBinding( this );
						}

						this.model = model;
						this.parent = model.parent;
						this.model.register( this );
						this.model.registerTwowayBinding( this );

						if ( this.keypathModel ) this.keypathModel.handleChange();
					}
				}

				this.value = this.model ? this.model.get( shouldCapture ) : undefined;
				this.dirty = false;
				this.mark();
				return this.value;
			} else {
				return this.model ? this.model.get( shouldCapture ) : undefined;
			}
		};

		// indirect two-way bindings
		ReferenceExpressionProxy.prototype.getValue = function getValue () {
			var this$1 = this;

			this.value = this.model ? this.model.get() : undefined;

			var i = this.bindings.length;
			while ( i-- ) {
				var value = this$1.bindings[i].getValue();
				if ( value !== this$1.value ) return value;
			}

			// check one-way bindings
			var oneway = findBoundValue( this.deps );
			if ( oneway ) return oneway.value;

			return this.value;
		};

		ReferenceExpressionProxy.prototype.getKeypath = function getKeypath () {
			return this.model ? this.model.getKeypath() : '@undefined';
		};

		ReferenceExpressionProxy.prototype.handleChange = function handleChange$1 () {
			this.dirty = true;
			this.mark();
		};

		ReferenceExpressionProxy.prototype.joinKey = function joinKey ( key ) {
			if ( key === undefined || key === '' ) return this;

			if ( !this.childByKey.hasOwnProperty( key ) ) {
				var child = new ReferenceExpressionChild( this, key );
				this.children.push( child );
				this.childByKey[ key ] = child;
			}

			return this.childByKey[ key ];
		};

		ReferenceExpressionProxy.prototype.mark = function mark$1 () {
			if ( this.dirty ) {
				this.deps.forEach( handleChange );
			}

			this.links.forEach( marked );
			this.children.forEach( mark );
			this.clearUnresolveds();
		};

		ReferenceExpressionProxy.prototype.retrieve = function retrieve () {
			return this.value;
		};

		ReferenceExpressionProxy.prototype.rebinding = function rebinding () { }; // NOOP

		ReferenceExpressionProxy.prototype.set = function set ( value ) {
			if ( !this.model ) throw new Error( 'Unresolved reference expression. This should not happen!' );
			this.model.set( value );
		};

		ReferenceExpressionProxy.prototype.teardown = function teardown () {
			var this$1 = this;

			this.resolvers.forEach( unbind );

			if ( this.model ) {
				this.model.unregister( this );
				this.model.unregisterTwowayBinding( this );
			}
			if ( this.members ) {
				this.members.forEach( function ( m ) { return m && m.unregister && m.unregister( this$1 ); } );
			}
		};

		ReferenceExpressionProxy.prototype.unreference = function unreference () {
			Model.prototype.unreference.call(this);
			if ( !this.deps.length && !this.refs ) this.teardown();
		};

		ReferenceExpressionProxy.prototype.unregister = function unregister( dep ) {
			Model.prototype.unregister.call( this, dep );
			if ( !this.deps.length && !this.refs ) this.teardown();
		};

		return ReferenceExpressionProxy;
	}(Model));

	function resolve$2 ( fragment, template ) {
		if ( template.r ) {
			return resolveReference( fragment, template.r );
		}

		else if ( template.x ) {
			return new ExpressionProxy( fragment, template.x );
		}

		else if ( template.rx ) {
			return new ReferenceExpressionProxy( fragment, template.rx );
		}
	}

	function resolveAliases( section ) {
		if ( section.template.z ) {
			section.aliases = {};

			var refs = section.template.z;
			for ( var i = 0; i < refs.length; i++ ) {
				section.aliases[ refs[i].n ] = resolve$2( section.parentFragment, refs[i].x );
			}
		}

		for ( var k in section.aliases ) {
			section.aliases[k].reference();
		}
	}

	var Alias = (function (Item) {
		function Alias ( options ) {
			Item.call( this, options );

			this.fragment = null;
		}

		Alias.prototype = Object.create( Item && Item.prototype );
		Alias.prototype.constructor = Alias;

		Alias.prototype.bind = function bind () {
			resolveAliases( this );

			this.fragment = new Fragment({
				owner: this,
				template: this.template.f
			}).bind();
		};

		Alias.prototype.detach = function detach () {
			return this.fragment ? this.fragment.detach() : createDocumentFragment();
		};

		Alias.prototype.find = function find ( selector ) {
			if ( this.fragment ) {
				return this.fragment.find( selector );
			}
		};

		Alias.prototype.findAll = function findAll ( selector, query ) {
			if ( this.fragment ) {
				this.fragment.findAll( selector, query );
			}
		};

		Alias.prototype.findComponent = function findComponent ( name ) {
			if ( this.fragment ) {
				return this.fragment.findComponent( name );
			}
		};

		Alias.prototype.findAllComponents = function findAllComponents ( name, query ) {
			if ( this.fragment ) {
				this.fragment.findAllComponents( name, query );
			}
		};

		Alias.prototype.firstNode = function firstNode ( skipParent ) {
			return this.fragment && this.fragment.firstNode( skipParent );
		};

		Alias.prototype.rebinding = function rebinding () {
			var this$1 = this;

			if ( this.locked ) return;
			this.locked = true;
			runloop.scheduleTask( function () {
				this$1.locked = false;
				resolveAliases( this$1 );
			});
		};

		Alias.prototype.render = function render ( target ) {
			this.rendered = true;
			if ( this.fragment ) this.fragment.render( target );
		};

		Alias.prototype.toString = function toString ( escape ) {
			return this.fragment ? this.fragment.toString( escape ) : '';
		};

		Alias.prototype.unbind = function unbind () {
			this.aliases = {};

			for ( var k in this.fragment.aliases ) {
				this.aliases[k].unreference();
			}

			if ( this.fragment ) this.fragment.unbind();
		};

		Alias.prototype.unrender = function unrender ( shouldDestroy ) {
			if ( this.rendered && this.fragment ) this.fragment.unrender( shouldDestroy );
			this.rendered = false;
		};

		Alias.prototype.update = function update () {
			if ( this.dirty ) {
				this.dirty = false;
				this.fragment.update();
			}
		};

		return Alias;
	}(Item));

	function findElement( start, orComponent, name ) {
		if ( orComponent === void 0 ) orComponent = true;

		while ( start && ( start.type !== ELEMENT || ( name && start.name !== name ) ) && ( !orComponent || start.type !== COMPONENT ) ) {
			// start is a fragment - look at the owner
			if ( start.owner ) start = start.owner;
			// start is a component or yielder - look at the container
			else if ( start.component ) start = start.containerFragment || start.component.parentFragment;
			// start is an item - look at the parent
			else if ( start.parent ) start = start.parent;
			// start is an item without a parent - look at the parent fragment
			else if ( start.parentFragment ) start = start.parentFragment;

			else start = undefined;
		}

		return start;
	}

	var space = /\s+/;
	var remove$1 = /\/\*(?:[\s\S]*?)\*\//g;
	var escape$1 = /url\(\s*(['"])(?:\\[\s\S]|(?!\1).)*\1\s*\)|url\((?:\\[\s\S]|[^)])*\)|(['"])(?:\\[\s\S]|(?!\1).)*\2/gi;
	var value$1 = /\0(\d+)/g;

	function readStyle ( css ) {
		var values = [];

		if ( typeof css !== 'string' ) return {};

		return css.replace( escape$1, function ( match ) { return ("\u0000" + (values.push( match ) - 1)); })
			.replace( remove$1, '' )
			.split( ';' )
			.filter( function ( rule ) { return !!rule.trim(); } )
			.map( function ( rule ) { return rule.replace( value$1, function ( match, n ) { return values[ n ]; } ); } )
			.reduce(function ( rules, rule ) {
				var i = rule.indexOf(':');
				var name = rule.substr( 0, i ).trim();
				rules[ name ] = rule.substr( i + 1 ).trim();
				return rules;
			}, {});
	}

	function readClass ( str ) {
		var list = str.split( space );

		// remove any empty entries
		var i = list.length;
		while ( i-- ) {
			if ( !list[i] ) list.splice( i, 1 );
		}

		return list;
	}

	var textTypes = [ undefined, 'text', 'search', 'url', 'email', 'hidden', 'password', 'search', 'reset', 'submit' ];

	function getUpdateDelegate ( attribute ) {
		var element = attribute.element, name = attribute.name;

		if ( name === 'id' ) return updateId;

		if ( name === 'value' ) {
			if ( attribute.interpolator ) attribute.interpolator.bound = true;

			// special case - selects
			if ( element.name === 'select' && name === 'value' ) {
				return element.getAttribute( 'multiple' ) ? updateMultipleSelectValue : updateSelectValue;
			}

			if ( element.name === 'textarea' ) return updateStringValue;

			// special case - contenteditable
			if ( element.getAttribute( 'contenteditable' ) != null ) return updateContentEditableValue;

			// special case - <input>
			if ( element.name === 'input' ) {
				var type = element.getAttribute( 'type' );

				// type='file' value='{{fileList}}'>
				if ( type === 'file' ) return noop; // read-only

				// type='radio' name='{{twoway}}'
				if ( type === 'radio' && element.binding && element.binding.attribute.name === 'name' ) return updateRadioValue;

				if ( ~textTypes.indexOf( type ) ) return updateStringValue;
			}

			return updateValue;
		}

		var node = element.node;

		// special case - <input type='radio' name='{{twoway}}' value='foo'>
		if ( attribute.isTwoway && name === 'name' ) {
			if ( node.type === 'radio' ) return updateRadioName;
			if ( node.type === 'checkbox' ) return updateCheckboxName;
		}

		if ( name === 'style' ) return updateStyleAttribute;

		if ( name.indexOf( 'style-' ) === 0 ) return updateInlineStyle;

		// special case - class names. IE fucks things up, again
		if ( name === 'class' && ( !node.namespaceURI || node.namespaceURI === html ) ) return updateClassName;

		if ( name.indexOf( 'class-' ) === 0 ) return updateInlineClass;

		if ( attribute.isBoolean ) {
			var type$1 = element.getAttribute( 'type' );
			if ( attribute.interpolator && name === 'checked' && ( type$1 === 'checkbox' || type$1 === 'radio' ) ) attribute.interpolator.bound = true;
			return updateBoolean;
		}

		if ( attribute.namespace && attribute.namespace !== attribute.node.namespaceURI ) return updateNamespacedAttribute;

		return updateAttribute;
	}

	function updateId ( reset ) {
		var ref = this, node = ref.node;
		var value = this.getValue();

		// remove the mapping to this node if it hasn't already been replaced
		if ( this.ractive.nodes[ node.id ] === node ) delete this.ractive.nodes[ node.id ];
		if ( reset ) return node.removeAttribute( 'id' );

		this.ractive.nodes[ value ] = node;

		node.id = value;
	}

	function updateMultipleSelectValue ( reset ) {
		var value = this.getValue();

		if ( !isArray( value ) ) value = [ value ];

		var options = this.node.options;
		var i = options.length;

		if ( reset ) {
			while ( i-- ) options[i].selected = false;
		} else {
			while ( i-- ) {
				var option = options[i];
				var optionValue = option._ractive ?
					option._ractive.value :
					option.value; // options inserted via a triple don't have _ractive

				option.selected = arrayContains( value, optionValue );
			}
		}
	}

	function updateSelectValue ( reset ) {
		var value = this.getValue();

		if ( !this.locked ) { // TODO is locked still a thing?
			this.node._ractive.value = value;

			var options = this.node.options;
			var i = options.length;
			var wasSelected = false;

			if ( reset ) {
				while ( i-- ) options[i].selected = false;
			} else {
				while ( i-- ) {
					var option = options[i];
					var optionValue = option._ractive ?
						option._ractive.value :
						option.value; // options inserted via a triple don't have _ractive
					if ( option.disabled && option.selected ) wasSelected = true;

					if ( optionValue == value ) { // double equals as we may be comparing numbers with strings
						option.selected = true;
						return;
					}
				}
			}

			if ( !wasSelected ) this.node.selectedIndex = -1;
		}
	}


	function updateContentEditableValue ( reset ) {
		var value = this.getValue();

		if ( !this.locked ) {
			if ( reset ) this.node.innerHTML = '';
			else this.node.innerHTML = value === undefined ? '' : value;
		}
	}

	function updateRadioValue ( reset ) {
		var node = this.node;
		var wasChecked = node.checked;

		var value = this.getValue();

		if ( reset ) return node.checked = false;

		//node.value = this.element.getAttribute( 'value' );
		node.value = this.node._ractive.value = value;
		node.checked = value === this.element.getAttribute( 'name' );

		// This is a special case - if the input was checked, and the value
		// changed so that it's no longer checked, the twoway binding is
		// most likely out of date. To fix it we have to jump through some
		// hoops... this is a little kludgy but it works
		if ( wasChecked && !node.checked && this.element.binding && this.element.binding.rendered ) {
			this.element.binding.group.model.set( this.element.binding.group.getValue() );
		}
	}

	function updateValue ( reset ) {
		if ( !this.locked ) {
			if ( reset ) {
				this.node.removeAttribute( 'value' );
				this.node.value = this.node._ractive.value = null;
				return;
			}

			var value = this.getValue();

			this.node.value = this.node._ractive.value = value;
			this.node.setAttribute( 'value', safeToStringValue( value ) );
		}
	}

	function updateStringValue ( reset ) {
		if ( !this.locked ) {
			if ( reset ) {
				this.node._ractive.value = '';
				this.node.removeAttribute( 'value' );
				return;
			}

			var value = this.getValue();

			this.node._ractive.value = value;

			this.node.value = safeToStringValue( value );
			this.node.setAttribute( 'value', safeToStringValue( value ) );
		}
	}

	function updateRadioName ( reset ) {
		if ( reset ) this.node.checked = false;
		else this.node.checked = ( this.getValue() == this.node._ractive.value );
	}

	function updateCheckboxName ( reset ) {
		var ref = this, element = ref.element, node = ref.node;
		var binding = element.binding;

		var value = this.getValue();
		var valueAttribute = element.getAttribute( 'value' );

		if ( reset ) {
			// TODO: WAT?
		}

		if ( !isArray( value ) ) {
			binding.isChecked = node.checked = ( value == valueAttribute );
		} else {
			var i = value.length;
			while ( i-- ) {
				if ( valueAttribute == value[i] ) {
					binding.isChecked = node.checked = true;
					return;
				}
			}
			binding.isChecked = node.checked = false;
		}
	}

	function updateStyleAttribute ( reset ) {
		var props = reset ? {} : readStyle( this.getValue() || '' );
		var style = this.node.style;
		var keys = Object.keys( props );
		var prev = this.previous || [];

		var i = 0;
		while ( i < keys.length ) {
			if ( keys[i] in style ) {
				var safe = props[ keys[i] ].replace( '!important', '' );
				style.setProperty( keys[i], safe, safe.length !== props[ keys[i] ].length ? 'important' : '' );
			}
			i++;
		}

		// remove now-missing attrs
		i = prev.length;
		while ( i-- ) {
			if ( !~keys.indexOf( prev[i] ) && prev[i] in style ) style.setProperty( prev[i], '', '' );
		}

		this.previous = keys;
	}

	function updateInlineStyle ( reset ) {
		if ( !this.style ) {
			this.style = decamelize( this.name.substr( 6 ) );
		}

		var value = reset ? '' : safeToStringValue( this.getValue() );
		var safe = value.replace( '!important', '' );
		this.node.style.setProperty( this.style, safe, safe.length !== value.length ? 'important' : '' );
	}

	function updateClassName ( reset ) {
		var value = reset ? [] : readClass( safeToStringValue( this.getValue() ) );

		// watch for weirdo svg elements
		var cls = this.node.className;
		cls = cls.baseVal !== undefined ? cls.baseVal : cls;

		var attr = readClass( cls );
		var prev = this.previous || attr.slice( 0 );

		var className = value.concat( attr.filter( function ( c ) { return !~prev.indexOf( c ); } ) ).join( ' ' );

		if ( className !== cls ) {
			if ( typeof this.node.className !== 'string' ) {
				this.node.className.baseVal = className;
			} else {
				this.node.className = className;
			}
		}

		this.previous = value;
	}

	function updateInlineClass ( reset ) {
		var name = this.name.substr( 6 );

		// watch for weirdo svg elements
		var cls = this.node.className;
		cls = cls.baseVal !== undefined ? cls.baseVal : cls;

		var attr = readClass( cls );
		var value = reset ? false : this.getValue();

		if ( !this.inlineClass ) this.inlineClass = name;

		if ( value && !~attr.indexOf( name ) ) attr.push( name );
		else if ( !value && ~attr.indexOf( name ) ) attr.splice( attr.indexOf( name ), 1 );

		if ( typeof this.node.className !== 'string' ) {
			this.node.className.baseVal = attr.join( ' ' );
		} else {
			this.node.className = attr.join( ' ' );
		}
	}

	function updateBoolean ( reset ) {
		// with two-way binding, only update if the change wasn't initiated by the user
		// otherwise the cursor will often be sent to the wrong place
		if ( !this.locked ) {
			if ( reset ) {
				if ( this.useProperty ) this.node[ this.propertyName ] = false;
				this.node.removeAttribute( this.propertyName );
				return;
			}

			if ( this.useProperty ) {
				this.node[ this.propertyName ] = this.getValue();
			} else {
				if ( this.getValue() ) {
					this.node.setAttribute( this.propertyName, '' );
				} else {
					this.node.removeAttribute( this.propertyName );
				}
			}
		}
	}

	function updateAttribute ( reset ) {
		if ( reset ) this.node.removeAttribute( this.name );
		else this.node.setAttribute( this.name, safeToStringValue( this.getString() ) );
	}

	function updateNamespacedAttribute ( reset ) {
		if ( reset ) this.node.removeAttributeNS( this.namespace, this.name.slice( this.name.indexOf( ':' ) + 1 ) );
		else this.node.setAttributeNS( this.namespace, this.name.slice( this.name.indexOf( ':' ) + 1 ), safeToStringValue( this.getString() ) );
	}

	var propertyNames = {
		'accept-charset': 'acceptCharset',
		accesskey: 'accessKey',
		bgcolor: 'bgColor',
		'class': 'className',
		codebase: 'codeBase',
		colspan: 'colSpan',
		contenteditable: 'contentEditable',
		datetime: 'dateTime',
		dirname: 'dirName',
		'for': 'htmlFor',
		'http-equiv': 'httpEquiv',
		ismap: 'isMap',
		maxlength: 'maxLength',
		novalidate: 'noValidate',
		pubdate: 'pubDate',
		readonly: 'readOnly',
		rowspan: 'rowSpan',
		tabindex: 'tabIndex',
		usemap: 'useMap'
	};

	function lookupNamespace ( node, prefix ) {
		var qualified = "xmlns:" + prefix;

		while ( node ) {
			if ( node.hasAttribute && node.hasAttribute( qualified ) ) return node.getAttribute( qualified );
			node = node.parentNode;
		}

		return namespaces[ prefix ];
	}

	var attribute = false;
	function inAttribute () { return attribute; }

	var Attribute = (function (Item) {
		function Attribute ( options ) {
			Item.call( this, options );

			this.name = options.template.n;
			this.namespace = null;

			this.owner = options.owner || options.parentFragment.owner || options.element || findElement( options.parentFragment );
			this.element = options.element || (this.owner.attributeByName ? this.owner : findElement( options.parentFragment ) );
			this.parentFragment = options.parentFragment; // shared
			this.ractive = this.parentFragment.ractive;

			this.rendered = false;
			this.updateDelegate = null;
			this.fragment = null;

			this.element.attributeByName[ this.name ] = this;

			if ( !isArray( options.template.f ) ) {
				this.value = options.template.f;
				if ( this.value === 0 ) {
					this.value = '';
				}
			} else {
				this.fragment = new Fragment({
					owner: this,
					template: options.template.f
				});
			}

			this.interpolator = this.fragment &&
				this.fragment.items.length === 1 &&
				this.fragment.items[0].type === INTERPOLATOR &&
				this.fragment.items[0];

			if ( this.interpolator ) this.interpolator.owner = this;
		}

		Attribute.prototype = Object.create( Item && Item.prototype );
		Attribute.prototype.constructor = Attribute;

		Attribute.prototype.bind = function bind () {
			if ( this.fragment ) {
				this.fragment.bind();
			}
		};

		Attribute.prototype.bubble = function bubble () {
			if ( !this.dirty ) {
				this.parentFragment.bubble();
				this.element.bubble();
				this.dirty = true;
			}
		};

		Attribute.prototype.destroyed = function destroyed () {
			this.updateDelegate( true );
		};

		Attribute.prototype.getString = function getString () {
			attribute = true;
			var value = this.fragment ?
				this.fragment.toString() :
				this.value != null ? '' + this.value : '';
			attribute = false;
			return value;
		};

		// TODO could getValue ever be called for a static attribute,
		// or can we assume that this.fragment exists?
		Attribute.prototype.getValue = function getValue () {
			attribute = true;
			var value = this.fragment ? this.fragment.valueOf() : booleanAttributes.test( this.name ) ? true : this.value;
			attribute = false;
			return value;
		};

		Attribute.prototype.render = function render () {
			var node = this.element.node;
			this.node = node;

			// should we use direct property access, or setAttribute?
			if ( !node.namespaceURI || node.namespaceURI === namespaces.html ) {
				this.propertyName = propertyNames[ this.name ] || this.name;

				if ( node[ this.propertyName ] !== undefined ) {
					this.useProperty = true;
				}

				// is attribute a boolean attribute or 'value'? If so we're better off doing e.g.
				// node.selected = true rather than node.setAttribute( 'selected', '' )
				if ( booleanAttributes.test( this.name ) || this.isTwoway ) {
					this.isBoolean = true;
				}

				if ( this.propertyName === 'value' ) {
					node._ractive.value = this.value;
				}
			}

			if ( node.namespaceURI ) {
				var index = this.name.indexOf( ':' );
				if ( index !== -1 ) {
					this.namespace = lookupNamespace( node, this.name.slice( 0, index ) );
				} else {
					this.namespace = node.namespaceURI;
				}
			}

			this.rendered = true;
			this.updateDelegate = getUpdateDelegate( this );
			this.updateDelegate();
		};

		Attribute.prototype.toString = function toString () {
			attribute = true;

			var value = this.getValue();

			// Special case - select and textarea values (should not be stringified)
			if ( this.name === 'value' && ( this.element.getAttribute( 'contenteditable' ) !== undefined || ( this.element.name === 'select' || this.element.name === 'textarea' ) ) ) {
				return;
			}

			// Special case – bound radio `name` attributes
			if ( this.name === 'name' && this.element.name === 'input' && this.interpolator && this.element.getAttribute( 'type' ) === 'radio' ) {
				return ("name=\"{{" + (this.interpolator.model.getKeypath()) + "}}\"");
			}

			// Special case - style and class attributes and directives
			if ( this.owner === this.element && ( this.name === 'style' || this.name === 'class' || this.style || this.inlineClass ) ) {
				return;
			}

			if ( !this.rendered && this.owner === this.element && ( !this.name.indexOf( 'style-' ) || !this.name.indexOf( 'class-' ) ) ) {
				if ( !this.name.indexOf( 'style-' ) ) {
					this.style = decamelize( this.name.substr( 6 ) );
				} else {
					this.inlineClass = this.name.substr( 6 );
				}

				return;
			}

			if ( booleanAttributes.test( this.name ) ) return value ? this.name : '';
			if ( value == null ) return '';

			var str = safeAttributeString( this.getString() );
			attribute = false;

			return str ?
				("" + (this.name) + "=\"" + str + "\"") :
				this.name;
		};

		Attribute.prototype.unbind = function unbind () {
			if ( this.fragment ) this.fragment.unbind();
		};

		Attribute.prototype.unrender = function unrender () {
			this.updateDelegate( true );

			this.rendered = false;
		};

		Attribute.prototype.update = function update () {
			if ( this.dirty ) {
				this.dirty = false;
				if ( this.fragment ) this.fragment.update();
				if ( this.rendered ) this.updateDelegate();
				if ( this.isTwoway && !this.locked ) {
					this.interpolator.twowayBinding.lastVal( true, this.interpolator.model.get() );
				}
			}
		};

		return Attribute;
	}(Item));

	var BindingFlag = (function (Item) {
		function BindingFlag ( options ) {
			Item.call( this, options );

			this.owner = options.owner || options.parentFragment.owner || findElement( options.parentFragment );
			this.element = this.owner.attributeByName ? this.owner : findElement( options.parentFragment );
			this.flag = options.template.v === 'l' ? 'lazy' : 'twoway';

			if ( this.element.type === ELEMENT ) {
				if ( isArray( options.template.f ) ) {
					this.fragment = new Fragment({
						owner: this,
						template: options.template.f
					});
				}

				this.interpolator = this.fragment &&
									this.fragment.items.length === 1 &&
									this.fragment.items[0].type === INTERPOLATOR &&
									this.fragment.items[0];
			}
		}

		BindingFlag.prototype = Object.create( Item && Item.prototype );
		BindingFlag.prototype.constructor = BindingFlag;

		BindingFlag.prototype.bind = function bind () {
			if ( this.fragment ) this.fragment.bind();
			set$2( this, this.getValue(), true );
		};

		BindingFlag.prototype.bubble = function bubble () {
			if ( !this.dirty ) {
				this.element.bubble();
				this.dirty = true;
			}
		};

		BindingFlag.prototype.getValue = function getValue () {
			if ( this.fragment ) return this.fragment.valueOf();
			else if ( 'value' in this ) return this.value;
			else if ( 'f' in this.template ) return this.template.f;
			else return true;
		};

		BindingFlag.prototype.render = function render () {
			set$2( this, this.getValue(), true );
		};

		BindingFlag.prototype.toString = function toString () { return ''; };

		BindingFlag.prototype.unbind = function unbind () {
			if ( this.fragment ) this.fragment.unbind();

			delete this.element[ this.flag ];
		};

		BindingFlag.prototype.unrender = function unrender () {
			if ( this.element.rendered ) this.element.recreateTwowayBinding();
		};

		BindingFlag.prototype.update = function update () {
			if ( this.dirty ) {
				if ( this.fragment ) this.fragment.update();
				set$2( this, this.getValue(), true );
			}
		};

		return BindingFlag;
	}(Item));

	function set$2 ( flag, value, update ) {
		if ( value === 0 ) {
			flag.value = true;
		} else if ( value === 'true' ) {
			flag.value = true;
		} else if ( value === 'false' || value === '0' ) {
			flag.value = false;
		} else {
			flag.value = value;
		}

		var current = flag.element[ flag.flag ];
		flag.element[ flag.flag ] = flag.value;
		if ( update && !flag.element.attributes.binding && current !== flag.value ) {
			flag.element.recreateTwowayBinding();
		}

		return flag.value;
	}

	var div$1 = doc ? createElement( 'div' ) : null;

	var attributes = false;
	function inAttributes() { return attributes; }
	function doInAttributes( fn ) {
		attributes = true;
		fn();
		attributes = false;
	}

	var ConditionalAttribute = (function (Item) {
		function ConditionalAttribute ( options ) {
			Item.call( this, options );

			this.attributes = [];

			this.owner = options.owner;

			this.fragment = new Fragment({
				ractive: this.ractive,
				owner: this,
				template: this.template
			});
			// this fragment can't participate in node-y things
			this.fragment.findNextNode = noop;

			this.dirty = false;
		}

		ConditionalAttribute.prototype = Object.create( Item && Item.prototype );
		ConditionalAttribute.prototype.constructor = ConditionalAttribute;

		ConditionalAttribute.prototype.bind = function bind () {
			this.fragment.bind();
		};

		ConditionalAttribute.prototype.bubble = function bubble () {
			if ( !this.dirty ) {
				this.dirty = true;
				this.owner.bubble();
			}
		};

		ConditionalAttribute.prototype.render = function render () {
			this.node = this.owner.node;
			if ( this.node ) {
				this.isSvg = this.node.namespaceURI === svg$1;
			}

			attributes = true;
			if ( !this.rendered ) this.fragment.render();
			attributes = false;

			this.rendered = true;
			this.dirty = true; // TODO this seems hacky, but necessary for tests to pass in browser AND node.js
			this.update();
		};

		ConditionalAttribute.prototype.toString = function toString () {
			return this.fragment.toString();
		};

		ConditionalAttribute.prototype.unbind = function unbind () {
			this.fragment.unbind();
		};

		ConditionalAttribute.prototype.unrender = function unrender () {
			this.rendered = false;
			this.fragment.unrender();
		};

		ConditionalAttribute.prototype.update = function update () {
			var this$1 = this;

			var str;
			var attrs;

			if ( this.dirty ) {
				this.dirty = false;

				attributes = true;
				this.fragment.update();
				attributes = false;

				if ( this.rendered && this.node ) {
					str = this.fragment.toString();
					attrs = parseAttributes( str, this.isSvg );

					// any attributes that previously existed but no longer do
					// must be removed
					this.attributes.filter( function ( a ) { return notIn( attrs, a ); } ).forEach( function ( a ) {
						this$1.node.removeAttribute( a.name );
					});

					attrs.forEach( function ( a ) {
						this$1.node.setAttribute( a.name, a.value );
					});

					this.attributes = attrs;
				}
			}
		};

		return ConditionalAttribute;
	}(Item));

	function parseAttributes ( str, isSvg ) {
		var tagName = isSvg ? 'svg' : 'div';
		return str
			? (div$1.innerHTML = "<" + tagName + " " + str + "></" + tagName + ">") &&
				toArray(div$1.childNodes[0].attributes)
			: [];
	}

	function notIn ( haystack, needle ) {
		var i = haystack.length;

		while ( i-- ) {
			if ( haystack[i].name === needle.name ) {
				return false;
			}
		}

		return true;
	}

	function processWrapper ( wrapper, array, methodName, newIndices ) {
		var __model = wrapper.__model;

		if ( newIndices ) {
			__model.shuffle( newIndices );
		} else {
			// If this is a sort or reverse, we just do root.set()...
			// TODO use merge logic?
			//root.viewmodel.mark( keypath );
		}
	}

	var mutatorMethods = [ 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift' ];
	var patchedArrayProto = [];

	mutatorMethods.forEach( function ( methodName ) {
		var method = function () {
			var this$1 = this;
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];

			var newIndices = getNewIndices( this.length, methodName, args );

			// lock any magic array wrappers, so that things don't get fudged
			this._ractive.wrappers.forEach( function ( r ) { if ( r.magic ) r.magic.locked = true; } );

			// apply the underlying method
			var result = Array.prototype[ methodName ].apply( this, arguments );

			// trigger changes
			runloop.start();

			this._ractive.setting = true;
			var i = this._ractive.wrappers.length;
			while ( i-- ) {
				processWrapper( this$1._ractive.wrappers[i], this$1, methodName, newIndices );
			}

			runloop.end();

			this._ractive.setting = false;

			// unlock the magic arrays... magic... bah
			this._ractive.wrappers.forEach( function ( r ) { if ( r.magic ) r.magic.locked = false; } );

			return result;
		};

		defineProperty( patchedArrayProto, methodName, {
			value: method,
			configurable: true
		});
	});

	var patchArrayMethods;
	var unpatchArrayMethods;

	// can we use prototype chain injection?
	// http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/#wrappers_prototype_chain_injection
	if ( ({}).__proto__ ) {
		// yes, we can
		patchArrayMethods = function ( array ) { return array.__proto__ = patchedArrayProto; };
		unpatchArrayMethods = function ( array ) { return array.__proto__ = Array.prototype; };
	}

	else {
		// no, we can't
		patchArrayMethods = function ( array ) {
			var i = mutatorMethods.length;
			while ( i-- ) {
				var methodName = mutatorMethods[i];
				defineProperty( array, methodName, {
					value: patchedArrayProto[ methodName ],
					configurable: true
				});
			}
		};

		unpatchArrayMethods = function ( array ) {
			var i = mutatorMethods.length;
			while ( i-- ) {
				delete array[ mutatorMethods[i] ];
			}
		};
	}

	patchArrayMethods.unpatch = unpatchArrayMethods; // TODO export separately?
	var patch = patchArrayMethods;

	var errorMessage$1 = 'Something went wrong in a rather interesting way';

	var arrayAdaptor = {
		filter: function ( object ) {
			// wrap the array if a) b) it's an array, and b) either it hasn't been wrapped already,
			// or the array didn't trigger the get() itself
			return isArray( object ) && ( !object._ractive || !object._ractive.setting );
		},
		wrap: function ( ractive, array, keypath ) {
			return new ArrayWrapper( ractive, array, keypath );
		}
	};

	var ArrayWrapper = function ArrayWrapper ( ractive, array ) {
		this.root = ractive;
		this.value = array;
		this.__model = null; // filled in later

		// if this array hasn't already been ractified, ractify it
		if ( !array._ractive ) {
			// define a non-enumerable _ractive property to store the wrappers
			defineProperty( array, '_ractive', {
				value: {
					wrappers: [],
					instances: [],
					setting: false
				},
				configurable: true
			});

			patch( array );
		}

		// store the ractive instance, so we can handle transitions later
		if ( !array._ractive.instances[ ractive._guid ] ) {
			array._ractive.instances[ ractive._guid ] = 0;
			array._ractive.instances.push( ractive );
		}

		array._ractive.instances[ ractive._guid ] += 1;
		array._ractive.wrappers.push( this );
	};

	ArrayWrapper.prototype.get = function get () {
		return this.value;
	};

	ArrayWrapper.prototype.reset = function reset ( value ) {
		return this.value === value;
	};

	ArrayWrapper.prototype.teardown = function teardown () {
		var array, storage, wrappers, instances, index;

		array = this.value;
		storage = array._ractive;
		wrappers = storage.wrappers;
		instances = storage.instances;

		// if teardown() was invoked because we're clearing the cache as a result of
		// a change that the array itself triggered, we can save ourselves the teardown
		// and immediate setup
		if ( storage.setting ) {
			return false; // so that we don't remove it from cached wrappers
		}

		index = wrappers.indexOf( this );
		if ( index === -1 ) {
			throw new Error( errorMessage$1 );
		}

		wrappers.splice( index, 1 );

		// if nothing else depends on this array, we can revert it to its
		// natural state
		if ( !wrappers.length ) {
			delete array._ractive;
			patch.unpatch( this.value );
		}

		else {
			// remove ractive instance if possible
			instances[ this.root._guid ] -= 1;
			if ( !instances[ this.root._guid ] ) {
				index = instances.indexOf( this.root );

				if ( index === -1 ) {
					throw new Error( errorMessage$1 );
				}

				instances.splice( index, 1 );
			}
		}
	};

	var magicAdaptor;

	try {
		Object.defineProperty({}, 'test', { get: function() {}, set: function() {} });

		magicAdaptor = {
			filter: function ( value ) {
				return value && typeof value === 'object';
			},
			wrap: function ( ractive, value, keypath ) {
				return new MagicWrapper( ractive, value, keypath );
			}
		};
	} catch ( err ) {
		magicAdaptor = false;
	}

	var magicAdaptor$1 = magicAdaptor;

	function createOrWrapDescriptor ( originalDescriptor, ractive, keypath, wrapper ) {
		if ( originalDescriptor.set && originalDescriptor.set.__magic ) {
			originalDescriptor.set.__magic.dependants.push({ ractive: ractive, keypath: keypath });
			return originalDescriptor;
		}

		var setting;

		var dependants = [{ ractive: ractive, keypath: keypath }];

		var descriptor = {
			get: function () {
				return 'value' in originalDescriptor ? originalDescriptor.value : originalDescriptor.get.call( this );
			},
			set: function (value) {
				if ( setting ) return;

				if ( 'value' in originalDescriptor ) {
					originalDescriptor.value = value;
				} else {
					originalDescriptor.set.call( this, value );
				}

				if ( wrapper.locked ) return;
				setting = true;
				dependants.forEach( function (ref) {
					var ractive = ref.ractive;
					var keypath = ref.keypath;

					ractive.set( keypath, value );
				});
				setting = false;
			},
			enumerable: true
		};

		descriptor.set.__magic = { dependants: dependants, originalDescriptor: originalDescriptor };

		return descriptor;
	}

	function revert ( descriptor, ractive, keypath ) {
		if ( !descriptor.set || !descriptor.set.__magic ) return true;

		var dependants = descriptor.set.__magic;
		var i = dependants.length;
		while ( i-- ) {
			var dependant = dependants[i];
			if ( dependant.ractive === ractive && dependant.keypath === keypath ) {
				dependants.splice( i, 1 );
				return false;
			}
		}
	}

	var MagicWrapper = function MagicWrapper ( ractive, value, keypath ) {
		var this$1 = this;

			this.ractive = ractive;
		this.value = value;
		this.keypath = keypath;

		this.originalDescriptors = {};

		// wrap all properties with getters
		Object.keys( value ).forEach( function ( key ) {
			var originalDescriptor = Object.getOwnPropertyDescriptor( this$1.value, key );
			this$1.originalDescriptors[ key ] = originalDescriptor;

			var childKeypath = keypath ? ("" + keypath + "." + (escapeKey( key ))) : escapeKey( key );

			var descriptor = createOrWrapDescriptor( originalDescriptor, ractive, childKeypath, this$1 );



			Object.defineProperty( this$1.value, key, descriptor );
		});
	};

	MagicWrapper.prototype.get = function get () {
		return this.value;
	};

	MagicWrapper.prototype.reset = function reset ( value ) {
		return this.value === value;
	};

	MagicWrapper.prototype.set = function set ( key, value ) {
		this.value[ key ] = value;
	};

	MagicWrapper.prototype.teardown = function teardown () {
		var this$1 = this;

			Object.keys( this.value ).forEach( function ( key ) {
			var descriptor = Object.getOwnPropertyDescriptor( this$1.value, key );
			if ( !descriptor.set || !descriptor.set.__magic ) return;

			revert( descriptor );

			if ( descriptor.set.__magic.dependants.length === 1 ) {
				Object.defineProperty( this$1.value, key, descriptor.set.__magic.originalDescriptor );
			}
		});
	};

	var MagicArrayWrapper = function MagicArrayWrapper ( ractive, array, keypath ) {
		this.value = array;

		this.magic = true;

		this.magicWrapper = magicAdaptor$1.wrap( ractive, array, keypath );
		this.arrayWrapper = arrayAdaptor.wrap( ractive, array, keypath );
		this.arrayWrapper.magic = this.magicWrapper;

		// ugh, this really is a terrible hack
		Object.defineProperty( this, '__model', {
			get: function () {
				return this.arrayWrapper.__model;
			},
			set: function ( model ) {
				this.arrayWrapper.__model = model;
			}
		});
	};

	MagicArrayWrapper.prototype.get = function get () {
		return this.value;
	};

	MagicArrayWrapper.prototype.teardown = function teardown () {
		this.arrayWrapper.teardown();
		this.magicWrapper.teardown();
	};

	MagicArrayWrapper.prototype.reset = function reset ( value ) {
		return this.arrayWrapper.reset( value ) && this.magicWrapper.reset( value );
	};

	var magicArrayAdaptor = {
		filter: function ( object, keypath, ractive ) {
			return magicAdaptor$1.filter( object, keypath, ractive ) && arrayAdaptor.filter( object );
		},

		wrap: function ( ractive, array, keypath ) {
			return new MagicArrayWrapper( ractive, array, keypath );
		}
	};

	// TODO this is probably a bit anal, maybe we should leave it out
	function prettify ( fnBody ) {
		var lines = fnBody
			.replace( /^\t+/gm, function ( tabs ) { return tabs.split( '\t' ).join( '  ' ); } )
			.split( '\n' );

		var minIndent = lines.length < 2 ? 0 :
			lines.slice( 1 ).reduce( function ( prev, line ) {
				return Math.min( prev, /^\s*/.exec( line )[0].length );
			}, Infinity );

		return lines.map( function ( line, i ) {
			return '    ' + ( i ? line.substring( minIndent ) : line );
		}).join( '\n' );
	}

	// Ditto. This function truncates the stack to only include app code
	function truncateStack ( stack ) {
		if ( !stack ) return '';

		var lines = stack.split( '\n' );
		var name = Computation.name + '.getValue';

		var truncated = [];

		var len = lines.length;
		for ( var i = 1; i < len; i += 1 ) {
			var line = lines[i];

			if ( ~line.indexOf( name ) ) {
				return truncated.join( '\n' );
			} else {
				truncated.push( line );
			}
		}
	}

	var Computation = (function (Model) {
		function Computation ( viewmodel, signature, key ) {
			Model.call( this, null, null );

			this.root = this.parent = viewmodel;
			this.signature = signature;

			this.key = key; // not actually used, but helps with debugging
			this.isExpression = key && key[0] === '@';

			this.isReadonly = !this.signature.setter;

			this.context = viewmodel.computationContext;

			this.dependencies = [];

			this.children = [];
			this.childByKey = {};

			this.deps = [];

			this.dirty = true;

			// TODO: is there a less hackish way to do this?
			this.shuffle = undefined;
		}

		Computation.prototype = Object.create( Model && Model.prototype );
		Computation.prototype.constructor = Computation;

		Computation.prototype.get = function get ( shouldCapture ) {
			if ( shouldCapture ) capture( this );

			if ( this.dirty ) {
				this.dirty = false;
				this.value = this.getValue();
				if ( this.wrapper ) this.newWrapperValue = this.value;
				this.adapt();
			}

			// if capturing, this value needs to be unwrapped because it's for external use
			return shouldCapture && this.wrapper ? this.wrapperValue : this.value;
		};

		Computation.prototype.getValue = function getValue () {
			startCapturing();
			var result;

			try {
				result = this.signature.getter.call( this.context );
			} catch ( err ) {
				warnIfDebug( ("Failed to compute " + (this.getKeypath()) + ": " + (err.message || err)) );

				// TODO this is all well and good in Chrome, but...
				// ...also, should encapsulate this stuff better, and only
				// show it if Ractive.DEBUG
				if ( hasConsole ) {
					if ( console.groupCollapsed ) console.groupCollapsed( '%cshow details', 'color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;' );
					var functionBody = prettify( this.signature.getterString );
					var stack = this.signature.getterUseStack ? '\n\n' + truncateStack( err.stack ) : '';
					console.error( ("" + (err.name) + ": " + (err.message) + "\n\n" + functionBody + "" + stack) );
					if ( console.groupCollapsed ) console.groupEnd();
				}
			}

			var dependencies = stopCapturing();
			this.setDependencies( dependencies );

			// if not the first computation and the value is not the same,
			// register the change for change events
			if ( 'value' in this && result !== this.value ) {
				this.registerChange( this.getKeypath(), result );
			}

			return result;
		};

		Computation.prototype.handleChange = function handleChange$1 () {
			this.dirty = true;

			this.links.forEach( marked );
			this.deps.forEach( handleChange );
			this.children.forEach( handleChange );
			this.clearUnresolveds(); // TODO same question as on Model - necessary for primitives?
		};

		Computation.prototype.joinKey = function joinKey ( key ) {
			if ( key === undefined || key === '' ) return this;

			if ( !this.childByKey.hasOwnProperty( key ) ) {
				var child = new ComputationChild( this, key );
				this.children.push( child );
				this.childByKey[ key ] = child;
			}

			return this.childByKey[ key ];
		};

		Computation.prototype.mark = function mark () {
			this.handleChange();
		};

		Computation.prototype.rebinding = function rebinding ( next, previous ) {
			// computations will grab all of their deps again automagically
			if ( next !== previous ) this.handleChange();
		};

		Computation.prototype.set = function set ( value ) {
			if ( !this.signature.setter ) {
				throw new Error( ("Cannot set read-only computed value '" + (this.key) + "'") );
			}

			this.signature.setter( value );
			this.mark();
		};

		Computation.prototype.setDependencies = function setDependencies ( dependencies ) {
			// unregister any soft dependencies we no longer have
			var this$1 = this;

			var i = this.dependencies.length;
			while ( i-- ) {
				var model = this$1.dependencies[i];
				if ( !~dependencies.indexOf( model ) ) model.unregister( this$1 );
			}

			// and add any new ones
			i = dependencies.length;
			while ( i-- ) {
				var model$1 = dependencies[i];
				if ( !~this$1.dependencies.indexOf( model$1 ) ) model$1.register( this$1 );
			}

			this.dependencies = dependencies;
		};

		Computation.prototype.teardown = function teardown () {
			var this$1 = this;

			var i = this.dependencies.length;
			while ( i-- ) {
				if ( this$1.dependencies[i] ) this$1.dependencies[i].unregister( this$1 );
			}
			if ( this.root.computations[this.key] === this ) delete this.root.computations[this.key];
			Model.prototype.teardown.call(this);
		};

		Computation.prototype.unregister = function unregister ( dependent ) {
			Model.prototype.unregister.call( this, dependent );
			// tear down expressions with no deps, because they will be replaced when needed
			if ( this.isExpression && this.deps.length === 0 ) this.teardown();
		};

		return Computation;
	}(Model));

	var RactiveModel = (function (Model) {
		function RactiveModel ( ractive ) {
			Model.call( this, null, '' );
			this.value = ractive;
			this.isRoot = true;
			this.root = this;
			this.adaptors = [];
			this.ractive = ractive;
			this.changes = {};
		}

		RactiveModel.prototype = Object.create( Model && Model.prototype );
		RactiveModel.prototype.constructor = RactiveModel;

		RactiveModel.prototype.getKeypath = function getKeypath() {
			return '@this';
		};

		return RactiveModel;
	}(Model));

	var hasProp$1 = Object.prototype.hasOwnProperty;

	var RootModel = (function (Model) {
		function RootModel ( options ) {
			Model.call( this, null, null );

			// TODO deprecate this
			this.changes = {};

			this.isRoot = true;
			this.root = this;
			this.ractive = options.ractive; // TODO sever this link

			this.value = options.data;
			this.adaptors = options.adapt;
			this.adapt();

			this.computationContext = options.ractive;
			this.computations = {};

			// TODO this is only for deprecation of using expression keypaths
			this.expressions = {};
		}

		RootModel.prototype = Object.create( Model && Model.prototype );
		RootModel.prototype.constructor = RootModel;

		RootModel.prototype.applyChanges = function applyChanges () {
			this._changeHash = {};
			this.flush();

			return this._changeHash;
		};

		RootModel.prototype.compute = function compute ( key, signature ) {
			var computation = new Computation( this, signature, key );
			this.computations[ escapeKey( key ) ] = computation;

			return computation;
		};

		RootModel.prototype.createLink = function createLink ( keypath, target, targetPath ) {
			var this$1 = this;

			var keys = splitKeypathI( keypath );

			var model = this;
			while ( keys.length ) {
				var key = keys.shift();
				model = this$1.childByKey[ key ] || this$1.joinKey( key );
			}

			return model.link( target, targetPath );
		};

		RootModel.prototype.get = function get ( shouldCapture, options ) {
			var this$1 = this;

			if ( shouldCapture ) capture( this );

			if ( !options || options.virtual !== false ) {
				var result = this.getVirtual();
				var keys = Object.keys( this.computations );
				var i = keys.length;
				while ( i-- ) {
					var computation = this$1.computations[ keys[i] ];
					// exclude template expressions
					if ( !computation.isExpression ) {
						result[ keys[i] ] = computation.get();
					}
				}

				return result;
			} else {
				return this.value;
			}
		};

		RootModel.prototype.getKeypath = function getKeypath () {
			return '';
		};

		RootModel.prototype.getRactiveModel = function getRactiveModel() {
			return this.ractiveModel || ( this.ractiveModel = new RactiveModel( this.ractive ) );
		};

		RootModel.prototype.getValueChildren = function getValueChildren () {
			var children = Model.prototype.getValueChildren.call( this, this.value );

			this.children.forEach( function ( child ) {
				if ( child._link ) {
					var idx = children.indexOf( child );
					if ( ~idx ) children.splice( idx, 1, child._link );
					else children.push( child._link );
				}
			});

			for ( var k in this.computations ) {
				children.push( this.computations[k] );
			}

			return children;
		};

		RootModel.prototype.handleChange = function handleChange$1 () {
			this.deps.forEach( handleChange );
		};

		RootModel.prototype.has = function has ( key ) {
			var value = this.value;
			var unescapedKey = unescapeKey( key );

			if ( hasProp$1.call( value, unescapedKey ) ) return true;

			// mappings/links and computations
			if ( key in this.computations || this.childByKey[unescapedKey] && this.childByKey[unescapedKey]._link ) return true;
			// TODO remove this after deprecation is done
			if ( key in this.expressions ) return true;

			// We climb up the constructor chain to find if one of them contains the unescapedKey
			var constructor = value.constructor;
			while ( constructor !== Function && constructor !== Array && constructor !== Object ) {
				if ( hasProp$1.call( constructor.prototype, unescapedKey ) ) return true;
				constructor = constructor.constructor;
			}

			return false;
		};

		RootModel.prototype.joinKey = function joinKey ( key, opts ) {
			if ( key === '@global' ) return GlobalModel$1;
			if ( key === '@this' ) return this.getRactiveModel();

			if ( this.expressions.hasOwnProperty( key ) ) {
				warnIfDebug( ("Accessing expression keypaths (" + (key.substr(1)) + ") from the instance is deprecated. You can used a getNodeInfo or event object to access keypaths with expression context.") );
				return this.expressions[ key ];
			}

			return this.computations.hasOwnProperty( key ) ? this.computations[ key ] :
			       Model.prototype.joinKey.call( this, key, opts );
		};

		RootModel.prototype.map = function map ( localKey, origin ) {
			var local = this.joinKey( localKey );
			local.link( origin );
		};

		RootModel.prototype.rebinding = function rebinding () {
		};

		RootModel.prototype.set = function set ( value ) {
			// TODO wrapping root node is a baaaad idea. We should prevent this
			var wrapper = this.wrapper;
			if ( wrapper ) {
				var shouldTeardown = !wrapper.reset || wrapper.reset( value ) === false;

				if ( shouldTeardown ) {
					wrapper.teardown();
					this.wrapper = null;
					this.value = value;
					this.adapt();
				}
			} else {
				this.value = value;
				this.adapt();
			}

			this.deps.forEach( handleChange );
			this.children.forEach( mark );
			this.clearUnresolveds(); // TODO do we need to do this with primitive values? if not, what about e.g. unresolved `length` property of null -> string?
		};

		RootModel.prototype.retrieve = function retrieve () {
			return this.wrapper ? this.wrapper.get() : this.value;
		};

		RootModel.prototype.teardown = function teardown () {
			Model.prototype.teardown.call(this);
			for ( var k in this.computations ) {
				this.computations[ k ].teardown();
			}
		};

		RootModel.prototype.update = function update () {
			// noop
		};

		return RootModel;
	}(Model));

	function getComputationSignature ( ractive, key, signature ) {
		var getter;
		var setter;

		// useful for debugging
		var getterString;
		var getterUseStack;
		var setterString;

		if ( typeof signature === 'function' ) {
			getter = bind( signature, ractive );
			getterString = signature.toString();
			getterUseStack = true;
		}

		if ( typeof signature === 'string' ) {
			getter = createFunctionFromString( signature, ractive );
			getterString = signature;
		}

		if ( typeof signature === 'object' ) {
			if ( typeof signature.get === 'string' ) {
				getter = createFunctionFromString( signature.get, ractive );
				getterString = signature.get;
			} else if ( typeof signature.get === 'function' ) {
				getter = bind( signature.get, ractive );
				getterString = signature.get.toString();
				getterUseStack = true;
			} else {
				fatal( '`%s` computation must have a `get()` method', key );
			}

			if ( typeof signature.set === 'function' ) {
				setter = bind( signature.set, ractive );
				setterString = signature.set.toString();
			}
		}

		return {
			getter: getter,
			setter: setter,
			getterString: getterString,
			setterString: setterString,
			getterUseStack: getterUseStack
		};
	}

	var constructHook = new Hook( 'construct' );

	var registryNames$1 = [
		'adaptors',
		'components',
		'decorators',
		'easing',
		'events',
		'interpolators',
		'partials',
		'transitions'
	];

	var uid = 0;

	function construct ( ractive, options ) {
		if ( Ractive.DEBUG ) welcome();

		initialiseProperties( ractive );

		// TODO remove this, eventually
		defineProperty( ractive, 'data', { get: deprecateRactiveData });

		// TODO don't allow `onconstruct` with `new Ractive()`, there's no need for it
		constructHook.fire( ractive, options );

		// Add registries
		registryNames$1.forEach( function ( name ) {
			ractive[ name ] = extendObj( create( ractive.constructor[ name ] || null ), options[ name ] );
		});

		// Create a viewmodel
		var viewmodel = new RootModel({
			adapt: getAdaptors( ractive, ractive.adapt, options ),
			data: dataConfigurator.init( ractive.constructor, ractive, options ),
			ractive: ractive
		});

		ractive.viewmodel = viewmodel;

		// Add computed properties
		var computed = extendObj( create( ractive.constructor.prototype.computed ), options.computed );

		for ( var key in computed ) {
			var signature = getComputationSignature( ractive, key, computed[ key ] );
			viewmodel.compute( key, signature );
		}
	}

	function combine$2 ( arrays ) {
		var res = [];
		var args = res.concat.apply( res, arrays );

		var i = args.length;
		while ( i-- ) {
			if ( !~res.indexOf( args[i] ) ) {
				res.unshift( args[i] );
			}
		}

		return res;
	}

	function getAdaptors ( ractive, protoAdapt, options ) {
		protoAdapt = protoAdapt.map( lookup );
		var adapt = ensureArray( options.adapt ).map( lookup );

		var builtins = [];
		var srcs = [ protoAdapt, adapt ];
		if ( ractive.parent && !ractive.isolated ) {
			srcs.push( ractive.parent.viewmodel.adaptors );
		}
		srcs.push( builtins );

		var magic = 'magic' in options ? options.magic : ractive.magic;
		var modifyArrays = 'modifyArrays' in options ? options.modifyArrays : ractive.modifyArrays;

		if ( magic ) {
			if ( !magicSupported ) {
				throw new Error( 'Getters and setters (magic mode) are not supported in this browser' );
			}

			if ( modifyArrays ) {
				builtins.push( magicArrayAdaptor );
			}

			builtins.push( magicAdaptor$1 );
		}

		if ( modifyArrays ) {
			builtins.push( arrayAdaptor );
		}

		return combine$2( srcs );


		function lookup ( adaptor ) {
			if ( typeof adaptor === 'string' ) {
				adaptor = findInViewHierarchy( 'adaptors', ractive, adaptor );

				if ( !adaptor ) {
					fatal( missingPlugin( adaptor, 'adaptor' ) );
				}
			}

			return adaptor;
		}
	}

	function initialiseProperties ( ractive ) {
		// Generate a unique identifier, for places where you'd use a weak map if it
		// existed
		ractive._guid = 'r-' + uid++;

		// events
		ractive._subs = create( null );

		// storage for item configuration from instantiation to reset,
		// like dynamic functions or original values
		ractive._config = {};

		// nodes registry
		ractive.nodes = {};

		// events
		ractive.event = null;
		ractive._eventQueue = [];

		// live queries
		ractive._liveQueries = [];
		ractive._liveComponentQueries = [];

		// observers
		ractive._observers = [];

		if(!ractive.component){
			ractive.root = ractive;
			ractive.parent = ractive.container = null; // TODO container still applicable?
		}

	}

	function deprecateRactiveData () {
		throw new Error( 'Using `ractive.data` is no longer supported - you must use the `ractive.get()` API instead' );
	}

	function getChildQueue ( queue, ractive ) {
		return queue[ ractive._guid ] || ( queue[ ractive._guid ] = [] );
	}

	function fire ( hookQueue, ractive ) {
		var childQueue = getChildQueue( hookQueue.queue, ractive );

		hookQueue.hook.fire( ractive );

		// queue is "live" because components can end up being
		// added while hooks fire on parents that modify data values.
		while ( childQueue.length ) {
			fire( hookQueue, childQueue.shift() );
		}

		delete hookQueue.queue[ ractive._guid ];
	}

	var HookQueue = function HookQueue ( event ) {
		this.hook = new Hook( event );
		this.inProcess = {};
		this.queue = {};
	};

	HookQueue.prototype.begin = function begin ( ractive ) {
		this.inProcess[ ractive._guid ] = true;
	};

	HookQueue.prototype.end = function end ( ractive ) {
		var parent = ractive.parent;

		// If this is *isn't* a child of a component that's in process,
		// it should call methods or fire at this point
		if ( !parent || !this.inProcess[ parent._guid ] ) {
			fire( this, ractive );
		}
		// elsewise, handoff to parent to fire when ready
		else {
			getChildQueue( this.queue, parent ).push( ractive );
		}

		delete this.inProcess[ ractive._guid ];
	};

	var configHook = new Hook( 'config' );
	var initHook = new HookQueue( 'init' );

	function initialise ( ractive, userOptions, options ) {
		Object.keys( ractive.viewmodel.computations ).forEach( function ( key ) {
			var computation = ractive.viewmodel.computations[ key ];

			if ( ractive.viewmodel.value.hasOwnProperty( key ) ) {
				computation.set( ractive.viewmodel.value[ key ] );
			}
		});

		// init config from Parent and options
		config.init( ractive.constructor, ractive, userOptions );

		configHook.fire( ractive );
		initHook.begin( ractive );

		var fragment;

		// Render virtual DOM
		if ( ractive.template ) {
			var cssIds;

			if ( options.cssIds || ractive.cssId ) {
				cssIds = options.cssIds ? options.cssIds.slice() : [];

				if ( ractive.cssId ) {
					cssIds.push( ractive.cssId );
				}
			}

			ractive.fragment = fragment = new Fragment({
				owner: ractive,
				template: ractive.template,
				cssIds: cssIds
			}).bind( ractive.viewmodel );
		}

		initHook.end( ractive );

		if ( fragment ) {
			// render automatically ( if `el` is specified )
			var el = getElement( ractive.el );
			if ( el ) {
				var promise = ractive.render( el, ractive.append );

				if ( Ractive.DEBUG_PROMISES ) {
					promise['catch']( function ( err ) {
						warnOnceIfDebug( 'Promise debugging is enabled, to help solve errors that happen asynchronously. Some browsers will log unhandled promise rejections, in which case you can safely disable promise debugging:\n  Ractive.DEBUG_PROMISES = false;' );
						warnIfDebug( 'An error happened during rendering', { ractive: ractive });
						logIfDebug( err );

						throw err;
					});
				}
			}
		}
	}

	var DOMEvent = function DOMEvent ( name, owner ) {
		if ( name.indexOf( '*' ) !== -1 ) {
			fatal( ("Only component proxy-events may contain \"*\" wildcards, <" + (owner.name) + " on-" + name + "=\"...\"/> is not valid") );
		}

		this.name = name;
		this.owner = owner;
		this.node = null;
		this.handler = null;
	};

	DOMEvent.prototype.listen = function listen ( directive ) {
		var node = this.node = this.owner.node;
		var name = this.name;

		if ( !( ("on" + name) in node ) ) {
			warnOnce( missingPlugin( name, 'events' ) );
			}

			node.addEventListener( name, this.handler = function( event ) {
			directive.fire({
					node: node,
				original: event
				});
			}, false );
	};

	DOMEvent.prototype.unlisten = function unlisten () {
		if ( this.handler ) this.node.removeEventListener( this.name, this.handler, false );
	};

	var CustomEvent = function CustomEvent ( eventPlugin, owner ) {
		this.eventPlugin = eventPlugin;
		this.owner = owner;
		this.handler = null;
	};

	CustomEvent.prototype.listen = function listen ( directive ) {
		var node = this.owner.node;

		this.handler = this.eventPlugin( node, function ( event ) {
			if ( event === void 0 ) event = {};

				event.node = event.node || node;
			directive.fire( event );
		});
	};

	CustomEvent.prototype.unlisten = function unlisten () {
		this.handler.teardown();
	};

	var RactiveEvent = function RactiveEvent ( ractive, name ) {
		this.ractive = ractive;
		this.name = name;
		this.handler = null;
	};

	RactiveEvent.prototype.listen = function listen ( directive ) {
		var ractive = this.ractive;

		this.handler = ractive.on( this.name, function () {
			var event;

			// semi-weak test, but what else? tag the event obj ._isEvent ?
			if ( arguments.length && arguments[0] && arguments[0].node ) {
				event = Array.prototype.shift.call( arguments );
				event.component = ractive;
			}

			var args = Array.prototype.slice.call( arguments );
			directive.fire( event, args );

			// cancel bubbling
			return false;
		});
	};

	RactiveEvent.prototype.unlisten = function unlisten () {
		this.handler.cancel();
	};

	var specialPattern = /^(event|arguments)(\..+)?$/;
	var dollarArgsPattern = /^\$(\d+)(\..+)?$/;

	var EventDirective = function EventDirective ( options ) {
		var this$1 = this;

			this.owner = options.owner || options.parentFragment.owner || findElement( options.parentFragment );
		this.element = this.owner.attributeByName ? this.owner : findElement( options.parentFragment );
		this.template = options.template;
		this.parentFragment = options.parentFragment;
		this.ractive = options.parentFragment.ractive;

		this.events = [];

		if ( this.element.type === COMPONENT ) {
			this.template.n.split( '-' ).forEach( function ( n ) {
				this$1.events.push( new RactiveEvent( this$1.element.instance, n ) );
			});
		} else {
			this.template.n.split( '-' ).forEach( function ( n ) {
				var fn = findInViewHierarchy( 'events', this$1.ractive, n );
				// we need to pass in "this" in order to get
				// access to node when it is created.
				this$1.events.push(fn ? new CustomEvent( fn, this$1.element ) : new DOMEvent( n, this$1.element ));
			});
		}

		this.context = null;

		// method calls
		this.resolvers = null;
		this.models = null;

		// handler directive
		this.action = null;
		this.args = null;
	};

	EventDirective.prototype.bind = function bind () {
		var this$1 = this;

			this.context = this.parentFragment.findContext();

		var template = this.template.f;

		if ( template.x ) {
			this.fn = getFunction( template.x.s, template.x.r.length );
			this.resolvers = [];
			this.models = template.x.r.map( function ( ref, i ) {
				var specialMatch = specialPattern.exec( ref );
				if ( specialMatch ) {
					// on-click="foo(event.node)"
					return {
						special: specialMatch[1],
						keys: specialMatch[2] ? splitKeypathI( specialMatch[2].substr(1) ) : []
					};
				}

				var dollarMatch = dollarArgsPattern.exec( ref );
				if ( dollarMatch ) {
					// on-click="foo($1)"
					return {
						special: 'arguments',
						keys: [ dollarMatch[1] - 1 ].concat( dollarMatch[2] ? splitKeypathI( dollarMatch[2].substr( 1 ) ) : [] )
					};
				}

				var resolver;

				var model = resolveReference( this$1.parentFragment, ref );
				if ( !model ) {
					resolver = this$1.parentFragment.resolve( ref, function ( model ) {
						this$1.models[i] = model;
						removeFromArray( this$1.resolvers, resolver );
						model.register( this$1 );
					});

					this$1.resolvers.push( resolver );
				} else model.register( this$1 );

				return model;
			});
		}

		else {
			// TODO deprecate this style of directive
			this.action = typeof template === 'string' ? // on-click='foo'
				template :
				typeof template.n === 'string' ? // on-click='{{dynamic}}'
					template.n :
					new Fragment({
						owner: this,
						template: template.n
					});

			this.args = template.a ? // static arguments
				( typeof template.a === 'string' ? [ template.a ] : template.a ) :
				template.d ? // dynamic arguments
					new Fragment({
						owner: this,
						template: template.d
					}) :
					[]; // no arguments
		}

		if ( this.action && typeof this.action !== 'string' ) this.action.bind();
		if ( this.args && template.d ) this.args.bind();
	};

	EventDirective.prototype.bubble = function bubble () {
		if ( !this.dirty ) {
			this.dirty = true;
			this.owner.bubble();
		}
	};

	EventDirective.prototype.destroyed = function destroyed () {
		this.events.forEach( function ( e ) { return e.unlisten(); } );
	};

	EventDirective.prototype.fire = function fire ( event, passedArgs ) {

		// augment event object
		if ( passedArgs === void 0 ) passedArgs = [];

			if ( event && !event.hasOwnProperty( '_element' ) ) {
			   addHelpers( event, this.owner );
		}

		if ( this.fn ) {
			var values = [];

			if ( event ) passedArgs.unshift( event );

			if ( this.models ) {
				this.models.forEach( function ( model ) {
					if ( !model ) return values.push( undefined );

					if ( model.special ) {
						var obj = model.special === 'event' ? event : passedArgs;
						var keys = model.keys.slice();

						while ( keys.length ) obj = obj[ keys.shift() ];
						return values.push( obj );
					}

					if ( model.wrapper ) {
						return values.push( model.wrapperValue );
					}

					values.push( model.get() );
				});
			}

			// make event available as `this.event`
			var ractive = this.ractive;
			var oldEvent = ractive.event;

			ractive.event = event;
			var result = this.fn.apply( ractive, values ).pop();

			// Auto prevent and stop if return is explicitly false
			if ( result === false ) {
				var original = event ? event.original : undefined;
				if ( original ) {
					original.preventDefault && original.preventDefault();
					original.stopPropagation && original.stopPropagation();
				} else {
					warnOnceIfDebug( ("handler '" + (this.template.n) + "' returned false, but there is no event available to cancel") );
				}
			}

			ractive.event = oldEvent;
		}

		else {
			var action = this.action.toString();
			var args = this.template.f.d ? this.args.getArgsList() : this.args;

			if ( passedArgs.length ) args = args.concat( passedArgs );

			if ( event ) event.name = action;

			fireEvent( this.ractive, action, {
				event: event,
				args: args
			});
		}
	};

	EventDirective.prototype.handleChange = function handleChange () {};

	EventDirective.prototype.rebinding = function rebinding ( next, previous ) {
		var this$1 = this;

			if ( !this.models ) return;
		var idx = this.models.indexOf( previous );

		if ( ~idx ) {
			this.models.splice( idx, 1, next );
			previous.unregister( this );
			if ( next ) next.addShuffleTask( function () { return next.register( this$1 ); } );
		}
	};

	EventDirective.prototype.render = function render () {
		// render events after everything else, so they fire after bindings
		var this$1 = this;

			runloop.scheduleTask( function () { return this$1.events.forEach( function ( e ) { return e.listen( this$1 ); }, true ); } );
	};

	EventDirective.prototype.toString = function toString() { return ''; };

	EventDirective.prototype.unbind = function unbind$1 () {
		var this$1 = this;

			var template = this.template.f;

		if ( template.x ) {
			if ( this.resolvers ) this.resolvers.forEach( unbind );
			this.resolvers = [];

			if ( this.models ) this.models.forEach( function ( m ) {
				if ( m && m.unregister ) m.unregister( this$1 );
			});
			this.models = null;
		}

		else {
			// TODO this is brittle and non-explicit, fix it
			if ( this.action && this.action.unbind ) this.action.unbind();
			if ( this.args && this.args.unbind ) this.args.unbind();
		}
	};

	EventDirective.prototype.unrender = function unrender () {
		this.events.forEach( function ( e ) { return e.unlisten(); } );
	};

	EventDirective.prototype.update = function update () {
		if ( this.method || !this.dirty ) return; // nothing to do

		this.dirty = false;

		// ugh legacy
		if ( this.action && this.action.update ) this.action.update();
		if ( this.args && this.args.update ) this.args.update();
	};

	// TODO it's unfortunate that this has to run every time a
	// component is rendered... is there a better way?
	function updateLiveQueries ( component ) {
		// Does this need to be added to any live queries?
		var instance = component.ractive;

		do {
			var liveQueries = instance._liveComponentQueries;

			var i = liveQueries.length;
			while ( i-- ) {
				var name = liveQueries[i];
				var query = liveQueries[ ("_" + name) ];

				if ( query.test( component ) ) {
					query.add( component.instance );
					// keep register of applicable selectors, for when we teardown
					component.liveQueries.push( query );
				}
			}
		} while ( instance = instance.parent );
	}

	function removeFromLiveComponentQueries ( component ) {
		var instance = component.ractive;

		while ( instance ) {
			var query = instance._liveComponentQueries[ ("_" + (component.name)) ];
			if ( query ) query.remove( component );

			instance = instance.parent;
		}
	}

	function makeDirty ( query ) {
		query.makeDirty();
	}

	var teardownHook = new Hook( 'teardown' );

	var Component = (function (Item) {
		function Component ( options, ComponentConstructor ) {
			var this$1 = this;

			Item.call( this, options );
			this.type = COMPONENT; // override ELEMENT from super

			var instance = create( ComponentConstructor.prototype );

			this.instance = instance;
			this.name = options.template.e;
			this.parentFragment = options.parentFragment;

			this.liveQueries = [];

			if ( instance.el ) {
				warnIfDebug( ("The <" + (this.name) + "> component has a default 'el' property; it has been disregarded") );
			}

			var partials = options.template.p || {};
			if ( !( 'content' in partials ) ) partials.content = options.template.f || [];
			this._partials = partials; // TEMP

			this.yielders = {};

			// find container
			var fragment = options.parentFragment;
			var container;
			while ( fragment ) {
				if ( fragment.owner.type === YIELDER ) {
					container = fragment.owner.container;
					break;
				}

				fragment = fragment.parent;
			}

			// add component-instance-specific properties
			instance.parent = this.parentFragment.ractive;
			instance.container = container || null;
			instance.root = instance.parent.root;
			instance.component = this;

			construct( this.instance, { partials: partials });

			// for hackability, this could be an open option
			// for any ractive instance, but for now, just
			// for components and just for ractive...
			instance._inlinePartials = partials;

			this.attributeByName = {};

			this.attributes = [];
			var leftovers = [];
			( this.template.m || [] ).forEach( function ( template ) {
				switch ( template.t ) {
					case ATTRIBUTE:
					case EVENT:
					case TRANSITION:
						this$1.attributes.push( createItem({
							owner: this$1,
							parentFragment: this$1.parentFragment,
							template: template
						}) );
						break;

					case BINDING_FLAG:
					case DECORATOR:
						break;

					default:
						leftovers.push( template );
						break;
				}
			});

			this.attributes.push( new ConditionalAttribute({
				owner: this,
				parentFragment: this.parentFragment,
				template: leftovers
			}) );

			this.eventHandlers = [];
			if ( this.template.v ) this.setupEvents();
		}

		Component.prototype = Object.create( Item && Item.prototype );
		Component.prototype.constructor = Component;

		Component.prototype.bind = function bind$1$$ () {
			this.attributes.forEach( bind$1 );

			initialise( this.instance, {
				partials: this._partials
			}, {
				cssIds: this.parentFragment.cssIds
			});

			this.eventHandlers.forEach( bind$1 );

			this.bound = true;
		};

		Component.prototype.bubble = function bubble () {
			if ( !this.dirty ) {
				this.dirty = true;
				this.parentFragment.bubble();
			}
		};

		Component.prototype.checkYielders = function checkYielders () {
			var this$1 = this;

			Object.keys( this.yielders ).forEach( function ( name ) {
				if ( this$1.yielders[ name ].length > 1 ) {
					runloop.end();
					throw new Error( ("A component template can only have one {{yield" + (name ? ' ' + name : '') + "}} declaration at a time") );
				}
			});
		};

		Component.prototype.destroyed = function destroyed () {
			if ( this.instance.fragment ) this.instance.fragment.destroyed();
		};

		Component.prototype.detach = function detach () {
			return this.instance.fragment.detach();
		};

		Component.prototype.find = function find ( selector ) {
			return this.instance.fragment.find( selector );
		};

		Component.prototype.findAll = function findAll ( selector, query ) {
			this.instance.fragment.findAll( selector, query );
		};

		Component.prototype.findComponent = function findComponent ( name ) {
			if ( !name || this.name === name ) return this.instance;

			if ( this.instance.fragment ) {
				return this.instance.fragment.findComponent( name );
			}
		};

		Component.prototype.findAllComponents = function findAllComponents ( name, query ) {
			if ( query.test( this ) ) {
				query.add( this.instance );

				if ( query.live ) {
					this.liveQueries.push( query );
				}
			}

			this.instance.fragment.findAllComponents( name, query );
		};

		Component.prototype.firstNode = function firstNode ( skipParent ) {
			return this.instance.fragment.firstNode( skipParent );
		};

		Component.prototype.render = function render$1$$ ( target, occupants ) {
			render$1( this.instance, target, null, occupants );

			this.checkYielders();
			this.attributes.forEach( render );
			this.eventHandlers.forEach( render );
			updateLiveQueries( this );

			this.rendered = true;
		};

		Component.prototype.setupEvents = function setupEvents () {
			var this$1 = this;

			var handlers = this.eventHandlers;

			Object.keys( this.template.v ).forEach( function ( key ) {
				var eventNames = key.split( '-' );
				var template = this$1.template.v[ key ];

				eventNames.forEach( function ( eventName ) {
					var event = new RactiveEvent( this$1.instance, eventName );
					handlers.push( new EventDirective( this$1, event, template ) );
				});
			});
		};

		Component.prototype.shuffled = function shuffled () {
			this.liveQueries.forEach( makeDirty );
			Item.prototype.shuffled.call(this);
		};

		Component.prototype.toString = function toString () {
			return this.instance.toHTML();
		};

		Component.prototype.unbind = function unbind$1 () {
			this.bound = false;

			this.attributes.forEach( unbind );

			var instance = this.instance;
			instance.viewmodel.teardown();
			instance.fragment.unbind();
			instance._observers.forEach( cancel );

			removeFromLiveComponentQueries( this );

			if ( instance.el && instance.el.__ractive_instances__ ) {
				removeFromArray( instance.el.__ractive_instances__, instance );
			}

			teardownHook.fire( instance );
		};

		Component.prototype.unrender = function unrender$1 ( shouldDestroy ) {
			var this$1 = this;

			this.rendered = false;

			this.shouldDestroy = shouldDestroy;
			this.instance.unrender();
			this.attributes.forEach( unrender );
			this.eventHandlers.forEach( unrender );
			this.liveQueries.forEach( function ( query ) { return query.remove( this$1.instance ); } );
		};

		Component.prototype.update = function update$1 () {
			this.dirty = false;
			this.instance.fragment.update();
			this.checkYielders();
			this.attributes.forEach( update );
			this.eventHandlers.forEach( update );
		};

		return Component;
	}(Item));

	var missingDecorator = {
		update: noop,
		teardown: noop
	};

	var Decorator = function Decorator ( options ) {
		this.owner = options.owner || options.parentFragment.owner || findElement( options.parentFragment );
		this.element = this.owner.attributeByName ? this.owner : findElement( options.parentFragment );
		this.parentFragment = this.owner.parentFragment;
		this.ractive = this.owner.ractive;
		var template = this.template = options.template;

		this.dynamicName = typeof template.f.n === 'object';
		this.dynamicArgs = !!template.f.d;

		if ( this.dynamicName ) {
			this.nameFragment = new Fragment({
				owner: this,
				template: template.f.n
			});
		} else {
			this.name = template.f.n || template.f;
		}

		if ( this.dynamicArgs ) {
			this.argsFragment = new Fragment({
				owner: this,
				template: template.f.d
			});
		} else {
			if ( template.f.a && template.f.a.s ) {
				this.args = [];
			} else {
				this.args = template.f.a || [];
			}
		}

		this.node = null;
		this.intermediary = null;

		this.element.decorators.push( this );
	};

	Decorator.prototype.bind = function bind () {
		var this$1 = this;

			if ( this.dynamicName ) {
			this.nameFragment.bind();
			this.name = this.nameFragment.toString();
		}

		if ( this.dynamicArgs ) this.argsFragment.bind();

		// TODO: dry this up once deprecation is done
		if ( this.template.f.a && this.template.f.a.s ) {
			this.resolvers = [];
			this.models = this.template.f.a.r.map( function ( ref, i ) {
				var resolver;
				var model = resolveReference( this$1.parentFragment, ref );
				if ( !model ) {
					resolver = this$1.parentFragment.resolve( ref, function ( model ) {
						this$1.models[i] = model;
						removeFromArray( this$1.resolvers, resolver );
						model.register( this$1 );
					});

					this$1.resolvers.push( resolver );
				} else model.register( this$1 );

				return model;
			});
			this.argsFn = getFunction( this.template.f.a.s, this.template.f.a.r.length );
		}
	};

	Decorator.prototype.bubble = function bubble () {
		if ( !this.dirty ) {
			this.dirty = true;
			this.owner.bubble();
		}
	};

	Decorator.prototype.destroyed = function destroyed () {
		if ( this.intermediary ) this.intermediary.teardown();
		this.shouldDestroy = true;
	};

	Decorator.prototype.handleChange = function handleChange () { this.bubble(); };

	Decorator.prototype.rebinding = function rebinding ( next, previous, safe ) {
		var idx = this.models.indexOf( previous );
		if ( !~idx ) return;

		next = rebindMatch( this.template.f.a.r[ idx ], next, previous );
		if ( next === previous ) return;

		previous.unregister( this );
		this.models.splice( idx, 1, next );
		if ( next ) next.addShuffleRegister( this, 'mark' );

		if ( !safe ) this.bubble();
	};

	Decorator.prototype.render = function render () {
		var this$1 = this;

			runloop.scheduleTask( function () {
			var fn = findInViewHierarchy( 'decorators', this$1.ractive, this$1.name );

			if ( !fn ) {
				warnOnce( missingPlugin( this$1.name, 'decorator' ) );
				this$1.intermediary = missingDecorator;
				return;
			}

			this$1.node = this$1.element.node;

			var args;
			if ( this$1.argsFn ) {
				args = this$1.models.map( function ( model ) {
					if ( !model ) return undefined;

					return model.get();
				});
				args = this$1.argsFn.apply( this$1.ractive, args );
			} else {
				args = this$1.dynamicArgs ? this$1.argsFragment.getArgsList() : this$1.args;
			}

			this$1.intermediary = fn.apply( this$1.ractive, [ this$1.node ].concat( args ) );

			if ( !this$1.intermediary || !this$1.intermediary.teardown ) {
				throw new Error( ("The '" + (this$1.name) + "' decorator must return an object with a teardown method") );
			}

			// watch out for decorators that cause their host element to be unrendered
			if ( this$1.shouldDestroy ) this$1.destroyed();
		}, true );
		this.rendered = true;
	};

	Decorator.prototype.toString = function toString () { return ''; };

	Decorator.prototype.unbind = function unbind$1 () {
		var this$1 = this;

			if ( this.dynamicName ) this.nameFragment.unbind();
		if ( this.dynamicArgs ) this.argsFragment.unbind();
		if ( this.resolvers ) this.resolvers.forEach( unbind );
		if ( this.models ) this.models.forEach( function ( m ) {
			if ( m ) m.unregister( this$1 );
		});
	};

	Decorator.prototype.unrender = function unrender ( shouldDestroy ) {
		if ( ( !shouldDestroy || this.element.rendered ) && this.intermediary ) this.intermediary.teardown();
		this.rendered = false;
	};

	Decorator.prototype.update = function update () {
		if ( !this.dirty ) return;

		this.dirty = false;

		var nameChanged = false;

		if ( this.dynamicName && this.nameFragment.dirty ) {
			var name = this.nameFragment.toString();
			nameChanged = name !== this.name;
			this.name = name;
		}

		if ( this.intermediary ) {
			if ( nameChanged || !this.intermediary.update ) {
				this.unrender();
				this.render();
			}
			else {
				if ( this.dynamicArgs ) {
					if ( this.argsFragment.dirty ) {
						var args = this.argsFragment.getArgsList();
						this.intermediary.update.apply( this.ractive, args );
					}
				}
				else if ( this.argsFn ) {
					var args$1 = this.models.map( function ( model ) {
						if ( !model ) return undefined;

						return model.get();
					});
					this.intermediary.update.apply( this.ractive, this.argsFn.apply( this.ractive, args$1 ) );
				}
				else {
					this.intermediary.update.apply( this.ractive, this.args );
				}
			}
		}

		// need to run these for unrender/render cases
		// so can't just be in conditional if above

		if ( this.dynamicName && this.nameFragment.dirty ) {
			this.nameFragment.update();
		}

		if ( this.dynamicArgs && this.argsFragment.dirty ) {
			this.argsFragment.update();
		}
	};

	var Doctype = (function (Item) {
		function Doctype () {
			Item.apply(this, arguments);
		}

		Doctype.prototype = Object.create( Item && Item.prototype );
		Doctype.prototype.constructor = Doctype;

		Doctype.prototype.bind = function bind () {
			// noop
		};

		Doctype.prototype.render = function render () {
			// noop
		};

		Doctype.prototype.teardown = function teardown () {
			// noop
		};

		Doctype.prototype.toString = function toString () {
			return '<!DOCTYPE' + this.template.a + '>';
		};

		Doctype.prototype.unbind = function unbind () {
			// noop
		};

		Doctype.prototype.unrender = function unrender () {
			// noop
		};

		Doctype.prototype.update = function update () {
			// noop
		};

		return Doctype;
	}(Item));

	function updateLiveQueries$1 ( element ) {
		// Does this need to be added to any live queries?
		var node = element.node;
		var instance = element.ractive;

		do {
			var liveQueries = instance._liveQueries;

			var i = liveQueries.length;
			while ( i-- ) {
				var selector = liveQueries[i];
				var query = liveQueries[ ("_" + selector) ];

				if ( query.test( node ) ) {
					query.add( node );
					// keep register of applicable selectors, for when we teardown
					element.liveQueries.push( query );
				}
			}
		} while ( instance = instance.parent );
	}

	function warnAboutAmbiguity ( description, ractive ) {
		warnOnceIfDebug( ("The " + description + " being used for two-way binding is ambiguous, and may cause unexpected results. Consider initialising your data to eliminate the ambiguity"), { ractive: ractive });
	}

	var Binding = function Binding ( element, name ) {
		if ( name === void 0 ) name = 'value';

			this.element = element;
		this.ractive = element.ractive;
		this.attribute = element.attributeByName[ name ];

		var interpolator = this.attribute.interpolator;
		interpolator.twowayBinding = this;

		var model = interpolator.model;

		// not bound?
		if ( !model ) {
			// try to force resolution
			interpolator.resolver.forceResolution();
			model = interpolator.model;

			warnAboutAmbiguity( ("'" + (interpolator.template.r) + "' reference"), this.ractive );
			}

			else if ( model.isUnresolved ) {
				// reference expressions (e.g. foo[bar])
				model.forceResolution();
				warnAboutAmbiguity( 'expression', this.ractive );
		}

		// TODO include index/key/keypath refs as read-only
		else if ( model.isReadonly ) {
			var keypath = model.getKeypath().replace( /^@/, '' );
			warnOnceIfDebug( ("Cannot use two-way binding on <" + (element.name) + "> element: " + keypath + " is read-only. To suppress this warning use <" + (element.name) + " twoway='false'...>"), { ractive: this.ractive });
			return false;
		}

		this.attribute.isTwoway = true;
		this.model = model;

		// initialise value, if it's undefined
		var value = model.get();
		this.wasUndefined = value === undefined;

		if ( value === undefined && this.getInitialValue ) {
			value = this.getInitialValue();
			model.set( value );
		}
		this.lastVal( true, value );

		var parentForm = findElement( this.element, false, 'form' );
		if ( parentForm ) {
			this.resetValue = value;
			parentForm.formBindings.push( this );
		}
	};

	Binding.prototype.bind = function bind () {
		this.model.registerTwowayBinding( this );
	};

	Binding.prototype.handleChange = function handleChange () {
		var this$1 = this;

			var value = this.getValue();
		if ( this.lastVal() === value ) return;

		runloop.start( this.root );
		this.attribute.locked = true;
		this.model.set( value );
		this.lastVal( true, value );

		// if the value changes before observers fire, unlock to be updatable cause something weird and potentially freezy is up
		if ( this.model.get() !== value ) this.attribute.locked = false;
		else runloop.scheduleTask( function () { return this$1.attribute.locked = false; } );

		runloop.end();
	};

	Binding.prototype.lastVal = function lastVal ( setting, value ) {
		if ( setting ) this.lastValue = value;
		else return this.lastValue;
	};

	Binding.prototype.rebinding = function rebinding ( next, previous ) {
		var this$1 = this;

			if ( this.model && this.model === previous ) previous.unregisterTwowayBinding( this );
		if ( next ) {
			this.model = next;
			runloop.scheduleTask( function () { return next.registerTwowayBinding( this$1 ); } );
		}
	};

	Binding.prototype.render = function render () {
		this.node = this.element.node;
		this.node._ractive.binding = this;
		this.rendered = true; // TODO is this used anywhere?
	};

		Binding.prototype.setFromNode = function setFromNode ( node ) {
			this.model.set( node.value );
	};

	Binding.prototype.unbind = function unbind () {
		this.model.unregisterTwowayBinding( this );
	};

	Binding.prototype.unrender = function unrender () {
			// noop?
		};

	// This is the handler for DOM events that would lead to a change in the model
	// (i.e. change, sometimes, input, and occasionally click and keyup)
	function handleDomEvent () {
		this._ractive.binding.handleChange();
	}

	var CheckboxBinding = (function (Binding) {
		function CheckboxBinding ( element ) {
			Binding.call( this, element, 'checked' );
		}

		CheckboxBinding.prototype = Object.create( Binding && Binding.prototype );
		CheckboxBinding.prototype.constructor = CheckboxBinding;

		CheckboxBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);

			this.node.addEventListener( 'change', handleDomEvent, false );

			if ( this.node.attachEvent ) {
				this.node.addEventListener( 'click', handleDomEvent, false );
			}
		};

		CheckboxBinding.prototype.unrender = function unrender () {
			this.node.removeEventListener( 'change', handleDomEvent, false );
			this.node.removeEventListener( 'click', handleDomEvent, false );
		};

		CheckboxBinding.prototype.getInitialValue = function getInitialValue () {
			return !!this.element.getAttribute( 'checked' );
		};

		CheckboxBinding.prototype.getValue = function getValue () {
			return this.node.checked;
		};

		CheckboxBinding.prototype.setFromNode = function setFromNode ( node ) {
			this.model.set( node.checked );
		};

		return CheckboxBinding;
	}(Binding));

	function getBindingGroup ( group, model, getValue ) {
		var hash = "" + group + "-bindingGroup";
		return model[hash] || ( model[ hash ] = new BindingGroup( hash, model, getValue ) );
	}

	var BindingGroup = function BindingGroup ( hash, model, getValue ) {
		var this$1 = this;

			this.model = model;
		this.hash = hash;
		this.getValue = function () {
			this$1.value = getValue.call(this$1);
			return this$1.value;
		};

		this.bindings = [];
	};

	BindingGroup.prototype.add = function add ( binding ) {
		this.bindings.push( binding );
	};

	BindingGroup.prototype.bind = function bind () {
		this.value = this.model.get();
		this.model.registerTwowayBinding( this );
		this.bound = true;
	};

		BindingGroup.prototype.remove = function remove ( binding ) {
		removeFromArray( this.bindings, binding );
		if ( !this.bindings.length ) {
			this.unbind();
		}
	};

	BindingGroup.prototype.unbind = function unbind () {
		this.model.unregisterTwowayBinding( this );
		this.bound = false;
		delete this.model[this.hash];
	};

	BindingGroup.prototype.rebinding = Binding.prototype.rebinding;

	var push$2 = [].push;

	function getValue() {
		var all = this.bindings.filter(function ( b ) { return b.node && b.node.checked; }).map(function ( b ) { return b.element.getAttribute( 'value' ); });
		var res = [];
		all.forEach(function ( v ) { if ( !arrayContains( res, v ) ) res.push( v ); });
		return res;
	}

	var CheckboxNameBinding = (function (Binding) {
		function CheckboxNameBinding ( element ) {
			Binding.call( this, element, 'name' );

			this.checkboxName = true; // so that ractive.updateModel() knows what to do with this

			// Each input has a reference to an array containing it and its
			// group, as two-way binding depends on being able to ascertain
			// the status of all inputs within the group
			this.group = getBindingGroup( 'checkboxes', this.model, getValue );
			this.group.add( this );

			if ( this.noInitialValue ) {
				this.group.noInitialValue = true;
			}

			// If no initial value was set, and this input is checked, we
			// update the model
			if ( this.group.noInitialValue && this.element.getAttribute( 'checked' ) ) {
				var existingValue = this.model.get();
				var bindingValue = this.element.getAttribute( 'value' );

				if ( !arrayContains( existingValue, bindingValue ) ) {
					push$2.call( existingValue, bindingValue ); // to avoid triggering runloop with array adaptor
				}
			}
		}

		CheckboxNameBinding.prototype = Object.create( Binding && Binding.prototype );
		CheckboxNameBinding.prototype.constructor = CheckboxNameBinding;

		CheckboxNameBinding.prototype.bind = function bind () {
			if ( !this.group.bound ) {
				this.group.bind();
			}
		};

		CheckboxNameBinding.prototype.changed = function changed () {
			var wasChecked = !!this.isChecked;
			this.isChecked = this.node.checked;
			return this.isChecked === wasChecked;
		};

		CheckboxNameBinding.prototype.getInitialValue = function getInitialValue () {
			// This only gets called once per group (of inputs that
			// share a name), because it only gets called if there
			// isn't an initial value. By the same token, we can make
			// a note of that fact that there was no initial value,
			// and populate it using any `checked` attributes that
			// exist (which users should avoid, but which we should
			// support anyway to avoid breaking expectations)
			this.noInitialValue = true; // TODO are noInitialValue and wasUndefined the same thing?
			return [];
		};

		CheckboxNameBinding.prototype.getValue = function getValue$1 () {
			return this.group.value;
		};

		CheckboxNameBinding.prototype.handleChange = function handleChange () {
			this.isChecked = this.element.node.checked;
			this.group.value = this.model.get();
			var value = this.element.getAttribute( 'value' );
			if ( this.isChecked && !arrayContains( this.group.value, value ) ) {
				this.group.value.push( value );
			} else if ( !this.isChecked && arrayContains( this.group.value, value ) ) {
				removeFromArray( this.group.value, value );
			}
			// make sure super knows there's a change
			this.lastValue = null;
			Binding.prototype.handleChange.call(this);
		};

		CheckboxNameBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);

			var node = this.node;

			var existingValue = this.model.get();
			var bindingValue = this.element.getAttribute( 'value' );

			if ( isArray( existingValue ) ) {
				this.isChecked = arrayContains( existingValue, bindingValue );
			} else {
				this.isChecked = existingValue == bindingValue;
			}

			node.name = '{{' + this.model.getKeypath() + '}}';
			node.checked = this.isChecked;

			node.addEventListener( 'change', handleDomEvent, false );

			// in case of IE emergency, bind to click event as well
			if ( node.attachEvent ) {
				node.addEventListener( 'click', handleDomEvent, false );
			}
		};

		CheckboxNameBinding.prototype.setFromNode = function setFromNode ( node ) {
			this.group.bindings.forEach( function ( binding ) { return binding.wasUndefined = true; } );

			if ( node.checked ) {
				var valueSoFar = this.group.getValue();
				valueSoFar.push( this.element.getAttribute( 'value' ) );

				this.group.model.set( valueSoFar );
			}
		};

		CheckboxNameBinding.prototype.unbind = function unbind () {
			this.group.remove( this );
		};

		CheckboxNameBinding.prototype.unrender = function unrender () {
			var node = this.element.node;

			node.removeEventListener( 'change', handleDomEvent, false );
			node.removeEventListener( 'click', handleDomEvent, false );
		};

		return CheckboxNameBinding;
	}(Binding));

	var ContentEditableBinding = (function (Binding) {
		function ContentEditableBinding () {
			Binding.apply(this, arguments);
		}

		ContentEditableBinding.prototype = Object.create( Binding && Binding.prototype );
		ContentEditableBinding.prototype.constructor = ContentEditableBinding;

		ContentEditableBinding.prototype.getInitialValue = function getInitialValue () {
			return this.element.fragment ? this.element.fragment.toString() : '';
		};

		ContentEditableBinding.prototype.getValue = function getValue () {
			return this.element.node.innerHTML;
		};

		ContentEditableBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);

			var node = this.node;

			node.addEventListener( 'change', handleDomEvent, false );
			node.addEventListener( 'blur', handleDomEvent, false );

			if ( !this.ractive.lazy ) {
				node.addEventListener( 'input', handleDomEvent, false );

				if ( node.attachEvent ) {
					node.addEventListener( 'keyup', handleDomEvent, false );
				}
			}
		};

		ContentEditableBinding.prototype.setFromNode = function setFromNode ( node ) {
			this.model.set( node.innerHTML );
		};

		ContentEditableBinding.prototype.unrender = function unrender () {
			var node = this.node;

			node.removeEventListener( 'blur', handleDomEvent, false );
			node.removeEventListener( 'change', handleDomEvent, false );
			node.removeEventListener( 'input', handleDomEvent, false );
			node.removeEventListener( 'keyup', handleDomEvent, false );
		};

		return ContentEditableBinding;
	}(Binding));

	function handleBlur () {
		handleDomEvent.call( this );

		var value = this._ractive.binding.model.get();
		this.value = value == undefined ? '' : value;
	}

	function handleDelay ( delay ) {
		var timeout;

		return function () {
			var this$1 = this;

			if ( timeout ) clearTimeout( timeout );

			timeout = setTimeout( function () {
				var binding = this$1._ractive.binding;
				if ( binding.rendered ) handleDomEvent.call( this$1 );
				timeout = null;
			}, delay );
		};
	}

	var GenericBinding = (function (Binding) {
		function GenericBinding () {
			Binding.apply(this, arguments);
		}

		GenericBinding.prototype = Object.create( Binding && Binding.prototype );
		GenericBinding.prototype.constructor = GenericBinding;

		GenericBinding.prototype.getInitialValue = function getInitialValue () {
			return '';
		};

		GenericBinding.prototype.getValue = function getValue () {
			return this.node.value;
		};

		GenericBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);

			// any lazy setting for this element overrides the root
			// if the value is a number, it's a timeout
			var lazy = this.ractive.lazy;
			var timeout = false;

			if ( 'lazy' in this.element ) {
				lazy = this.element.lazy;
			}

			if ( isNumeric( lazy ) ) {
				timeout = +lazy;
				lazy = false;
			}

			this.handler = timeout ? handleDelay( timeout ) : handleDomEvent;

			var node = this.node;

			node.addEventListener( 'change', handleDomEvent, false );

			if ( !lazy ) {
				node.addEventListener( 'input', this.handler, false );

				if ( node.attachEvent ) {
					node.addEventListener( 'keyup', this.handler, false );
				}
			}

			node.addEventListener( 'blur', handleBlur, false );
		};

		GenericBinding.prototype.unrender = function unrender () {
			var node = this.element.node;
			this.rendered = false;

			node.removeEventListener( 'change', handleDomEvent, false );
			node.removeEventListener( 'input', this.handler, false );
			node.removeEventListener( 'keyup', this.handler, false );
			node.removeEventListener( 'blur', handleBlur, false );
		};

		return GenericBinding;
	}(Binding));

	var FileBinding = (function (GenericBinding) {
		function FileBinding () {
			GenericBinding.apply(this, arguments);
		}

		FileBinding.prototype = Object.create( GenericBinding && GenericBinding.prototype );
		FileBinding.prototype.constructor = FileBinding;

		FileBinding.prototype.getInitialValue = function getInitialValue () {
			return undefined;
		};

		FileBinding.prototype.getValue = function getValue () {
			return this.node.files;
		};

		FileBinding.prototype.render = function render () {
			this.element.lazy = false;
			GenericBinding.prototype.render.call(this);
		};

		FileBinding.prototype.setFromNode = function setFromNode( node ) {
			this.model.set( node.files );
		};

		return FileBinding;
	}(GenericBinding));

	function getSelectedOptions ( select ) {
	    return select.selectedOptions
			? toArray( select.selectedOptions )
			: select.options
				? toArray( select.options ).filter( function ( option ) { return option.selected; } )
				: [];
	}

	var MultipleSelectBinding = (function (Binding) {
		function MultipleSelectBinding () {
			Binding.apply(this, arguments);
		}

		MultipleSelectBinding.prototype = Object.create( Binding && Binding.prototype );
		MultipleSelectBinding.prototype.constructor = MultipleSelectBinding;

		MultipleSelectBinding.prototype.forceUpdate = function forceUpdate () {
			var this$1 = this;

			var value = this.getValue();

			if ( value !== undefined ) {
				this.attribute.locked = true;
				runloop.scheduleTask( function () { return this$1.attribute.locked = false; } );
				this.model.set( value );
			}
		};

		MultipleSelectBinding.prototype.getInitialValue = function getInitialValue () {
			return this.element.options
				.filter( function ( option ) { return option.getAttribute( 'selected' ); } )
				.map( function ( option ) { return option.getAttribute( 'value' ); } );
		};

		MultipleSelectBinding.prototype.getValue = function getValue () {
			var options = this.element.node.options;
			var len = options.length;

			var selectedValues = [];

			for ( var i = 0; i < len; i += 1 ) {
				var option = options[i];

				if ( option.selected ) {
					var optionValue = option._ractive ? option._ractive.value : option.value;
					selectedValues.push( optionValue );
				}
			}

			return selectedValues;
		};

		MultipleSelectBinding.prototype.handleChange = function handleChange () {
			var attribute = this.attribute;
			var previousValue = attribute.getValue();

			var value = this.getValue();

			if ( previousValue === undefined || !arrayContentsMatch( value, previousValue ) ) {
				Binding.prototype.handleChange.call(this);
			}

			return this;
		};

		MultipleSelectBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);

			this.node.addEventListener( 'change', handleDomEvent, false );

			if ( this.model.get() === undefined ) {
				// get value from DOM, if possible
				this.handleChange();
			}
		};

		MultipleSelectBinding.prototype.setFromNode = function setFromNode ( node ) {
			var selectedOptions = getSelectedOptions( node );
			var i = selectedOptions.length;
			var result = new Array( i );

			while ( i-- ) {
				var option = selectedOptions[i];
				result[i] = option._ractive ? option._ractive.value : option.value;
			}

			this.model.set( result );
		};

		MultipleSelectBinding.prototype.setValue = function setValue () {
			throw new Error( 'TODO not implemented yet' );
		};

		MultipleSelectBinding.prototype.unrender = function unrender () {
			this.node.removeEventListener( 'change', handleDomEvent, false );
		};

		MultipleSelectBinding.prototype.updateModel = function updateModel () {
			if ( this.attribute.value === undefined || !this.attribute.value.length ) {
				this.keypath.set( this.initialValue );
			}
		};

		return MultipleSelectBinding;
	}(Binding));

	var NumericBinding = (function (GenericBinding) {
		function NumericBinding () {
			GenericBinding.apply(this, arguments);
		}

		NumericBinding.prototype = Object.create( GenericBinding && GenericBinding.prototype );
		NumericBinding.prototype.constructor = NumericBinding;

		NumericBinding.prototype.getInitialValue = function getInitialValue () {
			return undefined;
		};

		NumericBinding.prototype.getValue = function getValue () {
			var value = parseFloat( this.node.value );
			return isNaN( value ) ? undefined : value;
		};

		NumericBinding.prototype.setFromNode = function setFromNode( node ) {
			var value = parseFloat( node.value );
			if ( !isNaN( value ) ) this.model.set( value );
		};

		return NumericBinding;
	}(GenericBinding));

	var siblings = {};

	function getSiblings ( hash ) {
		return siblings[ hash ] || ( siblings[ hash ] = [] );
	}

	var RadioBinding = (function (Binding) {
		function RadioBinding ( element ) {
			Binding.call( this, element, 'checked' );

			this.siblings = getSiblings( this.ractive._guid + this.element.getAttribute( 'name' ) );
			this.siblings.push( this );
		}

		RadioBinding.prototype = Object.create( Binding && Binding.prototype );
		RadioBinding.prototype.constructor = RadioBinding;

		RadioBinding.prototype.getValue = function getValue () {
			return this.node.checked;
		};

		RadioBinding.prototype.handleChange = function handleChange () {
			runloop.start( this.root );

			this.siblings.forEach( function ( binding ) {
				binding.model.set( binding.getValue() );
			});

			runloop.end();
		};

		RadioBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);

			this.node.addEventListener( 'change', handleDomEvent, false );

			if ( this.node.attachEvent ) {
				this.node.addEventListener( 'click', handleDomEvent, false );
			}
		};

		RadioBinding.prototype.setFromNode = function setFromNode ( node ) {
			this.model.set( node.checked );
		};

		RadioBinding.prototype.unbind = function unbind () {
			removeFromArray( this.siblings, this );
		};

		RadioBinding.prototype.unrender = function unrender () {
			this.node.removeEventListener( 'change', handleDomEvent, false );
			this.node.removeEventListener( 'click', handleDomEvent, false );
		};

		return RadioBinding;
	}(Binding));

	function getValue$1() {
		var checked = this.bindings.filter( function ( b ) { return b.node.checked; } );
		if ( checked.length > 0 ) {
			return checked[0].element.getAttribute( 'value' );
		}
	}

	var RadioNameBinding = (function (Binding) {
		function RadioNameBinding ( element ) {
			Binding.call( this, element, 'name' );

			this.group = getBindingGroup( 'radioname', this.model, getValue$1 );
			this.group.add( this );

			if ( element.checked ) {
				this.group.value = this.getValue();
			}
		}

		RadioNameBinding.prototype = Object.create( Binding && Binding.prototype );
		RadioNameBinding.prototype.constructor = RadioNameBinding;

		RadioNameBinding.prototype.bind = function bind () {
			var this$1 = this;

			if ( !this.group.bound ) {
				this.group.bind();
			}

			// update name keypath when necessary
			this.nameAttributeBinding = {
				handleChange: function () { return this$1.node.name = "{{" + (this$1.model.getKeypath()) + "}}"; },
				rebinding: noop
			};

			this.model.getKeypathModel().register( this.nameAttributeBinding );
		};

		RadioNameBinding.prototype.getInitialValue = function getInitialValue () {
			if ( this.element.getAttribute( 'checked' ) ) {
				return this.element.getAttribute( 'value' );
			}
		};

		RadioNameBinding.prototype.getValue = function getValue$1 () {
			return this.element.getAttribute( 'value' );
		};

		RadioNameBinding.prototype.handleChange = function handleChange () {
			// If this <input> is the one that's checked, then the value of its
			// `name` model gets set to its value
			if ( this.node.checked ) {
				this.group.value = this.getValue();
				Binding.prototype.handleChange.call(this);
			}
		};

		RadioNameBinding.prototype.lastVal = function lastVal ( setting, value ) {
			if ( !this.group ) return;
			if ( setting ) this.group.lastValue = value;
			else return this.group.lastValue;
		};

		RadioNameBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);

			var node = this.node;

			node.name = "{{" + (this.model.getKeypath()) + "}}";
			node.checked = this.model.get() == this.element.getAttribute( 'value' );

			node.addEventListener( 'change', handleDomEvent, false );

			if ( node.attachEvent ) {
				node.addEventListener( 'click', handleDomEvent, false );
			}
		};

		RadioNameBinding.prototype.setFromNode = function setFromNode ( node ) {
			if ( node.checked ) {
				this.group.model.set( this.element.getAttribute( 'value' ) );
			}
		};

		RadioNameBinding.prototype.unbind = function unbind () {
			this.group.remove( this );

			this.model.getKeypathModel().unregister( this.nameAttributeBinding );
		};

		RadioNameBinding.prototype.unrender = function unrender () {
			var node = this.node;

			node.removeEventListener( 'change', handleDomEvent, false );
			node.removeEventListener( 'click', handleDomEvent, false );
		};

		return RadioNameBinding;
	}(Binding));

	var SingleSelectBinding = (function (Binding) {
		function SingleSelectBinding () {
			Binding.apply(this, arguments);
		}

		SingleSelectBinding.prototype = Object.create( Binding && Binding.prototype );
		SingleSelectBinding.prototype.constructor = SingleSelectBinding;

		SingleSelectBinding.prototype.forceUpdate = function forceUpdate () {
			var this$1 = this;

			var value = this.getValue();

			if ( value !== undefined ) {
				this.attribute.locked = true;
				runloop.scheduleTask( function () { return this$1.attribute.locked = false; } );
				this.model.set( value );
			}
		};

		SingleSelectBinding.prototype.getInitialValue = function getInitialValue () {
			if ( this.element.getAttribute( 'value' ) !== undefined ) {
				return;
			}

			var options = this.element.options;
			var len = options.length;

			if ( !len ) return;

			var value;
			var optionWasSelected;
			var i = len;

			// take the final selected option...
			while ( i-- ) {
				var option = options[i];

				if ( option.getAttribute( 'selected' ) ) {
					if ( !option.getAttribute( 'disabled' ) ) {
						value = option.getAttribute( 'value' );
					}

					optionWasSelected = true;
					break;
				}
			}

			// or the first non-disabled option, if none are selected
			if ( !optionWasSelected ) {
				while ( ++i < len ) {
					if ( !options[i].getAttribute( 'disabled' ) ) {
						value = options[i].getAttribute( 'value' );
						break;
					}
				}
			}

			// This is an optimisation (aka hack) that allows us to forgo some
			// other more expensive work
			// TODO does it still work? seems at odds with new architecture
			if ( value !== undefined ) {
				this.element.attributeByName.value.value = value;
			}

			return value;
		};

		SingleSelectBinding.prototype.getValue = function getValue () {
			var options = this.node.options;
			var len = options.length;

			var i;
			for ( i = 0; i < len; i += 1 ) {
				var option = options[i];

				if ( options[i].selected && !options[i].disabled ) {
					return option._ractive ? option._ractive.value : option.value;
				}
			}
		};

		SingleSelectBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);
			this.node.addEventListener( 'change', handleDomEvent, false );
		};

		SingleSelectBinding.prototype.setFromNode = function setFromNode ( node ) {
			var option = getSelectedOptions( node )[0];
			this.model.set( option._ractive ? option._ractive.value : option.value );
		};

		// TODO this method is an anomaly... is it necessary?
		SingleSelectBinding.prototype.setValue = function setValue ( value ) {
			this.model.set( value );
		};

		SingleSelectBinding.prototype.unrender = function unrender () {
			this.node.removeEventListener( 'change', handleDomEvent, false );
		};

		return SingleSelectBinding;
	}(Binding));

	function isBindable ( attribute ) {
		return attribute &&
			   attribute.template.f &&
		       attribute.template.f.length === 1 &&
		       attribute.template.f[0].t === INTERPOLATOR &&
		       !attribute.template.f[0].s;
	}

	function selectBinding ( element ) {
		var attributes = element.attributeByName;

		// contenteditable - bind if the contenteditable attribute is true
		// or is bindable and may thus become true...
		if ( element.getAttribute( 'contenteditable' ) || isBindable( attributes.contenteditable ) ) {
			// ...and this element also has a value attribute to bind
			return isBindable( attributes.value ) ? ContentEditableBinding : null;
		}

		// <input>
		if ( element.name === 'input' ) {
			var type = element.getAttribute( 'type' );

			if ( type === 'radio' || type === 'checkbox' ) {
				var bindName = isBindable( attributes.name );
				var bindChecked = isBindable( attributes.checked );

				// for radios we can either bind the name attribute, or the checked attribute - not both
				if ( bindName && bindChecked ) {
					if ( type === 'radio' ) {
						warnIfDebug( 'A radio input can have two-way binding on its name attribute, or its checked attribute - not both', { ractive: element.root });
					} else {
						// A checkbox with bindings for both name and checked - see https://github.com/ractivejs/ractive/issues/1749
						return CheckboxBinding;
					}
				}

				if ( bindName ) {
					return type === 'radio' ? RadioNameBinding : CheckboxNameBinding;
				}

				if ( bindChecked ) {
					return type === 'radio' ? RadioBinding : CheckboxBinding;
				}
			}

			if ( type === 'file' && isBindable( attributes.value ) ) {
				return FileBinding;
			}

			if ( isBindable( attributes.value ) ) {
				return ( type === 'number' || type === 'range' ) ? NumericBinding : GenericBinding;
			}

			return null;
		}

		// <select>
		if ( element.name === 'select' && isBindable( attributes.value ) ) {
			return element.getAttribute( 'multiple' ) ? MultipleSelectBinding : SingleSelectBinding;
		}

		// <textarea>
		if ( element.name === 'textarea' && isBindable( attributes.value ) ) {
			return GenericBinding;
		}
	}

	function makeDirty$1 ( query ) {
		query.makeDirty();
	}

	var endsWithSemi = /;\s*$/;

	var Element = (function (Item) {
		function Element ( options ) {
			var this$1 = this;

			Item.call( this, options );

			this.liveQueries = []; // TODO rare case. can we handle differently?

			this.name = options.template.e.toLowerCase();
			this.isVoid = voidElementNames.test( this.name );

			// find parent element
			this.parent = findElement( this.parentFragment, false );

			if ( this.parent && this.parent.name === 'option' ) {
				throw new Error( ("An <option> element cannot contain other elements (encountered <" + (this.name) + ">)") );
			}

			this.decorators = [];

			// create attributes
			this.attributeByName = {};

			this.attributes = [];
			var leftovers = [];
			( this.template.m || [] ).forEach( function ( template ) {
				switch ( template.t ) {
					case ATTRIBUTE:
					case BINDING_FLAG:
					case DECORATOR:
					case EVENT:
					case TRANSITION:
						this$1.attributes.push( createItem({
							owner: this$1,
							parentFragment: this$1.parentFragment,
							template: template
						}) );
						break;

					default:
						leftovers.push( template );
						break;
				}
			});

			if ( leftovers.length ) {
				this.attributes.push( new ConditionalAttribute({
					owner: this,
					parentFragment: this.parentFragment,
					template: leftovers
				}) );
			}

			var i = this.attributes.length;
			while ( i-- ) {
				var attr = this$1.attributes[ i ];
				if ( attr.name === 'type' ) this$1.attributes.unshift( this$1.attributes.splice( i, 1 )[ 0 ] );
				else if ( attr.name === 'max' ) this$1.attributes.unshift( this$1.attributes.splice( i, 1 )[ 0 ] );
				else if ( attr.name === 'min' ) this$1.attributes.unshift( this$1.attributes.splice( i, 1 )[ 0 ] );
				else if ( attr.name === 'class' ) this$1.attributes.unshift( this$1.attributes.splice( i, 1 )[ 0 ] );
				else if ( attr.name === 'value' ) {
					this$1.attributes.push( this$1.attributes.splice( i, 1 )[ 0 ] );
				}
			}

			// create children
			if ( options.template.f && !options.deferContent ) {
				this.fragment = new Fragment({
					template: options.template.f,
					owner: this,
					cssIds: null
				});
			}

			this.binding = null; // filled in later
		}

		Element.prototype = Object.create( Item && Item.prototype );
		Element.prototype.constructor = Element;

		Element.prototype.bind = function bind$1$$ () {
			this.attributes.binding = true;
			this.attributes.forEach( bind$1 );
			this.attributes.binding = false;

			if ( this.fragment ) this.fragment.bind();

			// create two-way binding if necessary
			if ( !this.binding ) this.recreateTwowayBinding();
		};

		Element.prototype.createTwowayBinding = function createTwowayBinding () {
			var shouldBind = 'twoway' in this ? this.twoway : this.ractive.twoway;

			if ( !shouldBind ) return null;

			var Binding = selectBinding( this );

			if ( !Binding ) return null;

			var binding = new Binding( this );

			return binding && binding.model ?
				binding :
				null;
		};

		Element.prototype.destroyed = function destroyed () {
			this.attributes.forEach( function ( a ) { return a.destroyed(); } );
			if ( this.fragment ) this.fragment.destroyed();
		};

		Element.prototype.detach = function detach () {
			// if this element is no longer rendered, the transitions are complete and the attributes can be torn down
			if ( !this.rendered ) this.destroyed();

			return detachNode( this.node );
		};

		Element.prototype.find = function find ( selector ) {
			if ( this.node && matches( this.node, selector ) ) return this.node;
			if ( this.fragment ) {
				return this.fragment.find( selector );
			}
		};

		Element.prototype.findAll = function findAll ( selector, query ) {
			// Add this node to the query, if applicable, and register the
			// query on this element
			var matches = query.test( this.node );
			if ( matches ) {
				query.add( this.node );
				if ( query.live ) this.liveQueries.push( query );
			}

			if ( this.fragment ) {
				this.fragment.findAll( selector, query );
			}
		};

		Element.prototype.findComponent = function findComponent ( name ) {
			if ( this.fragment ) {
				return this.fragment.findComponent( name );
			}
		};

		Element.prototype.findAllComponents = function findAllComponents ( name, query ) {
			if ( this.fragment ) {
				this.fragment.findAllComponents( name, query );
			}
		};

		Element.prototype.findNextNode = function findNextNode () {
			return null;
		};

		Element.prototype.firstNode = function firstNode () {
			return this.node;
		};

		Element.prototype.getAttribute = function getAttribute ( name ) {
			var attribute = this.attributeByName[ name ];
			return attribute ? attribute.getValue() : undefined;
		};

		Element.prototype.recreateTwowayBinding = function recreateTwowayBinding () {
			if ( this.binding ) {
				this.binding.unbind();
				this.binding.unrender();
			}

			if ( this.binding = this.createTwowayBinding() ) {
				this.binding.bind();
				if ( this.rendered ) this.binding.render();
			}
		};

		Element.prototype.render = function render$1 ( target, occupants ) {
			// TODO determine correct namespace
			var this$1 = this;

			this.namespace = getNamespace( this );

			var node;
			var existing = false;

			if ( occupants ) {
				var n;
				while ( ( n = occupants.shift() ) ) {
					if ( n.nodeName.toUpperCase() === this$1.template.e.toUpperCase() && n.namespaceURI === this$1.namespace ) {
						this$1.node = node = n;
						existing = true;
						break;
					} else {
						detachNode( n );
					}
				}
			}

			if ( !node ) {
				node = createElement( this.template.e, this.namespace, this.getAttribute( 'is' ) );
				this.node = node;
			}

			defineProperty( node, '_ractive', {
				value: {
					proxy: this
				}
			});

			// Is this a top-level node of a component? If so, we may need to add
			// a data-ractive-css attribute, for CSS encapsulation
			if ( this.parentFragment.cssIds ) {
				node.setAttribute( 'data-ractive-css', this.parentFragment.cssIds.map( function ( x ) { return ("{" + x + "}"); } ).join( ' ' ) );
			}

			if ( existing && this.foundNode ) this.foundNode( node );

			if ( this.fragment ) {
				var children = existing ? toArray( node.childNodes ) : undefined;

				this.fragment.render( node, children );

				// clean up leftover children
				if ( children ) {
					children.forEach( detachNode );
				}
			}

			if ( existing ) {
				// store initial values for two-way binding
				if ( this.binding && this.binding.wasUndefined ) this.binding.setFromNode( node );
				// remove unused attributes
				var i = node.attributes.length;
				while ( i-- ) {
					var name = node.attributes[i].name;
					if ( !( name in this$1.attributeByName ) ) node.removeAttribute( name );
				}
			}

			this.attributes.forEach( render );

			if ( this.binding ) this.binding.render();

			updateLiveQueries$1( this );

			if ( this._introTransition && this.ractive.transitionsEnabled ) {
				this._introTransition.isIntro = true;
				runloop.registerTransition( this._introTransition );
			}

			if ( !existing ) {
				target.appendChild( node );
			}

			this.rendered = true;
		};

		Element.prototype.shuffled = function shuffled () {
			this.liveQueries.forEach( makeDirty$1 );
			Item.prototype.shuffled.call(this);
		};

		Element.prototype.toString = function toString () {
			var tagName = this.template.e;

			var attrs = this.attributes.map( stringifyAttribute ).join( '' );

			// Special case - selected options
			if ( this.name === 'option' && this.isSelected() ) {
				attrs += ' selected';
			}

			// Special case - two-way radio name bindings
			if ( this.name === 'input' && inputIsCheckedRadio( this ) ) {
				attrs += ' checked';
			}

			// Special case style and class attributes and directives
			var style, cls;
			this.attributes.forEach( function ( attr ) {
				if ( attr.name === 'class' ) {
					cls = ( cls || '' ) + ( cls ? ' ' : '' ) + safeAttributeString( attr.getString() );
				} else if ( attr.name === 'style' ) {
					style = ( style || '' ) + ( style ? ' ' : '' ) + safeAttributeString( attr.getString() );
					if ( style && !endsWithSemi.test( style ) ) style += ';';
				} else if ( attr.style ) {
					style = ( style || '' ) + ( style ? ' ' : '' ) +  "" + (attr.style) + ": " + (safeAttributeString( attr.getString() )) + ";";
				} else if ( attr.inlineClass && attr.getValue() ) {
					cls = ( cls || '' ) + ( cls ? ' ' : '' ) + attr.inlineClass;
				}
			});
			// put classes first, then inline style
			if ( style !== undefined ) attrs = ' style' + ( style ? ("=\"" + style + "\"") : '' ) + attrs;
			if ( cls !== undefined ) attrs = ' class' + (cls ? ("=\"" + cls + "\"") : '') + attrs;

			var str = "<" + tagName + "" + attrs + ">";

			if ( this.isVoid ) return str;

			// Special case - textarea
			if ( this.name === 'textarea' && this.getAttribute( 'value' ) !== undefined ) {
				str += escapeHtml( this.getAttribute( 'value' ) );
			}

			// Special case - contenteditable
			else if ( this.getAttribute( 'contenteditable' ) !== undefined ) {
				str += ( this.getAttribute( 'value' ) || '' );
			}

			if ( this.fragment ) {
				str += this.fragment.toString( !/^(?:script|style)$/i.test( this.template.e ) ); // escape text unless script/style
			}

			str += "</" + tagName + ">";
			return str;
		};

		Element.prototype.unbind = function unbind$1 () {
			this.attributes.unbinding = true;
			this.attributes.forEach( unbind );
			this.attributes.unbinding = false;

			if ( this.binding ) this.binding.unbind();
			if ( this.fragment ) this.fragment.unbind();
		};

		Element.prototype.unrender = function unrender ( shouldDestroy ) {
			if ( !this.rendered ) return;
			this.rendered = false;

			// unrendering before intro completed? complete it now
			// TODO should be an API for aborting transitions
			var transition = this._introTransition;
			if ( transition && transition.complete ) transition.complete();

			// Detach as soon as we can
			if ( this.name === 'option' ) {
				// <option> elements detach immediately, so that
				// their parent <select> element syncs correctly, and
				// since option elements can't have transitions anyway
				this.detach();
			} else if ( shouldDestroy ) {
				runloop.detachWhenReady( this );
			}

			if ( this.fragment ) this.fragment.unrender();

			if ( this.binding ) this.binding.unrender();

			// outro transition
			if ( this._outroTransition && this.ractive.transitionsEnabled ) {
				this._outroTransition.isIntro = false;
				runloop.registerTransition( this._outroTransition );
			}

			removeFromLiveQueries( this );
			// TODO forms are a special case
		};

		Element.prototype.update = function update$1 () {
			if ( this.dirty ) {
				this.dirty = false;

				this.attributes.forEach( update );

				if ( this.fragment ) this.fragment.update();
			}
		};

		return Element;
	}(Item));

	function inputIsCheckedRadio ( element ) {
		var attributes = element.attributeByName;

		var typeAttribute  = attributes.type;
		var valueAttribute = attributes.value;
		var nameAttribute  = attributes.name;

		if ( !typeAttribute || ( typeAttribute.value !== 'radio' ) || !valueAttribute || !nameAttribute.interpolator ) {
			return;
		}

		if ( valueAttribute.getValue() === nameAttribute.interpolator.model.get() ) {
			return true;
		}
	}

	function stringifyAttribute ( attribute ) {
		var str = attribute.toString();
		return str ? ' ' + str : '';
	}

	function removeFromLiveQueries ( element ) {
		var i = element.liveQueries.length;
		while ( i-- ) {
			var query = element.liveQueries[i];
			query.remove( element.node );
		}
	}

	function getNamespace ( element ) {
		// Use specified namespace...
		var xmlns = element.getAttribute( 'xmlns' );
		if ( xmlns ) return xmlns;

		// ...or SVG namespace, if this is an <svg> element
		if ( element.name === 'svg' ) return svg$1;

		var parent = element.parent;

		if ( parent ) {
			// ...or HTML, if the parent is a <foreignObject>
			if ( parent.name === 'foreignobject' ) return html;

			// ...or inherit from the parent node
			return parent.node.namespaceURI;
		}

		return element.ractive.el.namespaceURI;
	}

	var Form = (function (Element) {
		function Form ( options ) {
			Element.call( this, options );
			this.formBindings = [];
		}

		Form.prototype = Object.create( Element && Element.prototype );
		Form.prototype.constructor = Form;

		Form.prototype.render = function render ( target, occupants ) {
			Element.prototype.render.call( this, target, occupants );
			this.node.addEventListener( 'reset', handleReset, false );
		};

		Form.prototype.unrender = function unrender ( shouldDestroy ) {
			this.node.removeEventListener( 'reset', handleReset, false );
			Element.prototype.unrender.call( this, shouldDestroy );
		};

		return Form;
	}(Element));

	function handleReset () {
		var element = this._ractive.proxy;

		runloop.start();
		element.formBindings.forEach( updateModel$1 );
		runloop.end();
	}

	function updateModel$1 ( binding ) {
		binding.model.set( binding.resetValue );
	}

	var Mustache = (function (Item) {
		function Mustache ( options ) {
			Item.call( this, options );

			this.parentFragment = options.parentFragment;
			this.template = options.template;
			this.index = options.index;
			if ( options.owner ) this.parent = options.owner;

			this.isStatic = !!options.template.s;

			this.model = null;
			this.dirty = false;
		}

		Mustache.prototype = Object.create( Item && Item.prototype );
		Mustache.prototype.constructor = Mustache;

		Mustache.prototype.bind = function bind () {
			// try to find a model for this view
			var this$1 = this;

			var model = resolve$2( this.parentFragment, this.template );
			var value = model ? model.get() : undefined;

			if ( this.isStatic ) {
				this.model = { get: function () { return value; } };
				return;
			}

			if ( model ) {
				model.register( this );
				this.model = model;
			} else if ( this.template.r ) {
				this.resolver = this.parentFragment.resolve( this.template.r, function ( model ) {
					this$1.model = model;
					model.register( this$1 );

					this$1.handleChange();
					this$1.resolver = null;
				});
			}
		};

		Mustache.prototype.handleChange = function handleChange () {
			this.bubble();
		};

		Mustache.prototype.rebinding = function rebinding ( next, previous, safe ) {
			next = rebindMatch( this.template, next, previous );
			if ( this['static'] ) return false;
			if ( next === this.model ) return false;

			if ( this.model ) {
				this.model.unregister( this );
			}
			if ( next ) next.addShuffleRegister( this, 'mark' );
			this.model = next;
			if ( !safe ) this.handleChange();
			return true;
		};

		Mustache.prototype.unbind = function unbind () {
			if ( !this.isStatic ) {
				this.model && this.model.unregister( this );
				this.model = undefined;
				this.resolver && this.resolver.unbind();
			}
		};

		return Mustache;
	}(Item));

	var Interpolator = (function (Mustache) {
		function Interpolator () {
			Mustache.apply(this, arguments);
		}

		Interpolator.prototype = Object.create( Mustache && Mustache.prototype );
		Interpolator.prototype.constructor = Interpolator;

		Interpolator.prototype.bubble = function bubble () {
			if ( this.owner ) this.owner.bubble();
			Mustache.prototype.bubble.call(this);
		};

		Interpolator.prototype.detach = function detach () {
			return detachNode( this.node );
		};

		Interpolator.prototype.firstNode = function firstNode () {
			return this.node;
		};

		Interpolator.prototype.getString = function getString () {
			return this.model ? safeToStringValue( this.model.get() ) : '';
		};

		Interpolator.prototype.render = function render ( target, occupants ) {
			if ( inAttributes() ) return;
			var value = this.getString();

			this.rendered = true;

			if ( occupants ) {
				var n = occupants[0];
				if ( n && n.nodeType === 3 ) {
					occupants.shift();
					if ( n.nodeValue !== value ) {
						n.nodeValue = value;
					}
				} else {
					n = this.node = doc.createTextNode( value );
					if ( occupants[0] ) {
						target.insertBefore( n, occupants[0] );
					} else {
						target.appendChild( n );
					}
				}

				this.node = n;
			} else {
				this.node = doc.createTextNode( value );
				target.appendChild( this.node );
			}
		};

		Interpolator.prototype.toString = function toString ( escape ) {
			var string = this.getString();
			return escape ? escapeHtml( string ) : string;
		};

		Interpolator.prototype.unrender = function unrender ( shouldDestroy ) {
			if ( shouldDestroy ) this.detach();
			this.rendered = false;
		};

		Interpolator.prototype.update = function update () {
			if ( this.dirty ) {
				this.dirty = false;
				if ( this.rendered ) {
					this.node.data = this.getString();
				}
			}
		};

		Interpolator.prototype.valueOf = function valueOf () {
			return this.model ? this.model.get() : undefined;
		};

		return Interpolator;
	}(Mustache));

	var Input = (function (Element) {
		function Input () {
			Element.apply(this, arguments);
		}

		Input.prototype = Object.create( Element && Element.prototype );
		Input.prototype.constructor = Input;

		Input.prototype.render = function render ( target, occupants ) {
			Element.prototype.render.call( this, target, occupants );
			this.node.defaultValue = this.node.value;
		};

		return Input;
	}(Element));

	var Mapping = (function (Item) {
		function Mapping ( options ) {
			Item.call( this, options );

			this.name = options.template.n;

			this.owner = options.owner || options.parentFragment.owner || options.element || findElement( options.parentFragment );
			this.element = options.element || (this.owner.attributeByName ? this.owner : findElement( options.parentFragment ) );
			this.parentFragment = this.element.parentFragment; // shared
			this.ractive = this.parentFragment.ractive;

			this.fragment = null;

			this.element.attributeByName[ this.name ] = this;

			this.value = options.template.f;
		}

		Mapping.prototype = Object.create( Item && Item.prototype );
		Mapping.prototype.constructor = Mapping;

		Mapping.prototype.bind = function bind () {
			if ( this.fragment ) {
				this.fragment.bind();
			}

			var template = this.template.f;
			var viewmodel = this.element.instance.viewmodel;

			if ( template === 0 ) {
				// empty attributes are `true`
				viewmodel.joinKey( this.name ).set( true );
			}

			else if ( typeof template === 'string' ) {
				var parsed = parseJSON( template );
				viewmodel.joinKey( this.name ).set( parsed ? parsed.value : template );
			}

			else if ( isArray( template ) ) {
				createMapping( this, true );
			}
		};

		Mapping.prototype.render = function render () {};

		Mapping.prototype.unbind = function unbind () {
			if ( this.fragment ) this.fragment.unbind();
			if ( this.model ) this.model.unregister( this );
			if ( this.boundFragment ) this.boundFragment.unbind();

			if ( this.element.bound ) {
				if ( this.link.target === this.model ) this.link.owner.unlink();
			}
		};

		Mapping.prototype.unrender = function unrender () {};

		Mapping.prototype.update = function update () {
			if ( this.dirty ) {
				this.dirty = false;
				if ( this.fragment ) this.fragment.update();
				if ( this.boundFragment ) this.boundFragment.update();
				if ( this.rendered ) this.updateDelegate();
			}
		};

		return Mapping;
	}(Item));

	function createMapping ( item ) {
		var template = item.template.f;
		var viewmodel = item.element.instance.viewmodel;
		var childData = viewmodel.value;

		if ( template.length === 1 && template[0].t === INTERPOLATOR ) {
			item.model = resolve$2( item.parentFragment, template[0] );

			if ( !item.model ) {
				warnOnceIfDebug( ("The " + (item.name) + "='{{" + (template[0].r) + "}}' mapping is ambiguous, and may cause unexpected results. Consider initialising your data to eliminate the ambiguity"), { ractive: item.element.instance }); // TODO add docs page explaining item
				item.parentFragment.ractive.get( item.name ); // side-effect: create mappings as necessary
				item.model = item.parentFragment.findContext().joinKey( item.name );
			}

			item.link = viewmodel.createLink( item.name, item.model, template[0].r );

			if ( item.model.get() === undefined && !item.model.isReadonly && item.name in childData ) {
				item.model.set( childData[ item.name ] );
			}
		}

		else {
			item.boundFragment = new Fragment({
				owner: item,
				template: template
			}).bind();

			item.model = viewmodel.joinKey( item.name );
			item.model.set( item.boundFragment.valueOf() );

			// item is a *bit* of a hack
			item.boundFragment.bubble = function () {
				Fragment.prototype.bubble.call( item.boundFragment );
				// defer this to avoid mucking around model deps if there happens to be an expression involved
				runloop.scheduleTask(function () {
					item.boundFragment.update();
					item.model.set( item.boundFragment.valueOf() );
				});
			};
		}
	}

	var Option = (function (Element) {
		function Option ( options ) {
			var template = options.template;
			if ( !template.a ) template.a = {};

			// If the value attribute is missing, use the element's content,
			// as long as it isn't disabled
			if ( template.a.value === undefined && !( 'disabled' in template.a ) ) {
				template.a.value = template.f || '';
			}

			Element.call( this, options );

			this.select = findElement( this.parent || this.parentFragment, false, 'select' );
		}

		Option.prototype = Object.create( Element && Element.prototype );
		Option.prototype.constructor = Option;

		Option.prototype.bind = function bind () {
			if ( !this.select ) {
				Element.prototype.bind.call(this);
				return;
			}

			// If the select has a value, it overrides the `selected` attribute on
			// this option - so we delete the attribute
			var selectedAttribute = this.attributeByName.selected;
			if ( selectedAttribute && this.select.getAttribute( 'value' ) !== undefined ) {
				var index = this.attributes.indexOf( selectedAttribute );
				this.attributes.splice( index, 1 );
				delete this.attributeByName.selected;
			}

			Element.prototype.bind.call(this);
			this.select.options.push( this );
		};

		Option.prototype.bubble = function bubble () {
			// if we're using content as value, may need to update here
			var value = this.getAttribute( 'value' );
			if ( this.node && this.node.value !== value ) {
				this.node._ractive.value = value;
			}
			Element.prototype.bubble.call(this);
		};

		Option.prototype.getAttribute = function getAttribute ( name ) {
			var attribute = this.attributeByName[ name ];
			return attribute ? attribute.getValue() : name === 'value' && this.fragment ? this.fragment.valueOf() : undefined;
		};

		Option.prototype.isSelected = function isSelected () {
			var optionValue = this.getAttribute( 'value' );

			if ( optionValue === undefined || !this.select ) {
				return false;
			}

			var selectValue = this.select.getAttribute( 'value' );

			if ( selectValue == optionValue ) {
				return true;
			}

			if ( this.select.getAttribute( 'multiple' ) && isArray( selectValue ) ) {
				var i = selectValue.length;
				while ( i-- ) {
					if ( selectValue[i] == optionValue ) {
						return true;
					}
				}
			}
		};

		Option.prototype.render = function render ( target, occupants ) {
			Element.prototype.render.call( this, target, occupants );

			if ( !this.attributeByName.value ) {
				this.node._ractive.value = this.getAttribute( 'value' );
			}
		};

		Option.prototype.unbind = function unbind () {
			Element.prototype.unbind.call(this);

			if ( this.select ) {
				removeFromArray( this.select.options, this );
			}
		};

		return Option;
	}(Element));

	function getPartialTemplate ( ractive, name, parentFragment ) {
		// If the partial in instance or view heirarchy instances, great
		var partial = getPartialFromRegistry( ractive, name, parentFragment || {} );
		if ( partial ) return partial;

		// Does it exist on the page as a script tag?
		partial = parser.fromId( name, { noThrow: true } );
		if ( partial ) {
			// parse and register to this ractive instance
			var parsed = parser.parseFor( partial, ractive );

			// register extra partials on the ractive instance if they don't already exist
			if ( parsed.p ) fillGaps( ractive.partials, parsed.p );

			// register (and return main partial if there are others in the template)
			return ractive.partials[ name ] = parsed.t;
		}
	}

	function getPartialFromRegistry ( ractive, name, parentFragment ) {
		// if there was an instance up-hierarchy, cool
		var partial = findParentPartial( name, parentFragment.owner );
		if ( partial ) return partial;

		// find first instance in the ractive or view hierarchy that has this partial
		var instance = findInstance( 'partials', ractive, name );

		if ( !instance ) { return; }

		partial = instance.partials[ name ];

		// partial is a function?
		var fn;
		if ( typeof partial === 'function' ) {
			fn = partial.bind( instance );
			fn.isOwner = instance.partials.hasOwnProperty(name);
			partial = fn.call( ractive, parser );
		}

		if ( !partial && partial !== '' ) {
			warnIfDebug( noRegistryFunctionReturn, name, 'partial', 'partial', { ractive: ractive });
			return;
		}

		// If this was added manually to the registry,
		// but hasn't been parsed, parse it now
		if ( !parser.isParsed( partial ) ) {
			// use the parseOptions of the ractive instance on which it was found
			var parsed = parser.parseFor( partial, instance );

			// Partials cannot contain nested partials!
			// TODO add a test for this
			if ( parsed.p ) {
				warnIfDebug( 'Partials ({{>%s}}) cannot contain nested inline partials', name, { ractive: ractive });
			}

			// if fn, use instance to store result, otherwise needs to go
			// in the correct point in prototype chain on instance or constructor
			var target = fn ? instance : findOwner( instance, name );

			// may be a template with partials, which need to be registered and main template extracted
			target.partials[ name ] = partial = parsed.t;
		}

		// store for reset
		if ( fn ) partial._fn = fn;

		return partial.v ? partial.t : partial;
	}

	function findOwner ( ractive, key ) {
		return ractive.partials.hasOwnProperty( key )
			? ractive
			: findConstructor( ractive.constructor, key);
	}

	function findConstructor ( constructor, key ) {
		if ( !constructor ) { return; }
		return constructor.partials.hasOwnProperty( key )
			? constructor
			: findConstructor( constructor._Parent, key );
	}

	function findParentPartial( name, parent ) {
		if ( parent ) {
			if ( parent.template && parent.template.p && parent.template.p[name] ) {
				return parent.template.p[name];
			} else if ( parent.parentFragment && parent.parentFragment.owner ) {
				return findParentPartial( name, parent.parentFragment.owner );
			}
		}
	}

	var Partial = (function (Mustache) {
		function Partial () {
			Mustache.apply(this, arguments);
		}

		Partial.prototype = Object.create( Mustache && Mustache.prototype );
		Partial.prototype.constructor = Partial;

		Partial.prototype.bind = function bind () {
			// keep track of the reference name for future resets
			this.refName = this.template.r;

			// name matches take priority over expressions
			var template = this.refName ? getPartialTemplate( this.ractive, this.refName, this.parentFragment ) || null : null;
			var templateObj;

			if ( template ) {
				this.named = true;
				this.setTemplate( this.template.r, template );
			}

			if ( !template ) {
				Mustache.prototype.bind.call(this);
				if ( this.model && ( templateObj = this.model.get() ) && typeof templateObj === 'object' && ( typeof templateObj.template === 'string' || isArray( templateObj.t ) ) ) {
					if ( templateObj.template ) {
						this.source = templateObj.template;
						templateObj = parsePartial( this.template.r, templateObj.template, this.ractive );
					} else {
						this.source = templateObj.t;
					}
					this.setTemplate( this.template.r, templateObj.t );
				} else if ( ( !this.model || typeof this.model.get() !== 'string' ) && this.refName ) {
					this.setTemplate( this.refName, template );
				} else {
					this.setTemplate( this.model.get() );
				}
			}

			this.fragment = new Fragment({
				owner: this,
				template: this.partialTemplate
			}).bind();
		};

		Partial.prototype.detach = function detach () {
			return this.fragment.detach();
		};

		Partial.prototype.find = function find ( selector ) {
			return this.fragment.find( selector );
		};

		Partial.prototype.findAll = function findAll ( selector, query ) {
			this.fragment.findAll( selector, query );
		};

		Partial.prototype.findComponent = function findComponent ( name ) {
			return this.fragment.findComponent( name );
		};

		Partial.prototype.findAllComponents = function findAllComponents ( name, query ) {
			this.fragment.findAllComponents( name, query );
		};

		Partial.prototype.firstNode = function firstNode ( skipParent ) {
			return this.fragment.firstNode( skipParent );
		};

		Partial.prototype.forceResetTemplate = function forceResetTemplate () {
			var this$1 = this;

			this.partialTemplate = undefined;

			// on reset, check for the reference name first
			if ( this.refName ) {
				this.partialTemplate = getPartialTemplate( this.ractive, this.refName, this.parentFragment );
			}

			// then look for the resolved name
			if ( !this.partialTemplate ) {
				this.partialTemplate = getPartialTemplate( this.ractive, this.name, this.parentFragment );
			}

			if ( !this.partialTemplate ) {
				warnOnceIfDebug( ("Could not find template for partial '" + (this.name) + "'") );
				this.partialTemplate = [];
			}

			if ( this.inAttribute ) {
				doInAttributes( function () { return this$1.fragment.resetTemplate( this$1.partialTemplate ); } );
			} else {
				this.fragment.resetTemplate( this.partialTemplate );
			}

			this.bubble();
		};

		Partial.prototype.render = function render ( target, occupants ) {
			this.fragment.render( target, occupants );
		};

		Partial.prototype.setTemplate = function setTemplate ( name, template ) {
			this.name = name;

			if ( !template && template !== null ) template = getPartialTemplate( this.ractive, name, this.parentFragment );

			if ( !template ) {
				warnOnceIfDebug( ("Could not find template for partial '" + name + "'") );
			}

			this.partialTemplate = template || [];
		};

		Partial.prototype.toString = function toString ( escape ) {
			return this.fragment.toString( escape );
		};

		Partial.prototype.unbind = function unbind () {
			Mustache.prototype.unbind.call(this);
			this.fragment.unbind();
		};

		Partial.prototype.unrender = function unrender ( shouldDestroy ) {
			this.fragment.unrender( shouldDestroy );
		};

		Partial.prototype.update = function update () {
			var template;

			if ( this.dirty ) {
				this.dirty = false;

				if ( !this.named ) {
					if ( this.model ) {
						template = this.model.get();
					}

					if ( template && typeof template === 'string' && template !== this.name ) {
						this.setTemplate( template );
						this.fragment.resetTemplate( this.partialTemplate );
					} else if ( template && typeof template === 'object' && ( typeof template.template === 'string' || isArray( template.t ) ) ) {
						if ( template.t !== this.source && template.template !== this.source ) {
							if ( template.template ) {
								this.source = template.template;
								template = parsePartial( this.name, template.template, this.ractive );
							} else {
								this.source = template.t;
							}
							this.setTemplate( this.name, template.t );
							this.fragment.resetTemplate( this.partialTemplate );
						}
					}
				}

				this.fragment.update();
			}
		};

		return Partial;
	}(Mustache));

	function parsePartial( name, partial, ractive ) {
		var parsed;

		try {
			parsed = parser.parse( partial, parser.getParseOptions( ractive ) );
		} catch (e) {
			warnIfDebug( ("Could not parse partial from expression '" + name + "'\n" + (e.message)) );
		}

		return parsed || { t: [] };
	}

	var RepeatedFragment = function RepeatedFragment ( options ) {
		this.parent = options.owner.parentFragment;

		// bit of a hack, so reference resolution works without another
		// layer of indirection
		this.parentFragment = this;
		this.owner = options.owner;
		this.ractive = this.parent.ractive;

		// encapsulated styles should be inherited until they get applied by an element
		this.cssIds = 'cssIds' in options ? options.cssIds : ( this.parent ? this.parent.cssIds : null );

		this.context = null;
		this.rendered = false;
		this.iterations = [];

		this.template = options.template;

		this.indexRef = options.indexRef;
		this.keyRef = options.keyRef;

		this.pendingNewIndices = null;
		this.previousIterations = null;

		// track array versus object so updates of type rest
		this.isArray = false;
	};

	RepeatedFragment.prototype.bind = function bind ( context ) {
		var this$1 = this;

			this.context = context;
		var value = context.get();

		// {{#each array}}...
		if ( this.isArray = isArray( value ) ) {
			// we can't use map, because of sparse arrays
			this.iterations = [];
			var max = value.length;
			for ( var i = 0; i < max; i += 1 ) {
				this$1.iterations[i] = this$1.createIteration( i, i );
			}
		}

		// {{#each object}}...
		else if ( isObject( value ) ) {
			this.isArray = false;

			// TODO this is a dreadful hack. There must be a neater way
			if ( this.indexRef ) {
				var refs = this.indexRef.split( ',' );
				this.keyRef = refs[0];
				this.indexRef = refs[1];
			}

			this.iterations = Object.keys( value ).map( function ( key, index ) {
				return this$1.createIteration( key, index );
			});
		}

		return this;
	};

	RepeatedFragment.prototype.bubble = function bubble () {
		this.owner.bubble();
	};

	RepeatedFragment.prototype.createIteration = function createIteration ( key, index ) {
		var fragment = new Fragment({
			owner: this,
			template: this.template
		});

		// TODO this is a bit hacky
		fragment.key = key;
		fragment.index = index;
		fragment.isIteration = true;

		var model = this.context.joinKey( key );

		// set up an iteration alias if there is one
		if ( this.owner.template.z ) {
			fragment.aliases = {};
			fragment.aliases[ this.owner.template.z[0].n ] = model;
		}

		return fragment.bind( model );
	};

	RepeatedFragment.prototype.destroyed = function destroyed () {
		this.iterations.forEach( function ( i ) { return i.destroyed(); } );
	};

	RepeatedFragment.prototype.detach = function detach () {
		var docFrag = createDocumentFragment();
		this.iterations.forEach( function ( fragment ) { return docFrag.appendChild( fragment.detach() ); } );
		return docFrag;
	};

	RepeatedFragment.prototype.find = function find ( selector ) {
		var this$1 = this;

			var len = this.iterations.length;
		var i;

		for ( i = 0; i < len; i += 1 ) {
			var found = this$1.iterations[i].find( selector );
			if ( found ) return found;
		}
	};

	RepeatedFragment.prototype.findAll = function findAll ( selector, query ) {
		var this$1 = this;

			var len = this.iterations.length;
		var i;

		for ( i = 0; i < len; i += 1 ) {
			this$1.iterations[i].findAll( selector, query );
		}
	};

	RepeatedFragment.prototype.findComponent = function findComponent ( name ) {
		var this$1 = this;

			var len = this.iterations.length;
		var i;

		for ( i = 0; i < len; i += 1 ) {
			var found = this$1.iterations[i].findComponent( name );
			if ( found ) return found;
		}
	};

	RepeatedFragment.prototype.findAllComponents = function findAllComponents ( name, query ) {
		var this$1 = this;

			var len = this.iterations.length;
		var i;

		for ( i = 0; i < len; i += 1 ) {
			this$1.iterations[i].findAllComponents( name, query );
		}
	};

	RepeatedFragment.prototype.findNextNode = function findNextNode ( iteration ) {
		var this$1 = this;

			if ( iteration.index < this.iterations.length - 1 ) {
			for ( var i = iteration.index + 1; i < this$1.iterations.length; i++ ) {
				var node = this$1.iterations[ i ].firstNode( true );
				if ( node ) return node;
			}
		}

		return this.owner.findNextNode();
	};

	RepeatedFragment.prototype.firstNode = function firstNode ( skipParent ) {
		return this.iterations[0] ? this.iterations[0].firstNode( skipParent ) : null;
	};

	RepeatedFragment.prototype.rebinding = function rebinding ( next ) {
		var this$1 = this;

			this.context = next;
		this.iterations.forEach( function ( fragment ) {
			var model = next ? next.joinKey( fragment.key || fragment.index ) : undefined;
			fragment.context = model;
			if ( this$1.owner.template.z ) {
				fragment.aliases = {};
				fragment.aliases[ this$1.owner.template.z[0].n ] = model;
			}
		});
	};

	RepeatedFragment.prototype.render = function render ( target, occupants ) {
		// TODO use docFrag.cloneNode...

		if ( this.iterations ) {
			this.iterations.forEach( function ( fragment ) { return fragment.render( target, occupants ); } );
		}

		this.rendered = true;
	};

	RepeatedFragment.prototype.shuffle = function shuffle ( newIndices ) {
		var this$1 = this;

			if ( !this.pendingNewIndices ) this.previousIterations = this.iterations.slice();

		if ( !this.pendingNewIndices ) this.pendingNewIndices = [];

		this.pendingNewIndices.push( newIndices );

		var iterations = [];

		newIndices.forEach( function ( newIndex, oldIndex ) {
			if ( newIndex === -1 ) return;

			var fragment = this$1.iterations[ oldIndex ];
			iterations[ newIndex ] = fragment;

			if ( newIndex !== oldIndex && fragment ) fragment.dirty = true;
		});

		this.iterations = iterations;

		this.bubble();
	};

	RepeatedFragment.prototype.shuffled = function shuffled () {
		this.iterations.forEach( function ( i ) { return i.shuffled(); } );
	};

	RepeatedFragment.prototype.toString = function toString$1$$ ( escape ) {
		return this.iterations ?
			this.iterations.map( escape ? toEscapedString : toString$1 ).join( '' ) :
			'';
	};

	RepeatedFragment.prototype.unbind = function unbind$1 () {
		this.iterations.forEach( unbind );
		return this;
	};

	RepeatedFragment.prototype.unrender = function unrender$1 ( shouldDestroy ) {
		this.iterations.forEach( shouldDestroy ? unrenderAndDestroy : unrender );
		if ( this.pendingNewIndices && this.previousIterations ) {
			this.previousIterations.forEach( function ( fragment ) {
				if ( fragment.rendered ) shouldDestroy ? unrenderAndDestroy( fragment ) : unrender( fragment );
			});
		}
		this.rendered = false;
	};

	// TODO smart update
	RepeatedFragment.prototype.update = function update$1 () {
		// skip dirty check, since this is basically just a facade

		var this$1 = this;

			if ( this.pendingNewIndices ) {
			this.updatePostShuffle();
			return;
		}

		if ( this.updating ) return;
		this.updating = true;

		var value = this.context.get(),
				  wasArray = this.isArray;

		var toRemove;
		var oldKeys;
		var reset = true;
		var i;

		if ( this.isArray = isArray( value ) ) {
			if ( wasArray ) {
				reset = false;
				if ( this.iterations.length > value.length ) {
					toRemove = this.iterations.splice( value.length );
				}
			}
		} else if ( isObject( value ) && !wasArray ) {
			reset = false;
			toRemove = [];
			oldKeys = {};
			i = this.iterations.length;

			while ( i-- ) {
				var fragment$1 = this$1.iterations[i];
				if ( fragment$1.key in value ) {
					oldKeys[ fragment$1.key ] = true;
				} else {
					this$1.iterations.splice( i, 1 );
					toRemove.push( fragment$1 );
				}
			}
		}

		if ( reset ) {
			toRemove = this.iterations;
			this.iterations = [];
		}

		if ( toRemove ) {
			toRemove.forEach( function ( fragment ) {
				fragment.unbind();
				fragment.unrender( true );
			});
		}

		// update the remaining ones
		this.iterations.forEach( update );

		// add new iterations
		var newLength = isArray( value ) ?
			value.length :
			isObject( value ) ?
				Object.keys( value ).length :
				0;

		var docFrag;
		var fragment;

		if ( newLength > this.iterations.length ) {
			docFrag = this.rendered ? createDocumentFragment() : null;
			i = this.iterations.length;

			if ( isArray( value ) ) {
				while ( i < value.length ) {
					fragment = this$1.createIteration( i, i );

					this$1.iterations.push( fragment );
					if ( this$1.rendered ) fragment.render( docFrag );

					i += 1;
				}
			}

			else if ( isObject( value ) ) {
				// TODO this is a dreadful hack. There must be a neater way
				if ( this.indexRef && !this.keyRef ) {
					var refs = this.indexRef.split( ',' );
					this.keyRef = refs[0];
					this.indexRef = refs[1];
				}

				Object.keys( value ).forEach( function ( key ) {
					if ( !oldKeys || !( key in oldKeys ) ) {
						fragment = this$1.createIteration( key, i );

						this$1.iterations.push( fragment );
						if ( this$1.rendered ) fragment.render( docFrag );

						i += 1;
					}
				});
			}

			if ( this.rendered ) {
				var parentNode = this.parent.findParentNode();
				var anchor = this.parent.findNextNode( this.owner );

				parentNode.insertBefore( docFrag, anchor );
			}
		}

		this.updating = false;
	};

	RepeatedFragment.prototype.updatePostShuffle = function updatePostShuffle () {
		var this$1 = this;

			var newIndices = this.pendingNewIndices[ 0 ];

		// map first shuffle through
		this.pendingNewIndices.slice( 1 ).forEach( function ( indices ) {
			newIndices.forEach( function ( newIndex, oldIndex ) {
				newIndices[ oldIndex ] = indices[ newIndex ];
			});
		});

		// This algorithm (for detaching incorrectly-ordered fragments from the DOM and
		// storing them in a document fragment for later reinsertion) seems a bit hokey,
		// but it seems to work for now
		var len = this.context.get().length, oldLen = this.previousIterations.length;
		var i;
		var removed = {};

		newIndices.forEach( function ( newIndex, oldIndex ) {
			var fragment = this$1.previousIterations[ oldIndex ];
			this$1.previousIterations[ oldIndex ] = null;

			if ( newIndex === -1 ) {
				removed[ oldIndex ] = fragment;
			} else if ( fragment.index !== newIndex ) {
				var model = this$1.context.joinKey( newIndex );
				fragment.index = fragment.key = newIndex;
				fragment.context = model;
				if ( this$1.owner.template.z ) {
					fragment.aliases = {};
					fragment.aliases[ this$1.owner.template.z[0].n ] = model;
				}
			}
		});

		// if the array was spliced outside of ractive, sometimes there are leftover fragments not in the newIndices
		this.previousIterations.forEach( function ( frag, i ) {
			if ( frag ) removed[ i ] = frag;
		});

		// create new/move existing iterations
		var docFrag = this.rendered ? createDocumentFragment() : null;
		var parentNode = this.rendered ? this.parent.findParentNode() : null;

		var contiguous = 'startIndex' in newIndices;
		i = contiguous ? newIndices.startIndex : 0;

		for ( i; i < len; i++ ) {
			var frag = this$1.iterations[i];

			if ( frag && contiguous ) {
				// attach any built-up iterations
				if ( this$1.rendered ) {
					if ( removed[i] ) docFrag.appendChild( removed[i].detach() );
					if ( docFrag.childNodes.length  ) parentNode.insertBefore( docFrag, frag.firstNode() );
				}
				continue;
			}

			if ( !frag ) this$1.iterations[i] = this$1.createIteration( i, i );

			if ( this$1.rendered ) {
				if ( removed[i] ) docFrag.appendChild( removed[i].detach() );

				if ( frag ) docFrag.appendChild( frag.detach() );
				else {
					this$1.iterations[i].render( docFrag );
				}
			}
		}

		// append any leftovers
		if ( this.rendered ) {
			for ( i = len; i < oldLen; i++ ) {
				if ( removed[i] ) docFrag.appendChild( removed[i].detach() );
			}

			if ( docFrag.childNodes.length ) {
				parentNode.insertBefore( docFrag, this.owner.findNextNode() );
			}
		}

		// trigger removal on old nodes
		Object.keys( removed ).forEach( function ( k ) { return removed[k].unbind().unrender( true ); } );

		this.iterations.forEach( update );

		this.pendingNewIndices = null;

		this.shuffled();
	};

	function isEmpty ( value ) {
		return !value ||
		       ( isArray( value ) && value.length === 0 ) ||
			   ( isObject( value ) && Object.keys( value ).length === 0 );
	}

	function getType ( value, hasIndexRef ) {
		if ( hasIndexRef || isArray( value ) ) return SECTION_EACH;
		if ( isObject( value ) || typeof value === 'function' ) return SECTION_IF_WITH;
		if ( value === undefined ) return null;
		return SECTION_IF;
	}

	var Section = (function (Mustache) {
		function Section ( options ) {
			Mustache.call( this, options );

			this.sectionType = options.template.n || null;
			this.templateSectionType = this.sectionType;
			this.subordinate = options.template.l === 1;
			this.fragment = null;
		}

		Section.prototype = Object.create( Mustache && Mustache.prototype );
		Section.prototype.constructor = Section;

		Section.prototype.bind = function bind () {
			Mustache.prototype.bind.call(this);

			if ( this.subordinate ) {
				this.sibling = this.parentFragment.items[ this.parentFragment.items.indexOf( this ) - 1 ];
				this.sibling.nextSibling = this;
			}

			// if we managed to bind, we need to create children
			if ( this.model ) {
				this.dirty = true;
				this.update();
			} else if ( this.sectionType && this.sectionType === SECTION_UNLESS && ( !this.sibling || !this.sibling.isTruthy() ) ) {
				this.fragment = new Fragment({
					owner: this,
					template: this.template.f
				}).bind();
			}
		};

		Section.prototype.detach = function detach () {
			return this.fragment ? this.fragment.detach() : createDocumentFragment();
		};

		Section.prototype.find = function find ( selector ) {
			if ( this.fragment ) {
				return this.fragment.find( selector );
			}
		};

		Section.prototype.findAll = function findAll ( selector, query ) {
			if ( this.fragment ) {
				this.fragment.findAll( selector, query );
			}
		};

		Section.prototype.findComponent = function findComponent ( name ) {
			if ( this.fragment ) {
				return this.fragment.findComponent( name );
			}
		};

		Section.prototype.findAllComponents = function findAllComponents ( name, query ) {
			if ( this.fragment ) {
				this.fragment.findAllComponents( name, query );
			}
		};

		Section.prototype.firstNode = function firstNode ( skipParent ) {
			return this.fragment && this.fragment.firstNode( skipParent );
		};

		Section.prototype.isTruthy = function isTruthy () {
			if ( this.subordinate && this.sibling.isTruthy() ) return true;
			var value = !this.model ? undefined : this.model.isRoot ? this.model.value : this.model.get();
			return !!value && ( this.templateSectionType === SECTION_IF_WITH || !isEmpty( value ) );
		};

		Section.prototype.rebinding = function rebinding ( next, previous, safe ) {
			if ( Mustache.prototype.rebinding.call( this, next, previous, safe ) ) {
				if ( this.fragment && this.sectionType !== SECTION_IF && this.sectionType !== SECTION_UNLESS ) {
					this.fragment.rebinding( next, previous );
				}
			}
		};

		Section.prototype.render = function render ( target, occupants ) {
			this.rendered = true;
			if ( this.fragment ) this.fragment.render( target, occupants );
		};

		Section.prototype.shuffle = function shuffle ( newIndices ) {
			if ( this.fragment && this.sectionType === SECTION_EACH ) {
				this.fragment.shuffle( newIndices );
			}
		};

		Section.prototype.toString = function toString ( escape ) {
			return this.fragment ? this.fragment.toString( escape ) : '';
		};

		Section.prototype.unbind = function unbind () {
			Mustache.prototype.unbind.call(this);
			if ( this.fragment ) this.fragment.unbind();
		};

		Section.prototype.unrender = function unrender ( shouldDestroy ) {
			if ( this.rendered && this.fragment ) this.fragment.unrender( shouldDestroy );
			this.rendered = false;
		};

		Section.prototype.update = function update () {
			if ( !this.dirty ) return;

			if ( this.fragment && this.sectionType !== SECTION_IF && this.sectionType !== SECTION_UNLESS ) {
				this.fragment.context = this.model;
			}

			if ( !this.model && this.sectionType !== SECTION_UNLESS ) return;

			this.dirty = false;

			var value = !this.model ? undefined : this.model.isRoot ? this.model.value : this.model.get();
			var siblingFalsey = !this.subordinate || !this.sibling.isTruthy();
			var lastType = this.sectionType;

			// watch for switching section types
			if ( this.sectionType === null || this.templateSectionType === null ) this.sectionType = getType( value, this.template.i );
			if ( lastType && lastType !== this.sectionType && this.fragment ) {
				if ( this.rendered ) {
					this.fragment.unbind().unrender( true );
				}

				this.fragment = null;
			}

			var newFragment;

			var fragmentShouldExist = this.sectionType === SECTION_EACH || // each always gets a fragment, which may have no iterations
			                            this.sectionType === SECTION_WITH || // with (partial context) always gets a fragment
			                            ( siblingFalsey && ( this.sectionType === SECTION_UNLESS ? !this.isTruthy() : this.isTruthy() ) ); // if, unless, and if-with depend on siblings and the condition

			if ( fragmentShouldExist ) {
				if ( this.fragment ) {
					this.fragment.update();
				} else {
					if ( this.sectionType === SECTION_EACH ) {
						newFragment = new RepeatedFragment({
							owner: this,
							template: this.template.f,
							indexRef: this.template.i
						}).bind( this.model );
					} else {
		 				// only with and if-with provide context - if and unless do not
						var context = this.sectionType !== SECTION_IF && this.sectionType !== SECTION_UNLESS ? this.model : null;
						newFragment = new Fragment({
							owner: this,
							template: this.template.f
						}).bind( context );
					}
				}
			} else {
				if ( this.fragment ) {
					this.fragment.unbind();
					if ( this.rendered ) this.fragment.unrender( true );
				}

				this.fragment = null;
			}

			if ( newFragment ) {
				if ( this.rendered ) {
					var parentNode = this.parentFragment.findParentNode();
					var anchor = this.parentFragment.findNextNode( this );

					if ( anchor ) {
						var docFrag = createDocumentFragment();
						newFragment.render( docFrag );

						// we use anchor.parentNode, not parentNode, because the sibling
						// may be temporarily detached as a result of a shuffle
						anchor.parentNode.insertBefore( docFrag, anchor );
					} else {
						newFragment.render( parentNode );
					}
				}

				this.fragment = newFragment;
			}

			if ( this.nextSibling ) {
				this.nextSibling.dirty = true;
				this.nextSibling.update();
			}
		};

		return Section;
	}(Mustache));

	function valueContains ( selectValue, optionValue ) {
		var i = selectValue.length;
		while ( i-- ) {
			if ( selectValue[i] == optionValue ) return true;
		}
	}

	var Select = (function (Element) {
		function Select ( options ) {
			Element.call( this, options );
			this.options = [];
		}

		Select.prototype = Object.create( Element && Element.prototype );
		Select.prototype.constructor = Select;

		Select.prototype.foundNode = function foundNode ( node ) {
			if ( this.binding ) {
				var selectedOptions = getSelectedOptions( node );

				if ( selectedOptions.length > 0 ) {
					this.selectedOptions = selectedOptions;
				}
			}
		};

		Select.prototype.render = function render ( target, occupants ) {
			Element.prototype.render.call( this, target, occupants );
			this.sync();

			var node = this.node;

			var i = node.options.length;
			while ( i-- ) {
				node.options[i].defaultSelected = node.options[i].selected;
			}

			this.rendered = true;
		};

		Select.prototype.sync = function sync () {
			var this$1 = this;

			var selectNode = this.node;

			if ( !selectNode ) return;

			var options = toArray( selectNode.options );

			if ( this.selectedOptions ) {
				options.forEach( function ( o ) {
					if ( this$1.selectedOptions.indexOf( o ) >= 0 ) o.selected = true;
					else o.selected = false;
				});
				this.binding.setFromNode( selectNode );
				delete this.selectedOptions;
				return;
			}

			var selectValue = this.getAttribute( 'value' );
			var isMultiple = this.getAttribute( 'multiple' );
			var array = isMultiple && isArray( selectValue );

			// If the <select> has a specified value, that should override
			// these options
			if ( selectValue !== undefined ) {
				var optionWasSelected;

				options.forEach( function ( o ) {
					var optionValue = o._ractive ? o._ractive.value : o.value;
					var shouldSelect = isMultiple ? array && valueContains( selectValue, optionValue ) : selectValue == optionValue;

					if ( shouldSelect ) {
						optionWasSelected = true;
					}

					o.selected = shouldSelect;
				});

				if ( !optionWasSelected && !isMultiple ) {
					if ( this.binding ) {
						this.binding.forceUpdate();
					}
				}
			}

			// Otherwise the value should be initialised according to which
			// <option> element is selected, if twoway binding is in effect
			else if ( this.binding ) {
				this.binding.forceUpdate();
			}
		};

		Select.prototype.update = function update () {
			var dirty = this.dirty;
			Element.prototype.update.call(this);
			if ( dirty ) {
				this.sync();
			}
		};

		return Select;
	}(Element));

	var Textarea = (function (Input) {
		function Textarea( options ) {
			var template = options.template;

			options.deferContent = true;

			Input.call( this, options );

			// check for single interpolator binding
			if ( !this.attributeByName.value ) {
				if ( template.f && isBindable( { template: template } ) ) {
					this.attributes.push( createItem( {
						owner: this,
						template: { t: ATTRIBUTE, f: template.f, n: 'value' },
						parentFragment: this.parentFragment
					} ) );
				} else {
					this.fragment = new Fragment({ owner: this, cssIds: null, template: template.f });
				}
			}
		}

		Textarea.prototype = Object.create( Input && Input.prototype );
		Textarea.prototype.constructor = Textarea;

		Textarea.prototype.bubble = function bubble () {
			var this$1 = this;

			if ( !this.dirty ) {
				this.dirty = true;

				if ( this.rendered && !this.binding && this.fragment ) {
					runloop.scheduleTask( function () {
						this$1.dirty = false;
						this$1.node.value = this$1.fragment.toString();
					});
				}

				this.parentFragment.bubble(); // default behaviour
			}
		};

		return Textarea;
	}(Input));

	var Text = (function (Item) {
		function Text ( options ) {
			Item.call( this, options );
			this.type = TEXT;
		}

		Text.prototype = Object.create( Item && Item.prototype );
		Text.prototype.constructor = Text;

		Text.prototype.bind = function bind () {
			// noop
		};

		Text.prototype.detach = function detach () {
			return detachNode( this.node );
		};

		Text.prototype.firstNode = function firstNode () {
			return this.node;
		};

		Text.prototype.render = function render ( target, occupants ) {
			if ( inAttributes() ) return;
			this.rendered = true;

			if ( occupants ) {
				var n = occupants[0];
				if ( n && n.nodeType === 3 ) {
					occupants.shift();
					if ( n.nodeValue !== this.template ) {
						n.nodeValue = this.template;
					}
				} else {
					n = this.node = doc.createTextNode( this.template );
					if ( occupants[0] ) {
						target.insertBefore( n, occupants[0] );
					} else {
						target.appendChild( n );
					}
				}

				this.node = n;
			} else {
				this.node = doc.createTextNode( this.template );
				target.appendChild( this.node );
			}
		};

		Text.prototype.toString = function toString ( escape ) {
			return escape ? escapeHtml( this.template ) : this.template;
		};

		Text.prototype.unbind = function unbind () {
			// noop
		};

		Text.prototype.unrender = function unrender ( shouldDestroy ) {
			if ( this.rendered && shouldDestroy ) this.detach();
			this.rendered = false;
		};

		Text.prototype.update = function update () {
			// noop
		};

		Text.prototype.valueOf = function valueOf () {
			return this.template;
		};

		return Text;
	}(Item));

	function camelCase ( hyphenatedStr ) {
		return hyphenatedStr.replace( /-([a-zA-Z])/g, function ( match, $1 ) {
			return $1.toUpperCase();
		});
	}

	var prefix;

	if ( !isClient ) {
		prefix = null;
	} else {
		var prefixCache = {};
		var testStyle = createElement( 'div' ).style;

		prefix = function ( prop ) {
			prop = camelCase( prop );

			if ( !prefixCache[ prop ] ) {
				if ( testStyle[ prop ] !== undefined ) {
					prefixCache[ prop ] = prop;
				}

				else {
					// test vendors...
					var capped = prop.charAt( 0 ).toUpperCase() + prop.substring( 1 );

					var i = vendors.length;
					while ( i-- ) {
						var vendor = vendors[i];
						if ( testStyle[ vendor + capped ] !== undefined ) {
							prefixCache[ prop ] = vendor + capped;
							break;
						}
					}
				}
			}

			return prefixCache[ prop ];
		};
	}

	var prefix$1 = prefix;

	var visible;
	var hidden = 'hidden';

	if ( doc ) {
		var prefix$2;

		if ( hidden in doc ) {
			prefix$2 = '';
		} else {
			var i$1 = vendors.length;
			while ( i$1-- ) {
				var vendor = vendors[i$1];
				hidden = vendor + 'Hidden';

				if ( hidden in doc ) {
					prefix$2 = vendor;
					break;
				}
			}
		}

		if ( prefix$2 !== undefined ) {
			doc.addEventListener( prefix$2 + 'visibilitychange', onChange );
			onChange();
		} else {
			// gah, we're in an old browser
			if ( 'onfocusout' in doc ) {
				doc.addEventListener( 'focusout', onHide );
				doc.addEventListener( 'focusin', onShow );
			}

			else {
				win.addEventListener( 'pagehide', onHide );
				win.addEventListener( 'blur', onHide );

				win.addEventListener( 'pageshow', onShow );
				win.addEventListener( 'focus', onShow );
			}

			visible = true; // until proven otherwise. Not ideal but hey
		}
	}

	function onChange () {
		visible = !doc[ hidden ];
	}

	function onHide () {
		visible = false;
	}

	function onShow () {
		visible = true;
	}

	var unprefixPattern = new RegExp( '^-(?:' + vendors.join( '|' ) + ')-' );

	function unprefix ( prop ) {
		return prop.replace( unprefixPattern, '' );
	}

	var vendorPattern = new RegExp( '^(?:' + vendors.join( '|' ) + ')([A-Z])' );

	function hyphenate ( str ) {
		if ( !str ) return ''; // edge case

		if ( vendorPattern.test( str ) ) str = '-' + str;

		return str.replace( /[A-Z]/g, function ( match ) { return '-' + match.toLowerCase(); } );
	}

	var createTransitions;

	if ( !isClient ) {
		createTransitions = null;
	} else {
		var testStyle$1 = createElement( 'div' ).style;
		var linear$1 = function ( x ) { return x; };

		var canUseCssTransitions = {};
		var cannotUseCssTransitions = {};

		// determine some facts about our environment
		var TRANSITION$1;
		var TRANSITIONEND;
		var CSS_TRANSITIONS_ENABLED;
		var TRANSITION_DURATION;
		var TRANSITION_PROPERTY;
		var TRANSITION_TIMING_FUNCTION;

		if ( testStyle$1.transition !== undefined ) {
			TRANSITION$1 = 'transition';
			TRANSITIONEND = 'transitionend';
			CSS_TRANSITIONS_ENABLED = true;
		} else if ( testStyle$1.webkitTransition !== undefined ) {
			TRANSITION$1 = 'webkitTransition';
			TRANSITIONEND = 'webkitTransitionEnd';
			CSS_TRANSITIONS_ENABLED = true;
		} else {
			CSS_TRANSITIONS_ENABLED = false;
		}

		if ( TRANSITION$1 ) {
			TRANSITION_DURATION = TRANSITION$1 + 'Duration';
			TRANSITION_PROPERTY = TRANSITION$1 + 'Property';
			TRANSITION_TIMING_FUNCTION = TRANSITION$1 + 'TimingFunction';
		}

		createTransitions = function ( t, to, options, changedProperties, resolve ) {

			// Wait a beat (otherwise the target styles will be applied immediately)
			// TODO use a fastdom-style mechanism?
			setTimeout( function () {
				var jsTransitionsComplete;
				var cssTransitionsComplete;
				var cssTimeout;

				function transitionDone () { clearTimeout( cssTimeout ); }

				function checkComplete () {
					if ( jsTransitionsComplete && cssTransitionsComplete ) {
						t.unregisterCompleteHandler( transitionDone );
						// will changes to events and fire have an unexpected consequence here?
						t.ractive.fire( t.name + ':end', t.node, t.isIntro );
						resolve();
					}
				}

				// this is used to keep track of which elements can use CSS to animate
				// which properties
				var hashPrefix = ( t.node.namespaceURI || '' ) + t.node.tagName;

				// need to reset transition properties
				var style = t.node.style;
				var previous = {
					property: style[ TRANSITION_PROPERTY ],
					timing: style[ TRANSITION_TIMING_FUNCTION ],
					duration: style[ TRANSITION_DURATION ]
				};

				style[ TRANSITION_PROPERTY ] = changedProperties.map( prefix$1 ).map( hyphenate ).join( ',' );
				style[ TRANSITION_TIMING_FUNCTION ] = hyphenate( options.easing || 'linear' );
				style[ TRANSITION_DURATION ] = ( options.duration / 1000 ) + 's';

				function transitionEndHandler ( event ) {
					var index = changedProperties.indexOf( camelCase( unprefix( event.propertyName ) ) );

					if ( index !== -1 ) {
						changedProperties.splice( index, 1 );
					}

					if ( changedProperties.length ) {
						// still transitioning...
						return;
					}

					clearTimeout( cssTimeout );
					cssTransitionsDone();
				}

				function cssTransitionsDone () {
					style[ TRANSITION_PROPERTY ] = previous.property;
					style[ TRANSITION_TIMING_FUNCTION ] = previous.duration;
					style[ TRANSITION_DURATION ] = previous.timing;

					t.node.removeEventListener( TRANSITIONEND, transitionEndHandler, false );

					cssTransitionsComplete = true;
					checkComplete();
				}

				t.node.addEventListener( TRANSITIONEND, transitionEndHandler, false );

				// safety net in case transitionend never fires
				cssTimeout = setTimeout( function () {
					changedProperties = [];
					cssTransitionsDone();
				}, options.duration + ( options.delay || 0 ) + 50 );
				t.registerCompleteHandler( transitionDone );

				setTimeout( function () {
					var i = changedProperties.length;
					var hash;
					var originalValue;
					var index;
					var propertiesToTransitionInJs = [];
					var prop;
					var suffix;
					var interpolator;

					while ( i-- ) {
						prop = changedProperties[i];
						hash = hashPrefix + prop;

						if ( CSS_TRANSITIONS_ENABLED && !cannotUseCssTransitions[ hash ] ) {
							style[ prefix$1( prop ) ] = to[ prop ];

							// If we're not sure if CSS transitions are supported for
							// this tag/property combo, find out now
							if ( !canUseCssTransitions[ hash ] ) {
								originalValue = t.getStyle( prop );

								// if this property is transitionable in this browser,
								// the current style will be different from the target style
								canUseCssTransitions[ hash ] = ( t.getStyle( prop ) != to[ prop ] );
								cannotUseCssTransitions[ hash ] = !canUseCssTransitions[ hash ];

								// Reset, if we're going to use timers after all
								if ( cannotUseCssTransitions[ hash ] ) {
									style[ prefix$1( prop ) ] = originalValue;
								}
							}
						}

						if ( !CSS_TRANSITIONS_ENABLED || cannotUseCssTransitions[ hash ] ) {
							// we need to fall back to timer-based stuff
							if ( originalValue === undefined ) {
								originalValue = t.getStyle( prop );
							}

							// need to remove this from changedProperties, otherwise transitionEndHandler
							// will get confused
							index = changedProperties.indexOf( prop );
							if ( index === -1 ) {
								warnIfDebug( 'Something very strange happened with transitions. Please raise an issue at https://github.com/ractivejs/ractive/issues - thanks!', { node: t.node });
							} else {
								changedProperties.splice( index, 1 );
							}

							// TODO Determine whether this property is animatable at all

							suffix = /[^\d]*$/.exec( to[ prop ] )[0];
							interpolator = interpolate( parseFloat( originalValue ), parseFloat( to[ prop ] ) ) || ( function () { return to[ prop ]; } );

							// ...then kick off a timer-based transition
							propertiesToTransitionInJs.push({
								name: prefix$1( prop ),
								interpolator: interpolator,
								suffix: suffix
							});
						}
					}

					// javascript transitions
					if ( propertiesToTransitionInJs.length ) {
						var easing;

						if ( typeof options.easing === 'string' ) {
							easing = t.ractive.easing[ options.easing ];

							if ( !easing ) {
								warnOnceIfDebug( missingPlugin( options.easing, 'easing' ) );
								easing = linear$1;
							}
						} else if ( typeof options.easing === 'function' ) {
							easing = options.easing;
						} else {
							easing = linear$1;
						}

						new Ticker({
							duration: options.duration,
							easing: easing,
							step: function ( pos ) {
								var i = propertiesToTransitionInJs.length;
								while ( i-- ) {
									var prop = propertiesToTransitionInJs[i];
									t.node.style[ prop.name ] = prop.interpolator( pos ) + prop.suffix;
								}
							},
							complete: function () {
								jsTransitionsComplete = true;
								checkComplete();
							}
						});
					} else {
						jsTransitionsComplete = true;
					}

					if ( !changedProperties.length ) {
						// We need to cancel the transitionEndHandler, and deal with
						// the fact that it will never fire
						t.node.removeEventListener( TRANSITIONEND, transitionEndHandler, false );
						cssTransitionsComplete = true;
						checkComplete();
					}
				}, 0 );
			}, options.delay || 0 );
		};
	}

	var createTransitions$1 = createTransitions;

	function resetStyle ( node, style ) {
		if ( style ) {
			node.setAttribute( 'style', style );
		} else {
			// Next line is necessary, to remove empty style attribute!
			// See http://stackoverflow.com/a/7167553
			node.getAttribute( 'style' );
			node.removeAttribute( 'style' );
		}
	}

	var getComputedStyle = win && ( win.getComputedStyle || legacy.getComputedStyle );
	var resolved = Promise$1.resolve();

	var names = {
		t0: 'intro-outro',
		t1: 'intro',
		t2: 'outro'
	};

	var Transition = function Transition ( options ) {
		this.owner = options.owner || options.parentFragment.owner || findElement( options.parentFragment );
		this.element = this.owner.attributeByName ? this.owner : findElement( options.parentFragment );
		this.ractive = this.owner.ractive;
		this.template = options.template;
		this.parentFragment = options.parentFragment;
		this.options = options;
		this.onComplete = [];
	};

	Transition.prototype.animateStyle = function animateStyle ( style, value, options ) {
		var this$1 = this;

			if ( arguments.length === 4 ) {
			throw new Error( 't.animateStyle() returns a promise - use .then() instead of passing a callback' );
		}

		// Special case - page isn't visible. Don't animate anything, because
		// that way you'll never get CSS transitionend events
		if ( !visible ) {
			this.setStyle( style, value );
			return resolved;
		}

		var to;

		if ( typeof style === 'string' ) {
			to = {};
			to[ style ] = value;
		} else {
			to = style;

			// shuffle arguments
			options = value;
		}

		// As of 0.3.9, transition authors should supply an `option` object with
		// `duration` and `easing` properties (and optional `delay`), plus a
		// callback function that gets called after the animation completes

		// TODO remove this check in a future version
		if ( !options ) {
			warnOnceIfDebug( 'The "%s" transition does not supply an options object to `t.animateStyle()`. This will break in a future version of Ractive. For more info see https://github.com/RactiveJS/Ractive/issues/340', this.name );
			options = this;
		}

		return new Promise$1( function ( fulfil ) {
			// Edge case - if duration is zero, set style synchronously and complete
			if ( !options.duration ) {
				this$1.setStyle( to );
				fulfil();
				return;
			}

			// Get a list of the properties we're animating
			var propertyNames = Object.keys( to );
			var changedProperties = [];

			// Store the current styles
			var computedStyle = getComputedStyle( this$1.node );

			var i = propertyNames.length;
			while ( i-- ) {
				var prop = propertyNames[i];
				var current = computedStyle[ prefix$1( prop ) ];

				if ( current === '0px' ) current = 0;

				// we need to know if we're actually changing anything
				if ( current != to[ prop ] ) { // use != instead of !==, so we can compare strings with numbers
					changedProperties.push( prop );

					// make the computed style explicit, so we can animate where
					// e.g. height='auto'
					this$1.node.style[ prefix$1( prop ) ] = current;
				}
			}

			// If we're not actually changing anything, the transitionend event
			// will never fire! So we complete early
			if ( !changedProperties.length ) {
				fulfil();
				return;
			}

			createTransitions$1( this$1, to, options, changedProperties, fulfil );
		});
	};

	Transition.prototype.bind = function bind () {
		var this$1 = this;

			var options = this.options;
		var type = options.template && options.template.v;
		if ( type ) {
			if ( type === 't0' || type === 't1' ) this.element._introTransition = this;
			if ( type === 't0' || type === 't2' ) this.element._outroTransition = this;
			this.eventName = names[ type ];
		}

		var ractive = this.owner.ractive;

		if ( options.name ) {
			this.name = options.name;
		} else {
			var name = options.template.f;
			if ( typeof name.n === 'string' ) name = name.n;

			if ( typeof name !== 'string' ) {
				var fragment = new Fragment({
					owner: this.owner,
					template: name.n
				}).bind(); // TODO need a way to capture values without bind()

				name = fragment.toString();
				fragment.unbind();

				if ( name === '' ) {
					// empty string okay, just no transition
					return;
				}
			}

			this.name = name;
		}

		if ( options.params ) {
			this.params = options.params;
		} else {
			if ( options.template.f.a && !options.template.f.a.s ) {
				this.params = options.template.f.a;
			}

			else if ( options.template.f.d ) {
				// TODO is there a way to interpret dynamic arguments without all the
				// 'dependency thrashing'?
				var fragment$1 = new Fragment({
					owner: this.owner,
					template: options.template.f.d
				}).bind();

				this.params = fragment$1.getArgsList();
				fragment$1.unbind();
			}
		}

		if ( typeof this.name === 'function' ) {
			this._fn = this.name;
			this.name = this._fn.name;
		} else {
			this._fn = findInViewHierarchy( 'transitions', ractive, this.name );
		}

		if ( !this._fn ) {
			warnOnceIfDebug( missingPlugin( this.name, 'transition' ), { ractive: ractive });
		}

		// TODO: dry up after deprecation is done
		if ( options.template && this.template.f.a && this.template.f.a.s ) {
			this.resolvers = [];
			this.models = this.template.f.a.r.map( function ( ref, i ) {
				var resolver;
				var model = resolveReference( this$1.parentFragment, ref );
				if ( !model ) {
					resolver = this$1.parentFragment.resolve( ref, function ( model ) {
						this$1.models[i] = model;
						removeFromArray( this$1.resolvers, resolver );
						model.register( this$1 );
					});

					this$1.resolvers.push( resolver );
				} else model.register( this$1 );

				return model;
			});
			this.argsFn = getFunction( this.template.f.a.s, this.template.f.a.r.length );
		}
	};

	Transition.prototype.destroyed = function destroyed () {};

	Transition.prototype.getStyle = function getStyle ( props ) {
		var computedStyle = getComputedStyle( this.node );

		if ( typeof props === 'string' ) {
			var value = computedStyle[ prefix$1( props ) ];
			return value === '0px' ? 0 : value;
		}

		if ( !isArray( props ) ) {
			throw new Error( 'Transition$getStyle must be passed a string, or an array of strings representing CSS properties' );
		}

		var styles = {};

		var i = props.length;
		while ( i-- ) {
			var prop = props[i];
			var value$1 = computedStyle[ prefix$1( prop ) ];

			if ( value$1 === '0px' ) value$1 = 0;
			styles[ prop ] = value$1;
		}

		return styles;
	};

	Transition.prototype.handleChange = function handleChange () {};

	Transition.prototype.processParams = function processParams ( params, defaults ) {
		if ( typeof params === 'number' ) {
			params = { duration: params };
		}

		else if ( typeof params === 'string' ) {
			if ( params === 'slow' ) {
				params = { duration: 600 };
			} else if ( params === 'fast' ) {
				params = { duration: 200 };
			} else {
				params = { duration: 400 };
			}
		} else if ( !params ) {
			params = {};
		}

		return extendObj( {}, defaults, params );
	};

	Transition.prototype.rebinding = function rebinding ( next, previous ) {
		var idx = this.models.indexOf( previous );
		if ( !~idx ) return;

		next = rebindMatch( this.template.f.a.r[ idx ], next, previous );
		if ( next === previous ) return;

		previous.unregister( this );
		this.models.splice( idx, 1, next );
		if ( next ) next.addShuffleRegister( this, 'mark' );
	};

	Transition.prototype.registerCompleteHandler = function registerCompleteHandler ( fn ) {
		addToArray( this.onComplete, fn );
	};

	Transition.prototype.render = function render () {};

	Transition.prototype.setStyle = function setStyle ( style, value ) {
		if ( typeof style === 'string' ) {
			this.node.style[ prefix$1( style ) ] = value;
		}

		else {
			var prop;
			for ( prop in style ) {
				if ( style.hasOwnProperty( prop ) ) {
					this.node.style[ prefix$1( prop ) ] = style[ prop ];
				}
			}
		}

		return this;
	};

	Transition.prototype.start = function start () {
		var this$1 = this;

			var node = this.node = this.element.node;
		var originalStyle = node.getAttribute( 'style' );

		var completed;
		var args = this.params;

		// create t.complete() - we don't want this on the prototype,
		// because we don't want `this` silliness when passing it as
		// an argument
		this.complete = function ( noReset ) {
			if ( completed ) {
				return;
			}

			this$1.onComplete.forEach( function ( fn ) { return fn(); } );
			if ( !noReset && this$1.isIntro ) {
				resetStyle( node, originalStyle);
			}

			this$1._manager.remove( this$1 );

			completed = true;
		};

		// If the transition function doesn't exist, abort
		if ( !this._fn ) {
			this.complete();
			return;
		}

		// get expression args if supplied
		if ( this.argsFn ) {
			var values = this.models.map( function ( model ) {
				if ( !model ) return undefined;

				return model.get();
			});
			args = this.argsFn.apply( this.ractive, values );
		}

		var promise = this._fn.apply( this.ractive, [ this ].concat( args ) );
		if ( promise ) promise.then( this.complete );
	};

	Transition.prototype.toString = function toString () { return ''; };

	Transition.prototype.unbind = function unbind$1 () {
		if ( this.resolvers ) this.resolvers.forEach( unbind );
		if ( !this.element.attributes.unbinding ) {
			var type = this.options && this.options.template && this.options.template.v;
			if ( type === 't0' || type === 't1' ) this.element._introTransition = null;
			if ( type === 't0' || type === 't2' ) this.element._outroTransition = null;
		}
	};

	Transition.prototype.unregisterCompleteHandler = function unregisterCompleteHandler ( fn ) {
		removeFromArray( this.onComplete, fn );
	};

	Transition.prototype.unrender = function unrender () {};

	Transition.prototype.update = function update () {};

	var elementCache = {};

	var ieBug;
	var ieBlacklist;

	try {
		createElement( 'table' ).innerHTML = 'foo';
	} catch ( err ) {
		ieBug = true;

		ieBlacklist = {
			TABLE:  [ '<table class="x">', '</table>' ],
			THEAD:  [ '<table><thead class="x">', '</thead></table>' ],
			TBODY:  [ '<table><tbody class="x">', '</tbody></table>' ],
			TR:     [ '<table><tr class="x">', '</tr></table>' ],
			SELECT: [ '<select class="x">', '</select>' ]
		};
	}

	function insertHtml ( html, node, docFrag ) {
		var nodes = [];

		// render 0 and false
		if ( html == null || html === '' ) return nodes;

		var container;
		var wrapper;
		var selectedOption;

		if ( ieBug && ( wrapper = ieBlacklist[ node.tagName ] ) ) {
			container = element( 'DIV' );
			container.innerHTML = wrapper[0] + html + wrapper[1];
			container = container.querySelector( '.x' );

			if ( container.tagName === 'SELECT' ) {
				selectedOption = container.options[ container.selectedIndex ];
			}
		}

		else if ( node.namespaceURI === svg$1 ) {
			container = element( 'DIV' );
			container.innerHTML = '<svg class="x">' + html + '</svg>';
			container = container.querySelector( '.x' );
		}

		else if ( node.tagName === 'TEXTAREA' ) {
			container = createElement( 'div' );

			if ( typeof container.textContent !== 'undefined' ) {
				container.textContent = html;
			} else {
				container.innerHTML = html;
			}
		}

		else {
			container = element( node.tagName );
			container.innerHTML = html;

			if ( container.tagName === 'SELECT' ) {
				selectedOption = container.options[ container.selectedIndex ];
			}
		}

		var child;
		while ( child = container.firstChild ) {
			nodes.push( child );
			docFrag.appendChild( child );
		}

		// This is really annoying. Extracting <option> nodes from the
		// temporary container <select> causes the remaining ones to
		// become selected. So now we have to deselect them. IE8, you
		// amaze me. You really do
		// ...and now Chrome too
		var i;
		if ( node.tagName === 'SELECT' ) {
			i = nodes.length;
			while ( i-- ) {
				if ( nodes[i] !== selectedOption ) {
					nodes[i].selected = false;
				}
			}
		}

		return nodes;
	}

	function element ( tagName ) {
		return elementCache[ tagName ] || ( elementCache[ tagName ] = createElement( tagName ) );
	}

	var Triple = (function (Mustache) {
		function Triple ( options ) {
			Mustache.call( this, options );
		}

		Triple.prototype = Object.create( Mustache && Mustache.prototype );
		Triple.prototype.constructor = Triple;

		Triple.prototype.detach = function detach () {
			var docFrag = createDocumentFragment();
			this.nodes.forEach( function ( node ) { return docFrag.appendChild( node ); } );
			return docFrag;
		};

		Triple.prototype.find = function find ( selector ) {
			var this$1 = this;

			var len = this.nodes.length;
			var i;

			for ( i = 0; i < len; i += 1 ) {
				var node = this$1.nodes[i];

				if ( node.nodeType !== 1 ) continue;

				if ( matches( node, selector ) ) return node;

				var queryResult = node.querySelector( selector );
				if ( queryResult ) return queryResult;
			}

			return null;
		};

		Triple.prototype.findAll = function findAll ( selector, query ) {
			var this$1 = this;

			var len = this.nodes.length;
			var i;

			for ( i = 0; i < len; i += 1 ) {
				var node = this$1.nodes[i];

				if ( node.nodeType !== 1 ) continue;

				if ( query.test( node ) ) query.add( node );

				var queryAllResult = node.querySelectorAll( selector );
				if ( queryAllResult ) {
					var numNodes = queryAllResult.length;
					var j;

					for ( j = 0; j < numNodes; j += 1 ) {
						query.add( queryAllResult[j] );
					}
				}
			}
		};

		Triple.prototype.findComponent = function findComponent () {
			return null;
		};

		Triple.prototype.firstNode = function firstNode () {
			return this.nodes[0];
		};

		Triple.prototype.render = function render ( target ) {
			var html = this.model ? this.model.get() : '';
			this.nodes = insertHtml( html, this.parentFragment.findParentNode(), target );
			this.rendered = true;
		};

		Triple.prototype.toString = function toString () {
			var value = this.model && this.model.get();
			value = value != null ? '' + value : '';

			return inAttribute() ? decodeCharacterReferences( value ) : value;
		};

		Triple.prototype.unrender = function unrender () {
			if ( this.nodes ) this.nodes.forEach( function ( node ) { return detachNode( node ); } );
			this.rendered = false;
		};

		Triple.prototype.update = function update () {
			if ( this.rendered && this.dirty ) {
				this.dirty = false;

				this.unrender();
				var docFrag = createDocumentFragment();
				this.render( docFrag );

				var parentNode = this.parentFragment.findParentNode();
				var anchor = this.parentFragment.findNextNode( this );

				parentNode.insertBefore( docFrag, anchor );
			} else {
				// make sure to reset the dirty flag even if not rendered
				this.dirty = false;
			}
		};

		return Triple;
	}(Mustache));

	var Yielder = (function (Item) {
		function Yielder ( options ) {
			Item.call( this, options );

			this.container = options.parentFragment.ractive;
			this.component = this.container.component;

			this.containerFragment = options.parentFragment;
			this.parentFragment = this.component.parentFragment;

			// {{yield}} is equivalent to {{yield content}}
			this.name = options.template.n || '';
		}

		Yielder.prototype = Object.create( Item && Item.prototype );
		Yielder.prototype.constructor = Yielder;

		Yielder.prototype.bind = function bind () {
			var name = this.name;

			( this.component.yielders[ name ] || ( this.component.yielders[ name ] = [] ) ).push( this );

			// TODO don't parse here
			var template = this.container._inlinePartials[ name || 'content' ];

			if ( typeof template === 'string' ) {
				template = parse( template ).t;
			}

			if ( !template ) {
				warnIfDebug( ("Could not find template for partial \"" + name + "\""), { ractive: this.ractive });
				template = [];
			}

			this.fragment = new Fragment({
				owner: this,
				ractive: this.container.parent,
				template: template
			}).bind();
		};

		Yielder.prototype.bubble = function bubble () {
			if ( !this.dirty ) {
				this.containerFragment.bubble();
				this.dirty = true;
			}
		};

		Yielder.prototype.detach = function detach () {
			return this.fragment.detach();
		};

		Yielder.prototype.find = function find ( selector ) {
			return this.fragment.find( selector );
		};

		Yielder.prototype.findAll = function findAll ( selector, queryResult ) {
			this.fragment.findAll( selector, queryResult );
		};

		Yielder.prototype.findComponent = function findComponent ( name ) {
			return this.fragment.findComponent( name );
		};

		Yielder.prototype.findAllComponents = function findAllComponents ( name, queryResult ) {
			this.fragment.findAllComponents( name, queryResult );
		};

		Yielder.prototype.findNextNode = function findNextNode() {
			return this.containerFragment.findNextNode( this );
		};

		Yielder.prototype.firstNode = function firstNode ( skipParent ) {
			return this.fragment.firstNode( skipParent );
		};

		Yielder.prototype.render = function render ( target, occupants ) {
			return this.fragment.render( target, occupants );
		};

		Yielder.prototype.setTemplate = function setTemplate ( name ) {
			var template = this.parentFragment.ractive.partials[ name ];

			if ( typeof template === 'string' ) {
				template = parse( template ).t;
			}

			this.partialTemplate = template || []; // TODO warn on missing partial
		};

		Yielder.prototype.toString = function toString ( escape ) {
			return this.fragment.toString( escape );
		};

		Yielder.prototype.unbind = function unbind () {
			this.fragment.unbind();
			removeFromArray( this.component.yielders[ this.name ], this );
		};

		Yielder.prototype.unrender = function unrender ( shouldDestroy ) {
			this.fragment.unrender( shouldDestroy );
		};

		Yielder.prototype.update = function update () {
			this.dirty = false;
			this.fragment.update();
		};

		return Yielder;
	}(Item));

	// finds the component constructor in the registry or view hierarchy registries
	function getComponentConstructor ( ractive, name ) {
		var instance = findInstance( 'components', ractive, name );
		var Component;

		if ( instance ) {
			Component = instance.components[ name ];

			// best test we have for not Ractive.extend
			if ( !Component._Parent ) {
				// function option, execute and store for reset
				var fn = Component.bind( instance );
				fn.isOwner = instance.components.hasOwnProperty( name );
				Component = fn();

				if ( !Component ) {
					warnIfDebug( noRegistryFunctionReturn, name, 'component', 'component', { ractive: ractive });
					return;
				}

				if ( typeof Component === 'string' ) {
					// allow string lookup
					Component = getComponentConstructor( ractive, Component );
				}

				Component._fn = fn;
				instance.components[ name ] = Component;
			}
		}

		return Component;
	}

	var constructors = {};
	constructors[ ALIAS ] = Alias;
	constructors[ DOCTYPE ] = Doctype;
	constructors[ INTERPOLATOR ] = Interpolator;
	constructors[ PARTIAL ] = Partial;
	constructors[ SECTION ] = Section;
	constructors[ TRIPLE ] = Triple;
	constructors[ YIELDER ] = Yielder;

	constructors[ ATTRIBUTE ] = Attribute;
	constructors[ BINDING_FLAG ] = BindingFlag;
	constructors[ DECORATOR ] = Decorator;
	constructors[ EVENT ] = EventDirective;
	constructors[ TRANSITION ] = Transition;

	var specialElements = {
		doctype: Doctype,
		form: Form,
		input: Input,
		option: Option,
		select: Select,
		textarea: Textarea
	};

	function createItem ( options ) {
		if ( typeof options.template === 'string' ) {
			return new Text( options );
		}

		if ( options.template.t === ELEMENT ) {
			// could be component or element
			var ComponentConstructor = getComponentConstructor( options.parentFragment.ractive, options.template.e );
			if ( ComponentConstructor ) {
				return new Component( options, ComponentConstructor );
			}

			var tagName = options.template.e.toLowerCase();

			var ElementConstructor = specialElements[ tagName ] || Element;
			return new ElementConstructor( options );
		}

		var Item;

		// component mappings are a special case of attribute
		if ( options.template.t === ATTRIBUTE ) {
			var el = options.owner;
			if ( !el || ( el.type !== COMPONENT && el.type !== ELEMENT ) ) {
				el = findElement( options.parentFragment );
			}
			options.element = el;

			Item = el.type === COMPONENT ? Mapping : Attribute;
		} else {
			Item = constructors[ options.template.t ];
		}

		if ( !Item ) throw new Error( ("Unrecognised item type " + (options.template.t)) );

		return new Item( options );
	}

	// TODO all this code needs to die
	function processItems ( items, values, guid, counter ) {
		if ( counter === void 0 ) counter = 0;

		return items.map( function ( item ) {
			if ( item.type === TEXT ) {
				return item.template;
			}

			if ( item.fragment ) {
				if ( item.fragment.iterations ) {
					return item.fragment.iterations.map( function ( fragment ) {
						return processItems( fragment.items, values, guid, counter );
					}).join( '' );
				} else {
					return processItems( item.fragment.items, values, guid, counter );
				}
			}

			var placeholderId = "" + guid + "-" + (counter++);
			var model = item.model || item.newModel;

			values[ placeholderId ] = model ?
				model.wrapper ?
					model.wrapperValue :
					model.get() :
				undefined;

			return '${' + placeholderId + '}';
		}).join( '' );
	}

	function unrenderAndDestroy$1 ( item ) {
		item.unrender( true );
	}

	var Fragment = function Fragment ( options ) {
		this.owner = options.owner; // The item that owns this fragment - an element, section, partial, or attribute

		this.isRoot = !options.owner.parentFragment;
		this.parent = this.isRoot ? null : this.owner.parentFragment;
		this.ractive = options.ractive || ( this.isRoot ? options.owner : this.parent.ractive );

		this.componentParent = ( this.isRoot && this.ractive.component ) ? this.ractive.component.parentFragment : null;

		this.context = null;
		this.rendered = false;

		// encapsulated styles should be inherited until they get applied by an element
		this.cssIds = 'cssIds' in options ? options.cssIds : ( this.parent ? this.parent.cssIds : null );

		this.resolvers = [];

		this.dirty = false;
		this.dirtyArgs = this.dirtyValue = true; // TODO getArgsList is nonsense - should deprecate legacy directives style

		this.template = options.template || [];
		this.createItems();
	};

	Fragment.prototype.bind = function bind$1$$ ( context ) {
		this.context = context;
		this.items.forEach( bind$1 );
		this.bound = true;

		// in rare cases, a forced resolution (or similar) will cause the
		// fragment to be dirty before it's even finished binding. In those
		// cases we update immediately
		if ( this.dirty ) this.update();

		return this;
	};

	Fragment.prototype.bubble = function bubble () {
		this.dirtyArgs = this.dirtyValue = true;

		if ( !this.dirty ) {
			this.dirty = true;

			if ( this.isRoot ) { // TODO encapsulate 'is component root, but not overall root' check?
				if ( this.ractive.component ) {
					this.ractive.component.bubble();
				} else if ( this.bound ) {
					runloop.addFragment( this );
				}
			} else {
				this.owner.bubble();
			}
		}
	};

	Fragment.prototype.createItems = function createItems () {
		// this is a hot code path
		var this$1 = this;

			var max = this.template.length;
		this.items = [];
		for ( var i = 0; i < max; i++ ) {
			this$1.items[i] = createItem({ parentFragment: this$1, template: this$1.template[i], index: i });
		}
	};

	Fragment.prototype.destroyed = function destroyed () {
		this.items.forEach( function ( i ) { return i.destroyed(); } );
	};

	Fragment.prototype.detach = function detach () {
		var docFrag = createDocumentFragment();
		this.items.forEach( function ( item ) { return docFrag.appendChild( item.detach() ); } );
		return docFrag;
	};

	Fragment.prototype.find = function find ( selector ) {
		var this$1 = this;

			var len = this.items.length;
		var i;

		for ( i = 0; i < len; i += 1 ) {
			var found = this$1.items[i].find( selector );
			if ( found ) return found;
		}
	};

	Fragment.prototype.findAll = function findAll ( selector, query ) {
		var this$1 = this;

			if ( this.items ) {
			var len = this.items.length;
			var i;

			for ( i = 0; i < len; i += 1 ) {
				var item = this$1.items[i];

				if ( item.findAll ) {
					item.findAll( selector, query );
				}
			}
		}

		return query;
	};

	Fragment.prototype.findComponent = function findComponent ( name ) {
		var this$1 = this;

			var len = this.items.length;
		var i;

		for ( i = 0; i < len; i += 1 ) {
			var found = this$1.items[i].findComponent( name );
			if ( found ) return found;
		}
	};

	Fragment.prototype.findAllComponents = function findAllComponents ( name, query ) {
		var this$1 = this;

			if ( this.items ) {
			var len = this.items.length;
			var i;

			for ( i = 0; i < len; i += 1 ) {
				var item = this$1.items[i];

				if ( item.findAllComponents ) {
					item.findAllComponents( name, query );
				}
			}
		}

		return query;
	};

	Fragment.prototype.findContext = function findContext () {
		var fragment = this;
		while ( fragment && !fragment.context ) fragment = fragment.parent;
		if ( !fragment ) return this.ractive.viewmodel;
		else return fragment.context;
	};

	Fragment.prototype.findNextNode = function findNextNode ( item ) {
		// search for the next node going forward
		var this$1 = this;

			if ( item ) {
			for ( var i = item.index + 1; i < this$1.items.length; i++ ) {
				if ( !this$1.items[ i ] ) continue;

				var node = this$1.items[ i ].firstNode( true );
				if ( node ) return node;
			}
		}

		// if this is the root fragment, and there are no more items,
		// it means we're at the end...
		if ( this.isRoot ) {
			if ( this.ractive.component ) {
				return this.ractive.component.parentFragment.findNextNode( this.ractive.component );
			}

			// TODO possible edge case with other content
			// appended to this.ractive.el?
			return null;
		}

		if ( this.parent ) return this.owner.findNextNode( this ); // the argument is in case the parent is a RepeatedFragment
	};

	Fragment.prototype.findParentNode = function findParentNode () {
		var fragment = this;

		do {
			if ( fragment.owner.type === ELEMENT ) {
				return fragment.owner.node;
			}

			if ( fragment.isRoot && !fragment.ractive.component ) { // TODO encapsulate check
				return fragment.ractive.el;
			}

			if ( fragment.owner.type === YIELDER ) {
				fragment = fragment.owner.containerFragment;
			} else {
				fragment = fragment.componentParent || fragment.parent; // TODO ugh
			}
		} while ( fragment );

		throw new Error( 'Could not find parent node' ); // TODO link to issue tracker
	};

	Fragment.prototype.findRepeatingFragment = function findRepeatingFragment () {
		var fragment = this;
		// TODO better check than fragment.parent.iterations
		while ( ( fragment.parent || fragment.componentParent ) && !fragment.isIteration ) {
			fragment = fragment.parent || fragment.componentParent;
		}

		return fragment;
	};

	Fragment.prototype.firstNode = function firstNode ( skipParent ) {
		var this$1 = this;

			var node;
		for ( var i = 0; i < this$1.items.length; i++ ) {
			node = this$1.items[i].firstNode( true );

			if ( node ) {
				return node;
			}
		}

		if ( skipParent ) return null;

		return this.parent.findNextNode( this.owner );
	};

	// TODO ideally, this would be deprecated in favour of an
	// expression-like approach
	Fragment.prototype.getArgsList = function getArgsList () {
		if ( this.dirtyArgs ) {
			var values = {};
			var source = processItems( this.items, values, this.ractive._guid );
			var parsed = parseJSON( '[' + source + ']', values );

			this.argsList = parsed ?
				parsed.value :
				[ this.toString() ];

			this.dirtyArgs = false;
		}

		return this.argsList;
	};

	Fragment.prototype.rebinding = function rebinding ( next ) {
		this.context = next;
	};

	Fragment.prototype.render = function render ( target, occupants ) {
		if ( this.rendered ) throw new Error( 'Fragment is already rendered!' );
		this.rendered = true;

		this.items.forEach( function ( item ) { return item.render( target, occupants ); } );
	};

	Fragment.prototype.resetTemplate = function resetTemplate ( template ) {
		var wasBound = this.bound;
		var wasRendered = this.rendered;

		// TODO ensure transitions are disabled globally during reset

		if ( wasBound ) {
			if ( wasRendered ) this.unrender( true );
			this.unbind();
		}

		this.template = template;
		this.createItems();

		if ( wasBound ) {
			this.bind( this.context );

			if ( wasRendered ) {
				var parentNode = this.findParentNode();
				var anchor = this.findNextNode();

				if ( anchor ) {
					var docFrag = createDocumentFragment();
					this.render( docFrag );
					parentNode.insertBefore( docFrag, anchor );
				} else {
					this.render( parentNode );
				}
			}
		}
	};

	Fragment.prototype.resolve = function resolve ( template, callback ) {
		if ( !this.context && this.parent.resolve ) {
			return this.parent.resolve( template, callback );
		}

		var resolver = new ReferenceResolver( this, template, callback );
		this.resolvers.push( resolver );

		return resolver; // so we can e.g. force resolution
	};

	Fragment.prototype.shuffled = function shuffled () {
		this.items.forEach( function ( i ) { return i.shuffled(); } );
	};

	Fragment.prototype.toHtml = function toHtml () {
		return this.toString();
	};

	Fragment.prototype.toString = function toString$1$$ ( escape ) {
		return this.items.map( escape ? toEscapedString : toString$1 ).join( '' );
	};

	Fragment.prototype.unbind = function unbind$1 () {
		this.items.forEach( unbind );
		this.resolvers.forEach( unbind );
		this.bound = false;

		return this;
	};

	Fragment.prototype.unrender = function unrender$1 ( shouldDestroy ) {
		this.items.forEach( shouldDestroy ? unrenderAndDestroy$1 : unrender );
		this.rendered = false;
	};

	Fragment.prototype.update = function update$1 () {
		if ( this.dirty ) {
			if ( !this.updating ) {
				this.dirty = false;
				this.updating = true;
				this.items.forEach( update );
				this.updating = false;
			} else if ( this.isRoot ) {
				runloop.addFragmentToRoot( this );
			}
		}
	};

	Fragment.prototype.valueOf = function valueOf () {
		if ( this.items.length === 1 ) {
			return this.items[0].valueOf();
		}

		if ( this.dirtyValue ) {
			var values = {};
			var source = processItems( this.items, values, this.ractive._guid );
			var parsed = parseJSON( source, values );

			this.value = parsed ?
				parsed.value :
				this.toString();

			this.dirtyValue = false;
		}

		return this.value;
	};

	// TODO should resetTemplate be asynchronous? i.e. should it be a case
	// of outro, update template, intro? I reckon probably not, since that
	// could be achieved with unrender-resetTemplate-render. Also, it should
	// conceptually be similar to resetPartial, which couldn't be async

	function Ractive$resetTemplate ( template ) {
		templateConfigurator.init( null, this, { template: template });

		var transitionsEnabled = this.transitionsEnabled;
		this.transitionsEnabled = false;

		// Is this is a component, we need to set the `shouldDestroy`
		// flag, otherwise it will assume by default that a parent node
		// will be detached, and therefore it doesn't need to bother
		// detaching its own nodes
		var component = this.component;
		if ( component ) component.shouldDestroy = true;
		this.unrender();
		if ( component ) component.shouldDestroy = false;

		// remove existing fragment and create new one
		this.fragment.unbind().unrender( true );

		this.fragment = new Fragment({
			template: this.template,
			root: this,
			owner: this
		});

		var docFrag = createDocumentFragment();
		this.fragment.bind( this.viewmodel ).render( docFrag );

		// if this is a component, its el may not be valid, so find a
		// target based on the component container
		if ( component ) {
			this.fragment.findParentNode().insertBefore( docFrag, component.findNextNode() );
		} else {
			this.el.insertBefore( docFrag, this.anchor );
		}

		this.transitionsEnabled = transitionsEnabled;
	}

	var reverse$1 = makeArrayMethod( 'reverse' ).path;

	function Ractive$set ( keypath, value ) {
		var ractive = this;

		return set( ractive, build( ractive, keypath, value ) );
	}

	var shift$1 = makeArrayMethod( 'shift' ).path;

	var sort$1 = makeArrayMethod( 'sort' ).path;

	var splice$1 = makeArrayMethod( 'splice' ).path;

	function Ractive$subtract ( keypath, d ) {
		return add( this, keypath, ( d === undefined ? -1 : -d ) );
	}

	var teardownHook$1 = new Hook( 'teardown' );

	// Teardown. This goes through the root fragment and all its children, removing observers
	// and generally cleaning up after itself

	function Ractive$teardown () {
		if ( this.torndown ) {
			warnIfDebug( 'ractive.teardown() was called on a Ractive instance that was already torn down' );
			return Promise$1.resolve();
		}

		this.torndown = true;
		this.fragment.unbind();
		this.viewmodel.teardown();

		this._observers.forEach( cancel );

		if ( this.fragment.rendered && this.el.__ractive_instances__ ) {
			removeFromArray( this.el.__ractive_instances__, this );
		}

		this.shouldDestroy = true;
		var promise = ( this.fragment.rendered ? this.unrender() : Promise$1.resolve() );

		teardownHook$1.fire( this );

		return promise;
	}

	function Ractive$toggle ( keypath ) {
		if ( typeof keypath !== 'string' ) {
			throw new TypeError( badArguments );
		}

		return set( this, gather( this, keypath ).map( function ( m ) { return [ m, !m.get() ]; } ) );
	}

	function Ractive$toCSS() {
		var cssIds = [ this.cssId ].concat( this.findAllComponents().map( function ( c ) { return c.cssId; } ) );
		var uniqueCssIds = Object.keys(cssIds.reduce( function ( ids, id ) { return (ids[id] = true, ids); }, {}));
		return getCSS( uniqueCssIds );
	}

	function Ractive$toHTML () {
		return this.fragment.toString( true );
	}

	function toText () {
		return this.fragment.toString( false );
	}

	function Ractive$transition ( name, node, params ) {

		if ( node instanceof HTMLElement ) {
			// good to go
		}
		else if ( isObject( node ) ) {
			// omitted, use event node
			params = node;
		}

		// if we allow query selector, then it won't work
		// simple params like "fast"

		// else if ( typeof node === 'string' ) {
		// 	// query selector
		// 	node = this.find( node )
		// }

		node = node || this.event.node;

		if ( !node || !node._ractive ) {
			fatal( ("No node was supplied for transition " + name) );
		}

		params = params || {};
		var owner = node._ractive.proxy;
		var transition = new Transition({ owner: owner, parentFragment: owner.parentFragment, name: name, params: params });
		transition.bind();

		var promise = runloop.start( this, true );
		runloop.registerTransition( transition );
		runloop.end();

		promise.then( function () { return transition.unbind(); } );
		return promise;
	}

	function unlink$1( here ) {
		var promise = runloop.start();
		this.viewmodel.joinAll( splitKeypathI( here ), { lastLink: false } ).unlink();
		runloop.end();
		return promise;
	}

	var unrenderHook$1 = new Hook( 'unrender' );

	function Ractive$unrender () {
		if ( !this.fragment.rendered ) {
			warnIfDebug( 'ractive.unrender() was called on a Ractive instance that was not rendered' );
			return Promise$1.resolve();
		}

		var promise = runloop.start( this, true );

		// If this is a component, and the component isn't marked for destruction,
		// don't detach nodes from the DOM unnecessarily
		var shouldDestroy = !this.component || this.component.shouldDestroy || this.shouldDestroy;
		this.fragment.unrender( shouldDestroy );

		removeFromArray( this.el.__ractive_instances__, this );

		unrenderHook$1.fire( this );

		runloop.end();
		return promise;
	}

	var unshift$1 = makeArrayMethod( 'unshift' ).path;

	function Ractive$updateModel ( keypath, cascade ) {
		var promise = runloop.start( this, true );

		if ( !keypath ) {
			this.viewmodel.updateFromBindings( true );
		} else {
			this.viewmodel.joinAll( splitKeypathI( keypath ) ).updateFromBindings( cascade !== false );
		}

		runloop.end();

		return promise;
	}

	var proto = {
		add: Ractive$add,
		animate: Ractive$animate,
		detach: Ractive$detach,
		find: Ractive$find,
		findAll: Ractive$findAll,
		findAllComponents: Ractive$findAllComponents,
		findComponent: Ractive$findComponent,
		findContainer: Ractive$findContainer,
		findParent: Ractive$findParent,
		fire: Ractive$fire,
		get: Ractive$get,
		getNodeInfo: getNodeInfo,
		insert: Ractive$insert,
		link: link$1,
		merge: thisRactive$merge,
		observe: observe,
		observeList: observeList,
		observeOnce: observeOnce,
		// TODO reinstate these
		// observeListOnce,
		off: Ractive$off,
		on: Ractive$on,
		once: Ractive$once,
		pop: pop$1,
		push: push$1,
		render: Ractive$render,
		reset: Ractive$reset,
		resetPartial: resetPartial,
		resetTemplate: Ractive$resetTemplate,
		reverse: reverse$1,
		set: Ractive$set,
		shift: shift$1,
		sort: sort$1,
		splice: splice$1,
		subtract: Ractive$subtract,
		teardown: Ractive$teardown,
		toggle: Ractive$toggle,
		toCSS: Ractive$toCSS,
		toCss: Ractive$toCSS,
		toHTML: Ractive$toHTML,
		toHtml: Ractive$toHTML,
		toText: toText,
		transition: Ractive$transition,
		unlink: unlink$1,
		unrender: Ractive$unrender,
		unshift: unshift$1,
		update: Ractive$update,
		updateModel: Ractive$updateModel
	};

	function wrap$1 ( method, superMethod, force ) {

		if ( force || needsSuper( method, superMethod ) )  {

			return function () {

				var hasSuper = ( '_super' in this ), _super = this._super, result;

				this._super = superMethod;

				result = method.apply( this, arguments );

				if ( hasSuper ) {
					this._super = _super;
				}

				return result;
			};
		}

		else {
			return method;
		}
	}

	function needsSuper ( method, superMethod ) {
		return typeof superMethod === 'function' && /_super/.test( method );
	}

	function unwrap ( Child ) {
		var options = {};

		while ( Child ) {
			addRegistries( Child, options );
			addOtherOptions( Child, options );

			if ( Child._Parent !== Ractive ) {
				Child = Child._Parent;
			} else {
				Child = false;
			}
		}

		return options;
	}

	function addRegistries ( Child, options ) {
		registries.forEach( function ( r ) {
			addRegistry(
				r.useDefaults ? Child.prototype : Child,
				options, r.name );
		});
	}

	function addRegistry ( target, options, name ) {
		var registry, keys = Object.keys( target[ name ] );

		if ( !keys.length ) { return; }

		if ( !( registry = options[ name ] ) ) {
			registry = options[ name ] = {};
		}

		keys
			.filter( function ( key ) { return !( key in registry ); } )
			.forEach( function ( key ) { return registry[ key ] = target[ name ][ key ]; } );
	}

	function addOtherOptions ( Child, options ) {
		Object.keys( Child.prototype ).forEach( function ( key ) {
			if ( key === 'computed' ) { return; }

			var value = Child.prototype[ key ];

			if ( !( key in options ) ) {
				options[ key ] = value._method ? value._method : value;
			}

			// is it a wrapped function?
			else if ( typeof options[ key ] === 'function'
					&& typeof value === 'function'
					&& options[ key ]._method ) {

				var result, needsSuper = value._method;

				if ( needsSuper ) { value = value._method; }

				// rewrap bound directly to parent fn
				result = wrap$1( options[ key ]._method, value );

				if ( needsSuper ) { result._method = result; }

				options[ key ] = result;
			}
		});
	}

	function extend () {
		var options = [], len = arguments.length;
		while ( len-- ) options[ len ] = arguments[ len ];

		if( !options.length ) {
			return extendOne( this );
		} else {
			return options.reduce( extendOne, this );
		}
	}

	function extendOne ( Parent, options ) {
		if ( options === void 0 ) options = {};

		var Child, proto;

		// if we're extending with another Ractive instance...
		//
		//   var Human = Ractive.extend(...), Spider = Ractive.extend(...);
		//   var Spiderman = Human.extend( Spider );
		//
		// ...inherit prototype methods and default options as well
		if ( options.prototype instanceof Ractive ) {
			options = unwrap( options );
		}

		Child = function ( options ) {
			if ( !( this instanceof Child ) ) return new Child( options );

			construct( this, options || {} );
			initialise( this, options || {}, {} );
		};

		proto = create( Parent.prototype );
		proto.constructor = Child;

		// Static properties
		defineProperties( Child, {
			// alias prototype as defaults
			defaults: { value: proto },

			// extendable
			extend: { value: extend, writable: true, configurable: true },

			// Parent - for IE8, can't use Object.getPrototypeOf
			_Parent: { value: Parent }
		});

		// extend configuration
		config.extend( Parent, proto, options );

		dataConfigurator.extend( Parent, proto, options );

		if ( options.computed ) {
			proto.computed = extendObj( create( Parent.prototype.computed ), options.computed );
		}

		Child.prototype = proto;

		return Child;
	}

	function joinKeys () {
		var keys = [], len = arguments.length;
		while ( len-- ) keys[ len ] = arguments[ len ];

		return keys.map( escapeKey ).join( '.' );
	}

	function splitKeypath ( keypath ) {
		return splitKeypathI( keypath ).map( unescapeKey );
	}

	// Ractive.js makes liberal use of things like Array.prototype.indexOf. In
	// older browsers, these are made available via a shim - here, we do a quick
	// pre-flight check to make sure that either a) we're not in a shit browser,
	// or b) we're using a Ractive-legacy.js build
	var FUNCTION = 'function';

	if (
		typeof Date.now !== FUNCTION                 ||
		typeof String.prototype.trim !== FUNCTION    ||
		typeof Object.keys !== FUNCTION              ||
		typeof Array.prototype.indexOf !== FUNCTION  ||
		typeof Array.prototype.forEach !== FUNCTION  ||
		typeof Array.prototype.map !== FUNCTION      ||
		typeof Array.prototype.filter !== FUNCTION   ||
		( win && typeof win.addEventListener !== FUNCTION )
	) {
		throw new Error( 'It looks like you\'re attempting to use Ractive.js in an older browser. You\'ll need to use one of the \'legacy builds\' in order to continue - see http://docs.ractivejs.org/latest/legacy-builds for more information.' );
	}

	function Ractive ( options ) {
		if ( !( this instanceof Ractive ) ) return new Ractive( options );

		construct( this, options || {} );
		initialise( this, options || {}, {} );
	}

	extendObj( Ractive.prototype, proto, defaults );
	Ractive.prototype.constructor = Ractive;

	// alias prototype as `defaults`
	Ractive.defaults = Ractive.prototype;

	// static properties
	defineProperties( Ractive, {

		// debug flag
		DEBUG:          { writable: true, value: true },
		DEBUG_PROMISES: { writable: true, value: true },

		// static methods:
		extend:         { value: extend },
		escapeKey:      { value: escapeKey },
		getNodeInfo:    { value: staticInfo },
		joinKeys:       { value: joinKeys },
		parse:          { value: parse },
		splitKeypath:   { value: splitKeypath },
		unescapeKey:    { value: unescapeKey },
		getCSS:         { value: getCSS },

		// namespaced constructors
		Promise:        { value: Promise$1 },

		// support
		enhance:        { writable: true, value: false },
		svg:            { value: svg },
		magic:          { value: magicSupported },

		// version
		VERSION:        { value: '0.8.14' },

		// plugins
		adaptors:       { writable: true, value: {} },
		components:     { writable: true, value: {} },
		decorators:     { writable: true, value: {} },
		easing:         { writable: true, value: easing },
		events:         { writable: true, value: {} },
		interpolators:  { writable: true, value: interpolators },
		partials:       { writable: true, value: {} },
		transitions:    { writable: true, value: {} }
	});

	return Ractive;

}));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(28)
var ieee754 = __webpack_require__(29)
var isArray = __webpack_require__(30)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(9)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = { nextTick: nextTick };
} else {
  module.exports = process
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

exports.L = { bit: 1 }
exports.M = { bit: 0 }
exports.Q = { bit: 3 }
exports.H = { bit: 2 }

function fromString (string) {
  if (typeof string !== 'string') {
    throw new Error('Param is not a string')
  }

  var lcStr = string.toLowerCase()

  switch (lcStr) {
    case 'l':
    case 'low':
      return exports.L

    case 'm':
    case 'medium':
      return exports.M

    case 'q':
    case 'quartile':
      return exports.Q

    case 'h':
    case 'high':
      return exports.H

    default:
      throw new Error('Unknown EC Level: ' + string)
  }
}

exports.isValid = function isValid (level) {
  return level && typeof level.bit !== 'undefined' &&
    level.bit >= 0 && level.bit < 4
}

exports.from = function from (value, defaultValue) {
  if (exports.isValid(value)) {
    return value
  }

  try {
    return fromString(value)
  } catch (e) {
    return defaultValue
  }
}


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



/*<replacement>*/

var pna = __webpack_require__(11);
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = __webpack_require__(37);
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = __webpack_require__(16).EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(17);
/*</replacement>*/

/*<replacement>*/

var Buffer = __webpack_require__(10).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(7);
util.inherits = __webpack_require__(4);
/*</replacement>*/

/*<replacement>*/
var debugUtil = __webpack_require__(38);
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = __webpack_require__(39);
var destroyImpl = __webpack_require__(18);
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(5);

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var readableHwm = options.readableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __webpack_require__(20).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(5);

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __webpack_require__(20).StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) pna.nextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    pna.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) pna.nextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        pna.nextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    pna.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;

  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    pna.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(3)))

/***/ }),
/* 16 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16).EventEmitter;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

var pna = __webpack_require__(11);
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      pna.nextTick(emitErrorNT, this, err);
    }
    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      pna.nextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });

  return this;
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate, global) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.



/*<replacement>*/

var pna = __webpack_require__(11);
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = __webpack_require__(7);
util.inherits = __webpack_require__(4);
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(43)
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(17);
/*</replacement>*/

/*<replacement>*/

var Buffer = __webpack_require__(10).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

var destroyImpl = __webpack_require__(18);

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(5);

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var writableHwm = options.writableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __webpack_require__(5);

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  pna.nextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    pna.nextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    pna.nextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    pna.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      pna.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) pna.nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(41).setImmediate, __webpack_require__(0)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(44).Buffer;

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return -1;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// UTF-8 replacement characters ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd'.repeat(p);
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd'.repeat(p + 1);
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd'.repeat(p + 2);
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character for each buffered byte of a (partial)
// character needs to be added to the output.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd'.repeat(this.lastTotal - this.lastNeed);
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.



module.exports = Transform;

var Duplex = __webpack_require__(5);

/*<replacement>*/
var util = __webpack_require__(7);
util.inherits = __webpack_require__(4);
/*</replacement>*/

util.inherits(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return this.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);

  cb(er);

  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function') {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this2 = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this2.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');

  if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var ECLevel = __webpack_require__(14)

var EC_BLOCKS_TABLE = [
// L  M  Q  H
  1, 1, 1, 1,
  1, 1, 1, 1,
  1, 1, 2, 2,
  1, 2, 2, 4,
  1, 2, 4, 4,
  2, 4, 4, 4,
  2, 4, 6, 5,
  2, 4, 6, 6,
  2, 5, 8, 8,
  4, 5, 8, 8,
  4, 5, 8, 11,
  4, 8, 10, 11,
  4, 9, 12, 16,
  4, 9, 16, 16,
  6, 10, 12, 18,
  6, 10, 17, 16,
  6, 11, 16, 19,
  6, 13, 18, 21,
  7, 14, 21, 25,
  8, 16, 20, 25,
  8, 17, 23, 25,
  9, 17, 23, 34,
  9, 18, 25, 30,
  10, 20, 27, 32,
  12, 21, 29, 35,
  12, 23, 34, 37,
  12, 25, 34, 40,
  13, 26, 35, 42,
  14, 28, 38, 45,
  15, 29, 40, 48,
  16, 31, 43, 51,
  17, 33, 45, 54,
  18, 35, 48, 57,
  19, 37, 51, 60,
  19, 38, 53, 63,
  20, 40, 56, 66,
  21, 43, 59, 70,
  22, 45, 62, 74,
  24, 47, 65, 77,
  25, 49, 68, 81
]

var EC_CODEWORDS_TABLE = [
// L  M  Q  H
  7, 10, 13, 17,
  10, 16, 22, 28,
  15, 26, 36, 44,
  20, 36, 52, 64,
  26, 48, 72, 88,
  36, 64, 96, 112,
  40, 72, 108, 130,
  48, 88, 132, 156,
  60, 110, 160, 192,
  72, 130, 192, 224,
  80, 150, 224, 264,
  96, 176, 260, 308,
  104, 198, 288, 352,
  120, 216, 320, 384,
  132, 240, 360, 432,
  144, 280, 408, 480,
  168, 308, 448, 532,
  180, 338, 504, 588,
  196, 364, 546, 650,
  224, 416, 600, 700,
  224, 442, 644, 750,
  252, 476, 690, 816,
  270, 504, 750, 900,
  300, 560, 810, 960,
  312, 588, 870, 1050,
  336, 644, 952, 1110,
  360, 700, 1020, 1200,
  390, 728, 1050, 1260,
  420, 784, 1140, 1350,
  450, 812, 1200, 1440,
  480, 868, 1290, 1530,
  510, 924, 1350, 1620,
  540, 980, 1440, 1710,
  570, 1036, 1530, 1800,
  570, 1064, 1590, 1890,
  600, 1120, 1680, 1980,
  630, 1204, 1770, 2100,
  660, 1260, 1860, 2220,
  720, 1316, 1950, 2310,
  750, 1372, 2040, 2430
]

/**
 * Returns the number of error correction block that the QR Code should contain
 * for the specified version and error correction level.
 *
 * @param  {Number} version              QR Code version
 * @param  {Number} errorCorrectionLevel Error correction level
 * @return {Number}                      Number of error correction blocks
 */
exports.getBlocksCount = function getBlocksCount (version, errorCorrectionLevel) {
  switch (errorCorrectionLevel) {
    case ECLevel.L:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 0]
    case ECLevel.M:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 1]
    case ECLevel.Q:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 2]
    case ECLevel.H:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 3]
    default:
      return undefined
  }
}

/**
 * Returns the number of error correction codewords to use for the specified
 * version and error correction level.
 *
 * @param  {Number} version              QR Code version
 * @param  {Number} errorCorrectionLevel Error correction level
 * @return {Number}                      Number of error correction codewords
 */
exports.getTotalCodewordsCount = function getTotalCodewordsCount (version, errorCorrectionLevel) {
  switch (errorCorrectionLevel) {
    case ECLevel.L:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0]
    case ECLevel.M:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1]
    case ECLevel.Q:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2]
    case ECLevel.H:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3]
    default:
      return undefined
  }
}


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(1)
var ECCode = __webpack_require__(22)
var ECLevel = __webpack_require__(14)
var Mode = __webpack_require__(2)
var isArray = __webpack_require__(13)

// Generator polynomial used to encode version information
var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0)
var G18_BCH = Utils.getBCHDigit(G18)

function getBestVersionForDataLength (mode, length, errorCorrectionLevel) {
  for (var currentVersion = 1; currentVersion <= 40; currentVersion++) {
    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
      return currentVersion
    }
  }

  return undefined
}

function getReservedBitsCount (mode, version) {
  // Character count indicator + mode indicator bits
  return Mode.getCharCountIndicator(mode, version) + 4
}

function getTotalBitsFromDataArray (segments, version) {
  var totalBits = 0

  segments.forEach(function (data) {
    var reservedBits = getReservedBitsCount(data.mode, version)
    totalBits += reservedBits + data.getBitsLength()
  })

  return totalBits
}

function getBestVersionForMixedData (segments, errorCorrectionLevel) {
  for (var currentVersion = 1; currentVersion <= 40; currentVersion++) {
    var length = getTotalBitsFromDataArray(segments, currentVersion)
    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
      return currentVersion
    }
  }

  return undefined
}

/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */
exports.isValid = function isValid (version) {
  return !isNaN(version) && version >= 1 && version <= 40
}

/**
 * Returns version number from a value.
 * If value is not a valid version, returns defaultValue
 *
 * @param  {Number|String} value        QR Code version
 * @param  {Number}        defaultValue Fallback value
 * @return {Number}                     QR Code version number
 */
exports.from = function from (value, defaultValue) {
  if (exports.isValid(value)) {
    return parseInt(value, 10)
  }

  return defaultValue
}

/**
 * Returns how much data can be stored with the specified QR code version
 * and error correction level
 *
 * @param  {Number} version              QR Code version (1-40)
 * @param  {Number} errorCorrectionLevel Error correction level
 * @param  {Mode}   mode                 Data mode
 * @return {Number}                      Quantity of storable data
 */
exports.getCapacity = function getCapacity (version, errorCorrectionLevel, mode) {
  if (!exports.isValid(version)) {
    throw new Error('Invalid QR Code version')
  }

  // Use Byte mode as default
  if (typeof mode === 'undefined') mode = Mode.BYTE

  // Total codewords for this QR code version (Data + Error correction)
  var totalCodewords = Utils.getSymbolTotalCodewords(version)

  // Total number of error correction codewords
  var ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)

  // Total number of data codewords
  var dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8

  if (mode === Mode.MIXED) return dataTotalCodewordsBits

  var usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version)

  // Return max number of storable codewords
  switch (mode) {
    case Mode.NUMERIC:
      return Math.floor((usableBits / 10) * 3)

    case Mode.ALPHANUMERIC:
      return Math.floor((usableBits / 11) * 2)

    case Mode.KANJI:
      return Math.floor(usableBits / 13)

    case Mode.BYTE:
    default:
      return Math.floor(usableBits / 8)
  }
}

/**
 * Returns the minimum version needed to contain the amount of data
 *
 * @param  {Segment} data                    Segment of data
 * @param  {Number} [errorCorrectionLevel=H] Error correction level
 * @param  {Mode} mode                       Data mode
 * @return {Number}                          QR Code version
 */
exports.getBestVersionForData = function getBestVersionForData (data, errorCorrectionLevel) {
  var seg

  var ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M)

  if (isArray(data)) {
    if (data.length > 1) {
      return getBestVersionForMixedData(data, ecl)
    }

    if (data.length === 0) {
      return 1
    }

    seg = data[0]
  } else {
    seg = data
  }

  return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl)
}

/**
 * Returns version information with relative error correction bits
 *
 * The version information is included in QR Code symbols of version 7 or larger.
 * It consists of an 18-bit sequence containing 6 data bits,
 * with 12 error correction bits calculated using the (18, 6) Golay code.
 *
 * @param  {Number} version QR Code version
 * @return {Number}         Encoded version info bits
 */
exports.getEncodedBits = function getEncodedBits (version) {
  if (!exports.isValid(version) || version < 7) {
    throw new Error('Invalid QR Code version')
  }

  var d = version << 12

  while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
    d ^= (G18 << (Utils.getBCHDigit(d) - G18_BCH))
  }

  return (version << 12) | d
}


/***/ }),
/* 24 */
/***/ (function(module, exports) {

var numeric = '[0-9]+'
var alphanumeric = '[A-Z $%*+\\-./:]+'
var kanji = '(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|' +
  '[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|' +
  '[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|' +
  '[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+'
kanji = kanji.replace(/u/g, '\\u')

var byte = '(?:(?![A-Z0-9 $%*+\\-./:]|' + kanji + ').)+'

exports.KANJI = new RegExp(kanji, 'g')
exports.BYTE_KANJI = new RegExp('[^A-Z0-9 $%*+\\-./:]+', 'g')
exports.BYTE = new RegExp(byte, 'g')
exports.NUMERIC = new RegExp(numeric, 'g')
exports.ALPHANUMERIC = new RegExp(alphanumeric, 'g')

var TEST_KANJI = new RegExp('^' + kanji + '$')
var TEST_NUMERIC = new RegExp('^' + numeric + '$')
var TEST_ALPHANUMERIC = new RegExp('^[A-Z0-9 $%*+\\-./:]+$')

exports.testKanji = function testKanji (str) {
  return TEST_KANJI.test(str)
}

exports.testNumeric = function testNumeric (str) {
  return TEST_NUMERIC.test(str)
}

exports.testAlphanumeric = function testAlphanumeric (str) {
  return TEST_ALPHANUMERIC.test(str)
}


/***/ }),
/* 25 */
/***/ (function(module, exports) {

function hex2rgba (hex) {
  if (typeof hex !== 'string') {
    throw new Error('Color should be defined as hex string')
  }

  var hexCode = hex.slice().replace('#', '').split('')
  if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
    throw new Error('Invalid hex color: ' + hex)
  }

  // Convert from short to long form (fff -> ffffff)
  if (hexCode.length === 3 || hexCode.length === 4) {
    hexCode = Array.prototype.concat.apply([], hexCode.map(function (c) {
      return [c, c]
    }))
  }

  // Add default alpha value
  if (hexCode.length === 6) hexCode.push('F', 'F')

  var hexValue = parseInt(hexCode.join(''), 16)

  return {
    r: (hexValue >> 24) & 255,
    g: (hexValue >> 16) & 255,
    b: (hexValue >> 8) & 255,
    a: hexValue & 255,
    hex: '#' + hexCode.slice(0, 6).join('')
  }
}

exports.getOptions = function getOptions (options) {
  if (!options) options = {}
  if (!options.color) options.color = {}

  var margin = typeof options.margin === 'undefined' ||
    options.margin === null ||
    options.margin < 0 ? 4 : options.margin

  var width = options.width && options.width >= 21 ? options.width : undefined
  var scale = options.scale || 4

  return {
    width: width,
    scale: width ? 4 : scale,
    margin: margin,
    color: {
      dark: hex2rgba(options.color.dark || '#000000ff'),
      light: hex2rgba(options.color.light || '#ffffffff')
    },
    type: options.type,
    rendererOpts: options.rendererOpts || {}
  }
}

exports.getScale = function getScale (qrSize, opts) {
  return opts.width && opts.width >= qrSize + opts.margin * 2
    ? opts.width / (qrSize + opts.margin * 2)
    : opts.scale
}

exports.getImageWidth = function getImageWidth (qrSize, opts) {
  var scale = exports.getScale(qrSize, opts)
  return Math.floor((qrSize + opts.margin * 2) * scale)
}

exports.qrToImageData = function qrToImageData (imgData, qr, opts) {
  var size = qr.modules.size
  var data = qr.modules.data
  var scale = exports.getScale(size, opts)
  var symbolSize = Math.floor((size + opts.margin * 2) * scale)
  var scaledMargin = opts.margin * scale
  var palette = [opts.color.light, opts.color.dark]

  for (var i = 0; i < symbolSize; i++) {
    for (var j = 0; j < symbolSize; j++) {
      var posDst = (i * symbolSize + j) * 4
      var pxColor = opts.color.light

      if (i >= scaledMargin && j >= scaledMargin &&
        i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
        var iSrc = Math.floor((i - scaledMargin) / scale)
        var jSrc = Math.floor((j - scaledMargin) / scale)
        pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0]
      }

      imgData[posDst++] = pxColor.r
      imgData[posDst++] = pxColor.g
      imgData[posDst++] = pxColor.b
      imgData[posDst] = pxColor.a
    }
  }
}


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var Ractive  = __webpack_require__(8);
window.Ractive = Ractive;
//window.rt = require('ractive-touch');
//Ractive.events.tap = require( 'ractive-events-tap' );


//var anime = require('animejs');

//import Ractive from 'ractive';

//Ractive.defaults.isolated=true;
Ractive.prototype.unset = function(keypath){
    var lastDot = keypath.lastIndexOf( '.' ),
        parent = keypath.substr( 0, lastDot ),
        property = keypath.substring( lastDot + 1 );

    this.set(keypath);
    delete this.get(parent)[property];
    return this.update(keypath);
}

//console.log('ke')
/*
window.alertify = require('alertifyjs')
require('ion-sound')
alertify.defaults = {
    notifier:{
        // auto-dismiss wait time (in seconds)  
        delay:5,
        // default position
        position:'top-right',
        // adds a close button to notifier messages
        closeButton: false
    }
};

alertify.notify('Šifra je vec očitana', 'warning', 3);
*/

//  S O C K E T S 
window.socket = io.connect();
socket.on('connect', function (data) {
    ractive.set('mysockid', socket.id)
});

socket.on('signal', function (d) {// data, from
    console.log('signal from sock', d);
    if (peers[d.from]){
        peers[d.from].signal(d.data);
    }
    //socket.emit('my other event', { my: 'data' });
});

socket.on('initP2PWith', function (remoteSockId) {
    console.log('initP2PWith received with ', remoteSockId);
    initP2PWith(remoteSockId, true);
});


//PEERS
var Peer = __webpack_require__(27);
peers = {};
window.initP2PWith = function (remoteSockId, initiator){
    var peerParams = {
        initiator: initiator,
        trickle: true,
        reconnectTimer: 4000,
        //iceTransportPolicy: 'relay',
        config: {
            //iceTransportPolicy: 'relay',
            iceServers: [
                {"urls":"turn:159.89.1.251:3478", "username":"test", "credential":"test", "credentialType": "password"},
                {"urls":"stun:stun.sipgate.net"},
                {"urls":"stun:217.10.68.152"},
                {"urls":"stun:stun.sipgate.net:10000"},
                {"urls":"stun:217.10.68.152:10000"},
                {"urls":"turn:192.155.84.88","username":"easyRTC","credential":"easyRTC@pass", "credentialType": "password"},
                {"urls":"turn:192.155.84.88?transport=tcp","username":"easyRTC","credential":"easyRTC@pass", "credentialType": "password"},
                {
                  "urls":"turn:192.155.86.24:443",
                  "credential":"easyRTC@pass",
                  "username":"easyRTC",
                  "credentialType": "password"
                },
                {
                  "urls":"turn:192.155.86.24:443?transport=tcp",
                  "credential":"easyRTC@pass",
                  "credentialType": "password",
                  "username":"easyRTC"
                },                
                {urls: 'stun:stun1.l.google.com:19302'},
                {urls: 'stun:stun2.l.google.com:19302'},                
                {
                    urls: "stun:numb.viagenie.ca",
                    username: "pasaseh@ether123.net",
                    credential: "12345678"
                },
                {
                    urls: "turn:numb.viagenie.ca",
                    username: "pasaseh@ether123.net",
                    credential: "12345678"
                }
            ]
        }
    };

    if (initiator) {
        peerParams.initiator = true; peerParams.stream = ractive.stream
    }
    else{
        peerParams.initiator = false ;
    }
    peers[remoteSockId] = new Peer(peerParams)
    
    var p = peers[remoteSockId];
    //p._debug = console.log;


    p.on('error', function (err) { console.log('peer error', remoteSockId, err) })

    // on webrtc discovery, send it to other peer and on other peer call p2.signal(data)
    p.on('signal', function (data) {
        console.log('emiting SIGNAL', data)
        socket.emit('signal', {data:data, to:remoteSockId})
    })
    
    p.on('connect', function () {
        console.log('peer connect')
        p.send('whatever' + Math.random())
    })
    
    p.on('data', function (data) {
        console.log('data: ' + data)
    })

    p.on('stream', function (stream) {
        console.log('got remote video stream')
        // got remote video stream, now let's show it in a video tag
        document.getElementById('video').srcObject = stream;
        document.getElementById('video').play();
        ractive.set('videoIsPlaying',true);
    })
    
}

Ractive.components.Root                    =  __webpack_require__(46);
Ractive.components.noise                   =  __webpack_require__(47);
Ractive.components.qrcode                  =  __webpack_require__(48);

var ractive = new Ractive.components.Root({
    el: 'body',
    append: false,
    data:function() {
        return {
        }
    }
});
window.ractive = ractive;

ractive.set('chromeExtensionInstalled', true);
/*
var tryCount=15;
var to = null;
window.checkChromeExtensionStatus = function(){
    if(--tryCount != 0) to = setTimeout(checkChromeExtensionStatus, 1500)
    console.log('checkChromeExtensionStatus', tryCount);
    if (typeof window.getChromeExtensionStatus == 'function')
    window.getChromeExtensionStatus(function(status) {
        if (status === 'installed-enabled') { ractive.set('chromeExtensionInstalled', true); clearTimeout(to); };
        if (status === 'installed-disabled') ractive.set('chromeExtensionInstalled', false);
    });
}
window.checkChromeExtensionStatus();

window.installScreenCaptureExtension = function(){
    if (!!window.chrome && !!chrome.webstore && !!chrome.webstore.install)
        chrome.webstore.install(
            'https://chrome.google.com/webstore/detail/ajhifddimkapgcifgcodmmfdlknahffk', 
            function(){ location.reload(); }, 
            function(error){ alert(error); }
        );
}
*/



/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {module.exports = Peer

var debug = __webpack_require__(31)('simple-peer')
var getBrowserRTC = __webpack_require__(34)
var inherits = __webpack_require__(4)
var randombytes = __webpack_require__(35)
var stream = __webpack_require__(36)

var MAX_BUFFERED_AMOUNT = 64 * 1024

inherits(Peer, stream.Duplex)

/**
 * WebRTC peer connection. Same API as node core `net.Socket`, plus a few extra methods.
 * Duplex stream.
 * @param {Object} opts
 */
function Peer (opts) {
  var self = this
  if (!(self instanceof Peer)) return new Peer(opts)

  self._id = randombytes(4).toString('hex').slice(0, 7)
  self._debug('new peer %o', opts)

  opts = Object.assign({
    allowHalfOpen: false
  }, opts)

  stream.Duplex.call(self, opts)

  self.channelName = opts.initiator
    ? opts.channelName || randombytes(20).toString('hex')
    : null

  // Needed by _transformConstraints, so set this early
  self._isChromium = typeof window !== 'undefined' && !!window.webkitRTCPeerConnection

  self.initiator = opts.initiator || false
  self.channelConfig = opts.channelConfig || Peer.channelConfig
  self.config = opts.config || Peer.config
  self.constraints = self._transformConstraints(opts.constraints || Peer.constraints)
  self.offerConstraints = self._transformConstraints(opts.offerConstraints || {})
  self.answerConstraints = self._transformConstraints(opts.answerConstraints || {})
  self.reconnectTimer = opts.reconnectTimer || false
  self.sdpTransform = opts.sdpTransform || function (sdp) { return sdp }
  self.stream = opts.stream || false
  self.trickle = opts.trickle !== undefined ? opts.trickle : true

  self.destroyed = false
  self.connected = false

  self.remoteAddress = undefined
  self.remoteFamily = undefined
  self.remotePort = undefined
  self.localAddress = undefined
  self.localPort = undefined

  self._wrtc = (opts.wrtc && typeof opts.wrtc === 'object')
    ? opts.wrtc
    : getBrowserRTC()

  if (!self._wrtc) {
    if (typeof window === 'undefined') {
      throw new Error('No WebRTC support: Specify `opts.wrtc` option in this environment')
    } else {
      throw new Error('No WebRTC support: Not a supported browser')
    }
  }

  self._pcReady = false
  self._channelReady = false
  self._iceComplete = false // ice candidate trickle done (got null candidate)
  self._channel = null
  self._pendingCandidates = []
  self._previousStreams = []

  self._chunk = null
  self._cb = null
  self._interval = null
  self._reconnectTimeout = null

  self._pc = new (self._wrtc.RTCPeerConnection)(self.config, self.constraints)

  // We prefer feature detection whenever possible, but sometimes that's not
  // possible for certain implementations.
  self._isWrtc = Array.isArray(self._pc.RTCIceConnectionStates)
  self._isReactNativeWebrtc = typeof self._pc._peerConnectionId === 'number'

  self._pc.oniceconnectionstatechange = function () {
    self._onIceStateChange()
  }
  self._pc.onicegatheringstatechange = function () {
    self._onIceStateChange()
  }
  self._pc.onsignalingstatechange = function () {
    self._onSignalingStateChange()
  }
  self._pc.onicecandidate = function (event) {
    self._onIceCandidate(event)
  }

  // Other spec events, unused by this implementation:
  // - onconnectionstatechange
  // - onicecandidateerror
  // - onfingerprintfailure

  if (self.initiator) {
    var createdOffer = false
    self._pc.onnegotiationneeded = function () {
      if (!createdOffer) self._createOffer()
      createdOffer = true
    }

    self._setupData({
      channel: self._pc.createDataChannel(self.channelName, self.channelConfig)
    })
  } else {
    self._pc.ondatachannel = function (event) {
      self._setupData(event)
    }
  }

  if ('addTrack' in self._pc) {
    // WebRTC Spec, Firefox
    if (self.stream) {
      self.stream.getTracks().forEach(function (track) {
        self._pc.addTrack(track, self.stream)
      })
    }
    self._pc.ontrack = function (event) {
      self._onTrack(event)
    }
  } else {
    // Chrome, etc. This can be removed once all browsers support `ontrack`
    if (self.stream) self._pc.addStream(self.stream)
    self._pc.onaddstream = function (event) {
      self._onAddStream(event)
    }
  }

  // HACK: wrtc doesn't fire the 'negotionneeded' event
  if (self.initiator && self._isWrtc) {
    self._pc.onnegotiationneeded()
  }

  self._onFinishBound = function () {
    self._onFinish()
  }
  self.once('finish', self._onFinishBound)
}

Peer.WEBRTC_SUPPORT = !!getBrowserRTC()

/**
 * Expose config, constraints, and data channel config for overriding all Peer
 * instances. Otherwise, just set opts.config, opts.constraints, or opts.channelConfig
 * when constructing a Peer.
 */
Peer.config = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'stun:global.stun.twilio.com:3478?transport=udp'
    }
  ]
}
Peer.constraints = {}
Peer.channelConfig = {}

Object.defineProperty(Peer.prototype, 'bufferSize', {
  get: function () {
    var self = this
    return (self._channel && self._channel.bufferedAmount) || 0
  }
})

Peer.prototype.address = function () {
  var self = this
  return { port: self.localPort, family: 'IPv4', address: self.localAddress }
}

Peer.prototype.signal = function (data) {
  var self = this
  if (self.destroyed) throw new Error('cannot signal after peer is destroyed')
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (err) {
      data = {}
    }
  }
  self._debug('signal()')

  if (data.candidate) {
    if (self._pc.remoteDescription && self._pc.remoteDescription.type) self._addIceCandidate(data.candidate)
    else self._pendingCandidates.push(data.candidate)
  }
  if (data.sdp) {
    self._pc.setRemoteDescription(new (self._wrtc.RTCSessionDescription)(data), function () {
      if (self.destroyed) return

      self._pendingCandidates.forEach(function (candidate) {
        self._addIceCandidate(candidate)
      })
      self._pendingCandidates = []

      if (self._pc.remoteDescription.type === 'offer') self._createAnswer()
    }, function (err) { self.destroy(err) })
  }
  if (!data.sdp && !data.candidate) {
    self.destroy(new Error('signal() called with invalid signal data'))
  }
}

Peer.prototype._addIceCandidate = function (candidate) {
  var self = this
  try {
    self._pc.addIceCandidate(
      new self._wrtc.RTCIceCandidate(candidate),
      noop,
      function (err) { self.destroy(err) }
    )
  } catch (err) {
    self.destroy(new Error('error adding candidate: ' + err.message))
  }
}

/**
 * Send text/binary data to the remote peer.
 * @param {TypedArrayView|ArrayBuffer|Buffer|string|Blob|Object} chunk
 */
Peer.prototype.send = function (chunk) {
  var self = this
  self._channel.send(chunk)
}

// TODO: Delete this method once readable-stream is updated to contain a default
// implementation of destroy() that automatically calls _destroy()
// See: https://github.com/nodejs/readable-stream/issues/283
Peer.prototype.destroy = function (err) {
  var self = this
  self._destroy(err, function () {})
}

Peer.prototype._destroy = function (err, cb) {
  var self = this
  if (self.destroyed) return

  self._debug('destroy (error: %s)', err && (err.message || err))

  self.readable = self.writable = false

  if (!self._readableState.ended) self.push(null)
  if (!self._writableState.finished) self.end()

  self.destroyed = true
  self.connected = false
  self._pcReady = false
  self._channelReady = false
  self._previousStreams = null

  clearInterval(self._interval)
  clearTimeout(self._reconnectTimeout)
  self._interval = null
  self._reconnectTimeout = null
  self._chunk = null
  self._cb = null

  if (self._onFinishBound) self.removeListener('finish', self._onFinishBound)
  self._onFinishBound = null

  if (self._pc) {
    try {
      self._pc.close()
    } catch (err) {}

    self._pc.oniceconnectionstatechange = null
    self._pc.onicegatheringstatechange = null
    self._pc.onsignalingstatechange = null
    self._pc.onicecandidate = null
    if ('addTrack' in self._pc) {
      self._pc.ontrack = null
    } else {
      self._pc.onaddstream = null
    }
    self._pc.onnegotiationneeded = null
    self._pc.ondatachannel = null
  }

  if (self._channel) {
    try {
      self._channel.close()
    } catch (err) {}

    self._channel.onmessage = null
    self._channel.onopen = null
    self._channel.onclose = null
    self._channel.onerror = null
  }
  self._pc = null
  self._channel = null

  if (err) self.emit('error', err)
  self.emit('close')
  cb()
}

Peer.prototype._setupData = function (event) {
  var self = this
  if (!event.channel) {
    // In some situations `pc.createDataChannel()` returns `undefined` (in wrtc),
    // which is invalid behavior. Handle it gracefully.
    // See: https://github.com/feross/simple-peer/issues/163
    return self.destroy(new Error('Data channel event is missing `channel` property'))
  }

  self._channel = event.channel
  self._channel.binaryType = 'arraybuffer'

  if (typeof self._channel.bufferedAmountLowThreshold === 'number') {
    self._channel.bufferedAmountLowThreshold = MAX_BUFFERED_AMOUNT
  }

  self.channelName = self._channel.label

  self._channel.onmessage = function (event) {
    self._onChannelMessage(event)
  }
  self._channel.onbufferedamountlow = function () {
    self._onChannelBufferedAmountLow()
  }
  self._channel.onopen = function () {
    self._onChannelOpen()
  }
  self._channel.onclose = function () {
    self._onChannelClose()
  }
  self._channel.onerror = function (err) {
    self.destroy(err)
  }
}

Peer.prototype._read = function () {}

Peer.prototype._write = function (chunk, encoding, cb) {
  var self = this
  if (self.destroyed) return cb(new Error('cannot write after peer is destroyed'))

  if (self.connected) {
    try {
      self.send(chunk)
    } catch (err) {
      return self.destroy(err)
    }
    if (self._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
      self._debug('start backpressure: bufferedAmount %d', self._channel.bufferedAmount)
      self._cb = cb
    } else {
      cb(null)
    }
  } else {
    self._debug('write before connect')
    self._chunk = chunk
    self._cb = cb
  }
}

// When stream finishes writing, close socket. Half open connections are not
// supported.
Peer.prototype._onFinish = function () {
  var self = this
  if (self.destroyed) return

  if (self.connected) {
    destroySoon()
  } else {
    self.once('connect', destroySoon)
  }

  // Wait a bit before destroying so the socket flushes.
  // TODO: is there a more reliable way to accomplish this?
  function destroySoon () {
    setTimeout(function () {
      self.destroy()
    }, 1000)
  }
}

Peer.prototype._createOffer = function () {
  var self = this
  if (self.destroyed) return

  self._pc.createOffer(function (offer) {
    if (self.destroyed) return
    offer.sdp = self.sdpTransform(offer.sdp)
    self._pc.setLocalDescription(offer, onSuccess, onError)

    function onSuccess () {
      if (self.destroyed) return
      if (self.trickle || self._iceComplete) sendOffer()
      else self.once('_iceComplete', sendOffer) // wait for candidates
    }

    function onError (err) {
      self.destroy(err)
    }

    function sendOffer () {
      var signal = self._pc.localDescription || offer
      self._debug('signal')
      self.emit('signal', {
        type: signal.type,
        sdp: signal.sdp
      })
    }
  }, function (err) { self.destroy(err) }, self.offerConstraints)
}

Peer.prototype._createAnswer = function () {
  var self = this
  if (self.destroyed) return

  self._pc.createAnswer(function (answer) {
    if (self.destroyed) return
    answer.sdp = self.sdpTransform(answer.sdp)
    self._pc.setLocalDescription(answer, onSuccess, onError)

    function onSuccess () {
      if (self.destroyed) return
      if (self.trickle || self._iceComplete) sendAnswer()
      else self.once('_iceComplete', sendAnswer)
    }

    function onError (err) {
      self.destroy(err)
    }

    function sendAnswer () {
      var signal = self._pc.localDescription || answer
      self._debug('signal')
      self.emit('signal', {
        type: signal.type,
        sdp: signal.sdp
      })
    }
  }, function (err) { self.destroy(err) }, self.answerConstraints)
}

Peer.prototype._onIceStateChange = function () {
  var self = this
  if (self.destroyed) return
  var iceConnectionState = self._pc.iceConnectionState
  var iceGatheringState = self._pc.iceGatheringState

  self._debug(
    'iceStateChange (connection: %s) (gathering: %s)',
    iceConnectionState,
    iceGatheringState
  )
  self.emit('iceStateChange', iceConnectionState, iceGatheringState)

  if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
    clearTimeout(self._reconnectTimeout)
    self._pcReady = true
    self._maybeReady()
  }
  if (iceConnectionState === 'disconnected') {
    if (self.reconnectTimer) {
      // If user has set `opt.reconnectTimer`, allow time for ICE to attempt a reconnect
      clearTimeout(self._reconnectTimeout)
      self._reconnectTimeout = setTimeout(function () {
        self.destroy()
      }, self.reconnectTimer)
    } else {
      self.destroy()
    }
  }
  if (iceConnectionState === 'failed') {
    self.destroy(new Error('Ice connection failed.'))
  }
  if (iceConnectionState === 'closed') {
    self.destroy()
  }
}

Peer.prototype.getStats = function (cb) {
  var self = this

  // Promise-based getStats() (standard)
  if (self._pc.getStats.length === 0) {
    self._pc.getStats().then(function (res) {
      var reports = []
      res.forEach(function (report) {
        reports.push(report)
      })
      cb(null, reports)
    }, function (err) { cb(err) })

  // Two-parameter callback-based getStats() (deprecated, former standard)
  } else if (self._isReactNativeWebrtc) {
    self._pc.getStats(null, function (res) {
      var reports = []
      res.forEach(function (report) {
        reports.push(report)
      })
      cb(null, reports)
    }, function (err) { cb(err) })

  // Single-parameter callback-based getStats() (non-standard)
  } else if (self._pc.getStats.length > 0) {
    self._pc.getStats(function (res) {
      // If we destroy connection in `connect` callback this code might happen to run when actual connection is already closed
      if (self.destroyed) return

      var reports = []
      res.result().forEach(function (result) {
        var report = {}
        result.names().forEach(function (name) {
          report[name] = result.stat(name)
        })
        report.id = result.id
        report.type = result.type
        report.timestamp = result.timestamp
        reports.push(report)
      })
      cb(null, reports)
    }, function (err) { cb(err) })

  // Unknown browser, skip getStats() since it's anyone's guess which style of
  // getStats() they implement.
  } else {
    cb(null, [])
  }
}

Peer.prototype._maybeReady = function () {
  var self = this
  self._debug('maybeReady pc %s channel %s', self._pcReady, self._channelReady)
  if (self.connected || self._connecting || !self._pcReady || !self._channelReady) return

  self._connecting = true

  // HACK: We can't rely on order here, for details see https://github.com/js-platform/node-webrtc/issues/339
  function findCandidatePair () {
    if (self.destroyed) return

    self.getStats(function (err, items) {
      if (self.destroyed) return

      // Treat getStats error as non-fatal. It's not essential.
      if (err) items = []

      var remoteCandidates = {}
      var localCandidates = {}
      var candidatePairs = {}
      var foundSelectedCandidatePair = false

      items.forEach(function (item) {
        // TODO: Once all browsers support the hyphenated stats report types, remove
        // the non-hypenated ones
        if (item.type === 'remotecandidate' || item.type === 'remote-candidate') {
          remoteCandidates[item.id] = item
        }
        if (item.type === 'localcandidate' || item.type === 'local-candidate') {
          localCandidates[item.id] = item
        }
        if (item.type === 'candidatepair' || item.type === 'candidate-pair') {
          candidatePairs[item.id] = item
        }
      })

      items.forEach(function (item) {
        // Spec-compliant
        if (item.type === 'transport') {
          setSelectedCandidatePair(candidatePairs[item.selectedCandidatePairId])
        }

        // Old implementations
        if (
          (item.type === 'googCandidatePair' && item.googActiveConnection === 'true') ||
          ((item.type === 'candidatepair' || item.type === 'candidate-pair') && item.selected)
        ) {
          setSelectedCandidatePair(item)
        }
      })

      function setSelectedCandidatePair (selectedCandidatePair) {
        foundSelectedCandidatePair = true

        var local = localCandidates[selectedCandidatePair.localCandidateId]

        if (local && local.ip) {
          // Spec
          self.localAddress = local.ip
          self.localPort = Number(local.port)
        } else if (local && local.ipAddress) {
          // Firefox
          self.localAddress = local.ipAddress
          self.localPort = Number(local.portNumber)
        } else if (typeof selectedCandidatePair.googLocalAddress === 'string') {
          // TODO: remove this once Chrome 58 is released
          local = selectedCandidatePair.googLocalAddress.split(':')
          self.localAddress = local[0]
          self.localPort = Number(local[1])
        }

        var remote = remoteCandidates[selectedCandidatePair.remoteCandidateId]

        if (remote && remote.ip) {
          // Spec
          self.remoteAddress = remote.ip
          self.remotePort = Number(remote.port)
        } else if (remote && remote.ipAddress) {
          // Firefox
          self.remoteAddress = remote.ipAddress
          self.remotePort = Number(remote.portNumber)
        } else if (typeof selectedCandidatePair.googRemoteAddress === 'string') {
          // TODO: remove this once Chrome 58 is released
          remote = selectedCandidatePair.googRemoteAddress.split(':')
          self.remoteAddress = remote[0]
          self.remotePort = Number(remote[1])
        }
        self.remoteFamily = 'IPv4'

        self._debug(
          'connect local: %s:%s remote: %s:%s',
          self.localAddress, self.localPort, self.remoteAddress, self.remotePort
        )
      }

      // Ignore candidate pair selection in browsers like Safari 11 that do not have any local or remote candidates
      // But wait until at least 1 candidate pair is available
      if (!foundSelectedCandidatePair && (!Object.keys(candidatePairs).length || Object.keys(localCandidates).length)) {
        setTimeout(findCandidatePair, 100)
        return
      } else {
        self._connecting = false
        self.connected = true
      }

      if (self._chunk) {
        try {
          self.send(self._chunk)
        } catch (err) {
          return self.destroy(err)
        }
        self._chunk = null
        self._debug('sent chunk from "write before connect"')

        var cb = self._cb
        self._cb = null
        cb(null)
      }

      // If `bufferedAmountLowThreshold` and 'onbufferedamountlow' are unsupported,
      // fallback to using setInterval to implement backpressure.
      if (typeof self._channel.bufferedAmountLowThreshold !== 'number') {
        self._interval = setInterval(function () { self._onInterval() }, 150)
        if (self._interval.unref) self._interval.unref()
      }

      self._debug('connect')
      self.emit('connect')
    })
  }
  findCandidatePair()
}

Peer.prototype._onInterval = function () {
  var self = this
  if (!self._cb || !self._channel || self._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
    return
  }
  self._onChannelBufferedAmountLow()
}

Peer.prototype._onSignalingStateChange = function () {
  var self = this
  if (self.destroyed) return
  self._debug('signalingStateChange %s', self._pc.signalingState)
  self.emit('signalingStateChange', self._pc.signalingState)
}

Peer.prototype._onIceCandidate = function (event) {
  var self = this
  if (self.destroyed) return
  if (event.candidate && self.trickle) {
    self.emit('signal', {
      candidate: {
        candidate: event.candidate.candidate,
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid
      }
    })
  } else if (!event.candidate) {
    self._iceComplete = true
    self.emit('_iceComplete')
  }
}

Peer.prototype._onChannelMessage = function (event) {
  var self = this
  if (self.destroyed) return
  var data = event.data
  if (data instanceof ArrayBuffer) data = Buffer.from(data)
  self.push(data)
}

Peer.prototype._onChannelBufferedAmountLow = function () {
  var self = this
  if (self.destroyed || !self._cb) return
  self._debug('ending backpressure: bufferedAmount %d', self._channel.bufferedAmount)
  var cb = self._cb
  self._cb = null
  cb(null)
}

Peer.prototype._onChannelOpen = function () {
  var self = this
  if (self.connected || self.destroyed) return
  self._debug('on channel open')
  self._channelReady = true
  self._maybeReady()
}

Peer.prototype._onChannelClose = function () {
  var self = this
  if (self.destroyed) return
  self._debug('on channel close')
  self.destroy()
}

Peer.prototype._onAddStream = function (event) {
  var self = this
  if (self.destroyed) return
  self._debug('on add stream')
  self.emit('stream', event.stream)
}

Peer.prototype._onTrack = function (event) {
  var self = this
  if (self.destroyed) return
  self._debug('on track')
  var id = event.streams[0].id
  if (self._previousStreams.indexOf(id) !== -1) return // Only fire one 'stream' event, even though there may be multiple tracks per stream
  self._previousStreams.push(id)
  self.emit('stream', event.streams[0])
}

Peer.prototype._debug = function () {
  var self = this
  var args = [].slice.call(arguments)
  args[0] = '[' + self._id + '] ' + args[0]
  debug.apply(null, args)
}

// Transform constraints objects into the new format (unless Chromium)
// TODO: This can be removed when Chromium supports the new format
Peer.prototype._transformConstraints = function (constraints) {
  var self = this

  if (Object.keys(constraints).length === 0) {
    return constraints
  }

  if ((constraints.mandatory || constraints.optional) && !self._isChromium) {
    // convert to new format

    // Merge mandatory and optional objects, prioritizing mandatory
    var newConstraints = Object.assign({}, constraints.optional, constraints.mandatory)

    // fix casing
    if (newConstraints.OfferToReceiveVideo !== undefined) {
      newConstraints.offerToReceiveVideo = newConstraints.OfferToReceiveVideo
      delete newConstraints['OfferToReceiveVideo']
    }

    if (newConstraints.OfferToReceiveAudio !== undefined) {
      newConstraints.offerToReceiveAudio = newConstraints.OfferToReceiveAudio
      delete newConstraints['OfferToReceiveAudio']
    }

    return newConstraints
  } else if (!constraints.mandatory && !constraints.optional && self._isChromium) {
    // convert to old format

    // fix casing
    if (constraints.offerToReceiveVideo !== undefined) {
      constraints.OfferToReceiveVideo = constraints.offerToReceiveVideo
      delete constraints['offerToReceiveVideo']
    }

    if (constraints.offerToReceiveAudio !== undefined) {
      constraints.OfferToReceiveAudio = constraints.offerToReceiveAudio
      delete constraints['offerToReceiveAudio']
    }

    return {
      mandatory: constraints // NOTE: All constraints are upgraded to mandatory
    }
  }

  return constraints
}

function noop () {}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9).Buffer))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = ((uint8[i] << 16) & 0xFF0000) + ((uint8[i + 1] << 8) & 0xFF00) + (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 29 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 30 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(32);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(33);

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 33 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),
/* 34 */
/***/ (function(module, exports) {

// originally pulled out of simple-peer

module.exports = function getBrowserRTC () {
  if (typeof window === 'undefined') return null
  var wrtc = {
    RTCPeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection,
    RTCSessionDescription: window.RTCSessionDescription ||
      window.mozRTCSessionDescription || window.webkitRTCSessionDescription,
    RTCIceCandidate: window.RTCIceCandidate || window.mozRTCIceCandidate ||
      window.webkitRTCIceCandidate
  }
  if (!wrtc.RTCPeerConnection) return null
  return wrtc
}


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

function oldBrowser () {
  throw new Error('Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11')
}

var Buffer = __webpack_require__(10).Buffer
var crypto = global.crypto || global.msCrypto

if (crypto && crypto.getRandomValues) {
  module.exports = randomBytes
} else {
  module.exports = oldBrowser
}

function randomBytes (size, cb) {
  // phantomjs needs to throw
  if (size > 65536) throw new Error('requested too many random bytes')
  // in case browserify  isn't using the Uint8Array version
  var rawBytes = new global.Uint8Array(size)

  // This will not work in older browsers.
  // See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
  if (size > 0) {  // getRandomValues fails on IE if size == 0
    crypto.getRandomValues(rawBytes)
  }

  // XXX: phantomjs doesn't like a buffer being passed here
  var bytes = Buffer.from(rawBytes.buffer)

  if (typeof cb === 'function') {
    return process.nextTick(function () {
      cb(null, bytes)
    })
  }

  return bytes
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(3)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(15);
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(19);
exports.Duplex = __webpack_require__(5);
exports.Transform = __webpack_require__(21);
exports.PassThrough = __webpack_require__(45);


/***/ }),
/* 37 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 38 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = __webpack_require__(10).Buffer;
var util = __webpack_require__(40);

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();

if (util && util.inspect && util.inspect.custom) {
  module.exports.prototype[util.inspect.custom] = function () {
    var obj = util.inspect({ length: this.length });
    return this.constructor.name + ' ' + obj;
  };
}

/***/ }),
/* 40 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(42);
// On some exotic environments, it's not clear which object `setimmeidate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(3)))

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(9)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



module.exports = PassThrough;

var Transform = __webpack_require__(21);

/*<replacement>*/
var util = __webpack_require__(7);
util.inherits = __webpack_require__(4);
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var Ractive = __webpack_require__(8);
var component = module;

//        var anime = require('animejs');
        component.exports = {
            onrender: function () {
                var self = this;
                /*
                self.on('installScreenCaptureExtension', function(){
                    window.installScreenCaptureExtension();
                })
                */
                this.stream=null;
                var broadcasterSockId = document.location.search.split('=').pop();
                self.set('broadcasterSockId', broadcasterSockId);

                self.on('cp2kb', function(){
                  var link = self.get('loc') + '?id=' + self.get('mysockid')
                  navigator.clipboard.writeText(link)//.then(e=>iziToast.success({ message: 'Code copied to clipboard.'}))
                  self.set('puf', true);
                  setTimeout(function(){
                    self.set('puf', false);
                  },900)
                })

                self.on('startBroadcast', function(){
                    //getScreenId(function (error, sourceId, screen_constraints) {
                        //console.log('screen_constraints',screen_constraints)
                        //navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
                        let stream = null;
                        let displayMediaOptions = {video: true, audio: false};
                        if (self.get('audio'))
                          displayMediaOptions = {
                            video: true,
                            audio: true
                          }
                        console.log('audio', displayMediaOptions)

                        try {    
                          navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(function(stream){
                            self.stream=stream;
                            document.getElementById('video').srcObject = stream;
                            document.getElementById('video').play();
                            self.set('videoIsPlaying',true);
                          });
                        } catch(err) {
                          console.error("stream Error: " + err);
                        }                        
                    //});
                })
                if (!broadcasterSockId) { // you are broadcaster
                    self.set('mysockid', socket.id);
                } else {
                    socket.emit('initP2PWith', broadcasterSockId);
                    initP2PWith(broadcasterSockId, false);
                }
            },
            data:function(){
                return {
                      mysockid:null
                    , loc: document.location.href
                    , broadcasterSockId:null
                    , videoIsPlaying:false
                    , audio:false
                    //, chromeExtensionInstalled:false
                }
            }
        }        
    

component.exports.template = {v:4,t:[{t:4,f:[{p:[2,1,27],t:7,e:"br"}," ",{p:[3,1,32],t:7,e:"div",f:[{p:[4,5,42],t:7,e:"button",m:[{n:"style",f:"margin-bottom: 0;",t:13},{n:"disabled",f:[{t:2,x:{r:["broadcasterSockId","videoIsPlaying"],s:"_0||_1"},p:[4,48,85]}],t:13},{n:"primary",f:0,t:13},{n:"click",f:"startBroadcast",t:70}],f:["Share my screen"]}," ",{p:[5,5,189],t:7,e:"br"}," ",{p:[6,5,198],t:7,e:"small",f:["*Broadcast works only on Chrome desktop(Win/Mac/Linux)",{p:[6,66,259],t:7,e:"small",f:[]}]}," "]}],n:50,x:{r:["broadcasterSockId"],s:"!_0"},p:[1,1,0]},{t:4,f:[{p:[16,1,505],t:7,e:"p",m:[{n:"style",f:["visibility:",{t:2,x:{r:["videoIsPlaying"],s:"_0?\"visible\":\"hidden\""},p:[16,22,526]}],t:13}],f:["Your screen is now visible at",{p:[16,90,594],t:7,e:"br"}," ",{p:[17,1,601],t:7,e:"a",m:[{n:"href",f:[{t:2,r:"loc",p:[17,10,610]},"?id=",{t:2,r:"mysockid",p:[17,21,621]}],t:13},{n:"target",f:"_blank",t:13}],f:[{t:2,r:"loc",p:[17,51,651]},"?id=",{t:2,r:"mysockid",p:[17,62,662]}]},"   ",{p:[19,1,686],t:7,e:"span",m:[{n:"style",f:"position:relative",t:13}],f:[{p:[20,3,721],t:7,e:"svg",m:[{n:"style",f:"width:1em; cursor: pointer;",t:13},{n:"title",f:"Copy to clipboard",t:13},{n:"click",f:"cp2kb",t:70},{n:"version",f:"1.1",t:13},{n:"id",f:"Layer_1",t:13},{n:"xmlns",f:"http://www.w3.org/2000/svg",t:13},{n:"xmlns:xlink",f:"http://www.w3.org/1999/xlink",t:13},{n:"x",f:"0px",t:13},{n:"y",f:"0px",t:13},{n:"viewBox",f:"0 0 460 460",t:13},{n:"style",f:"enable-background:new 0 0 460 460;",t:13},{n:"xml:space",f:"preserve",t:13}],f:[{p:[22,3,1019],t:7,e:"g",f:[{p:[23,5,1027],t:7,e:"g",f:[{p:[24,7,1037],t:7,e:"g",f:[{p:[25,9,1049],t:7,e:"path",m:[{n:"d",f:"M425.934,0H171.662c-18.122,0-32.864,14.743-32.864,32.864v77.134h30V32.864c0-1.579,1.285-2.864,2.864-2.864h254.272\n          c1.579,0,2.864,1.285,2.864,2.864v254.272c0,1.58-1.285,2.865-2.864,2.865h-74.729v30h74.729\n          c18.121,0,32.864-14.743,32.864-32.865V32.864C458.797,14.743,444.055,0,425.934,0z",t:13}]}," ",{p:[28,9,1374],t:7,e:"path",m:[{n:"d",f:"M288.339,139.998H34.068c-18.122,0-32.865,14.743-32.865,32.865v254.272C1.204,445.257,15.946,460,34.068,460h254.272\n          c18.122,0,32.865-14.743,32.865-32.864V172.863C321.206,154.741,306.461,139.998,288.339,139.998z M288.341,430H34.068\n          c-1.58,0-2.865-1.285-2.865-2.864V172.863c0-1.58,1.285-2.865,2.865-2.865h254.272c1.58,0,2.865,1.285,2.865,2.865v254.273h0.001\n          C291.206,428.715,289.92,430,288.341,430z",t:13}]}]}]}]}]}," ",{t:4,f:[{p:[37,3,1863],t:7,e:"div",m:[{n:"class",f:"puf",t:13}],f:[{p:[38,5,1885],t:7,e:"center",f:["Copied to Clipboard"]}]}],n:50,r:"puf",p:[36,3,1849]}]}]}," "],n:50,x:{r:["broadcasterSockId"],s:"!_0"},p:[15,1,478]},{p:[47,1,2021],t:7,e:"div",m:[{n:"id",f:"vn",t:13}],f:[{p:[48,5,2039],t:7,e:"video",m:[{n:"style",f:["width: ",{t:2,x:{r:["broadcasterSockId"],s:"_0?\"100%\":\"39em\""},p:[48,26,2060]},";"],t:13},{n:"controls",f:0,t:13},{n:"id",f:"video",t:13}]}," ",{t:4,f:[{p:[49,28,2154],t:7,e:"noise",m:[{n:"w",f:[{t:2,x:{r:["broadcasterSockId"],s:"_0?\"100%\":\"39em\""},p:[49,38,2164]}],t:13},{n:"id",f:"noise",t:13}]}],n:50,x:{r:["videoIsPlaying"],s:"!_0"},p:[49,5,2131]}]}],e:{"_0||_1":function (_0,_1){return(_0||_1);},"!_0":function (_0){return(!_0);},"_0?\"visible\":\"hidden\"":function (_0){return(_0?"visible":"hidden");},"_0?\"100%\":\"39em\"":function (_0){return(_0?"100%":"39em");}}};
component.exports.css = "#video,#vn{width:100%}#vn{position:relative}";
module.exports = Ractive.extend(component.exports);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)(module)))

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var Ractive = __webpack_require__(8);
var component = module;

//        var anime = require('animejs');
component.exports = {
    onteardown: function(){
        console.log('teardown',this.animrequestID);
        window.cancelAnimationFrame(this.animrequestID);
    },
    onrender: function () {
        var self = this;

        var canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d');

        function resize() {
            //canvas.width = window.innerWidth;
            //canvas.height = window.innerHeight;
        }
        resize();
        //window.onresize = resize;

        function noise(ctx) {    
            var w = ctx.canvas.width,
                h = ctx.canvas.height,
                idata = ctx.createImageData(w, h),
                buffer32 = new Uint32Array(idata.data.buffer),
                len = buffer32.length,
                i = 0;

            for(; i < len;)
                buffer32[i++] = ((255 * Math.random())|0) << 24;
            
            ctx.putImageData(idata, 0, 0);
        }

        var toggle = true;

        // added toggle to get 30 FPS instead of 60 FPS
        self.animrequestID=null;
        (function loop() {
            toggle = !toggle;
            if (toggle) {
                self.animrequestID = requestAnimationFrame(loop);
                return;
            }
            noise(ctx);
            self.animrequestID = requestAnimationFrame(loop);
        })();


    }
}        
    

component.exports.template = {v:4,t:[{p:[1,1,0],t:7,e:"canvas",m:[{n:"style",f:["width:",{t:2,r:"w",p:[1,22,21]}," !important"],t:13},{n:"id",f:"canvas",t:13}]}]};
component.exports.css = "#canvas{width:100%;position:absolute;top:0;left:50%;transform:translateX(-50%);bottom:0;opacity:.4}";
module.exports = Ractive.extend(component.exports);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)(module)))

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var Ractive = __webpack_require__(8);
var component = module;

component.exports = {
    onrender: function () {
        var self = this;
        var QRCode = __webpack_require__(49)
        var canvas = document.getElementById('qrcanvas')
        this.observe('url', function(n,o,k,i){
            if (n)
            QRCode.toCanvas(canvas, n, function (error) {
                if (error) console.error(error)
                console.log('success!');
            })
        }, {init:false})
    },
    data:function(){
        return {
            url:null
        }
    }
}        

component.exports.template = {v:4,t:[{p:[1,1,0],t:7,e:"canvas",m:[{n:"id",f:"qrcanvas",t:13}]}]};
component.exports.css = "qrcanvas{width:16em;height:16em}";
module.exports = Ractive.extend(component.exports);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)(module)))

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var canPromise = __webpack_require__(50)
var QRCode = __webpack_require__(52)
var CanvasRenderer = __webpack_require__(68)
var SvgRenderer = __webpack_require__(69)

function renderCanvas (renderFunc, canvas, text, opts, cb) {
  var args = [].slice.call(arguments, 1)
  var argsNum = args.length
  var isLastArgCb = typeof args[argsNum - 1] === 'function'

  if (!isLastArgCb && !canPromise()) {
    throw new Error('Callback required as last argument')
  }

  if (isLastArgCb) {
    if (argsNum < 2) {
      throw new Error('Too few arguments provided')
    }

    if (argsNum === 2) {
      cb = text
      text = canvas
      canvas = opts = undefined
    } else if (argsNum === 3) {
      if (canvas.getContext && typeof cb === 'undefined') {
        cb = opts
        opts = undefined
      } else {
        cb = opts
        opts = text
        text = canvas
        canvas = undefined
      }
    }
  } else {
    if (argsNum < 1) {
      throw new Error('Too few arguments provided')
    }

    if (argsNum === 1) {
      text = canvas
      canvas = opts = undefined
    } else if (argsNum === 2 && !canvas.getContext) {
      opts = text
      text = canvas
      canvas = undefined
    }

    return new Promise(function (resolve, reject) {
      try {
        var data = QRCode.create(text, opts)
        resolve(renderFunc(data, canvas, opts))
      } catch (e) {
        reject(e)
      }
    })
  }

  try {
    var data = QRCode.create(text, opts)
    cb(null, renderFunc(data, canvas, opts))
  } catch (e) {
    cb(e)
  }
}

exports.create = QRCode.create
exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render)
exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL)

// only svg for now.
exports.toString = renderCanvas.bind(null, function (data, _, opts) {
  return SvgRenderer.render(data, opts)
})


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var G = __webpack_require__(51)

module.exports = function() {
  return (
    typeof G.Promise === 'function' &&
    typeof G.Promise.prototype.then === 'function'
  )
}


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
module.exports = (typeof self === 'object' && self.self === self && self) ||
  (typeof global === 'object' && global.global === global && global) ||
  this

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(6)
var Utils = __webpack_require__(1)
var ECLevel = __webpack_require__(14)
var BitBuffer = __webpack_require__(53)
var BitMatrix = __webpack_require__(54)
var AlignmentPattern = __webpack_require__(55)
var FinderPattern = __webpack_require__(56)
var MaskPattern = __webpack_require__(57)
var ECCode = __webpack_require__(22)
var ReedSolomonEncoder = __webpack_require__(58)
var Version = __webpack_require__(23)
var FormatInfo = __webpack_require__(61)
var Mode = __webpack_require__(2)
var Segments = __webpack_require__(62)
var isArray = __webpack_require__(13)

/**
 * QRCode for JavaScript
 *
 * modified by Ryan Day for nodejs support
 * Copyright (c) 2011 Ryan Day
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
*/

/**
 * Add finder patterns bits to matrix
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */
function setupFinderPattern (matrix, version) {
  var size = matrix.size
  var pos = FinderPattern.getPositions(version)

  for (var i = 0; i < pos.length; i++) {
    var row = pos[i][0]
    var col = pos[i][1]

    for (var r = -1; r <= 7; r++) {
      if (row + r <= -1 || size <= row + r) continue

      for (var c = -1; c <= 7; c++) {
        if (col + c <= -1 || size <= col + c) continue

        if ((r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          matrix.set(row + r, col + c, true, true)
        } else {
          matrix.set(row + r, col + c, false, true)
        }
      }
    }
  }
}

/**
 * Add timing pattern bits to matrix
 *
 * Note: this function must be called before {@link setupAlignmentPattern}
 *
 * @param  {BitMatrix} matrix Modules matrix
 */
function setupTimingPattern (matrix) {
  var size = matrix.size

  for (var r = 8; r < size - 8; r++) {
    var value = r % 2 === 0
    matrix.set(r, 6, value, true)
    matrix.set(6, r, value, true)
  }
}

/**
 * Add alignment patterns bits to matrix
 *
 * Note: this function must be called after {@link setupTimingPattern}
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */
function setupAlignmentPattern (matrix, version) {
  var pos = AlignmentPattern.getPositions(version)

  for (var i = 0; i < pos.length; i++) {
    var row = pos[i][0]
    var col = pos[i][1]

    for (var r = -2; r <= 2; r++) {
      for (var c = -2; c <= 2; c++) {
        if (r === -2 || r === 2 || c === -2 || c === 2 ||
          (r === 0 && c === 0)) {
          matrix.set(row + r, col + c, true, true)
        } else {
          matrix.set(row + r, col + c, false, true)
        }
      }
    }
  }
}

/**
 * Add version info bits to matrix
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */
function setupVersionInfo (matrix, version) {
  var size = matrix.size
  var bits = Version.getEncodedBits(version)
  var row, col, mod

  for (var i = 0; i < 18; i++) {
    row = Math.floor(i / 3)
    col = i % 3 + size - 8 - 3
    mod = ((bits >> i) & 1) === 1

    matrix.set(row, col, mod, true)
    matrix.set(col, row, mod, true)
  }
}

/**
 * Add format info bits to matrix
 *
 * @param  {BitMatrix} matrix               Modules matrix
 * @param  {ErrorCorrectionLevel}    errorCorrectionLevel Error correction level
 * @param  {Number}    maskPattern          Mask pattern reference value
 */
function setupFormatInfo (matrix, errorCorrectionLevel, maskPattern) {
  var size = matrix.size
  var bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern)
  var i, mod

  for (i = 0; i < 15; i++) {
    mod = ((bits >> i) & 1) === 1

    // vertical
    if (i < 6) {
      matrix.set(i, 8, mod, true)
    } else if (i < 8) {
      matrix.set(i + 1, 8, mod, true)
    } else {
      matrix.set(size - 15 + i, 8, mod, true)
    }

    // horizontal
    if (i < 8) {
      matrix.set(8, size - i - 1, mod, true)
    } else if (i < 9) {
      matrix.set(8, 15 - i - 1 + 1, mod, true)
    } else {
      matrix.set(8, 15 - i - 1, mod, true)
    }
  }

  // fixed module
  matrix.set(size - 8, 8, 1, true)
}

/**
 * Add encoded data bits to matrix
 *
 * @param  {BitMatrix} matrix Modules matrix
 * @param  {Buffer}    data   Data codewords
 */
function setupData (matrix, data) {
  var size = matrix.size
  var inc = -1
  var row = size - 1
  var bitIndex = 7
  var byteIndex = 0

  for (var col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--

    while (true) {
      for (var c = 0; c < 2; c++) {
        if (!matrix.isReserved(row, col - c)) {
          var dark = false

          if (byteIndex < data.length) {
            dark = (((data[byteIndex] >>> bitIndex) & 1) === 1)
          }

          matrix.set(row, col - c, dark)
          bitIndex--

          if (bitIndex === -1) {
            byteIndex++
            bitIndex = 7
          }
        }
      }

      row += inc

      if (row < 0 || size <= row) {
        row -= inc
        inc = -inc
        break
      }
    }
  }
}

/**
 * Create encoded codewords from data input
 *
 * @param  {Number}   version              QR Code version
 * @param  {ErrorCorrectionLevel}   errorCorrectionLevel Error correction level
 * @param  {ByteData} data                 Data input
 * @return {Buffer}                        Buffer containing encoded codewords
 */
function createData (version, errorCorrectionLevel, segments) {
  // Prepare data buffer
  var buffer = new BitBuffer()

  segments.forEach(function (data) {
    // prefix data with mode indicator (4 bits)
    buffer.put(data.mode.bit, 4)

    // Prefix data with character count indicator.
    // The character count indicator is a string of bits that represents the
    // number of characters that are being encoded.
    // The character count indicator must be placed after the mode indicator
    // and must be a certain number of bits long, depending on the QR version
    // and data mode
    // @see {@link Mode.getCharCountIndicator}.
    buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version))

    // add binary data sequence to buffer
    data.write(buffer)
  })

  // Calculate required number of bits
  var totalCodewords = Utils.getSymbolTotalCodewords(version)
  var ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)
  var dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8

  // Add a terminator.
  // If the bit string is shorter than the total number of required bits,
  // a terminator of up to four 0s must be added to the right side of the string.
  // If the bit string is more than four bits shorter than the required number of bits,
  // add four 0s to the end.
  if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
    buffer.put(0, 4)
  }

  // If the bit string is fewer than four bits shorter, add only the number of 0s that
  // are needed to reach the required number of bits.

  // After adding the terminator, if the number of bits in the string is not a multiple of 8,
  // pad the string on the right with 0s to make the string's length a multiple of 8.
  while (buffer.getLengthInBits() % 8 !== 0) {
    buffer.putBit(0)
  }

  // Add pad bytes if the string is still shorter than the total number of required bits.
  // Extend the buffer to fill the data capacity of the symbol corresponding to
  // the Version and Error Correction Level by adding the Pad Codewords 11101100 (0xEC)
  // and 00010001 (0x11) alternately.
  var remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8
  for (var i = 0; i < remainingByte; i++) {
    buffer.put(i % 2 ? 0x11 : 0xEC, 8)
  }

  return createCodewords(buffer, version, errorCorrectionLevel)
}

/**
 * Encode input data with Reed-Solomon and return codewords with
 * relative error correction bits
 *
 * @param  {BitBuffer} bitBuffer            Data to encode
 * @param  {Number}    version              QR Code version
 * @param  {ErrorCorrectionLevel} errorCorrectionLevel Error correction level
 * @return {Buffer}                         Buffer containing encoded codewords
 */
function createCodewords (bitBuffer, version, errorCorrectionLevel) {
  // Total codewords for this QR code version (Data + Error correction)
  var totalCodewords = Utils.getSymbolTotalCodewords(version)

  // Total number of error correction codewords
  var ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)

  // Total number of data codewords
  var dataTotalCodewords = totalCodewords - ecTotalCodewords

  // Total number of blocks
  var ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel)

  // Calculate how many blocks each group should contain
  var blocksInGroup2 = totalCodewords % ecTotalBlocks
  var blocksInGroup1 = ecTotalBlocks - blocksInGroup2

  var totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks)

  var dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks)
  var dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1

  // Number of EC codewords is the same for both groups
  var ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1

  // Initialize a Reed-Solomon encoder with a generator polynomial of degree ecCount
  var rs = new ReedSolomonEncoder(ecCount)

  var offset = 0
  var dcData = new Array(ecTotalBlocks)
  var ecData = new Array(ecTotalBlocks)
  var maxDataSize = 0
  var buffer = new Buffer(bitBuffer.buffer)

  // Divide the buffer into the required number of blocks
  for (var b = 0; b < ecTotalBlocks; b++) {
    var dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2

    // extract a block of data from buffer
    dcData[b] = buffer.slice(offset, offset + dataSize)

    // Calculate EC codewords for this data block
    ecData[b] = rs.encode(dcData[b])

    offset += dataSize
    maxDataSize = Math.max(maxDataSize, dataSize)
  }

  // Create final data
  // Interleave the data and error correction codewords from each block
  var data = new Buffer(totalCodewords)
  var index = 0
  var i, r

  // Add data codewords
  for (i = 0; i < maxDataSize; i++) {
    for (r = 0; r < ecTotalBlocks; r++) {
      if (i < dcData[r].length) {
        data[index++] = dcData[r][i]
      }
    }
  }

  // Apped EC codewords
  for (i = 0; i < ecCount; i++) {
    for (r = 0; r < ecTotalBlocks; r++) {
      data[index++] = ecData[r][i]
    }
  }

  return data
}

/**
 * Build QR Code symbol
 *
 * @param  {String} data                 Input string
 * @param  {Number} version              QR Code version
 * @param  {ErrorCorretionLevel} errorCorrectionLevel Error level
 * @param  {MaskPattern} maskPattern     Mask pattern
 * @return {Object}                      Object containing symbol data
 */
function createSymbol (data, version, errorCorrectionLevel, maskPattern) {
  var segments

  if (isArray(data)) {
    segments = Segments.fromArray(data)
  } else if (typeof data === 'string') {
    var estimatedVersion = version

    if (!estimatedVersion) {
      var rawSegments = Segments.rawSplit(data)

      // Estimate best version that can contain raw splitted segments
      estimatedVersion = Version.getBestVersionForData(rawSegments,
        errorCorrectionLevel)
    }

    // Build optimized segments
    // If estimated version is undefined, try with the highest version
    segments = Segments.fromString(data, estimatedVersion || 40)
  } else {
    throw new Error('Invalid data')
  }

  // Get the min version that can contain data
  var bestVersion = Version.getBestVersionForData(segments,
      errorCorrectionLevel)

  // If no version is found, data cannot be stored
  if (!bestVersion) {
    throw new Error('The amount of data is too big to be stored in a QR Code')
  }

  // If not specified, use min version as default
  if (!version) {
    version = bestVersion

  // Check if the specified version can contain the data
  } else if (version < bestVersion) {
    throw new Error('\n' +
      'The chosen QR Code version cannot contain this amount of data.\n' +
      'Minimum version required to store current data is: ' + bestVersion + '.\n'
    )
  }

  var dataBits = createData(version, errorCorrectionLevel, segments)

  // Allocate matrix buffer
  var moduleCount = Utils.getSymbolSize(version)
  var modules = new BitMatrix(moduleCount)

  // Add function modules
  setupFinderPattern(modules, version)
  setupTimingPattern(modules)
  setupAlignmentPattern(modules, version)

  // Add temporary dummy bits for format info just to set them as reserved.
  // This is needed to prevent these bits from being masked by {@link MaskPattern.applyMask}
  // since the masking operation must be performed only on the encoding region.
  // These blocks will be replaced with correct values later in code.
  setupFormatInfo(modules, errorCorrectionLevel, 0)

  if (version >= 7) {
    setupVersionInfo(modules, version)
  }

  // Add data codewords
  setupData(modules, dataBits)

  if (!maskPattern) {
    // Find best mask pattern
    maskPattern = MaskPattern.getBestMask(modules,
      setupFormatInfo.bind(null, modules, errorCorrectionLevel))
  }

  // Apply mask pattern
  MaskPattern.applyMask(maskPattern, modules)

  // Replace format info bits with correct values
  setupFormatInfo(modules, errorCorrectionLevel, maskPattern)

  return {
    modules: modules,
    version: version,
    errorCorrectionLevel: errorCorrectionLevel,
    maskPattern: maskPattern,
    segments: segments
  }
}

/**
 * QR Code
 *
 * @param {String | Array} data                 Input data
 * @param {Object} options                      Optional configurations
 * @param {Number} options.version              QR Code version
 * @param {String} options.errorCorrectionLevel Error correction level
 * @param {Function} options.toSJISFunc         Helper func to convert utf8 to sjis
 */
exports.create = function create (data, options) {
  if (typeof data === 'undefined' || data === '') {
    throw new Error('No input text')
  }

  var errorCorrectionLevel = ECLevel.M
  var version
  var mask

  if (typeof options !== 'undefined') {
    // Use higher error correction level as default
    errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M)
    version = Version.from(options.version)
    mask = MaskPattern.from(options.maskPattern)

    if (options.toSJISFunc) {
      Utils.setToSJISFunction(options.toSJISFunc)
    }
  }

  return createSymbol(data, version, errorCorrectionLevel, mask)
}


/***/ }),
/* 53 */
/***/ (function(module, exports) {

function BitBuffer () {
  this.buffer = []
  this.length = 0
}

BitBuffer.prototype = {

  get: function (index) {
    var bufIndex = Math.floor(index / 8)
    return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1
  },

  put: function (num, length) {
    for (var i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1)
    }
  },

  getLengthInBits: function () {
    return this.length
  },

  putBit: function (bit) {
    var bufIndex = Math.floor(this.length / 8)
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0)
    }

    if (bit) {
      this.buffer[bufIndex] |= (0x80 >>> (this.length % 8))
    }

    this.length++
  }
}

module.exports = BitBuffer


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(6)

/**
 * Helper class to handle QR Code symbol modules
 *
 * @param {Number} size Symbol size
 */
function BitMatrix (size) {
  if (!size || size < 1) {
    throw new Error('BitMatrix size must be defined and greater than 0')
  }

  this.size = size
  this.data = new Buffer(size * size)
  this.data.fill(0)
  this.reservedBit = new Buffer(size * size)
  this.reservedBit.fill(0)
}

/**
 * Set bit value at specified location
 * If reserved flag is set, this bit will be ignored during masking process
 *
 * @param {Number}  row
 * @param {Number}  col
 * @param {Boolean} value
 * @param {Boolean} reserved
 */
BitMatrix.prototype.set = function (row, col, value, reserved) {
  var index = row * this.size + col
  this.data[index] = value
  if (reserved) this.reservedBit[index] = true
}

/**
 * Returns bit value at specified location
 *
 * @param  {Number}  row
 * @param  {Number}  col
 * @return {Boolean}
 */
BitMatrix.prototype.get = function (row, col) {
  return this.data[row * this.size + col]
}

/**
 * Applies xor operator at specified location
 * (used during masking process)
 *
 * @param {Number}  row
 * @param {Number}  col
 * @param {Boolean} value
 */
BitMatrix.prototype.xor = function (row, col, value) {
  this.data[row * this.size + col] ^= value
}

/**
 * Check if bit at specified location is reserved
 *
 * @param {Number}   row
 * @param {Number}   col
 * @return {Boolean}
 */
BitMatrix.prototype.isReserved = function (row, col) {
  return this.reservedBit[row * this.size + col]
}

module.exports = BitMatrix


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Alignment pattern are fixed reference pattern in defined positions
 * in a matrix symbology, which enables the decode software to re-synchronise
 * the coordinate mapping of the image modules in the event of moderate amounts
 * of distortion of the image.
 *
 * Alignment patterns are present only in QR Code symbols of version 2 or larger
 * and their number depends on the symbol version.
 */

var getSymbolSize = __webpack_require__(1).getSymbolSize

/**
 * Calculate the row/column coordinates of the center module of each alignment pattern
 * for the specified QR Code version.
 *
 * The alignment patterns are positioned symmetrically on either side of the diagonal
 * running from the top left corner of the symbol to the bottom right corner.
 *
 * Since positions are simmetrical only half of the coordinates are returned.
 * Each item of the array will represent in turn the x and y coordinate.
 * @see {@link getPositions}
 *
 * @param  {Number} version QR Code version
 * @return {Array}          Array of coordinate
 */
exports.getRowColCoords = function getRowColCoords (version) {
  if (version === 1) return []

  var posCount = Math.floor(version / 7) + 2
  var size = getSymbolSize(version)
  var intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2
  var positions = [size - 7] // Last coord is always (size - 7)

  for (var i = 1; i < posCount - 1; i++) {
    positions[i] = positions[i - 1] - intervals
  }

  positions.push(6) // First coord is always 6

  return positions.reverse()
}

/**
 * Returns an array containing the positions of each alignment pattern.
 * Each array's element represent the center point of the pattern as (x, y) coordinates
 *
 * Coordinates are calculated expanding the row/column coordinates returned by {@link getRowColCoords}
 * and filtering out the items that overlaps with finder pattern
 *
 * @example
 * For a Version 7 symbol {@link getRowColCoords} returns values 6, 22 and 38.
 * The alignment patterns, therefore, are to be centered on (row, column)
 * positions (6,22), (22,6), (22,22), (22,38), (38,22), (38,38).
 * Note that the coordinates (6,6), (6,38), (38,6) are occupied by finder patterns
 * and are not therefore used for alignment patterns.
 *
 * var pos = getPositions(7)
 * // [[6,22], [22,6], [22,22], [22,38], [38,22], [38,38]]
 *
 * @param  {Number} version QR Code version
 * @return {Array}          Array of coordinates
 */
exports.getPositions = function getPositions (version) {
  var coords = []
  var pos = exports.getRowColCoords(version)
  var posLength = pos.length

  for (var i = 0; i < posLength; i++) {
    for (var j = 0; j < posLength; j++) {
      // Skip if position is occupied by finder patterns
      if ((i === 0 && j === 0) ||             // top-left
          (i === 0 && j === posLength - 1) || // bottom-left
          (i === posLength - 1 && j === 0)) { // top-right
        continue
      }

      coords.push([pos[i], pos[j]])
    }
  }

  return coords
}


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var getSymbolSize = __webpack_require__(1).getSymbolSize
var FINDER_PATTERN_SIZE = 7

/**
 * Returns an array containing the positions of each finder pattern.
 * Each array's element represent the top-left point of the pattern as (x, y) coordinates
 *
 * @param  {Number} version QR Code version
 * @return {Array}          Array of coordinates
 */
exports.getPositions = function getPositions (version) {
  var size = getSymbolSize(version)

  return [
    // top-left
    [0, 0],
    // top-right
    [size - FINDER_PATTERN_SIZE, 0],
    // bottom-left
    [0, size - FINDER_PATTERN_SIZE]
  ]
}


/***/ }),
/* 57 */
/***/ (function(module, exports) {

/**
 * Data mask pattern reference
 * @type {Object}
 */
exports.Patterns = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7
}

/**
 * Weighted penalty scores for the undesirable features
 * @type {Object}
 */
var PenaltyScores = {
  N1: 3,
  N2: 3,
  N3: 40,
  N4: 10
}

/**
 * Check if mask pattern value is valid
 *
 * @param  {Number}  mask    Mask pattern
 * @return {Boolean}         true if valid, false otherwise
 */
exports.isValid = function isValid (mask) {
  return mask && mask !== '' && !isNaN(mask) && mask >= 0 && mask <= 7
}

/**
 * Returns mask pattern from a value.
 * If value is not valid, returns undefined
 *
 * @param  {Number|String} value        Mask pattern value
 * @return {Number}                     Valid mask pattern or undefined
 */
exports.from = function from (value) {
  return exports.isValid(value) ? parseInt(value, 10) : undefined
}

/**
* Find adjacent modules in row/column with the same color
* and assign a penalty value.
*
* Points: N1 + i
* i is the amount by which the number of adjacent modules of the same color exceeds 5
*/
exports.getPenaltyN1 = function getPenaltyN1 (data) {
  var size = data.size
  var points = 0
  var sameCountCol = 0
  var sameCountRow = 0
  var lastCol = null
  var lastRow = null

  for (var row = 0; row < size; row++) {
    sameCountCol = sameCountRow = 0
    lastCol = lastRow = null

    for (var col = 0; col < size; col++) {
      var module = data.get(row, col)
      if (module === lastCol) {
        sameCountCol++
      } else {
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5)
        lastCol = module
        sameCountCol = 1
      }

      module = data.get(col, row)
      if (module === lastRow) {
        sameCountRow++
      } else {
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5)
        lastRow = module
        sameCountRow = 1
      }
    }

    if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5)
    if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5)
  }

  return points
}

/**
 * Find 2x2 blocks with the same color and assign a penalty value
 *
 * Points: N2 * (m - 1) * (n - 1)
 */
exports.getPenaltyN2 = function getPenaltyN2 (data) {
  var size = data.size
  var points = 0

  for (var row = 0; row < size - 1; row++) {
    for (var col = 0; col < size - 1; col++) {
      var last = data.get(row, col) +
        data.get(row, col + 1) +
        data.get(row + 1, col) +
        data.get(row + 1, col + 1)

      if (last === 4 || last === 0) points++
    }
  }

  return points * PenaltyScores.N2
}

/**
 * Find 1:1:3:1:1 ratio (dark:light:dark:light:dark) pattern in row/column,
 * preceded or followed by light area 4 modules wide
 *
 * Points: N3 * number of pattern found
 */
exports.getPenaltyN3 = function getPenaltyN3 (data) {
  var size = data.size
  var points = 0
  var bitsCol = 0
  var bitsRow = 0

  for (var row = 0; row < size; row++) {
    bitsCol = bitsRow = 0
    for (var col = 0; col < size; col++) {
      bitsCol = ((bitsCol << 1) & 0x7FF) | data.get(row, col)
      if (col >= 10 && (bitsCol === 0x5D0 || bitsCol === 0x05D)) points++

      bitsRow = ((bitsRow << 1) & 0x7FF) | data.get(col, row)
      if (col >= 10 && (bitsRow === 0x5D0 || bitsRow === 0x05D)) points++
    }
  }

  return points * PenaltyScores.N3
}

/**
 * Calculate proportion of dark modules in entire symbol
 *
 * Points: N4 * k
 *
 * k is the rating of the deviation of the proportion of dark modules
 * in the symbol from 50% in steps of 5%
 */
exports.getPenaltyN4 = function getPenaltyN4 (data) {
  var darkCount = 0
  var modulesCount = data.data.length

  for (var i = 0; i < modulesCount; i++) darkCount += data.data[i]

  var k = Math.abs(Math.ceil((darkCount * 100 / modulesCount) / 5) - 10)

  return k * PenaltyScores.N4
}

/**
 * Return mask value at given position
 *
 * @param  {Number} maskPattern Pattern reference value
 * @param  {Number} i           Row
 * @param  {Number} j           Column
 * @return {Boolean}            Mask value
 */
function getMaskAt (maskPattern, i, j) {
  switch (maskPattern) {
    case exports.Patterns.PATTERN000: return (i + j) % 2 === 0
    case exports.Patterns.PATTERN001: return i % 2 === 0
    case exports.Patterns.PATTERN010: return j % 3 === 0
    case exports.Patterns.PATTERN011: return (i + j) % 3 === 0
    case exports.Patterns.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
    case exports.Patterns.PATTERN101: return (i * j) % 2 + (i * j) % 3 === 0
    case exports.Patterns.PATTERN110: return ((i * j) % 2 + (i * j) % 3) % 2 === 0
    case exports.Patterns.PATTERN111: return ((i * j) % 3 + (i + j) % 2) % 2 === 0

    default: throw new Error('bad maskPattern:' + maskPattern)
  }
}

/**
 * Apply a mask pattern to a BitMatrix
 *
 * @param  {Number}    pattern Pattern reference number
 * @param  {BitMatrix} data    BitMatrix data
 */
exports.applyMask = function applyMask (pattern, data) {
  var size = data.size

  for (var col = 0; col < size; col++) {
    for (var row = 0; row < size; row++) {
      if (data.isReserved(row, col)) continue
      data.xor(row, col, getMaskAt(pattern, row, col))
    }
  }
}

/**
 * Returns the best mask pattern for data
 *
 * @param  {BitMatrix} data
 * @return {Number} Mask pattern reference number
 */
exports.getBestMask = function getBestMask (data, setupFormatFunc) {
  var numPatterns = Object.keys(exports.Patterns).length
  var bestPattern = 0
  var lowerPenalty = Infinity

  for (var p = 0; p < numPatterns; p++) {
    setupFormatFunc(p)
    exports.applyMask(p, data)

    // Calculate penalty
    var penalty =
      exports.getPenaltyN1(data) +
      exports.getPenaltyN2(data) +
      exports.getPenaltyN3(data) +
      exports.getPenaltyN4(data)

    // Undo previously applied mask
    exports.applyMask(p, data)

    if (penalty < lowerPenalty) {
      lowerPenalty = penalty
      bestPattern = p
    }
  }

  return bestPattern
}


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(6)
var Polynomial = __webpack_require__(59)

function ReedSolomonEncoder (degree) {
  this.genPoly = undefined
  this.degree = degree

  if (this.degree) this.initialize(this.degree)
}

/**
 * Initialize the encoder.
 * The input param should correspond to the number of error correction codewords.
 *
 * @param  {Number} degree
 */
ReedSolomonEncoder.prototype.initialize = function initialize (degree) {
  // create an irreducible generator polynomial
  this.degree = degree
  this.genPoly = Polynomial.generateECPolynomial(this.degree)
}

/**
 * Encodes a chunk of data
 *
 * @param  {Buffer} data Buffer containing input data
 * @return {Buffer}      Buffer containing encoded data
 */
ReedSolomonEncoder.prototype.encode = function encode (data) {
  if (!this.genPoly) {
    throw new Error('Encoder not initialized')
  }

  // Calculate EC for this data block
  // extends data size to data+genPoly size
  var pad = new Buffer(this.degree)
  pad.fill(0)
  var paddedData = Buffer.concat([data, pad], data.length + this.degree)

  // The error correction codewords are the remainder after dividing the data codewords
  // by a generator polynomial
  var remainder = Polynomial.mod(paddedData, this.genPoly)

  // return EC data blocks (last n byte, where n is the degree of genPoly)
  // If coefficients number in remainder are less than genPoly degree,
  // pad with 0s to the left to reach the needed number of coefficients
  var start = this.degree - remainder.length
  if (start > 0) {
    var buff = new Buffer(this.degree)
    buff.fill(0)
    remainder.copy(buff, start)

    return buff
  }

  return remainder
}

module.exports = ReedSolomonEncoder


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(6)
var GF = __webpack_require__(60)

/**
 * Multiplies two polynomials inside Galois Field
 *
 * @param  {Buffer} p1 Polynomial
 * @param  {Buffer} p2 Polynomial
 * @return {Buffer}    Product of p1 and p2
 */
exports.mul = function mul (p1, p2) {
  var coeff = new Buffer(p1.length + p2.length - 1)
  coeff.fill(0)

  for (var i = 0; i < p1.length; i++) {
    for (var j = 0; j < p2.length; j++) {
      coeff[i + j] ^= GF.mul(p1[i], p2[j])
    }
  }

  return coeff
}

/**
 * Calculate the remainder of polynomials division
 *
 * @param  {Buffer} divident Polynomial
 * @param  {Buffer} divisor  Polynomial
 * @return {Buffer}          Remainder
 */
exports.mod = function mod (divident, divisor) {
  var result = new Buffer(divident)

  while ((result.length - divisor.length) >= 0) {
    var coeff = result[0]

    for (var i = 0; i < divisor.length; i++) {
      result[i] ^= GF.mul(divisor[i], coeff)
    }

    // remove all zeros from buffer head
    var offset = 0
    while (offset < result.length && result[offset] === 0) offset++
    result = result.slice(offset)
  }

  return result
}

/**
 * Generate an irreducible generator polynomial of specified degree
 * (used by Reed-Solomon encoder)
 *
 * @param  {Number} degree Degree of the generator polynomial
 * @return {Buffer}        Buffer containing polynomial coefficients
 */
exports.generateECPolynomial = function generateECPolynomial (degree) {
  var poly = new Buffer([1])
  for (var i = 0; i < degree; i++) {
    poly = exports.mul(poly, [1, GF.exp(i)])
  }

  return poly
}


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(6)

var EXP_TABLE = new Buffer(512)
var LOG_TABLE = new Buffer(256)

/**
 * Precompute the log and anti-log tables for faster computation later
 *
 * For each possible value in the galois field 2^8, we will pre-compute
 * the logarithm and anti-logarithm (exponential) of this value
 *
 * ref {@link https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders#Introduction_to_mathematical_fields}
 */
;(function initTables () {
  var x = 1
  for (var i = 0; i < 255; i++) {
    EXP_TABLE[i] = x
    LOG_TABLE[x] = i

    x <<= 1 // multiply by 2

    // The QR code specification says to use byte-wise modulo 100011101 arithmetic.
    // This means that when a number is 256 or larger, it should be XORed with 0x11D.
    if (x & 0x100) { // similar to x >= 256, but a lot faster (because 0x100 == 256)
      x ^= 0x11D
    }
  }

  // Optimization: double the size of the anti-log table so that we don't need to mod 255 to
  // stay inside the bounds (because we will mainly use this table for the multiplication of
  // two GF numbers, no more).
  // @see {@link mul}
  for (i = 255; i < 512; i++) {
    EXP_TABLE[i] = EXP_TABLE[i - 255]
  }
}())

/**
 * Returns log value of n inside Galois Field
 *
 * @param  {Number} n
 * @return {Number}
 */
exports.log = function log (n) {
  if (n < 1) throw new Error('log(' + n + ')')
  return LOG_TABLE[n]
}

/**
 * Returns anti-log value of n inside Galois Field
 *
 * @param  {Number} n
 * @return {Number}
 */
exports.exp = function exp (n) {
  return EXP_TABLE[n]
}

/**
 * Multiplies two number inside Galois Field
 *
 * @param  {Number} x
 * @param  {Number} y
 * @return {Number}
 */
exports.mul = function mul (x, y) {
  if (x === 0 || y === 0) return 0

  // should be EXP_TABLE[(LOG_TABLE[x] + LOG_TABLE[y]) % 255] if EXP_TABLE wasn't oversized
  // @see {@link initTables}
  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]]
}


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(1)

var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0)
var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1)
var G15_BCH = Utils.getBCHDigit(G15)

/**
 * Returns format information with relative error correction bits
 *
 * The format information is a 15-bit sequence containing 5 data bits,
 * with 10 error correction bits calculated using the (15, 5) BCH code.
 *
 * @param  {Number} errorCorrectionLevel Error correction level
 * @param  {Number} mask                 Mask pattern
 * @return {Number}                      Encoded format information bits
 */
exports.getEncodedBits = function getEncodedBits (errorCorrectionLevel, mask) {
  var data = ((errorCorrectionLevel.bit << 3) | mask)
  var d = data << 10

  while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
    d ^= (G15 << (Utils.getBCHDigit(d) - G15_BCH))
  }

  // xor final data with mask pattern in order to ensure that
  // no combination of Error Correction Level and data mask pattern
  // will result in an all-zero data string
  return ((data << 10) | d) ^ G15_MASK
}


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var Mode = __webpack_require__(2)
var NumericData = __webpack_require__(63)
var AlphanumericData = __webpack_require__(64)
var ByteData = __webpack_require__(65)
var KanjiData = __webpack_require__(66)
var Regex = __webpack_require__(24)
var Utils = __webpack_require__(1)
var dijkstra = __webpack_require__(67)

/**
 * Returns UTF8 byte length
 *
 * @param  {String} str Input string
 * @return {Number}     Number of byte
 */
function getStringByteLength (str) {
  return unescape(encodeURIComponent(str)).length
}

/**
 * Get a list of segments of the specified mode
 * from a string
 *
 * @param  {Mode}   mode Segment mode
 * @param  {String} str  String to process
 * @return {Array}       Array of object with segments data
 */
function getSegments (regex, mode, str) {
  var segments = []
  var result

  while ((result = regex.exec(str)) !== null) {
    segments.push({
      data: result[0],
      index: result.index,
      mode: mode,
      length: result[0].length
    })
  }

  return segments
}

/**
 * Extracts a series of segments with the appropriate
 * modes from a string
 *
 * @param  {String} dataStr Input string
 * @return {Array}          Array of object with segments data
 */
function getSegmentsFromString (dataStr) {
  var numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr)
  var alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr)
  var byteSegs
  var kanjiSegs

  if (Utils.isKanjiModeEnabled()) {
    byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr)
    kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr)
  } else {
    byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr)
    kanjiSegs = []
  }

  var segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs)

  return segs
    .sort(function (s1, s2) {
      return s1.index - s2.index
    })
    .map(function (obj) {
      return {
        data: obj.data,
        mode: obj.mode,
        length: obj.length
      }
    })
}

/**
 * Returns how many bits are needed to encode a string of
 * specified length with the specified mode
 *
 * @param  {Number} length String length
 * @param  {Mode} mode     Segment mode
 * @return {Number}        Bit length
 */
function getSegmentBitsLength (length, mode) {
  switch (mode) {
    case Mode.NUMERIC:
      return NumericData.getBitsLength(length)
    case Mode.ALPHANUMERIC:
      return AlphanumericData.getBitsLength(length)
    case Mode.KANJI:
      return KanjiData.getBitsLength(length)
    case Mode.BYTE:
      return ByteData.getBitsLength(length)
  }
}

/**
 * Merges adjacent segments which have the same mode
 *
 * @param  {Array} segs Array of object with segments data
 * @return {Array}      Array of object with segments data
 */
function mergeSegments (segs) {
  return segs.reduce(function (acc, curr) {
    var prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null
    if (prevSeg && prevSeg.mode === curr.mode) {
      acc[acc.length - 1].data += curr.data
      return acc
    }

    acc.push(curr)
    return acc
  }, [])
}

/**
 * Generates a list of all possible nodes combination which
 * will be used to build a segments graph.
 *
 * Nodes are divided by groups. Each group will contain a list of all the modes
 * in which is possible to encode the given text.
 *
 * For example the text '12345' can be encoded as Numeric, Alphanumeric or Byte.
 * The group for '12345' will contain then 3 objects, one for each
 * possible encoding mode.
 *
 * Each node represents a possible segment.
 *
 * @param  {Array} segs Array of object with segments data
 * @return {Array}      Array of object with segments data
 */
function buildNodes (segs) {
  var nodes = []
  for (var i = 0; i < segs.length; i++) {
    var seg = segs[i]

    switch (seg.mode) {
      case Mode.NUMERIC:
        nodes.push([seg,
          { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
          { data: seg.data, mode: Mode.BYTE, length: seg.length }
        ])
        break
      case Mode.ALPHANUMERIC:
        nodes.push([seg,
          { data: seg.data, mode: Mode.BYTE, length: seg.length }
        ])
        break
      case Mode.KANJI:
        nodes.push([seg,
          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
        ])
        break
      case Mode.BYTE:
        nodes.push([
          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
        ])
    }
  }

  return nodes
}

/**
 * Builds a graph from a list of nodes.
 * All segments in each node group will be connected with all the segments of
 * the next group and so on.
 *
 * At each connection will be assigned a weight depending on the
 * segment's byte length.
 *
 * @param  {Array} nodes    Array of object with segments data
 * @param  {Number} version QR Code version
 * @return {Object}         Graph of all possible segments
 */
function buildGraph (nodes, version) {
  var table = {}
  var graph = {'start': {}}
  var prevNodeIds = ['start']

  for (var i = 0; i < nodes.length; i++) {
    var nodeGroup = nodes[i]
    var currentNodeIds = []

    for (var j = 0; j < nodeGroup.length; j++) {
      var node = nodeGroup[j]
      var key = '' + i + j

      currentNodeIds.push(key)
      table[key] = { node: node, lastCount: 0 }
      graph[key] = {}

      for (var n = 0; n < prevNodeIds.length; n++) {
        var prevNodeId = prevNodeIds[n]

        if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
          graph[prevNodeId][key] =
            getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) -
            getSegmentBitsLength(table[prevNodeId].lastCount, node.mode)

          table[prevNodeId].lastCount += node.length
        } else {
          if (table[prevNodeId]) table[prevNodeId].lastCount = node.length

          graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) +
            4 + Mode.getCharCountIndicator(node.mode, version) // switch cost
        }
      }
    }

    prevNodeIds = currentNodeIds
  }

  for (n = 0; n < prevNodeIds.length; n++) {
    graph[prevNodeIds[n]]['end'] = 0
  }

  return { map: graph, table: table }
}

/**
 * Builds a segment from a specified data and mode.
 * If a mode is not specified, the more suitable will be used.
 *
 * @param  {String} data             Input data
 * @param  {Mode | String} modesHint Data mode
 * @return {Segment}                 Segment
 */
function buildSingleSegment (data, modesHint) {
  var mode
  var bestMode = Mode.getBestModeForData(data)

  mode = Mode.from(modesHint, bestMode)

  // Make sure data can be encoded
  if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
    throw new Error('"' + data + '"' +
      ' cannot be encoded with mode ' + Mode.toString(mode) +
      '.\n Suggested mode is: ' + Mode.toString(bestMode))
  }

  // Use Mode.BYTE if Kanji support is disabled
  if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
    mode = Mode.BYTE
  }

  switch (mode) {
    case Mode.NUMERIC:
      return new NumericData(data)

    case Mode.ALPHANUMERIC:
      return new AlphanumericData(data)

    case Mode.KANJI:
      return new KanjiData(data)

    case Mode.BYTE:
      return new ByteData(data)
  }
}

/**
 * Builds a list of segments from an array.
 * Array can contain Strings or Objects with segment's info.
 *
 * For each item which is a string, will be generated a segment with the given
 * string and the more appropriate encoding mode.
 *
 * For each item which is an object, will be generated a segment with the given
 * data and mode.
 * Objects must contain at least the property "data".
 * If property "mode" is not present, the more suitable mode will be used.
 *
 * @param  {Array} array Array of objects with segments data
 * @return {Array}       Array of Segments
 */
exports.fromArray = function fromArray (array) {
  return array.reduce(function (acc, seg) {
    if (typeof seg === 'string') {
      acc.push(buildSingleSegment(seg, null))
    } else if (seg.data) {
      acc.push(buildSingleSegment(seg.data, seg.mode))
    }

    return acc
  }, [])
}

/**
 * Builds an optimized sequence of segments from a string,
 * which will produce the shortest possible bitstream.
 *
 * @param  {String} data    Input string
 * @param  {Number} version QR Code version
 * @return {Array}          Array of segments
 */
exports.fromString = function fromString (data, version) {
  var segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled())

  var nodes = buildNodes(segs)
  var graph = buildGraph(nodes, version)
  var path = dijkstra.find_path(graph.map, 'start', 'end')

  var optimizedSegs = []
  for (var i = 1; i < path.length - 1; i++) {
    optimizedSegs.push(graph.table[path[i]].node)
  }

  return exports.fromArray(mergeSegments(optimizedSegs))
}

/**
 * Splits a string in various segments with the modes which
 * best represent their content.
 * The produced segments are far from being optimized.
 * The output of this function is only used to estimate a QR Code version
 * which may contain the data.
 *
 * @param  {string} data Input string
 * @return {Array}       Array of segments
 */
exports.rawSplit = function rawSplit (data) {
  return exports.fromArray(
    getSegmentsFromString(data, Utils.isKanjiModeEnabled())
  )
}


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var Mode = __webpack_require__(2)

function NumericData (data) {
  this.mode = Mode.NUMERIC
  this.data = data.toString()
}

NumericData.getBitsLength = function getBitsLength (length) {
  return 10 * Math.floor(length / 3) + ((length % 3) ? ((length % 3) * 3 + 1) : 0)
}

NumericData.prototype.getLength = function getLength () {
  return this.data.length
}

NumericData.prototype.getBitsLength = function getBitsLength () {
  return NumericData.getBitsLength(this.data.length)
}

NumericData.prototype.write = function write (bitBuffer) {
  var i, group, value

  // The input data string is divided into groups of three digits,
  // and each group is converted to its 10-bit binary equivalent.
  for (i = 0; i + 3 <= this.data.length; i += 3) {
    group = this.data.substr(i, 3)
    value = parseInt(group, 10)

    bitBuffer.put(value, 10)
  }

  // If the number of input digits is not an exact multiple of three,
  // the final one or two digits are converted to 4 or 7 bits respectively.
  var remainingNum = this.data.length - i
  if (remainingNum > 0) {
    group = this.data.substr(i)
    value = parseInt(group, 10)

    bitBuffer.put(value, remainingNum * 3 + 1)
  }
}

module.exports = NumericData


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var Mode = __webpack_require__(2)

/**
 * Array of characters available in alphanumeric mode
 *
 * As per QR Code specification, to each character
 * is assigned a value from 0 to 44 which in this case coincides
 * with the array index
 *
 * @type {Array}
 */
var ALPHA_NUM_CHARS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ' ', '$', '%', '*', '+', '-', '.', '/', ':'
]

function AlphanumericData (data) {
  this.mode = Mode.ALPHANUMERIC
  this.data = data
}

AlphanumericData.getBitsLength = function getBitsLength (length) {
  return 11 * Math.floor(length / 2) + 6 * (length % 2)
}

AlphanumericData.prototype.getLength = function getLength () {
  return this.data.length
}

AlphanumericData.prototype.getBitsLength = function getBitsLength () {
  return AlphanumericData.getBitsLength(this.data.length)
}

AlphanumericData.prototype.write = function write (bitBuffer) {
  var i

  // Input data characters are divided into groups of two characters
  // and encoded as 11-bit binary codes.
  for (i = 0; i + 2 <= this.data.length; i += 2) {
    // The character value of the first character is multiplied by 45
    var value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45

    // The character value of the second digit is added to the product
    value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1])

    // The sum is then stored as 11-bit binary number
    bitBuffer.put(value, 11)
  }

  // If the number of input data characters is not a multiple of two,
  // the character value of the final character is encoded as a 6-bit binary number.
  if (this.data.length % 2) {
    bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6)
  }
}

module.exports = AlphanumericData


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(6)
var Mode = __webpack_require__(2)

function ByteData (data) {
  this.mode = Mode.BYTE
  this.data = new Buffer(data)
}

ByteData.getBitsLength = function getBitsLength (length) {
  return length * 8
}

ByteData.prototype.getLength = function getLength () {
  return this.data.length
}

ByteData.prototype.getBitsLength = function getBitsLength () {
  return ByteData.getBitsLength(this.data.length)
}

ByteData.prototype.write = function (bitBuffer) {
  for (var i = 0, l = this.data.length; i < l; i++) {
    bitBuffer.put(this.data[i], 8)
  }
}

module.exports = ByteData


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var Mode = __webpack_require__(2)
var Utils = __webpack_require__(1)

function KanjiData (data) {
  this.mode = Mode.KANJI
  this.data = data
}

KanjiData.getBitsLength = function getBitsLength (length) {
  return length * 13
}

KanjiData.prototype.getLength = function getLength () {
  return this.data.length
}

KanjiData.prototype.getBitsLength = function getBitsLength () {
  return KanjiData.getBitsLength(this.data.length)
}

KanjiData.prototype.write = function (bitBuffer) {
  var i

  // In the Shift JIS system, Kanji characters are represented by a two byte combination.
  // These byte values are shifted from the JIS X 0208 values.
  // JIS X 0208 gives details of the shift coded representation.
  for (i = 0; i < this.data.length; i++) {
    var value = Utils.toSJIS(this.data[i])

    // For characters with Shift JIS values from 0x8140 to 0x9FFC:
    if (value >= 0x8140 && value <= 0x9FFC) {
      // Subtract 0x8140 from Shift JIS value
      value -= 0x8140

    // For characters with Shift JIS values from 0xE040 to 0xEBBF
    } else if (value >= 0xE040 && value <= 0xEBBF) {
      // Subtract 0xC140 from Shift JIS value
      value -= 0xC140
    } else {
      throw new Error(
        'Invalid SJIS character: ' + this.data[i] + '\n' +
        'Make sure your charset is UTF-8')
    }

    // Multiply most significant byte of result by 0xC0
    // and add least significant byte to product
    value = (((value >>> 8) & 0xff) * 0xC0) + (value & 0xff)

    // Convert result to a 13-bit binary string
    bitBuffer.put(value, 13)
  }
}

module.exports = KanjiData


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/******************************************************************************
 * Created 2008-08-19.
 *
 * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
 *
 * Copyright (C) 2008
 *   Wyatt Baldwin <self@wyattbaldwin.com>
 *   All rights reserved
 *
 * Licensed under the MIT license.
 *
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *****************************************************************************/
var dijkstra = {
  single_source_shortest_paths: function(graph, s, d) {
    // Predecessor map for each node that has been encountered.
    // node ID => predecessor node ID
    var predecessors = {};

    // Costs of shortest paths from s to all nodes encountered.
    // node ID => cost
    var costs = {};
    costs[s] = 0;

    // Costs of shortest paths from s to all nodes encountered; differs from
    // `costs` in that it provides easy access to the node that currently has
    // the known shortest path from s.
    // XXX: Do we actually need both `costs` and `open`?
    var open = dijkstra.PriorityQueue.make();
    open.push(s, 0);

    var closest,
        u, v,
        cost_of_s_to_u,
        adjacent_nodes,
        cost_of_e,
        cost_of_s_to_u_plus_cost_of_e,
        cost_of_s_to_v,
        first_visit;
    while (!open.empty()) {
      // In the nodes remaining in graph that have a known cost from s,
      // find the node, u, that currently has the shortest path from s.
      closest = open.pop();
      u = closest.value;
      cost_of_s_to_u = closest.cost;

      // Get nodes adjacent to u...
      adjacent_nodes = graph[u] || {};

      // ...and explore the edges that connect u to those nodes, updating
      // the cost of the shortest paths to any or all of those nodes as
      // necessary. v is the node across the current edge from u.
      for (v in adjacent_nodes) {
        if (adjacent_nodes.hasOwnProperty(v)) {
          // Get the cost of the edge running from u to v.
          cost_of_e = adjacent_nodes[v];

          // Cost of s to u plus the cost of u to v across e--this is *a*
          // cost from s to v that may or may not be less than the current
          // known cost to v.
          cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;

          // If we haven't visited v yet OR if the current known cost from s to
          // v is greater than the new cost we just found (cost of s to u plus
          // cost of u to v across e), update v's cost in the cost list and
          // update v's predecessor in the predecessor list (it's now u).
          cost_of_s_to_v = costs[v];
          first_visit = (typeof costs[v] === 'undefined');
          if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
            costs[v] = cost_of_s_to_u_plus_cost_of_e;
            open.push(v, cost_of_s_to_u_plus_cost_of_e);
            predecessors[v] = u;
          }
        }
      }
    }

    if (typeof d !== 'undefined' && typeof costs[d] === 'undefined') {
      var msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
      throw new Error(msg);
    }

    return predecessors;
  },

  extract_shortest_path_from_predecessor_list: function(predecessors, d) {
    var nodes = [];
    var u = d;
    var predecessor;
    while (u) {
      nodes.push(u);
      predecessor = predecessors[u];
      u = predecessors[u];
    }
    nodes.reverse();
    return nodes;
  },

  find_path: function(graph, s, d) {
    var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
    return dijkstra.extract_shortest_path_from_predecessor_list(
      predecessors, d);
  },

  /**
   * A very naive priority queue implementation.
   */
  PriorityQueue: {
    make: function (opts) {
      var T = dijkstra.PriorityQueue,
          t = {},
          key;
      opts = opts || {};
      for (key in T) {
        if (T.hasOwnProperty(key)) {
          t[key] = T[key];
        }
      }
      t.queue = [];
      t.sorter = opts.sorter || T.default_sorter;
      return t;
    },

    default_sorter: function (a, b) {
      return a.cost - b.cost;
    },

    /**
     * Add a new item to the queue and ensure the highest priority element
     * is at the front of the queue.
     */
    push: function (value, cost) {
      var item = {value: value, cost: cost};
      this.queue.push(item);
      this.queue.sort(this.sorter);
    },

    /**
     * Return the highest priority element in the queue.
     */
    pop: function () {
      return this.queue.shift();
    },

    empty: function () {
      return this.queue.length === 0;
    }
  }
};


// node.js module exports
if (true) {
  module.exports = dijkstra;
}


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(25)

function clearCanvas (ctx, canvas, size) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!canvas.style) canvas.style = {}
  canvas.height = size
  canvas.width = size
  canvas.style.height = size + 'px'
  canvas.style.width = size + 'px'
}

function getCanvasElement () {
  try {
    return document.createElement('canvas')
  } catch (e) {
    throw new Error('You need to specify a canvas element')
  }
}

exports.render = function render (qrData, canvas, options) {
  var opts = options
  var canvasEl = canvas

  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
    opts = canvas
    canvas = undefined
  }

  if (!canvas) {
    canvasEl = getCanvasElement()
  }

  opts = Utils.getOptions(opts)
  var size = Utils.getImageWidth(qrData.modules.size, opts)

  var ctx = canvasEl.getContext('2d')
  var image = ctx.createImageData(size, size)
  Utils.qrToImageData(image.data, qrData, opts)

  clearCanvas(ctx, canvasEl, size)
  ctx.putImageData(image, 0, 0)

  return canvasEl
}

exports.renderToDataURL = function renderToDataURL (qrData, canvas, options) {
  var opts = options

  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
    opts = canvas
    canvas = undefined
  }

  if (!opts) opts = {}

  var canvasEl = exports.render(qrData, canvas, opts)

  var type = opts.type || 'image/png'
  var rendererOpts = opts.rendererOpts || {}

  return canvasEl.toDataURL(type, rendererOpts.quality)
}


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(25)

function getColorAttrib (color, attrib) {
  var alpha = color.a / 255
  var str = attrib + '="' + color.hex + '"'

  return alpha < 1
    ? str + ' ' + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"'
    : str
}

function svgCmd (cmd, x, y) {
  var str = cmd + x
  if (typeof y !== 'undefined') str += ' ' + y

  return str
}

function qrToPath (data, size, margin) {
  var path = ''
  var moveBy = 0
  var newRow = false
  var lineLength = 0

  for (var i = 0; i < data.length; i++) {
    var col = Math.floor(i % size)
    var row = Math.floor(i / size)

    if (!col && !newRow) newRow = true

    if (data[i]) {
      lineLength++

      if (!(i > 0 && col > 0 && data[i - 1])) {
        path += newRow
          ? svgCmd('M', col + margin, 0.5 + row + margin)
          : svgCmd('m', moveBy, 0)

        moveBy = 0
        newRow = false
      }

      if (!(col + 1 < size && data[i + 1])) {
        path += svgCmd('h', lineLength)
        lineLength = 0
      }
    } else {
      moveBy++
    }
  }

  return path
}

exports.render = function render (qrData, options, cb) {
  var opts = Utils.getOptions(options)
  var size = qrData.modules.size
  var data = qrData.modules.data
  var qrcodesize = size + opts.margin * 2

  var bg = !opts.color.light.a
    ? ''
    : '<path ' + getColorAttrib(opts.color.light, 'fill') +
      ' d="M0 0h' + qrcodesize + 'v' + qrcodesize + 'H0z"/>'

  var path =
    '<path ' + getColorAttrib(opts.color.dark, 'stroke') +
    ' d="' + qrToPath(data, size, opts.margin) + '"/>'

  var viewBox = 'viewBox="' + '0 0 ' + qrcodesize + ' ' + qrcodesize + '"'

  var width = !opts.width ? '' : 'width="' + opts.width + '" height="' + opts.width + '" '

  var svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + '>' + bg + path + '</svg>'

  if (typeof cb === 'function') {
    cb(null, svgTag)
  }

  return svgTag
}


/***/ })
/******/ ]);
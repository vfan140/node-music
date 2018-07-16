module.exports =
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/debug/src/browser.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * This is the web browser implementation of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = __webpack_require__(/*! ./debug */ \"./node_modules/debug/src/debug.js\");\nexports.log = log;\nexports.formatArgs = formatArgs;\nexports.save = save;\nexports.load = load;\nexports.useColors = useColors;\nexports.storage = 'undefined' != typeof chrome\n               && 'undefined' != typeof chrome.storage\n                  ? chrome.storage.local\n                  : localstorage();\n\n/**\n * Colors.\n */\n\nexports.colors = [\n  'lightseagreen',\n  'forestgreen',\n  'goldenrod',\n  'dodgerblue',\n  'darkorchid',\n  'crimson'\n];\n\n/**\n * Currently only WebKit-based Web Inspectors, Firefox >= v31,\n * and the Firebug extension (any Firefox version) are known\n * to support \"%c\" CSS customizations.\n *\n * TODO: add a `localStorage` variable to explicitly enable/disable colors\n */\n\nfunction useColors() {\n  // NB: In an Electron preload script, document will be defined but not fully\n  // initialized. Since we know we're in Chrome, we'll just detect this case\n  // explicitly\n  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {\n    return true;\n  }\n\n  // is webkit? http://stackoverflow.com/a/16459606/376773\n  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632\n  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||\n    // is firebug? http://stackoverflow.com/a/398120/376773\n    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||\n    // is firefox >= v31?\n    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages\n    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\\/(\\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||\n    // double check webkit in userAgent just in case we are in a worker\n    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\\/(\\d+)/));\n}\n\n/**\n * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.\n */\n\nexports.formatters.j = function(v) {\n  try {\n    return JSON.stringify(v);\n  } catch (err) {\n    return '[UnexpectedJSONParseError]: ' + err.message;\n  }\n};\n\n\n/**\n * Colorize log arguments if enabled.\n *\n * @api public\n */\n\nfunction formatArgs(args) {\n  var useColors = this.useColors;\n\n  args[0] = (useColors ? '%c' : '')\n    + this.namespace\n    + (useColors ? ' %c' : ' ')\n    + args[0]\n    + (useColors ? '%c ' : ' ')\n    + '+' + exports.humanize(this.diff);\n\n  if (!useColors) return;\n\n  var c = 'color: ' + this.color;\n  args.splice(1, 0, c, 'color: inherit')\n\n  // the final \"%c\" is somewhat tricky, because there could be other\n  // arguments passed either before or after the %c, so we need to\n  // figure out the correct index to insert the CSS into\n  var index = 0;\n  var lastC = 0;\n  args[0].replace(/%[a-zA-Z%]/g, function(match) {\n    if ('%%' === match) return;\n    index++;\n    if ('%c' === match) {\n      // we only are interested in the *last* %c\n      // (the user may have provided their own)\n      lastC = index;\n    }\n  });\n\n  args.splice(lastC, 0, c);\n}\n\n/**\n * Invokes `console.log()` when available.\n * No-op when `console.log` is not a \"function\".\n *\n * @api public\n */\n\nfunction log() {\n  // this hackery is required for IE8/9, where\n  // the `console.log` function doesn't have 'apply'\n  return 'object' === typeof console\n    && console.log\n    && Function.prototype.apply.call(console.log, console, arguments);\n}\n\n/**\n * Save `namespaces`.\n *\n * @param {String} namespaces\n * @api private\n */\n\nfunction save(namespaces) {\n  try {\n    if (null == namespaces) {\n      exports.storage.removeItem('debug');\n    } else {\n      exports.storage.debug = namespaces;\n    }\n  } catch(e) {}\n}\n\n/**\n * Load `namespaces`.\n *\n * @return {String} returns the previously persisted debug modes\n * @api private\n */\n\nfunction load() {\n  var r;\n  try {\n    r = exports.storage.debug;\n  } catch(e) {}\n\n  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG\n  if (!r && typeof process !== 'undefined' && 'env' in process) {\n    r = process.env.DEBUG;\n  }\n\n  return r;\n}\n\n/**\n * Enable namespaces listed in `localStorage.debug` initially.\n */\n\nexports.enable(load());\n\n/**\n * Localstorage attempts to return the localstorage.\n *\n * This is necessary because safari throws\n * when a user disables cookies/localstorage\n * and you attempt to access it.\n *\n * @return {LocalStorage}\n * @api private\n */\n\nfunction localstorage() {\n  try {\n    return window.localStorage;\n  } catch (e) {}\n}\n\n\n//# sourceURL=webpack:///./node_modules/debug/src/browser.js?");

/***/ }),

/***/ "./node_modules/debug/src/debug.js":
/*!*****************************************!*\
  !*** ./node_modules/debug/src/debug.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n/**\n * This is the common logic for both the Node.js and web browser\n * implementations of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = createDebug.debug = createDebug['default'] = createDebug;\nexports.coerce = coerce;\nexports.disable = disable;\nexports.enable = enable;\nexports.enabled = enabled;\nexports.humanize = __webpack_require__(/*! ms */ \"./node_modules/ms/index.js\");\n\n/**\n * The currently active debug mode names, and names to skip.\n */\n\nexports.names = [];\nexports.skips = [];\n\n/**\n * Map of special \"%n\" handling functions, for the debug \"format\" argument.\n *\n * Valid key names are a single, lower or upper-case letter, i.e. \"n\" and \"N\".\n */\n\nexports.formatters = {};\n\n/**\n * Previous log timestamp.\n */\n\nvar prevTime;\n\n/**\n * Select a color.\n * @param {String} namespace\n * @return {Number}\n * @api private\n */\n\nfunction selectColor(namespace) {\n  var hash = 0, i;\n\n  for (i in namespace) {\n    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);\n    hash |= 0; // Convert to 32bit integer\n  }\n\n  return exports.colors[Math.abs(hash) % exports.colors.length];\n}\n\n/**\n * Create a debugger with the given `namespace`.\n *\n * @param {String} namespace\n * @return {Function}\n * @api public\n */\n\nfunction createDebug(namespace) {\n\n  function debug() {\n    // disabled?\n    if (!debug.enabled) return;\n\n    var self = debug;\n\n    // set `diff` timestamp\n    var curr = +new Date();\n    var ms = curr - (prevTime || curr);\n    self.diff = ms;\n    self.prev = prevTime;\n    self.curr = curr;\n    prevTime = curr;\n\n    // turn the `arguments` into a proper Array\n    var args = new Array(arguments.length);\n    for (var i = 0; i < args.length; i++) {\n      args[i] = arguments[i];\n    }\n\n    args[0] = exports.coerce(args[0]);\n\n    if ('string' !== typeof args[0]) {\n      // anything else let's inspect with %O\n      args.unshift('%O');\n    }\n\n    // apply any `formatters` transformations\n    var index = 0;\n    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {\n      // if we encounter an escaped % then don't increase the array index\n      if (match === '%%') return match;\n      index++;\n      var formatter = exports.formatters[format];\n      if ('function' === typeof formatter) {\n        var val = args[index];\n        match = formatter.call(self, val);\n\n        // now we need to remove `args[index]` since it's inlined in the `format`\n        args.splice(index, 1);\n        index--;\n      }\n      return match;\n    });\n\n    // apply env-specific formatting (colors, etc.)\n    exports.formatArgs.call(self, args);\n\n    var logFn = debug.log || exports.log || console.log.bind(console);\n    logFn.apply(self, args);\n  }\n\n  debug.namespace = namespace;\n  debug.enabled = exports.enabled(namespace);\n  debug.useColors = exports.useColors();\n  debug.color = selectColor(namespace);\n\n  // env-specific initialization logic for debug instances\n  if ('function' === typeof exports.init) {\n    exports.init(debug);\n  }\n\n  return debug;\n}\n\n/**\n * Enables a debug mode by namespaces. This can include modes\n * separated by a colon and wildcards.\n *\n * @param {String} namespaces\n * @api public\n */\n\nfunction enable(namespaces) {\n  exports.save(namespaces);\n\n  exports.names = [];\n  exports.skips = [];\n\n  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\\s,]+/);\n  var len = split.length;\n\n  for (var i = 0; i < len; i++) {\n    if (!split[i]) continue; // ignore empty strings\n    namespaces = split[i].replace(/\\*/g, '.*?');\n    if (namespaces[0] === '-') {\n      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));\n    } else {\n      exports.names.push(new RegExp('^' + namespaces + '$'));\n    }\n  }\n}\n\n/**\n * Disable debug output.\n *\n * @api public\n */\n\nfunction disable() {\n  exports.enable('');\n}\n\n/**\n * Returns true if the given mode name is enabled, false otherwise.\n *\n * @param {String} name\n * @return {Boolean}\n * @api public\n */\n\nfunction enabled(name) {\n  var i, len;\n  for (i = 0, len = exports.skips.length; i < len; i++) {\n    if (exports.skips[i].test(name)) {\n      return false;\n    }\n  }\n  for (i = 0, len = exports.names.length; i < len; i++) {\n    if (exports.names[i].test(name)) {\n      return true;\n    }\n  }\n  return false;\n}\n\n/**\n * Coerce `val`.\n *\n * @param {Mixed} val\n * @return {Mixed}\n * @api private\n */\n\nfunction coerce(val) {\n  if (val instanceof Error) return val.stack || val.message;\n  return val;\n}\n\n\n//# sourceURL=webpack:///./node_modules/debug/src/debug.js?");

/***/ }),

/***/ "./node_modules/debug/src/index.js":
/*!*****************************************!*\
  !*** ./node_modules/debug/src/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Detect Electron renderer process, which is node, but we should\n * treat as a browser.\n */\n\nif (typeof process !== 'undefined' && process.type === 'renderer') {\n  module.exports = __webpack_require__(/*! ./browser.js */ \"./node_modules/debug/src/browser.js\");\n} else {\n  module.exports = __webpack_require__(/*! ./node.js */ \"./node_modules/debug/src/node.js\");\n}\n\n\n//# sourceURL=webpack:///./node_modules/debug/src/index.js?");

/***/ }),

/***/ "./node_modules/debug/src/node.js":
/*!****************************************!*\
  !*** ./node_modules/debug/src/node.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Module dependencies.\n */\n\nvar tty = __webpack_require__(/*! tty */ \"tty\");\nvar util = __webpack_require__(/*! util */ \"util\");\n\n/**\n * This is the Node.js implementation of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = __webpack_require__(/*! ./debug */ \"./node_modules/debug/src/debug.js\");\nexports.init = init;\nexports.log = log;\nexports.formatArgs = formatArgs;\nexports.save = save;\nexports.load = load;\nexports.useColors = useColors;\n\n/**\n * Colors.\n */\n\nexports.colors = [6, 2, 3, 4, 5, 1];\n\n/**\n * Build up the default `inspectOpts` object from the environment variables.\n *\n *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js\n */\n\nexports.inspectOpts = Object.keys(process.env).filter(function (key) {\n  return /^debug_/i.test(key);\n}).reduce(function (obj, key) {\n  // camel-case\n  var prop = key\n    .substring(6)\n    .toLowerCase()\n    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });\n\n  // coerce string value into JS value\n  var val = process.env[key];\n  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;\n  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;\n  else if (val === 'null') val = null;\n  else val = Number(val);\n\n  obj[prop] = val;\n  return obj;\n}, {});\n\n/**\n * The file descriptor to write the `debug()` calls to.\n * Set the `DEBUG_FD` env variable to override with another value. i.e.:\n *\n *   $ DEBUG_FD=3 node script.js 3>debug.log\n */\n\nvar fd = parseInt(process.env.DEBUG_FD, 10) || 2;\n\nif (1 !== fd && 2 !== fd) {\n  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()\n}\n\nvar stream = 1 === fd ? process.stdout :\n             2 === fd ? process.stderr :\n             createWritableStdioStream(fd);\n\n/**\n * Is stdout a TTY? Colored output is enabled when `true`.\n */\n\nfunction useColors() {\n  return 'colors' in exports.inspectOpts\n    ? Boolean(exports.inspectOpts.colors)\n    : tty.isatty(fd);\n}\n\n/**\n * Map %o to `util.inspect()`, all on a single line.\n */\n\nexports.formatters.o = function(v) {\n  this.inspectOpts.colors = this.useColors;\n  return util.inspect(v, this.inspectOpts)\n    .split('\\n').map(function(str) {\n      return str.trim()\n    }).join(' ');\n};\n\n/**\n * Map %o to `util.inspect()`, allowing multiple lines if needed.\n */\n\nexports.formatters.O = function(v) {\n  this.inspectOpts.colors = this.useColors;\n  return util.inspect(v, this.inspectOpts);\n};\n\n/**\n * Adds ANSI color escape codes if enabled.\n *\n * @api public\n */\n\nfunction formatArgs(args) {\n  var name = this.namespace;\n  var useColors = this.useColors;\n\n  if (useColors) {\n    var c = this.color;\n    var prefix = '  \\u001b[3' + c + ';1m' + name + ' ' + '\\u001b[0m';\n\n    args[0] = prefix + args[0].split('\\n').join('\\n' + prefix);\n    args.push('\\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\\u001b[0m');\n  } else {\n    args[0] = new Date().toUTCString()\n      + ' ' + name + ' ' + args[0];\n  }\n}\n\n/**\n * Invokes `util.format()` with the specified arguments and writes to `stream`.\n */\n\nfunction log() {\n  return stream.write(util.format.apply(util, arguments) + '\\n');\n}\n\n/**\n * Save `namespaces`.\n *\n * @param {String} namespaces\n * @api private\n */\n\nfunction save(namespaces) {\n  if (null == namespaces) {\n    // If you set a process.env field to null or undefined, it gets cast to the\n    // string 'null' or 'undefined'. Just delete instead.\n    delete process.env.DEBUG;\n  } else {\n    process.env.DEBUG = namespaces;\n  }\n}\n\n/**\n * Load `namespaces`.\n *\n * @return {String} returns the previously persisted debug modes\n * @api private\n */\n\nfunction load() {\n  return process.env.DEBUG;\n}\n\n/**\n * Copied from `node/src/node.js`.\n *\n * XXX: It's lame that node doesn't expose this API out-of-the-box. It also\n * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.\n */\n\nfunction createWritableStdioStream (fd) {\n  var stream;\n  var tty_wrap = process.binding('tty_wrap');\n\n  // Note stream._type is used for test-module-load-list.js\n\n  switch (tty_wrap.guessHandleType(fd)) {\n    case 'TTY':\n      stream = new tty.WriteStream(fd);\n      stream._type = 'tty';\n\n      // Hack to have stream not keep the event loop alive.\n      // See https://github.com/joyent/node/issues/1726\n      if (stream._handle && stream._handle.unref) {\n        stream._handle.unref();\n      }\n      break;\n\n    case 'FILE':\n      var fs = __webpack_require__(/*! fs */ \"fs\");\n      stream = new fs.SyncWriteStream(fd, { autoClose: false });\n      stream._type = 'fs';\n      break;\n\n    case 'PIPE':\n    case 'TCP':\n      var net = __webpack_require__(/*! net */ \"net\");\n      stream = new net.Socket({\n        fd: fd,\n        readable: false,\n        writable: true\n      });\n\n      // FIXME Should probably have an option in net.Socket to create a\n      // stream from an existing fd which is writable only. But for now\n      // we'll just add this hack and set the `readable` member to false.\n      // Test: ./node test/fixtures/echo.js < /etc/passwd\n      stream.readable = false;\n      stream.read = null;\n      stream._type = 'pipe';\n\n      // FIXME Hack to have stream not keep the event loop alive.\n      // See https://github.com/joyent/node/issues/1726\n      if (stream._handle && stream._handle.unref) {\n        stream._handle.unref();\n      }\n      break;\n\n    default:\n      // Probably an error on in uv_guess_handle()\n      throw new Error('Implement me. Unknown stream file type!');\n  }\n\n  // For supporting legacy API we put the FD here.\n  stream.fd = fd;\n\n  stream._isStdio = true;\n\n  return stream;\n}\n\n/**\n * Init logic for `debug` instances.\n *\n * Create a new `inspectOpts` object in case `useColors` is set\n * differently for a particular `debug` instance.\n */\n\nfunction init (debug) {\n  debug.inspectOpts = {};\n\n  var keys = Object.keys(exports.inspectOpts);\n  for (var i = 0; i < keys.length; i++) {\n    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];\n  }\n}\n\n/**\n * Enable namespaces listed in `process.env.DEBUG` initially.\n */\n\nexports.enable(load());\n\n\n//# sourceURL=webpack:///./node_modules/debug/src/node.js?");

/***/ }),

/***/ "./node_modules/electron-debug sync recursive":
/*!******************************************!*\
  !*** ./node_modules/electron-debug sync ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function webpackEmptyContext(req) {\n\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\te.code = 'MODULE_NOT_FOUND';\n\tthrow e;\n}\nwebpackEmptyContext.keys = function() { return []; };\nwebpackEmptyContext.resolve = webpackEmptyContext;\nmodule.exports = webpackEmptyContext;\nwebpackEmptyContext.id = \"./node_modules/electron-debug sync recursive\";\n\n//# sourceURL=webpack:///./node_modules/electron-debug_sync?");

/***/ }),

/***/ "./node_modules/electron-debug/index.js":
/*!**********************************************!*\
  !*** ./node_modules/electron-debug/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst electron = __webpack_require__(/*! electron */ \"electron\");\nconst localShortcut = __webpack_require__(/*! electron-localshortcut */ \"./node_modules/electron-localshortcut/index.js\");\nconst isDev = __webpack_require__(/*! electron-is-dev */ \"./node_modules/electron-is-dev/index.js\");\n\nconst {app, BrowserWindow} = electron;\nconst isMacOS = process.platform === 'darwin';\n\nconst devToolsOptions = {};\n\nfunction toggleDevTools(win = BrowserWindow.getFocusedWindow()) {\n\tif (win) {\n\t\tconst {webContents} = win;\n\t\tif (webContents.isDevToolsOpened()) {\n\t\t\twebContents.closeDevTools();\n\t\t} else {\n\t\t\twebContents.openDevTools(devToolsOptions);\n\t\t}\n\t}\n}\n\nfunction devTools(win = BrowserWindow.getFocusedWindow()) {\n\tif (win) {\n\t\ttoggleDevTools(win);\n\t}\n}\n\nfunction openDevTools(win = BrowserWindow.getFocusedWindow()) {\n\tif (win) {\n\t\twin.webContents.openDevTools(devToolsOptions);\n\t}\n}\n\nfunction refresh(win = BrowserWindow.getFocusedWindow()) {\n\tif (win) {\n\t\twin.webContents.reloadIgnoringCache();\n\t}\n}\n\nfunction inspectElements() {\n\tconst win = BrowserWindow.getFocusedWindow();\n\tconst inspect = () => {\n\t\twin.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');\n\t};\n\n\tif (win) {\n\t\tif (win.webContents.isDevToolsOpened()) {\n\t\t\tinspect();\n\t\t} else {\n\t\t\twin.webContents.once('devtools-opened', inspect);\n\t\t\twin.openDevTools();\n\t\t}\n\t}\n}\n\nconst addExtensionIfInstalled = (name, getPath) => {\n\tconst isExtensionInstalled = name => {\n\t\treturn BrowserWindow.getDevToolsExtensions &&\n\t\t\t{}.hasOwnProperty.call(BrowserWindow.getDevToolsExtensions(), name);\n\t};\n\n\ttry {\n\t\tif (!isExtensionInstalled(name)) {\n\t\t\tBrowserWindow.addDevToolsExtension(getPath(name));\n\t\t}\n\t} catch (_) {}\n};\n\nmodule.exports = opts => {\n\topts = Object.assign({\n\t\tenabled: null,\n\t\tshowDevTools: true,\n\t\tdevToolsMode: 'undocked'\n\t}, opts);\n\n\tif (opts.enabled === false || (opts.enabled === null && !isDev)) {\n\t\treturn;\n\t}\n\n\tif (opts.devToolsMode !== 'previous') {\n\t\tdevToolsOptions.mode = opts.devToolsMode;\n\t}\n\n\tapp.on('browser-window-created', (event, win) => {\n\t\tif (opts.showDevTools) {\n\t\t\twin.webContents.once('devtools-opened', () => {\n\t\t\t\t// Workaround for https://github.com/electron/electron/issues/13095\n\t\t\t\tsetImmediate(() => {\n\t\t\t\t\twin.focus();\n\t\t\t\t});\n\t\t\t});\n\n\t\t\t/// Workaround for https://github.com/electron/electron/issues/12438\n\t\t\twin.webContents.once('dom-ready', () => {\n\t\t\t\topenDevTools(win, opts.showDevTools);\n\t\t\t});\n\t\t}\n\t});\n\n\tapp.on('ready', () => {\n\t\taddExtensionIfInstalled('devtron', name => __webpack_require__(\"./node_modules/electron-debug sync recursive\")(name).path);\n\t\taddExtensionIfInstalled('electron-react-devtools', name => __webpack_require__(\"./node_modules/electron-debug sync recursive\")(name).path);\n\n\t\tlocalShortcut.register('CmdOrCtrl+Shift+C', inspectElements);\n\t\tlocalShortcut.register(isMacOS ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);\n\t\tlocalShortcut.register('F12', devTools);\n\n\t\tlocalShortcut.register('CmdOrCtrl+R', refresh);\n\t\tlocalShortcut.register('F5', refresh);\n\t});\n};\n\nmodule.exports.refresh = refresh;\nmodule.exports.devTools = devTools;\nmodule.exports.openDevTools = openDevTools;\n\n\n//# sourceURL=webpack:///./node_modules/electron-debug/index.js?");

/***/ }),

/***/ "./node_modules/electron-is-accelerator/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/electron-is-accelerator/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nconst modifiers = /^(Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super)$/;\nconst keyCodes = /^([0-9A-Z)!@#$%^&*(:+<_>?~{|}\";=,\\-./`[\\\\\\]']|F1*[1-9]|F10|F2[0-4]|Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen)$/;\n\nmodule.exports = function (str) {\n\tlet parts = str.split(\"+\");\n\tlet keyFound = false;\n    return parts.every((val, index) => {\n\t\tconst isKey = keyCodes.test(val);\n\t\tconst isModifier = modifiers.test(val);\n\t\tif (isKey) {\n\t\t\t// Key must be unique\n\t\t\tif (keyFound) return false;\n\t\t\tkeyFound = true;\n\t\t}\n\t\t// Key is required\n\t\tif (index === parts.length - 1 && !keyFound) return false;\n        return isKey || isModifier;\n    });\n};\n\n\n//# sourceURL=webpack:///./node_modules/electron-is-accelerator/index.js?");

/***/ }),

/***/ "./node_modules/electron-is-dev/index.js":
/*!***********************************************!*\
  !*** ./node_modules/electron-is-dev/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;\nconst isEnvSet = 'ELECTRON_IS_DEV' in process.env;\n\nmodule.exports = isEnvSet ? getFromEnv : (process.defaultApp || /node_modules[\\\\/]electron[\\\\/]/.test(process.execPath));\n\n\n//# sourceURL=webpack:///./node_modules/electron-is-dev/index.js?");

/***/ }),

/***/ "./node_modules/electron-localshortcut/index.js":
/*!******************************************************!*\
  !*** ./node_modules/electron-localshortcut/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst {app, BrowserWindow} = __webpack_require__(/*! electron */ \"electron\");\nconst isAccelerator = __webpack_require__(/*! electron-is-accelerator */ \"./node_modules/electron-is-accelerator/index.js\");\nconst equals = __webpack_require__(/*! keyboardevents-areequal */ \"./node_modules/keyboardevents-areequal/index.js\");\nconst {toKeyEvent} = __webpack_require__(/*! keyboardevent-from-electron-accelerator */ \"./node_modules/keyboardevent-from-electron-accelerator/index.js\");\nconst _debug = __webpack_require__(/*! debug */ \"./node_modules/debug/src/index.js\");\n\nconst debug = _debug('electron-localshortcut');\n\n// A placeholder to register shortcuts\n// on any window of the app.\nconst ANY_WINDOW = {};\n\nconst windowsWithShortcuts = new WeakMap();\n\nconst title = win => {\n\tif (win) {\n\t\ttry {\n\t\t\treturn win.getTitle();\n\t\t} catch (err) {\n\t\t\treturn 'A destroyed window';\n\t\t}\n\t}\n\n\treturn 'An falsy value';\n};\n\nfunction _checkAccelerator(accelerator) {\n\tif (!isAccelerator(accelerator)) {\n\t\tconst w = {};\n\t\tError.captureStackTrace(w);\n\t\tconst msg = `\nWARNING: ${accelerator} is not a valid accelerator.\n\n${w.stack\n\t\t\t.split('\\n')\n\t\t\t.slice(4)\n\t\t\t.join('\\n')}\n`;\n\t\tconsole.error(msg);\n\t}\n}\n\n/**\n * Disable all of the shortcuts registered on the BrowserWindow instance.\n * Registered shortcuts no more works on the `window` instance, but the module\n * keep a reference on them. You can reactivate them later by calling `enableAll`\n * method on the same window instance.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction disableAll(win) {\n\tdebug(`Disabling all shortcuts on window ${title(win)}`);\n\tconst wc = win.webContents;\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\tfor (const shortcut of shortcutsOfWindow) {\n\t\tshortcut.enabled = false;\n\t}\n}\n\n/**\n * Enable all of the shortcuts registered on the BrowserWindow instance that\n * you had previously disabled calling `disableAll` method.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction enableAll(win) {\n\tdebug(`Enabling all shortcuts on window ${title(win)}`);\n\tconst wc = win.webContents;\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\tfor (const shortcut of shortcutsOfWindow) {\n\t\tshortcut.enabled = true;\n\t}\n}\n\n/**\n * Unregisters all of the shortcuts registered on any focused BrowserWindow\n * instance. This method does not unregister any shortcut you registered on\n * a particular window instance.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction unregisterAll(win) {\n\tdebug(`Unregistering all shortcuts on window ${title(win)}`);\n\tconst wc = win.webContents;\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\t// Remove listener from window\n\tshortcutsOfWindow.removeListener();\n\n\twindowsWithShortcuts.delete(wc);\n}\n\nfunction _normalizeEvent(input) {\n\tconst normalizedEvent = {\n\t\tcode: input.code,\n\t\tkey: input.key\n\t};\n\n\t['alt', 'shift', 'meta'].forEach(prop => {\n\t\tif (typeof input[prop] !== 'undefined') {\n\t\t\tnormalizedEvent[`${prop}Key`] = input[prop];\n\t\t}\n\t});\n\n\tif (typeof input.control !== 'undefined') {\n\t\tnormalizedEvent.ctrlKey = input.control;\n\t}\n\n\treturn normalizedEvent;\n}\n\nfunction _findShortcut(event, shortcutsOfWindow) {\n\tlet i = 0;\n\tfor (const shortcut of shortcutsOfWindow) {\n\t\tif (equals(shortcut.eventStamp, event)) {\n\t\t\treturn i;\n\t\t}\n\t\ti++;\n\t}\n\treturn -1;\n}\n\nconst _onBeforeInput = shortcutsOfWindow => (e, input) => {\n\tif (input.type === 'keyUp') {\n\t\treturn;\n\t}\n\n\tconst event = _normalizeEvent(input);\n\n\tdebug(`before-input-event: ${input} is translated to: ${event}`);\n\tfor (const {eventStamp, callback} of shortcutsOfWindow) {\n\t\tif (equals(eventStamp, event)) {\n\t\t\tdebug(`eventStamp: ${eventStamp} match`);\n\t\t\tcallback();\n\t\t\treturn;\n\t\t}\n\t\tdebug(`eventStamp: ${eventStamp} no match`);\n\t}\n};\n\n/**\n* Registers the shortcut `accelerator`on the BrowserWindow instance.\n * @param  {BrowserWindow} win - BrowserWindow instance to register.\n * This argument could be omitted, in this case the function register\n * the shortcut on all app windows.\n * @param  {String} accelerator - the shortcut to register\n * @param  {Function} callback    This function is called when the shortcut is pressed\n * and the window is focused and not minimized.\n * @return {Undefined}\n */\nfunction register(win, accelerator, callback) {\n\tlet wc;\n\tif (typeof callback === 'undefined') {\n\t\twc = ANY_WINDOW;\n\t\tcallback = accelerator;\n\t\taccelerator = win;\n\t} else {\n\t\twc = win.webContents;\n\t}\n\n\tdebug(`Registering callback for ${accelerator} on window ${title(win)}`);\n\t_checkAccelerator(accelerator);\n\n\tdebug(`${accelerator} seems a valid shortcut sequence.`);\n\n\tlet shortcutsOfWindow;\n\tif (windowsWithShortcuts.has(wc)) {\n\t\tdebug(`Window has others shortcuts registered.`);\n\t\tshortcutsOfWindow = windowsWithShortcuts.get(wc);\n\t} else {\n\t\tdebug(`This is the first shortcut of the window.`);\n\t\tshortcutsOfWindow = [];\n\t\twindowsWithShortcuts.set(wc, shortcutsOfWindow);\n\n\t\tif (wc === ANY_WINDOW) {\n\t\t\tconst keyHandler = _onBeforeInput(shortcutsOfWindow);\n\t\t\tconst enableAppShortcuts = (e, win) => {\n\t\t\t\tconst wc = win.webContents;\n\t\t\t\twc.on('before-input-event', keyHandler);\n\t\t\t\twc.once('closed', () =>\n\t\t\t\t\twc.removeListener('before-input-event', keyHandler)\n\t\t\t\t);\n\t\t\t};\n\n\t\t\t// Enable shortcut on current windows\n\t\t\tconst windows = BrowserWindow.getAllWindows();\n\n\t\t\twindows.forEach(win => enableAppShortcuts(null, win));\n\n\t\t\t// Enable shortcut on future windows\n\t\t\tapp.on('browser-window-created', enableAppShortcuts);\n\n\t\t\tshortcutsOfWindow.removeListener = () => {\n\t\t\t\tconst windows = BrowserWindow.getAllWindows();\n\t\t\t\twindows.forEach(win =>\n\t\t\t\t\twin.webContents.removeListener('before-input-event', keyHandler)\n\t\t\t\t);\n\t\t\t\tapp.removeListener('browser-window-created', enableAppShortcuts);\n\t\t\t};\n\t\t} else {\n\t\t\tconst keyHandler = _onBeforeInput(shortcutsOfWindow);\n\t\t\twc.on('before-input-event', keyHandler);\n\n\t\t\t// Save a reference to allow remove of listener from elsewhere\n\t\t\tshortcutsOfWindow.removeListener = () =>\n\t\t\t\twc.removeListener('before-input-event', keyHandler);\n\t\t\twc.once('closed', shortcutsOfWindow.removeListener);\n\t\t}\n\t}\n\n\tdebug(`Adding shortcut to window set.`);\n\n\tconst eventStamp = toKeyEvent(accelerator);\n\n\tshortcutsOfWindow.push({\n\t\teventStamp,\n\t\tcallback,\n\t\tenabled: true\n\t});\n\n\tdebug(`Shortcut registered.`);\n}\n\n/**\n * Unregisters the shortcut of `accelerator` registered on the BrowserWindow instance.\n * @param  {BrowserWindow} win - BrowserWindow instance to unregister.\n * This argument could be omitted, in this case the function unregister the shortcut\n * on all app windows. If you registered the shortcut on a particular window instance, it will do nothing.\n * @param  {String} accelerator - the shortcut to unregister\n * @return {Undefined}\n */\nfunction unregister(win, accelerator) {\n\tlet wc;\n\tif (typeof accelerator === 'undefined') {\n\t\twc = ANY_WINDOW;\n\t\taccelerator = win;\n\t} else {\n\t\tif (win.isDestroyed()) {\n\t\t\tdebug(`Early return because window is destroyed.`);\n\t\t\treturn;\n\t\t}\n\t\twc = win.webContents;\n\t}\n\n\tdebug(`Unregistering callback for ${accelerator} on window ${title(win)}`);\n\n\t_checkAccelerator(accelerator);\n\n\tdebug(`${accelerator} seems a valid shortcut sequence.`);\n\n\tif (!windowsWithShortcuts.has(wc)) {\n\t\tdebug(`Early return because window has never had shortcuts registered.`);\n\t\treturn;\n\t}\n\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\tconst eventStamp = toKeyEvent(accelerator);\n\tconst shortcutIdx = _findShortcut(eventStamp, shortcutsOfWindow);\n\tif (shortcutIdx === -1) {\n\t\treturn;\n\t}\n\n\tshortcutsOfWindow.splice(shortcutIdx, 1);\n\n\t// If the window has no more shortcuts,\n\t// we remove it early from the WeakMap\n\t// and unregistering the event listener\n\tif (shortcutsOfWindow.length === 0) {\n\t\t// Remove listener from window\n\t\tshortcutsOfWindow.removeListener();\n\n\t\t// Remove window from shrtcuts catalog\n\t\twindowsWithShortcuts.delete(wc);\n\t}\n}\n\n/**\n * Returns `true` or `false` depending on whether the shortcut `accelerator`\n * is registered on `window`.\n * @param  {BrowserWindow} win - BrowserWindow instance to check. This argument\n * could be omitted, in this case the function returns whether the shortcut\n * `accelerator` is registered on all app windows. If you registered the\n * shortcut on a particular window instance, it return false.\n * @param  {String} accelerator - the shortcut to check\n * @return {Boolean} - if the shortcut `accelerator` is registered on `window`.\n */\nfunction isRegistered(win, accelerator) {\n\t_checkAccelerator(accelerator);\n}\n\nmodule.exports = {\n\tregister,\n\tunregister,\n\tisRegistered,\n\tunregisterAll,\n\tenableAll,\n\tdisableAll\n};\n\n\n//# sourceURL=webpack:///./node_modules/electron-localshortcut/index.js?");

/***/ }),

/***/ "./node_modules/keyboardevent-from-electron-accelerator/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/keyboardevent-from-electron-accelerator/index.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, '__esModule', { value: true });\n\nconst modifiers = /^(CommandOrControl|CmdOrCtrl|Command|Cmd|Control|Ctrl|Alt|Option|AltGr|Shift|Super)/i;\nconst keyCodes = /^(Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen|F24|F23|F22|F21|F20|F19|F18|F17|F16|F15|F14|F13|F12|F11|F10|F9|F8|F7|F6|F5|F4|F3|F2|F1|[0-9A-Z)!@#$%^&*(:+<_>?~{|}\";=,\\-./`[\\\\\\]'])/i;\nconst UNSUPPORTED = {};\n\nfunction reduceModifier({accelerator, event}, modifier) {\n\tswitch (modifier) {\n\t\tcase 'command':\n\t\tcase 'cmd': {\n\t\t\tif (process.platform !== 'darwin') {\n\t\t\t\treturn UNSUPPORTED;\n\t\t\t}\n\n\t\t\tif (event.metaKey) {\n\t\t\t\tthrow new Error('Double `Command` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {metaKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'super': {\n\t\t\tif (event.metaKey) {\n\t\t\t\tthrow new Error('Double `Super` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {metaKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'control':\n\t\tcase 'ctrl': {\n\t\t\tif (event.ctrlKey) {\n\t\t\t\tthrow new Error('Double `Control` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {ctrlKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'commandorcontrol':\n\t\tcase 'cmdorctrl': {\n\t\t\tif (process.platform === 'darwin') {\n\t\t\t\tif (event.metaKey) {\n\t\t\t\t\tthrow new Error('Double `Command` modifier specified.');\n\t\t\t\t}\n\n\t\t\t\treturn {\n\t\t\t\t\tevent: Object.assign({}, event, {metaKey: true}),\n\t\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t\t};\n\t\t\t}\n\n\t\t\tif (event.ctrlKey) {\n\t\t\t\tthrow new Error('Double `Control` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {ctrlKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'option':\n\t\tcase 'altgr':\n\t\tcase 'alt': {\n\t\t\tif (modifier === 'option' && process.platform !== 'darwin') {\n\t\t\t\treturn UNSUPPORTED;\n\t\t\t}\n\n\t\t\tif (event.altKey) {\n\t\t\t\tthrow new Error('Double `Alt` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {altKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'shift': {\n\t\t\tif (event.shiftKey) {\n\t\t\t\tthrow new Error('Double `Shift` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {shiftKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\n\t\tdefault:\n\t\t\tconsole.error(modifier);\n\t}\n}\n\nfunction reducePlus({accelerator, event}) {\n\treturn {\n\t\tevent,\n\t\taccelerator: accelerator.trim().slice(1)\n\t};\n}\n\nconst virtualKeyCodes = {\n\t0: 'Digit0',\n\t1: 'Digit1',\n\t2: 'Digit2',\n\t3: 'Digit3',\n\t4: 'Digit4',\n\t5: 'Digit5',\n\t6: 'Digit6',\n\t7: 'Digit7',\n\t8: 'Digit8',\n\t9: 'Digit9',\n\t'-': 'Minus',\n\t'=': 'Equal',\n\tQ: 'KeyQ',\n\tW: 'KeyW',\n\tE: 'KeyE',\n\tR: 'KeyR',\n\tT: 'KeyT',\n\tY: 'KeyY',\n\tU: 'KeyU',\n\tI: 'KeyI',\n\tO: 'KeyO',\n\tP: 'KeyP',\n\t'[': 'BracketLeft',\n\t']': 'BracketRight',\n\tA: 'KeyA',\n\tS: 'KeyS',\n\tD: 'KeyD',\n\tF: 'KeyF',\n\tG: 'KeyG',\n\tH: 'KeyH',\n\tJ: 'KeyJ',\n\tK: 'KeyK',\n\tL: 'KeyL',\n\t';': 'Semicolon',\n\t'\\'': 'Quote',\n\t'`': 'Backquote',\n\t'/': 'Backslash',\n\tZ: 'KeyZ',\n\tX: 'KeyX',\n\tC: 'KeyC',\n\tV: 'KeyV',\n\tB: 'KeyB',\n\tN: 'KeyN',\n\tM: 'KeyM',\n\t',': 'Comma',\n\t'.': 'Period',\n\t'\\\\': 'Slash',\n\t' ': 'Space'\n};\n\nfunction reduceKey({accelerator, event}, key) {\n\tif (key.length > 1 || event.key) {\n\t\tthrow new Error(`Unvalid keycode \\`${key}\\`.`);\n\t}\n\n\tconst code =\n\t\tkey.toUpperCase() in virtualKeyCodes ?\n\t\t\tvirtualKeyCodes[key.toUpperCase()] :\n\t\t\tnull;\n\n\treturn {\n\t\tevent: Object.assign({}, event, {key}, code ? {code} : null),\n\t\taccelerator: accelerator.trim().slice(key.length)\n\t};\n}\n\nconst domKeys = Object.assign(Object.create(null), {\n\tplus: 'Add',\n\tspace: ' ',\n\ttab: 'Tab',\n\tbackspace: 'Backspace',\n\tdelete: 'Delete',\n\tinsert: 'Insert',\n\treturn: 'Return',\n\tenter: 'Return',\n\tup: 'ArrowUp',\n\tdown: 'ArrowDown',\n\tleft: 'ArrowLeft',\n\tright: 'ArrowRight',\n\thome: 'Home',\n\tend: 'End',\n\tpageup: 'PageUp',\n\tpagedown: 'PageDown',\n\tescape: 'Escape',\n\tesc: 'Escape',\n\tvolumeup: 'AudioVolumeUp',\n\tvolumedown: 'AudioVolumeDown',\n\tvolumemute: 'AudioVolumeMute',\n\tmedianexttrack: 'MediaTrackNext',\n\tmediaprevioustrack: 'MediaTrackPrevious',\n\tmediastop: 'MediaStop',\n\tmediaplaypause: 'MediaPlayPause',\n\tprintscreen: 'PrintScreen'\n});\n\n// Add function keys\nfor (let i = 1; i <= 24; i++) {\n\tdomKeys[`f${i}`] = `F${i}`;\n}\n\nfunction reduceCode({accelerator, event}, {code, key}) {\n\tif (event.code) {\n\t\tthrow new Error(`Duplicated keycode \\`${key}\\`.`);\n\t}\n\n\treturn {\n\t\tevent: Object.assign({}, event, {key}, code ? {code} : null),\n\t\taccelerator: accelerator.trim().slice((key && key.length) || 0)\n\t};\n}\n\n/**\n * This function transform an Electron Accelerator string into\n * a DOM KeyboardEvent object.\n *\n * @param  {string} accelerator an Electron Accelerator string, e.g. `Ctrl+C` or `Shift+Space`.\n * @return {object} a DOM KeyboardEvent object derivate from the `accelerator` argument.\n */\nfunction toKeyEvent(accelerator) {\n\tlet state = {accelerator, event: {}};\n\twhile (state.accelerator !== '') {\n\t\tconst modifierMatch = state.accelerator.match(modifiers);\n\t\tif (modifierMatch) {\n\t\t\tconst modifier = modifierMatch[0].toLowerCase();\n\t\t\tstate = reduceModifier(state, modifier);\n\t\t\tif (state === UNSUPPORTED) {\n\t\t\t\treturn {unsupportedKeyForPlatform: true};\n\t\t\t}\n\t\t} else if (state.accelerator.trim()[0] === '+') {\n\t\t\tstate = reducePlus(state);\n\t\t} else {\n\t\t\tconst codeMatch = state.accelerator.match(keyCodes);\n\t\t\tif (codeMatch) {\n\t\t\t\tconst code = codeMatch[0].toLowerCase();\n\t\t\t\tif (code in domKeys) {\n\t\t\t\t\tstate = reduceCode(state, {\n\t\t\t\t\t\tcode: domKeys[code],\n\t\t\t\t\t\tkey: code\n\t\t\t\t\t});\n\t\t\t\t} else {\n\t\t\t\t\tstate = reduceKey(state, code);\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tthrow new Error(`Unvalid accelerator: \"${state.accelerator}\"`);\n\t\t\t}\n\t\t}\n\t}\n\treturn state.event;\n}\n\nexports.UNSUPPORTED = UNSUPPORTED;\nexports.reduceModifier = reduceModifier;\nexports.reducePlus = reducePlus;\nexports.reduceKey = reduceKey;\nexports.reduceCode = reduceCode;\nexports.toKeyEvent = toKeyEvent;\n\n\n//# sourceURL=webpack:///./node_modules/keyboardevent-from-electron-accelerator/index.js?");

/***/ }),

/***/ "./node_modules/keyboardevents-areequal/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/keyboardevents-areequal/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _lower(key) {\n\tif (typeof key !== 'string') {\n\t\treturn key;\n\t}\n\treturn key.toLowerCase();\n}\n\nfunction areEqual(ev1, ev2) {\n\tif (ev1 === ev2) {\n\t\t// Same object\n\t\t// console.log(`Events are same.`)\n\t\treturn true;\n\t}\n\n\tfor (const prop of ['altKey', 'ctrlKey', 'shiftKey', 'metaKey']) {\n\t\tconst [value1, value2] = [ev1[prop], ev2[prop]];\n\n\t\tif (Boolean(value1) !== Boolean(value2)) {\n\t\t\t// One of the prop is different\n\t\t\t// console.log(`Comparing prop ${prop}: ${value1} ${value2}`);\n\t\t\treturn false;\n\t\t}\n\t}\n\n\tif ((_lower(ev1.key) === _lower(ev2.key) && ev1.key !== undefined) ||\n\t\t(ev1.code === ev2.code && ev1.code !== undefined)) {\n\t\t// Events are equals\n\t\treturn true;\n\t}\n\n\t// Key or code are differents\n\t// console.log(`key or code are differents. ${ev1.key} !== ${ev2.key} ${ev1.code} !== ${ev2.code}`);\n\n\treturn false;\n}\n\nmodule.exports = areEqual;\n\n\n//# sourceURL=webpack:///./node_modules/keyboardevents-areequal/index.js?");

/***/ }),

/***/ "./node_modules/ms/index.js":
/*!**********************************!*\
  !*** ./node_modules/ms/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Helpers.\n */\n\nvar s = 1000;\nvar m = s * 60;\nvar h = m * 60;\nvar d = h * 24;\nvar y = d * 365.25;\n\n/**\n * Parse or format the given `val`.\n *\n * Options:\n *\n *  - `long` verbose formatting [false]\n *\n * @param {String|Number} val\n * @param {Object} [options]\n * @throws {Error} throw an error if val is not a non-empty string or a number\n * @return {String|Number}\n * @api public\n */\n\nmodule.exports = function(val, options) {\n  options = options || {};\n  var type = typeof val;\n  if (type === 'string' && val.length > 0) {\n    return parse(val);\n  } else if (type === 'number' && isNaN(val) === false) {\n    return options.long ? fmtLong(val) : fmtShort(val);\n  }\n  throw new Error(\n    'val is not a non-empty string or a valid number. val=' +\n      JSON.stringify(val)\n  );\n};\n\n/**\n * Parse the given `str` and return milliseconds.\n *\n * @param {String} str\n * @return {Number}\n * @api private\n */\n\nfunction parse(str) {\n  str = String(str);\n  if (str.length > 100) {\n    return;\n  }\n  var match = /^((?:\\d+)?\\.?\\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(\n    str\n  );\n  if (!match) {\n    return;\n  }\n  var n = parseFloat(match[1]);\n  var type = (match[2] || 'ms').toLowerCase();\n  switch (type) {\n    case 'years':\n    case 'year':\n    case 'yrs':\n    case 'yr':\n    case 'y':\n      return n * y;\n    case 'days':\n    case 'day':\n    case 'd':\n      return n * d;\n    case 'hours':\n    case 'hour':\n    case 'hrs':\n    case 'hr':\n    case 'h':\n      return n * h;\n    case 'minutes':\n    case 'minute':\n    case 'mins':\n    case 'min':\n    case 'm':\n      return n * m;\n    case 'seconds':\n    case 'second':\n    case 'secs':\n    case 'sec':\n    case 's':\n      return n * s;\n    case 'milliseconds':\n    case 'millisecond':\n    case 'msecs':\n    case 'msec':\n    case 'ms':\n      return n;\n    default:\n      return undefined;\n  }\n}\n\n/**\n * Short format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction fmtShort(ms) {\n  if (ms >= d) {\n    return Math.round(ms / d) + 'd';\n  }\n  if (ms >= h) {\n    return Math.round(ms / h) + 'h';\n  }\n  if (ms >= m) {\n    return Math.round(ms / m) + 'm';\n  }\n  if (ms >= s) {\n    return Math.round(ms / s) + 's';\n  }\n  return ms + 'ms';\n}\n\n/**\n * Long format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction fmtLong(ms) {\n  return plural(ms, d, 'day') ||\n    plural(ms, h, 'hour') ||\n    plural(ms, m, 'minute') ||\n    plural(ms, s, 'second') ||\n    ms + ' ms';\n}\n\n/**\n * Pluralization helper.\n */\n\nfunction plural(ms, n, name) {\n  if (ms < n) {\n    return;\n  }\n  if (ms < n * 1.5) {\n    return Math.floor(ms / n) + ' ' + name;\n  }\n  return Math.ceil(ms / n) + ' ' + name + 's';\n}\n\n\n//# sourceURL=webpack:///./node_modules/ms/index.js?");

/***/ }),

/***/ "./src/platforms/electron/main/index.dev.js":
/*!**************************************************!*\
  !*** ./src/platforms/electron/main/index.dev.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("//F12打开调试界面\n__webpack_require__(/*! electron-debug */ \"./node_modules/electron-debug/index.js\")({});\n\n//# sourceURL=webpack:///./src/platforms/electron/main/index.dev.js?");

/***/ }),

/***/ "./src/platforms/electron/main/index.js":
/*!**********************************************!*\
  !*** ./src/platforms/electron/main/index.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n\n\nvar mainWindow = void 0;\nvar winURL =  true ? 'http://localhost:9080' : undefined;\n\nfunction createWindow() {\n\t\tmainWindow = new electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"]({\n\t\t\t\theight: 563,\n\t\t\t\tuseContentSize: true,\n\t\t\t\ttitleBarStyle: 'hidden',\n\t\t\t\twidth: 1000\n\t\t});\n\t\tmainWindow.loadURL(winURL);\n\t\tmainWindow.on('closed', function () {\n\t\t\t\tmainWindow = null;\n\t\t});\n}\n\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('ready', createWindow);\n\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('activate', function () {\n\t\tif (mainWindow === null) {\n\t\t\t\tcreateWindow();\n\t\t}\n});\n\n//# sourceURL=webpack:///./src/platforms/electron/main/index.js?");

/***/ }),

/***/ 0:
/*!***********************************************************************************************!*\
  !*** multi ./src/platforms/electron/main/index.dev.js ./src/platforms/electron/main/index.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! /Users/zzf/Documents/fespace/node-music/src/platforms/electron/main/index.dev.js */\"./src/platforms/electron/main/index.dev.js\");\nmodule.exports = __webpack_require__(/*! /Users/zzf/Documents/fespace/node-music/src/platforms/electron/main/index.js */\"./src/platforms/electron/main/index.js\");\n\n\n//# sourceURL=webpack:///multi_./src/platforms/electron/main/index.dev.js_./src/platforms/electron/main/index.js?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");\n\n//# sourceURL=webpack:///external_%22electron%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"net\");\n\n//# sourceURL=webpack:///external_%22net%22?");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"tty\");\n\n//# sourceURL=webpack:///external_%22tty%22?");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"util\");\n\n//# sourceURL=webpack:///external_%22util%22?");

/***/ })

/******/ });
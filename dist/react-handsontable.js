(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["HotTable"] = factory(require("react"));
	else
		root["HotTable"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(/*! ./react-handsontable.jsx */ 1).default;

/***/ },
/* 1 */
/*!************************************!*\
  !*** ./src/react-handsontable.jsx ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(/*! react */ 2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _handsontableSettingsMapper = __webpack_require__(/*! ./handsontableSettingsMapper */ 3);
	
	var _handsontableSettingsMapper2 = _interopRequireDefault(_handsontableSettingsMapper);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * A Handsontable-ReactJS wrapper.
	 *
	 * To implement, use the `HotTable` tag with properties corresponding to Handsontable options.
	 * For example:
	 *
	 * ```js
	 * <HotTable root="hot" data={dataObject} contextMenu={true} colHeaders={true} width={600} height={300} stretchH="all" />
	 *
	 * // is analogous to
	 * let hot = new Handsontable(document.getElementById('hot'), {
	 *    data: dataObject,
	 *    contextMenu: true,
	 *    colHeaders: true,
	 *    width: 600
	 *    height: 300
	 * });
	 *
	 * ```
	 *
	 * @class HotTable
	 */
	var HotTable = function (_React$Component) {
	  _inherits(HotTable, _React$Component);
	
	  function HotTable() {
	    _classCallCheck(this, HotTable);
	
	    var _this = _possibleConstructorReturn(this, (HotTable.__proto__ || Object.getPrototypeOf(HotTable)).call(this));
	
	    _this.hotInstance = null;
	    _this.hotSettingsMapper = new _handsontableSettingsMapper2.default();
	    _this.root = null;
	    return _this;
	  }
	
	  /**
	   * Initialize Handsontable after the component has mounted.
	   */
	
	
	  _createClass(HotTable, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var newSettings = this.hotSettingsMapper.getSettings(this.props);
	      this.hotInstance = new Handsontable(document.getElementById(this.root), newSettings);
	    }
	
	    /**
	     * Call the `updateHot` method and prevent the component from re-rendering the instance.
	     *
	     * @param {Object} nextProps
	     * @param {Object} nextState
	     * @returns {Boolean}
	     */
	
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      this.updateHot(this.hotSettingsMapper.getSettings(nextProps));
	
	      return false;
	    }
	
	    /**
	     * Render the table.
	     *
	     * @returns {XML}
	     */
	
	  }, {
	    key: 'render',
	    value: function render() {
	      this.root = this.props.root || 'hot' + new Date().getTime();
	      return _react2.default.createElement('div', { id: this.root });
	    }
	
	    /**
	     * Call the `updateSettings` method for the Handsontable instance.
	     * @param newSettings
	     */
	
	  }, {
	    key: 'updateHot',
	    value: function updateHot(newSettings) {
	      this.hotInstance.updateSettings(newSettings);
	    }
	  }]);
	
	  return HotTable;
	}(_react2.default.Component);
	
	exports.default = HotTable;

/***/ },
/* 2 */
/*!****************************************************************************************************!*\
  !*** external {"root":"React","commonjs2":"react","commonjs":"react","amd":"react","umd":"react"} ***!
  \****************************************************************************************************/
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/*!*******************************************!*\
  !*** ./src/handsontableSettingsMapper.js ***!
  \*******************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var HotSettingsMapper = function () {
	  function HotSettingsMapper() {
	    _classCallCheck(this, HotSettingsMapper);
	
	    this.registeredHooks = Handsontable.hooks.getRegistered();
	  }
	
	  _createClass(HotSettingsMapper, [{
	    key: 'getSettings',
	    value: function getSettings(properties) {
	      var newSettings = {};
	
	      if (properties.settings) {
	        var settings = properties.settings;
	        for (var key in settings) {
	          if (settings.hasOwnProperty(key)) {
	            newSettings[this.trimHookPrefix(key)] = settings[key];
	          }
	        }
	      }
	
	      for (var _key in properties) {
	        if (_key != 'settings' && properties.hasOwnProperty(_key)) {
	          newSettings[this.trimHookPrefix(_key)] = properties[_key];
	        }
	      }
	
	      return newSettings;
	    }
	  }, {
	    key: 'trimHookPrefix',
	    value: function trimHookPrefix(prop) {
	      if (prop.indexOf('on') === 0) {
	        var hookName = prop.charAt(2).toLowerCase() + prop.slice(3, prop.length);
	        if (this.registeredHooks.indexOf(hookName)) {
	          return hookName;
	        }
	      }
	
	      return prop;
	    }
	  }]);
	
	  return HotSettingsMapper;
	}();
	
	exports.default = HotSettingsMapper;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-handsontable.js.map
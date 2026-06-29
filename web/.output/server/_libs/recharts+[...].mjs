import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { r as require_react } from "./react+tanstack__react-query.mjs";
import { C as require_isFunction, S as require_memoize, _ as require_isNumber, a as require_isPlainObject, b as require_sortBy, c as require_mapValues, d as require_flatMap, f as require_min, g as require_isNaN, h as require_uniqBy, i as require_isBoolean, l as require_isEqual, m as require_throttle, n as require_range, o as require_last, p as require_max, r as require_find, s as require_every, t as require_some, u as require_upperFirst, v as require_isString, w as require_isObject, x as require_get, y as require_isNil } from "./lodash.mjs";
import { t as clsx } from "./clsx.mjs";
import { t as require_react_is } from "./react-is.mjs";
import { C as linear, D as implicit, E as point, O as ordinal, S as identity$1, T as band, _ as radial, a as divergingSymlog, b as symlog, c as sequentialLog, d as sequentialSymlog, f as utcTime, g as quantile, h as quantize, i as divergingSqrt, l as sequentialPow, m as threshold, n as divergingLog, o as sequentialQuantile, p as time, r as divergingPow, s as sequential, t as diverging, u as sequentialSqrt, v as pow, w as tickFormat, x as log, y as sqrt } from "./d3-scale+[...].mjs";
import { C as cross_default, D as area_default, E as bumpY, O as line_default, S as diamond_default, T as bumpX, _ as Symbol$1, a as none_default$1, b as star_default, c as stepBefore, d as monotoneX, f as monotoneY, g as basis_default, h as basisClosed_default, i as stack_default, k as linear_default, l as step_default, m as basisOpen_default, n as silhouette_default, o as none_default, p as linearClosed_default, r as expand_default, s as stepAfter, t as wiggle_default, u as natural_default, v as wye_default, w as circle_default, x as square_default, y as triangle_default } from "./d3-shape.mjs";
import { t as decimal_default } from "./decimal.js-light.mjs";
import { t as es6_default } from "./react-smooth.mjs";
import { t as require_eventemitter3 } from "./eventemitter3.mjs";
//#region node_modules/recharts/es6/util/DataUtils.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_isString = /* @__PURE__ */ __toESM(require_isString());
var import_isNaN = /* @__PURE__ */ __toESM(require_isNaN());
var import_get = /* @__PURE__ */ __toESM(require_get());
var import_isNumber = /* @__PURE__ */ __toESM(require_isNumber());
var import_isNil = /* @__PURE__ */ __toESM(require_isNil());
var mathSign = function mathSign(value) {
	if (value === 0) return 0;
	if (value > 0) return 1;
	return -1;
};
var isPercent = function isPercent(value) {
	return (0, import_isString.default)(value) && value.indexOf("%") === value.length - 1;
};
var isNumber = function isNumber(value) {
	return (0, import_isNumber.default)(value) && !(0, import_isNaN.default)(value);
};
var isNullish = function isNullish(value) {
	return (0, import_isNil.default)(value);
};
var isNumOrStr = function isNumOrStr(value) {
	return isNumber(value) || (0, import_isString.default)(value);
};
var idCounter = 0;
var uniqueId = function uniqueId(prefix) {
	var id = ++idCounter;
	return "".concat(prefix || "").concat(id);
};
/**
* Get percent value of a total value
* @param {number|string} percent A percent
* @param {number} totalValue     Total value
* @param {number} defaultValue   The value returned when percent is undefined or invalid
* @param {boolean} validate      If set to be true, the result will be validated
* @return {number} value
*/
var getPercentValue = function getPercentValue(percent, totalValue) {
	var defaultValue = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
	var validate = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
	if (!isNumber(percent) && !(0, import_isString.default)(percent)) return defaultValue;
	var value;
	if (isPercent(percent)) {
		var index = percent.indexOf("%");
		value = totalValue * parseFloat(percent.slice(0, index)) / 100;
	} else value = +percent;
	if ((0, import_isNaN.default)(value)) value = defaultValue;
	if (validate && value > totalValue) value = totalValue;
	return value;
};
var getAnyElementOfObject = function getAnyElementOfObject(obj) {
	if (!obj) return null;
	var keys = Object.keys(obj);
	if (keys && keys.length) return obj[keys[0]];
	return null;
};
var hasDuplicate = function hasDuplicate(ary) {
	if (!Array.isArray(ary)) return false;
	var len = ary.length;
	var cache = {};
	for (var i = 0; i < len; i++) if (!cache[ary[i]]) cache[ary[i]] = true;
	else return true;
	return false;
};
var interpolateNumber$1 = function interpolateNumber(numberA, numberB) {
	if (isNumber(numberA) && isNumber(numberB)) return function(t) {
		return numberA + t * (numberB - numberA);
	};
	return function() {
		return numberB;
	};
};
function findEntryInArray(ary, specifiedKey, specifiedValue) {
	if (!ary || !ary.length) return null;
	return ary.find(function(entry) {
		return entry && (typeof specifiedKey === "function" ? specifiedKey(entry) : (0, import_get.default)(entry, specifiedKey)) === specifiedValue;
	});
}
/**
* Compare values.
*
* This function is intended to be passed to `Array.prototype.sort()`. It properly compares generic homogeneous arrays that are either `string[]`,
* `number[]`, or `Date[]`. When comparing heterogeneous arrays or homogeneous arrays of other types, it will attempt to compare items properly but
* will fall back to string comparison for mismatched or unsupported types.
*
* For some background, `Array.prototype.sort()`'s default comparator coerces each of the array's items into a string and compares the strings. This
* often leads to undesirable behavior, especially with numerical items.
*
* @param {unknown} a The first item to compare
* @param {unknown} b The second item to compare
* @return {number} A negative number if a < b, a positive number if a > b, 0 if equal
*/
var compareValues = function compareValues(a, b) {
	if (isNumber(a) && isNumber(b)) return a - b;
	if ((0, import_isString.default)(a) && (0, import_isString.default)(b)) return a.localeCompare(b);
	if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
	return String(a).localeCompare(String(b));
};
//#endregion
//#region node_modules/recharts/es6/component/DefaultTooltipContent.js
var import_isObject = /* @__PURE__ */ __toESM(require_isObject());
var import_isFunction = /* @__PURE__ */ __toESM(require_isFunction());
var import_memoize = /* @__PURE__ */ __toESM(require_memoize());
/**
* @fileOverview Default Tooltip Content
*/
var import_sortBy = /* @__PURE__ */ __toESM(require_sortBy());
function _typeof$40(o) {
	"@babel/helpers - typeof";
	return _typeof$40 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$40(o);
}
function _extends$26() {
	_extends$26 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$26.apply(this, arguments);
}
function _slicedToArray$9(arr, i) {
	return _arrayWithHoles$9(arr) || _iterableToArrayLimit$9(arr, i) || _unsupportedIterableToArray$14(arr, i) || _nonIterableRest$9();
}
function _nonIterableRest$9() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$14(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$14(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$14(o, minLen);
}
function _arrayLikeToArray$14(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _iterableToArrayLimit$9(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayWithHoles$9(arr) {
	if (Array.isArray(arr)) return arr;
}
function ownKeys$32(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$32(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$32(Object(t), !0).forEach(function(r) {
			_defineProperty$37(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$32(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$37(obj, key, value) {
	key = _toPropertyKey$38(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$38(t) {
	var i = _toPrimitive$38(t, "string");
	return "symbol" == _typeof$40(i) ? i : i + "";
}
function _toPrimitive$38(t, r) {
	if ("object" != _typeof$40(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$40(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function defaultFormatter(value) {
	return Array.isArray(value) && isNumOrStr(value[0]) && isNumOrStr(value[1]) ? value.join(" ~ ") : value;
}
var DefaultTooltipContent = function DefaultTooltipContent(props) {
	var _props$separator = props.separator, separator = _props$separator === void 0 ? " : " : _props$separator, _props$contentStyle = props.contentStyle, contentStyle = _props$contentStyle === void 0 ? {} : _props$contentStyle, _props$itemStyle = props.itemStyle, itemStyle = _props$itemStyle === void 0 ? {} : _props$itemStyle, _props$labelStyle = props.labelStyle, labelStyle = _props$labelStyle === void 0 ? {} : _props$labelStyle, payload = props.payload, formatter = props.formatter, itemSorter = props.itemSorter, wrapperClassName = props.wrapperClassName, labelClassName = props.labelClassName, label = props.label, labelFormatter = props.labelFormatter, _props$accessibilityL = props.accessibilityLayer, accessibilityLayer = _props$accessibilityL === void 0 ? false : _props$accessibilityL;
	var renderContent = function renderContent() {
		if (payload && payload.length) {
			var listStyle = {
				padding: 0,
				margin: 0
			};
			var items = (itemSorter ? (0, import_sortBy.default)(payload, itemSorter) : payload).map(function(entry, i) {
				if (entry.type === "none") return null;
				var finalItemStyle = _objectSpread$32({
					display: "block",
					paddingTop: 4,
					paddingBottom: 4,
					color: entry.color || "#000"
				}, itemStyle);
				var finalFormatter = entry.formatter || formatter || defaultFormatter;
				var value = entry.value, name = entry.name;
				var finalValue = value;
				var finalName = name;
				if (finalFormatter && finalValue != null && finalName != null) {
					var formatted = finalFormatter(value, name, entry, i, payload);
					if (Array.isArray(formatted)) {
						var _formatted = _slicedToArray$9(formatted, 2);
						finalValue = _formatted[0];
						finalName = _formatted[1];
					} else finalValue = formatted;
				}
				return /*#__PURE__*/ import_react.createElement("li", {
					className: "recharts-tooltip-item",
					key: "tooltip-item-".concat(i),
					style: finalItemStyle
				}, isNumOrStr(finalName) ? /*#__PURE__*/ import_react.createElement("span", { className: "recharts-tooltip-item-name" }, finalName) : null, isNumOrStr(finalName) ? /*#__PURE__*/ import_react.createElement("span", { className: "recharts-tooltip-item-separator" }, separator) : null, /*#__PURE__*/ import_react.createElement("span", { className: "recharts-tooltip-item-value" }, finalValue), /*#__PURE__*/ import_react.createElement("span", { className: "recharts-tooltip-item-unit" }, entry.unit || ""));
			});
			return /*#__PURE__*/ import_react.createElement("ul", {
				className: "recharts-tooltip-item-list",
				style: listStyle
			}, items);
		}
		return null;
	};
	var finalStyle = _objectSpread$32({
		margin: 0,
		padding: 10,
		backgroundColor: "#fff",
		border: "1px solid #ccc",
		whiteSpace: "nowrap"
	}, contentStyle);
	var finalLabelStyle = _objectSpread$32({ margin: 0 }, labelStyle);
	var hasLabel = !(0, import_isNil.default)(label);
	var finalLabel = hasLabel ? label : "";
	var wrapperCN = clsx("recharts-default-tooltip", wrapperClassName);
	var labelCN = clsx("recharts-tooltip-label", labelClassName);
	if (hasLabel && labelFormatter && payload !== void 0 && payload !== null) finalLabel = labelFormatter(label, payload);
	var accessibilityAttributes = accessibilityLayer ? {
		role: "status",
		"aria-live": "assertive"
	} : {};
	return /*#__PURE__*/ import_react.createElement("div", _extends$26({
		className: wrapperCN,
		style: finalStyle
	}, accessibilityAttributes), /*#__PURE__*/ import_react.createElement("p", {
		className: labelCN,
		style: finalLabelStyle
	}, /*#__PURE__*/ import_react.isValidElement(finalLabel) ? finalLabel : "".concat(finalLabel)), renderContent());
};
//#endregion
//#region node_modules/recharts/es6/util/tooltip/translate.js
function _typeof$39(o) {
	"@babel/helpers - typeof";
	return _typeof$39 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$39(o);
}
function _defineProperty$36(obj, key, value) {
	key = _toPropertyKey$37(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$37(t) {
	var i = _toPrimitive$37(t, "string");
	return "symbol" == _typeof$39(i) ? i : i + "";
}
function _toPrimitive$37(t, r) {
	if ("object" != _typeof$39(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$39(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var CSS_CLASS_PREFIX = "recharts-tooltip-wrapper";
var TOOLTIP_HIDDEN = { visibility: "hidden" };
function getTooltipCSSClassName(_ref) {
	var coordinate = _ref.coordinate, translateX = _ref.translateX, translateY = _ref.translateY;
	return clsx(CSS_CLASS_PREFIX, _defineProperty$36(_defineProperty$36(_defineProperty$36(_defineProperty$36({}, "".concat(CSS_CLASS_PREFIX, "-right"), isNumber(translateX) && coordinate && isNumber(coordinate.x) && translateX >= coordinate.x), "".concat(CSS_CLASS_PREFIX, "-left"), isNumber(translateX) && coordinate && isNumber(coordinate.x) && translateX < coordinate.x), "".concat(CSS_CLASS_PREFIX, "-bottom"), isNumber(translateY) && coordinate && isNumber(coordinate.y) && translateY >= coordinate.y), "".concat(CSS_CLASS_PREFIX, "-top"), isNumber(translateY) && coordinate && isNumber(coordinate.y) && translateY < coordinate.y));
}
function getTooltipTranslateXY(_ref2) {
	var allowEscapeViewBox = _ref2.allowEscapeViewBox, coordinate = _ref2.coordinate, key = _ref2.key, offsetTopLeft = _ref2.offsetTopLeft, position = _ref2.position, reverseDirection = _ref2.reverseDirection, tooltipDimension = _ref2.tooltipDimension, viewBox = _ref2.viewBox, viewBoxDimension = _ref2.viewBoxDimension;
	if (position && isNumber(position[key])) return position[key];
	var negative = coordinate[key] - tooltipDimension - offsetTopLeft;
	var positive = coordinate[key] + offsetTopLeft;
	if (allowEscapeViewBox[key]) return reverseDirection[key] ? negative : positive;
	if (reverseDirection[key]) {
		if (negative < viewBox[key]) return Math.max(positive, viewBox[key]);
		return Math.max(negative, viewBox[key]);
	}
	if (positive + tooltipDimension > viewBox[key] + viewBoxDimension) return Math.max(negative, viewBox[key]);
	return Math.max(positive, viewBox[key]);
}
function getTransformStyle(_ref3) {
	var translateX = _ref3.translateX, translateY = _ref3.translateY;
	return { transform: _ref3.useTranslate3d ? "translate3d(".concat(translateX, "px, ").concat(translateY, "px, 0)") : "translate(".concat(translateX, "px, ").concat(translateY, "px)") };
}
function getTooltipTranslate(_ref4) {
	var allowEscapeViewBox = _ref4.allowEscapeViewBox, coordinate = _ref4.coordinate, offsetTopLeft = _ref4.offsetTopLeft, position = _ref4.position, reverseDirection = _ref4.reverseDirection, tooltipBox = _ref4.tooltipBox, useTranslate3d = _ref4.useTranslate3d, viewBox = _ref4.viewBox;
	var cssProperties, translateX, translateY;
	if (tooltipBox.height > 0 && tooltipBox.width > 0 && coordinate) {
		translateX = getTooltipTranslateXY({
			allowEscapeViewBox,
			coordinate,
			key: "x",
			offsetTopLeft,
			position,
			reverseDirection,
			tooltipDimension: tooltipBox.width,
			viewBox,
			viewBoxDimension: viewBox.width
		});
		translateY = getTooltipTranslateXY({
			allowEscapeViewBox,
			coordinate,
			key: "y",
			offsetTopLeft,
			position,
			reverseDirection,
			tooltipDimension: tooltipBox.height,
			viewBox,
			viewBoxDimension: viewBox.height
		});
		cssProperties = getTransformStyle({
			translateX,
			translateY,
			useTranslate3d
		});
	} else cssProperties = TOOLTIP_HIDDEN;
	return {
		cssProperties,
		cssClasses: getTooltipCSSClassName({
			translateX,
			translateY,
			coordinate
		})
	};
}
//#endregion
//#region node_modules/recharts/es6/component/TooltipBoundingBox.js
function _typeof$38(o) {
	"@babel/helpers - typeof";
	return _typeof$38 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$38(o);
}
function ownKeys$31(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$31(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$31(Object(t), !0).forEach(function(r) {
			_defineProperty$35(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$31(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _classCallCheck$17(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$17(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$36(descriptor.key), descriptor);
	}
}
function _createClass$17(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$17(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$17(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$14(t, o, e) {
	return o = _getPrototypeOf$14(o), _possibleConstructorReturn$14(t, _isNativeReflectConstruct$14() ? Reflect.construct(o, e || [], _getPrototypeOf$14(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$14(self, call) {
	if (call && (_typeof$38(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$14(self);
}
function _assertThisInitialized$14(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$14() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$14 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$14(o) {
	_getPrototypeOf$14 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$14(o);
}
function _inherits$14(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$14(subClass, superClass);
}
function _setPrototypeOf$14(o, p) {
	_setPrototypeOf$14 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$14(o, p);
}
function _defineProperty$35(obj, key, value) {
	key = _toPropertyKey$36(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$36(t) {
	var i = _toPrimitive$36(t, "string");
	return "symbol" == _typeof$38(i) ? i : i + "";
}
function _toPrimitive$36(t, r) {
	if ("object" != _typeof$38(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$38(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var EPSILON = 1;
var TooltipBoundingBox = /*#__PURE__*/ function(_PureComponent) {
	function TooltipBoundingBox() {
		var _this;
		_classCallCheck$17(this, TooltipBoundingBox);
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		_this = _callSuper$14(this, TooltipBoundingBox, [].concat(args));
		_defineProperty$35(_this, "state", {
			dismissed: false,
			dismissedAtCoordinate: {
				x: 0,
				y: 0
			},
			lastBoundingBox: {
				width: -1,
				height: -1
			}
		});
		_defineProperty$35(_this, "handleKeyDown", function(event) {
			if (event.key === "Escape") {
				var _this$props$coordinat, _this$props$coordinat2, _this$props$coordinat3, _this$props$coordinat4;
				_this.setState({
					dismissed: true,
					dismissedAtCoordinate: {
						x: (_this$props$coordinat = (_this$props$coordinat2 = _this.props.coordinate) === null || _this$props$coordinat2 === void 0 ? void 0 : _this$props$coordinat2.x) !== null && _this$props$coordinat !== void 0 ? _this$props$coordinat : 0,
						y: (_this$props$coordinat3 = (_this$props$coordinat4 = _this.props.coordinate) === null || _this$props$coordinat4 === void 0 ? void 0 : _this$props$coordinat4.y) !== null && _this$props$coordinat3 !== void 0 ? _this$props$coordinat3 : 0
					}
				});
			}
		});
		return _this;
	}
	_inherits$14(TooltipBoundingBox, _PureComponent);
	return _createClass$17(TooltipBoundingBox, [
		{
			key: "updateBBox",
			value: function updateBBox() {
				if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
					var box = this.wrapperNode.getBoundingClientRect();
					if (Math.abs(box.width - this.state.lastBoundingBox.width) > EPSILON || Math.abs(box.height - this.state.lastBoundingBox.height) > EPSILON) this.setState({ lastBoundingBox: {
						width: box.width,
						height: box.height
					} });
				} else if (this.state.lastBoundingBox.width !== -1 || this.state.lastBoundingBox.height !== -1) this.setState({ lastBoundingBox: {
					width: -1,
					height: -1
				} });
			}
		},
		{
			key: "componentDidMount",
			value: function componentDidMount() {
				document.addEventListener("keydown", this.handleKeyDown);
				this.updateBBox();
			}
		},
		{
			key: "componentWillUnmount",
			value: function componentWillUnmount() {
				document.removeEventListener("keydown", this.handleKeyDown);
			}
		},
		{
			key: "componentDidUpdate",
			value: function componentDidUpdate() {
				var _this$props$coordinat5, _this$props$coordinat6;
				if (this.props.active) this.updateBBox();
				if (!this.state.dismissed) return;
				if (((_this$props$coordinat5 = this.props.coordinate) === null || _this$props$coordinat5 === void 0 ? void 0 : _this$props$coordinat5.x) !== this.state.dismissedAtCoordinate.x || ((_this$props$coordinat6 = this.props.coordinate) === null || _this$props$coordinat6 === void 0 ? void 0 : _this$props$coordinat6.y) !== this.state.dismissedAtCoordinate.y) this.state.dismissed = false;
			}
		},
		{
			key: "render",
			value: function render() {
				var _this2 = this;
				var _this$props = this.props, active = _this$props.active, allowEscapeViewBox = _this$props.allowEscapeViewBox, animationDuration = _this$props.animationDuration, animationEasing = _this$props.animationEasing, children = _this$props.children, coordinate = _this$props.coordinate, hasPayload = _this$props.hasPayload, isAnimationActive = _this$props.isAnimationActive, offset = _this$props.offset, position = _this$props.position, reverseDirection = _this$props.reverseDirection, useTranslate3d = _this$props.useTranslate3d, viewBox = _this$props.viewBox, wrapperStyle = _this$props.wrapperStyle;
				var _getTooltipTranslate = getTooltipTranslate({
					allowEscapeViewBox,
					coordinate,
					offsetTopLeft: offset,
					position,
					reverseDirection,
					tooltipBox: this.state.lastBoundingBox,
					useTranslate3d,
					viewBox
				}), cssClasses = _getTooltipTranslate.cssClasses, cssProperties = _getTooltipTranslate.cssProperties;
				var outerStyle = _objectSpread$31(_objectSpread$31({ transition: isAnimationActive && active ? "transform ".concat(animationDuration, "ms ").concat(animationEasing) : void 0 }, cssProperties), {}, {
					pointerEvents: "none",
					visibility: !this.state.dismissed && active && hasPayload ? "visible" : "hidden",
					position: "absolute",
					top: 0,
					left: 0
				}, wrapperStyle);
				return /*#__PURE__*/ import_react.createElement("div", {
					tabIndex: -1,
					className: cssClasses,
					style: outerStyle,
					ref: function ref(node) {
						_this2.wrapperNode = node;
					}
				}, children);
			}
		}
	]);
}(import_react.PureComponent);
var Global = {
	isSsr: function parseIsSsrByDefault() {
		return !(typeof window !== "undefined" && window.document && window.document.createElement && window.setTimeout);
	}(),
	get: function get(key) {
		return Global[key];
	},
	set: function set(key, value) {
		if (typeof key === "string") Global[key] = value;
		else {
			var keys = Object.keys(key);
			if (keys && keys.length) keys.forEach(function(k) {
				Global[k] = key[k];
			});
		}
	}
};
//#endregion
//#region node_modules/recharts/es6/util/payload/getUniqPayload.js
var import_uniqBy = /* @__PURE__ */ __toESM(require_uniqBy());
/**
* This is configuration option that decides how to filter for unique values only:
*
* - `false` means "no filter"
* - `true` means "use recharts default filter"
* - function means "use return of this function as the default key"
*/
function getUniqPayload(payload, option, defaultUniqBy) {
	if (option === true) return (0, import_uniqBy.default)(payload, defaultUniqBy);
	if ((0, import_isFunction.default)(option)) return (0, import_uniqBy.default)(payload, option);
	return payload;
}
//#endregion
//#region node_modules/recharts/es6/component/Tooltip.js
/**
* @fileOverview Tooltip
*/
function _typeof$37(o) {
	"@babel/helpers - typeof";
	return _typeof$37 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$37(o);
}
function ownKeys$30(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$30(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$30(Object(t), !0).forEach(function(r) {
			_defineProperty$34(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$30(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _classCallCheck$16(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$16(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$35(descriptor.key), descriptor);
	}
}
function _createClass$16(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$16(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$16(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$13(t, o, e) {
	return o = _getPrototypeOf$13(o), _possibleConstructorReturn$13(t, _isNativeReflectConstruct$13() ? Reflect.construct(o, e || [], _getPrototypeOf$13(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$13(self, call) {
	if (call && (_typeof$37(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$13(self);
}
function _assertThisInitialized$13(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$13() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$13 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$13(o) {
	_getPrototypeOf$13 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$13(o);
}
function _inherits$13(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$13(subClass, superClass);
}
function _setPrototypeOf$13(o, p) {
	_setPrototypeOf$13 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$13(o, p);
}
function _defineProperty$34(obj, key, value) {
	key = _toPropertyKey$35(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$35(t) {
	var i = _toPrimitive$35(t, "string");
	return "symbol" == _typeof$37(i) ? i : i + "";
}
function _toPrimitive$35(t, r) {
	if ("object" != _typeof$37(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$37(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function defaultUniqBy$1(entry) {
	return entry.dataKey;
}
function renderContent$1(content, props) {
	if (/*#__PURE__*/ import_react.isValidElement(content)) return /*#__PURE__*/ import_react.cloneElement(content, props);
	if (typeof content === "function") return /*#__PURE__*/ import_react.createElement(content, props);
	return /*#__PURE__*/ import_react.createElement(DefaultTooltipContent, props);
}
var Tooltip = /*#__PURE__*/ function(_PureComponent) {
	function Tooltip() {
		_classCallCheck$16(this, Tooltip);
		return _callSuper$13(this, Tooltip, arguments);
	}
	_inherits$13(Tooltip, _PureComponent);
	return _createClass$16(Tooltip, [{
		key: "render",
		value: function render() {
			var _this = this;
			var _this$props = this.props, active = _this$props.active, allowEscapeViewBox = _this$props.allowEscapeViewBox, animationDuration = _this$props.animationDuration, animationEasing = _this$props.animationEasing, content = _this$props.content, coordinate = _this$props.coordinate, filterNull = _this$props.filterNull, isAnimationActive = _this$props.isAnimationActive, offset = _this$props.offset, payload = _this$props.payload, payloadUniqBy = _this$props.payloadUniqBy, position = _this$props.position, reverseDirection = _this$props.reverseDirection, useTranslate3d = _this$props.useTranslate3d, viewBox = _this$props.viewBox, wrapperStyle = _this$props.wrapperStyle;
			var finalPayload = payload !== null && payload !== void 0 ? payload : [];
			if (filterNull && finalPayload.length) finalPayload = getUniqPayload(payload.filter(function(entry) {
				return entry.value != null && (entry.hide !== true || _this.props.includeHidden);
			}), payloadUniqBy, defaultUniqBy$1);
			var hasPayload = finalPayload.length > 0;
			return /*#__PURE__*/ import_react.createElement(TooltipBoundingBox, {
				allowEscapeViewBox,
				animationDuration,
				animationEasing,
				isAnimationActive,
				active,
				coordinate,
				hasPayload,
				offset,
				position,
				reverseDirection,
				useTranslate3d,
				viewBox,
				wrapperStyle
			}, renderContent$1(content, _objectSpread$30(_objectSpread$30({}, this.props), {}, { payload: finalPayload })));
		}
	}]);
}(import_react.PureComponent);
_defineProperty$34(Tooltip, "displayName", "Tooltip");
_defineProperty$34(Tooltip, "defaultProps", {
	accessibilityLayer: false,
	allowEscapeViewBox: {
		x: false,
		y: false
	},
	animationDuration: 400,
	animationEasing: "ease",
	contentStyle: {},
	coordinate: {
		x: 0,
		y: 0
	},
	cursor: true,
	cursorStyle: {},
	filterNull: true,
	isAnimationActive: !Global.isSsr,
	itemStyle: {},
	labelStyle: {},
	offset: 10,
	reverseDirection: {
		x: false,
		y: false
	},
	separator: " : ",
	trigger: "hover",
	useTranslate3d: false,
	viewBox: {
		x: 0,
		y: 0,
		height: 0,
		width: 0
	},
	wrapperStyle: {}
});
//#endregion
//#region node_modules/recharts/es6/util/LogUtils.js
var import_throttle = /* @__PURE__ */ __toESM(require_throttle());
var warn = function warn(condition, format) {
	for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
};
//#endregion
//#region node_modules/recharts/es6/util/ShallowEqual.js
var import_react_is = require_react_is();
function shallowEqual(a, b) {
	for (var key in a) if ({}.hasOwnProperty.call(a, key) && (!{}.hasOwnProperty.call(b, key) || a[key] !== b[key])) return false;
	for (var _key in b) if ({}.hasOwnProperty.call(b, _key) && !{}.hasOwnProperty.call(a, _key)) return false;
	return true;
}
//#endregion
//#region node_modules/recharts/es6/util/types.js
function _typeof$36(o) {
	"@babel/helpers - typeof";
	return _typeof$36 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$36(o);
}
/**
* Determines how values are stacked:
*
* - `none` is the default, it adds values on top of each other. No smarts. Negative values will overlap.
* - `expand` make it so that the values always add up to 1 - so the chart will look like a rectangle.
* - `wiggle` and `silhouette` tries to keep the chart centered.
* - `sign` stacks positive values above zero and negative values below zero. Similar to `none` but handles negatives.
* - `positive` ignores all negative values, and then behaves like \`none\`.
*
* Also see https://d3js.org/d3-shape/stack#stack-offsets
* (note that the `diverging` offset in d3 is named `sign` in recharts)
*/
var SVGContainerPropKeys = ["viewBox", "children"];
var SVGElementPropKeys = [
	"aria-activedescendant",
	"aria-atomic",
	"aria-autocomplete",
	"aria-busy",
	"aria-checked",
	"aria-colcount",
	"aria-colindex",
	"aria-colspan",
	"aria-controls",
	"aria-current",
	"aria-describedby",
	"aria-details",
	"aria-disabled",
	"aria-errormessage",
	"aria-expanded",
	"aria-flowto",
	"aria-haspopup",
	"aria-hidden",
	"aria-invalid",
	"aria-keyshortcuts",
	"aria-label",
	"aria-labelledby",
	"aria-level",
	"aria-live",
	"aria-modal",
	"aria-multiline",
	"aria-multiselectable",
	"aria-orientation",
	"aria-owns",
	"aria-placeholder",
	"aria-posinset",
	"aria-pressed",
	"aria-readonly",
	"aria-relevant",
	"aria-required",
	"aria-roledescription",
	"aria-rowcount",
	"aria-rowindex",
	"aria-rowspan",
	"aria-selected",
	"aria-setsize",
	"aria-sort",
	"aria-valuemax",
	"aria-valuemin",
	"aria-valuenow",
	"aria-valuetext",
	"className",
	"color",
	"height",
	"id",
	"lang",
	"max",
	"media",
	"method",
	"min",
	"name",
	"style",
	"target",
	"width",
	"role",
	"tabIndex",
	"accentHeight",
	"accumulate",
	"additive",
	"alignmentBaseline",
	"allowReorder",
	"alphabetic",
	"amplitude",
	"arabicForm",
	"ascent",
	"attributeName",
	"attributeType",
	"autoReverse",
	"azimuth",
	"baseFrequency",
	"baselineShift",
	"baseProfile",
	"bbox",
	"begin",
	"bias",
	"by",
	"calcMode",
	"capHeight",
	"clip",
	"clipPath",
	"clipPathUnits",
	"clipRule",
	"colorInterpolation",
	"colorInterpolationFilters",
	"colorProfile",
	"colorRendering",
	"contentScriptType",
	"contentStyleType",
	"cursor",
	"cx",
	"cy",
	"d",
	"decelerate",
	"descent",
	"diffuseConstant",
	"direction",
	"display",
	"divisor",
	"dominantBaseline",
	"dur",
	"dx",
	"dy",
	"edgeMode",
	"elevation",
	"enableBackground",
	"end",
	"exponent",
	"externalResourcesRequired",
	"fill",
	"fillOpacity",
	"fillRule",
	"filter",
	"filterRes",
	"filterUnits",
	"floodColor",
	"floodOpacity",
	"focusable",
	"fontFamily",
	"fontSize",
	"fontSizeAdjust",
	"fontStretch",
	"fontStyle",
	"fontVariant",
	"fontWeight",
	"format",
	"from",
	"fx",
	"fy",
	"g1",
	"g2",
	"glyphName",
	"glyphOrientationHorizontal",
	"glyphOrientationVertical",
	"glyphRef",
	"gradientTransform",
	"gradientUnits",
	"hanging",
	"horizAdvX",
	"horizOriginX",
	"href",
	"ideographic",
	"imageRendering",
	"in2",
	"in",
	"intercept",
	"k1",
	"k2",
	"k3",
	"k4",
	"k",
	"kernelMatrix",
	"kernelUnitLength",
	"kerning",
	"keyPoints",
	"keySplines",
	"keyTimes",
	"lengthAdjust",
	"letterSpacing",
	"lightingColor",
	"limitingConeAngle",
	"local",
	"markerEnd",
	"markerHeight",
	"markerMid",
	"markerStart",
	"markerUnits",
	"markerWidth",
	"mask",
	"maskContentUnits",
	"maskUnits",
	"mathematical",
	"mode",
	"numOctaves",
	"offset",
	"opacity",
	"operator",
	"order",
	"orient",
	"orientation",
	"origin",
	"overflow",
	"overlinePosition",
	"overlineThickness",
	"paintOrder",
	"panose1",
	"pathLength",
	"patternContentUnits",
	"patternTransform",
	"patternUnits",
	"pointerEvents",
	"pointsAtX",
	"pointsAtY",
	"pointsAtZ",
	"preserveAlpha",
	"preserveAspectRatio",
	"primitiveUnits",
	"r",
	"radius",
	"refX",
	"refY",
	"renderingIntent",
	"repeatCount",
	"repeatDur",
	"requiredExtensions",
	"requiredFeatures",
	"restart",
	"result",
	"rotate",
	"rx",
	"ry",
	"seed",
	"shapeRendering",
	"slope",
	"spacing",
	"specularConstant",
	"specularExponent",
	"speed",
	"spreadMethod",
	"startOffset",
	"stdDeviation",
	"stemh",
	"stemv",
	"stitchTiles",
	"stopColor",
	"stopOpacity",
	"strikethroughPosition",
	"strikethroughThickness",
	"string",
	"stroke",
	"strokeDasharray",
	"strokeDashoffset",
	"strokeLinecap",
	"strokeLinejoin",
	"strokeMiterlimit",
	"strokeOpacity",
	"strokeWidth",
	"surfaceScale",
	"systemLanguage",
	"tableValues",
	"targetX",
	"targetY",
	"textAnchor",
	"textDecoration",
	"textLength",
	"textRendering",
	"to",
	"transform",
	"u1",
	"u2",
	"underlinePosition",
	"underlineThickness",
	"unicode",
	"unicodeBidi",
	"unicodeRange",
	"unitsPerEm",
	"vAlphabetic",
	"values",
	"vectorEffect",
	"version",
	"vertAdvY",
	"vertOriginX",
	"vertOriginY",
	"vHanging",
	"vIdeographic",
	"viewTarget",
	"visibility",
	"vMathematical",
	"widths",
	"wordSpacing",
	"writingMode",
	"x1",
	"x2",
	"x",
	"xChannelSelector",
	"xHeight",
	"xlinkActuate",
	"xlinkArcrole",
	"xlinkHref",
	"xlinkRole",
	"xlinkShow",
	"xlinkTitle",
	"xlinkType",
	"xmlBase",
	"xmlLang",
	"xmlns",
	"xmlnsXlink",
	"xmlSpace",
	"y1",
	"y2",
	"y",
	"yChannelSelector",
	"z",
	"zoomAndPan",
	"ref",
	"key",
	"angle"
];
var PolyElementKeys = ["points", "pathLength"];
/** svg element types that have specific attribute filtration requirements */
/** map of svg element types to unique svg attributes that belong to that element */
var FilteredElementKeyMap = {
	svg: SVGContainerPropKeys,
	polygon: PolyElementKeys,
	polyline: PolyElementKeys
};
var EventKeys = [
	"dangerouslySetInnerHTML",
	"onCopy",
	"onCopyCapture",
	"onCut",
	"onCutCapture",
	"onPaste",
	"onPasteCapture",
	"onCompositionEnd",
	"onCompositionEndCapture",
	"onCompositionStart",
	"onCompositionStartCapture",
	"onCompositionUpdate",
	"onCompositionUpdateCapture",
	"onFocus",
	"onFocusCapture",
	"onBlur",
	"onBlurCapture",
	"onChange",
	"onChangeCapture",
	"onBeforeInput",
	"onBeforeInputCapture",
	"onInput",
	"onInputCapture",
	"onReset",
	"onResetCapture",
	"onSubmit",
	"onSubmitCapture",
	"onInvalid",
	"onInvalidCapture",
	"onLoad",
	"onLoadCapture",
	"onError",
	"onErrorCapture",
	"onKeyDown",
	"onKeyDownCapture",
	"onKeyPress",
	"onKeyPressCapture",
	"onKeyUp",
	"onKeyUpCapture",
	"onAbort",
	"onAbortCapture",
	"onCanPlay",
	"onCanPlayCapture",
	"onCanPlayThrough",
	"onCanPlayThroughCapture",
	"onDurationChange",
	"onDurationChangeCapture",
	"onEmptied",
	"onEmptiedCapture",
	"onEncrypted",
	"onEncryptedCapture",
	"onEnded",
	"onEndedCapture",
	"onLoadedData",
	"onLoadedDataCapture",
	"onLoadedMetadata",
	"onLoadedMetadataCapture",
	"onLoadStart",
	"onLoadStartCapture",
	"onPause",
	"onPauseCapture",
	"onPlay",
	"onPlayCapture",
	"onPlaying",
	"onPlayingCapture",
	"onProgress",
	"onProgressCapture",
	"onRateChange",
	"onRateChangeCapture",
	"onSeeked",
	"onSeekedCapture",
	"onSeeking",
	"onSeekingCapture",
	"onStalled",
	"onStalledCapture",
	"onSuspend",
	"onSuspendCapture",
	"onTimeUpdate",
	"onTimeUpdateCapture",
	"onVolumeChange",
	"onVolumeChangeCapture",
	"onWaiting",
	"onWaitingCapture",
	"onAuxClick",
	"onAuxClickCapture",
	"onClick",
	"onClickCapture",
	"onContextMenu",
	"onContextMenuCapture",
	"onDoubleClick",
	"onDoubleClickCapture",
	"onDrag",
	"onDragCapture",
	"onDragEnd",
	"onDragEndCapture",
	"onDragEnter",
	"onDragEnterCapture",
	"onDragExit",
	"onDragExitCapture",
	"onDragLeave",
	"onDragLeaveCapture",
	"onDragOver",
	"onDragOverCapture",
	"onDragStart",
	"onDragStartCapture",
	"onDrop",
	"onDropCapture",
	"onMouseDown",
	"onMouseDownCapture",
	"onMouseEnter",
	"onMouseLeave",
	"onMouseMove",
	"onMouseMoveCapture",
	"onMouseOut",
	"onMouseOutCapture",
	"onMouseOver",
	"onMouseOverCapture",
	"onMouseUp",
	"onMouseUpCapture",
	"onSelect",
	"onSelectCapture",
	"onTouchCancel",
	"onTouchCancelCapture",
	"onTouchEnd",
	"onTouchEndCapture",
	"onTouchMove",
	"onTouchMoveCapture",
	"onTouchStart",
	"onTouchStartCapture",
	"onPointerDown",
	"onPointerDownCapture",
	"onPointerMove",
	"onPointerMoveCapture",
	"onPointerUp",
	"onPointerUpCapture",
	"onPointerCancel",
	"onPointerCancelCapture",
	"onPointerEnter",
	"onPointerEnterCapture",
	"onPointerLeave",
	"onPointerLeaveCapture",
	"onPointerOver",
	"onPointerOverCapture",
	"onPointerOut",
	"onPointerOutCapture",
	"onGotPointerCapture",
	"onGotPointerCaptureCapture",
	"onLostPointerCapture",
	"onLostPointerCaptureCapture",
	"onScroll",
	"onScrollCapture",
	"onWheel",
	"onWheelCapture",
	"onAnimationStart",
	"onAnimationStartCapture",
	"onAnimationEnd",
	"onAnimationEndCapture",
	"onAnimationIteration",
	"onAnimationIterationCapture",
	"onTransitionEnd",
	"onTransitionEndCapture"
];
/** The type of easing function to use for animations */
/** Specifies the duration of animation, the unit of this option is ms. */
/** the offset of a chart, which define the blank space all around */
/**
* The domain of axis.
* This is the definition
*
* Numeric domain is always defined by an array of exactly two values, for the min and the max of the axis.
* Categorical domain is defined as array of all possible values.
*
* Can be specified in many ways:
* - array of numbers
* - with special strings like 'dataMin' and 'dataMax'
* - with special string math like 'dataMin - 100'
* - with keyword 'auto'
* - or a function
* - array of functions
* - or a combination of the above
*/
/**
* NumberDomain is an evaluated {@link AxisDomain}.
* Unlike {@link AxisDomain}, it has no variety - it's a tuple of two number.
* This is after all the keywords and functions were evaluated and what is left is [min, max].
*
* Know that the min, max values are not guaranteed to be nice numbers - values like -Infinity or NaN are possible.
*
* There are also `category` axes that have different things than numbers in their domain.
*/
/** The props definition of base axis */
/** Defines how ticks are placed and whether / how tick collisions are handled.
* 'preserveStart' keeps the left tick on collision and ensures that the first tick is always shown.
* 'preserveEnd' keeps the right tick on collision and ensures that the last tick is always shown.
* 'preserveStartEnd' keeps the left tick on collision and ensures that the first and last ticks are always shown.
* 'equidistantPreserveStart' selects a number N such that every nTh tick will be shown without collision.
*/
var adaptEventHandlers = function adaptEventHandlers(props, newHandler) {
	if (!props || typeof props === "function" || typeof props === "boolean") return null;
	var inputProps = props;
	if (/*#__PURE__*/ (0, import_react.isValidElement)(props)) inputProps = props.props;
	if (!(0, import_isObject.default)(inputProps)) return null;
	var out = {};
	Object.keys(inputProps).forEach(function(key) {
		if (EventKeys.includes(key)) out[key] = newHandler || function(e) {
			return inputProps[key](inputProps, e);
		};
	});
	return out;
};
var getEventHandlerOfChild = function getEventHandlerOfChild(originalHandler, data, index) {
	return function(e) {
		originalHandler(data, index, e);
		return null;
	};
};
var adaptEventsOfChild = function adaptEventsOfChild(props, data, index) {
	if (!(0, import_isObject.default)(props) || _typeof$36(props) !== "object") return null;
	var out = null;
	Object.keys(props).forEach(function(key) {
		var item = props[key];
		if (EventKeys.includes(key) && typeof item === "function") {
			if (!out) out = {};
			out[key] = getEventHandlerOfChild(item, data, index);
		}
	});
	return out;
};
//#endregion
//#region node_modules/recharts/es6/util/ReactUtils.js
var _excluded$16 = ["children"], _excluded2$6 = ["children"];
function _objectWithoutProperties$16(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$16(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$16(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _typeof$35(o) {
	"@babel/helpers - typeof";
	return _typeof$35 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$35(o);
}
var REACT_BROWSER_EVENT_MAP = {
	click: "onClick",
	mousedown: "onMouseDown",
	mouseup: "onMouseUp",
	mouseover: "onMouseOver",
	mousemove: "onMouseMove",
	mouseout: "onMouseOut",
	mouseenter: "onMouseEnter",
	mouseleave: "onMouseLeave",
	touchcancel: "onTouchCancel",
	touchend: "onTouchEnd",
	touchmove: "onTouchMove",
	touchstart: "onTouchStart",
	contextmenu: "onContextMenu",
	dblclick: "onDoubleClick"
};
/**
* Get the display name of a component
* @param  {Object} Comp Specified Component
* @return {String}      Display name of Component
*/
var getDisplayName = function getDisplayName(Comp) {
	if (typeof Comp === "string") return Comp;
	if (!Comp) return "";
	return Comp.displayName || Comp.name || "Component";
};
var lastChildren = null;
var lastResult = null;
var toArray = function toArray(children) {
	if (children === lastChildren && Array.isArray(lastResult)) return lastResult;
	var result = [];
	import_react.Children.forEach(children, function(child) {
		if ((0, import_isNil.default)(child)) return;
		if ((0, import_react_is.isFragment)(child)) result = result.concat(toArray(child.props.children));
		else result.push(child);
	});
	lastResult = result;
	lastChildren = children;
	return result;
};
function findAllByType(children, type) {
	var result = [];
	var types = [];
	if (Array.isArray(type)) types = type.map(function(t) {
		return getDisplayName(t);
	});
	else types = [getDisplayName(type)];
	toArray(children).forEach(function(child) {
		var childType = (0, import_get.default)(child, "type.displayName") || (0, import_get.default)(child, "type.name");
		if (types.indexOf(childType) !== -1) result.push(child);
	});
	return result;
}
function findChildByType(children, type) {
	var result = findAllByType(children, type);
	return result && result[0];
}
/**
* validate the width and height props of a chart element
* @param  {Object} el A chart element
* @return {Boolean}   true If the props width and height are number, and greater than 0
*/
var validateWidthHeight = function validateWidthHeight(el) {
	if (!el || !el.props) return false;
	var _el$props = el.props, width = _el$props.width, height = _el$props.height;
	if (!isNumber(width) || width <= 0 || !isNumber(height) || height <= 0) return false;
	return true;
};
var SVG_TAGS = [
	"a",
	"altGlyph",
	"altGlyphDef",
	"altGlyphItem",
	"animate",
	"animateColor",
	"animateMotion",
	"animateTransform",
	"circle",
	"clipPath",
	"color-profile",
	"cursor",
	"defs",
	"desc",
	"ellipse",
	"feBlend",
	"feColormatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"filter",
	"font",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-url",
	"foreignObject",
	"g",
	"glyph",
	"glyphRef",
	"hkern",
	"image",
	"line",
	"lineGradient",
	"marker",
	"mask",
	"metadata",
	"missing-glyph",
	"mpath",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"radialGradient",
	"rect",
	"script",
	"set",
	"stop",
	"style",
	"svg",
	"switch",
	"symbol",
	"text",
	"textPath",
	"title",
	"tref",
	"tspan",
	"use",
	"view",
	"vkern"
];
var isSvgElement = function isSvgElement(child) {
	return child && child.type && (0, import_isString.default)(child.type) && SVG_TAGS.indexOf(child.type) >= 0;
};
var hasClipDot = function hasClipDot(dot) {
	return dot && _typeof$35(dot) === "object" && "clipDot" in dot;
};
/**
* Checks if the property is valid to spread onto an SVG element or onto a specific component
* @param {unknown} property property value currently being compared
* @param {string} key property key currently being compared
* @param {boolean} includeEvents if events are included in spreadable props
* @param {boolean} svgElementType checks against map of SVG element types to attributes
* @returns {boolean} is prop valid
*/
var isValidSpreadableProp = function isValidSpreadableProp(property, key, includeEvents, svgElementType) {
	var _FilteredElementKeyMa;
	/**
	* If the svg element type is explicitly included, check against the filtered element key map
	* to determine if there are attributes that should only exist on that element type.
	* @todo Add an internal cjs version of https://github.com/wooorm/svg-element-attributes for full coverage.
	*/
	var matchingElementTypeKeys = (_FilteredElementKeyMa = FilteredElementKeyMap === null || FilteredElementKeyMap === void 0 ? void 0 : FilteredElementKeyMap[svgElementType]) !== null && _FilteredElementKeyMa !== void 0 ? _FilteredElementKeyMa : [];
	return key.startsWith("data-") || !(0, import_isFunction.default)(property) && (svgElementType && matchingElementTypeKeys.includes(key) || SVGElementPropKeys.includes(key)) || includeEvents && EventKeys.includes(key);
};
var filterProps = function filterProps(props, includeEvents, svgElementType) {
	if (!props || typeof props === "function" || typeof props === "boolean") return null;
	var inputProps = props;
	if (/*#__PURE__*/ (0, import_react.isValidElement)(props)) inputProps = props.props;
	if (!(0, import_isObject.default)(inputProps)) return null;
	var out = {};
	/**
	* Props are blindly spread onto SVG elements. This loop filters out properties that we don't want to spread.
	* Items filtered out are as follows:
	*   - functions in properties that are SVG attributes (functions are included when includeEvents is true)
	*   - props that are SVG attributes but don't matched the passed svgElementType
	*   - any prop that is not in SVGElementPropKeys (or in EventKeys if includeEvents is true)
	*/
	Object.keys(inputProps).forEach(function(key) {
		var _inputProps;
		if (isValidSpreadableProp((_inputProps = inputProps) === null || _inputProps === void 0 ? void 0 : _inputProps[key], key, includeEvents, svgElementType)) out[key] = inputProps[key];
	});
	return out;
};
/**
* Wether props of children changed
* @param  {Object} nextChildren The latest children
* @param  {Object} prevChildren The prev children
* @return {Boolean}             equal or not
*/
var isChildrenEqual = function isChildrenEqual(nextChildren, prevChildren) {
	if (nextChildren === prevChildren) return true;
	var count = import_react.Children.count(nextChildren);
	if (count !== import_react.Children.count(prevChildren)) return false;
	if (count === 0) return true;
	if (count === 1) return isSingleChildEqual(Array.isArray(nextChildren) ? nextChildren[0] : nextChildren, Array.isArray(prevChildren) ? prevChildren[0] : prevChildren);
	for (var i = 0; i < count; i++) {
		var nextChild = nextChildren[i];
		var prevChild = prevChildren[i];
		if (Array.isArray(nextChild) || Array.isArray(prevChild)) {
			if (!isChildrenEqual(nextChild, prevChild)) return false;
		} else if (!isSingleChildEqual(nextChild, prevChild)) return false;
	}
	return true;
};
var isSingleChildEqual = function isSingleChildEqual(nextChild, prevChild) {
	if ((0, import_isNil.default)(nextChild) && (0, import_isNil.default)(prevChild)) return true;
	if (!(0, import_isNil.default)(nextChild) && !(0, import_isNil.default)(prevChild)) {
		var _ref = nextChild.props || {}, nextChildren = _ref.children, nextProps = _objectWithoutProperties$16(_ref, _excluded$16);
		var _ref2 = prevChild.props || {}, prevChildren = _ref2.children, prevProps = _objectWithoutProperties$16(_ref2, _excluded2$6);
		if (nextChildren && prevChildren) return shallowEqual(nextProps, prevProps) && isChildrenEqual(nextChildren, prevChildren);
		if (!nextChildren && !prevChildren) return shallowEqual(nextProps, prevProps);
		return false;
	}
	return false;
};
var renderByOrder = function renderByOrder(children, renderMap) {
	var elements = [];
	var record = {};
	toArray(children).forEach(function(child, index) {
		if (isSvgElement(child)) elements.push(child);
		else if (child) {
			var displayName = getDisplayName(child.type);
			var _ref3 = renderMap[displayName] || {}, handler = _ref3.handler, once = _ref3.once;
			if (handler && (!once || !record[displayName])) {
				var results = handler(child, displayName, index);
				elements.push(results);
				record[displayName] = true;
			}
		}
	});
	return elements;
};
var getReactEventByType = function getReactEventByType(e) {
	var type = e && e.type;
	if (type && REACT_BROWSER_EVENT_MAP[type]) return REACT_BROWSER_EVENT_MAP[type];
	return null;
};
var parseChildIndex = function parseChildIndex(child, children) {
	return toArray(children).indexOf(child);
};
//#endregion
//#region node_modules/recharts/es6/component/ResponsiveContainer.js
/**
* @fileOverview Wrapper component to make charts adapt to the size of parent * DOM
*/
function _typeof$34(o) {
	"@babel/helpers - typeof";
	return _typeof$34 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$34(o);
}
function ownKeys$29(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$29(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$29(Object(t), !0).forEach(function(r) {
			_defineProperty$33(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$29(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$33(obj, key, value) {
	key = _toPropertyKey$34(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$34(t) {
	var i = _toPrimitive$34(t, "string");
	return "symbol" == _typeof$34(i) ? i : i + "";
}
function _toPrimitive$34(t, r) {
	if ("object" != _typeof$34(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$34(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _slicedToArray$8(arr, i) {
	return _arrayWithHoles$8(arr) || _iterableToArrayLimit$8(arr, i) || _unsupportedIterableToArray$13(arr, i) || _nonIterableRest$8();
}
function _nonIterableRest$8() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$13(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$13(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$13(o, minLen);
}
function _arrayLikeToArray$13(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _iterableToArrayLimit$8(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayWithHoles$8(arr) {
	if (Array.isArray(arr)) return arr;
}
var ResponsiveContainer = /*#__PURE__*/ (0, import_react.forwardRef)(function(_ref, ref) {
	var aspect = _ref.aspect, _ref$initialDimension = _ref.initialDimension, initialDimension = _ref$initialDimension === void 0 ? {
		width: -1,
		height: -1
	} : _ref$initialDimension, _ref$width = _ref.width, width = _ref$width === void 0 ? "100%" : _ref$width, _ref$height = _ref.height, height = _ref$height === void 0 ? "100%" : _ref$height, _ref$minWidth = _ref.minWidth, minWidth = _ref$minWidth === void 0 ? 0 : _ref$minWidth, minHeight = _ref.minHeight, maxHeight = _ref.maxHeight, children = _ref.children, _ref$debounce = _ref.debounce, debounce = _ref$debounce === void 0 ? 0 : _ref$debounce, id = _ref.id, className = _ref.className, onResize = _ref.onResize, _ref$style = _ref.style, style = _ref$style === void 0 ? {} : _ref$style;
	var containerRef = (0, import_react.useRef)(null);
	var onResizeRef = (0, import_react.useRef)();
	onResizeRef.current = onResize;
	(0, import_react.useImperativeHandle)(ref, function() {
		return Object.defineProperty(containerRef.current, "current", {
			get: function get() {
				console.warn("The usage of ref.current.current is deprecated and will no longer be supported.");
				return containerRef.current;
			},
			configurable: true
		});
	});
	var _useState2 = _slicedToArray$8((0, import_react.useState)({
		containerWidth: initialDimension.width,
		containerHeight: initialDimension.height
	}), 2), sizes = _useState2[0], setSizes = _useState2[1];
	var setContainerSize = (0, import_react.useCallback)(function(newWidth, newHeight) {
		setSizes(function(prevState) {
			var roundedWidth = Math.round(newWidth);
			var roundedHeight = Math.round(newHeight);
			if (prevState.containerWidth === roundedWidth && prevState.containerHeight === roundedHeight) return prevState;
			return {
				containerWidth: roundedWidth,
				containerHeight: roundedHeight
			};
		});
	}, []);
	(0, import_react.useEffect)(function() {
		var callback = function callback(entries) {
			var _onResizeRef$current;
			var _entries$0$contentRec = entries[0].contentRect, containerWidth = _entries$0$contentRec.width, containerHeight = _entries$0$contentRec.height;
			setContainerSize(containerWidth, containerHeight);
			(_onResizeRef$current = onResizeRef.current) === null || _onResizeRef$current === void 0 || _onResizeRef$current.call(onResizeRef, containerWidth, containerHeight);
		};
		if (debounce > 0) callback = (0, import_throttle.default)(callback, debounce, {
			trailing: true,
			leading: false
		});
		var observer = new ResizeObserver(callback);
		var _containerRef$current = containerRef.current.getBoundingClientRect(), containerWidth = _containerRef$current.width, containerHeight = _containerRef$current.height;
		setContainerSize(containerWidth, containerHeight);
		observer.observe(containerRef.current);
		return function() {
			observer.disconnect();
		};
	}, [setContainerSize, debounce]);
	var chartContent = (0, import_react.useMemo)(function() {
		var containerWidth = sizes.containerWidth, containerHeight = sizes.containerHeight;
		if (containerWidth < 0 || containerHeight < 0) return null;
		warn(isPercent(width) || isPercent(height), "The width(%s) and height(%s) are both fixed numbers,\n       maybe you don't need to use a ResponsiveContainer.", width, height);
		warn(!aspect || aspect > 0, "The aspect(%s) must be greater than zero.", aspect);
		var calculatedWidth = isPercent(width) ? containerWidth : width;
		var calculatedHeight = isPercent(height) ? containerHeight : height;
		if (aspect && aspect > 0) {
			if (calculatedWidth) calculatedHeight = calculatedWidth / aspect;
			else if (calculatedHeight) calculatedWidth = calculatedHeight * aspect;
			if (maxHeight && calculatedHeight > maxHeight) calculatedHeight = maxHeight;
		}
		warn(calculatedWidth > 0 || calculatedHeight > 0, "The width(%s) and height(%s) of chart should be greater than 0,\n       please check the style of container, or the props width(%s) and height(%s),\n       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the\n       height and width.", calculatedWidth, calculatedHeight, width, height, minWidth, minHeight, aspect);
		var isCharts = !Array.isArray(children) && getDisplayName(children.type).endsWith("Chart");
		return import_react.Children.map(children, function(child) {
			if (/*#__PURE__*/ import_react.isValidElement(child)) return /*#__PURE__*/ (0, import_react.cloneElement)(child, _objectSpread$29({
				width: calculatedWidth,
				height: calculatedHeight
			}, isCharts ? { style: _objectSpread$29({
				height: "100%",
				width: "100%",
				maxHeight: calculatedHeight,
				maxWidth: calculatedWidth
			}, child.props.style) } : {}));
			return child;
		});
	}, [
		aspect,
		children,
		height,
		maxHeight,
		minHeight,
		minWidth,
		sizes,
		width
	]);
	return /*#__PURE__*/ import_react.createElement("div", {
		id: id ? "".concat(id) : void 0,
		className: clsx("recharts-responsive-container", className),
		style: _objectSpread$29(_objectSpread$29({}, style), {}, {
			width,
			height,
			minWidth,
			minHeight,
			maxHeight
		}),
		ref: containerRef
	}, chartContent);
});
//#endregion
//#region node_modules/victory-vendor/es/d3-scale.js
var d3_scale_exports = /* @__PURE__ */ __exportAll({
	scaleBand: () => band,
	scaleDiverging: () => diverging,
	scaleDivergingLog: () => divergingLog,
	scaleDivergingPow: () => divergingPow,
	scaleDivergingSqrt: () => divergingSqrt,
	scaleDivergingSymlog: () => divergingSymlog,
	scaleIdentity: () => identity$1,
	scaleImplicit: () => implicit,
	scaleLinear: () => linear,
	scaleLog: () => log,
	scaleOrdinal: () => ordinal,
	scalePoint: () => point,
	scalePow: () => pow,
	scaleQuantile: () => quantile,
	scaleQuantize: () => quantize,
	scaleRadial: () => radial,
	scaleSequential: () => sequential,
	scaleSequentialLog: () => sequentialLog,
	scaleSequentialPow: () => sequentialPow,
	scaleSequentialQuantile: () => sequentialQuantile,
	scaleSequentialSqrt: () => sequentialSqrt,
	scaleSequentialSymlog: () => sequentialSymlog,
	scaleSqrt: () => sqrt,
	scaleSymlog: () => symlog,
	scaleThreshold: () => threshold,
	scaleTime: () => time,
	scaleUtc: () => utcTime,
	tickFormat: () => tickFormat
});
//#endregion
//#region node_modules/recharts-scale/es6/util/utils.js
var import_max = /* @__PURE__ */ __toESM(require_max());
var import_min = /* @__PURE__ */ __toESM(require_min());
var import_flatMap = /* @__PURE__ */ __toESM(require_flatMap());
var import_upperFirst = /* @__PURE__ */ __toESM(require_upperFirst());
var import_isEqual = /* @__PURE__ */ __toESM(require_isEqual());
function _toConsumableArray$6(arr) {
	return _arrayWithoutHoles$6(arr) || _iterableToArray$6(arr) || _unsupportedIterableToArray$12(arr) || _nonIterableSpread$6();
}
function _nonIterableSpread$6() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$12(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$12(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$12(o, minLen);
}
function _iterableToArray$6(iter) {
	if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function _arrayWithoutHoles$6(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray$12(arr);
}
function _arrayLikeToArray$12(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
var identity = function identity(i) {
	return i;
};
var PLACE_HOLDER = { "@@functional/placeholder": true };
var isPlaceHolder = function isPlaceHolder(val) {
	return val === PLACE_HOLDER;
};
var curry0 = function curry0(fn) {
	return function _curried() {
		if (arguments.length === 0 || arguments.length === 1 && isPlaceHolder(arguments.length <= 0 ? void 0 : arguments[0])) return _curried;
		return fn.apply(void 0, arguments);
	};
};
var curryN = function curryN(n, fn) {
	if (n === 1) return fn;
	return curry0(function() {
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		var argsLength = args.filter(function(arg) {
			return arg !== PLACE_HOLDER;
		}).length;
		if (argsLength >= n) return fn.apply(void 0, args);
		return curryN(n - argsLength, curry0(function() {
			for (var _len2 = arguments.length, restArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) restArgs[_key2] = arguments[_key2];
			var newArgs = args.map(function(arg) {
				return isPlaceHolder(arg) ? restArgs.shift() : arg;
			});
			return fn.apply(void 0, _toConsumableArray$6(newArgs).concat(restArgs));
		}));
	});
};
var curry = function curry(fn) {
	return curryN(fn.length, fn);
};
var range$2 = function range(begin, end) {
	var arr = [];
	for (var i = begin; i < end; ++i) arr[i - begin] = i;
	return arr;
};
var map = curry(function(fn, arr) {
	if (Array.isArray(arr)) return arr.map(fn);
	return Object.keys(arr).map(function(key) {
		return arr[key];
	}).map(fn);
});
var compose = function compose() {
	for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) args[_key3] = arguments[_key3];
	if (!args.length) return identity;
	var fns = args.reverse();
	var firstFn = fns[0];
	var tailsFn = fns.slice(1);
	return function() {
		return tailsFn.reduce(function(res, fn) {
			return fn(res);
		}, firstFn.apply(void 0, arguments));
	};
};
var reverse = function reverse(arr) {
	if (Array.isArray(arr)) return arr.reverse();
	return arr.split("").reverse.join("");
};
var memoize$1 = function memoize(fn) {
	var lastArgs = null;
	var lastResult = null;
	return function() {
		for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
		if (lastArgs && args.every(function(val, i) {
			return val === lastArgs[i];
		})) return lastResult;
		lastArgs = args;
		lastResult = fn.apply(void 0, args);
		return lastResult;
	};
};
//#endregion
//#region node_modules/recharts-scale/es6/util/arithmetic.js
/**
* @fileOverview 一些公用的运算方法
* @author xile611
* @date 2015-09-17
*/
/**
* 获取数值的位数
* 其中绝对值属于区间[0.1, 1)， 得到的值为0
* 绝对值属于区间[0.01, 0.1)，得到的位数为 -1
* 绝对值属于区间[0.001, 0.01)，得到的位数为 -2
*
* @param  {Number} value 数值
* @return {Integer} 位数
*/
function getDigitCount(value) {
	var result;
	if (value === 0) result = 1;
	else result = Math.floor(new decimal_default(value).abs().log(10).toNumber()) + 1;
	return result;
}
/**
* 按照固定的步长获取[start, end)这个区间的数据
* 并且需要处理js计算精度的问题
*
* @param  {Decimal} start 起点
* @param  {Decimal} end   终点，不包含该值
* @param  {Decimal} step  步长
* @return {Array}         若干数值
*/
function rangeStep(start, end, step) {
	var num = new decimal_default(start);
	var i = 0;
	var result = [];
	while (num.lt(end) && i < 1e5) {
		result.push(num.toNumber());
		num = num.add(step);
		i++;
	}
	return result;
}
var arithmetic_default = {
	rangeStep,
	getDigitCount,
	interpolateNumber: curry(function(a, b, t) {
		var newA = +a;
		return newA + t * (+b - newA);
	}),
	uninterpolateNumber: curry(function(a, b, x) {
		var diff = b - +a;
		diff = diff || Infinity;
		return (x - a) / diff;
	}),
	uninterpolateTruncation: curry(function(a, b, x) {
		var diff = b - +a;
		diff = diff || Infinity;
		return Math.max(0, Math.min(1, (x - a) / diff));
	})
};
//#endregion
//#region node_modules/recharts-scale/es6/getNiceTickValues.js
/**
* @fileOverview calculate tick values of scale
* @author xile611, arcthur
* @date 2015-09-17
*/
function _toConsumableArray$5(arr) {
	return _arrayWithoutHoles$5(arr) || _iterableToArray$5(arr) || _unsupportedIterableToArray$11(arr) || _nonIterableSpread$5();
}
function _nonIterableSpread$5() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray$5(iter) {
	if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function _arrayWithoutHoles$5(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray$11(arr);
}
function _slicedToArray$7(arr, i) {
	return _arrayWithHoles$7(arr) || _iterableToArrayLimit$7(arr, i) || _unsupportedIterableToArray$11(arr, i) || _nonIterableRest$7();
}
function _nonIterableRest$7() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$11(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$11(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$11(o, minLen);
}
function _arrayLikeToArray$11(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _iterableToArrayLimit$7(arr, i) {
	if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
	var _arr = [];
	var _n = true;
	var _d = false;
	var _e = void 0;
	try {
		for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
			_arr.push(_s.value);
			if (i && _arr.length === i) break;
		}
	} catch (err) {
		_d = true;
		_e = err;
	} finally {
		try {
			if (!_n && _i["return"] != null) _i["return"]();
		} finally {
			if (_d) throw _e;
		}
	}
	return _arr;
}
function _arrayWithHoles$7(arr) {
	if (Array.isArray(arr)) return arr;
}
/**
* Calculate a interval of a minimum value and a maximum value
*
* @param  {Number} min       The minimum value
* @param  {Number} max       The maximum value
* @return {Array} An interval
*/
function getValidInterval(_ref) {
	var _ref2 = _slicedToArray$7(_ref, 2), min = _ref2[0], max = _ref2[1];
	var validMin = min, validMax = max;
	if (min > max) {
		validMin = max;
		validMax = min;
	}
	return [validMin, validMax];
}
/**
* Calculate the step which is easy to understand between ticks, like 10, 20, 25
*
* @param  {Decimal} roughStep        The rough step calculated by deviding the
* difference by the tickCount
* @param  {Boolean} allowDecimals    Allow the ticks to be decimals or not
* @param  {Integer} correctionFactor A correction factor
* @return {Decimal} The step which is easy to understand between two ticks
*/
function getFormatStep(roughStep, allowDecimals, correctionFactor) {
	if (roughStep.lte(0)) return new decimal_default(0);
	var digitCount = arithmetic_default.getDigitCount(roughStep.toNumber());
	var digitCountValue = new decimal_default(10).pow(digitCount);
	var stepRatio = roughStep.div(digitCountValue);
	var stepRatioScale = digitCount !== 1 ? .05 : .1;
	var formatStep = new decimal_default(Math.ceil(stepRatio.div(stepRatioScale).toNumber())).add(correctionFactor).mul(stepRatioScale).mul(digitCountValue);
	return allowDecimals ? formatStep : new decimal_default(Math.ceil(formatStep));
}
/**
* calculate the ticks when the minimum value equals to the maximum value
*
* @param  {Number}  value         The minimum valuue which is also the maximum value
* @param  {Integer} tickCount     The count of ticks
* @param  {Boolean} allowDecimals Allow the ticks to be decimals or not
* @return {Array}                 ticks
*/
function getTickOfSingleValue(value, tickCount, allowDecimals) {
	var step = 1;
	var middle = new decimal_default(value);
	if (!middle.isint() && allowDecimals) {
		var absVal = Math.abs(value);
		if (absVal < 1) {
			step = new decimal_default(10).pow(arithmetic_default.getDigitCount(value) - 1);
			middle = new decimal_default(Math.floor(middle.div(step).toNumber())).mul(step);
		} else if (absVal > 1) middle = new decimal_default(Math.floor(value));
	} else if (value === 0) middle = new decimal_default(Math.floor((tickCount - 1) / 2));
	else if (!allowDecimals) middle = new decimal_default(Math.floor(value));
	var middleIndex = Math.floor((tickCount - 1) / 2);
	return compose(map(function(n) {
		return middle.add(new decimal_default(n - middleIndex).mul(step)).toNumber();
	}), range$2)(0, tickCount);
}
/**
* Calculate the step
*
* @param  {Number}  min              The minimum value of an interval
* @param  {Number}  max              The maximum value of an interval
* @param  {Integer} tickCount        The count of ticks
* @param  {Boolean} allowDecimals    Allow the ticks to be decimals or not
* @param  {Number}  correctionFactor A correction factor
* @return {Object}  The step, minimum value of ticks, maximum value of ticks
*/
function calculateStep(min, max, tickCount, allowDecimals) {
	var correctionFactor = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0;
	if (!Number.isFinite((max - min) / (tickCount - 1))) return {
		step: new decimal_default(0),
		tickMin: new decimal_default(0),
		tickMax: new decimal_default(0)
	};
	var step = getFormatStep(new decimal_default(max).sub(min).div(tickCount - 1), allowDecimals, correctionFactor);
	var middle;
	if (min <= 0 && max >= 0) middle = new decimal_default(0);
	else {
		middle = new decimal_default(min).add(max).div(2);
		middle = middle.sub(new decimal_default(middle).mod(step));
	}
	var belowCount = Math.ceil(middle.sub(min).div(step).toNumber());
	var upCount = Math.ceil(new decimal_default(max).sub(middle).div(step).toNumber());
	var scaleCount = belowCount + upCount + 1;
	if (scaleCount > tickCount) return calculateStep(min, max, tickCount, allowDecimals, correctionFactor + 1);
	if (scaleCount < tickCount) {
		upCount = max > 0 ? upCount + (tickCount - scaleCount) : upCount;
		belowCount = max > 0 ? belowCount : belowCount + (tickCount - scaleCount);
	}
	return {
		step,
		tickMin: middle.sub(new decimal_default(belowCount).mul(step)),
		tickMax: middle.add(new decimal_default(upCount).mul(step))
	};
}
/**
* Calculate the ticks of an interval, the count of ticks will be guraranteed
*
* @param  {Number}  min, max      min: The minimum value, max: The maximum value
* @param  {Integer} tickCount     The count of ticks
* @param  {Boolean} allowDecimals Allow the ticks to be decimals or not
* @return {Array}   ticks
*/
function getNiceTickValuesFn(_ref3) {
	var _ref4 = _slicedToArray$7(_ref3, 2), min = _ref4[0], max = _ref4[1];
	var tickCount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6;
	var allowDecimals = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
	var count = Math.max(tickCount, 2);
	var _getValidInterval2 = _slicedToArray$7(getValidInterval([min, max]), 2), cormin = _getValidInterval2[0], cormax = _getValidInterval2[1];
	if (cormin === -Infinity || cormax === Infinity) {
		var _values = cormax === Infinity ? [cormin].concat(_toConsumableArray$5(range$2(0, tickCount - 1).map(function() {
			return Infinity;
		}))) : [].concat(_toConsumableArray$5(range$2(0, tickCount - 1).map(function() {
			return -Infinity;
		})), [cormax]);
		return min > max ? reverse(_values) : _values;
	}
	if (cormin === cormax) return getTickOfSingleValue(cormin, tickCount, allowDecimals);
	var _calculateStep = calculateStep(cormin, cormax, count, allowDecimals), step = _calculateStep.step, tickMin = _calculateStep.tickMin, tickMax = _calculateStep.tickMax;
	var values = arithmetic_default.rangeStep(tickMin, tickMax.add(new decimal_default(.1).mul(step)), step);
	return min > max ? reverse(values) : values;
}
/**
* Calculate the ticks of an interval, the count of ticks won't be guraranteed,
* but the domain will be guaranteed
*
* @param  {Number}  min, max      min: The minimum value, max: The maximum value
* @param  {Integer} tickCount     The count of ticks
* @param  {Boolean} allowDecimals Allow the ticks to be decimals or not
* @return {Array}   ticks
*/
function getTickValuesFixedDomainFn(_ref7, tickCount) {
	var _ref8 = _slicedToArray$7(_ref7, 2), min = _ref8[0], max = _ref8[1];
	var allowDecimals = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
	var _getValidInterval6 = _slicedToArray$7(getValidInterval([min, max]), 2), cormin = _getValidInterval6[0], cormax = _getValidInterval6[1];
	if (cormin === -Infinity || cormax === Infinity) return [min, max];
	if (cormin === cormax) return [cormin];
	var count = Math.max(tickCount, 2);
	var step = getFormatStep(new decimal_default(cormax).sub(cormin).div(count - 1), allowDecimals, 0);
	var values = [].concat(_toConsumableArray$5(arithmetic_default.rangeStep(new decimal_default(cormin), new decimal_default(cormax).sub(new decimal_default(.99).mul(step)), step)), [cormax]);
	return min > max ? reverse(values) : values;
}
var getNiceTickValues = memoize$1(getNiceTickValuesFn);
var getTickValuesFixedDomain = memoize$1(getTickValuesFixedDomainFn);
//#endregion
//#region node_modules/tiny-invariant/dist/esm/tiny-invariant.js
var prefix = "Invariant failed";
function invariant(condition, message) {
	if (condition) return;
	throw new Error(prefix);
}
//#endregion
//#region node_modules/recharts/es6/container/Layer.js
var _excluded$15 = ["children", "className"];
function _extends$25() {
	_extends$25 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$25.apply(this, arguments);
}
function _objectWithoutProperties$15(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$15(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$15(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Layer = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var children = props.children, className = props.className, others = _objectWithoutProperties$15(props, _excluded$15);
	var layerClass = clsx("recharts-layer", className);
	return /*#__PURE__*/ import_react.createElement("g", _extends$25({ className: layerClass }, filterProps(others, true), { ref }), children);
});
//#endregion
//#region node_modules/recharts/es6/cartesian/ErrorBar.js
/**
* @fileOverview Render a group of error bar
*/
var _excluded$14 = [
	"offset",
	"layout",
	"width",
	"dataKey",
	"data",
	"dataPointFormatter",
	"xAxis",
	"yAxis"
];
function _typeof$33(o) {
	"@babel/helpers - typeof";
	return _typeof$33 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$33(o);
}
function _extends$24() {
	_extends$24 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$24.apply(this, arguments);
}
function _slicedToArray$6(arr, i) {
	return _arrayWithHoles$6(arr) || _iterableToArrayLimit$6(arr, i) || _unsupportedIterableToArray$10(arr, i) || _nonIterableRest$6();
}
function _nonIterableRest$6() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$10(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$10(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$10(o, minLen);
}
function _arrayLikeToArray$10(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _iterableToArrayLimit$6(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayWithHoles$6(arr) {
	if (Array.isArray(arr)) return arr;
}
function _objectWithoutProperties$14(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$14(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$14(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _classCallCheck$15(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$15(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$33(descriptor.key), descriptor);
	}
}
function _createClass$15(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$15(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$15(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$12(t, o, e) {
	return o = _getPrototypeOf$12(o), _possibleConstructorReturn$12(t, _isNativeReflectConstruct$12() ? Reflect.construct(o, e || [], _getPrototypeOf$12(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$12(self, call) {
	if (call && (_typeof$33(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$12(self);
}
function _assertThisInitialized$12(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$12() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$12 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$12(o) {
	_getPrototypeOf$12 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$12(o);
}
function _inherits$12(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$12(subClass, superClass);
}
function _setPrototypeOf$12(o, p) {
	_setPrototypeOf$12 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$12(o, p);
}
function _defineProperty$32(obj, key, value) {
	key = _toPropertyKey$33(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$33(t) {
	var i = _toPrimitive$33(t, "string");
	return "symbol" == _typeof$33(i) ? i : i + "";
}
function _toPrimitive$33(t, r) {
	if ("object" != _typeof$33(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$33(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var ErrorBar = /*#__PURE__*/ function(_React$Component) {
	function ErrorBar() {
		_classCallCheck$15(this, ErrorBar);
		return _callSuper$12(this, ErrorBar, arguments);
	}
	_inherits$12(ErrorBar, _React$Component);
	return _createClass$15(ErrorBar, [{
		key: "render",
		value: function render() {
			var _this$props = this.props, offset = _this$props.offset, layout = _this$props.layout, width = _this$props.width, dataKey = _this$props.dataKey, data = _this$props.data, dataPointFormatter = _this$props.dataPointFormatter, xAxis = _this$props.xAxis, yAxis = _this$props.yAxis;
			var svgProps = filterProps(_objectWithoutProperties$14(_this$props, _excluded$14), false);
			this.props.direction === "x" && xAxis.type !== "number" && invariant(false);
			var errorBars = data.map(function(entry) {
				var _dataPointFormatter = dataPointFormatter(entry, dataKey), x = _dataPointFormatter.x, y = _dataPointFormatter.y, value = _dataPointFormatter.value, errorVal = _dataPointFormatter.errorVal;
				if (!errorVal) return null;
				var lineCoordinates = [];
				var lowBound, highBound;
				if (Array.isArray(errorVal)) {
					var _errorVal = _slicedToArray$6(errorVal, 2);
					lowBound = _errorVal[0];
					highBound = _errorVal[1];
				} else lowBound = highBound = errorVal;
				if (layout === "vertical") {
					var scale = xAxis.scale;
					var yMid = y + offset;
					var yMin = yMid + width;
					var yMax = yMid - width;
					var xMin = scale(value - lowBound);
					var xMax = scale(value + highBound);
					lineCoordinates.push({
						x1: xMax,
						y1: yMin,
						x2: xMax,
						y2: yMax
					});
					lineCoordinates.push({
						x1: xMin,
						y1: yMid,
						x2: xMax,
						y2: yMid
					});
					lineCoordinates.push({
						x1: xMin,
						y1: yMin,
						x2: xMin,
						y2: yMax
					});
				} else if (layout === "horizontal") {
					var _scale = yAxis.scale;
					var xMid = x + offset;
					var _xMin = xMid - width;
					var _xMax = xMid + width;
					var _yMin = _scale(value - lowBound);
					var _yMax = _scale(value + highBound);
					lineCoordinates.push({
						x1: _xMin,
						y1: _yMax,
						x2: _xMax,
						y2: _yMax
					});
					lineCoordinates.push({
						x1: xMid,
						y1: _yMin,
						x2: xMid,
						y2: _yMax
					});
					lineCoordinates.push({
						x1: _xMin,
						y1: _yMin,
						x2: _xMax,
						y2: _yMin
					});
				}
				return /*#__PURE__*/ import_react.createElement(Layer, _extends$24({
					className: "recharts-errorBar",
					key: "bar-".concat(lineCoordinates.map(function(c) {
						return "".concat(c.x1, "-").concat(c.x2, "-").concat(c.y1, "-").concat(c.y2);
					}))
				}, svgProps), lineCoordinates.map(function(coordinates) {
					return /*#__PURE__*/ import_react.createElement("line", _extends$24({}, coordinates, { key: "line-".concat(coordinates.x1, "-").concat(coordinates.x2, "-").concat(coordinates.y1, "-").concat(coordinates.y2) }));
				}));
			});
			return /*#__PURE__*/ import_react.createElement(Layer, { className: "recharts-errorBars" }, errorBars);
		}
	}]);
}(import_react.Component);
_defineProperty$32(ErrorBar, "defaultProps", {
	stroke: "black",
	strokeWidth: 1.5,
	width: 5,
	offset: 0,
	layout: "horizontal"
});
_defineProperty$32(ErrorBar, "displayName", "ErrorBar");
//#endregion
//#region node_modules/recharts/es6/container/Surface.js
/**
* @fileOverview Surface
*/
var _excluded$13 = [
	"children",
	"width",
	"height",
	"viewBox",
	"className",
	"style",
	"title",
	"desc"
];
function _extends$23() {
	_extends$23 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$23.apply(this, arguments);
}
function _objectWithoutProperties$13(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$13(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$13(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function Surface(props) {
	var children = props.children, width = props.width, height = props.height, viewBox = props.viewBox, className = props.className, style = props.style, title = props.title, desc = props.desc, others = _objectWithoutProperties$13(props, _excluded$13);
	var svgView = viewBox || {
		width,
		height,
		x: 0,
		y: 0
	};
	var layerClass = clsx("recharts-surface", className);
	return /*#__PURE__*/ import_react.createElement("svg", _extends$23({}, filterProps(others, true, "svg"), {
		className: layerClass,
		width,
		height,
		style,
		viewBox: "".concat(svgView.x, " ").concat(svgView.y, " ").concat(svgView.width, " ").concat(svgView.height)
	}), /*#__PURE__*/ import_react.createElement("title", null, title), /*#__PURE__*/ import_react.createElement("desc", null, desc), children);
}
//#endregion
//#region node_modules/recharts/es6/shape/Symbols.js
/**
* @fileOverview Curve
*/
function _typeof$32(o) {
	"@babel/helpers - typeof";
	return _typeof$32 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$32(o);
}
var _excluded$12 = [
	"type",
	"size",
	"sizeType"
];
function _extends$22() {
	_extends$22 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$22.apply(this, arguments);
}
function ownKeys$28(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$28(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$28(Object(t), !0).forEach(function(r) {
			_defineProperty$31(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$28(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$31(obj, key, value) {
	key = _toPropertyKey$32(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$32(t) {
	var i = _toPrimitive$32(t, "string");
	return "symbol" == _typeof$32(i) ? i : i + "";
}
function _toPrimitive$32(t, r) {
	if ("object" != _typeof$32(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$32(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties$12(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$12(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$12(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var symbolFactories = {
	symbolCircle: circle_default,
	symbolCross: cross_default,
	symbolDiamond: diamond_default,
	symbolSquare: square_default,
	symbolStar: star_default,
	symbolTriangle: triangle_default,
	symbolWye: wye_default
};
var RADIAN$1 = Math.PI / 180;
var getSymbolFactory = function getSymbolFactory(type) {
	return symbolFactories["symbol".concat((0, import_upperFirst.default)(type))] || circle_default;
};
var calculateAreaSize = function calculateAreaSize(size, sizeType, type) {
	if (sizeType === "area") return size;
	switch (type) {
		case "cross": return 5 * size * size / 9;
		case "diamond": return .5 * size * size / Math.sqrt(3);
		case "square": return size * size;
		case "star":
			var angle = 18 * RADIAN$1;
			return 1.25 * size * size * (Math.tan(angle) - Math.tan(angle * 2) * Math.pow(Math.tan(angle), 2));
		case "triangle": return Math.sqrt(3) * size * size / 4;
		case "wye": return (21 - 10 * Math.sqrt(3)) * size * size / 8;
		default: return Math.PI * size * size / 4;
	}
};
var registerSymbol = function registerSymbol(key, factory) {
	symbolFactories["symbol".concat((0, import_upperFirst.default)(key))] = factory;
};
var Symbols = function Symbols(_ref) {
	var _ref$type = _ref.type, type = _ref$type === void 0 ? "circle" : _ref$type, _ref$size = _ref.size, size = _ref$size === void 0 ? 64 : _ref$size, _ref$sizeType = _ref.sizeType, sizeType = _ref$sizeType === void 0 ? "area" : _ref$sizeType;
	var props = _objectSpread$28(_objectSpread$28({}, _objectWithoutProperties$12(_ref, _excluded$12)), {}, {
		type,
		size,
		sizeType
	});
	/**
	* Calculate the path of curve
	* @return {String} path
	*/
	var getPath = function getPath() {
		var symbolFactory = getSymbolFactory(type);
		return Symbol$1().type(symbolFactory).size(calculateAreaSize(size, sizeType, type))();
	};
	var className = props.className, cx = props.cx, cy = props.cy;
	var filteredProps = filterProps(props, true);
	if (cx === +cx && cy === +cy && size === +size) return /*#__PURE__*/ import_react.createElement("path", _extends$22({}, filteredProps, {
		className: clsx("recharts-symbols", className),
		transform: "translate(".concat(cx, ", ").concat(cy, ")"),
		d: getPath()
	}));
	return null;
};
Symbols.registerSymbol = registerSymbol;
//#endregion
//#region node_modules/recharts/es6/component/DefaultLegendContent.js
/**
* @fileOverview Default Legend Content
*/
function _typeof$31(o) {
	"@babel/helpers - typeof";
	return _typeof$31 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$31(o);
}
function _extends$21() {
	_extends$21 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$21.apply(this, arguments);
}
function ownKeys$27(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$27(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$27(Object(t), !0).forEach(function(r) {
			_defineProperty$30(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$27(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _classCallCheck$14(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$14(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$31(descriptor.key), descriptor);
	}
}
function _createClass$14(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$14(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$14(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$11(t, o, e) {
	return o = _getPrototypeOf$11(o), _possibleConstructorReturn$11(t, _isNativeReflectConstruct$11() ? Reflect.construct(o, e || [], _getPrototypeOf$11(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$11(self, call) {
	if (call && (_typeof$31(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$11(self);
}
function _assertThisInitialized$11(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$11() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$11 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$11(o) {
	_getPrototypeOf$11 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$11(o);
}
function _inherits$11(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$11(subClass, superClass);
}
function _setPrototypeOf$11(o, p) {
	_setPrototypeOf$11 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$11(o, p);
}
function _defineProperty$30(obj, key, value) {
	key = _toPropertyKey$31(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$31(t) {
	var i = _toPrimitive$31(t, "string");
	return "symbol" == _typeof$31(i) ? i : i + "";
}
function _toPrimitive$31(t, r) {
	if ("object" != _typeof$31(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$31(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var SIZE = 32;
var DefaultLegendContent = /*#__PURE__*/ function(_PureComponent) {
	function DefaultLegendContent() {
		_classCallCheck$14(this, DefaultLegendContent);
		return _callSuper$11(this, DefaultLegendContent, arguments);
	}
	_inherits$11(DefaultLegendContent, _PureComponent);
	return _createClass$14(DefaultLegendContent, [
		{
			key: "renderIcon",
			value: function renderIcon(data) {
				var inactiveColor = this.props.inactiveColor;
				var halfSize = SIZE / 2;
				var sixthSize = SIZE / 6;
				var thirdSize = SIZE / 3;
				var color = data.inactive ? inactiveColor : data.color;
				if (data.type === "plainline") return /*#__PURE__*/ import_react.createElement("line", {
					strokeWidth: 4,
					fill: "none",
					stroke: color,
					strokeDasharray: data.payload.strokeDasharray,
					x1: 0,
					y1: halfSize,
					x2: SIZE,
					y2: halfSize,
					className: "recharts-legend-icon"
				});
				if (data.type === "line") return /*#__PURE__*/ import_react.createElement("path", {
					strokeWidth: 4,
					fill: "none",
					stroke: color,
					d: "M0,".concat(halfSize, "h").concat(thirdSize, "\n            A").concat(sixthSize, ",").concat(sixthSize, ",0,1,1,").concat(2 * thirdSize, ",").concat(halfSize, "\n            H").concat(SIZE, "M").concat(2 * thirdSize, ",").concat(halfSize, "\n            A").concat(sixthSize, ",").concat(sixthSize, ",0,1,1,").concat(thirdSize, ",").concat(halfSize),
					className: "recharts-legend-icon"
				});
				if (data.type === "rect") return /*#__PURE__*/ import_react.createElement("path", {
					stroke: "none",
					fill: color,
					d: "M0,".concat(SIZE / 8, "h").concat(SIZE, "v").concat(SIZE * 3 / 4, "h").concat(-SIZE, "z"),
					className: "recharts-legend-icon"
				});
				if (/*#__PURE__*/ import_react.isValidElement(data.legendIcon)) {
					var iconProps = _objectSpread$27({}, data);
					delete iconProps.legendIcon;
					return /*#__PURE__*/ import_react.cloneElement(data.legendIcon, iconProps);
				}
				return /*#__PURE__*/ import_react.createElement(Symbols, {
					fill: color,
					cx: halfSize,
					cy: halfSize,
					size: SIZE,
					sizeType: "diameter",
					type: data.type
				});
			}
		},
		{
			key: "renderItems",
			value: function renderItems() {
				var _this = this;
				var _this$props = this.props, payload = _this$props.payload, iconSize = _this$props.iconSize, layout = _this$props.layout, formatter = _this$props.formatter, inactiveColor = _this$props.inactiveColor;
				var viewBox = {
					x: 0,
					y: 0,
					width: SIZE,
					height: SIZE
				};
				var itemStyle = {
					display: layout === "horizontal" ? "inline-block" : "block",
					marginRight: 10
				};
				var svgStyle = {
					display: "inline-block",
					verticalAlign: "middle",
					marginRight: 4
				};
				return payload.map(function(entry, i) {
					var finalFormatter = entry.formatter || formatter;
					var className = clsx(_defineProperty$30(_defineProperty$30({ "recharts-legend-item": true }, "legend-item-".concat(i), true), "inactive", entry.inactive));
					if (entry.type === "none") return null;
					var entryValue = !(0, import_isFunction.default)(entry.value) ? entry.value : null;
					warn(!(0, import_isFunction.default)(entry.value), "The name property is also required when using a function for the dataKey of a chart's cartesian components. Ex: <Bar name=\"Name of my Data\"/>");
					var color = entry.inactive ? inactiveColor : entry.color;
					return /*#__PURE__*/ import_react.createElement("li", _extends$21({
						className,
						style: itemStyle,
						key: "legend-item-".concat(i)
					}, adaptEventsOfChild(_this.props, entry, i)), /*#__PURE__*/ import_react.createElement(Surface, {
						width: iconSize,
						height: iconSize,
						viewBox,
						style: svgStyle
					}, _this.renderIcon(entry)), /*#__PURE__*/ import_react.createElement("span", {
						className: "recharts-legend-item-text",
						style: { color }
					}, finalFormatter ? finalFormatter(entryValue, entry, i) : entryValue));
				});
			}
		},
		{
			key: "render",
			value: function render() {
				var _this$props2 = this.props, payload = _this$props2.payload, layout = _this$props2.layout, align = _this$props2.align;
				if (!payload || !payload.length) return null;
				var finalStyle = {
					padding: 0,
					margin: 0,
					textAlign: layout === "horizontal" ? align : "left"
				};
				return /*#__PURE__*/ import_react.createElement("ul", {
					className: "recharts-default-legend",
					style: finalStyle
				}, this.renderItems());
			}
		}
	]);
}(import_react.PureComponent);
_defineProperty$30(DefaultLegendContent, "displayName", "Legend");
_defineProperty$30(DefaultLegendContent, "defaultProps", {
	iconSize: 14,
	layout: "horizontal",
	align: "center",
	verticalAlign: "middle",
	inactiveColor: "#ccc"
});
//#endregion
//#region node_modules/recharts/es6/component/Legend.js
/**
* @fileOverview Legend
*/
function _typeof$30(o) {
	"@babel/helpers - typeof";
	return _typeof$30 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$30(o);
}
var _excluded$11 = ["ref"];
function ownKeys$26(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$26(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$26(Object(t), !0).forEach(function(r) {
			_defineProperty$29(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$26(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _classCallCheck$13(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$13(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$30(descriptor.key), descriptor);
	}
}
function _createClass$13(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$13(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$13(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$10(t, o, e) {
	return o = _getPrototypeOf$10(o), _possibleConstructorReturn$10(t, _isNativeReflectConstruct$10() ? Reflect.construct(o, e || [], _getPrototypeOf$10(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$10(self, call) {
	if (call && (_typeof$30(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$10(self);
}
function _assertThisInitialized$10(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$10() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$10 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$10(o) {
	_getPrototypeOf$10 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$10(o);
}
function _inherits$10(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$10(subClass, superClass);
}
function _setPrototypeOf$10(o, p) {
	_setPrototypeOf$10 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$10(o, p);
}
function _defineProperty$29(obj, key, value) {
	key = _toPropertyKey$30(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$30(t) {
	var i = _toPrimitive$30(t, "string");
	return "symbol" == _typeof$30(i) ? i : i + "";
}
function _toPrimitive$30(t, r) {
	if ("object" != _typeof$30(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$30(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties$11(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$11(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$11(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function defaultUniqBy(entry) {
	return entry.value;
}
function renderContent(content, props) {
	if (/*#__PURE__*/ import_react.isValidElement(content)) return /*#__PURE__*/ import_react.cloneElement(content, props);
	if (typeof content === "function") return /*#__PURE__*/ import_react.createElement(content, props);
	props.ref;
	var otherProps = _objectWithoutProperties$11(props, _excluded$11);
	return /*#__PURE__*/ import_react.createElement(DefaultLegendContent, otherProps);
}
var EPS$1 = 1;
var Legend = /*#__PURE__*/ function(_PureComponent) {
	function Legend() {
		var _this;
		_classCallCheck$13(this, Legend);
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		_this = _callSuper$10(this, Legend, [].concat(args));
		_defineProperty$29(_this, "lastBoundingBox", {
			width: -1,
			height: -1
		});
		return _this;
	}
	_inherits$10(Legend, _PureComponent);
	return _createClass$13(Legend, [
		{
			key: "componentDidMount",
			value: function componentDidMount() {
				this.updateBBox();
			}
		},
		{
			key: "componentDidUpdate",
			value: function componentDidUpdate() {
				this.updateBBox();
			}
		},
		{
			key: "getBBox",
			value: function getBBox() {
				if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
					var box = this.wrapperNode.getBoundingClientRect();
					box.height = this.wrapperNode.offsetHeight;
					box.width = this.wrapperNode.offsetWidth;
					return box;
				}
				return null;
			}
		},
		{
			key: "updateBBox",
			value: function updateBBox() {
				var onBBoxUpdate = this.props.onBBoxUpdate;
				var box = this.getBBox();
				if (box) {
					if (Math.abs(box.width - this.lastBoundingBox.width) > EPS$1 || Math.abs(box.height - this.lastBoundingBox.height) > EPS$1) {
						this.lastBoundingBox.width = box.width;
						this.lastBoundingBox.height = box.height;
						if (onBBoxUpdate) onBBoxUpdate(box);
					}
				} else if (this.lastBoundingBox.width !== -1 || this.lastBoundingBox.height !== -1) {
					this.lastBoundingBox.width = -1;
					this.lastBoundingBox.height = -1;
					if (onBBoxUpdate) onBBoxUpdate(null);
				}
			}
		},
		{
			key: "getBBoxSnapshot",
			value: function getBBoxSnapshot() {
				if (this.lastBoundingBox.width >= 0 && this.lastBoundingBox.height >= 0) return _objectSpread$26({}, this.lastBoundingBox);
				return {
					width: 0,
					height: 0
				};
			}
		},
		{
			key: "getDefaultPosition",
			value: function getDefaultPosition(style) {
				var _this$props = this.props, layout = _this$props.layout, align = _this$props.align, verticalAlign = _this$props.verticalAlign, margin = _this$props.margin, chartWidth = _this$props.chartWidth, chartHeight = _this$props.chartHeight;
				var hPos, vPos;
				if (!style || (style.left === void 0 || style.left === null) && (style.right === void 0 || style.right === null)) if (align === "center" && layout === "vertical") {
					var box = this.getBBoxSnapshot();
					hPos = { left: ((chartWidth || 0) - box.width) / 2 };
				} else hPos = align === "right" ? { right: margin && margin.right || 0 } : { left: margin && margin.left || 0 };
				if (!style || (style.top === void 0 || style.top === null) && (style.bottom === void 0 || style.bottom === null)) if (verticalAlign === "middle") {
					var _box = this.getBBoxSnapshot();
					vPos = { top: ((chartHeight || 0) - _box.height) / 2 };
				} else vPos = verticalAlign === "bottom" ? { bottom: margin && margin.bottom || 0 } : { top: margin && margin.top || 0 };
				return _objectSpread$26(_objectSpread$26({}, hPos), vPos);
			}
		},
		{
			key: "render",
			value: function render() {
				var _this2 = this;
				var _this$props2 = this.props, content = _this$props2.content, width = _this$props2.width, height = _this$props2.height, wrapperStyle = _this$props2.wrapperStyle, payloadUniqBy = _this$props2.payloadUniqBy, payload = _this$props2.payload;
				var outerStyle = _objectSpread$26(_objectSpread$26({
					position: "absolute",
					width: width || "auto",
					height: height || "auto"
				}, this.getDefaultPosition(wrapperStyle)), wrapperStyle);
				return /*#__PURE__*/ import_react.createElement("div", {
					className: "recharts-legend-wrapper",
					style: outerStyle,
					ref: function ref(node) {
						_this2.wrapperNode = node;
					}
				}, renderContent(content, _objectSpread$26(_objectSpread$26({}, this.props), {}, { payload: getUniqPayload(payload, payloadUniqBy, defaultUniqBy) })));
			}
		}
	], [{
		key: "getWithHeight",
		value: function getWithHeight(item, chartWidth) {
			var layout = _objectSpread$26(_objectSpread$26({}, this.defaultProps), item.props).layout;
			if (layout === "vertical" && isNumber(item.props.height)) return { height: item.props.height };
			if (layout === "horizontal") return { width: item.props.width || chartWidth };
			return null;
		}
	}]);
}(import_react.PureComponent);
_defineProperty$29(Legend, "displayName", "Legend");
_defineProperty$29(Legend, "defaultProps", {
	iconSize: 14,
	layout: "horizontal",
	align: "center",
	verticalAlign: "bottom"
});
//#endregion
//#region node_modules/recharts/es6/util/getLegendProps.js
function _typeof$29(o) {
	"@babel/helpers - typeof";
	return _typeof$29 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$29(o);
}
function ownKeys$25(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$25(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$25(Object(t), !0).forEach(function(r) {
			_defineProperty$28(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$25(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$28(obj, key, value) {
	key = _toPropertyKey$29(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$29(t) {
	var i = _toPrimitive$29(t, "string");
	return "symbol" == _typeof$29(i) ? i : i + "";
}
function _toPrimitive$29(t, r) {
	if ("object" != _typeof$29(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$29(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var getLegendProps = function getLegendProps(_ref) {
	var children = _ref.children, formattedGraphicalItems = _ref.formattedGraphicalItems, legendWidth = _ref.legendWidth, legendContent = _ref.legendContent;
	var legendItem = findChildByType(children, Legend);
	if (!legendItem) return null;
	var legendDefaultProps = Legend.defaultProps;
	var legendProps = legendDefaultProps !== void 0 ? _objectSpread$25(_objectSpread$25({}, legendDefaultProps), legendItem.props) : {};
	var legendData;
	if (legendItem.props && legendItem.props.payload) legendData = legendItem.props && legendItem.props.payload;
	else if (legendContent === "children") legendData = (formattedGraphicalItems || []).reduce(function(result, _ref2) {
		var item = _ref2.item, props = _ref2.props;
		var data = props.sectors || props.data || [];
		return result.concat(data.map(function(entry) {
			return {
				type: legendItem.props.iconType || item.props.legendType,
				value: entry.name,
				color: entry.fill,
				payload: entry
			};
		}));
	}, []);
	else legendData = (formattedGraphicalItems || []).map(function(_ref3) {
		var item = _ref3.item;
		var itemDefaultProps = item.type.defaultProps;
		var itemProps = itemDefaultProps !== void 0 ? _objectSpread$25(_objectSpread$25({}, itemDefaultProps), item.props) : {};
		var dataKey = itemProps.dataKey, name = itemProps.name, legendType = itemProps.legendType;
		return {
			inactive: itemProps.hide,
			dataKey,
			type: legendProps.iconType || legendType || "square",
			color: getMainColorOfGraphicItem(item),
			value: name || dataKey,
			payload: itemProps
		};
	});
	return _objectSpread$25(_objectSpread$25(_objectSpread$25({}, legendProps), Legend.getWithHeight(legendItem, legendWidth)), {}, {
		payload: legendData,
		item: legendItem
	});
};
//#endregion
//#region node_modules/recharts/es6/util/ChartUtils.js
function _typeof$28(o) {
	"@babel/helpers - typeof";
	return _typeof$28 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$28(o);
}
function _toConsumableArray$4(arr) {
	return _arrayWithoutHoles$4(arr) || _iterableToArray$4(arr) || _unsupportedIterableToArray$9(arr) || _nonIterableSpread$4();
}
function _nonIterableSpread$4() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$9(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$9(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$9(o, minLen);
}
function _iterableToArray$4(iter) {
	if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles$4(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray$9(arr);
}
function _arrayLikeToArray$9(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function ownKeys$24(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$24(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$24(Object(t), !0).forEach(function(r) {
			_defineProperty$27(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$24(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$27(obj, key, value) {
	key = _toPropertyKey$28(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$28(t) {
	var i = _toPrimitive$28(t, "string");
	return "symbol" == _typeof$28(i) ? i : i + "";
}
function _toPrimitive$28(t, r) {
	if ("object" != _typeof$28(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$28(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function getValueByDataKey(obj, dataKey, defaultValue) {
	if ((0, import_isNil.default)(obj) || (0, import_isNil.default)(dataKey)) return defaultValue;
	if (isNumOrStr(dataKey)) return (0, import_get.default)(obj, dataKey, defaultValue);
	if ((0, import_isFunction.default)(dataKey)) return dataKey(obj);
	return defaultValue;
}
/**
* Get domain of data by key.
* @param  {Array}   data      The data displayed in the chart
* @param  {String}  key       The unique key of a group of data
* @param  {String}  type      The type of axis
* @param  {Boolean} filterNil Whether or not filter nil values
* @return {Array} Domain of data
*/
function getDomainOfDataByKey(data, key, type, filterNil) {
	var flattenData = (0, import_flatMap.default)(data, function(entry) {
		return getValueByDataKey(entry, key);
	});
	if (type === "number") {
		var domain = flattenData.filter(function(entry) {
			return isNumber(entry) || parseFloat(entry);
		});
		return domain.length ? [(0, import_min.default)(domain), (0, import_max.default)(domain)] : [Infinity, -Infinity];
	}
	return (filterNil ? flattenData.filter(function(entry) {
		return !(0, import_isNil.default)(entry);
	}) : flattenData).map(function(entry) {
		return isNumOrStr(entry) || entry instanceof Date ? entry : "";
	});
}
var calculateActiveTickIndex = function calculateActiveTickIndex(coordinate) {
	var _ticks$length;
	var ticks = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
	var unsortedTicks = arguments.length > 2 ? arguments[2] : void 0;
	var axis = arguments.length > 3 ? arguments[3] : void 0;
	var index = -1;
	var len = (_ticks$length = ticks === null || ticks === void 0 ? void 0 : ticks.length) !== null && _ticks$length !== void 0 ? _ticks$length : 0;
	if (len <= 1) return 0;
	if (axis && axis.axisType === "angleAxis" && Math.abs(Math.abs(axis.range[1] - axis.range[0]) - 360) <= 1e-6) {
		var range = axis.range;
		for (var i = 0; i < len; i++) {
			var before = i > 0 ? unsortedTicks[i - 1].coordinate : unsortedTicks[len - 1].coordinate;
			var cur = unsortedTicks[i].coordinate;
			var after = i >= len - 1 ? unsortedTicks[0].coordinate : unsortedTicks[i + 1].coordinate;
			var sameDirectionCoord = void 0;
			if (mathSign(cur - before) !== mathSign(after - cur)) {
				var diffInterval = [];
				if (mathSign(after - cur) === mathSign(range[1] - range[0])) {
					sameDirectionCoord = after;
					var curInRange = cur + range[1] - range[0];
					diffInterval[0] = Math.min(curInRange, (curInRange + before) / 2);
					diffInterval[1] = Math.max(curInRange, (curInRange + before) / 2);
				} else {
					sameDirectionCoord = before;
					var afterInRange = after + range[1] - range[0];
					diffInterval[0] = Math.min(cur, (afterInRange + cur) / 2);
					diffInterval[1] = Math.max(cur, (afterInRange + cur) / 2);
				}
				var sameInterval = [Math.min(cur, (sameDirectionCoord + cur) / 2), Math.max(cur, (sameDirectionCoord + cur) / 2)];
				if (coordinate > sameInterval[0] && coordinate <= sameInterval[1] || coordinate >= diffInterval[0] && coordinate <= diffInterval[1]) {
					index = unsortedTicks[i].index;
					break;
				}
			} else {
				var minValue = Math.min(before, after);
				var maxValue = Math.max(before, after);
				if (coordinate > (minValue + cur) / 2 && coordinate <= (maxValue + cur) / 2) {
					index = unsortedTicks[i].index;
					break;
				}
			}
		}
	} else for (var _i = 0; _i < len; _i++) if (_i === 0 && coordinate <= (ticks[_i].coordinate + ticks[_i + 1].coordinate) / 2 || _i > 0 && _i < len - 1 && coordinate > (ticks[_i].coordinate + ticks[_i - 1].coordinate) / 2 && coordinate <= (ticks[_i].coordinate + ticks[_i + 1].coordinate) / 2 || _i === len - 1 && coordinate > (ticks[_i].coordinate + ticks[_i - 1].coordinate) / 2) {
		index = ticks[_i].index;
		break;
	}
	return index;
};
/**
* Get the main color of each graphic item
* @param  {ReactElement} item A graphic item
* @return {String}            Color
*/
var getMainColorOfGraphicItem = function getMainColorOfGraphicItem(item) {
	var _item$type;
	var displayName = item.type.displayName;
	var defaultedProps = (_item$type = item.type) !== null && _item$type !== void 0 && _item$type.defaultProps ? _objectSpread$24(_objectSpread$24({}, item.type.defaultProps), item.props) : item.props;
	var stroke = defaultedProps.stroke, fill = defaultedProps.fill;
	var result;
	switch (displayName) {
		case "Line":
			result = stroke;
			break;
		case "Area":
		case "Radar":
			result = stroke && stroke !== "none" ? stroke : fill;
			break;
		default:
			result = fill;
			break;
	}
	return result;
};
/**
* Calculate the size of all groups for stacked bar graph
* @param  {Object} stackGroups The items grouped by axisId and stackId
* @return {Object} The size of all groups
*/
var getBarSizeList = function getBarSizeList(_ref2) {
	var globalSize = _ref2.barSize, totalSize = _ref2.totalSize, _ref2$stackGroups = _ref2.stackGroups, stackGroups = _ref2$stackGroups === void 0 ? {} : _ref2$stackGroups;
	if (!stackGroups) return {};
	var result = {};
	var numericAxisIds = Object.keys(stackGroups);
	for (var i = 0, len = numericAxisIds.length; i < len; i++) {
		var sgs = stackGroups[numericAxisIds[i]].stackGroups;
		var stackIds = Object.keys(sgs);
		for (var j = 0, sLen = stackIds.length; j < sLen; j++) {
			var _sgs$stackIds$j = sgs[stackIds[j]], items = _sgs$stackIds$j.items, cateAxisId = _sgs$stackIds$j.cateAxisId;
			var barItems = items.filter(function(item) {
				return getDisplayName(item.type).indexOf("Bar") >= 0;
			});
			if (barItems && barItems.length) {
				var barItemDefaultProps = barItems[0].type.defaultProps;
				var barItemProps = barItemDefaultProps !== void 0 ? _objectSpread$24(_objectSpread$24({}, barItemDefaultProps), barItems[0].props) : barItems[0].props;
				var selfSize = barItemProps.barSize;
				var cateId = barItemProps[cateAxisId];
				if (!result[cateId]) result[cateId] = [];
				var barSize = (0, import_isNil.default)(selfSize) ? globalSize : selfSize;
				result[cateId].push({
					item: barItems[0],
					stackList: barItems.slice(1),
					barSize: (0, import_isNil.default)(barSize) ? void 0 : getPercentValue(barSize, totalSize, 0)
				});
			}
		}
	}
	return result;
};
/**
* Calculate the size of each bar and offset between start of band and the bar
*
* @param  {number} bandSize is the size of area where bars can render
* @param  {number | string} barGap is the gap size, as a percentage of `bandSize`.
*                                  Can be defined as number or percent string
* @param  {number | string} barCategoryGap is the gap size, as a percentage of `bandSize`.
*                                  Can be defined as number or percent string
* @param  {Array<object>} sizeList Sizes of all groups
* @param  {number} maxBarSize The maximum size of each bar
* @return {Array<object>} The size and offset of each bar
*/
var getBarPosition = function getBarPosition(_ref3) {
	var barGap = _ref3.barGap, barCategoryGap = _ref3.barCategoryGap, bandSize = _ref3.bandSize, _ref3$sizeList = _ref3.sizeList, sizeList = _ref3$sizeList === void 0 ? [] : _ref3$sizeList, maxBarSize = _ref3.maxBarSize;
	var len = sizeList.length;
	if (len < 1) return null;
	var realBarGap = getPercentValue(barGap, bandSize, 0, true);
	var result;
	var initialValue = [];
	if (sizeList[0].barSize === +sizeList[0].barSize) {
		var useFull = false;
		var fullBarSize = bandSize / len;
		var sum = sizeList.reduce(function(res, entry) {
			return res + entry.barSize || 0;
		}, 0);
		sum += (len - 1) * realBarGap;
		if (sum >= bandSize) {
			sum -= (len - 1) * realBarGap;
			realBarGap = 0;
		}
		if (sum >= bandSize && fullBarSize > 0) {
			useFull = true;
			fullBarSize *= .9;
			sum = len * fullBarSize;
		}
		var prev = {
			offset: ((bandSize - sum) / 2 >> 0) - realBarGap,
			size: 0
		};
		result = sizeList.reduce(function(res, entry) {
			var newPosition = {
				item: entry.item,
				position: {
					offset: prev.offset + prev.size + realBarGap,
					size: useFull ? fullBarSize : entry.barSize
				}
			};
			var newRes = [].concat(_toConsumableArray$4(res), [newPosition]);
			prev = newRes[newRes.length - 1].position;
			if (entry.stackList && entry.stackList.length) entry.stackList.forEach(function(item) {
				newRes.push({
					item,
					position: prev
				});
			});
			return newRes;
		}, initialValue);
	} else {
		var _offset = getPercentValue(barCategoryGap, bandSize, 0, true);
		if (bandSize - 2 * _offset - (len - 1) * realBarGap <= 0) realBarGap = 0;
		var originalSize = (bandSize - 2 * _offset - (len - 1) * realBarGap) / len;
		if (originalSize > 1) originalSize >>= 0;
		var size = maxBarSize === +maxBarSize ? Math.min(originalSize, maxBarSize) : originalSize;
		result = sizeList.reduce(function(res, entry, i) {
			var newRes = [].concat(_toConsumableArray$4(res), [{
				item: entry.item,
				position: {
					offset: _offset + (originalSize + realBarGap) * i + (originalSize - size) / 2,
					size
				}
			}]);
			if (entry.stackList && entry.stackList.length) entry.stackList.forEach(function(item) {
				newRes.push({
					item,
					position: newRes[newRes.length - 1].position
				});
			});
			return newRes;
		}, initialValue);
	}
	return result;
};
var appendOffsetOfLegend = function appendOffsetOfLegend(offset, _unused, props, legendBox) {
	var children = props.children, width = props.width, margin = props.margin;
	var legendProps = getLegendProps({
		children,
		legendWidth: width - (margin.left || 0) - (margin.right || 0)
	});
	if (legendProps) {
		var _ref4 = legendBox || {}, boxWidth = _ref4.width, boxHeight = _ref4.height;
		var align = legendProps.align, verticalAlign = legendProps.verticalAlign, layout = legendProps.layout;
		if ((layout === "vertical" || layout === "horizontal" && verticalAlign === "middle") && align !== "center" && isNumber(offset[align])) return _objectSpread$24(_objectSpread$24({}, offset), {}, _defineProperty$27({}, align, offset[align] + (boxWidth || 0)));
		if ((layout === "horizontal" || layout === "vertical" && align === "center") && verticalAlign !== "middle" && isNumber(offset[verticalAlign])) return _objectSpread$24(_objectSpread$24({}, offset), {}, _defineProperty$27({}, verticalAlign, offset[verticalAlign] + (boxHeight || 0)));
	}
	return offset;
};
var isErrorBarRelevantForAxis = function isErrorBarRelevantForAxis(layout, axisType, direction) {
	if ((0, import_isNil.default)(axisType)) return true;
	if (layout === "horizontal") return axisType === "yAxis";
	if (layout === "vertical") return axisType === "xAxis";
	if (direction === "x") return axisType === "xAxis";
	if (direction === "y") return axisType === "yAxis";
	return true;
};
var getDomainOfErrorBars = function getDomainOfErrorBars(data, item, dataKey, layout, axisType) {
	var children = item.props.children;
	var errorBars = findAllByType(children, ErrorBar).filter(function(errorBarChild) {
		return isErrorBarRelevantForAxis(layout, axisType, errorBarChild.props.direction);
	});
	if (errorBars && errorBars.length) {
		var keys = errorBars.map(function(errorBarChild) {
			return errorBarChild.props.dataKey;
		});
		return data.reduce(function(result, entry) {
			var entryValue = getValueByDataKey(entry, dataKey);
			if ((0, import_isNil.default)(entryValue)) return result;
			var mainValue = Array.isArray(entryValue) ? [(0, import_min.default)(entryValue), (0, import_max.default)(entryValue)] : [entryValue, entryValue];
			var errorDomain = keys.reduce(function(prevErrorArr, k) {
				var errorValue = getValueByDataKey(entry, k, 0);
				var lowerValue = mainValue[0] - Math.abs(Array.isArray(errorValue) ? errorValue[0] : errorValue);
				var upperValue = mainValue[1] + Math.abs(Array.isArray(errorValue) ? errorValue[1] : errorValue);
				return [Math.min(lowerValue, prevErrorArr[0]), Math.max(upperValue, prevErrorArr[1])];
			}, [Infinity, -Infinity]);
			return [Math.min(errorDomain[0], result[0]), Math.max(errorDomain[1], result[1])];
		}, [Infinity, -Infinity]);
	}
	return null;
};
var parseErrorBarsOfAxis = function parseErrorBarsOfAxis(data, items, dataKey, axisType, layout) {
	var domains = items.map(function(item) {
		return getDomainOfErrorBars(data, item, dataKey, layout, axisType);
	}).filter(function(entry) {
		return !(0, import_isNil.default)(entry);
	});
	if (domains && domains.length) return domains.reduce(function(result, entry) {
		return [Math.min(result[0], entry[0]), Math.max(result[1], entry[1])];
	}, [Infinity, -Infinity]);
	return null;
};
/**
* Get domain of data by the configuration of item element
* @param  {Array}   data      The data displayed in the chart
* @param  {Array}   items     The instances of item
* @param  {String}  type      The type of axis, number - Number Axis, category - Category Axis
* @param  {LayoutType} layout The type of layout
* @param  {Boolean} filterNil Whether or not filter nil values
* @return {Array}        Domain
*/
var getDomainOfItemsWithSameAxis = function getDomainOfItemsWithSameAxis(data, items, type, layout, filterNil) {
	var domains = items.map(function(item) {
		var dataKey = item.props.dataKey;
		if (type === "number" && dataKey) return getDomainOfErrorBars(data, item, dataKey, layout) || getDomainOfDataByKey(data, dataKey, type, filterNil);
		return getDomainOfDataByKey(data, dataKey, type, filterNil);
	});
	if (type === "number") return domains.reduce(function(result, entry) {
		return [Math.min(result[0], entry[0]), Math.max(result[1], entry[1])];
	}, [Infinity, -Infinity]);
	var tag = {};
	return domains.reduce(function(result, entry) {
		for (var i = 0, len = entry.length; i < len; i++) if (!tag[entry[i]]) {
			tag[entry[i]] = true;
			result.push(entry[i]);
		}
		return result;
	}, []);
};
var isCategoricalAxis = function isCategoricalAxis(layout, axisType) {
	return layout === "horizontal" && axisType === "xAxis" || layout === "vertical" && axisType === "yAxis" || layout === "centric" && axisType === "angleAxis" || layout === "radial" && axisType === "radiusAxis";
};
/**
* Calculate the Coordinates of grid
* @param  {Array} ticks           The ticks in axis
* @param {Number} minValue        The minimun value of axis
* @param {Number} maxValue        The maximun value of axis
* @param {boolean} syncWithTicks  Synchronize grid lines with ticks or not
* @return {Array}                 Coordinates
*/
var getCoordinatesOfGrid = function getCoordinatesOfGrid(ticks, minValue, maxValue, syncWithTicks) {
	if (syncWithTicks) return ticks.map(function(entry) {
		return entry.coordinate;
	});
	var hasMin, hasMax;
	var values = ticks.map(function(entry) {
		if (entry.coordinate === minValue) hasMin = true;
		if (entry.coordinate === maxValue) hasMax = true;
		return entry.coordinate;
	});
	if (!hasMin) values.push(minValue);
	if (!hasMax) values.push(maxValue);
	return values;
};
/**
* Get the ticks of an axis
* @param  {Object}  axis The configuration of an axis
* @param {Boolean} isGrid Whether or not are the ticks in grid
* @param {Boolean} isAll Return the ticks of all the points or not
* @return {Array}  Ticks
*/
var getTicksOfAxis = function getTicksOfAxis(axis, isGrid, isAll) {
	if (!axis) return null;
	var scale = axis.scale;
	var duplicateDomain = axis.duplicateDomain, type = axis.type, range = axis.range;
	var offsetForBand = axis.realScaleType === "scaleBand" ? scale.bandwidth() / 2 : 2;
	var offset = (isGrid || isAll) && type === "category" && scale.bandwidth ? scale.bandwidth() / offsetForBand : 0;
	offset = axis.axisType === "angleAxis" && (range === null || range === void 0 ? void 0 : range.length) >= 2 ? mathSign(range[0] - range[1]) * 2 * offset : offset;
	if (isGrid && (axis.ticks || axis.niceTicks)) return (axis.ticks || axis.niceTicks).map(function(entry) {
		return {
			coordinate: scale(duplicateDomain ? duplicateDomain.indexOf(entry) : entry) + offset,
			value: entry,
			offset
		};
	}).filter(function(row) {
		return !(0, import_isNaN.default)(row.coordinate);
	});
	if (axis.isCategorical && axis.categoricalDomain) return axis.categoricalDomain.map(function(entry, index) {
		return {
			coordinate: scale(entry) + offset,
			value: entry,
			index,
			offset
		};
	});
	if (scale.ticks && !isAll) return scale.ticks(axis.tickCount).map(function(entry) {
		return {
			coordinate: scale(entry) + offset,
			value: entry,
			offset
		};
	});
	return scale.domain().map(function(entry, index) {
		return {
			coordinate: scale(entry) + offset,
			value: duplicateDomain ? duplicateDomain[entry] : entry,
			index,
			offset
		};
	});
};
/**
* combine the handlers
* @param  {Function} defaultHandler Internal private handler
* @param  {Function} childHandler Handler function specified in child component
* @return {Function}                The combined handler
*/
var handlerWeakMap = /* @__PURE__ */ new WeakMap();
var combineEventHandlers = function combineEventHandlers(defaultHandler, childHandler) {
	if (typeof childHandler !== "function") return defaultHandler;
	if (!handlerWeakMap.has(defaultHandler)) handlerWeakMap.set(defaultHandler, /* @__PURE__ */ new WeakMap());
	var childWeakMap = handlerWeakMap.get(defaultHandler);
	if (childWeakMap.has(childHandler)) return childWeakMap.get(childHandler);
	var combineHandler = function combineHandler() {
		defaultHandler.apply(void 0, arguments);
		childHandler.apply(void 0, arguments);
	};
	childWeakMap.set(childHandler, combineHandler);
	return combineHandler;
};
/**
* Parse the scale function of axis
* @param  {Object}   axis          The option of axis
* @param  {String}   chartType     The displayName of chart
* @param  {Boolean}  hasBar        if it has a bar
* @return {object}               The scale function and resolved name
*/
var parseScale = function parseScale(axis, chartType, hasBar) {
	var scale = axis.scale, type = axis.type, layout = axis.layout, axisType = axis.axisType;
	if (scale === "auto") {
		if (layout === "radial" && axisType === "radiusAxis") return {
			scale: band(),
			realScaleType: "band"
		};
		if (layout === "radial" && axisType === "angleAxis") return {
			scale: linear(),
			realScaleType: "linear"
		};
		if (type === "category" && chartType && (chartType.indexOf("LineChart") >= 0 || chartType.indexOf("AreaChart") >= 0 || chartType.indexOf("ComposedChart") >= 0 && !hasBar)) return {
			scale: point(),
			realScaleType: "point"
		};
		if (type === "category") return {
			scale: band(),
			realScaleType: "band"
		};
		return {
			scale: linear(),
			realScaleType: "linear"
		};
	}
	if ((0, import_isString.default)(scale)) {
		var name = "scale".concat((0, import_upperFirst.default)(scale));
		return {
			scale: (d3_scale_exports[name] || point)(),
			realScaleType: d3_scale_exports[name] ? name : "point"
		};
	}
	return (0, import_isFunction.default)(scale) ? { scale } : {
		scale: point(),
		realScaleType: "point"
	};
};
var EPS = 1e-4;
var checkDomainOfScale = function checkDomainOfScale(scale) {
	var domain = scale.domain();
	if (!domain || domain.length <= 2) return;
	var len = domain.length;
	var range = scale.range();
	var minValue = Math.min(range[0], range[1]) - EPS;
	var maxValue = Math.max(range[0], range[1]) + EPS;
	var first = scale(domain[0]);
	var last = scale(domain[len - 1]);
	if (first < minValue || first > maxValue || last < minValue || last > maxValue) scale.domain([domain[0], domain[len - 1]]);
};
var findPositionOfBar = function findPositionOfBar(barPosition, child) {
	if (!barPosition) return null;
	for (var i = 0, len = barPosition.length; i < len; i++) if (barPosition[i].item === child) return barPosition[i].position;
	return null;
};
/**
* Both value and domain are tuples of two numbers
* - but the type stays as array of numbers until we have better support in rest of the app
* @param {Array} value input that will be truncated
* @param {Array} domain boundaries
* @returns {Array} tuple of two numbers
*/
var truncateByDomain = function truncateByDomain(value, domain) {
	if (!domain || domain.length !== 2 || !isNumber(domain[0]) || !isNumber(domain[1])) return value;
	var minValue = Math.min(domain[0], domain[1]);
	var maxValue = Math.max(domain[0], domain[1]);
	var result = [value[0], value[1]];
	if (!isNumber(value[0]) || value[0] < minValue) result[0] = minValue;
	if (!isNumber(value[1]) || value[1] > maxValue) result[1] = maxValue;
	if (result[0] > maxValue) result[0] = maxValue;
	if (result[1] < minValue) result[1] = minValue;
	return result;
};
/**
* Function type to compute offset for stacked data.
*
* d3-shape has something fishy going on with its types.
* In @definitelytyped/d3-shape, this function (the offset accessor) is typed as Series<> => void.
* However! When I actually open the storybook I can see that the offset accessor actually receives Array<Series<>>.
* The same I can see in the source code itself:
* https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/66042
* That one unfortunately has no types but we can tell it passes three-dimensional array.
*
* Which leads me to believe that definitelytyped is wrong on this one.
* There's open discussion on this topic without much attention:
* https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/66042
*/
var STACK_OFFSET_MAP = {
	sign: function offsetSign(series) {
		var n = series.length;
		if (n <= 0) return;
		for (var j = 0, m = series[0].length; j < m; ++j) {
			var positive = 0;
			var negative = 0;
			for (var i = 0; i < n; ++i) {
				var value = (0, import_isNaN.default)(series[i][j][1]) ? series[i][j][0] : series[i][j][1];
				if (value >= 0) {
					series[i][j][0] = positive;
					series[i][j][1] = positive + value;
					positive = series[i][j][1];
				} else {
					series[i][j][0] = negative;
					series[i][j][1] = negative + value;
					negative = series[i][j][1];
				}
			}
		}
	},
	expand: expand_default,
	none: none_default,
	silhouette: silhouette_default,
	wiggle: wiggle_default,
	positive: function offsetPositive(series) {
		var n = series.length;
		if (n <= 0) return;
		for (var j = 0, m = series[0].length; j < m; ++j) {
			var positive = 0;
			for (var i = 0; i < n; ++i) {
				var value = (0, import_isNaN.default)(series[i][j][1]) ? series[i][j][0] : series[i][j][1];
				if (value >= 0) {
					series[i][j][0] = positive;
					series[i][j][1] = positive + value;
					positive = series[i][j][1];
				} else {
					series[i][j][0] = 0;
					series[i][j][1] = 0;
				}
			}
		}
	}
};
var getStackedData = function getStackedData(data, stackItems, offsetType) {
	var dataKeys = stackItems.map(function(item) {
		return item.props.dataKey;
	});
	var offsetAccessor = STACK_OFFSET_MAP[offsetType];
	return stack_default().keys(dataKeys).value(function(d, key) {
		return +getValueByDataKey(d, key, 0);
	}).order(none_default$1).offset(offsetAccessor)(data);
};
var getStackGroupsByAxisId = function getStackGroupsByAxisId(data, _items, numericAxisId, cateAxisId, offsetType, reverseStackOrder) {
	if (!data) return null;
	var stackGroups = (reverseStackOrder ? _items.reverse() : _items).reduce(function(result, item) {
		var _item$type2;
		var defaultedProps = (_item$type2 = item.type) !== null && _item$type2 !== void 0 && _item$type2.defaultProps ? _objectSpread$24(_objectSpread$24({}, item.type.defaultProps), item.props) : item.props;
		var stackId = defaultedProps.stackId;
		if (defaultedProps.hide) return result;
		var axisId = defaultedProps[numericAxisId];
		var parentGroup = result[axisId] || {
			hasStack: false,
			stackGroups: {}
		};
		if (isNumOrStr(stackId)) {
			var childGroup = parentGroup.stackGroups[stackId] || {
				numericAxisId,
				cateAxisId,
				items: []
			};
			childGroup.items.push(item);
			parentGroup.hasStack = true;
			parentGroup.stackGroups[stackId] = childGroup;
		} else parentGroup.stackGroups[uniqueId("_stackId_")] = {
			numericAxisId,
			cateAxisId,
			items: [item]
		};
		return _objectSpread$24(_objectSpread$24({}, result), {}, _defineProperty$27({}, axisId, parentGroup));
	}, {});
	return Object.keys(stackGroups).reduce(function(result, axisId) {
		var group = stackGroups[axisId];
		if (group.hasStack) group.stackGroups = Object.keys(group.stackGroups).reduce(function(res, stackId) {
			var g = group.stackGroups[stackId];
			return _objectSpread$24(_objectSpread$24({}, res), {}, _defineProperty$27({}, stackId, {
				numericAxisId,
				cateAxisId,
				items: g.items,
				stackedData: getStackedData(data, g.items, offsetType)
			}));
		}, {});
		return _objectSpread$24(_objectSpread$24({}, result), {}, _defineProperty$27({}, axisId, group));
	}, {});
};
/**
* Configure the scale function of axis
* @param {Object} scale The scale function
* @param {Object} opts  The configuration of axis
* @return {Object}      null
*/
var getTicksOfScale = function getTicksOfScale(scale, opts) {
	var realScaleType = opts.realScaleType, type = opts.type, tickCount = opts.tickCount, originalDomain = opts.originalDomain, allowDecimals = opts.allowDecimals;
	var scaleType = realScaleType || opts.scale;
	if (scaleType !== "auto" && scaleType !== "linear") return null;
	if (tickCount && type === "number" && originalDomain && (originalDomain[0] === "auto" || originalDomain[1] === "auto")) {
		var domain = scale.domain();
		if (!domain.length) return null;
		var tickValues = getNiceTickValues(domain, tickCount, allowDecimals);
		scale.domain([(0, import_min.default)(tickValues), (0, import_max.default)(tickValues)]);
		return { niceTicks: tickValues };
	}
	if (tickCount && type === "number") return { niceTicks: getTickValuesFixedDomain(scale.domain(), tickCount, allowDecimals) };
	return null;
};
function getCateCoordinateOfLine(_ref5) {
	var axis = _ref5.axis, ticks = _ref5.ticks, bandSize = _ref5.bandSize, entry = _ref5.entry, index = _ref5.index, dataKey = _ref5.dataKey;
	if (axis.type === "category") {
		if (!axis.allowDuplicatedCategory && axis.dataKey && !(0, import_isNil.default)(entry[axis.dataKey])) {
			var matchedTick = findEntryInArray(ticks, "value", entry[axis.dataKey]);
			if (matchedTick) return matchedTick.coordinate + bandSize / 2;
		}
		return ticks[index] ? ticks[index].coordinate + bandSize / 2 : null;
	}
	var value = getValueByDataKey(entry, !(0, import_isNil.default)(dataKey) ? dataKey : axis.dataKey);
	return !(0, import_isNil.default)(value) ? axis.scale(value) : null;
}
var getCateCoordinateOfBar = function getCateCoordinateOfBar(_ref6) {
	var axis = _ref6.axis, ticks = _ref6.ticks, offset = _ref6.offset, bandSize = _ref6.bandSize, entry = _ref6.entry, index = _ref6.index;
	if (axis.type === "category") return ticks[index] ? ticks[index].coordinate + offset : null;
	var value = getValueByDataKey(entry, axis.dataKey, axis.domain[index]);
	return !(0, import_isNil.default)(value) ? axis.scale(value) - bandSize / 2 + offset : null;
};
var getBaseValueOfBar = function getBaseValueOfBar(_ref7) {
	var numericAxis = _ref7.numericAxis;
	var domain = numericAxis.scale.domain();
	if (numericAxis.type === "number") {
		var minValue = Math.min(domain[0], domain[1]);
		var maxValue = Math.max(domain[0], domain[1]);
		if (minValue <= 0 && maxValue >= 0) return 0;
		if (maxValue < 0) return maxValue;
		return minValue;
	}
	return domain[0];
};
var getStackedDataOfItem = function getStackedDataOfItem(item, stackGroups) {
	var _item$type3;
	var stackId = ((_item$type3 = item.type) !== null && _item$type3 !== void 0 && _item$type3.defaultProps ? _objectSpread$24(_objectSpread$24({}, item.type.defaultProps), item.props) : item.props).stackId;
	if (isNumOrStr(stackId)) {
		var group = stackGroups[stackId];
		if (group) {
			var itemIndex = group.items.indexOf(item);
			return itemIndex >= 0 ? group.stackedData[itemIndex] : null;
		}
	}
	return null;
};
var getDomainOfSingle = function getDomainOfSingle(data) {
	return data.reduce(function(result, entry) {
		return [(0, import_min.default)(entry.concat([result[0]]).filter(isNumber)), (0, import_max.default)(entry.concat([result[1]]).filter(isNumber))];
	}, [Infinity, -Infinity]);
};
var getDomainOfStackGroups = function getDomainOfStackGroups(stackGroups, startIndex, endIndex) {
	return Object.keys(stackGroups).reduce(function(result, stackId) {
		var domain = stackGroups[stackId].stackedData.reduce(function(res, entry) {
			var s = getDomainOfSingle(entry.slice(startIndex, endIndex + 1));
			return [Math.min(res[0], s[0]), Math.max(res[1], s[1])];
		}, [Infinity, -Infinity]);
		return [Math.min(domain[0], result[0]), Math.max(domain[1], result[1])];
	}, [Infinity, -Infinity]).map(function(result) {
		return result === Infinity || result === -Infinity ? 0 : result;
	});
};
var MIN_VALUE_REG = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/;
var MAX_VALUE_REG = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/;
var parseSpecifiedDomain = function parseSpecifiedDomain(specifiedDomain, dataDomain, allowDataOverflow) {
	if ((0, import_isFunction.default)(specifiedDomain)) return specifiedDomain(dataDomain, allowDataOverflow);
	if (!Array.isArray(specifiedDomain)) return dataDomain;
	var domain = [];
	if (isNumber(specifiedDomain[0])) domain[0] = allowDataOverflow ? specifiedDomain[0] : Math.min(specifiedDomain[0], dataDomain[0]);
	else if (MIN_VALUE_REG.test(specifiedDomain[0])) {
		var value = +MIN_VALUE_REG.exec(specifiedDomain[0])[1];
		domain[0] = dataDomain[0] - value;
	} else if ((0, import_isFunction.default)(specifiedDomain[0])) domain[0] = specifiedDomain[0](dataDomain[0]);
	else domain[0] = dataDomain[0];
	if (isNumber(specifiedDomain[1])) domain[1] = allowDataOverflow ? specifiedDomain[1] : Math.max(specifiedDomain[1], dataDomain[1]);
	else if (MAX_VALUE_REG.test(specifiedDomain[1])) {
		var _value = +MAX_VALUE_REG.exec(specifiedDomain[1])[1];
		domain[1] = dataDomain[1] + _value;
	} else if ((0, import_isFunction.default)(specifiedDomain[1])) domain[1] = specifiedDomain[1](dataDomain[1]);
	else domain[1] = dataDomain[1];
	return domain;
};
/**
* Calculate the size between two category
* @param  {Object} axis  The options of axis
* @param  {Array}  ticks The ticks of axis
* @param  {Boolean} isBar if items in axis are bars
* @return {Number} Size
*/
var getBandSizeOfAxis = function getBandSizeOfAxis(axis, ticks, isBar) {
	if (axis && axis.scale && axis.scale.bandwidth) {
		var bandWidth = axis.scale.bandwidth();
		if (!isBar || bandWidth > 0) return bandWidth;
	}
	if (axis && ticks && ticks.length >= 2) {
		var orderedTicks = (0, import_sortBy.default)(ticks, function(o) {
			return o.coordinate;
		});
		var bandSize = Infinity;
		for (var i = 1, len = orderedTicks.length; i < len; i++) {
			var cur = orderedTicks[i];
			var prev = orderedTicks[i - 1];
			bandSize = Math.min((cur.coordinate || 0) - (prev.coordinate || 0), bandSize);
		}
		return bandSize === Infinity ? 0 : bandSize;
	}
	return isBar ? void 0 : 0;
};
/**
* parse the domain of a category axis when a domain is specified
* @param   {Array}        specifiedDomain  The domain specified by users
* @param   {Array}        calculatedDomain The domain calculated by dateKey
* @param   {ReactElement} axisChild        The axis ReactElement
* @returns {Array}        domains
*/
var parseDomainOfCategoryAxis = function parseDomainOfCategoryAxis(specifiedDomain, calculatedDomain, axisChild) {
	if (!specifiedDomain || !specifiedDomain.length) return calculatedDomain;
	if ((0, import_isEqual.default)(specifiedDomain, (0, import_get.default)(axisChild, "type.defaultProps.domain"))) return calculatedDomain;
	return specifiedDomain;
};
var getTooltipItem = function getTooltipItem(graphicalItem, payload) {
	var defaultedProps = graphicalItem.type.defaultProps ? _objectSpread$24(_objectSpread$24({}, graphicalItem.type.defaultProps), graphicalItem.props) : graphicalItem.props;
	var dataKey = defaultedProps.dataKey, name = defaultedProps.name, unit = defaultedProps.unit, formatter = defaultedProps.formatter, tooltipType = defaultedProps.tooltipType, chartType = defaultedProps.chartType, hide = defaultedProps.hide;
	return _objectSpread$24(_objectSpread$24({}, filterProps(graphicalItem, false)), {}, {
		dataKey,
		unit,
		formatter,
		name: name || dataKey,
		color: getMainColorOfGraphicItem(graphicalItem),
		value: getValueByDataKey(payload, dataKey),
		type: tooltipType,
		payload,
		chartType,
		hide
	});
};
//#endregion
//#region node_modules/recharts/es6/util/DOMUtils.js
function _typeof$27(o) {
	"@babel/helpers - typeof";
	return _typeof$27 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$27(o);
}
function ownKeys$23(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$23(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$23(Object(t), !0).forEach(function(r) {
			_defineProperty$26(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$23(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$26(obj, key, value) {
	key = _toPropertyKey$27(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$27(t) {
	var i = _toPrimitive$27(t, "string");
	return "symbol" == _typeof$27(i) ? i : i + "";
}
function _toPrimitive$27(t, r) {
	if ("object" != _typeof$27(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$27(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var stringCache = {
	widthCache: {},
	cacheCount: 0
};
var MAX_CACHE_NUM = 2e3;
var SPAN_STYLE = {
	position: "absolute",
	top: "-20000px",
	left: 0,
	padding: 0,
	margin: 0,
	border: "none",
	whiteSpace: "pre"
};
var MEASUREMENT_SPAN_ID = "recharts_measurement_span";
function removeInvalidKeys(obj) {
	var copyObj = _objectSpread$23({}, obj);
	Object.keys(copyObj).forEach(function(key) {
		if (!copyObj[key]) delete copyObj[key];
	});
	return copyObj;
}
var getStringSize = function getStringSize(text) {
	var style = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	if (text === void 0 || text === null || Global.isSsr) return {
		width: 0,
		height: 0
	};
	var copyStyle = removeInvalidKeys(style);
	var cacheKey = JSON.stringify({
		text,
		copyStyle
	});
	if (stringCache.widthCache[cacheKey]) return stringCache.widthCache[cacheKey];
	try {
		var measurementSpan = document.getElementById(MEASUREMENT_SPAN_ID);
		if (!measurementSpan) {
			measurementSpan = document.createElement("span");
			measurementSpan.setAttribute("id", MEASUREMENT_SPAN_ID);
			measurementSpan.setAttribute("aria-hidden", "true");
			document.body.appendChild(measurementSpan);
		}
		var measurementSpanStyle = _objectSpread$23(_objectSpread$23({}, SPAN_STYLE), copyStyle);
		Object.assign(measurementSpan.style, measurementSpanStyle);
		measurementSpan.textContent = "".concat(text);
		var rect = measurementSpan.getBoundingClientRect();
		var result = {
			width: rect.width,
			height: rect.height
		};
		stringCache.widthCache[cacheKey] = result;
		if (++stringCache.cacheCount > MAX_CACHE_NUM) {
			stringCache.cacheCount = 0;
			stringCache.widthCache = {};
		}
		return result;
	} catch (e) {
		return {
			width: 0,
			height: 0
		};
	}
};
var getOffset = function getOffset(rect) {
	return {
		top: rect.top + window.scrollY - document.documentElement.clientTop,
		left: rect.left + window.scrollX - document.documentElement.clientLeft
	};
};
//#endregion
//#region node_modules/recharts/es6/component/Cell.js
var import_mapValues = /* @__PURE__ */ __toESM(require_mapValues());
var import_every = /* @__PURE__ */ __toESM(require_every());
/**
* @fileOverview Cross
*/
var Cell = function Cell(_props) {
	return null;
};
Cell.displayName = "Cell";
//#endregion
//#region node_modules/recharts/es6/util/ReduceCSSCalc.js
var import_last = /* @__PURE__ */ __toESM(require_last());
function _typeof$26(o) {
	"@babel/helpers - typeof";
	return _typeof$26 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$26(o);
}
function _slicedToArray$5(arr, i) {
	return _arrayWithHoles$5(arr) || _iterableToArrayLimit$5(arr, i) || _unsupportedIterableToArray$8(arr, i) || _nonIterableRest$5();
}
function _nonIterableRest$5() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$8(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$8(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$8(o, minLen);
}
function _arrayLikeToArray$8(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _iterableToArrayLimit$5(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayWithHoles$5(arr) {
	if (Array.isArray(arr)) return arr;
}
function _classCallCheck$12(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$12(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$26(descriptor.key), descriptor);
	}
}
function _createClass$12(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$12(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$12(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _toPropertyKey$26(t) {
	var i = _toPrimitive$26(t, "string");
	return "symbol" == _typeof$26(i) ? i : i + "";
}
function _toPrimitive$26(t, r) {
	if ("object" != _typeof$26(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$26(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var MULTIPLY_OR_DIVIDE_REGEX = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/;
var ADD_OR_SUBTRACT_REGEX = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/;
var CSS_LENGTH_UNIT_REGEX = /^px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q$/;
var NUM_SPLIT_REGEX = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/;
var CONVERSION_RATES = {
	cm: 96 / 2.54,
	mm: 96 / 25.4,
	pt: 96 / 72,
	pc: 96 / 6,
	"in": 96,
	Q: 96 / (2.54 * 40),
	px: 1
};
var FIXED_CSS_LENGTH_UNITS = Object.keys(CONVERSION_RATES);
var STR_NAN = "NaN";
function convertToPx(value, unit) {
	return value * CONVERSION_RATES[unit];
}
var DecimalCSS = /*#__PURE__*/ function() {
	function DecimalCSS(num, unit) {
		_classCallCheck$12(this, DecimalCSS);
		this.num = num;
		this.unit = unit;
		this.num = num;
		this.unit = unit;
		if (Number.isNaN(num)) this.unit = "";
		if (unit !== "" && !CSS_LENGTH_UNIT_REGEX.test(unit)) {
			this.num = NaN;
			this.unit = "";
		}
		if (FIXED_CSS_LENGTH_UNITS.includes(unit)) {
			this.num = convertToPx(num, unit);
			this.unit = "px";
		}
	}
	return _createClass$12(DecimalCSS, [
		{
			key: "add",
			value: function add(other) {
				if (this.unit !== other.unit) return new DecimalCSS(NaN, "");
				return new DecimalCSS(this.num + other.num, this.unit);
			}
		},
		{
			key: "subtract",
			value: function subtract(other) {
				if (this.unit !== other.unit) return new DecimalCSS(NaN, "");
				return new DecimalCSS(this.num - other.num, this.unit);
			}
		},
		{
			key: "multiply",
			value: function multiply(other) {
				if (this.unit !== "" && other.unit !== "" && this.unit !== other.unit) return new DecimalCSS(NaN, "");
				return new DecimalCSS(this.num * other.num, this.unit || other.unit);
			}
		},
		{
			key: "divide",
			value: function divide(other) {
				if (this.unit !== "" && other.unit !== "" && this.unit !== other.unit) return new DecimalCSS(NaN, "");
				return new DecimalCSS(this.num / other.num, this.unit || other.unit);
			}
		},
		{
			key: "toString",
			value: function toString() {
				return "".concat(this.num).concat(this.unit);
			}
		},
		{
			key: "isNaN",
			value: function isNaN() {
				return Number.isNaN(this.num);
			}
		}
	], [{
		key: "parse",
		value: function parse(str) {
			var _NUM_SPLIT_REGEX$exec;
			var _ref2 = _slicedToArray$5((_NUM_SPLIT_REGEX$exec = NUM_SPLIT_REGEX.exec(str)) !== null && _NUM_SPLIT_REGEX$exec !== void 0 ? _NUM_SPLIT_REGEX$exec : [], 3), numStr = _ref2[1], unit = _ref2[2];
			return new DecimalCSS(parseFloat(numStr), unit !== null && unit !== void 0 ? unit : "");
		}
	}]);
}();
function calculateArithmetic(expr) {
	if (expr.includes(STR_NAN)) return STR_NAN;
	var newExpr = expr;
	while (newExpr.includes("*") || newExpr.includes("/")) {
		var _MULTIPLY_OR_DIVIDE_R;
		var _ref4 = _slicedToArray$5((_MULTIPLY_OR_DIVIDE_R = MULTIPLY_OR_DIVIDE_REGEX.exec(newExpr)) !== null && _MULTIPLY_OR_DIVIDE_R !== void 0 ? _MULTIPLY_OR_DIVIDE_R : [], 4), leftOperand = _ref4[1], operator = _ref4[2], rightOperand = _ref4[3];
		var lTs = DecimalCSS.parse(leftOperand !== null && leftOperand !== void 0 ? leftOperand : "");
		var rTs = DecimalCSS.parse(rightOperand !== null && rightOperand !== void 0 ? rightOperand : "");
		var result = operator === "*" ? lTs.multiply(rTs) : lTs.divide(rTs);
		if (result.isNaN()) return STR_NAN;
		newExpr = newExpr.replace(MULTIPLY_OR_DIVIDE_REGEX, result.toString());
	}
	while (newExpr.includes("+") || /.-\d+(?:\.\d+)?/.test(newExpr)) {
		var _ADD_OR_SUBTRACT_REGE;
		var _ref6 = _slicedToArray$5((_ADD_OR_SUBTRACT_REGE = ADD_OR_SUBTRACT_REGEX.exec(newExpr)) !== null && _ADD_OR_SUBTRACT_REGE !== void 0 ? _ADD_OR_SUBTRACT_REGE : [], 4), _leftOperand = _ref6[1], _operator = _ref6[2], _rightOperand = _ref6[3];
		var _lTs = DecimalCSS.parse(_leftOperand !== null && _leftOperand !== void 0 ? _leftOperand : "");
		var _rTs = DecimalCSS.parse(_rightOperand !== null && _rightOperand !== void 0 ? _rightOperand : "");
		var _result = _operator === "+" ? _lTs.add(_rTs) : _lTs.subtract(_rTs);
		if (_result.isNaN()) return STR_NAN;
		newExpr = newExpr.replace(ADD_OR_SUBTRACT_REGEX, _result.toString());
	}
	return newExpr;
}
var PARENTHESES_REGEX = /\(([^()]*)\)/;
function calculateParentheses(expr) {
	var newExpr = expr;
	while (newExpr.includes("(")) {
		var parentheticalExpression = _slicedToArray$5(PARENTHESES_REGEX.exec(newExpr), 2)[1];
		newExpr = newExpr.replace(PARENTHESES_REGEX, calculateArithmetic(parentheticalExpression));
	}
	return newExpr;
}
function evaluateExpression(expression) {
	var newExpr = expression.replace(/\s+/g, "");
	newExpr = calculateParentheses(newExpr);
	newExpr = calculateArithmetic(newExpr);
	return newExpr;
}
function safeEvaluateExpression(expression) {
	try {
		return evaluateExpression(expression);
	} catch (e) {
		/* istanbul ignore next */
		return STR_NAN;
	}
}
function reduceCSSCalc(expression) {
	var result = safeEvaluateExpression(expression.slice(5, -1));
	if (result === STR_NAN) return "";
	return result;
}
//#endregion
//#region node_modules/recharts/es6/component/Text.js
var _excluded$10 = [
	"x",
	"y",
	"lineHeight",
	"capHeight",
	"scaleToFit",
	"textAnchor",
	"verticalAnchor",
	"fill"
], _excluded2$5 = [
	"dx",
	"dy",
	"angle",
	"className",
	"breakAll"
];
function _extends$20() {
	_extends$20 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$20.apply(this, arguments);
}
function _objectWithoutProperties$10(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$10(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$10(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _slicedToArray$4(arr, i) {
	return _arrayWithHoles$4(arr) || _iterableToArrayLimit$4(arr, i) || _unsupportedIterableToArray$7(arr, i) || _nonIterableRest$4();
}
function _nonIterableRest$4() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$7(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$7(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$7(o, minLen);
}
function _arrayLikeToArray$7(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _iterableToArrayLimit$4(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayWithHoles$4(arr) {
	if (Array.isArray(arr)) return arr;
}
var BREAKING_SPACES = /[ \f\n\r\t\v\u2028\u2029]+/;
var calculateWordWidths = function calculateWordWidths(_ref) {
	var children = _ref.children, breakAll = _ref.breakAll, style = _ref.style;
	try {
		var words = [];
		if (!(0, import_isNil.default)(children)) if (breakAll) words = children.toString().split("");
		else words = children.toString().split(BREAKING_SPACES);
		return {
			wordsWithComputedWidth: words.map(function(word) {
				return {
					word,
					width: getStringSize(word, style).width
				};
			}),
			spaceWidth: breakAll ? 0 : getStringSize("\xA0", style).width
		};
	} catch (e) {
		return null;
	}
};
var calculateWordsByLines = function calculateWordsByLines(_ref2, initialWordsWithComputedWith, spaceWidth, lineWidth, scaleToFit) {
	var maxLines = _ref2.maxLines, children = _ref2.children, style = _ref2.style, breakAll = _ref2.breakAll;
	var shouldLimitLines = isNumber(maxLines);
	var text = children;
	var calculate = function calculate() {
		return (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : []).reduce(function(result, _ref3) {
			var word = _ref3.word, width = _ref3.width;
			var currentLine = result[result.length - 1];
			if (currentLine && (lineWidth == null || scaleToFit || currentLine.width + width + spaceWidth < Number(lineWidth))) {
				currentLine.words.push(word);
				currentLine.width += width + spaceWidth;
			} else {
				var newLine = {
					words: [word],
					width
				};
				result.push(newLine);
			}
			return result;
		}, []);
	};
	var originalResult = calculate(initialWordsWithComputedWith);
	var findLongestLine = function findLongestLine(words) {
		return words.reduce(function(a, b) {
			return a.width > b.width ? a : b;
		});
	};
	if (!shouldLimitLines) return originalResult;
	var suffix = "…";
	var checkOverflow = function checkOverflow(index) {
		var words = calculateWordWidths({
			breakAll,
			style,
			children: text.slice(0, index) + suffix
		}).wordsWithComputedWidth;
		var result = calculate(words);
		return [result.length > maxLines || findLongestLine(result).width > Number(lineWidth), result];
	};
	var start = 0;
	var end = text.length - 1;
	var iterations = 0;
	var trimmedResult;
	while (start <= end && iterations <= text.length - 1) {
		var middle = Math.floor((start + end) / 2);
		var _checkOverflow2 = _slicedToArray$4(checkOverflow(middle - 1), 2), doesPrevOverflow = _checkOverflow2[0], result = _checkOverflow2[1];
		var doesMiddleOverflow = _slicedToArray$4(checkOverflow(middle), 1)[0];
		if (!doesPrevOverflow && !doesMiddleOverflow) start = middle + 1;
		if (doesPrevOverflow && doesMiddleOverflow) end = middle - 1;
		if (!doesPrevOverflow && doesMiddleOverflow) {
			trimmedResult = result;
			break;
		}
		iterations++;
	}
	return trimmedResult || originalResult;
};
var getWordsWithoutCalculate = function getWordsWithoutCalculate(children) {
	return [{ words: !(0, import_isNil.default)(children) ? children.toString().split(BREAKING_SPACES) : [] }];
};
var getWordsByLines = function getWordsByLines(_ref4) {
	var width = _ref4.width, scaleToFit = _ref4.scaleToFit, children = _ref4.children, style = _ref4.style, breakAll = _ref4.breakAll, maxLines = _ref4.maxLines;
	if ((width || scaleToFit) && !Global.isSsr) {
		var wordsWithComputedWidth, spaceWidth;
		var wordWidths = calculateWordWidths({
			breakAll,
			children,
			style
		});
		if (wordWidths) {
			var wcw = wordWidths.wordsWithComputedWidth, sw = wordWidths.spaceWidth;
			wordsWithComputedWidth = wcw;
			spaceWidth = sw;
		} else return getWordsWithoutCalculate(children);
		return calculateWordsByLines({
			breakAll,
			children,
			maxLines,
			style
		}, wordsWithComputedWidth, spaceWidth, width, scaleToFit);
	}
	return getWordsWithoutCalculate(children);
};
var DEFAULT_FILL = "#808080";
var Text = function Text(_ref5) {
	var _ref5$x = _ref5.x, propsX = _ref5$x === void 0 ? 0 : _ref5$x, _ref5$y = _ref5.y, propsY = _ref5$y === void 0 ? 0 : _ref5$y, _ref5$lineHeight = _ref5.lineHeight, lineHeight = _ref5$lineHeight === void 0 ? "1em" : _ref5$lineHeight, _ref5$capHeight = _ref5.capHeight, capHeight = _ref5$capHeight === void 0 ? "0.71em" : _ref5$capHeight, _ref5$scaleToFit = _ref5.scaleToFit, scaleToFit = _ref5$scaleToFit === void 0 ? false : _ref5$scaleToFit, _ref5$textAnchor = _ref5.textAnchor, textAnchor = _ref5$textAnchor === void 0 ? "start" : _ref5$textAnchor, _ref5$verticalAnchor = _ref5.verticalAnchor, verticalAnchor = _ref5$verticalAnchor === void 0 ? "end" : _ref5$verticalAnchor, _ref5$fill = _ref5.fill, fill = _ref5$fill === void 0 ? DEFAULT_FILL : _ref5$fill, props = _objectWithoutProperties$10(_ref5, _excluded$10);
	var wordsByLines = (0, import_react.useMemo)(function() {
		return getWordsByLines({
			breakAll: props.breakAll,
			children: props.children,
			maxLines: props.maxLines,
			scaleToFit,
			style: props.style,
			width: props.width
		});
	}, [
		props.breakAll,
		props.children,
		props.maxLines,
		scaleToFit,
		props.style,
		props.width
	]);
	var dx = props.dx, dy = props.dy, angle = props.angle, className = props.className, breakAll = props.breakAll, textProps = _objectWithoutProperties$10(props, _excluded2$5);
	if (!isNumOrStr(propsX) || !isNumOrStr(propsY)) return null;
	var x = propsX + (isNumber(dx) ? dx : 0);
	var y = propsY + (isNumber(dy) ? dy : 0);
	var startDy;
	switch (verticalAnchor) {
		case "start":
			startDy = reduceCSSCalc("calc(".concat(capHeight, ")"));
			break;
		case "middle":
			startDy = reduceCSSCalc("calc(".concat((wordsByLines.length - 1) / 2, " * -").concat(lineHeight, " + (").concat(capHeight, " / 2))"));
			break;
		default:
			startDy = reduceCSSCalc("calc(".concat(wordsByLines.length - 1, " * -").concat(lineHeight, ")"));
			break;
	}
	var transforms = [];
	if (scaleToFit) {
		var lineWidth = wordsByLines[0].width;
		var width = props.width;
		transforms.push("scale(".concat((isNumber(width) ? width / lineWidth : 1) / lineWidth, ")"));
	}
	if (angle) transforms.push("rotate(".concat(angle, ", ").concat(x, ", ").concat(y, ")"));
	if (transforms.length) textProps.transform = transforms.join(" ");
	return /*#__PURE__*/ import_react.createElement("text", _extends$20({}, filterProps(textProps, true), {
		x,
		y,
		className: clsx("recharts-text", className),
		textAnchor,
		fill: fill.includes("url") ? DEFAULT_FILL : fill
	}), wordsByLines.map(function(line, index) {
		var words = line.words.join(breakAll ? "" : " ");
		return /*#__PURE__*/ import_react.createElement("tspan", {
			x,
			dy: index === 0 ? startDy : lineHeight,
			key: "".concat(words, "-").concat(index)
		}, words);
	}));
};
//#endregion
//#region node_modules/recharts/es6/util/PolarUtils.js
function _typeof$25(o) {
	"@babel/helpers - typeof";
	return _typeof$25 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$25(o);
}
function ownKeys$22(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$22(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$22(Object(t), !0).forEach(function(r) {
			_defineProperty$25(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$22(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$25(obj, key, value) {
	key = _toPropertyKey$25(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$25(t) {
	var i = _toPrimitive$25(t, "string");
	return "symbol" == _typeof$25(i) ? i : i + "";
}
function _toPrimitive$25(t, r) {
	if ("object" != _typeof$25(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$25(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var RADIAN = Math.PI / 180;
var radianToDegree = function radianToDegree(angleInRadian) {
	return angleInRadian * 180 / Math.PI;
};
var polarToCartesian = function polarToCartesian(cx, cy, radius, angle) {
	return {
		x: cx + Math.cos(-RADIAN * angle) * radius,
		y: cy + Math.sin(-RADIAN * angle) * radius
	};
};
var distanceBetweenPoints = function distanceBetweenPoints(point, anotherPoint) {
	var x1 = point.x, y1 = point.y;
	var x2 = anotherPoint.x, y2 = anotherPoint.y;
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};
var getAngleOfPoint = function getAngleOfPoint(_ref, _ref2) {
	var x = _ref.x, y = _ref.y;
	var cx = _ref2.cx, cy = _ref2.cy;
	var radius = distanceBetweenPoints({
		x,
		y
	}, {
		x: cx,
		y: cy
	});
	if (radius <= 0) return { radius };
	var cos = (x - cx) / radius;
	var angleInRadian = Math.acos(cos);
	if (y > cy) angleInRadian = 2 * Math.PI - angleInRadian;
	return {
		radius,
		angle: radianToDegree(angleInRadian),
		angleInRadian
	};
};
var formatAngleOfSector = function formatAngleOfSector(_ref3) {
	var startAngle = _ref3.startAngle, endAngle = _ref3.endAngle;
	var startCnt = Math.floor(startAngle / 360);
	var endCnt = Math.floor(endAngle / 360);
	var min = Math.min(startCnt, endCnt);
	return {
		startAngle: startAngle - min * 360,
		endAngle: endAngle - min * 360
	};
};
var reverseFormatAngleOfSetor = function reverseFormatAngleOfSetor(angle, _ref4) {
	var startAngle = _ref4.startAngle, endAngle = _ref4.endAngle;
	var startCnt = Math.floor(startAngle / 360);
	var endCnt = Math.floor(endAngle / 360);
	return angle + Math.min(startCnt, endCnt) * 360;
};
var inRangeOfSector = function inRangeOfSector(_ref5, sector) {
	var x = _ref5.x, y = _ref5.y;
	var _getAngleOfPoint = getAngleOfPoint({
		x,
		y
	}, sector), radius = _getAngleOfPoint.radius, angle = _getAngleOfPoint.angle;
	var innerRadius = sector.innerRadius, outerRadius = sector.outerRadius;
	if (radius < innerRadius || radius > outerRadius) return false;
	if (radius === 0) return true;
	var _formatAngleOfSector = formatAngleOfSector(sector), startAngle = _formatAngleOfSector.startAngle, endAngle = _formatAngleOfSector.endAngle;
	var formatAngle = angle;
	var inRange;
	if (startAngle <= endAngle) {
		while (formatAngle > endAngle) formatAngle -= 360;
		while (formatAngle < startAngle) formatAngle += 360;
		inRange = formatAngle >= startAngle && formatAngle <= endAngle;
	} else {
		while (formatAngle > startAngle) formatAngle -= 360;
		while (formatAngle < endAngle) formatAngle += 360;
		inRange = formatAngle >= endAngle && formatAngle <= startAngle;
	}
	if (inRange) return _objectSpread$22(_objectSpread$22({}, sector), {}, {
		radius,
		angle: reverseFormatAngleOfSetor(formatAngle, sector)
	});
	return null;
};
//#endregion
//#region node_modules/recharts/es6/component/Label.js
function _typeof$24(o) {
	"@babel/helpers - typeof";
	return _typeof$24 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$24(o);
}
var _excluded$9 = ["offset"];
function _toConsumableArray$3(arr) {
	return _arrayWithoutHoles$3(arr) || _iterableToArray$3(arr) || _unsupportedIterableToArray$6(arr) || _nonIterableSpread$3();
}
function _nonIterableSpread$3() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$6(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$6(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$6(o, minLen);
}
function _iterableToArray$3(iter) {
	if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles$3(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray$6(arr);
}
function _arrayLikeToArray$6(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _objectWithoutProperties$9(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$9(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$9(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function ownKeys$21(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$21(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$21(Object(t), !0).forEach(function(r) {
			_defineProperty$24(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$21(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$24(obj, key, value) {
	key = _toPropertyKey$24(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$24(t) {
	var i = _toPrimitive$24(t, "string");
	return "symbol" == _typeof$24(i) ? i : i + "";
}
function _toPrimitive$24(t, r) {
	if ("object" != _typeof$24(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$24(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _extends$19() {
	_extends$19 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$19.apply(this, arguments);
}
var getLabel = function getLabel(props) {
	var value = props.value, formatter = props.formatter;
	var label = (0, import_isNil.default)(props.children) ? value : props.children;
	if ((0, import_isFunction.default)(formatter)) return formatter(label);
	return label;
};
var getDeltaAngle$1 = function getDeltaAngle(startAngle, endAngle) {
	return mathSign(endAngle - startAngle) * Math.min(Math.abs(endAngle - startAngle), 360);
};
var renderRadialLabel = function renderRadialLabel(labelProps, label, attrs) {
	var position = labelProps.position, viewBox = labelProps.viewBox, offset = labelProps.offset, className = labelProps.className;
	var _ref = viewBox, cx = _ref.cx, cy = _ref.cy, innerRadius = _ref.innerRadius, outerRadius = _ref.outerRadius, startAngle = _ref.startAngle, endAngle = _ref.endAngle, clockWise = _ref.clockWise;
	var radius = (innerRadius + outerRadius) / 2;
	var deltaAngle = getDeltaAngle$1(startAngle, endAngle);
	var sign = deltaAngle >= 0 ? 1 : -1;
	var labelAngle, direction;
	if (position === "insideStart") {
		labelAngle = startAngle + sign * offset;
		direction = clockWise;
	} else if (position === "insideEnd") {
		labelAngle = endAngle - sign * offset;
		direction = !clockWise;
	} else if (position === "end") {
		labelAngle = endAngle + sign * offset;
		direction = clockWise;
	}
	direction = deltaAngle <= 0 ? direction : !direction;
	var startPoint = polarToCartesian(cx, cy, radius, labelAngle);
	var endPoint = polarToCartesian(cx, cy, radius, labelAngle + (direction ? 1 : -1) * 359);
	var path = "M".concat(startPoint.x, ",").concat(startPoint.y, "\n    A").concat(radius, ",").concat(radius, ",0,1,").concat(direction ? 0 : 1, ",\n    ").concat(endPoint.x, ",").concat(endPoint.y);
	var id = (0, import_isNil.default)(labelProps.id) ? uniqueId("recharts-radial-line-") : labelProps.id;
	return /*#__PURE__*/ import_react.createElement("text", _extends$19({}, attrs, {
		dominantBaseline: "central",
		className: clsx("recharts-radial-bar-label", className)
	}), /*#__PURE__*/ import_react.createElement("defs", null, /*#__PURE__*/ import_react.createElement("path", {
		id,
		d: path
	})), /*#__PURE__*/ import_react.createElement("textPath", { xlinkHref: "#".concat(id) }, label));
};
var getAttrsOfPolarLabel = function getAttrsOfPolarLabel(props) {
	var viewBox = props.viewBox, offset = props.offset, position = props.position;
	var _ref2 = viewBox, cx = _ref2.cx, cy = _ref2.cy, innerRadius = _ref2.innerRadius, outerRadius = _ref2.outerRadius;
	var midAngle = (_ref2.startAngle + _ref2.endAngle) / 2;
	if (position === "outside") {
		var _polarToCartesian = polarToCartesian(cx, cy, outerRadius + offset, midAngle), _x = _polarToCartesian.x;
		return {
			x: _x,
			y: _polarToCartesian.y,
			textAnchor: _x >= cx ? "start" : "end",
			verticalAnchor: "middle"
		};
	}
	if (position === "center") return {
		x: cx,
		y: cy,
		textAnchor: "middle",
		verticalAnchor: "middle"
	};
	if (position === "centerTop") return {
		x: cx,
		y: cy,
		textAnchor: "middle",
		verticalAnchor: "start"
	};
	if (position === "centerBottom") return {
		x: cx,
		y: cy,
		textAnchor: "middle",
		verticalAnchor: "end"
	};
	var _polarToCartesian2 = polarToCartesian(cx, cy, (innerRadius + outerRadius) / 2, midAngle);
	return {
		x: _polarToCartesian2.x,
		y: _polarToCartesian2.y,
		textAnchor: "middle",
		verticalAnchor: "middle"
	};
};
var getAttrsOfCartesianLabel = function getAttrsOfCartesianLabel(props) {
	var viewBox = props.viewBox, parentViewBox = props.parentViewBox, offset = props.offset, position = props.position;
	var _ref3 = viewBox, x = _ref3.x, y = _ref3.y, width = _ref3.width, height = _ref3.height;
	var verticalSign = height >= 0 ? 1 : -1;
	var verticalOffset = verticalSign * offset;
	var verticalEnd = verticalSign > 0 ? "end" : "start";
	var verticalStart = verticalSign > 0 ? "start" : "end";
	var horizontalSign = width >= 0 ? 1 : -1;
	var horizontalOffset = horizontalSign * offset;
	var horizontalEnd = horizontalSign > 0 ? "end" : "start";
	var horizontalStart = horizontalSign > 0 ? "start" : "end";
	if (position === "top") return _objectSpread$21(_objectSpread$21({}, {
		x: x + width / 2,
		y: y - verticalSign * offset,
		textAnchor: "middle",
		verticalAnchor: verticalEnd
	}), parentViewBox ? {
		height: Math.max(y - parentViewBox.y, 0),
		width
	} : {});
	if (position === "bottom") return _objectSpread$21(_objectSpread$21({}, {
		x: x + width / 2,
		y: y + height + verticalOffset,
		textAnchor: "middle",
		verticalAnchor: verticalStart
	}), parentViewBox ? {
		height: Math.max(parentViewBox.y + parentViewBox.height - (y + height), 0),
		width
	} : {});
	if (position === "left") {
		var _attrs2 = {
			x: x - horizontalOffset,
			y: y + height / 2,
			textAnchor: horizontalEnd,
			verticalAnchor: "middle"
		};
		return _objectSpread$21(_objectSpread$21({}, _attrs2), parentViewBox ? {
			width: Math.max(_attrs2.x - parentViewBox.x, 0),
			height
		} : {});
	}
	if (position === "right") {
		var _attrs3 = {
			x: x + width + horizontalOffset,
			y: y + height / 2,
			textAnchor: horizontalStart,
			verticalAnchor: "middle"
		};
		return _objectSpread$21(_objectSpread$21({}, _attrs3), parentViewBox ? {
			width: Math.max(parentViewBox.x + parentViewBox.width - _attrs3.x, 0),
			height
		} : {});
	}
	var sizeAttrs = parentViewBox ? {
		width,
		height
	} : {};
	if (position === "insideLeft") return _objectSpread$21({
		x: x + horizontalOffset,
		y: y + height / 2,
		textAnchor: horizontalStart,
		verticalAnchor: "middle"
	}, sizeAttrs);
	if (position === "insideRight") return _objectSpread$21({
		x: x + width - horizontalOffset,
		y: y + height / 2,
		textAnchor: horizontalEnd,
		verticalAnchor: "middle"
	}, sizeAttrs);
	if (position === "insideTop") return _objectSpread$21({
		x: x + width / 2,
		y: y + verticalOffset,
		textAnchor: "middle",
		verticalAnchor: verticalStart
	}, sizeAttrs);
	if (position === "insideBottom") return _objectSpread$21({
		x: x + width / 2,
		y: y + height - verticalOffset,
		textAnchor: "middle",
		verticalAnchor: verticalEnd
	}, sizeAttrs);
	if (position === "insideTopLeft") return _objectSpread$21({
		x: x + horizontalOffset,
		y: y + verticalOffset,
		textAnchor: horizontalStart,
		verticalAnchor: verticalStart
	}, sizeAttrs);
	if (position === "insideTopRight") return _objectSpread$21({
		x: x + width - horizontalOffset,
		y: y + verticalOffset,
		textAnchor: horizontalEnd,
		verticalAnchor: verticalStart
	}, sizeAttrs);
	if (position === "insideBottomLeft") return _objectSpread$21({
		x: x + horizontalOffset,
		y: y + height - verticalOffset,
		textAnchor: horizontalStart,
		verticalAnchor: verticalEnd
	}, sizeAttrs);
	if (position === "insideBottomRight") return _objectSpread$21({
		x: x + width - horizontalOffset,
		y: y + height - verticalOffset,
		textAnchor: horizontalEnd,
		verticalAnchor: verticalEnd
	}, sizeAttrs);
	if ((0, import_isObject.default)(position) && (isNumber(position.x) || isPercent(position.x)) && (isNumber(position.y) || isPercent(position.y))) return _objectSpread$21({
		x: x + getPercentValue(position.x, width),
		y: y + getPercentValue(position.y, height),
		textAnchor: "end",
		verticalAnchor: "end"
	}, sizeAttrs);
	return _objectSpread$21({
		x: x + width / 2,
		y: y + height / 2,
		textAnchor: "middle",
		verticalAnchor: "middle"
	}, sizeAttrs);
};
var isPolar = function isPolar(viewBox) {
	return "cx" in viewBox && isNumber(viewBox.cx);
};
function Label(_ref4) {
	var _ref4$offset = _ref4.offset, offset = _ref4$offset === void 0 ? 5 : _ref4$offset, restProps = _objectWithoutProperties$9(_ref4, _excluded$9);
	var props = _objectSpread$21({ offset }, restProps);
	var viewBox = props.viewBox, position = props.position, value = props.value, children = props.children, content = props.content, _props$className = props.className, className = _props$className === void 0 ? "" : _props$className, textBreakAll = props.textBreakAll;
	if (!viewBox || (0, import_isNil.default)(value) && (0, import_isNil.default)(children) && !/*#__PURE__*/ (0, import_react.isValidElement)(content) && !(0, import_isFunction.default)(content)) return null;
	if (/*#__PURE__*/ (0, import_react.isValidElement)(content)) return /*#__PURE__*/ (0, import_react.cloneElement)(content, props);
	var label;
	if ((0, import_isFunction.default)(content)) {
		label = /*#__PURE__*/ (0, import_react.createElement)(content, props);
		if (/*#__PURE__*/ (0, import_react.isValidElement)(label)) return label;
	} else label = getLabel(props);
	var isPolarLabel = isPolar(viewBox);
	var attrs = filterProps(props, true);
	if (isPolarLabel && (position === "insideStart" || position === "insideEnd" || position === "end")) return renderRadialLabel(props, label, attrs);
	var positionAttrs = isPolarLabel ? getAttrsOfPolarLabel(props) : getAttrsOfCartesianLabel(props);
	return /*#__PURE__*/ import_react.createElement(Text, _extends$19({ className: clsx("recharts-label", className) }, attrs, positionAttrs, { breakAll: textBreakAll }), label);
}
Label.displayName = "Label";
var parseViewBox = function parseViewBox(props) {
	var cx = props.cx, cy = props.cy, angle = props.angle, startAngle = props.startAngle, endAngle = props.endAngle, r = props.r, radius = props.radius, innerRadius = props.innerRadius, outerRadius = props.outerRadius, x = props.x, y = props.y, top = props.top, left = props.left, width = props.width, height = props.height, clockWise = props.clockWise, labelViewBox = props.labelViewBox;
	if (labelViewBox) return labelViewBox;
	if (isNumber(width) && isNumber(height)) {
		if (isNumber(x) && isNumber(y)) return {
			x,
			y,
			width,
			height
		};
		if (isNumber(top) && isNumber(left)) return {
			x: top,
			y: left,
			width,
			height
		};
	}
	if (isNumber(x) && isNumber(y)) return {
		x,
		y,
		width: 0,
		height: 0
	};
	if (isNumber(cx) && isNumber(cy)) return {
		cx,
		cy,
		startAngle: startAngle || angle || 0,
		endAngle: endAngle || angle || 0,
		innerRadius: innerRadius || 0,
		outerRadius: outerRadius || radius || r || 0,
		clockWise
	};
	if (props.viewBox) return props.viewBox;
	return {};
};
var parseLabel = function parseLabel(label, viewBox) {
	if (!label) return null;
	if (label === true) return /*#__PURE__*/ import_react.createElement(Label, {
		key: "label-implicit",
		viewBox
	});
	if (isNumOrStr(label)) return /*#__PURE__*/ import_react.createElement(Label, {
		key: "label-implicit",
		viewBox,
		value: label
	});
	if (/*#__PURE__*/ (0, import_react.isValidElement)(label)) {
		if (label.type === Label) return /*#__PURE__*/ (0, import_react.cloneElement)(label, {
			key: "label-implicit",
			viewBox
		});
		return /*#__PURE__*/ import_react.createElement(Label, {
			key: "label-implicit",
			content: label,
			viewBox
		});
	}
	if ((0, import_isFunction.default)(label)) return /*#__PURE__*/ import_react.createElement(Label, {
		key: "label-implicit",
		content: label,
		viewBox
	});
	if ((0, import_isObject.default)(label)) return /*#__PURE__*/ import_react.createElement(Label, _extends$19({ viewBox }, label, { key: "label-implicit" }));
	return null;
};
var renderCallByParent$1 = function renderCallByParent(parentProps, viewBox) {
	var checkPropsLabel = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
	if (!parentProps || !parentProps.children && checkPropsLabel && !parentProps.label) return null;
	var children = parentProps.children;
	var parentViewBox = parseViewBox(parentProps);
	var explicitChildren = findAllByType(children, Label).map(function(child, index) {
		return /*#__PURE__*/ (0, import_react.cloneElement)(child, {
			viewBox: viewBox || parentViewBox,
			key: "label-".concat(index)
		});
	});
	if (!checkPropsLabel) return explicitChildren;
	return [parseLabel(parentProps.label, viewBox || parentViewBox)].concat(_toConsumableArray$3(explicitChildren));
};
Label.parseViewBox = parseViewBox;
Label.renderCallByParent = renderCallByParent$1;
//#endregion
//#region node_modules/recharts/es6/component/LabelList.js
function _typeof$23(o) {
	"@babel/helpers - typeof";
	return _typeof$23 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$23(o);
}
var _excluded$8 = ["valueAccessor"], _excluded2$4 = [
	"data",
	"dataKey",
	"clockWise",
	"id",
	"textBreakAll"
];
function _toConsumableArray$2(arr) {
	return _arrayWithoutHoles$2(arr) || _iterableToArray$2(arr) || _unsupportedIterableToArray$5(arr) || _nonIterableSpread$2();
}
function _nonIterableSpread$2() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$5(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$5(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$5(o, minLen);
}
function _iterableToArray$2(iter) {
	if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles$2(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray$5(arr);
}
function _arrayLikeToArray$5(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _extends$18() {
	_extends$18 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$18.apply(this, arguments);
}
function ownKeys$20(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$20(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$20(Object(t), !0).forEach(function(r) {
			_defineProperty$23(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$20(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$23(obj, key, value) {
	key = _toPropertyKey$23(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$23(t) {
	var i = _toPrimitive$23(t, "string");
	return "symbol" == _typeof$23(i) ? i : i + "";
}
function _toPrimitive$23(t, r) {
	if ("object" != _typeof$23(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$23(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties$8(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$8(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$8(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var defaultAccessor = function defaultAccessor(entry) {
	return Array.isArray(entry.value) ? (0, import_last.default)(entry.value) : entry.value;
};
function LabelList(_ref) {
	var _ref$valueAccessor = _ref.valueAccessor, valueAccessor = _ref$valueAccessor === void 0 ? defaultAccessor : _ref$valueAccessor, restProps = _objectWithoutProperties$8(_ref, _excluded$8);
	var data = restProps.data, dataKey = restProps.dataKey, clockWise = restProps.clockWise, id = restProps.id, textBreakAll = restProps.textBreakAll, others = _objectWithoutProperties$8(restProps, _excluded2$4);
	if (!data || !data.length) return null;
	return /*#__PURE__*/ import_react.createElement(Layer, { className: "recharts-label-list" }, data.map(function(entry, index) {
		var value = (0, import_isNil.default)(dataKey) ? valueAccessor(entry, index) : getValueByDataKey(entry && entry.payload, dataKey);
		var idProps = (0, import_isNil.default)(id) ? {} : { id: "".concat(id, "-").concat(index) };
		return /*#__PURE__*/ import_react.createElement(Label, _extends$18({}, filterProps(entry, true), others, idProps, {
			parentViewBox: entry.parentViewBox,
			value,
			textBreakAll,
			viewBox: Label.parseViewBox((0, import_isNil.default)(clockWise) ? entry : _objectSpread$20(_objectSpread$20({}, entry), {}, { clockWise })),
			key: "label-".concat(index),
			index
		}));
	}));
}
LabelList.displayName = "LabelList";
function parseLabelList(label, data) {
	if (!label) return null;
	if (label === true) return /*#__PURE__*/ import_react.createElement(LabelList, {
		key: "labelList-implicit",
		data
	});
	if (/*#__PURE__*/ import_react.isValidElement(label) || (0, import_isFunction.default)(label)) return /*#__PURE__*/ import_react.createElement(LabelList, {
		key: "labelList-implicit",
		data,
		content: label
	});
	if ((0, import_isObject.default)(label)) return /*#__PURE__*/ import_react.createElement(LabelList, _extends$18({ data }, label, { key: "labelList-implicit" }));
	return null;
}
function renderCallByParent(parentProps, data) {
	var checkPropsLabel = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
	if (!parentProps || !parentProps.children && checkPropsLabel && !parentProps.label) return null;
	var children = parentProps.children;
	var explicitChildren = findAllByType(children, LabelList).map(function(child, index) {
		return /*#__PURE__*/ (0, import_react.cloneElement)(child, {
			data,
			key: "labelList-".concat(index)
		});
	});
	if (!checkPropsLabel) return explicitChildren;
	return [parseLabelList(parentProps.label, data)].concat(_toConsumableArray$2(explicitChildren));
}
LabelList.renderCallByParent = renderCallByParent;
//#endregion
//#region node_modules/recharts/es6/shape/Rectangle.js
var import_isPlainObject = /* @__PURE__ */ __toESM(require_isPlainObject());
var import_isBoolean = /* @__PURE__ */ __toESM(require_isBoolean());
/**
* @fileOverview Rectangle
*/
function _typeof$22(o) {
	"@babel/helpers - typeof";
	return _typeof$22 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$22(o);
}
function _extends$17() {
	_extends$17 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$17.apply(this, arguments);
}
function _slicedToArray$3(arr, i) {
	return _arrayWithHoles$3(arr) || _iterableToArrayLimit$3(arr, i) || _unsupportedIterableToArray$4(arr, i) || _nonIterableRest$3();
}
function _nonIterableRest$3() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$4(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$4(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen);
}
function _arrayLikeToArray$4(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _iterableToArrayLimit$3(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayWithHoles$3(arr) {
	if (Array.isArray(arr)) return arr;
}
function ownKeys$19(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$19(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$19(Object(t), !0).forEach(function(r) {
			_defineProperty$22(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$19(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$22(obj, key, value) {
	key = _toPropertyKey$22(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$22(t) {
	var i = _toPrimitive$22(t, "string");
	return "symbol" == _typeof$22(i) ? i : i + "";
}
function _toPrimitive$22(t, r) {
	if ("object" != _typeof$22(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$22(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var getRectanglePath = function getRectanglePath(x, y, width, height, radius) {
	var maxRadius = Math.min(Math.abs(width) / 2, Math.abs(height) / 2);
	var ySign = height >= 0 ? 1 : -1;
	var xSign = width >= 0 ? 1 : -1;
	var clockWise = height >= 0 && width >= 0 || height < 0 && width < 0 ? 1 : 0;
	var path;
	if (maxRadius > 0 && radius instanceof Array) {
		var newRadius = [
			0,
			0,
			0,
			0
		];
		for (var i = 0, len = 4; i < len; i++) newRadius[i] = radius[i] > maxRadius ? maxRadius : radius[i];
		path = "M".concat(x, ",").concat(y + ySign * newRadius[0]);
		if (newRadius[0] > 0) path += "A ".concat(newRadius[0], ",").concat(newRadius[0], ",0,0,").concat(clockWise, ",").concat(x + xSign * newRadius[0], ",").concat(y);
		path += "L ".concat(x + width - xSign * newRadius[1], ",").concat(y);
		if (newRadius[1] > 0) path += "A ".concat(newRadius[1], ",").concat(newRadius[1], ",0,0,").concat(clockWise, ",\n        ").concat(x + width, ",").concat(y + ySign * newRadius[1]);
		path += "L ".concat(x + width, ",").concat(y + height - ySign * newRadius[2]);
		if (newRadius[2] > 0) path += "A ".concat(newRadius[2], ",").concat(newRadius[2], ",0,0,").concat(clockWise, ",\n        ").concat(x + width - xSign * newRadius[2], ",").concat(y + height);
		path += "L ".concat(x + xSign * newRadius[3], ",").concat(y + height);
		if (newRadius[3] > 0) path += "A ".concat(newRadius[3], ",").concat(newRadius[3], ",0,0,").concat(clockWise, ",\n        ").concat(x, ",").concat(y + height - ySign * newRadius[3]);
		path += "Z";
	} else if (maxRadius > 0 && radius === +radius && radius > 0) {
		var _newRadius = Math.min(maxRadius, radius);
		path = "M ".concat(x, ",").concat(y + ySign * _newRadius, "\n            A ").concat(_newRadius, ",").concat(_newRadius, ",0,0,").concat(clockWise, ",").concat(x + xSign * _newRadius, ",").concat(y, "\n            L ").concat(x + width - xSign * _newRadius, ",").concat(y, "\n            A ").concat(_newRadius, ",").concat(_newRadius, ",0,0,").concat(clockWise, ",").concat(x + width, ",").concat(y + ySign * _newRadius, "\n            L ").concat(x + width, ",").concat(y + height - ySign * _newRadius, "\n            A ").concat(_newRadius, ",").concat(_newRadius, ",0,0,").concat(clockWise, ",").concat(x + width - xSign * _newRadius, ",").concat(y + height, "\n            L ").concat(x + xSign * _newRadius, ",").concat(y + height, "\n            A ").concat(_newRadius, ",").concat(_newRadius, ",0,0,").concat(clockWise, ",").concat(x, ",").concat(y + height - ySign * _newRadius, " Z");
	} else path = "M ".concat(x, ",").concat(y, " h ").concat(width, " v ").concat(height, " h ").concat(-width, " Z");
	return path;
};
var isInRectangle = function isInRectangle(point, rect) {
	if (!point || !rect) return false;
	var px = point.x, py = point.y;
	var x = rect.x, y = rect.y, width = rect.width, height = rect.height;
	if (Math.abs(width) > 0 && Math.abs(height) > 0) {
		var minX = Math.min(x, x + width);
		var maxX = Math.max(x, x + width);
		var minY = Math.min(y, y + height);
		var maxY = Math.max(y, y + height);
		return px >= minX && px <= maxX && py >= minY && py <= maxY;
	}
	return false;
};
var defaultProps$3 = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	radius: 0,
	isAnimationActive: false,
	isUpdateAnimationActive: false,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease"
};
var Rectangle = function Rectangle(rectangleProps) {
	var props = _objectSpread$19(_objectSpread$19({}, defaultProps$3), rectangleProps);
	var pathRef = (0, import_react.useRef)();
	var _useState2 = _slicedToArray$3((0, import_react.useState)(-1), 2), totalLength = _useState2[0], setTotalLength = _useState2[1];
	(0, import_react.useEffect)(function() {
		if (pathRef.current && pathRef.current.getTotalLength) try {
			var pathTotalLength = pathRef.current.getTotalLength();
			if (pathTotalLength) setTotalLength(pathTotalLength);
		} catch (err) {}
	}, []);
	var x = props.x, y = props.y, width = props.width, height = props.height, radius = props.radius, className = props.className;
	var animationEasing = props.animationEasing, animationDuration = props.animationDuration, animationBegin = props.animationBegin, isAnimationActive = props.isAnimationActive, isUpdateAnimationActive = props.isUpdateAnimationActive;
	if (x !== +x || y !== +y || width !== +width || height !== +height || width === 0 || height === 0) return null;
	var layerClass = clsx("recharts-rectangle", className);
	if (!isUpdateAnimationActive) return /*#__PURE__*/ import_react.createElement("path", _extends$17({}, filterProps(props, true), {
		className: layerClass,
		d: getRectanglePath(x, y, width, height, radius)
	}));
	return /*#__PURE__*/ import_react.createElement(es6_default, {
		canBegin: totalLength > 0,
		from: {
			width,
			height,
			x,
			y
		},
		to: {
			width,
			height,
			x,
			y
		},
		duration: animationDuration,
		animationEasing,
		isActive: isUpdateAnimationActive
	}, function(_ref) {
		var currWidth = _ref.width, currHeight = _ref.height, currX = _ref.x, currY = _ref.y;
		return /*#__PURE__*/ import_react.createElement(es6_default, {
			canBegin: totalLength > 0,
			from: "0px ".concat(totalLength === -1 ? 1 : totalLength, "px"),
			to: "".concat(totalLength, "px 0px"),
			attributeName: "strokeDasharray",
			begin: animationBegin,
			duration: animationDuration,
			isActive: isAnimationActive,
			easing: animationEasing
		}, /*#__PURE__*/ import_react.createElement("path", _extends$17({}, filterProps(props, true), {
			className: layerClass,
			d: getRectanglePath(currX, currY, currWidth, currHeight, radius),
			ref: pathRef
		})));
	});
};
//#endregion
//#region node_modules/recharts/es6/shape/Trapezoid.js
/**
* @fileOverview Rectangle
*/
function _typeof$21(o) {
	"@babel/helpers - typeof";
	return _typeof$21 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$21(o);
}
function _extends$16() {
	_extends$16 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$16.apply(this, arguments);
}
function _slicedToArray$2(arr, i) {
	return _arrayWithHoles$2(arr) || _iterableToArrayLimit$2(arr, i) || _unsupportedIterableToArray$3(arr, i) || _nonIterableRest$2();
}
function _nonIterableRest$2() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$3(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$3(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen);
}
function _arrayLikeToArray$3(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _iterableToArrayLimit$2(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayWithHoles$2(arr) {
	if (Array.isArray(arr)) return arr;
}
function ownKeys$18(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$18(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$18(Object(t), !0).forEach(function(r) {
			_defineProperty$21(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$18(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$21(obj, key, value) {
	key = _toPropertyKey$21(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$21(t) {
	var i = _toPrimitive$21(t, "string");
	return "symbol" == _typeof$21(i) ? i : i + "";
}
function _toPrimitive$21(t, r) {
	if ("object" != _typeof$21(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$21(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var getTrapezoidPath = function getTrapezoidPath(x, y, upperWidth, lowerWidth, height) {
	var widthGap = upperWidth - lowerWidth;
	var path = "M ".concat(x, ",").concat(y);
	path += "L ".concat(x + upperWidth, ",").concat(y);
	path += "L ".concat(x + upperWidth - widthGap / 2, ",").concat(y + height);
	path += "L ".concat(x + upperWidth - widthGap / 2 - lowerWidth, ",").concat(y + height);
	path += "L ".concat(x, ",").concat(y, " Z");
	return path;
};
var defaultProps$2 = {
	x: 0,
	y: 0,
	upperWidth: 0,
	lowerWidth: 0,
	height: 0,
	isUpdateAnimationActive: false,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease"
};
var Trapezoid = function Trapezoid(props) {
	var trapezoidProps = _objectSpread$18(_objectSpread$18({}, defaultProps$2), props);
	var pathRef = (0, import_react.useRef)();
	var _useState2 = _slicedToArray$2((0, import_react.useState)(-1), 2), totalLength = _useState2[0], setTotalLength = _useState2[1];
	(0, import_react.useEffect)(function() {
		if (pathRef.current && pathRef.current.getTotalLength) try {
			var pathTotalLength = pathRef.current.getTotalLength();
			if (pathTotalLength) setTotalLength(pathTotalLength);
		} catch (err) {}
	}, []);
	var x = trapezoidProps.x, y = trapezoidProps.y, upperWidth = trapezoidProps.upperWidth, lowerWidth = trapezoidProps.lowerWidth, height = trapezoidProps.height, className = trapezoidProps.className;
	var animationEasing = trapezoidProps.animationEasing, animationDuration = trapezoidProps.animationDuration, animationBegin = trapezoidProps.animationBegin, isUpdateAnimationActive = trapezoidProps.isUpdateAnimationActive;
	if (x !== +x || y !== +y || upperWidth !== +upperWidth || lowerWidth !== +lowerWidth || height !== +height || upperWidth === 0 && lowerWidth === 0 || height === 0) return null;
	var layerClass = clsx("recharts-trapezoid", className);
	if (!isUpdateAnimationActive) return /*#__PURE__*/ import_react.createElement("g", null, /*#__PURE__*/ import_react.createElement("path", _extends$16({}, filterProps(trapezoidProps, true), {
		className: layerClass,
		d: getTrapezoidPath(x, y, upperWidth, lowerWidth, height)
	})));
	return /*#__PURE__*/ import_react.createElement(es6_default, {
		canBegin: totalLength > 0,
		from: {
			upperWidth: 0,
			lowerWidth: 0,
			height,
			x,
			y
		},
		to: {
			upperWidth,
			lowerWidth,
			height,
			x,
			y
		},
		duration: animationDuration,
		animationEasing,
		isActive: isUpdateAnimationActive
	}, function(_ref) {
		var currUpperWidth = _ref.upperWidth, currLowerWidth = _ref.lowerWidth, currHeight = _ref.height, currX = _ref.x, currY = _ref.y;
		return /*#__PURE__*/ import_react.createElement(es6_default, {
			canBegin: totalLength > 0,
			from: "0px ".concat(totalLength === -1 ? 1 : totalLength, "px"),
			to: "".concat(totalLength, "px 0px"),
			attributeName: "strokeDasharray",
			begin: animationBegin,
			duration: animationDuration,
			easing: animationEasing
		}, /*#__PURE__*/ import_react.createElement("path", _extends$16({}, filterProps(trapezoidProps, true), {
			className: layerClass,
			d: getTrapezoidPath(currX, currY, currUpperWidth, currLowerWidth, currHeight),
			ref: pathRef
		})));
	});
};
//#endregion
//#region node_modules/recharts/es6/shape/Sector.js
/**
* @fileOverview Sector
*/
function _typeof$20(o) {
	"@babel/helpers - typeof";
	return _typeof$20 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$20(o);
}
function _extends$15() {
	_extends$15 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$15.apply(this, arguments);
}
function ownKeys$17(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$17(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$17(Object(t), !0).forEach(function(r) {
			_defineProperty$20(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$17(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$20(obj, key, value) {
	key = _toPropertyKey$20(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$20(t) {
	var i = _toPrimitive$20(t, "string");
	return "symbol" == _typeof$20(i) ? i : i + "";
}
function _toPrimitive$20(t, r) {
	if ("object" != _typeof$20(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$20(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var getDeltaAngle = function getDeltaAngle(startAngle, endAngle) {
	return mathSign(endAngle - startAngle) * Math.min(Math.abs(endAngle - startAngle), 359.999);
};
var getTangentCircle = function getTangentCircle(_ref) {
	var cx = _ref.cx, cy = _ref.cy, radius = _ref.radius, angle = _ref.angle, sign = _ref.sign, isExternal = _ref.isExternal, cornerRadius = _ref.cornerRadius, cornerIsExternal = _ref.cornerIsExternal;
	var centerRadius = cornerRadius * (isExternal ? 1 : -1) + radius;
	var theta = Math.asin(cornerRadius / centerRadius) / RADIAN;
	var centerAngle = cornerIsExternal ? angle : angle + sign * theta;
	var center = polarToCartesian(cx, cy, centerRadius, centerAngle);
	var circleTangency = polarToCartesian(cx, cy, radius, centerAngle);
	var lineTangencyAngle = cornerIsExternal ? angle - sign * theta : angle;
	return {
		center,
		circleTangency,
		lineTangency: polarToCartesian(cx, cy, centerRadius * Math.cos(theta * RADIAN), lineTangencyAngle),
		theta
	};
};
var getSectorPath = function getSectorPath(_ref2) {
	var cx = _ref2.cx, cy = _ref2.cy, innerRadius = _ref2.innerRadius, outerRadius = _ref2.outerRadius, startAngle = _ref2.startAngle, endAngle = _ref2.endAngle;
	var angle = getDeltaAngle(startAngle, endAngle);
	var tempEndAngle = startAngle + angle;
	var outerStartPoint = polarToCartesian(cx, cy, outerRadius, startAngle);
	var outerEndPoint = polarToCartesian(cx, cy, outerRadius, tempEndAngle);
	var path = "M ".concat(outerStartPoint.x, ",").concat(outerStartPoint.y, "\n    A ").concat(outerRadius, ",").concat(outerRadius, ",0,\n    ").concat(+(Math.abs(angle) > 180), ",").concat(+(startAngle > tempEndAngle), ",\n    ").concat(outerEndPoint.x, ",").concat(outerEndPoint.y, "\n  ");
	if (innerRadius > 0) {
		var innerStartPoint = polarToCartesian(cx, cy, innerRadius, startAngle);
		var innerEndPoint = polarToCartesian(cx, cy, innerRadius, tempEndAngle);
		path += "L ".concat(innerEndPoint.x, ",").concat(innerEndPoint.y, "\n            A ").concat(innerRadius, ",").concat(innerRadius, ",0,\n            ").concat(+(Math.abs(angle) > 180), ",").concat(+(startAngle <= tempEndAngle), ",\n            ").concat(innerStartPoint.x, ",").concat(innerStartPoint.y, " Z");
	} else path += "L ".concat(cx, ",").concat(cy, " Z");
	return path;
};
var getSectorWithCorner = function getSectorWithCorner(_ref3) {
	var cx = _ref3.cx, cy = _ref3.cy, innerRadius = _ref3.innerRadius, outerRadius = _ref3.outerRadius, cornerRadius = _ref3.cornerRadius, forceCornerRadius = _ref3.forceCornerRadius, cornerIsExternal = _ref3.cornerIsExternal, startAngle = _ref3.startAngle, endAngle = _ref3.endAngle;
	var sign = mathSign(endAngle - startAngle);
	var _getTangentCircle = getTangentCircle({
		cx,
		cy,
		radius: outerRadius,
		angle: startAngle,
		sign,
		cornerRadius,
		cornerIsExternal
	}), soct = _getTangentCircle.circleTangency, solt = _getTangentCircle.lineTangency, sot = _getTangentCircle.theta;
	var _getTangentCircle2 = getTangentCircle({
		cx,
		cy,
		radius: outerRadius,
		angle: endAngle,
		sign: -sign,
		cornerRadius,
		cornerIsExternal
	}), eoct = _getTangentCircle2.circleTangency, eolt = _getTangentCircle2.lineTangency, eot = _getTangentCircle2.theta;
	var outerArcAngle = cornerIsExternal ? Math.abs(startAngle - endAngle) : Math.abs(startAngle - endAngle) - sot - eot;
	if (outerArcAngle < 0) {
		if (forceCornerRadius) return "M ".concat(solt.x, ",").concat(solt.y, "\n        a").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,1,").concat(cornerRadius * 2, ",0\n        a").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,1,").concat(-cornerRadius * 2, ",0\n      ");
		return getSectorPath({
			cx,
			cy,
			innerRadius,
			outerRadius,
			startAngle,
			endAngle
		});
	}
	var path = "M ".concat(solt.x, ",").concat(solt.y, "\n    A").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,").concat(+(sign < 0), ",").concat(soct.x, ",").concat(soct.y, "\n    A").concat(outerRadius, ",").concat(outerRadius, ",0,").concat(+(outerArcAngle > 180), ",").concat(+(sign < 0), ",").concat(eoct.x, ",").concat(eoct.y, "\n    A").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,").concat(+(sign < 0), ",").concat(eolt.x, ",").concat(eolt.y, "\n  ");
	if (innerRadius > 0) {
		var _getTangentCircle3 = getTangentCircle({
			cx,
			cy,
			radius: innerRadius,
			angle: startAngle,
			sign,
			isExternal: true,
			cornerRadius,
			cornerIsExternal
		}), sict = _getTangentCircle3.circleTangency, silt = _getTangentCircle3.lineTangency, sit = _getTangentCircle3.theta;
		var _getTangentCircle4 = getTangentCircle({
			cx,
			cy,
			radius: innerRadius,
			angle: endAngle,
			sign: -sign,
			isExternal: true,
			cornerRadius,
			cornerIsExternal
		}), eict = _getTangentCircle4.circleTangency, eilt = _getTangentCircle4.lineTangency, eit = _getTangentCircle4.theta;
		var innerArcAngle = cornerIsExternal ? Math.abs(startAngle - endAngle) : Math.abs(startAngle - endAngle) - sit - eit;
		if (innerArcAngle < 0 && cornerRadius === 0) return "".concat(path, "L").concat(cx, ",").concat(cy, "Z");
		path += "L".concat(eilt.x, ",").concat(eilt.y, "\n      A").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,").concat(+(sign < 0), ",").concat(eict.x, ",").concat(eict.y, "\n      A").concat(innerRadius, ",").concat(innerRadius, ",0,").concat(+(innerArcAngle > 180), ",").concat(+(sign > 0), ",").concat(sict.x, ",").concat(sict.y, "\n      A").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,").concat(+(sign < 0), ",").concat(silt.x, ",").concat(silt.y, "Z");
	} else path += "L".concat(cx, ",").concat(cy, "Z");
	return path;
};
var defaultProps$1 = {
	cx: 0,
	cy: 0,
	innerRadius: 0,
	outerRadius: 0,
	startAngle: 0,
	endAngle: 0,
	cornerRadius: 0,
	forceCornerRadius: false,
	cornerIsExternal: false
};
var Sector = function Sector(sectorProps) {
	var props = _objectSpread$17(_objectSpread$17({}, defaultProps$1), sectorProps);
	var cx = props.cx, cy = props.cy, innerRadius = props.innerRadius, outerRadius = props.outerRadius, cornerRadius = props.cornerRadius, forceCornerRadius = props.forceCornerRadius, cornerIsExternal = props.cornerIsExternal, startAngle = props.startAngle, endAngle = props.endAngle, className = props.className;
	if (outerRadius < innerRadius || startAngle === endAngle) return null;
	var layerClass = clsx("recharts-sector", className);
	var deltaRadius = outerRadius - innerRadius;
	var cr = getPercentValue(cornerRadius, deltaRadius, 0, true);
	var path;
	if (cr > 0 && Math.abs(startAngle - endAngle) < 360) path = getSectorWithCorner({
		cx,
		cy,
		innerRadius,
		outerRadius,
		cornerRadius: Math.min(cr, deltaRadius / 2),
		forceCornerRadius,
		cornerIsExternal,
		startAngle,
		endAngle
	});
	else path = getSectorPath({
		cx,
		cy,
		innerRadius,
		outerRadius,
		startAngle,
		endAngle
	});
	return /*#__PURE__*/ import_react.createElement("path", _extends$15({}, filterProps(props, true), {
		className: layerClass,
		d: path,
		role: "img"
	}));
};
//#endregion
//#region node_modules/recharts/es6/util/ActiveShapeUtils.js
var _excluded$7 = [
	"option",
	"shapeType",
	"propTransformer",
	"activeClassName",
	"isActive"
];
function _typeof$19(o) {
	"@babel/helpers - typeof";
	return _typeof$19 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$19(o);
}
function _objectWithoutProperties$7(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$7(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$7(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function ownKeys$16(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$16(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$16(Object(t), !0).forEach(function(r) {
			_defineProperty$19(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$16(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$19(obj, key, value) {
	key = _toPropertyKey$19(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$19(t) {
	var i = _toPrimitive$19(t, "string");
	return "symbol" == _typeof$19(i) ? i : i + "";
}
function _toPrimitive$19(t, r) {
	if ("object" != _typeof$19(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$19(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
/**
* This is an abstraction for rendering a user defined prop for a customized shape in several forms.
*
* <Shape /> is the root and will handle taking in:
*  - an object of svg properties
*  - a boolean
*  - a render prop(inline function that returns jsx)
*  - a react element
*
* <ShapeSelector /> is a subcomponent of <Shape /> and used to match a component
* to the value of props.shapeType that is passed to the root.
*
*/
function defaultPropTransformer(option, props) {
	return _objectSpread$16(_objectSpread$16({}, props), option);
}
function isSymbolsProps(shapeType, _elementProps) {
	return shapeType === "symbols";
}
function ShapeSelector(_ref) {
	var shapeType = _ref.shapeType, elementProps = _ref.elementProps;
	switch (shapeType) {
		case "rectangle": return /*#__PURE__*/ import_react.createElement(Rectangle, elementProps);
		case "trapezoid": return /*#__PURE__*/ import_react.createElement(Trapezoid, elementProps);
		case "sector": return /*#__PURE__*/ import_react.createElement(Sector, elementProps);
		case "symbols":
			if (isSymbolsProps(shapeType, elementProps)) return /*#__PURE__*/ import_react.createElement(Symbols, elementProps);
			break;
		default: return null;
	}
}
function getPropsFromShapeOption(option) {
	if (/*#__PURE__*/ (0, import_react.isValidElement)(option)) return option.props;
	return option;
}
function Shape(_ref2) {
	var option = _ref2.option, shapeType = _ref2.shapeType, _ref2$propTransformer = _ref2.propTransformer, propTransformer = _ref2$propTransformer === void 0 ? defaultPropTransformer : _ref2$propTransformer, _ref2$activeClassName = _ref2.activeClassName, activeClassName = _ref2$activeClassName === void 0 ? "recharts-active-shape" : _ref2$activeClassName, isActive = _ref2.isActive, props = _objectWithoutProperties$7(_ref2, _excluded$7);
	var shape;
	if (/*#__PURE__*/ (0, import_react.isValidElement)(option)) shape = /*#__PURE__*/ (0, import_react.cloneElement)(option, _objectSpread$16(_objectSpread$16({}, props), getPropsFromShapeOption(option)));
	else if ((0, import_isFunction.default)(option)) shape = option(props);
	else if ((0, import_isPlainObject.default)(option) && !(0, import_isBoolean.default)(option)) {
		var nextProps = propTransformer(option, props);
		shape = /*#__PURE__*/ import_react.createElement(ShapeSelector, {
			shapeType,
			elementProps: nextProps
		});
	} else {
		var elementProps = props;
		shape = /*#__PURE__*/ import_react.createElement(ShapeSelector, {
			shapeType,
			elementProps
		});
	}
	if (isActive) return /*#__PURE__*/ import_react.createElement(Layer, { className: activeClassName }, shape);
	return shape;
}
/**
* This is an abstraction to handle identifying the active index from a tooltip mouse interaction
*/
function isFunnel(graphicalItem, _item) {
	return _item != null && "trapezoids" in graphicalItem.props;
}
function isPie(graphicalItem, _item) {
	return _item != null && "sectors" in graphicalItem.props;
}
function isScatter(graphicalItem, _item) {
	return _item != null && "points" in graphicalItem.props;
}
function compareFunnel(shapeData, activeTooltipItem) {
	var _activeTooltipItem$la, _activeTooltipItem$la2;
	var xMatches = shapeData.x === (activeTooltipItem === null || activeTooltipItem === void 0 || (_activeTooltipItem$la = activeTooltipItem.labelViewBox) === null || _activeTooltipItem$la === void 0 ? void 0 : _activeTooltipItem$la.x) || shapeData.x === activeTooltipItem.x;
	var yMatches = shapeData.y === (activeTooltipItem === null || activeTooltipItem === void 0 || (_activeTooltipItem$la2 = activeTooltipItem.labelViewBox) === null || _activeTooltipItem$la2 === void 0 ? void 0 : _activeTooltipItem$la2.y) || shapeData.y === activeTooltipItem.y;
	return xMatches && yMatches;
}
function comparePie(shapeData, activeTooltipItem) {
	var startAngleMatches = shapeData.endAngle === activeTooltipItem.endAngle;
	var endAngleMatches = shapeData.startAngle === activeTooltipItem.startAngle;
	return startAngleMatches && endAngleMatches;
}
function compareScatter(shapeData, activeTooltipItem) {
	var xMatches = shapeData.x === activeTooltipItem.x;
	var yMatches = shapeData.y === activeTooltipItem.y;
	var zMatches = shapeData.z === activeTooltipItem.z;
	return xMatches && yMatches && zMatches;
}
function getComparisonFn(graphicalItem, activeItem) {
	var comparison;
	if (isFunnel(graphicalItem, activeItem)) comparison = compareFunnel;
	else if (isPie(graphicalItem, activeItem)) comparison = comparePie;
	else if (isScatter(graphicalItem, activeItem)) comparison = compareScatter;
	return comparison;
}
function getShapeDataKey(graphicalItem, activeItem) {
	var shapeKey;
	if (isFunnel(graphicalItem, activeItem)) shapeKey = "trapezoids";
	else if (isPie(graphicalItem, activeItem)) shapeKey = "sectors";
	else if (isScatter(graphicalItem, activeItem)) shapeKey = "points";
	return shapeKey;
}
function getActiveShapeTooltipPayload(graphicalItem, activeItem) {
	if (isFunnel(graphicalItem, activeItem)) {
		var _activeItem$tooltipPa;
		return (_activeItem$tooltipPa = activeItem.tooltipPayload) === null || _activeItem$tooltipPa === void 0 || (_activeItem$tooltipPa = _activeItem$tooltipPa[0]) === null || _activeItem$tooltipPa === void 0 || (_activeItem$tooltipPa = _activeItem$tooltipPa.payload) === null || _activeItem$tooltipPa === void 0 ? void 0 : _activeItem$tooltipPa.payload;
	}
	if (isPie(graphicalItem, activeItem)) {
		var _activeItem$tooltipPa2;
		return (_activeItem$tooltipPa2 = activeItem.tooltipPayload) === null || _activeItem$tooltipPa2 === void 0 || (_activeItem$tooltipPa2 = _activeItem$tooltipPa2[0]) === null || _activeItem$tooltipPa2 === void 0 || (_activeItem$tooltipPa2 = _activeItem$tooltipPa2.payload) === null || _activeItem$tooltipPa2 === void 0 ? void 0 : _activeItem$tooltipPa2.payload;
	}
	if (isScatter(graphicalItem, activeItem)) return activeItem.payload;
	return {};
}
/**
*
* @param {GetActiveShapeIndexForTooltip} arg an object of incoming attributes from Tooltip
* @returns {number}
*
* To handle possible duplicates in the data set,
* match both the data value of the active item to a data value on a graph item,
* and match the mouse coordinates of the active item to the coordinates of in a particular components shape data.
* This assumes equal lengths of shape objects to data items.
*/
function getActiveShapeIndexForTooltip(_ref3) {
	var activeTooltipItem = _ref3.activeTooltipItem, graphicalItem = _ref3.graphicalItem, itemData = _ref3.itemData;
	var shapeKey = getShapeDataKey(graphicalItem, activeTooltipItem);
	var tooltipPayload = getActiveShapeTooltipPayload(graphicalItem, activeTooltipItem);
	var activeItemMatches = itemData.filter(function(datum, dataIndex) {
		var valuesMatch = (0, import_isEqual.default)(tooltipPayload, datum);
		var mouseCoordinateMatches = graphicalItem.props[shapeKey].filter(function(shapeData) {
			return getComparisonFn(graphicalItem, activeTooltipItem)(shapeData, activeTooltipItem);
		});
		var coordinatesMatch = dataIndex === graphicalItem.props[shapeKey].indexOf(mouseCoordinateMatches[mouseCoordinateMatches.length - 1]);
		return valuesMatch && coordinatesMatch;
	});
	return itemData.indexOf(activeItemMatches[activeItemMatches.length - 1]);
}
//#endregion
//#region node_modules/recharts/es6/util/BarUtils.js
var _excluded$6 = ["x", "y"];
function _typeof$18(o) {
	"@babel/helpers - typeof";
	return _typeof$18 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$18(o);
}
function _extends$14() {
	_extends$14 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$14.apply(this, arguments);
}
function ownKeys$15(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$15(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$15(Object(t), !0).forEach(function(r) {
			_defineProperty$18(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$15(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$18(obj, key, value) {
	key = _toPropertyKey$18(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$18(t) {
	var i = _toPrimitive$18(t, "string");
	return "symbol" == _typeof$18(i) ? i : i + "";
}
function _toPrimitive$18(t, r) {
	if ("object" != _typeof$18(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$18(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties$6(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$6(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$6(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function typeguardBarRectangleProps(_ref, props) {
	var xProp = _ref.x, yProp = _ref.y, option = _objectWithoutProperties$6(_ref, _excluded$6);
	var xValue = "".concat(xProp);
	var x = parseInt(xValue, 10);
	var yValue = "".concat(yProp);
	var y = parseInt(yValue, 10);
	var heightValue = "".concat(props.height || option.height);
	var height = parseInt(heightValue, 10);
	var widthValue = "".concat(props.width || option.width);
	var width = parseInt(widthValue, 10);
	return _objectSpread$15(_objectSpread$15(_objectSpread$15(_objectSpread$15(_objectSpread$15({}, props), option), x ? { x } : {}), y ? { y } : {}), {}, {
		height,
		width,
		name: props.name,
		radius: props.radius
	});
}
function BarRectangle(props) {
	return /*#__PURE__*/ import_react.createElement(Shape, _extends$14({
		shapeType: "rectangle",
		propTransformer: typeguardBarRectangleProps,
		activeClassName: "recharts-active-bar"
	}, props));
}
/**
* Safely gets minPointSize from from the minPointSize prop if it is a function
* @param minPointSize minPointSize as passed to the Bar component
* @param defaultValue default minPointSize
* @returns minPointSize
*/
var minPointSizeCallback = function minPointSizeCallback(minPointSize) {
	var defaultValue = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
	return function(value, index) {
		if (typeof minPointSize === "number") return minPointSize;
		var isValueNumberOrNil = isNumber(value) || isNullish(value);
		if (isValueNumberOrNil) return minPointSize(value, index);
		!isValueNumberOrNil && invariant(false);
		return defaultValue;
	};
};
//#endregion
//#region node_modules/recharts/es6/cartesian/Bar.js
/**
* @fileOverview Render a group of bar
*/
var _excluded$5 = ["value", "background"];
var _Bar;
function _typeof$17(o) {
	"@babel/helpers - typeof";
	return _typeof$17 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$17(o);
}
function _objectWithoutProperties$5(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$5(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$5(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _extends$13() {
	_extends$13 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$13.apply(this, arguments);
}
function ownKeys$14(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$14(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$14(Object(t), !0).forEach(function(r) {
			_defineProperty$17(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$14(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _classCallCheck$11(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$11(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$17(descriptor.key), descriptor);
	}
}
function _createClass$11(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$11(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$11(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$9(t, o, e) {
	return o = _getPrototypeOf$9(o), _possibleConstructorReturn$9(t, _isNativeReflectConstruct$9() ? Reflect.construct(o, e || [], _getPrototypeOf$9(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$9(self, call) {
	if (call && (_typeof$17(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$9(self);
}
function _assertThisInitialized$9(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$9() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$9 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$9(o) {
	_getPrototypeOf$9 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$9(o);
}
function _inherits$9(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$9(subClass, superClass);
}
function _setPrototypeOf$9(o, p) {
	_setPrototypeOf$9 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$9(o, p);
}
function _defineProperty$17(obj, key, value) {
	key = _toPropertyKey$17(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$17(t) {
	var i = _toPrimitive$17(t, "string");
	return "symbol" == _typeof$17(i) ? i : i + "";
}
function _toPrimitive$17(t, r) {
	if ("object" != _typeof$17(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$17(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var Bar = /*#__PURE__*/ function(_PureComponent) {
	function Bar() {
		var _this;
		_classCallCheck$11(this, Bar);
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		_this = _callSuper$9(this, Bar, [].concat(args));
		_defineProperty$17(_this, "state", { isAnimationFinished: false });
		_defineProperty$17(_this, "id", uniqueId("recharts-bar-"));
		_defineProperty$17(_this, "handleAnimationEnd", function() {
			var onAnimationEnd = _this.props.onAnimationEnd;
			_this.setState({ isAnimationFinished: true });
			if (onAnimationEnd) onAnimationEnd();
		});
		_defineProperty$17(_this, "handleAnimationStart", function() {
			var onAnimationStart = _this.props.onAnimationStart;
			_this.setState({ isAnimationFinished: false });
			if (onAnimationStart) onAnimationStart();
		});
		return _this;
	}
	_inherits$9(Bar, _PureComponent);
	return _createClass$11(Bar, [
		{
			key: "renderRectanglesStatically",
			value: function renderRectanglesStatically(data) {
				var _this2 = this;
				var _this$props = this.props, shape = _this$props.shape, dataKey = _this$props.dataKey, activeIndex = _this$props.activeIndex, activeBar = _this$props.activeBar;
				var baseProps = filterProps(this.props, false);
				return data && data.map(function(entry, i) {
					var isActive = i === activeIndex;
					var option = isActive ? activeBar : shape;
					var props = _objectSpread$14(_objectSpread$14(_objectSpread$14({}, baseProps), entry), {}, {
						isActive,
						option,
						index: i,
						dataKey,
						onAnimationStart: _this2.handleAnimationStart,
						onAnimationEnd: _this2.handleAnimationEnd
					});
					return /*#__PURE__*/ import_react.createElement(Layer, _extends$13({ className: "recharts-bar-rectangle" }, adaptEventsOfChild(_this2.props, entry, i), { key: "rectangle-".concat(entry === null || entry === void 0 ? void 0 : entry.x, "-").concat(entry === null || entry === void 0 ? void 0 : entry.y, "-").concat(entry === null || entry === void 0 ? void 0 : entry.value, "-").concat(i) }), /*#__PURE__*/ import_react.createElement(BarRectangle, props));
				});
			}
		},
		{
			key: "renderRectanglesWithAnimation",
			value: function renderRectanglesWithAnimation() {
				var _this3 = this;
				var _this$props2 = this.props, data = _this$props2.data, layout = _this$props2.layout, isAnimationActive = _this$props2.isAnimationActive, animationBegin = _this$props2.animationBegin, animationDuration = _this$props2.animationDuration, animationEasing = _this$props2.animationEasing, animationId = _this$props2.animationId;
				var prevData = this.state.prevData;
				return /*#__PURE__*/ import_react.createElement(es6_default, {
					begin: animationBegin,
					duration: animationDuration,
					isActive: isAnimationActive,
					easing: animationEasing,
					from: { t: 0 },
					to: { t: 1 },
					key: "bar-".concat(animationId),
					onAnimationEnd: this.handleAnimationEnd,
					onAnimationStart: this.handleAnimationStart
				}, function(_ref) {
					var t = _ref.t;
					var stepData = data.map(function(entry, index) {
						var prev = prevData && prevData[index];
						if (prev) {
							var interpolatorX = interpolateNumber$1(prev.x, entry.x);
							var interpolatorY = interpolateNumber$1(prev.y, entry.y);
							var interpolatorWidth = interpolateNumber$1(prev.width, entry.width);
							var interpolatorHeight = interpolateNumber$1(prev.height, entry.height);
							return _objectSpread$14(_objectSpread$14({}, entry), {}, {
								x: interpolatorX(t),
								y: interpolatorY(t),
								width: interpolatorWidth(t),
								height: interpolatorHeight(t)
							});
						}
						if (layout === "horizontal") {
							var h = interpolateNumber$1(0, entry.height)(t);
							return _objectSpread$14(_objectSpread$14({}, entry), {}, {
								y: entry.y + entry.height - h,
								height: h
							});
						}
						var w = interpolateNumber$1(0, entry.width)(t);
						return _objectSpread$14(_objectSpread$14({}, entry), {}, { width: w });
					});
					return /*#__PURE__*/ import_react.createElement(Layer, null, _this3.renderRectanglesStatically(stepData));
				});
			}
		},
		{
			key: "renderRectangles",
			value: function renderRectangles() {
				var _this$props3 = this.props, data = _this$props3.data, isAnimationActive = _this$props3.isAnimationActive;
				var prevData = this.state.prevData;
				if (isAnimationActive && data && data.length && (!prevData || !(0, import_isEqual.default)(prevData, data))) return this.renderRectanglesWithAnimation();
				return this.renderRectanglesStatically(data);
			}
		},
		{
			key: "renderBackground",
			value: function renderBackground() {
				var _this4 = this;
				var _this$props4 = this.props, data = _this$props4.data, dataKey = _this$props4.dataKey, activeIndex = _this$props4.activeIndex;
				var backgroundProps = filterProps(this.props.background, false);
				return data.map(function(entry, i) {
					entry.value;
					var background = entry.background, rest = _objectWithoutProperties$5(entry, _excluded$5);
					if (!background) return null;
					var props = _objectSpread$14(_objectSpread$14(_objectSpread$14(_objectSpread$14(_objectSpread$14({}, rest), {}, { fill: "#eee" }, background), backgroundProps), adaptEventsOfChild(_this4.props, entry, i)), {}, {
						onAnimationStart: _this4.handleAnimationStart,
						onAnimationEnd: _this4.handleAnimationEnd,
						dataKey,
						index: i,
						className: "recharts-bar-background-rectangle"
					});
					return /*#__PURE__*/ import_react.createElement(BarRectangle, _extends$13({
						key: "background-bar-".concat(i),
						option: _this4.props.background,
						isActive: i === activeIndex
					}, props));
				});
			}
		},
		{
			key: "renderErrorBar",
			value: function renderErrorBar(needClip, clipPathId) {
				if (this.props.isAnimationActive && !this.state.isAnimationFinished) return null;
				var _this$props5 = this.props, data = _this$props5.data, xAxis = _this$props5.xAxis, yAxis = _this$props5.yAxis, layout = _this$props5.layout, children = _this$props5.children;
				var errorBarItems = findAllByType(children, ErrorBar);
				if (!errorBarItems) return null;
				var offset = layout === "vertical" ? data[0].height / 2 : data[0].width / 2;
				var dataPointFormatter = function dataPointFormatter(dataPoint, dataKey) {
					/**
					* if the value coming from `getComposedData` is an array then this is a stacked bar chart.
					* arr[1] represents end value of the bar since the data is in the form of [startValue, endValue].
					* */
					var value = Array.isArray(dataPoint.value) ? dataPoint.value[1] : dataPoint.value;
					return {
						x: dataPoint.x,
						y: dataPoint.y,
						value,
						errorVal: getValueByDataKey(dataPoint, dataKey)
					};
				};
				var errorBarProps = { clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null };
				return /*#__PURE__*/ import_react.createElement(Layer, errorBarProps, errorBarItems.map(function(item) {
					return /*#__PURE__*/ import_react.cloneElement(item, {
						key: "error-bar-".concat(clipPathId, "-").concat(item.props.dataKey),
						data,
						xAxis,
						yAxis,
						layout,
						offset,
						dataPointFormatter
					});
				}));
			}
		},
		{
			key: "render",
			value: function render() {
				var _this$props6 = this.props, hide = _this$props6.hide, data = _this$props6.data, className = _this$props6.className, xAxis = _this$props6.xAxis, yAxis = _this$props6.yAxis, left = _this$props6.left, top = _this$props6.top, width = _this$props6.width, height = _this$props6.height, isAnimationActive = _this$props6.isAnimationActive, background = _this$props6.background, id = _this$props6.id;
				if (hide || !data || !data.length) return null;
				var isAnimationFinished = this.state.isAnimationFinished;
				var layerClass = clsx("recharts-bar", className);
				var needClipX = xAxis && xAxis.allowDataOverflow;
				var needClipY = yAxis && yAxis.allowDataOverflow;
				var needClip = needClipX || needClipY;
				var clipPathId = (0, import_isNil.default)(id) ? this.id : id;
				return /*#__PURE__*/ import_react.createElement(Layer, { className: layerClass }, needClipX || needClipY ? /*#__PURE__*/ import_react.createElement("defs", null, /*#__PURE__*/ import_react.createElement("clipPath", { id: "clipPath-".concat(clipPathId) }, /*#__PURE__*/ import_react.createElement("rect", {
					x: needClipX ? left : left - width / 2,
					y: needClipY ? top : top - height / 2,
					width: needClipX ? width : width * 2,
					height: needClipY ? height : height * 2
				}))) : null, /*#__PURE__*/ import_react.createElement(Layer, {
					className: "recharts-bar-rectangles",
					clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null
				}, background ? this.renderBackground() : null, this.renderRectangles()), this.renderErrorBar(needClip, clipPathId), (!isAnimationActive || isAnimationFinished) && LabelList.renderCallByParent(this.props, data));
			}
		}
	], [{
		key: "getDerivedStateFromProps",
		value: function getDerivedStateFromProps(nextProps, prevState) {
			if (nextProps.animationId !== prevState.prevAnimationId) return {
				prevAnimationId: nextProps.animationId,
				curData: nextProps.data,
				prevData: prevState.curData
			};
			if (nextProps.data !== prevState.curData) return { curData: nextProps.data };
			return null;
		}
	}]);
}(import_react.PureComponent);
_Bar = Bar;
_defineProperty$17(Bar, "displayName", "Bar");
_defineProperty$17(Bar, "defaultProps", {
	xAxisId: 0,
	yAxisId: 0,
	legendType: "rect",
	minPointSize: 0,
	hide: false,
	data: [],
	layout: "vertical",
	activeBar: false,
	isAnimationActive: !Global.isSsr,
	animationBegin: 0,
	animationDuration: 400,
	animationEasing: "ease"
});
/**
* Compose the data of each group
* @param {Object} props Props for the component
* @param {Object} item        An instance of Bar
* @param {Array} barPosition  The offset and size of each bar
* @param {Object} xAxis       The configuration of x-axis
* @param {Object} yAxis       The configuration of y-axis
* @param {Array} stackedData  The stacked data of a bar item
* @return{Array} Composed data
*/
_defineProperty$17(Bar, "getComposedData", function(_ref2) {
	var props = _ref2.props, item = _ref2.item, barPosition = _ref2.barPosition, bandSize = _ref2.bandSize, xAxis = _ref2.xAxis, yAxis = _ref2.yAxis, xAxisTicks = _ref2.xAxisTicks, yAxisTicks = _ref2.yAxisTicks, stackedData = _ref2.stackedData, dataStartIndex = _ref2.dataStartIndex, displayedData = _ref2.displayedData, offset = _ref2.offset;
	var pos = findPositionOfBar(barPosition, item);
	if (!pos) return null;
	var layout = props.layout;
	var itemDefaultProps = item.type.defaultProps;
	var itemProps = itemDefaultProps !== void 0 ? _objectSpread$14(_objectSpread$14({}, itemDefaultProps), item.props) : item.props;
	var dataKey = itemProps.dataKey, children = itemProps.children, minPointSizeProp = itemProps.minPointSize;
	var numericAxis = layout === "horizontal" ? yAxis : xAxis;
	var stackedDomain = stackedData ? numericAxis.scale.domain() : null;
	var baseValue = getBaseValueOfBar({ numericAxis });
	var cells = findAllByType(children, Cell);
	return _objectSpread$14({
		data: displayedData.map(function(entry, index) {
			var value, x, y, width, height, background;
			if (stackedData) value = truncateByDomain(stackedData[dataStartIndex + index], stackedDomain);
			else {
				value = getValueByDataKey(entry, dataKey);
				if (!Array.isArray(value)) value = [baseValue, value];
			}
			var minPointSize = minPointSizeCallback(minPointSizeProp, _Bar.defaultProps.minPointSize)(value[1], index);
			if (layout === "horizontal") {
				var _ref4;
				var _ref3 = [yAxis.scale(value[0]), yAxis.scale(value[1])], baseValueScale = _ref3[0], currentValueScale = _ref3[1];
				x = getCateCoordinateOfBar({
					axis: xAxis,
					ticks: xAxisTicks,
					bandSize,
					offset: pos.offset,
					entry,
					index
				});
				y = (_ref4 = currentValueScale !== null && currentValueScale !== void 0 ? currentValueScale : baseValueScale) !== null && _ref4 !== void 0 ? _ref4 : void 0;
				width = pos.size;
				var computedHeight = baseValueScale - currentValueScale;
				height = Number.isNaN(computedHeight) ? 0 : computedHeight;
				background = {
					x,
					y: yAxis.y,
					width,
					height: yAxis.height
				};
				if (Math.abs(minPointSize) > 0 && Math.abs(height) < Math.abs(minPointSize)) {
					var delta = mathSign(height || minPointSize) * (Math.abs(minPointSize) - Math.abs(height));
					y -= delta;
					height += delta;
				}
			} else {
				var _ref5 = [xAxis.scale(value[0]), xAxis.scale(value[1])], _baseValueScale = _ref5[0], _currentValueScale = _ref5[1];
				x = _baseValueScale;
				y = getCateCoordinateOfBar({
					axis: yAxis,
					ticks: yAxisTicks,
					bandSize,
					offset: pos.offset,
					entry,
					index
				});
				width = _currentValueScale - _baseValueScale;
				height = pos.size;
				background = {
					x: xAxis.x,
					y,
					width: xAxis.width,
					height
				};
				if (Math.abs(minPointSize) > 0 && Math.abs(width) < Math.abs(minPointSize)) {
					var _delta = mathSign(width || minPointSize) * (Math.abs(minPointSize) - Math.abs(width));
					width += _delta;
				}
			}
			return _objectSpread$14(_objectSpread$14(_objectSpread$14({}, entry), {}, {
				x,
				y,
				width,
				height,
				value: stackedData ? value : value[1],
				payload: entry,
				background
			}, cells && cells[index] && cells[index].props), {}, {
				tooltipPayload: [getTooltipItem(item, entry)],
				tooltipPosition: {
					x: x + width / 2,
					y: y + height / 2
				}
			});
		}),
		layout
	}, offset);
});
//#endregion
//#region node_modules/recharts/es6/util/CartesianUtils.js
function _typeof$16(o) {
	"@babel/helpers - typeof";
	return _typeof$16 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$16(o);
}
function _classCallCheck$10(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$10(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$16(descriptor.key), descriptor);
	}
}
function _createClass$10(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$10(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$10(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function ownKeys$13(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$13(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$13(Object(t), !0).forEach(function(r) {
			_defineProperty$16(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$13(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$16(obj, key, value) {
	key = _toPropertyKey$16(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$16(t) {
	var i = _toPrimitive$16(t, "string");
	return "symbol" == _typeof$16(i) ? i : i + "";
}
function _toPrimitive$16(t, r) {
	if ("object" != _typeof$16(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$16(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
/**
* Calculate the scale function, position, width, height of axes
* @param  {Object} props     Latest props
* @param  {Object} axisMap   The configuration of axes
* @param  {Object} offset    The offset of main part in the svg element
* @param  {String} axisType  The type of axes, x-axis or y-axis
* @param  {String} chartName The name of chart
* @return {Object} Configuration
*/
var formatAxisMap = function formatAxisMap(props, axisMap, offset, axisType, chartName) {
	var width = props.width, height = props.height, layout = props.layout, children = props.children;
	var ids = Object.keys(axisMap);
	var steps = {
		left: offset.left,
		leftMirror: offset.left,
		right: width - offset.right,
		rightMirror: width - offset.right,
		top: offset.top,
		topMirror: offset.top,
		bottom: height - offset.bottom,
		bottomMirror: height - offset.bottom
	};
	var hasBar = !!findChildByType(children, Bar);
	return ids.reduce(function(result, id) {
		var axis = axisMap[id];
		var orientation = axis.orientation, domain = axis.domain, _axis$padding = axis.padding, padding = _axis$padding === void 0 ? {} : _axis$padding, mirror = axis.mirror, reversed = axis.reversed;
		var offsetKey = "".concat(orientation).concat(mirror ? "Mirror" : "");
		var calculatedPadding, range, x, y, needSpace;
		if (axis.type === "number" && (axis.padding === "gap" || axis.padding === "no-gap")) {
			var diff = domain[1] - domain[0];
			var smallestDistanceBetweenValues = Infinity;
			var sortedValues = axis.categoricalDomain.sort(compareValues);
			sortedValues.forEach(function(value, index) {
				if (index > 0) smallestDistanceBetweenValues = Math.min((value || 0) - (sortedValues[index - 1] || 0), smallestDistanceBetweenValues);
			});
			if (Number.isFinite(smallestDistanceBetweenValues)) {
				var smallestDistanceInPercent = smallestDistanceBetweenValues / diff;
				var rangeWidth = axis.layout === "vertical" ? offset.height : offset.width;
				if (axis.padding === "gap") calculatedPadding = smallestDistanceInPercent * rangeWidth / 2;
				if (axis.padding === "no-gap") {
					var gap = getPercentValue(props.barCategoryGap, smallestDistanceInPercent * rangeWidth);
					var halfBand = smallestDistanceInPercent * rangeWidth / 2;
					calculatedPadding = halfBand - gap - (halfBand - gap) / rangeWidth * gap;
				}
			}
		}
		if (axisType === "xAxis") range = [offset.left + (padding.left || 0) + (calculatedPadding || 0), offset.left + offset.width - (padding.right || 0) - (calculatedPadding || 0)];
		else if (axisType === "yAxis") range = layout === "horizontal" ? [offset.top + offset.height - (padding.bottom || 0), offset.top + (padding.top || 0)] : [offset.top + (padding.top || 0) + (calculatedPadding || 0), offset.top + offset.height - (padding.bottom || 0) - (calculatedPadding || 0)];
		else range = axis.range;
		if (reversed) range = [range[1], range[0]];
		var _parseScale = parseScale(axis, chartName, hasBar), scale = _parseScale.scale, realScaleType = _parseScale.realScaleType;
		scale.domain(domain).range(range);
		checkDomainOfScale(scale);
		var ticks = getTicksOfScale(scale, _objectSpread$13(_objectSpread$13({}, axis), {}, { realScaleType }));
		if (axisType === "xAxis") {
			needSpace = orientation === "top" && !mirror || orientation === "bottom" && mirror;
			x = offset.left;
			y = steps[offsetKey] - needSpace * axis.height;
		} else if (axisType === "yAxis") {
			needSpace = orientation === "left" && !mirror || orientation === "right" && mirror;
			x = steps[offsetKey] - needSpace * axis.width;
			y = offset.top;
		}
		var finalAxis = _objectSpread$13(_objectSpread$13(_objectSpread$13({}, axis), ticks), {}, {
			realScaleType,
			x,
			y,
			scale,
			width: axisType === "xAxis" ? offset.width : axis.width,
			height: axisType === "yAxis" ? offset.height : axis.height
		});
		finalAxis.bandSize = getBandSizeOfAxis(finalAxis, ticks);
		if (!axis.hide && axisType === "xAxis") steps[offsetKey] += (needSpace ? -1 : 1) * finalAxis.height;
		else if (!axis.hide) steps[offsetKey] += (needSpace ? -1 : 1) * finalAxis.width;
		return _objectSpread$13(_objectSpread$13({}, result), {}, _defineProperty$16({}, id, finalAxis));
	}, {});
};
var rectWithPoints = function rectWithPoints(_ref, _ref2) {
	var x1 = _ref.x, y1 = _ref.y;
	var x2 = _ref2.x, y2 = _ref2.y;
	return {
		x: Math.min(x1, x2),
		y: Math.min(y1, y2),
		width: Math.abs(x2 - x1),
		height: Math.abs(y2 - y1)
	};
};
/**
* Compute the x, y, width, and height of a box from two reference points.
* @param  {Object} coords     x1, x2, y1, and y2
* @return {Object} object
*/
var rectWithCoords = function rectWithCoords(_ref3) {
	var x1 = _ref3.x1, y1 = _ref3.y1, x2 = _ref3.x2, y2 = _ref3.y2;
	return rectWithPoints({
		x: x1,
		y: y1
	}, {
		x: x2,
		y: y2
	});
};
var ScaleHelper = /*#__PURE__*/ function() {
	function ScaleHelper(scale) {
		_classCallCheck$10(this, ScaleHelper);
		this.scale = scale;
	}
	return _createClass$10(ScaleHelper, [
		{
			key: "domain",
			get: function get() {
				return this.scale.domain;
			}
		},
		{
			key: "range",
			get: function get() {
				return this.scale.range;
			}
		},
		{
			key: "rangeMin",
			get: function get() {
				return this.range()[0];
			}
		},
		{
			key: "rangeMax",
			get: function get() {
				return this.range()[1];
			}
		},
		{
			key: "bandwidth",
			get: function get() {
				return this.scale.bandwidth;
			}
		},
		{
			key: "apply",
			value: function apply(value) {
				var _ref4 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, bandAware = _ref4.bandAware, position = _ref4.position;
				if (value === void 0) return;
				if (position) switch (position) {
					case "start": return this.scale(value);
					case "middle":
						var offset = this.bandwidth ? this.bandwidth() / 2 : 0;
						return this.scale(value) + offset;
					case "end":
						var _offset = this.bandwidth ? this.bandwidth() : 0;
						return this.scale(value) + _offset;
					default: return this.scale(value);
				}
				if (bandAware) {
					var _offset2 = this.bandwidth ? this.bandwidth() / 2 : 0;
					return this.scale(value) + _offset2;
				}
				return this.scale(value);
			}
		},
		{
			key: "isInRange",
			value: function isInRange(value) {
				var range = this.range();
				var first = range[0];
				var last = range[range.length - 1];
				return first <= last ? value >= first && value <= last : value >= last && value <= first;
			}
		}
	], [{
		key: "create",
		value: function create(obj) {
			return new ScaleHelper(obj);
		}
	}]);
}();
_defineProperty$16(ScaleHelper, "EPS", 1e-4);
var createLabeledScales = function createLabeledScales(options) {
	var scales = Object.keys(options).reduce(function(res, key) {
		return _objectSpread$13(_objectSpread$13({}, res), {}, _defineProperty$16({}, key, ScaleHelper.create(options[key])));
	}, {});
	return _objectSpread$13(_objectSpread$13({}, scales), {}, {
		apply: function apply(coord) {
			var _ref5 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, bandAware = _ref5.bandAware, position = _ref5.position;
			return (0, import_mapValues.default)(coord, function(value, label) {
				return scales[label].apply(value, {
					bandAware,
					position
				});
			});
		},
		isInRange: function isInRange(coord) {
			return (0, import_every.default)(coord, function(value, label) {
				return scales[label].isInRange(value);
			});
		}
	});
};
/** Normalizes the angle so that 0 <= angle < 180.
* @param {number} angle Angle in degrees.
* @return {number} the normalized angle with a value of at least 0 and never greater or equal to 180. */
function normalizeAngle(angle) {
	return (angle % 180 + 180) % 180;
}
/** Calculates the width of the largest horizontal line that fits inside a rectangle that is displayed at an angle.
* @param {Object} size Width and height of the text in a horizontal position.
* @param {number} angle Angle in degrees in which the text is displayed.
* @return {number} The width of the largest horizontal line that fits inside a rectangle that is displayed at an angle.
*/
var getAngledRectangleWidth = function getAngledRectangleWidth(_ref6) {
	var width = _ref6.width, height = _ref6.height;
	var angleRadians = normalizeAngle(arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0) * Math.PI / 180;
	var angleThreshold = Math.atan(height / width);
	var angledWidth = angleRadians > angleThreshold && angleRadians < Math.PI - angleThreshold ? height / Math.sin(angleRadians) : width / Math.cos(angleRadians);
	return Math.abs(angledWidth);
};
//#endregion
//#region node_modules/recharts/es6/util/getEveryNthWithCondition.js
/**
* Given an array and a number N, return a new array which contains every nTh
* element of the input array. For n below 1, an empty array is returned.
* If isValid is provided, all candidates must suffice the condition, else undefined is returned.
* @param {T[]} array An input array.
* @param {integer} n A number
* @param {Function} isValid A function to evaluate a candidate form the array
* @returns {T[]} The result array of the same type as the input array.
*/
function getEveryNthWithCondition(array, n, isValid) {
	if (n < 1) return [];
	if (n === 1 && isValid === void 0) return array;
	var result = [];
	for (var i = 0; i < array.length; i += n) if (isValid === void 0 || isValid(array[i]) === true) result.push(array[i]);
	else return;
	return result;
}
//#endregion
//#region node_modules/recharts/es6/util/TickUtils.js
function getAngledTickWidth(contentSize, unitSize, angle) {
	return getAngledRectangleWidth({
		width: contentSize.width + unitSize.width,
		height: contentSize.height + unitSize.height
	}, angle);
}
function getTickBoundaries(viewBox, sign, sizeKey) {
	var isWidth = sizeKey === "width";
	var x = viewBox.x, y = viewBox.y, width = viewBox.width, height = viewBox.height;
	if (sign === 1) return {
		start: isWidth ? x : y,
		end: isWidth ? x + width : y + height
	};
	return {
		start: isWidth ? x + width : y + height,
		end: isWidth ? x : y
	};
}
function isVisible(sign, tickPosition, getSize, start, end) {
	if (sign * tickPosition < sign * start || sign * tickPosition > sign * end) return false;
	var size = getSize();
	return sign * (tickPosition - sign * size / 2 - start) >= 0 && sign * (tickPosition + sign * size / 2 - end) <= 0;
}
function getNumberIntervalTicks(ticks, interval) {
	return getEveryNthWithCondition(ticks, interval + 1);
}
//#endregion
//#region node_modules/recharts/es6/cartesian/getEquidistantTicks.js
function getEquidistantTicks(sign, boundaries, getTickSize, ticks, minTickGap) {
	var result = (ticks || []).slice();
	var initialStart = boundaries.start, end = boundaries.end;
	var index = 0;
	var stepsize = 1;
	var start = initialStart;
	var _loop = function _loop() {
		var entry = ticks === null || ticks === void 0 ? void 0 : ticks[index];
		if (entry === void 0) return { v: getEveryNthWithCondition(ticks, stepsize) };
		var i = index;
		var size;
		var getSize = function getSize() {
			if (size === void 0) size = getTickSize(entry, i);
			return size;
		};
		var tickCoord = entry.coordinate;
		var isShow = index === 0 || isVisible(sign, tickCoord, getSize, start, end);
		if (!isShow) {
			index = 0;
			start = initialStart;
			stepsize += 1;
		}
		if (isShow) {
			start = tickCoord + sign * (getSize() / 2 + minTickGap);
			index += stepsize;
		}
	}, _ret;
	while (stepsize <= result.length) {
		_ret = _loop();
		if (_ret) return _ret.v;
	}
	return [];
}
//#endregion
//#region node_modules/recharts/es6/cartesian/getTicks.js
function _typeof$15(o) {
	"@babel/helpers - typeof";
	return _typeof$15 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$15(o);
}
function ownKeys$12(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$12(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$12(Object(t), !0).forEach(function(r) {
			_defineProperty$15(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$12(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$15(obj, key, value) {
	key = _toPropertyKey$15(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$15(t) {
	var i = _toPrimitive$15(t, "string");
	return "symbol" == _typeof$15(i) ? i : i + "";
}
function _toPrimitive$15(t, r) {
	if ("object" != _typeof$15(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$15(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function getTicksEnd(sign, boundaries, getTickSize, ticks, minTickGap) {
	var result = (ticks || []).slice();
	var len = result.length;
	var start = boundaries.start;
	var end = boundaries.end;
	var _loop = function _loop(i) {
		var entry = result[i];
		var size;
		var getSize = function getSize() {
			if (size === void 0) size = getTickSize(entry, i);
			return size;
		};
		if (i === len - 1) {
			var gap = sign * (entry.coordinate + sign * getSize() / 2 - end);
			result[i] = entry = _objectSpread$12(_objectSpread$12({}, entry), {}, { tickCoord: gap > 0 ? entry.coordinate - gap * sign : entry.coordinate });
		} else result[i] = entry = _objectSpread$12(_objectSpread$12({}, entry), {}, { tickCoord: entry.coordinate });
		if (isVisible(sign, entry.tickCoord, getSize, start, end)) {
			end = entry.tickCoord - sign * (getSize() / 2 + minTickGap);
			result[i] = _objectSpread$12(_objectSpread$12({}, entry), {}, { isShow: true });
		}
	};
	for (var i = len - 1; i >= 0; i--) _loop(i);
	return result;
}
function getTicksStart(sign, boundaries, getTickSize, ticks, minTickGap, preserveEnd) {
	var result = (ticks || []).slice();
	var len = result.length;
	var start = boundaries.start, end = boundaries.end;
	if (preserveEnd) {
		var tail = ticks[len - 1];
		var tailSize = getTickSize(tail, len - 1);
		var tailGap = sign * (tail.coordinate + sign * tailSize / 2 - end);
		result[len - 1] = tail = _objectSpread$12(_objectSpread$12({}, tail), {}, { tickCoord: tailGap > 0 ? tail.coordinate - tailGap * sign : tail.coordinate });
		if (isVisible(sign, tail.tickCoord, function() {
			return tailSize;
		}, start, end)) {
			end = tail.tickCoord - sign * (tailSize / 2 + minTickGap);
			result[len - 1] = _objectSpread$12(_objectSpread$12({}, tail), {}, { isShow: true });
		}
	}
	var count = preserveEnd ? len - 1 : len;
	var _loop2 = function _loop2(i) {
		var entry = result[i];
		var size;
		var getSize = function getSize() {
			if (size === void 0) size = getTickSize(entry, i);
			return size;
		};
		if (i === 0) {
			var gap = sign * (entry.coordinate - sign * getSize() / 2 - start);
			result[i] = entry = _objectSpread$12(_objectSpread$12({}, entry), {}, { tickCoord: gap < 0 ? entry.coordinate - gap * sign : entry.coordinate });
		} else result[i] = entry = _objectSpread$12(_objectSpread$12({}, entry), {}, { tickCoord: entry.coordinate });
		if (isVisible(sign, entry.tickCoord, getSize, start, end)) {
			start = entry.tickCoord + sign * (getSize() / 2 + minTickGap);
			result[i] = _objectSpread$12(_objectSpread$12({}, entry), {}, { isShow: true });
		}
	};
	for (var i = 0; i < count; i++) _loop2(i);
	return result;
}
function getTicks(props, fontSize, letterSpacing) {
	var tick = props.tick, ticks = props.ticks, viewBox = props.viewBox, minTickGap = props.minTickGap, orientation = props.orientation, interval = props.interval, tickFormatter = props.tickFormatter, unit = props.unit, angle = props.angle;
	if (!ticks || !ticks.length || !tick) return [];
	if (isNumber(interval) || Global.isSsr) return getNumberIntervalTicks(ticks, typeof interval === "number" && isNumber(interval) ? interval : 0);
	var candidates = [];
	var sizeKey = orientation === "top" || orientation === "bottom" ? "width" : "height";
	var unitSize = unit && sizeKey === "width" ? getStringSize(unit, {
		fontSize,
		letterSpacing
	}) : {
		width: 0,
		height: 0
	};
	var getTickSize = function getTickSize(content, index) {
		var value = (0, import_isFunction.default)(tickFormatter) ? tickFormatter(content.value, index) : content.value;
		return sizeKey === "width" ? getAngledTickWidth(getStringSize(value, {
			fontSize,
			letterSpacing
		}), unitSize, angle) : getStringSize(value, {
			fontSize,
			letterSpacing
		})[sizeKey];
	};
	var sign = ticks.length >= 2 ? mathSign(ticks[1].coordinate - ticks[0].coordinate) : 1;
	var boundaries = getTickBoundaries(viewBox, sign, sizeKey);
	if (interval === "equidistantPreserveStart") return getEquidistantTicks(sign, boundaries, getTickSize, ticks, minTickGap);
	if (interval === "preserveStart" || interval === "preserveStartEnd") candidates = getTicksStart(sign, boundaries, getTickSize, ticks, minTickGap, interval === "preserveStartEnd");
	else candidates = getTicksEnd(sign, boundaries, getTickSize, ticks, minTickGap);
	return candidates.filter(function(entry) {
		return entry.isShow;
	});
}
//#endregion
//#region node_modules/recharts/es6/cartesian/CartesianAxis.js
/**
* @fileOverview Cartesian Axis
*/
var _excluded$4 = ["viewBox"], _excluded2$3 = ["viewBox"], _excluded3 = ["ticks"];
function _typeof$14(o) {
	"@babel/helpers - typeof";
	return _typeof$14 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$14(o);
}
function _extends$12() {
	_extends$12 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$12.apply(this, arguments);
}
function ownKeys$11(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$11(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$11(Object(t), !0).forEach(function(r) {
			_defineProperty$14(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$11(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _objectWithoutProperties$4(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$4(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$4(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _classCallCheck$9(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$9(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$14(descriptor.key), descriptor);
	}
}
function _createClass$9(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$9(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$9(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$8(t, o, e) {
	return o = _getPrototypeOf$8(o), _possibleConstructorReturn$8(t, _isNativeReflectConstruct$8() ? Reflect.construct(o, e || [], _getPrototypeOf$8(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$8(self, call) {
	if (call && (_typeof$14(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$8(self);
}
function _assertThisInitialized$8(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$8() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$8 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$8(o) {
	_getPrototypeOf$8 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$8(o);
}
function _inherits$8(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$8(subClass, superClass);
}
function _setPrototypeOf$8(o, p) {
	_setPrototypeOf$8 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$8(o, p);
}
function _defineProperty$14(obj, key, value) {
	key = _toPropertyKey$14(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$14(t) {
	var i = _toPrimitive$14(t, "string");
	return "symbol" == _typeof$14(i) ? i : i + "";
}
function _toPrimitive$14(t, r) {
	if ("object" != _typeof$14(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$14(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
/** The orientation of the axis in correspondence to the chart */
/** A unit to be appended to a value */
/** The formatter function of tick */
var CartesianAxis = /*#__PURE__*/ function(_Component) {
	function CartesianAxis(props) {
		var _this;
		_classCallCheck$9(this, CartesianAxis);
		_this = _callSuper$8(this, CartesianAxis, [props]);
		_this.state = {
			fontSize: "",
			letterSpacing: ""
		};
		return _this;
	}
	_inherits$8(CartesianAxis, _Component);
	return _createClass$9(CartesianAxis, [
		{
			key: "shouldComponentUpdate",
			value: function shouldComponentUpdate(_ref, nextState) {
				var viewBox = _ref.viewBox, restProps = _objectWithoutProperties$4(_ref, _excluded$4);
				var _this$props = this.props, viewBoxOld = _this$props.viewBox, restPropsOld = _objectWithoutProperties$4(_this$props, _excluded2$3);
				return !shallowEqual(viewBox, viewBoxOld) || !shallowEqual(restProps, restPropsOld) || !shallowEqual(nextState, this.state);
			}
		},
		{
			key: "componentDidMount",
			value: function componentDidMount() {
				var htmlLayer = this.layerReference;
				if (!htmlLayer) return;
				var tick = htmlLayer.getElementsByClassName("recharts-cartesian-axis-tick-value")[0];
				if (tick) this.setState({
					fontSize: window.getComputedStyle(tick).fontSize,
					letterSpacing: window.getComputedStyle(tick).letterSpacing
				});
			}
		},
		{
			key: "getTickLineCoord",
			value: function getTickLineCoord(data) {
				var _this$props2 = this.props, x = _this$props2.x, y = _this$props2.y, width = _this$props2.width, height = _this$props2.height, orientation = _this$props2.orientation, tickSize = _this$props2.tickSize, mirror = _this$props2.mirror, tickMargin = _this$props2.tickMargin;
				var x1, x2, y1, y2, tx, ty;
				var sign = mirror ? -1 : 1;
				var finalTickSize = data.tickSize || tickSize;
				var tickCoord = isNumber(data.tickCoord) ? data.tickCoord : data.coordinate;
				switch (orientation) {
					case "top":
						x1 = x2 = data.coordinate;
						y2 = y + +!mirror * height;
						y1 = y2 - sign * finalTickSize;
						ty = y1 - sign * tickMargin;
						tx = tickCoord;
						break;
					case "left":
						y1 = y2 = data.coordinate;
						x2 = x + +!mirror * width;
						x1 = x2 - sign * finalTickSize;
						tx = x1 - sign * tickMargin;
						ty = tickCoord;
						break;
					case "right":
						y1 = y2 = data.coordinate;
						x2 = x + +mirror * width;
						x1 = x2 + sign * finalTickSize;
						tx = x1 + sign * tickMargin;
						ty = tickCoord;
						break;
					default:
						x1 = x2 = data.coordinate;
						y2 = y + +mirror * height;
						y1 = y2 + sign * finalTickSize;
						ty = y1 + sign * tickMargin;
						tx = tickCoord;
						break;
				}
				return {
					line: {
						x1,
						y1,
						x2,
						y2
					},
					tick: {
						x: tx,
						y: ty
					}
				};
			}
		},
		{
			key: "getTickTextAnchor",
			value: function getTickTextAnchor() {
				var _this$props3 = this.props, orientation = _this$props3.orientation, mirror = _this$props3.mirror;
				var textAnchor;
				switch (orientation) {
					case "left":
						textAnchor = mirror ? "start" : "end";
						break;
					case "right":
						textAnchor = mirror ? "end" : "start";
						break;
					default:
						textAnchor = "middle";
						break;
				}
				return textAnchor;
			}
		},
		{
			key: "getTickVerticalAnchor",
			value: function getTickVerticalAnchor() {
				var _this$props4 = this.props, orientation = _this$props4.orientation, mirror = _this$props4.mirror;
				var verticalAnchor = "end";
				switch (orientation) {
					case "left":
					case "right":
						verticalAnchor = "middle";
						break;
					case "top":
						verticalAnchor = mirror ? "start" : "end";
						break;
					default:
						verticalAnchor = mirror ? "end" : "start";
						break;
				}
				return verticalAnchor;
			}
		},
		{
			key: "renderAxisLine",
			value: function renderAxisLine() {
				var _this$props5 = this.props, x = _this$props5.x, y = _this$props5.y, width = _this$props5.width, height = _this$props5.height, orientation = _this$props5.orientation, mirror = _this$props5.mirror, axisLine = _this$props5.axisLine;
				var props = _objectSpread$11(_objectSpread$11(_objectSpread$11({}, filterProps(this.props, false)), filterProps(axisLine, false)), {}, { fill: "none" });
				if (orientation === "top" || orientation === "bottom") {
					var needHeight = +(orientation === "top" && !mirror || orientation === "bottom" && mirror);
					props = _objectSpread$11(_objectSpread$11({}, props), {}, {
						x1: x,
						y1: y + needHeight * height,
						x2: x + width,
						y2: y + needHeight * height
					});
				} else {
					var needWidth = +(orientation === "left" && !mirror || orientation === "right" && mirror);
					props = _objectSpread$11(_objectSpread$11({}, props), {}, {
						x1: x + needWidth * width,
						y1: y,
						x2: x + needWidth * width,
						y2: y + height
					});
				}
				return /*#__PURE__*/ import_react.createElement("line", _extends$12({}, props, { className: clsx("recharts-cartesian-axis-line", (0, import_get.default)(axisLine, "className")) }));
			}
		},
		{
			key: "renderTicks",
			value: function renderTicks(ticks, fontSize, letterSpacing) {
				var _this2 = this;
				var _this$props6 = this.props, tickLine = _this$props6.tickLine, stroke = _this$props6.stroke, tick = _this$props6.tick, tickFormatter = _this$props6.tickFormatter, unit = _this$props6.unit;
				var finalTicks = getTicks(_objectSpread$11(_objectSpread$11({}, this.props), {}, { ticks }), fontSize, letterSpacing);
				var textAnchor = this.getTickTextAnchor();
				var verticalAnchor = this.getTickVerticalAnchor();
				var axisProps = filterProps(this.props, false);
				var customTickProps = filterProps(tick, false);
				var tickLineProps = _objectSpread$11(_objectSpread$11({}, axisProps), {}, { fill: "none" }, filterProps(tickLine, false));
				var items = finalTicks.map(function(entry, i) {
					var _this2$getTickLineCoo = _this2.getTickLineCoord(entry), lineCoord = _this2$getTickLineCoo.line, tickCoord = _this2$getTickLineCoo.tick;
					var tickProps = _objectSpread$11(_objectSpread$11(_objectSpread$11(_objectSpread$11({
						textAnchor,
						verticalAnchor
					}, axisProps), {}, {
						stroke: "none",
						fill: stroke
					}, customTickProps), tickCoord), {}, {
						index: i,
						payload: entry,
						visibleTicksCount: finalTicks.length,
						tickFormatter
					});
					return /*#__PURE__*/ import_react.createElement(Layer, _extends$12({
						className: "recharts-cartesian-axis-tick",
						key: "tick-".concat(entry.value, "-").concat(entry.coordinate, "-").concat(entry.tickCoord)
					}, adaptEventsOfChild(_this2.props, entry, i)), tickLine && /*#__PURE__*/ import_react.createElement("line", _extends$12({}, tickLineProps, lineCoord, { className: clsx("recharts-cartesian-axis-tick-line", (0, import_get.default)(tickLine, "className")) })), tick && CartesianAxis.renderTickItem(tick, tickProps, "".concat((0, import_isFunction.default)(tickFormatter) ? tickFormatter(entry.value, i) : entry.value).concat(unit || "")));
				});
				return /*#__PURE__*/ import_react.createElement("g", { className: "recharts-cartesian-axis-ticks" }, items);
			}
		},
		{
			key: "render",
			value: function render() {
				var _this3 = this;
				var _this$props7 = this.props, axisLine = _this$props7.axisLine, width = _this$props7.width, height = _this$props7.height, ticksGenerator = _this$props7.ticksGenerator, className = _this$props7.className;
				if (_this$props7.hide) return null;
				var _this$props8 = this.props, ticks = _this$props8.ticks, noTicksProps = _objectWithoutProperties$4(_this$props8, _excluded3);
				var finalTicks = ticks;
				if ((0, import_isFunction.default)(ticksGenerator)) finalTicks = ticks && ticks.length > 0 ? ticksGenerator(this.props) : ticksGenerator(noTicksProps);
				if (width <= 0 || height <= 0 || !finalTicks || !finalTicks.length) return null;
				return /*#__PURE__*/ import_react.createElement(Layer, {
					className: clsx("recharts-cartesian-axis", className),
					ref: function ref(_ref2) {
						_this3.layerReference = _ref2;
					}
				}, axisLine && this.renderAxisLine(), this.renderTicks(finalTicks, this.state.fontSize, this.state.letterSpacing), Label.renderCallByParent(this.props));
			}
		}
	], [{
		key: "renderTickItem",
		value: function renderTickItem(option, props, value) {
			var tickItem;
			var combinedClassName = clsx(props.className, "recharts-cartesian-axis-tick-value");
			if (/*#__PURE__*/ import_react.isValidElement(option)) tickItem = /*#__PURE__*/ import_react.cloneElement(option, _objectSpread$11(_objectSpread$11({}, props), {}, { className: combinedClassName }));
			else if ((0, import_isFunction.default)(option)) tickItem = option(_objectSpread$11(_objectSpread$11({}, props), {}, { className: combinedClassName }));
			else tickItem = /*#__PURE__*/ import_react.createElement(Text, _extends$12({}, props, { className: "recharts-cartesian-axis-tick-value" }), value);
			return tickItem;
		}
	}]);
}(import_react.Component);
_defineProperty$14(CartesianAxis, "displayName", "CartesianAxis");
_defineProperty$14(CartesianAxis, "defaultProps", {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	viewBox: {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	},
	orientation: "bottom",
	ticks: [],
	stroke: "#666",
	tickLine: true,
	axisLine: true,
	tick: true,
	mirror: false,
	minTickGap: 5,
	tickSize: 6,
	tickMargin: 2,
	interval: "preserveEnd"
});
//#endregion
//#region node_modules/recharts/es6/util/calculateViewBox.js
var import_find = /* @__PURE__ */ __toESM(require_find());
/**
* This is memoized because the viewBox is unlikely to change often
* - but because it is computed from offset, any change to it would re-render all children.
*
* And because we have many readers of the viewBox, and update it only rarely,
* then let's optimize with memoization.
*/
var calculateViewBox = (0, import_memoize.default)(function(offset) {
	return {
		x: offset.left,
		y: offset.top,
		width: offset.width,
		height: offset.height
	};
}, function(offset) {
	return [
		"l",
		offset.left,
		"t",
		offset.top,
		"w",
		offset.width,
		"h",
		offset.height
	].join("");
});
//#endregion
//#region node_modules/recharts/es6/context/chartLayoutContext.js
var XAxisContext = /*#__PURE__*/ (0, import_react.createContext)(void 0);
var YAxisContext = /*#__PURE__*/ (0, import_react.createContext)(void 0);
var ViewBoxContext = /*#__PURE__*/ (0, import_react.createContext)(void 0);
var OffsetContext = /*#__PURE__*/ (0, import_react.createContext)({});
var ClipPathIdContext = /*#__PURE__*/ (0, import_react.createContext)(void 0);
var ChartHeightContext = /*#__PURE__*/ (0, import_react.createContext)(0);
var ChartWidthContext = /*#__PURE__*/ (0, import_react.createContext)(0);
/**
* Will add all the properties required to render all individual Recharts components into a React Context.
*
* If you want to read these properties, see the collection of hooks exported from this file.
*
* @param {object} props CategoricalChartState, plus children
* @returns {ReactElement} React Context Provider
*/
var ChartLayoutContextProvider = function ChartLayoutContextProvider(props) {
	var _props$state = props.state, xAxisMap = _props$state.xAxisMap, yAxisMap = _props$state.yAxisMap, offset = _props$state.offset, clipPathId = props.clipPathId, children = props.children, width = props.width, height = props.height;
	/**
	* Perhaps we should compute this property when reading? Let's see what is more often used
	*/
	var viewBox = calculateViewBox(offset);
	return /*#__PURE__*/ import_react.createElement(XAxisContext.Provider, { value: xAxisMap }, /*#__PURE__*/ import_react.createElement(YAxisContext.Provider, { value: yAxisMap }, /*#__PURE__*/ import_react.createElement(OffsetContext.Provider, { value: offset }, /*#__PURE__*/ import_react.createElement(ViewBoxContext.Provider, { value: viewBox }, /*#__PURE__*/ import_react.createElement(ClipPathIdContext.Provider, { value: clipPathId }, /*#__PURE__*/ import_react.createElement(ChartHeightContext.Provider, { value: height }, /*#__PURE__*/ import_react.createElement(ChartWidthContext.Provider, { value: width }, children)))))));
};
var useClipPathId = function useClipPathId() {
	return (0, import_react.useContext)(ClipPathIdContext);
};
/**
* This either finds and returns Axis by the specified ID, or throws an exception if an axis with this ID does not exist.
*
* @param xAxisId identifier of the axis - it's either autogenerated ('0'), or passed via `id` prop as <XAxis id='foo' />
* @returns axis configuration object
* @throws Error if no axis with this ID exists
*/
var useXAxisOrThrow = function useXAxisOrThrow(xAxisId) {
	var xAxisMap = (0, import_react.useContext)(XAxisContext);
	!(xAxisMap != null) && invariant(false);
	var xAxis = xAxisMap[xAxisId];
	!(xAxis != null) && invariant(false);
	return xAxis;
};
/**
* This will find an arbitrary first XAxis. If there's exactly one it always returns that one
* - but if there are multiple then it can return any of those.
*
* If you want specific XAxis out of multiple then prefer using useXAxisOrThrow
*
* @returns X axisOptions, or undefined - if there are no X axes
*/
var useArbitraryXAxis = function useArbitraryXAxis() {
	return getAnyElementOfObject((0, import_react.useContext)(XAxisContext));
};
/**
* This hooks will:
* 1st attempt to find an YAxis that has all elements in its domain finite
* If no such axis exists, it will return an arbitrary YAxis
* if there are no Y axes then it returns undefined
*
* @returns Either Y axisOptions, or undefined if there are no Y axes
*/
var useYAxisWithFiniteDomainOrRandom = function useYAxisWithFiniteDomainOrRandom() {
	var yAxisMap = (0, import_react.useContext)(YAxisContext);
	return (0, import_find.default)(yAxisMap, function(axis) {
		return (0, import_every.default)(axis.domain, Number.isFinite);
	}) || getAnyElementOfObject(yAxisMap);
};
/**
* This either finds and returns Axis by the specified ID, or throws an exception if an axis with this ID does not exist.
*
* @param yAxisId identifier of the axis - it's either autogenerated ('0'), or passed via `id` prop as <YAxis id='foo' />
* @returns axis configuration object
* @throws Error if no axis with this ID exists
*/
var useYAxisOrThrow = function useYAxisOrThrow(yAxisId) {
	var yAxisMap = (0, import_react.useContext)(YAxisContext);
	!(yAxisMap != null) && invariant(false);
	var yAxis = yAxisMap[yAxisId];
	!(yAxis != null) && invariant(false);
	return yAxis;
};
var useViewBox = function useViewBox() {
	return (0, import_react.useContext)(ViewBoxContext);
};
var useOffset = function useOffset() {
	return (0, import_react.useContext)(OffsetContext);
};
var useChartWidth = function useChartWidth() {
	return (0, import_react.useContext)(ChartWidthContext);
};
var useChartHeight = function useChartHeight() {
	return (0, import_react.useContext)(ChartHeightContext);
};
//#endregion
//#region node_modules/recharts/es6/cartesian/CartesianGrid.js
/**
* @fileOverview Cartesian Grid
*/
var _excluded$3 = [
	"x1",
	"y1",
	"x2",
	"y2",
	"key"
], _excluded2$2 = ["offset"];
function _typeof$13(o) {
	"@babel/helpers - typeof";
	return _typeof$13 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$13(o);
}
function ownKeys$10(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$10(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$10(Object(t), !0).forEach(function(r) {
			_defineProperty$13(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$10(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$13(obj, key, value) {
	key = _toPropertyKey$13(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$13(t) {
	var i = _toPrimitive$13(t, "string");
	return "symbol" == _typeof$13(i) ? i : i + "";
}
function _toPrimitive$13(t, r) {
	if ("object" != _typeof$13(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$13(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _extends$11() {
	_extends$11 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$11.apply(this, arguments);
}
function _objectWithoutProperties$3(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$3(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$3(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
/**
* The <CartesianGrid horizontal
*/
var Background = function Background(props) {
	var fill = props.fill;
	if (!fill || fill === "none") return null;
	var fillOpacity = props.fillOpacity, x = props.x, y = props.y, width = props.width, height = props.height, ry = props.ry;
	return /*#__PURE__*/ import_react.createElement("rect", {
		x,
		y,
		ry,
		width,
		height,
		stroke: "none",
		fill,
		fillOpacity,
		className: "recharts-cartesian-grid-bg"
	});
};
function renderLineItem(option, props) {
	var lineItem;
	if (/*#__PURE__*/ import_react.isValidElement(option)) lineItem = /*#__PURE__*/ import_react.cloneElement(option, props);
	else if ((0, import_isFunction.default)(option)) lineItem = option(props);
	else {
		var x1 = props.x1, y1 = props.y1, x2 = props.x2, y2 = props.y2, key = props.key, _filterProps = filterProps(_objectWithoutProperties$3(props, _excluded$3), false);
		_filterProps.offset;
		var restOfFilteredProps = _objectWithoutProperties$3(_filterProps, _excluded2$2);
		lineItem = /*#__PURE__*/ import_react.createElement("line", _extends$11({}, restOfFilteredProps, {
			x1,
			y1,
			x2,
			y2,
			fill: "none",
			key
		}));
	}
	return lineItem;
}
function HorizontalGridLines(props) {
	var x = props.x, width = props.width, _props$horizontal = props.horizontal, horizontal = _props$horizontal === void 0 ? true : _props$horizontal, horizontalPoints = props.horizontalPoints;
	if (!horizontal || !horizontalPoints || !horizontalPoints.length) return null;
	var items = horizontalPoints.map(function(entry, i) {
		return renderLineItem(horizontal, _objectSpread$10(_objectSpread$10({}, props), {}, {
			x1: x,
			y1: entry,
			x2: x + width,
			y2: entry,
			key: "line-".concat(i),
			index: i
		}));
	});
	return /*#__PURE__*/ import_react.createElement("g", { className: "recharts-cartesian-grid-horizontal" }, items);
}
function VerticalGridLines(props) {
	var y = props.y, height = props.height, _props$vertical = props.vertical, vertical = _props$vertical === void 0 ? true : _props$vertical, verticalPoints = props.verticalPoints;
	if (!vertical || !verticalPoints || !verticalPoints.length) return null;
	var items = verticalPoints.map(function(entry, i) {
		return renderLineItem(vertical, _objectSpread$10(_objectSpread$10({}, props), {}, {
			x1: entry,
			y1: y,
			x2: entry,
			y2: y + height,
			key: "line-".concat(i),
			index: i
		}));
	});
	return /*#__PURE__*/ import_react.createElement("g", { className: "recharts-cartesian-grid-vertical" }, items);
}
function HorizontalStripes(props) {
	var horizontalFill = props.horizontalFill, fillOpacity = props.fillOpacity, x = props.x, y = props.y, width = props.width, height = props.height, horizontalPoints = props.horizontalPoints, _props$horizontal2 = props.horizontal;
	if (!(_props$horizontal2 === void 0 ? true : _props$horizontal2) || !horizontalFill || !horizontalFill.length) return null;
	var roundedSortedHorizontalPoints = horizontalPoints.map(function(e) {
		return Math.round(e + y - y);
	}).sort(function(a, b) {
		return a - b;
	});
	if (y !== roundedSortedHorizontalPoints[0]) roundedSortedHorizontalPoints.unshift(0);
	var items = roundedSortedHorizontalPoints.map(function(entry, i) {
		var lineHeight = !roundedSortedHorizontalPoints[i + 1] ? y + height - entry : roundedSortedHorizontalPoints[i + 1] - entry;
		if (lineHeight <= 0) return null;
		var colorIndex = i % horizontalFill.length;
		return /*#__PURE__*/ import_react.createElement("rect", {
			key: "react-".concat(i),
			y: entry,
			x,
			height: lineHeight,
			width,
			stroke: "none",
			fill: horizontalFill[colorIndex],
			fillOpacity,
			className: "recharts-cartesian-grid-bg"
		});
	});
	return /*#__PURE__*/ import_react.createElement("g", { className: "recharts-cartesian-gridstripes-horizontal" }, items);
}
function VerticalStripes(props) {
	var _props$vertical2 = props.vertical, vertical = _props$vertical2 === void 0 ? true : _props$vertical2, verticalFill = props.verticalFill, fillOpacity = props.fillOpacity, x = props.x, y = props.y, width = props.width, height = props.height, verticalPoints = props.verticalPoints;
	if (!vertical || !verticalFill || !verticalFill.length) return null;
	var roundedSortedVerticalPoints = verticalPoints.map(function(e) {
		return Math.round(e + x - x);
	}).sort(function(a, b) {
		return a - b;
	});
	if (x !== roundedSortedVerticalPoints[0]) roundedSortedVerticalPoints.unshift(0);
	var items = roundedSortedVerticalPoints.map(function(entry, i) {
		var lineWidth = !roundedSortedVerticalPoints[i + 1] ? x + width - entry : roundedSortedVerticalPoints[i + 1] - entry;
		if (lineWidth <= 0) return null;
		var colorIndex = i % verticalFill.length;
		return /*#__PURE__*/ import_react.createElement("rect", {
			key: "react-".concat(i),
			x: entry,
			y,
			width: lineWidth,
			height,
			stroke: "none",
			fill: verticalFill[colorIndex],
			fillOpacity,
			className: "recharts-cartesian-grid-bg"
		});
	});
	return /*#__PURE__*/ import_react.createElement("g", { className: "recharts-cartesian-gridstripes-vertical" }, items);
}
var defaultVerticalCoordinatesGenerator = function defaultVerticalCoordinatesGenerator(_ref, syncWithTicks) {
	var xAxis = _ref.xAxis, width = _ref.width, height = _ref.height, offset = _ref.offset;
	return getCoordinatesOfGrid(getTicks(_objectSpread$10(_objectSpread$10(_objectSpread$10({}, CartesianAxis.defaultProps), xAxis), {}, {
		ticks: getTicksOfAxis(xAxis, true),
		viewBox: {
			x: 0,
			y: 0,
			width,
			height
		}
	})), offset.left, offset.left + offset.width, syncWithTicks);
};
var defaultHorizontalCoordinatesGenerator = function defaultHorizontalCoordinatesGenerator(_ref2, syncWithTicks) {
	var yAxis = _ref2.yAxis, width = _ref2.width, height = _ref2.height, offset = _ref2.offset;
	return getCoordinatesOfGrid(getTicks(_objectSpread$10(_objectSpread$10(_objectSpread$10({}, CartesianAxis.defaultProps), yAxis), {}, {
		ticks: getTicksOfAxis(yAxis, true),
		viewBox: {
			x: 0,
			y: 0,
			width,
			height
		}
	})), offset.top, offset.top + offset.height, syncWithTicks);
};
var defaultProps = {
	horizontal: true,
	vertical: true,
	horizontalPoints: [],
	verticalPoints: [],
	stroke: "#ccc",
	fill: "none",
	verticalFill: [],
	horizontalFill: []
};
function CartesianGrid(props) {
	var _props$stroke, _props$fill, _props$horizontal3, _props$horizontalFill, _props$vertical3, _props$verticalFill;
	var chartWidth = useChartWidth();
	var chartHeight = useChartHeight();
	var offset = useOffset();
	var propsIncludingDefaults = _objectSpread$10(_objectSpread$10({}, props), {}, {
		stroke: (_props$stroke = props.stroke) !== null && _props$stroke !== void 0 ? _props$stroke : defaultProps.stroke,
		fill: (_props$fill = props.fill) !== null && _props$fill !== void 0 ? _props$fill : defaultProps.fill,
		horizontal: (_props$horizontal3 = props.horizontal) !== null && _props$horizontal3 !== void 0 ? _props$horizontal3 : defaultProps.horizontal,
		horizontalFill: (_props$horizontalFill = props.horizontalFill) !== null && _props$horizontalFill !== void 0 ? _props$horizontalFill : defaultProps.horizontalFill,
		vertical: (_props$vertical3 = props.vertical) !== null && _props$vertical3 !== void 0 ? _props$vertical3 : defaultProps.vertical,
		verticalFill: (_props$verticalFill = props.verticalFill) !== null && _props$verticalFill !== void 0 ? _props$verticalFill : defaultProps.verticalFill,
		x: isNumber(props.x) ? props.x : offset.left,
		y: isNumber(props.y) ? props.y : offset.top,
		width: isNumber(props.width) ? props.width : offset.width,
		height: isNumber(props.height) ? props.height : offset.height
	});
	var x = propsIncludingDefaults.x, y = propsIncludingDefaults.y, width = propsIncludingDefaults.width, height = propsIncludingDefaults.height, syncWithTicks = propsIncludingDefaults.syncWithTicks, horizontalValues = propsIncludingDefaults.horizontalValues, verticalValues = propsIncludingDefaults.verticalValues;
	var xAxis = useArbitraryXAxis();
	var yAxis = useYAxisWithFiniteDomainOrRandom();
	if (!isNumber(width) || width <= 0 || !isNumber(height) || height <= 0 || !isNumber(x) || x !== +x || !isNumber(y) || y !== +y) return null;
	var verticalCoordinatesGenerator = propsIncludingDefaults.verticalCoordinatesGenerator || defaultVerticalCoordinatesGenerator;
	var horizontalCoordinatesGenerator = propsIncludingDefaults.horizontalCoordinatesGenerator || defaultHorizontalCoordinatesGenerator;
	var horizontalPoints = propsIncludingDefaults.horizontalPoints, verticalPoints = propsIncludingDefaults.verticalPoints;
	if ((!horizontalPoints || !horizontalPoints.length) && (0, import_isFunction.default)(horizontalCoordinatesGenerator)) {
		var isHorizontalValues = horizontalValues && horizontalValues.length;
		var generatorResult = horizontalCoordinatesGenerator({
			yAxis: yAxis ? _objectSpread$10(_objectSpread$10({}, yAxis), {}, { ticks: isHorizontalValues ? horizontalValues : yAxis.ticks }) : void 0,
			width: chartWidth,
			height: chartHeight,
			offset
		}, isHorizontalValues ? true : syncWithTicks);
		warn(Array.isArray(generatorResult), "horizontalCoordinatesGenerator should return Array but instead it returned [".concat(_typeof$13(generatorResult), "]"));
		if (Array.isArray(generatorResult)) horizontalPoints = generatorResult;
	}
	if ((!verticalPoints || !verticalPoints.length) && (0, import_isFunction.default)(verticalCoordinatesGenerator)) {
		var isVerticalValues = verticalValues && verticalValues.length;
		var _generatorResult = verticalCoordinatesGenerator({
			xAxis: xAxis ? _objectSpread$10(_objectSpread$10({}, xAxis), {}, { ticks: isVerticalValues ? verticalValues : xAxis.ticks }) : void 0,
			width: chartWidth,
			height: chartHeight,
			offset
		}, isVerticalValues ? true : syncWithTicks);
		warn(Array.isArray(_generatorResult), "verticalCoordinatesGenerator should return Array but instead it returned [".concat(_typeof$13(_generatorResult), "]"));
		if (Array.isArray(_generatorResult)) verticalPoints = _generatorResult;
	}
	return /*#__PURE__*/ import_react.createElement("g", { className: "recharts-cartesian-grid" }, /*#__PURE__*/ import_react.createElement(Background, {
		fill: propsIncludingDefaults.fill,
		fillOpacity: propsIncludingDefaults.fillOpacity,
		x: propsIncludingDefaults.x,
		y: propsIncludingDefaults.y,
		width: propsIncludingDefaults.width,
		height: propsIncludingDefaults.height,
		ry: propsIncludingDefaults.ry
	}), /*#__PURE__*/ import_react.createElement(HorizontalGridLines, _extends$11({}, propsIncludingDefaults, {
		offset,
		horizontalPoints,
		xAxis,
		yAxis
	})), /*#__PURE__*/ import_react.createElement(VerticalGridLines, _extends$11({}, propsIncludingDefaults, {
		offset,
		verticalPoints,
		xAxis,
		yAxis
	})), /*#__PURE__*/ import_react.createElement(HorizontalStripes, _extends$11({}, propsIncludingDefaults, { horizontalPoints })), /*#__PURE__*/ import_react.createElement(VerticalStripes, _extends$11({}, propsIncludingDefaults, { verticalPoints })));
}
CartesianGrid.displayName = "CartesianGrid";
//#endregion
//#region node_modules/recharts/es6/shape/Curve.js
/**
* @fileOverview Curve
*/
function _typeof$12(o) {
	"@babel/helpers - typeof";
	return _typeof$12 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$12(o);
}
function _extends$10() {
	_extends$10 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$10.apply(this, arguments);
}
function ownKeys$9(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$9(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$9(Object(t), !0).forEach(function(r) {
			_defineProperty$12(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$9(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$12(obj, key, value) {
	key = _toPropertyKey$12(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$12(t) {
	var i = _toPrimitive$12(t, "string");
	return "symbol" == _typeof$12(i) ? i : i + "";
}
function _toPrimitive$12(t, r) {
	if ("object" != _typeof$12(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$12(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var CURVE_FACTORIES = {
	curveBasisClosed: basisClosed_default,
	curveBasisOpen: basisOpen_default,
	curveBasis: basis_default,
	curveBumpX: bumpX,
	curveBumpY: bumpY,
	curveLinearClosed: linearClosed_default,
	curveLinear: linear_default,
	curveMonotoneX: monotoneX,
	curveMonotoneY: monotoneY,
	curveNatural: natural_default,
	curveStep: step_default,
	curveStepAfter: stepAfter,
	curveStepBefore: stepBefore
};
var defined = function defined(p) {
	return p.x === +p.x && p.y === +p.y;
};
var getX = function getX(p) {
	return p.x;
};
var getY = function getY(p) {
	return p.y;
};
var getCurveFactory = function getCurveFactory(type, layout) {
	if ((0, import_isFunction.default)(type)) return type;
	var name = "curve".concat((0, import_upperFirst.default)(type));
	if ((name === "curveMonotone" || name === "curveBump") && layout) return CURVE_FACTORIES["".concat(name).concat(layout === "vertical" ? "Y" : "X")];
	return CURVE_FACTORIES[name] || linear_default;
};
/**
* Calculate the path of curve. Returns null if points is an empty array.
* @return path or null
*/
var getPath$1 = function getPath(_ref) {
	var _ref$type = _ref.type, type = _ref$type === void 0 ? "linear" : _ref$type, _ref$points = _ref.points, points = _ref$points === void 0 ? [] : _ref$points, baseLine = _ref.baseLine, layout = _ref.layout, _ref$connectNulls = _ref.connectNulls, connectNulls = _ref$connectNulls === void 0 ? false : _ref$connectNulls;
	var curveFactory = getCurveFactory(type, layout);
	var formatPoints = connectNulls ? points.filter(function(entry) {
		return defined(entry);
	}) : points;
	var lineFunction;
	if (Array.isArray(baseLine)) {
		var formatBaseLine = connectNulls ? baseLine.filter(function(base) {
			return defined(base);
		}) : baseLine;
		var areaPoints = formatPoints.map(function(entry, index) {
			return _objectSpread$9(_objectSpread$9({}, entry), {}, { base: formatBaseLine[index] });
		});
		if (layout === "vertical") lineFunction = area_default().y(getY).x1(getX).x0(function(d) {
			return d.base.x;
		});
		else lineFunction = area_default().x(getX).y1(getY).y0(function(d) {
			return d.base.y;
		});
		lineFunction.defined(defined).curve(curveFactory);
		return lineFunction(areaPoints);
	}
	if (layout === "vertical" && isNumber(baseLine)) lineFunction = area_default().y(getY).x1(getX).x0(baseLine);
	else if (isNumber(baseLine)) lineFunction = area_default().x(getX).y1(getY).y0(baseLine);
	else lineFunction = line_default().x(getX).y(getY);
	lineFunction.defined(defined).curve(curveFactory);
	return lineFunction(formatPoints);
};
var Curve = function Curve(props) {
	var className = props.className, points = props.points, path = props.path, pathRef = props.pathRef;
	if ((!points || !points.length) && !path) return null;
	var realPath = points && points.length ? getPath$1(props) : path;
	return /*#__PURE__*/ import_react.createElement("path", _extends$10({}, filterProps(props, false), adaptEventHandlers(props), {
		className: clsx("recharts-curve", className),
		d: realPath,
		ref: pathRef
	}));
};
//#endregion
//#region node_modules/recharts/es6/shape/Dot.js
/**
* @fileOverview Dot
*/
function _extends$9() {
	_extends$9 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$9.apply(this, arguments);
}
var Dot = function Dot(props) {
	var cx = props.cx, cy = props.cy, r = props.r, className = props.className;
	var layerClass = clsx("recharts-dot", className);
	if (cx === +cx && cy === +cy && r === +r) return /*#__PURE__*/ import_react.createElement("circle", _extends$9({}, filterProps(props, false), adaptEventHandlers(props), {
		className: layerClass,
		cx,
		cy,
		r
	}));
	return null;
};
//#endregion
//#region node_modules/recharts/es6/cartesian/Area.js
/**
* @fileOverview Area
*/
var _excluded$2 = [
	"layout",
	"type",
	"stroke",
	"connectNulls",
	"isRange",
	"ref"
], _excluded2$1 = ["key"];
var _Area;
function _typeof$11(o) {
	"@babel/helpers - typeof";
	return _typeof$11 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$11(o);
}
function _objectWithoutProperties$2(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$2(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$2(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _extends$8() {
	_extends$8 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$8.apply(this, arguments);
}
function ownKeys$8(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$8(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$8(Object(t), !0).forEach(function(r) {
			_defineProperty$11(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$8(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _classCallCheck$8(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$8(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$11(descriptor.key), descriptor);
	}
}
function _createClass$8(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$8(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$8(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$7(t, o, e) {
	return o = _getPrototypeOf$7(o), _possibleConstructorReturn$7(t, _isNativeReflectConstruct$7() ? Reflect.construct(o, e || [], _getPrototypeOf$7(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$7(self, call) {
	if (call && (_typeof$11(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$7(self);
}
function _assertThisInitialized$7(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$7() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$7 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$7(o) {
	_getPrototypeOf$7 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$7(o);
}
function _inherits$7(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$7(subClass, superClass);
}
function _setPrototypeOf$7(o, p) {
	_setPrototypeOf$7 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$7(o, p);
}
function _defineProperty$11(obj, key, value) {
	key = _toPropertyKey$11(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$11(t) {
	var i = _toPrimitive$11(t, "string");
	return "symbol" == _typeof$11(i) ? i : i + "";
}
function _toPrimitive$11(t, r) {
	if ("object" != _typeof$11(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$11(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var Area = /*#__PURE__*/ function(_PureComponent) {
	function Area() {
		var _this;
		_classCallCheck$8(this, Area);
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		_this = _callSuper$7(this, Area, [].concat(args));
		_defineProperty$11(_this, "state", { isAnimationFinished: true });
		_defineProperty$11(_this, "id", uniqueId("recharts-area-"));
		_defineProperty$11(_this, "handleAnimationEnd", function() {
			var onAnimationEnd = _this.props.onAnimationEnd;
			_this.setState({ isAnimationFinished: true });
			if ((0, import_isFunction.default)(onAnimationEnd)) onAnimationEnd();
		});
		_defineProperty$11(_this, "handleAnimationStart", function() {
			var onAnimationStart = _this.props.onAnimationStart;
			_this.setState({ isAnimationFinished: false });
			if ((0, import_isFunction.default)(onAnimationStart)) onAnimationStart();
		});
		return _this;
	}
	_inherits$7(Area, _PureComponent);
	return _createClass$8(Area, [
		{
			key: "renderDots",
			value: function renderDots(needClip, clipDot, clipPathId) {
				var isAnimationActive = this.props.isAnimationActive;
				var isAnimationFinished = this.state.isAnimationFinished;
				if (isAnimationActive && !isAnimationFinished) return null;
				var _this$props = this.props, dot = _this$props.dot, points = _this$props.points, dataKey = _this$props.dataKey;
				var areaProps = filterProps(this.props, false);
				var customDotProps = filterProps(dot, true);
				var dots = points.map(function(entry, i) {
					var dotProps = _objectSpread$8(_objectSpread$8(_objectSpread$8({
						key: "dot-".concat(i),
						r: 3
					}, areaProps), customDotProps), {}, {
						index: i,
						cx: entry.x,
						cy: entry.y,
						dataKey,
						value: entry.value,
						payload: entry.payload,
						points
					});
					return Area.renderDotItem(dot, dotProps);
				});
				var dotsProps = { clipPath: needClip ? "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")") : null };
				return /*#__PURE__*/ import_react.createElement(Layer, _extends$8({ className: "recharts-area-dots" }, dotsProps), dots);
			}
		},
		{
			key: "renderHorizontalRect",
			value: function renderHorizontalRect(alpha) {
				var _this$props2 = this.props, baseLine = _this$props2.baseLine, points = _this$props2.points, strokeWidth = _this$props2.strokeWidth;
				var startX = points[0].x;
				var endX = points[points.length - 1].x;
				var width = alpha * Math.abs(startX - endX);
				var maxY = (0, import_max.default)(points.map(function(entry) {
					return entry.y || 0;
				}));
				if (isNumber(baseLine) && typeof baseLine === "number") maxY = Math.max(baseLine, maxY);
				else if (baseLine && Array.isArray(baseLine) && baseLine.length) maxY = Math.max((0, import_max.default)(baseLine.map(function(entry) {
					return entry.y || 0;
				})), maxY);
				if (isNumber(maxY)) return /*#__PURE__*/ import_react.createElement("rect", {
					x: startX < endX ? startX : startX - width,
					y: 0,
					width,
					height: Math.floor(maxY + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1))
				});
				return null;
			}
		},
		{
			key: "renderVerticalRect",
			value: function renderVerticalRect(alpha) {
				var _this$props3 = this.props, baseLine = _this$props3.baseLine, points = _this$props3.points, strokeWidth = _this$props3.strokeWidth;
				var startY = points[0].y;
				var endY = points[points.length - 1].y;
				var height = alpha * Math.abs(startY - endY);
				var maxX = (0, import_max.default)(points.map(function(entry) {
					return entry.x || 0;
				}));
				if (isNumber(baseLine) && typeof baseLine === "number") maxX = Math.max(baseLine, maxX);
				else if (baseLine && Array.isArray(baseLine) && baseLine.length) maxX = Math.max((0, import_max.default)(baseLine.map(function(entry) {
					return entry.x || 0;
				})), maxX);
				if (isNumber(maxX)) return /*#__PURE__*/ import_react.createElement("rect", {
					x: 0,
					y: startY < endY ? startY : startY - height,
					width: maxX + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1),
					height: Math.floor(height)
				});
				return null;
			}
		},
		{
			key: "renderClipRect",
			value: function renderClipRect(alpha) {
				if (this.props.layout === "vertical") return this.renderVerticalRect(alpha);
				return this.renderHorizontalRect(alpha);
			}
		},
		{
			key: "renderAreaStatically",
			value: function renderAreaStatically(points, baseLine, needClip, clipPathId) {
				var _this$props4 = this.props, layout = _this$props4.layout, type = _this$props4.type, stroke = _this$props4.stroke, connectNulls = _this$props4.connectNulls, isRange = _this$props4.isRange;
				_this$props4.ref;
				var others = _objectWithoutProperties$2(_this$props4, _excluded$2);
				return /*#__PURE__*/ import_react.createElement(Layer, { clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null }, /*#__PURE__*/ import_react.createElement(Curve, _extends$8({}, filterProps(others, true), {
					points,
					connectNulls,
					type,
					baseLine,
					layout,
					stroke: "none",
					className: "recharts-area-area"
				})), stroke !== "none" && /*#__PURE__*/ import_react.createElement(Curve, _extends$8({}, filterProps(this.props, false), {
					className: "recharts-area-curve",
					layout,
					type,
					connectNulls,
					fill: "none",
					points
				})), stroke !== "none" && isRange && /*#__PURE__*/ import_react.createElement(Curve, _extends$8({}, filterProps(this.props, false), {
					className: "recharts-area-curve",
					layout,
					type,
					connectNulls,
					fill: "none",
					points: baseLine
				})));
			}
		},
		{
			key: "renderAreaWithAnimation",
			value: function renderAreaWithAnimation(needClip, clipPathId) {
				var _this2 = this;
				var _this$props5 = this.props, points = _this$props5.points, baseLine = _this$props5.baseLine, isAnimationActive = _this$props5.isAnimationActive, animationBegin = _this$props5.animationBegin, animationDuration = _this$props5.animationDuration, animationEasing = _this$props5.animationEasing, animationId = _this$props5.animationId;
				var _this$state = this.state, prevPoints = _this$state.prevPoints, prevBaseLine = _this$state.prevBaseLine;
				return /*#__PURE__*/ import_react.createElement(es6_default, {
					begin: animationBegin,
					duration: animationDuration,
					isActive: isAnimationActive,
					easing: animationEasing,
					from: { t: 0 },
					to: { t: 1 },
					key: "area-".concat(animationId),
					onAnimationEnd: this.handleAnimationEnd,
					onAnimationStart: this.handleAnimationStart
				}, function(_ref) {
					var t = _ref.t;
					if (prevPoints) {
						var prevPointsDiffFactor = prevPoints.length / points.length;
						var stepPoints = points.map(function(entry, index) {
							var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
							if (prevPoints[prevPointIndex]) {
								var prev = prevPoints[prevPointIndex];
								var interpolatorX = interpolateNumber$1(prev.x, entry.x);
								var interpolatorY = interpolateNumber$1(prev.y, entry.y);
								return _objectSpread$8(_objectSpread$8({}, entry), {}, {
									x: interpolatorX(t),
									y: interpolatorY(t)
								});
							}
							return entry;
						});
						var stepBaseLine;
						if (isNumber(baseLine) && typeof baseLine === "number") stepBaseLine = interpolateNumber$1(prevBaseLine, baseLine)(t);
						else if ((0, import_isNil.default)(baseLine) || (0, import_isNaN.default)(baseLine)) stepBaseLine = interpolateNumber$1(prevBaseLine, 0)(t);
						else stepBaseLine = baseLine.map(function(entry, index) {
							var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
							if (prevBaseLine[prevPointIndex]) {
								var prev = prevBaseLine[prevPointIndex];
								var interpolatorX = interpolateNumber$1(prev.x, entry.x);
								var interpolatorY = interpolateNumber$1(prev.y, entry.y);
								return _objectSpread$8(_objectSpread$8({}, entry), {}, {
									x: interpolatorX(t),
									y: interpolatorY(t)
								});
							}
							return entry;
						});
						return _this2.renderAreaStatically(stepPoints, stepBaseLine, needClip, clipPathId);
					}
					return /*#__PURE__*/ import_react.createElement(Layer, null, /*#__PURE__*/ import_react.createElement("defs", null, /*#__PURE__*/ import_react.createElement("clipPath", { id: "animationClipPath-".concat(clipPathId) }, _this2.renderClipRect(t))), /*#__PURE__*/ import_react.createElement(Layer, { clipPath: "url(#animationClipPath-".concat(clipPathId, ")") }, _this2.renderAreaStatically(points, baseLine, needClip, clipPathId)));
				});
			}
		},
		{
			key: "renderArea",
			value: function renderArea(needClip, clipPathId) {
				var _this$props6 = this.props, points = _this$props6.points, baseLine = _this$props6.baseLine, isAnimationActive = _this$props6.isAnimationActive;
				var _this$state2 = this.state, prevPoints = _this$state2.prevPoints, prevBaseLine = _this$state2.prevBaseLine, totalLength = _this$state2.totalLength;
				if (isAnimationActive && points && points.length && (!prevPoints && totalLength > 0 || !(0, import_isEqual.default)(prevPoints, points) || !(0, import_isEqual.default)(prevBaseLine, baseLine))) return this.renderAreaWithAnimation(needClip, clipPathId);
				return this.renderAreaStatically(points, baseLine, needClip, clipPathId);
			}
		},
		{
			key: "render",
			value: function render() {
				var _filterProps;
				var _this$props7 = this.props, hide = _this$props7.hide, dot = _this$props7.dot, points = _this$props7.points, className = _this$props7.className, top = _this$props7.top, left = _this$props7.left, xAxis = _this$props7.xAxis, yAxis = _this$props7.yAxis, width = _this$props7.width, height = _this$props7.height, isAnimationActive = _this$props7.isAnimationActive, id = _this$props7.id;
				if (hide || !points || !points.length) return null;
				var isAnimationFinished = this.state.isAnimationFinished;
				var hasSinglePoint = points.length === 1;
				var layerClass = clsx("recharts-area", className);
				var needClipX = xAxis && xAxis.allowDataOverflow;
				var needClipY = yAxis && yAxis.allowDataOverflow;
				var needClip = needClipX || needClipY;
				var clipPathId = (0, import_isNil.default)(id) ? this.id : id;
				var _ref2 = (_filterProps = filterProps(dot, false)) !== null && _filterProps !== void 0 ? _filterProps : {
					r: 3,
					strokeWidth: 2
				}, _ref2$r = _ref2.r, r = _ref2$r === void 0 ? 3 : _ref2$r, _ref2$strokeWidth = _ref2.strokeWidth, strokeWidth = _ref2$strokeWidth === void 0 ? 2 : _ref2$strokeWidth;
				var _ref3$clipDot = (hasClipDot(dot) ? dot : {}).clipDot, clipDot = _ref3$clipDot === void 0 ? true : _ref3$clipDot;
				var dotSize = r * 2 + strokeWidth;
				return /*#__PURE__*/ import_react.createElement(Layer, { className: layerClass }, needClipX || needClipY ? /*#__PURE__*/ import_react.createElement("defs", null, /*#__PURE__*/ import_react.createElement("clipPath", { id: "clipPath-".concat(clipPathId) }, /*#__PURE__*/ import_react.createElement("rect", {
					x: needClipX ? left : left - width / 2,
					y: needClipY ? top : top - height / 2,
					width: needClipX ? width : width * 2,
					height: needClipY ? height : height * 2
				})), !clipDot && /*#__PURE__*/ import_react.createElement("clipPath", { id: "clipPath-dots-".concat(clipPathId) }, /*#__PURE__*/ import_react.createElement("rect", {
					x: left - dotSize / 2,
					y: top - dotSize / 2,
					width: width + dotSize,
					height: height + dotSize
				}))) : null, !hasSinglePoint ? this.renderArea(needClip, clipPathId) : null, (dot || hasSinglePoint) && this.renderDots(needClip, clipDot, clipPathId), (!isAnimationActive || isAnimationFinished) && LabelList.renderCallByParent(this.props, points));
			}
		}
	], [{
		key: "getDerivedStateFromProps",
		value: function getDerivedStateFromProps(nextProps, prevState) {
			if (nextProps.animationId !== prevState.prevAnimationId) return {
				prevAnimationId: nextProps.animationId,
				curPoints: nextProps.points,
				curBaseLine: nextProps.baseLine,
				prevPoints: prevState.curPoints,
				prevBaseLine: prevState.curBaseLine
			};
			if (nextProps.points !== prevState.curPoints || nextProps.baseLine !== prevState.curBaseLine) return {
				curPoints: nextProps.points,
				curBaseLine: nextProps.baseLine
			};
			return null;
		}
	}]);
}(import_react.PureComponent);
_Area = Area;
_defineProperty$11(Area, "displayName", "Area");
_defineProperty$11(Area, "defaultProps", {
	stroke: "#3182bd",
	fill: "#3182bd",
	fillOpacity: .6,
	xAxisId: 0,
	yAxisId: 0,
	legendType: "line",
	connectNulls: false,
	points: [],
	dot: false,
	activeDot: true,
	hide: false,
	isAnimationActive: !Global.isSsr,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease"
});
_defineProperty$11(Area, "getBaseValue", function(props, item, xAxis, yAxis) {
	var layout = props.layout, chartBaseValue = props.baseValue;
	var itemBaseValue = item.props.baseValue;
	var baseValue = itemBaseValue !== null && itemBaseValue !== void 0 ? itemBaseValue : chartBaseValue;
	if (isNumber(baseValue) && typeof baseValue === "number") return baseValue;
	var numericAxis = layout === "horizontal" ? yAxis : xAxis;
	var domain = numericAxis.scale.domain();
	if (numericAxis.type === "number") {
		var domainMax = Math.max(domain[0], domain[1]);
		var domainMin = Math.min(domain[0], domain[1]);
		if (baseValue === "dataMin") return domainMin;
		if (baseValue === "dataMax") return domainMax;
		return domainMax < 0 ? domainMax : Math.max(Math.min(domain[0], domain[1]), 0);
	}
	if (baseValue === "dataMin") return domain[0];
	if (baseValue === "dataMax") return domain[1];
	return domain[0];
});
_defineProperty$11(Area, "getComposedData", function(_ref4) {
	var props = _ref4.props, item = _ref4.item, xAxis = _ref4.xAxis, yAxis = _ref4.yAxis, xAxisTicks = _ref4.xAxisTicks, yAxisTicks = _ref4.yAxisTicks, bandSize = _ref4.bandSize, dataKey = _ref4.dataKey, stackedData = _ref4.stackedData, dataStartIndex = _ref4.dataStartIndex, displayedData = _ref4.displayedData, offset = _ref4.offset;
	var layout = props.layout;
	var hasStack = stackedData && stackedData.length;
	var baseValue = _Area.getBaseValue(props, item, xAxis, yAxis);
	var isHorizontalLayout = layout === "horizontal";
	var isRange = false;
	var points = displayedData.map(function(entry, index) {
		var value;
		if (hasStack) value = stackedData[dataStartIndex + index];
		else {
			value = getValueByDataKey(entry, dataKey);
			if (!Array.isArray(value)) value = [baseValue, value];
			else isRange = true;
		}
		var isBreakPoint = value[1] == null || hasStack && getValueByDataKey(entry, dataKey) == null;
		if (isHorizontalLayout) return {
			x: getCateCoordinateOfLine({
				axis: xAxis,
				ticks: xAxisTicks,
				bandSize,
				entry,
				index
			}),
			y: isBreakPoint ? null : yAxis.scale(value[1]),
			value,
			payload: entry
		};
		return {
			x: isBreakPoint ? null : xAxis.scale(value[1]),
			y: getCateCoordinateOfLine({
				axis: yAxis,
				ticks: yAxisTicks,
				bandSize,
				entry,
				index
			}),
			value,
			payload: entry
		};
	});
	var baseLine;
	if (hasStack || isRange) baseLine = points.map(function(entry) {
		var x = Array.isArray(entry.value) ? entry.value[0] : null;
		if (isHorizontalLayout) return {
			x: entry.x,
			y: x != null && entry.y != null ? yAxis.scale(x) : null
		};
		return {
			x: x != null ? xAxis.scale(x) : null,
			y: entry.y
		};
	});
	else baseLine = isHorizontalLayout ? yAxis.scale(baseValue) : xAxis.scale(baseValue);
	return _objectSpread$8({
		points,
		baseLine,
		layout,
		isRange
	}, offset);
});
_defineProperty$11(Area, "renderDotItem", function(option, props) {
	var dotItem;
	if (/*#__PURE__*/ import_react.isValidElement(option)) dotItem = /*#__PURE__*/ import_react.cloneElement(option, props);
	else if ((0, import_isFunction.default)(option)) dotItem = option(props);
	else {
		var className = clsx("recharts-area-dot", typeof option !== "boolean" ? option.className : "");
		var key = props.key, rest = _objectWithoutProperties$2(props, _excluded2$1);
		dotItem = /*#__PURE__*/ import_react.createElement(Dot, _extends$8({}, rest, {
			key,
			className
		}));
	}
	return dotItem;
});
//#endregion
//#region node_modules/recharts/es6/cartesian/XAxis.js
/**
* @fileOverview X Axis
*/
function _typeof$10(o) {
	"@babel/helpers - typeof";
	return _typeof$10 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$10(o);
}
function _classCallCheck$7(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$7(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$10(descriptor.key), descriptor);
	}
}
function _createClass$7(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$7(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$7(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$6(t, o, e) {
	return o = _getPrototypeOf$6(o), _possibleConstructorReturn$6(t, _isNativeReflectConstruct$6() ? Reflect.construct(o, e || [], _getPrototypeOf$6(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$6(self, call) {
	if (call && (_typeof$10(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$6(self);
}
function _assertThisInitialized$6(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$6() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$6 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$6(o) {
	_getPrototypeOf$6 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$6(o);
}
function _inherits$6(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$6(subClass, superClass);
}
function _setPrototypeOf$6(o, p) {
	_setPrototypeOf$6 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$6(o, p);
}
function _defineProperty$10(obj, key, value) {
	key = _toPropertyKey$10(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$10(t) {
	var i = _toPrimitive$10(t, "string");
	return "symbol" == _typeof$10(i) ? i : i + "";
}
function _toPrimitive$10(t, r) {
	if ("object" != _typeof$10(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$10(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _extends$7() {
	_extends$7 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$7.apply(this, arguments);
}
/** Define of XAxis props */
function XAxisImpl(_ref) {
	var xAxisId = _ref.xAxisId;
	var width = useChartWidth();
	var height = useChartHeight();
	var axisOptions = useXAxisOrThrow(xAxisId);
	if (axisOptions == null) return null;
	return /*#__PURE__*/ import_react.createElement(CartesianAxis, _extends$7({}, axisOptions, {
		className: clsx("recharts-".concat(axisOptions.axisType, " ").concat(axisOptions.axisType), axisOptions.className),
		viewBox: {
			x: 0,
			y: 0,
			width,
			height
		},
		ticksGenerator: function ticksGenerator(axis) {
			return getTicksOfAxis(axis, true);
		}
	}));
}
var XAxis = /*#__PURE__*/ function(_React$Component) {
	function XAxis() {
		_classCallCheck$7(this, XAxis);
		return _callSuper$6(this, XAxis, arguments);
	}
	_inherits$6(XAxis, _React$Component);
	return _createClass$7(XAxis, [{
		key: "render",
		value: function render() {
			return /*#__PURE__*/ import_react.createElement(XAxisImpl, this.props);
		}
	}]);
}(import_react.Component);
_defineProperty$10(XAxis, "displayName", "XAxis");
_defineProperty$10(XAxis, "defaultProps", {
	allowDecimals: true,
	hide: false,
	orientation: "bottom",
	width: 0,
	height: 30,
	mirror: false,
	xAxisId: 0,
	tickCount: 5,
	type: "category",
	padding: {
		left: 0,
		right: 0
	},
	allowDataOverflow: false,
	scale: "auto",
	reversed: false,
	allowDuplicatedCategory: true
});
//#endregion
//#region node_modules/recharts/es6/cartesian/YAxis.js
/**
* @fileOverview Y Axis
*/
function _typeof$9(o) {
	"@babel/helpers - typeof";
	return _typeof$9 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$9(o);
}
function _classCallCheck$6(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$6(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$9(descriptor.key), descriptor);
	}
}
function _createClass$6(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$6(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$6(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$5(t, o, e) {
	return o = _getPrototypeOf$5(o), _possibleConstructorReturn$5(t, _isNativeReflectConstruct$5() ? Reflect.construct(o, e || [], _getPrototypeOf$5(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$5(self, call) {
	if (call && (_typeof$9(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$5(self);
}
function _assertThisInitialized$5(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$5() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$5 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$5(o) {
	_getPrototypeOf$5 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$5(o);
}
function _inherits$5(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$5(subClass, superClass);
}
function _setPrototypeOf$5(o, p) {
	_setPrototypeOf$5 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$5(o, p);
}
function _defineProperty$9(obj, key, value) {
	key = _toPropertyKey$9(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$9(t) {
	var i = _toPrimitive$9(t, "string");
	return "symbol" == _typeof$9(i) ? i : i + "";
}
function _toPrimitive$9(t, r) {
	if ("object" != _typeof$9(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$9(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _extends$6() {
	_extends$6 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$6.apply(this, arguments);
}
var YAxisImpl = function YAxisImpl(_ref) {
	var yAxisId = _ref.yAxisId;
	var width = useChartWidth();
	var height = useChartHeight();
	var axisOptions = useYAxisOrThrow(yAxisId);
	if (axisOptions == null) return null;
	return /*#__PURE__*/ import_react.createElement(CartesianAxis, _extends$6({}, axisOptions, {
		className: clsx("recharts-".concat(axisOptions.axisType, " ").concat(axisOptions.axisType), axisOptions.className),
		viewBox: {
			x: 0,
			y: 0,
			width,
			height
		},
		ticksGenerator: function ticksGenerator(axis) {
			return getTicksOfAxis(axis, true);
		}
	}));
};
var YAxis = /*#__PURE__*/ function(_React$Component) {
	function YAxis() {
		_classCallCheck$6(this, YAxis);
		return _callSuper$5(this, YAxis, arguments);
	}
	_inherits$5(YAxis, _React$Component);
	return _createClass$6(YAxis, [{
		key: "render",
		value: function render() {
			return /*#__PURE__*/ import_react.createElement(YAxisImpl, this.props);
		}
	}]);
}(import_react.Component);
_defineProperty$9(YAxis, "displayName", "YAxis");
_defineProperty$9(YAxis, "defaultProps", {
	allowDuplicatedCategory: true,
	allowDecimals: true,
	hide: false,
	orientation: "left",
	width: 60,
	height: 0,
	mirror: false,
	yAxisId: 0,
	tickCount: 5,
	type: "number",
	padding: {
		top: 0,
		bottom: 0
	},
	allowDataOverflow: false,
	scale: "auto",
	reversed: false
});
//#endregion
//#region node_modules/recharts/es6/util/CssPrefixUtils.js
var import_range = /* @__PURE__ */ __toESM(require_range());
function _typeof$8(o) {
	"@babel/helpers - typeof";
	return _typeof$8 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$8(o);
}
function ownKeys$7(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$7(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$7(Object(t), !0).forEach(function(r) {
			_defineProperty$8(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$7(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$8(obj, key, value) {
	key = _toPropertyKey$8(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$8(t) {
	var i = _toPrimitive$8(t, "string");
	return "symbol" == _typeof$8(i) ? i : i + "";
}
function _toPrimitive$8(t, r) {
	if ("object" != _typeof$8(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$8(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var PREFIX_LIST = [
	"Webkit",
	"Moz",
	"O",
	"ms"
];
var generatePrefixStyle = function generatePrefixStyle(name, value) {
	if (!name) return null;
	var camelName = name.replace(/(\w)/, function(v) {
		return v.toUpperCase();
	});
	var result = PREFIX_LIST.reduce(function(res, entry) {
		return _objectSpread$7(_objectSpread$7({}, res), {}, _defineProperty$8({}, entry + camelName, value));
	}, {});
	result[name] = value;
	return result;
};
//#endregion
//#region node_modules/recharts/es6/cartesian/Brush.js
/**
* @fileOverview Brush
*/
function _typeof$7(o) {
	"@babel/helpers - typeof";
	return _typeof$7 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$7(o);
}
function _extends$5() {
	_extends$5 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$5.apply(this, arguments);
}
function ownKeys$6(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$6(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$6(Object(t), !0).forEach(function(r) {
			_defineProperty$7(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$6(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _classCallCheck$5(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$5(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$7(descriptor.key), descriptor);
	}
}
function _createClass$5(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$5(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$5(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$4(t, o, e) {
	return o = _getPrototypeOf$4(o), _possibleConstructorReturn$4(t, _isNativeReflectConstruct$4() ? Reflect.construct(o, e || [], _getPrototypeOf$4(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$4(self, call) {
	if (call && (_typeof$7(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$4(self);
}
function _assertThisInitialized$4(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$4() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$4 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$4(o) {
	_getPrototypeOf$4 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$4(o);
}
function _inherits$4(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$4(subClass, superClass);
}
function _setPrototypeOf$4(o, p) {
	_setPrototypeOf$4 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$4(o, p);
}
function _defineProperty$7(obj, key, value) {
	key = _toPropertyKey$7(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$7(t) {
	var i = _toPrimitive$7(t, "string");
	return "symbol" == _typeof$7(i) ? i : i + "";
}
function _toPrimitive$7(t, r) {
	if ("object" != _typeof$7(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$7(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var createScale = function createScale(_ref) {
	var data = _ref.data, startIndex = _ref.startIndex, endIndex = _ref.endIndex, x = _ref.x, width = _ref.width, travellerWidth = _ref.travellerWidth;
	if (!data || !data.length) return {};
	var len = data.length;
	var scale = point().domain((0, import_range.default)(0, len)).range([x, x + width - travellerWidth]);
	var scaleValues = scale.domain().map(function(entry) {
		return scale(entry);
	});
	return {
		isTextActive: false,
		isSlideMoving: false,
		isTravellerMoving: false,
		isTravellerFocused: false,
		startX: scale(startIndex),
		endX: scale(endIndex),
		scale,
		scaleValues
	};
};
var isTouch = function isTouch(e) {
	return e.changedTouches && !!e.changedTouches.length;
};
var Brush = /*#__PURE__*/ function(_PureComponent) {
	function Brush(props) {
		var _this;
		_classCallCheck$5(this, Brush);
		_this = _callSuper$4(this, Brush, [props]);
		_defineProperty$7(_this, "handleDrag", function(e) {
			if (_this.leaveTimer) {
				clearTimeout(_this.leaveTimer);
				_this.leaveTimer = null;
			}
			if (_this.state.isTravellerMoving) _this.handleTravellerMove(e);
			else if (_this.state.isSlideMoving) _this.handleSlideDrag(e);
		});
		_defineProperty$7(_this, "handleTouchMove", function(e) {
			if (e.changedTouches != null && e.changedTouches.length > 0) _this.handleDrag(e.changedTouches[0]);
		});
		_defineProperty$7(_this, "handleDragEnd", function() {
			_this.setState({
				isTravellerMoving: false,
				isSlideMoving: false
			}, function() {
				var _this$props = _this.props, endIndex = _this$props.endIndex, onDragEnd = _this$props.onDragEnd, startIndex = _this$props.startIndex;
				onDragEnd === null || onDragEnd === void 0 || onDragEnd({
					endIndex,
					startIndex
				});
			});
			_this.detachDragEndListener();
		});
		_defineProperty$7(_this, "handleLeaveWrapper", function() {
			if (_this.state.isTravellerMoving || _this.state.isSlideMoving) _this.leaveTimer = window.setTimeout(_this.handleDragEnd, _this.props.leaveTimeOut);
		});
		_defineProperty$7(_this, "handleEnterSlideOrTraveller", function() {
			_this.setState({ isTextActive: true });
		});
		_defineProperty$7(_this, "handleLeaveSlideOrTraveller", function() {
			_this.setState({ isTextActive: false });
		});
		_defineProperty$7(_this, "handleSlideDragStart", function(e) {
			var event = isTouch(e) ? e.changedTouches[0] : e;
			_this.setState({
				isTravellerMoving: false,
				isSlideMoving: true,
				slideMoveStartX: event.pageX
			});
			_this.attachDragEndListener();
		});
		_this.travellerDragStartHandlers = {
			startX: _this.handleTravellerDragStart.bind(_this, "startX"),
			endX: _this.handleTravellerDragStart.bind(_this, "endX")
		};
		_this.state = {};
		return _this;
	}
	_inherits$4(Brush, _PureComponent);
	return _createClass$5(Brush, [
		{
			key: "componentWillUnmount",
			value: function componentWillUnmount() {
				if (this.leaveTimer) {
					clearTimeout(this.leaveTimer);
					this.leaveTimer = null;
				}
				this.detachDragEndListener();
			}
		},
		{
			key: "getIndex",
			value: function getIndex(_ref2) {
				var startX = _ref2.startX, endX = _ref2.endX;
				var scaleValues = this.state.scaleValues;
				var _this$props2 = this.props, gap = _this$props2.gap;
				var lastIndex = _this$props2.data.length - 1;
				var min = Math.min(startX, endX);
				var max = Math.max(startX, endX);
				var minIndex = Brush.getIndexInRange(scaleValues, min);
				var maxIndex = Brush.getIndexInRange(scaleValues, max);
				return {
					startIndex: minIndex - minIndex % gap,
					endIndex: maxIndex === lastIndex ? lastIndex : maxIndex - maxIndex % gap
				};
			}
		},
		{
			key: "getTextOfTick",
			value: function getTextOfTick(index) {
				var _this$props3 = this.props, data = _this$props3.data, tickFormatter = _this$props3.tickFormatter, dataKey = _this$props3.dataKey;
				var text = getValueByDataKey(data[index], dataKey, index);
				return (0, import_isFunction.default)(tickFormatter) ? tickFormatter(text, index) : text;
			}
		},
		{
			key: "attachDragEndListener",
			value: function attachDragEndListener() {
				window.addEventListener("mouseup", this.handleDragEnd, true);
				window.addEventListener("touchend", this.handleDragEnd, true);
				window.addEventListener("mousemove", this.handleDrag, true);
			}
		},
		{
			key: "detachDragEndListener",
			value: function detachDragEndListener() {
				window.removeEventListener("mouseup", this.handleDragEnd, true);
				window.removeEventListener("touchend", this.handleDragEnd, true);
				window.removeEventListener("mousemove", this.handleDrag, true);
			}
		},
		{
			key: "handleSlideDrag",
			value: function handleSlideDrag(e) {
				var _this$state = this.state, slideMoveStartX = _this$state.slideMoveStartX, startX = _this$state.startX, endX = _this$state.endX;
				var _this$props4 = this.props, x = _this$props4.x, width = _this$props4.width, travellerWidth = _this$props4.travellerWidth, startIndex = _this$props4.startIndex, endIndex = _this$props4.endIndex, onChange = _this$props4.onChange;
				var delta = e.pageX - slideMoveStartX;
				if (delta > 0) delta = Math.min(delta, x + width - travellerWidth - endX, x + width - travellerWidth - startX);
				else if (delta < 0) delta = Math.max(delta, x - startX, x - endX);
				var newIndex = this.getIndex({
					startX: startX + delta,
					endX: endX + delta
				});
				if ((newIndex.startIndex !== startIndex || newIndex.endIndex !== endIndex) && onChange) onChange(newIndex);
				this.setState({
					startX: startX + delta,
					endX: endX + delta,
					slideMoveStartX: e.pageX
				});
			}
		},
		{
			key: "handleTravellerDragStart",
			value: function handleTravellerDragStart(id, e) {
				var event = isTouch(e) ? e.changedTouches[0] : e;
				this.setState({
					isSlideMoving: false,
					isTravellerMoving: true,
					movingTravellerId: id,
					brushMoveStartX: event.pageX
				});
				this.attachDragEndListener();
			}
		},
		{
			key: "handleTravellerMove",
			value: function handleTravellerMove(e) {
				var _this$state2 = this.state, brushMoveStartX = _this$state2.brushMoveStartX, movingTravellerId = _this$state2.movingTravellerId, endX = _this$state2.endX, startX = _this$state2.startX;
				var prevValue = this.state[movingTravellerId];
				var _this$props5 = this.props, x = _this$props5.x, width = _this$props5.width, travellerWidth = _this$props5.travellerWidth, onChange = _this$props5.onChange, gap = _this$props5.gap, data = _this$props5.data;
				var params = {
					startX: this.state.startX,
					endX: this.state.endX
				};
				var delta = e.pageX - brushMoveStartX;
				if (delta > 0) delta = Math.min(delta, x + width - travellerWidth - prevValue);
				else if (delta < 0) delta = Math.max(delta, x - prevValue);
				params[movingTravellerId] = prevValue + delta;
				var newIndex = this.getIndex(params);
				var startIndex = newIndex.startIndex, endIndex = newIndex.endIndex;
				var isFullGap = function isFullGap() {
					var lastIndex = data.length - 1;
					if (movingTravellerId === "startX" && (endX > startX ? startIndex % gap === 0 : endIndex % gap === 0) || endX < startX && endIndex === lastIndex || movingTravellerId === "endX" && (endX > startX ? endIndex % gap === 0 : startIndex % gap === 0) || endX > startX && endIndex === lastIndex) return true;
					return false;
				};
				this.setState(_defineProperty$7(_defineProperty$7({}, movingTravellerId, prevValue + delta), "brushMoveStartX", e.pageX), function() {
					if (onChange) {
						if (isFullGap()) onChange(newIndex);
					}
				});
			}
		},
		{
			key: "handleTravellerMoveKeyboard",
			value: function handleTravellerMoveKeyboard(direction, id) {
				var _this2 = this;
				var _this$state3 = this.state, scaleValues = _this$state3.scaleValues, startX = _this$state3.startX, endX = _this$state3.endX;
				var currentScaleValue = this.state[id];
				var currentIndex = scaleValues.indexOf(currentScaleValue);
				if (currentIndex === -1) return;
				var newIndex = currentIndex + direction;
				if (newIndex === -1 || newIndex >= scaleValues.length) return;
				var newScaleValue = scaleValues[newIndex];
				if (id === "startX" && newScaleValue >= endX || id === "endX" && newScaleValue <= startX) return;
				this.setState(_defineProperty$7({}, id, newScaleValue), function() {
					_this2.props.onChange(_this2.getIndex({
						startX: _this2.state.startX,
						endX: _this2.state.endX
					}));
				});
			}
		},
		{
			key: "renderBackground",
			value: function renderBackground() {
				var _this$props6 = this.props, x = _this$props6.x, y = _this$props6.y, width = _this$props6.width, height = _this$props6.height, fill = _this$props6.fill, stroke = _this$props6.stroke;
				return /*#__PURE__*/ import_react.createElement("rect", {
					stroke,
					fill,
					x,
					y,
					width,
					height
				});
			}
		},
		{
			key: "renderPanorama",
			value: function renderPanorama() {
				var _this$props7 = this.props, x = _this$props7.x, y = _this$props7.y, width = _this$props7.width, height = _this$props7.height, data = _this$props7.data, children = _this$props7.children, padding = _this$props7.padding;
				var chartElement = import_react.Children.only(children);
				if (!chartElement) return null;
				return /*#__PURE__*/ import_react.cloneElement(chartElement, {
					x,
					y,
					width,
					height,
					margin: padding,
					compact: true,
					data
				});
			}
		},
		{
			key: "renderTravellerLayer",
			value: function renderTravellerLayer(travellerX, id) {
				var _data$startIndex, _data$endIndex, _this3 = this;
				var _this$props8 = this.props, y = _this$props8.y, travellerWidth = _this$props8.travellerWidth, height = _this$props8.height, traveller = _this$props8.traveller, ariaLabel = _this$props8.ariaLabel, data = _this$props8.data, startIndex = _this$props8.startIndex, endIndex = _this$props8.endIndex;
				var x = Math.max(travellerX, this.props.x);
				var travellerProps = _objectSpread$6(_objectSpread$6({}, filterProps(this.props, false)), {}, {
					x,
					y,
					width: travellerWidth,
					height
				});
				var ariaLabelBrush = ariaLabel || "Min value: ".concat((_data$startIndex = data[startIndex]) === null || _data$startIndex === void 0 ? void 0 : _data$startIndex.name, ", Max value: ").concat((_data$endIndex = data[endIndex]) === null || _data$endIndex === void 0 ? void 0 : _data$endIndex.name);
				return /*#__PURE__*/ import_react.createElement(Layer, {
					tabIndex: 0,
					role: "slider",
					"aria-label": ariaLabelBrush,
					"aria-valuenow": travellerX,
					className: "recharts-brush-traveller",
					onMouseEnter: this.handleEnterSlideOrTraveller,
					onMouseLeave: this.handleLeaveSlideOrTraveller,
					onMouseDown: this.travellerDragStartHandlers[id],
					onTouchStart: this.travellerDragStartHandlers[id],
					onKeyDown: function onKeyDown(e) {
						if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
						e.preventDefault();
						e.stopPropagation();
						_this3.handleTravellerMoveKeyboard(e.key === "ArrowRight" ? 1 : -1, id);
					},
					onFocus: function onFocus() {
						_this3.setState({ isTravellerFocused: true });
					},
					onBlur: function onBlur() {
						_this3.setState({ isTravellerFocused: false });
					},
					style: { cursor: "col-resize" }
				}, Brush.renderTraveller(traveller, travellerProps));
			}
		},
		{
			key: "renderSlide",
			value: function renderSlide(startX, endX) {
				var _this$props9 = this.props, y = _this$props9.y, height = _this$props9.height, stroke = _this$props9.stroke, travellerWidth = _this$props9.travellerWidth;
				var x = Math.min(startX, endX) + travellerWidth;
				var width = Math.max(Math.abs(endX - startX) - travellerWidth, 0);
				return /*#__PURE__*/ import_react.createElement("rect", {
					className: "recharts-brush-slide",
					onMouseEnter: this.handleEnterSlideOrTraveller,
					onMouseLeave: this.handleLeaveSlideOrTraveller,
					onMouseDown: this.handleSlideDragStart,
					onTouchStart: this.handleSlideDragStart,
					style: { cursor: "move" },
					stroke: "none",
					fill: stroke,
					fillOpacity: .2,
					x,
					y,
					width,
					height
				});
			}
		},
		{
			key: "renderText",
			value: function renderText() {
				var _this$props10 = this.props, startIndex = _this$props10.startIndex, endIndex = _this$props10.endIndex, y = _this$props10.y, height = _this$props10.height, travellerWidth = _this$props10.travellerWidth, stroke = _this$props10.stroke;
				var _this$state4 = this.state, startX = _this$state4.startX, endX = _this$state4.endX;
				var offset = 5;
				var attrs = {
					pointerEvents: "none",
					fill: stroke
				};
				return /*#__PURE__*/ import_react.createElement(Layer, { className: "recharts-brush-texts" }, /*#__PURE__*/ import_react.createElement(Text, _extends$5({
					textAnchor: "end",
					verticalAnchor: "middle",
					x: Math.min(startX, endX) - offset,
					y: y + height / 2
				}, attrs), this.getTextOfTick(startIndex)), /*#__PURE__*/ import_react.createElement(Text, _extends$5({
					textAnchor: "start",
					verticalAnchor: "middle",
					x: Math.max(startX, endX) + travellerWidth + offset,
					y: y + height / 2
				}, attrs), this.getTextOfTick(endIndex)));
			}
		},
		{
			key: "render",
			value: function render() {
				var _this$props11 = this.props, data = _this$props11.data, className = _this$props11.className, children = _this$props11.children, x = _this$props11.x, y = _this$props11.y, width = _this$props11.width, height = _this$props11.height, alwaysShowText = _this$props11.alwaysShowText;
				var _this$state5 = this.state, startX = _this$state5.startX, endX = _this$state5.endX, isTextActive = _this$state5.isTextActive, isSlideMoving = _this$state5.isSlideMoving, isTravellerMoving = _this$state5.isTravellerMoving, isTravellerFocused = _this$state5.isTravellerFocused;
				if (!data || !data.length || !isNumber(x) || !isNumber(y) || !isNumber(width) || !isNumber(height) || width <= 0 || height <= 0) return null;
				var layerClass = clsx("recharts-brush", className);
				var isPanoramic = import_react.Children.count(children) === 1;
				var style = generatePrefixStyle("userSelect", "none");
				return /*#__PURE__*/ import_react.createElement(Layer, {
					className: layerClass,
					onMouseLeave: this.handleLeaveWrapper,
					onTouchMove: this.handleTouchMove,
					style
				}, this.renderBackground(), isPanoramic && this.renderPanorama(), this.renderSlide(startX, endX), this.renderTravellerLayer(startX, "startX"), this.renderTravellerLayer(endX, "endX"), (isTextActive || isSlideMoving || isTravellerMoving || isTravellerFocused || alwaysShowText) && this.renderText());
			}
		}
	], [
		{
			key: "renderDefaultTraveller",
			value: function renderDefaultTraveller(props) {
				var x = props.x, y = props.y, width = props.width, height = props.height, stroke = props.stroke;
				var lineY = Math.floor(y + height / 2) - 1;
				return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement("rect", {
					x,
					y,
					width,
					height,
					fill: stroke,
					stroke: "none"
				}), /*#__PURE__*/ import_react.createElement("line", {
					x1: x + 1,
					y1: lineY,
					x2: x + width - 1,
					y2: lineY,
					fill: "none",
					stroke: "#fff"
				}), /*#__PURE__*/ import_react.createElement("line", {
					x1: x + 1,
					y1: lineY + 2,
					x2: x + width - 1,
					y2: lineY + 2,
					fill: "none",
					stroke: "#fff"
				}));
			}
		},
		{
			key: "renderTraveller",
			value: function renderTraveller(option, props) {
				var rectangle;
				if (/*#__PURE__*/ import_react.isValidElement(option)) rectangle = /*#__PURE__*/ import_react.cloneElement(option, props);
				else if ((0, import_isFunction.default)(option)) rectangle = option(props);
				else rectangle = Brush.renderDefaultTraveller(props);
				return rectangle;
			}
		},
		{
			key: "getDerivedStateFromProps",
			value: function getDerivedStateFromProps(nextProps, prevState) {
				var data = nextProps.data, width = nextProps.width, x = nextProps.x, travellerWidth = nextProps.travellerWidth, updateId = nextProps.updateId, startIndex = nextProps.startIndex, endIndex = nextProps.endIndex;
				if (data !== prevState.prevData || updateId !== prevState.prevUpdateId) return _objectSpread$6({
					prevData: data,
					prevTravellerWidth: travellerWidth,
					prevUpdateId: updateId,
					prevX: x,
					prevWidth: width
				}, data && data.length ? createScale({
					data,
					width,
					x,
					travellerWidth,
					startIndex,
					endIndex
				}) : {
					scale: null,
					scaleValues: null
				});
				if (prevState.scale && (width !== prevState.prevWidth || x !== prevState.prevX || travellerWidth !== prevState.prevTravellerWidth)) {
					prevState.scale.range([x, x + width - travellerWidth]);
					var scaleValues = prevState.scale.domain().map(function(entry) {
						return prevState.scale(entry);
					});
					return {
						prevData: data,
						prevTravellerWidth: travellerWidth,
						prevUpdateId: updateId,
						prevX: x,
						prevWidth: width,
						startX: prevState.scale(nextProps.startIndex),
						endX: prevState.scale(nextProps.endIndex),
						scaleValues
					};
				}
				return null;
			}
		},
		{
			key: "getIndexInRange",
			value: function getIndexInRange(valueRange, x) {
				var len = valueRange.length;
				var start = 0;
				var end = len - 1;
				while (end - start > 1) {
					var middle = Math.floor((start + end) / 2);
					if (valueRange[middle] > x) end = middle;
					else start = middle;
				}
				return x >= valueRange[end] ? end : start;
			}
		}
	]);
}(import_react.PureComponent);
_defineProperty$7(Brush, "displayName", "Brush");
_defineProperty$7(Brush, "defaultProps", {
	height: 40,
	travellerWidth: 5,
	gap: 1,
	fill: "#fff",
	stroke: "#666",
	padding: {
		top: 1,
		right: 1,
		bottom: 1,
		left: 1
	},
	leaveTimeOut: 1e3,
	alwaysShowText: false
});
//#endregion
//#region node_modules/recharts/es6/util/IfOverflowMatches.js
var ifOverflowMatches = function ifOverflowMatches(props, value) {
	var alwaysShow = props.alwaysShow;
	var ifOverflow = props.ifOverflow;
	if (alwaysShow) ifOverflow = "extendDomain";
	return ifOverflow === value;
};
//#endregion
//#region node_modules/recharts/es6/cartesian/ReferenceDot.js
/**
* @fileOverview Reference Dot
*/
function _extends$4() {
	_extends$4 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$4.apply(this, arguments);
}
function _typeof$6(o) {
	"@babel/helpers - typeof";
	return _typeof$6 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$6(o);
}
function ownKeys$5(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$5(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$5(Object(t), !0).forEach(function(r) {
			_defineProperty$6(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$5(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _classCallCheck$4(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$4(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$6(descriptor.key), descriptor);
	}
}
function _createClass$4(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$4(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$4(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$3(t, o, e) {
	return o = _getPrototypeOf$3(o), _possibleConstructorReturn$3(t, _isNativeReflectConstruct$3() ? Reflect.construct(o, e || [], _getPrototypeOf$3(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$3(self, call) {
	if (call && (_typeof$6(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$3(self);
}
function _assertThisInitialized$3(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$3() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$3 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$3(o) {
	_getPrototypeOf$3 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$3(o);
}
function _inherits$3(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$3(subClass, superClass);
}
function _setPrototypeOf$3(o, p) {
	_setPrototypeOf$3 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$3(o, p);
}
function _defineProperty$6(obj, key, value) {
	key = _toPropertyKey$6(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$6(t) {
	var i = _toPrimitive$6(t, "string");
	return "symbol" == _typeof$6(i) ? i : i + "";
}
function _toPrimitive$6(t, r) {
	if ("object" != _typeof$6(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$6(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var getCoordinate = function getCoordinate(props) {
	var x = props.x, y = props.y, xAxis = props.xAxis, yAxis = props.yAxis;
	var scales = createLabeledScales({
		x: xAxis.scale,
		y: yAxis.scale
	});
	var result = scales.apply({
		x,
		y
	}, { bandAware: true });
	if (ifOverflowMatches(props, "discard") && !scales.isInRange(result)) return null;
	return result;
};
var ReferenceDot = /*#__PURE__*/ function(_React$Component) {
	function ReferenceDot() {
		_classCallCheck$4(this, ReferenceDot);
		return _callSuper$3(this, ReferenceDot, arguments);
	}
	_inherits$3(ReferenceDot, _React$Component);
	return _createClass$4(ReferenceDot, [{
		key: "render",
		value: function render() {
			var _this$props = this.props, x = _this$props.x, y = _this$props.y, r = _this$props.r, alwaysShow = _this$props.alwaysShow, clipPathId = _this$props.clipPathId;
			var isX = isNumOrStr(x);
			var isY = isNumOrStr(y);
			warn(alwaysShow === void 0, "The alwaysShow prop is deprecated. Please use ifOverflow=\"extendDomain\" instead.");
			if (!isX || !isY) return null;
			var coordinate = getCoordinate(this.props);
			if (!coordinate) return null;
			var cx = coordinate.x, cy = coordinate.y;
			var _this$props2 = this.props, shape = _this$props2.shape, className = _this$props2.className;
			var dotProps = _objectSpread$5(_objectSpread$5({ clipPath: ifOverflowMatches(this.props, "hidden") ? "url(#".concat(clipPathId, ")") : void 0 }, filterProps(this.props, true)), {}, {
				cx,
				cy
			});
			return /*#__PURE__*/ import_react.createElement(Layer, { className: clsx("recharts-reference-dot", className) }, ReferenceDot.renderDot(shape, dotProps), Label.renderCallByParent(this.props, {
				x: cx - r,
				y: cy - r,
				width: 2 * r,
				height: 2 * r
			}));
		}
	}]);
}(import_react.Component);
_defineProperty$6(ReferenceDot, "displayName", "ReferenceDot");
_defineProperty$6(ReferenceDot, "defaultProps", {
	isFront: false,
	ifOverflow: "discard",
	xAxisId: 0,
	yAxisId: 0,
	r: 10,
	fill: "#fff",
	stroke: "#ccc",
	fillOpacity: 1,
	strokeWidth: 1
});
_defineProperty$6(ReferenceDot, "renderDot", function(option, props) {
	var dot;
	if (/*#__PURE__*/ import_react.isValidElement(option)) dot = /*#__PURE__*/ import_react.cloneElement(option, props);
	else if ((0, import_isFunction.default)(option)) dot = option(props);
	else dot = /*#__PURE__*/ import_react.createElement(Dot, _extends$4({}, props, {
		cx: props.cx,
		cy: props.cy,
		className: "recharts-reference-dot-dot"
	}));
	return dot;
});
//#endregion
//#region node_modules/recharts/es6/cartesian/ReferenceLine.js
/**
* @fileOverview Reference Line
*/
var import_some = /* @__PURE__ */ __toESM(require_some());
function _typeof$5(o) {
	"@babel/helpers - typeof";
	return _typeof$5 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$5(o);
}
function _classCallCheck$3(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$3(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$5(descriptor.key), descriptor);
	}
}
function _createClass$3(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$3(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$3(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$2(t, o, e) {
	return o = _getPrototypeOf$2(o), _possibleConstructorReturn$2(t, _isNativeReflectConstruct$2() ? Reflect.construct(o, e || [], _getPrototypeOf$2(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$2(self, call) {
	if (call && (_typeof$5(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$2(self);
}
function _assertThisInitialized$2(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$2() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$2 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$2(o) {
	_getPrototypeOf$2 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$2(o);
}
function _inherits$2(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$2(subClass, superClass);
}
function _setPrototypeOf$2(o, p) {
	_setPrototypeOf$2 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$2(o, p);
}
function ownKeys$4(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$4(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$4(Object(t), !0).forEach(function(r) {
			_defineProperty$5(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$5(obj, key, value) {
	key = _toPropertyKey$5(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$5(t) {
	var i = _toPrimitive$5(t, "string");
	return "symbol" == _typeof$5(i) ? i : i + "";
}
function _toPrimitive$5(t, r) {
	if ("object" != _typeof$5(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$5(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _slicedToArray$1(arr, i) {
	return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$2(arr, i) || _nonIterableRest$1();
}
function _nonIterableRest$1() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$2(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$2(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen);
}
function _arrayLikeToArray$2(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _iterableToArrayLimit$1(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayWithHoles$1(arr) {
	if (Array.isArray(arr)) return arr;
}
function _extends$3() {
	_extends$3 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$3.apply(this, arguments);
}
/**
* This excludes `viewBox` prop from svg for two reasons:
* 1. The components wants viewBox of object type, and svg wants string
*    - so there's a conflict, and the component will throw if it gets string
* 2. Internally the component calls `filterProps` which filters the viewBox away anyway
*/
var renderLine = function renderLine(option, props) {
	var line;
	if (/*#__PURE__*/ import_react.isValidElement(option)) line = /*#__PURE__*/ import_react.cloneElement(option, props);
	else if ((0, import_isFunction.default)(option)) line = option(props);
	else line = /*#__PURE__*/ import_react.createElement("line", _extends$3({}, props, { className: "recharts-reference-line-line" }));
	return line;
};
var getEndPoints = function getEndPoints(scales, isFixedX, isFixedY, isSegment, viewBox, position, xAxisOrientation, yAxisOrientation, props) {
	var x = viewBox.x, y = viewBox.y, width = viewBox.width, height = viewBox.height;
	if (isFixedY) {
		var yCoord = props.y;
		var coord = scales.y.apply(yCoord, { position });
		if (ifOverflowMatches(props, "discard") && !scales.y.isInRange(coord)) return null;
		var points = [{
			x: x + width,
			y: coord
		}, {
			x,
			y: coord
		}];
		return yAxisOrientation === "left" ? points.reverse() : points;
	}
	if (isFixedX) {
		var xCoord = props.x;
		var _coord = scales.x.apply(xCoord, { position });
		if (ifOverflowMatches(props, "discard") && !scales.x.isInRange(_coord)) return null;
		var _points = [{
			x: _coord,
			y: y + height
		}, {
			x: _coord,
			y
		}];
		return xAxisOrientation === "top" ? _points.reverse() : _points;
	}
	if (isSegment) {
		var _points2 = props.segment.map(function(p) {
			return scales.apply(p, { position });
		});
		if (ifOverflowMatches(props, "discard") && (0, import_some.default)(_points2, function(p) {
			return !scales.isInRange(p);
		})) return null;
		return _points2;
	}
	return null;
};
function ReferenceLineImpl(props) {
	var fixedX = props.x, fixedY = props.y, segment = props.segment, xAxisId = props.xAxisId, yAxisId = props.yAxisId, shape = props.shape, className = props.className, alwaysShow = props.alwaysShow;
	var clipPathId = useClipPathId();
	var xAxis = useXAxisOrThrow(xAxisId);
	var yAxis = useYAxisOrThrow(yAxisId);
	var viewBox = useViewBox();
	if (!clipPathId || !viewBox) return null;
	warn(alwaysShow === void 0, "The alwaysShow prop is deprecated. Please use ifOverflow=\"extendDomain\" instead.");
	var endPoints = getEndPoints(createLabeledScales({
		x: xAxis.scale,
		y: yAxis.scale
	}), isNumOrStr(fixedX), isNumOrStr(fixedY), segment && segment.length === 2, viewBox, props.position, xAxis.orientation, yAxis.orientation, props);
	if (!endPoints) return null;
	var _endPoints = _slicedToArray$1(endPoints, 2), _endPoints$ = _endPoints[0], x1 = _endPoints$.x, y1 = _endPoints$.y, _endPoints$2 = _endPoints[1], x2 = _endPoints$2.x, y2 = _endPoints$2.y;
	var lineProps = _objectSpread$4(_objectSpread$4({ clipPath: ifOverflowMatches(props, "hidden") ? "url(#".concat(clipPathId, ")") : void 0 }, filterProps(props, true)), {}, {
		x1,
		y1,
		x2,
		y2
	});
	return /*#__PURE__*/ import_react.createElement(Layer, { className: clsx("recharts-reference-line", className) }, renderLine(shape, lineProps), Label.renderCallByParent(props, rectWithCoords({
		x1,
		y1,
		x2,
		y2
	})));
}
var ReferenceLine = /*#__PURE__*/ function(_React$Component) {
	function ReferenceLine() {
		_classCallCheck$3(this, ReferenceLine);
		return _callSuper$2(this, ReferenceLine, arguments);
	}
	_inherits$2(ReferenceLine, _React$Component);
	return _createClass$3(ReferenceLine, [{
		key: "render",
		value: function render() {
			return /*#__PURE__*/ import_react.createElement(ReferenceLineImpl, this.props);
		}
	}]);
}(import_react.Component);
_defineProperty$5(ReferenceLine, "displayName", "ReferenceLine");
_defineProperty$5(ReferenceLine, "defaultProps", {
	isFront: false,
	ifOverflow: "discard",
	xAxisId: 0,
	yAxisId: 0,
	fill: "none",
	stroke: "#ccc",
	fillOpacity: 1,
	strokeWidth: 1,
	position: "middle"
});
//#endregion
//#region node_modules/recharts/es6/cartesian/ReferenceArea.js
/**
* @fileOverview Reference Line
*/
function _extends$2() {
	_extends$2 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$2.apply(this, arguments);
}
function _typeof$4(o) {
	"@babel/helpers - typeof";
	return _typeof$4 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$4(o);
}
function ownKeys$3(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$3(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$3(Object(t), !0).forEach(function(r) {
			_defineProperty$4(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _classCallCheck$2(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$2(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$4(descriptor.key), descriptor);
	}
}
function _createClass$2(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$2(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$2(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$1(t, o, e) {
	return o = _getPrototypeOf$1(o), _possibleConstructorReturn$1(t, _isNativeReflectConstruct$1() ? Reflect.construct(o, e || [], _getPrototypeOf$1(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$1(self, call) {
	if (call && (_typeof$4(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$1(self);
}
function _assertThisInitialized$1(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$1() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$1 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$1(o) {
	_getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$1(o);
}
function _inherits$1(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$1(subClass, superClass);
}
function _setPrototypeOf$1(o, p) {
	_setPrototypeOf$1 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$1(o, p);
}
function _defineProperty$4(obj, key, value) {
	key = _toPropertyKey$4(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$4(t) {
	var i = _toPrimitive$4(t, "string");
	return "symbol" == _typeof$4(i) ? i : i + "";
}
function _toPrimitive$4(t, r) {
	if ("object" != _typeof$4(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$4(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var getRect = function getRect(hasX1, hasX2, hasY1, hasY2, props) {
	var xValue1 = props.x1, xValue2 = props.x2, yValue1 = props.y1, yValue2 = props.y2, xAxis = props.xAxis, yAxis = props.yAxis;
	if (!xAxis || !yAxis) return null;
	var scales = createLabeledScales({
		x: xAxis.scale,
		y: yAxis.scale
	});
	var p1 = {
		x: hasX1 ? scales.x.apply(xValue1, { position: "start" }) : scales.x.rangeMin,
		y: hasY1 ? scales.y.apply(yValue1, { position: "start" }) : scales.y.rangeMin
	};
	var p2 = {
		x: hasX2 ? scales.x.apply(xValue2, { position: "end" }) : scales.x.rangeMax,
		y: hasY2 ? scales.y.apply(yValue2, { position: "end" }) : scales.y.rangeMax
	};
	if (ifOverflowMatches(props, "discard") && (!scales.isInRange(p1) || !scales.isInRange(p2))) return null;
	return rectWithPoints(p1, p2);
};
var ReferenceArea = /*#__PURE__*/ function(_React$Component) {
	function ReferenceArea() {
		_classCallCheck$2(this, ReferenceArea);
		return _callSuper$1(this, ReferenceArea, arguments);
	}
	_inherits$1(ReferenceArea, _React$Component);
	return _createClass$2(ReferenceArea, [{
		key: "render",
		value: function render() {
			var _this$props = this.props, x1 = _this$props.x1, x2 = _this$props.x2, y1 = _this$props.y1, y2 = _this$props.y2, className = _this$props.className, alwaysShow = _this$props.alwaysShow, clipPathId = _this$props.clipPathId;
			warn(alwaysShow === void 0, "The alwaysShow prop is deprecated. Please use ifOverflow=\"extendDomain\" instead.");
			var hasX1 = isNumOrStr(x1);
			var hasX2 = isNumOrStr(x2);
			var hasY1 = isNumOrStr(y1);
			var hasY2 = isNumOrStr(y2);
			var shape = this.props.shape;
			if (!hasX1 && !hasX2 && !hasY1 && !hasY2 && !shape) return null;
			var rect = getRect(hasX1, hasX2, hasY1, hasY2, this.props);
			if (!rect && !shape) return null;
			var clipPath = ifOverflowMatches(this.props, "hidden") ? "url(#".concat(clipPathId, ")") : void 0;
			return /*#__PURE__*/ import_react.createElement(Layer, { className: clsx("recharts-reference-area", className) }, ReferenceArea.renderRect(shape, _objectSpread$3(_objectSpread$3({ clipPath }, filterProps(this.props, true)), rect)), Label.renderCallByParent(this.props, rect));
		}
	}]);
}(import_react.Component);
_defineProperty$4(ReferenceArea, "displayName", "ReferenceArea");
_defineProperty$4(ReferenceArea, "defaultProps", {
	isFront: false,
	ifOverflow: "discard",
	xAxisId: 0,
	yAxisId: 0,
	r: 10,
	fill: "#ccc",
	fillOpacity: .5,
	stroke: "none",
	strokeWidth: 1
});
_defineProperty$4(ReferenceArea, "renderRect", function(option, props) {
	var rect;
	if (/*#__PURE__*/ import_react.isValidElement(option)) rect = /*#__PURE__*/ import_react.cloneElement(option, props);
	else if ((0, import_isFunction.default)(option)) rect = option(props);
	else rect = /*#__PURE__*/ import_react.createElement(Rectangle, _extends$2({}, props, { className: "recharts-reference-area-rect" }));
	return rect;
});
//#endregion
//#region node_modules/recharts/es6/util/DetectReferenceElementsDomain.js
function _toConsumableArray$1(arr) {
	return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread$1();
}
function _nonIterableSpread$1() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$1(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
}
function _iterableToArray$1(iter) {
	if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles$1(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
}
function _arrayLikeToArray$1(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
var detectReferenceElementsDomain = function detectReferenceElementsDomain(children, domain, axisId, axisType, specifiedTicks) {
	var lines = findAllByType(children, ReferenceLine);
	var dots = findAllByType(children, ReferenceDot);
	var elements = [].concat(_toConsumableArray$1(lines), _toConsumableArray$1(dots));
	var areas = findAllByType(children, ReferenceArea);
	var idKey = "".concat(axisType, "Id");
	var valueKey = axisType[0];
	var finalDomain = domain;
	if (elements.length) finalDomain = elements.reduce(function(result, el) {
		if (el.props[idKey] === axisId && ifOverflowMatches(el.props, "extendDomain") && isNumber(el.props[valueKey])) {
			var value = el.props[valueKey];
			return [Math.min(result[0], value), Math.max(result[1], value)];
		}
		return result;
	}, finalDomain);
	if (areas.length) {
		var key1 = "".concat(valueKey, "1");
		var key2 = "".concat(valueKey, "2");
		finalDomain = areas.reduce(function(result, el) {
			if (el.props[idKey] === axisId && ifOverflowMatches(el.props, "extendDomain") && isNumber(el.props[key1]) && isNumber(el.props[key2])) {
				var value1 = el.props[key1];
				var value2 = el.props[key2];
				return [Math.min(result[0], value1, value2), Math.max(result[1], value1, value2)];
			}
			return result;
		}, finalDomain);
	}
	if (specifiedTicks && specifiedTicks.length) finalDomain = specifiedTicks.reduce(function(result, tick) {
		if (isNumber(tick)) return [Math.min(result[0], tick), Math.max(result[1], tick)];
		return result;
	}, finalDomain);
	return finalDomain;
};
var eventCenter = new (/* @__PURE__ */ __toESM(require_eventemitter3())).default();
var SYNC_EVENT = "recharts.syncMouseEvents";
//#endregion
//#region node_modules/recharts/es6/chart/AccessibilityManager.js
function _typeof$3(o) {
	"@babel/helpers - typeof";
	return _typeof$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$3(o);
}
function _classCallCheck$1(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$1(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$3(descriptor.key), descriptor);
	}
}
function _createClass$1(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$1(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _defineProperty$3(obj, key, value) {
	key = _toPropertyKey$3(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$3(t) {
	var i = _toPrimitive$3(t, "string");
	return "symbol" == _typeof$3(i) ? i : i + "";
}
function _toPrimitive$3(t, r) {
	if ("object" != _typeof$3(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$3(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var AccessibilityManager = /*#__PURE__*/ function() {
	function AccessibilityManager() {
		_classCallCheck$1(this, AccessibilityManager);
		_defineProperty$3(this, "activeIndex", 0);
		_defineProperty$3(this, "coordinateList", []);
		_defineProperty$3(this, "layout", "horizontal");
	}
	return _createClass$1(AccessibilityManager, [
		{
			key: "setDetails",
			value: function setDetails(_ref) {
				var _ref2;
				var _ref$coordinateList = _ref.coordinateList, coordinateList = _ref$coordinateList === void 0 ? null : _ref$coordinateList, _ref$container = _ref.container, container = _ref$container === void 0 ? null : _ref$container, _ref$layout = _ref.layout, layout = _ref$layout === void 0 ? null : _ref$layout, _ref$offset = _ref.offset, offset = _ref$offset === void 0 ? null : _ref$offset, _ref$mouseHandlerCall = _ref.mouseHandlerCallback, mouseHandlerCallback = _ref$mouseHandlerCall === void 0 ? null : _ref$mouseHandlerCall;
				this.coordinateList = (_ref2 = coordinateList !== null && coordinateList !== void 0 ? coordinateList : this.coordinateList) !== null && _ref2 !== void 0 ? _ref2 : [];
				this.container = container !== null && container !== void 0 ? container : this.container;
				this.layout = layout !== null && layout !== void 0 ? layout : this.layout;
				this.offset = offset !== null && offset !== void 0 ? offset : this.offset;
				this.mouseHandlerCallback = mouseHandlerCallback !== null && mouseHandlerCallback !== void 0 ? mouseHandlerCallback : this.mouseHandlerCallback;
				this.activeIndex = Math.min(Math.max(this.activeIndex, 0), this.coordinateList.length - 1);
			}
		},
		{
			key: "focus",
			value: function focus() {
				this.spoofMouse();
			}
		},
		{
			key: "keyboardEvent",
			value: function keyboardEvent(e) {
				if (this.coordinateList.length === 0) return;
				switch (e.key) {
					case "ArrowRight":
						if (this.layout !== "horizontal") return;
						this.activeIndex = Math.min(this.activeIndex + 1, this.coordinateList.length - 1);
						this.spoofMouse();
						break;
					case "ArrowLeft":
						if (this.layout !== "horizontal") return;
						this.activeIndex = Math.max(this.activeIndex - 1, 0);
						this.spoofMouse();
						break;
					default: break;
				}
			}
		},
		{
			key: "setIndex",
			value: function setIndex(newIndex) {
				this.activeIndex = newIndex;
			}
		},
		{
			key: "spoofMouse",
			value: function spoofMouse() {
				var _window, _window2;
				if (this.layout !== "horizontal") return;
				if (this.coordinateList.length === 0) return;
				var _this$container$getBo = this.container.getBoundingClientRect(), x = _this$container$getBo.x, y = _this$container$getBo.y, height = _this$container$getBo.height;
				var coordinate = this.coordinateList[this.activeIndex].coordinate;
				var scrollOffsetX = ((_window = window) === null || _window === void 0 ? void 0 : _window.scrollX) || 0;
				var scrollOffsetY = ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.scrollY) || 0;
				var pageX = x + coordinate + scrollOffsetX;
				var pageY = y + this.offset.top + height / 2 + scrollOffsetY;
				this.mouseHandlerCallback({
					pageX,
					pageY
				});
			}
		}
	]);
}();
//#endregion
//#region node_modules/recharts/es6/util/isDomainSpecifiedByUser.js
/**
* Takes a domain and user props to determine whether he provided the domain via props or if we need to calculate it.
* @param   {AxisDomain}  domain              The potential domain from props
* @param   {Boolean}     allowDataOverflow   from props
* @param   {String}      axisType            from props
* @returns {Boolean}                         `true` if domain is specified by user
*/
function isDomainSpecifiedByUser(domain, allowDataOverflow, axisType) {
	if (axisType === "number" && allowDataOverflow === true && Array.isArray(domain)) {
		var domainStart = domain === null || domain === void 0 ? void 0 : domain[0];
		var domainEnd = domain === null || domain === void 0 ? void 0 : domain[1];
		if (!!domainStart && !!domainEnd && isNumber(domainStart) && isNumber(domainEnd)) return true;
	}
	return false;
}
//#endregion
//#region node_modules/recharts/es6/shape/Cross.js
/**
* @fileOverview Cross
*/
function _typeof$2(o) {
	"@babel/helpers - typeof";
	return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$2(o);
}
var _excluded$1 = [
	"x",
	"y",
	"top",
	"left",
	"width",
	"height",
	"className"
];
function _extends$1() {
	_extends$1 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$1.apply(this, arguments);
}
function ownKeys$2(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$2(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$2(Object(t), !0).forEach(function(r) {
			_defineProperty$2(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$2(obj, key, value) {
	key = _toPropertyKey$2(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$2(t) {
	var i = _toPrimitive$2(t, "string");
	return "symbol" == _typeof$2(i) ? i : i + "";
}
function _toPrimitive$2(t, r) {
	if ("object" != _typeof$2(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$2(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties$1(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$1(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$1(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var getPath = function getPath(x, y, width, height, top, left) {
	return "M".concat(x, ",").concat(top, "v").concat(height, "M").concat(left, ",").concat(y, "h").concat(width);
};
var Cross = function Cross(_ref) {
	var _ref$x = _ref.x, x = _ref$x === void 0 ? 0 : _ref$x, _ref$y = _ref.y, y = _ref$y === void 0 ? 0 : _ref$y, _ref$top = _ref.top, top = _ref$top === void 0 ? 0 : _ref$top, _ref$left = _ref.left, left = _ref$left === void 0 ? 0 : _ref$left, _ref$width = _ref.width, width = _ref$width === void 0 ? 0 : _ref$width, _ref$height = _ref.height, height = _ref$height === void 0 ? 0 : _ref$height, className = _ref.className, rest = _objectWithoutProperties$1(_ref, _excluded$1);
	var props = _objectSpread$2({
		x,
		y,
		top,
		left,
		width,
		height
	}, rest);
	if (!isNumber(x) || !isNumber(y) || !isNumber(width) || !isNumber(height) || !isNumber(top) || !isNumber(left)) return null;
	return /*#__PURE__*/ import_react.createElement("path", _extends$1({}, filterProps(props, true), {
		className: clsx("recharts-cross", className),
		d: getPath(x, y, width, height, top, left)
	}));
};
//#endregion
//#region node_modules/recharts/es6/util/cursor/getCursorRectangle.js
function getCursorRectangle(layout, activeCoordinate, offset, tooltipAxisBandSize) {
	var halfSize = tooltipAxisBandSize / 2;
	return {
		stroke: "none",
		fill: "#ccc",
		x: layout === "horizontal" ? activeCoordinate.x - halfSize : offset.left + .5,
		y: layout === "horizontal" ? offset.top + .5 : activeCoordinate.y - halfSize,
		width: layout === "horizontal" ? tooltipAxisBandSize : offset.width - 1,
		height: layout === "horizontal" ? offset.height - 1 : tooltipAxisBandSize
	};
}
//#endregion
//#region node_modules/recharts/es6/util/cursor/getRadialCursorPoints.js
/**
* Only applicable for radial layouts
* @param {Object} activeCoordinate ChartCoordinate
* @returns {Object} RadialCursorPoints
*/
function getRadialCursorPoints(activeCoordinate) {
	var cx = activeCoordinate.cx, cy = activeCoordinate.cy, radius = activeCoordinate.radius, startAngle = activeCoordinate.startAngle, endAngle = activeCoordinate.endAngle;
	return {
		points: [polarToCartesian(cx, cy, radius, startAngle), polarToCartesian(cx, cy, radius, endAngle)],
		cx,
		cy,
		radius,
		startAngle,
		endAngle
	};
}
//#endregion
//#region node_modules/recharts/es6/util/cursor/getCursorPoints.js
function getCursorPoints(layout, activeCoordinate, offset) {
	var x1, y1, x2, y2;
	if (layout === "horizontal") {
		x1 = activeCoordinate.x;
		x2 = x1;
		y1 = offset.top;
		y2 = offset.top + offset.height;
	} else if (layout === "vertical") {
		y1 = activeCoordinate.y;
		y2 = y1;
		x1 = offset.left;
		x2 = offset.left + offset.width;
	} else if (activeCoordinate.cx != null && activeCoordinate.cy != null) if (layout === "centric") {
		var cx = activeCoordinate.cx, cy = activeCoordinate.cy, innerRadius = activeCoordinate.innerRadius, outerRadius = activeCoordinate.outerRadius, angle = activeCoordinate.angle;
		var innerPoint = polarToCartesian(cx, cy, innerRadius, angle);
		var outerPoint = polarToCartesian(cx, cy, outerRadius, angle);
		x1 = innerPoint.x;
		y1 = innerPoint.y;
		x2 = outerPoint.x;
		y2 = outerPoint.y;
	} else return getRadialCursorPoints(activeCoordinate);
	return [{
		x: x1,
		y: y1
	}, {
		x: x2,
		y: y2
	}];
}
//#endregion
//#region node_modules/recharts/es6/component/Cursor.js
function _typeof$1(o) {
	"@babel/helpers - typeof";
	return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$1(o);
}
function ownKeys$1(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$1(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$1(Object(t), !0).forEach(function(r) {
			_defineProperty$1(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$1(obj, key, value) {
	key = _toPropertyKey$1(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$1(t) {
	var i = _toPrimitive$1(t, "string");
	return "symbol" == _typeof$1(i) ? i : i + "";
}
function _toPrimitive$1(t, r) {
	if ("object" != _typeof$1(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$1(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function Cursor(props) {
	var _element$props$cursor, _defaultProps;
	var element = props.element, tooltipEventType = props.tooltipEventType, isActive = props.isActive, activeCoordinate = props.activeCoordinate, activePayload = props.activePayload, offset = props.offset, activeTooltipIndex = props.activeTooltipIndex, tooltipAxisBandSize = props.tooltipAxisBandSize, layout = props.layout, chartName = props.chartName;
	var elementPropsCursor = (_element$props$cursor = element.props.cursor) !== null && _element$props$cursor !== void 0 ? _element$props$cursor : (_defaultProps = element.type.defaultProps) === null || _defaultProps === void 0 ? void 0 : _defaultProps.cursor;
	if (!element || !elementPropsCursor || !isActive || !activeCoordinate || chartName !== "ScatterChart" && tooltipEventType !== "axis") return null;
	var restProps;
	var cursorComp = Curve;
	if (chartName === "ScatterChart") {
		restProps = activeCoordinate;
		cursorComp = Cross;
	} else if (chartName === "BarChart") {
		restProps = getCursorRectangle(layout, activeCoordinate, offset, tooltipAxisBandSize);
		cursorComp = Rectangle;
	} else if (layout === "radial") {
		var _getRadialCursorPoint = getRadialCursorPoints(activeCoordinate), cx = _getRadialCursorPoint.cx, cy = _getRadialCursorPoint.cy, radius = _getRadialCursorPoint.radius;
		restProps = {
			cx,
			cy,
			startAngle: _getRadialCursorPoint.startAngle,
			endAngle: _getRadialCursorPoint.endAngle,
			innerRadius: radius,
			outerRadius: radius
		};
		cursorComp = Sector;
	} else {
		restProps = { points: getCursorPoints(layout, activeCoordinate, offset) };
		cursorComp = Curve;
	}
	var cursorProps = _objectSpread$1(_objectSpread$1(_objectSpread$1(_objectSpread$1({
		stroke: "#ccc",
		pointerEvents: "none"
	}, offset), restProps), filterProps(elementPropsCursor, false)), {}, {
		payload: activePayload,
		payloadIndex: activeTooltipIndex,
		className: clsx("recharts-tooltip-cursor", elementPropsCursor.className)
	});
	return /*#__PURE__*/ (0, import_react.isValidElement)(elementPropsCursor) ? /*#__PURE__*/ (0, import_react.cloneElement)(elementPropsCursor, cursorProps) : /*#__PURE__*/ (0, import_react.createElement)(cursorComp, cursorProps);
}
//#endregion
//#region node_modules/recharts/es6/chart/generateCategoricalChart.js
var _excluded = ["item"], _excluded2 = [
	"children",
	"className",
	"width",
	"height",
	"style",
	"compact",
	"title",
	"desc"
];
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
function _extends() {
	_extends = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends.apply(this, arguments);
}
function _slicedToArray(arr, i) {
	return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayWithHoles(arr) {
	if (Array.isArray(arr)) return arr;
}
function _objectWithoutProperties(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
	}
}
function _createClass(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper(t, o, e) {
	return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
	if (call && (_typeof(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf(o) {
	_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
	_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf(o, p);
}
function _toConsumableArray(arr) {
	return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
	if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty(obj, key, value) {
	key = _toPropertyKey(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey(t) {
	var i = _toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var ORIENT_MAP = {
	xAxis: ["bottom", "top"],
	yAxis: ["left", "right"]
};
var FULL_WIDTH_AND_HEIGHT = {
	width: "100%",
	height: "100%"
};
var originCoordinate = {
	x: 0,
	y: 0
};
/**
* This function exists as a temporary workaround.
*
* Why? generateCategoricalChart does not render `{children}` directly;
* instead it passes them through `renderByOrder` function which reads their handlers.
*
* So, this is a handler that does nothing.
* Once we get rid of `renderByOrder` and switch to JSX only, we can get rid of this handler too.
*
* @param {JSX} element as is in JSX
* @returns {JSX} the same element
*/
function renderAsIs(element) {
	return element;
}
var calculateTooltipPos = function calculateTooltipPos(rangeObj, layout) {
	if (layout === "horizontal") return rangeObj.x;
	if (layout === "vertical") return rangeObj.y;
	if (layout === "centric") return rangeObj.angle;
	return rangeObj.radius;
};
var getActiveCoordinate = function getActiveCoordinate(layout, tooltipTicks, activeIndex, rangeObj) {
	var entry = tooltipTicks.find(function(tick) {
		return tick && tick.index === activeIndex;
	});
	if (entry) {
		if (layout === "horizontal") return {
			x: entry.coordinate,
			y: rangeObj.y
		};
		if (layout === "vertical") return {
			x: rangeObj.x,
			y: entry.coordinate
		};
		if (layout === "centric") {
			var _angle = entry.coordinate;
			var _radius = rangeObj.radius;
			return _objectSpread(_objectSpread(_objectSpread({}, rangeObj), polarToCartesian(rangeObj.cx, rangeObj.cy, _radius, _angle)), {}, {
				angle: _angle,
				radius: _radius
			});
		}
		var radius = entry.coordinate;
		var angle = rangeObj.angle;
		return _objectSpread(_objectSpread(_objectSpread({}, rangeObj), polarToCartesian(rangeObj.cx, rangeObj.cy, radius, angle)), {}, {
			angle,
			radius
		});
	}
	return originCoordinate;
};
var getDisplayedData = function getDisplayedData(data, _ref) {
	var graphicalItems = _ref.graphicalItems, dataStartIndex = _ref.dataStartIndex, dataEndIndex = _ref.dataEndIndex;
	var itemsData = (graphicalItems !== null && graphicalItems !== void 0 ? graphicalItems : []).reduce(function(result, child) {
		var itemData = child.props.data;
		if (itemData && itemData.length) return [].concat(_toConsumableArray(result), _toConsumableArray(itemData));
		return result;
	}, []);
	if (itemsData.length > 0) return itemsData;
	if (data && data.length && isNumber(dataStartIndex) && isNumber(dataEndIndex)) return data.slice(dataStartIndex, dataEndIndex + 1);
	return [];
};
function getDefaultDomainByAxisType(axisType) {
	return axisType === "number" ? [0, "auto"] : void 0;
}
/**
* Get the content to be displayed in the tooltip
* @param  {Object} state          Current state
* @param  {Array}  chartData      The data defined in chart
* @param  {Number} activeIndex    Active index of data
* @param  {String} activeLabel    Active label of data
* @return {Array}                 The content of tooltip
*/
var getTooltipContent = function getTooltipContent(state, chartData, activeIndex, activeLabel) {
	var graphicalItems = state.graphicalItems, tooltipAxis = state.tooltipAxis;
	var displayedData = getDisplayedData(chartData, state);
	if (activeIndex < 0 || !graphicalItems || !graphicalItems.length || activeIndex >= displayedData.length) return null;
	return graphicalItems.reduce(function(result, child) {
		var _child$props$data;
		/**
		* Fixes: https://github.com/recharts/recharts/issues/3669
		* Defaulting to chartData below to fix an edge case where the tooltip does not include data from all charts
		* when a separate dataset is passed to chart prop data and specified on Line/Area/etc prop data
		*/
		var data = (_child$props$data = child.props.data) !== null && _child$props$data !== void 0 ? _child$props$data : chartData;
		if (data && state.dataStartIndex + state.dataEndIndex !== 0 && state.dataEndIndex - state.dataStartIndex >= activeIndex) data = data.slice(state.dataStartIndex, state.dataEndIndex + 1);
		var payload;
		if (tooltipAxis.dataKey && !tooltipAxis.allowDuplicatedCategory) payload = findEntryInArray(data === void 0 ? displayedData : data, tooltipAxis.dataKey, activeLabel);
		else payload = data && data[activeIndex] || displayedData[activeIndex];
		if (!payload) return result;
		return [].concat(_toConsumableArray(result), [getTooltipItem(child, payload)]);
	}, []);
};
/**
* Returns tooltip data based on a mouse position (as a parameter or in state)
* @param  {Object} state     current state
* @param  {Array}  chartData the data defined in chart
* @param  {String} layout     The layout type of chart
* @param  {Object} rangeObj  { x, y } coordinates
* @return {Object}           Tooltip data data
*/
var getTooltipData = function getTooltipData(state, chartData, layout, rangeObj) {
	var rangeData = rangeObj || {
		x: state.chartX,
		y: state.chartY
	};
	var pos = calculateTooltipPos(rangeData, layout);
	var ticks = state.orderedTooltipTicks, axis = state.tooltipAxis, tooltipTicks = state.tooltipTicks;
	var activeIndex = calculateActiveTickIndex(pos, ticks, tooltipTicks, axis);
	if (activeIndex >= 0 && tooltipTicks) {
		var activeLabel = tooltipTicks[activeIndex] && tooltipTicks[activeIndex].value;
		return {
			activeTooltipIndex: activeIndex,
			activeLabel,
			activePayload: getTooltipContent(state, chartData, activeIndex, activeLabel),
			activeCoordinate: getActiveCoordinate(layout, ticks, activeIndex, rangeData)
		};
	}
	return null;
};
/**
* Get the configuration of axis by the options of axis instance
* @param  {Object} props         Latest props
* @param {Array}  axes           The instance of axes
* @param  {Array} graphicalItems The instances of item
* @param  {String} axisType      The type of axis, xAxis - x-axis, yAxis - y-axis
* @param  {String} axisIdKey     The unique id of an axis
* @param  {Object} stackGroups   The items grouped by axisId and stackId
* @param {Number} dataStartIndex The start index of the data series when a brush is applied
* @param {Number} dataEndIndex   The end index of the data series when a brush is applied
* @return {Object}      Configuration
*/
var getAxisMapByAxes = function getAxisMapByAxes(props, _ref2) {
	var axes = _ref2.axes, graphicalItems = _ref2.graphicalItems, axisType = _ref2.axisType, axisIdKey = _ref2.axisIdKey, stackGroups = _ref2.stackGroups, dataStartIndex = _ref2.dataStartIndex, dataEndIndex = _ref2.dataEndIndex;
	var layout = props.layout, children = props.children, stackOffset = props.stackOffset;
	var isCategorical = isCategoricalAxis(layout, axisType);
	return axes.reduce(function(result, child) {
		var _childProps$domain2;
		var childProps = child.type.defaultProps !== void 0 ? _objectSpread(_objectSpread({}, child.type.defaultProps), child.props) : child.props;
		var type = childProps.type, dataKey = childProps.dataKey, allowDataOverflow = childProps.allowDataOverflow, allowDuplicatedCategory = childProps.allowDuplicatedCategory, scale = childProps.scale, ticks = childProps.ticks, includeHidden = childProps.includeHidden;
		var axisId = childProps[axisIdKey];
		if (result[axisId]) return result;
		var displayedData = getDisplayedData(props.data, {
			graphicalItems: graphicalItems.filter(function(item) {
				var _defaultProps;
				return (axisIdKey in item.props ? item.props[axisIdKey] : (_defaultProps = item.type.defaultProps) === null || _defaultProps === void 0 ? void 0 : _defaultProps[axisIdKey]) === axisId;
			}),
			dataStartIndex,
			dataEndIndex
		});
		var len = displayedData.length;
		var domain, duplicateDomain, categoricalDomain;
		if (isDomainSpecifiedByUser(childProps.domain, allowDataOverflow, type)) {
			domain = parseSpecifiedDomain(childProps.domain, null, allowDataOverflow);
			if (isCategorical && (type === "number" || scale !== "auto")) categoricalDomain = getDomainOfDataByKey(displayedData, dataKey, "category");
		}
		var defaultDomain = getDefaultDomainByAxisType(type);
		if (!domain || domain.length === 0) {
			var _childProps$domain;
			var childDomain = (_childProps$domain = childProps.domain) !== null && _childProps$domain !== void 0 ? _childProps$domain : defaultDomain;
			if (dataKey) {
				domain = getDomainOfDataByKey(displayedData, dataKey, type);
				if (type === "category" && isCategorical) {
					var duplicate = hasDuplicate(domain);
					if (allowDuplicatedCategory && duplicate) {
						duplicateDomain = domain;
						domain = (0, import_range.default)(0, len);
					} else if (!allowDuplicatedCategory) domain = parseDomainOfCategoryAxis(childDomain, domain, child).reduce(function(finalDomain, entry) {
						return finalDomain.indexOf(entry) >= 0 ? finalDomain : [].concat(_toConsumableArray(finalDomain), [entry]);
					}, []);
				} else if (type === "category") if (!allowDuplicatedCategory) domain = parseDomainOfCategoryAxis(childDomain, domain, child).reduce(function(finalDomain, entry) {
					return finalDomain.indexOf(entry) >= 0 || entry === "" || (0, import_isNil.default)(entry) ? finalDomain : [].concat(_toConsumableArray(finalDomain), [entry]);
				}, []);
				else domain = domain.filter(function(entry) {
					return entry !== "" && !(0, import_isNil.default)(entry);
				});
				else if (type === "number") {
					var errorBarsDomain = parseErrorBarsOfAxis(displayedData, graphicalItems.filter(function(item) {
						var _defaultProps2, _defaultProps3;
						var itemAxisId = axisIdKey in item.props ? item.props[axisIdKey] : (_defaultProps2 = item.type.defaultProps) === null || _defaultProps2 === void 0 ? void 0 : _defaultProps2[axisIdKey];
						var itemHide = "hide" in item.props ? item.props.hide : (_defaultProps3 = item.type.defaultProps) === null || _defaultProps3 === void 0 ? void 0 : _defaultProps3.hide;
						return itemAxisId === axisId && (includeHidden || !itemHide);
					}), dataKey, axisType, layout);
					if (errorBarsDomain) domain = errorBarsDomain;
				}
				if (isCategorical && (type === "number" || scale !== "auto")) categoricalDomain = getDomainOfDataByKey(displayedData, dataKey, "category");
			} else if (isCategorical) domain = (0, import_range.default)(0, len);
			else if (stackGroups && stackGroups[axisId] && stackGroups[axisId].hasStack && type === "number") domain = stackOffset === "expand" ? [0, 1] : getDomainOfStackGroups(stackGroups[axisId].stackGroups, dataStartIndex, dataEndIndex);
			else domain = getDomainOfItemsWithSameAxis(displayedData, graphicalItems.filter(function(item) {
				var itemAxisId = axisIdKey in item.props ? item.props[axisIdKey] : item.type.defaultProps[axisIdKey];
				var itemHide = "hide" in item.props ? item.props.hide : item.type.defaultProps.hide;
				return itemAxisId === axisId && (includeHidden || !itemHide);
			}), type, layout, true);
			if (type === "number") {
				domain = detectReferenceElementsDomain(children, domain, axisId, axisType, ticks);
				if (childDomain) domain = parseSpecifiedDomain(childDomain, domain, allowDataOverflow);
			} else if (type === "category" && childDomain) {
				var axisDomain = childDomain;
				if (domain.every(function(entry) {
					return axisDomain.indexOf(entry) >= 0;
				})) domain = axisDomain;
			}
		}
		return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, axisId, _objectSpread(_objectSpread({}, childProps), {}, {
			axisType,
			domain,
			categoricalDomain,
			duplicateDomain,
			originalDomain: (_childProps$domain2 = childProps.domain) !== null && _childProps$domain2 !== void 0 ? _childProps$domain2 : defaultDomain,
			isCategorical,
			layout
		})));
	}, {});
};
/**
* Get the configuration of axis by the options of item,
* this kind of axis does not display in chart
* @param  {Object} props         Latest props
* @param  {Array} graphicalItems The instances of item
* @param  {ReactElement} Axis    Axis Component
* @param  {String} axisType      The type of axis, xAxis - x-axis, yAxis - y-axis
* @param  {String} axisIdKey     The unique id of an axis
* @param  {Object} stackGroups   The items grouped by axisId and stackId
* @param {Number} dataStartIndex The start index of the data series when a brush is applied
* @param {Number} dataEndIndex   The end index of the data series when a brush is applied
* @return {Object}               Configuration
*/
var getAxisMapByItems = function getAxisMapByItems(props, _ref3) {
	var graphicalItems = _ref3.graphicalItems, Axis = _ref3.Axis, axisType = _ref3.axisType, axisIdKey = _ref3.axisIdKey, stackGroups = _ref3.stackGroups, dataStartIndex = _ref3.dataStartIndex, dataEndIndex = _ref3.dataEndIndex;
	var layout = props.layout, children = props.children;
	var displayedData = getDisplayedData(props.data, {
		graphicalItems,
		dataStartIndex,
		dataEndIndex
	});
	var len = displayedData.length;
	var isCategorical = isCategoricalAxis(layout, axisType);
	var index = -1;
	return graphicalItems.reduce(function(result, child) {
		var axisId = (child.type.defaultProps !== void 0 ? _objectSpread(_objectSpread({}, child.type.defaultProps), child.props) : child.props)[axisIdKey];
		var originalDomain = getDefaultDomainByAxisType("number");
		if (!result[axisId]) {
			index++;
			var domain;
			if (isCategorical) domain = (0, import_range.default)(0, len);
			else if (stackGroups && stackGroups[axisId] && stackGroups[axisId].hasStack) {
				domain = getDomainOfStackGroups(stackGroups[axisId].stackGroups, dataStartIndex, dataEndIndex);
				domain = detectReferenceElementsDomain(children, domain, axisId, axisType);
			} else {
				domain = parseSpecifiedDomain(originalDomain, getDomainOfItemsWithSameAxis(displayedData, graphicalItems.filter(function(item) {
					var _defaultProps4, _defaultProps5;
					var itemAxisId = axisIdKey in item.props ? item.props[axisIdKey] : (_defaultProps4 = item.type.defaultProps) === null || _defaultProps4 === void 0 ? void 0 : _defaultProps4[axisIdKey];
					var itemHide = "hide" in item.props ? item.props.hide : (_defaultProps5 = item.type.defaultProps) === null || _defaultProps5 === void 0 ? void 0 : _defaultProps5.hide;
					return itemAxisId === axisId && !itemHide;
				}), "number", layout), Axis.defaultProps.allowDataOverflow);
				domain = detectReferenceElementsDomain(children, domain, axisId, axisType);
			}
			return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, axisId, _objectSpread(_objectSpread({ axisType }, Axis.defaultProps), {}, {
				hide: true,
				orientation: (0, import_get.default)(ORIENT_MAP, "".concat(axisType, ".").concat(index % 2), null),
				domain,
				originalDomain,
				isCategorical,
				layout
			})));
		}
		return result;
	}, {});
};
/**
* Get the configuration of all x-axis or y-axis
* @param  {Object} props          Latest props
* @param  {String} axisType       The type of axis
* @param  {React.ComponentType}  [AxisComp]      Axis Component
* @param  {Array}  graphicalItems The instances of item
* @param  {Object} stackGroups    The items grouped by axisId and stackId
* @param {Number} dataStartIndex  The start index of the data series when a brush is applied
* @param {Number} dataEndIndex    The end index of the data series when a brush is applied
* @return {Object}          Configuration
*/
var getAxisMap = function getAxisMap(props, _ref4) {
	var _ref4$axisType = _ref4.axisType, axisType = _ref4$axisType === void 0 ? "xAxis" : _ref4$axisType, AxisComp = _ref4.AxisComp, graphicalItems = _ref4.graphicalItems, stackGroups = _ref4.stackGroups, dataStartIndex = _ref4.dataStartIndex, dataEndIndex = _ref4.dataEndIndex;
	var children = props.children;
	var axisIdKey = "".concat(axisType, "Id");
	var axes = findAllByType(children, AxisComp);
	var axisMap = {};
	if (axes && axes.length) axisMap = getAxisMapByAxes(props, {
		axes,
		graphicalItems,
		axisType,
		axisIdKey,
		stackGroups,
		dataStartIndex,
		dataEndIndex
	});
	else if (graphicalItems && graphicalItems.length) axisMap = getAxisMapByItems(props, {
		Axis: AxisComp,
		graphicalItems,
		axisType,
		axisIdKey,
		stackGroups,
		dataStartIndex,
		dataEndIndex
	});
	return axisMap;
};
var tooltipTicksGenerator = function tooltipTicksGenerator(axisMap) {
	var axis = getAnyElementOfObject(axisMap);
	var tooltipTicks = getTicksOfAxis(axis, false, true);
	return {
		tooltipTicks,
		orderedTooltipTicks: (0, import_sortBy.default)(tooltipTicks, function(o) {
			return o.coordinate;
		}),
		tooltipAxis: axis,
		tooltipAxisBandSize: getBandSizeOfAxis(axis, tooltipTicks)
	};
};
/**
* Returns default, reset state for the categorical chart.
* @param {Object} props Props object to use when creating the default state
* @return {Object} Whole new state
*/
var createDefaultState = function createDefaultState(props) {
	var children = props.children, defaultShowTooltip = props.defaultShowTooltip;
	var brushItem = findChildByType(children, Brush);
	var startIndex = 0;
	var endIndex = 0;
	if (props.data && props.data.length !== 0) endIndex = props.data.length - 1;
	if (brushItem && brushItem.props) {
		if (brushItem.props.startIndex >= 0) startIndex = brushItem.props.startIndex;
		if (brushItem.props.endIndex >= 0) endIndex = brushItem.props.endIndex;
	}
	return {
		chartX: 0,
		chartY: 0,
		dataStartIndex: startIndex,
		dataEndIndex: endIndex,
		activeTooltipIndex: -1,
		isTooltipActive: Boolean(defaultShowTooltip)
	};
};
var hasGraphicalBarItem = function hasGraphicalBarItem(graphicalItems) {
	if (!graphicalItems || !graphicalItems.length) return false;
	return graphicalItems.some(function(item) {
		var name = getDisplayName(item && item.type);
		return name && name.indexOf("Bar") >= 0;
	});
};
var getAxisNameByLayout = function getAxisNameByLayout(layout) {
	if (layout === "horizontal") return {
		numericAxisName: "yAxis",
		cateAxisName: "xAxis"
	};
	if (layout === "vertical") return {
		numericAxisName: "xAxis",
		cateAxisName: "yAxis"
	};
	if (layout === "centric") return {
		numericAxisName: "radiusAxis",
		cateAxisName: "angleAxis"
	};
	return {
		numericAxisName: "angleAxis",
		cateAxisName: "radiusAxis"
	};
};
/**
* Calculate the offset of main part in the svg element
* @param  {Object} params.props          Latest props
* @param  {Array}  params.graphicalItems The instances of item
* @param  {Object} params.xAxisMap       The configuration of x-axis
* @param  {Object} params.yAxisMap       The configuration of y-axis
* @param  {Object} prevLegendBBox        The boundary box of legend
* @return {Object} The offset of main part in the svg element
*/
var calculateOffset = function calculateOffset(_ref5, prevLegendBBox) {
	var props = _ref5.props, graphicalItems = _ref5.graphicalItems, _ref5$xAxisMap = _ref5.xAxisMap, xAxisMap = _ref5$xAxisMap === void 0 ? {} : _ref5$xAxisMap, _ref5$yAxisMap = _ref5.yAxisMap, yAxisMap = _ref5$yAxisMap === void 0 ? {} : _ref5$yAxisMap;
	var width = props.width, height = props.height, children = props.children;
	var margin = props.margin || {};
	var brushItem = findChildByType(children, Brush);
	var legendItem = findChildByType(children, Legend);
	var offsetH = Object.keys(yAxisMap).reduce(function(result, id) {
		var entry = yAxisMap[id];
		var orientation = entry.orientation;
		if (!entry.mirror && !entry.hide) return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, orientation, result[orientation] + entry.width));
		return result;
	}, {
		left: margin.left || 0,
		right: margin.right || 0
	});
	var offset = _objectSpread(_objectSpread({}, Object.keys(xAxisMap).reduce(function(result, id) {
		var entry = xAxisMap[id];
		var orientation = entry.orientation;
		if (!entry.mirror && !entry.hide) return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, orientation, (0, import_get.default)(result, "".concat(orientation)) + entry.height));
		return result;
	}, {
		top: margin.top || 0,
		bottom: margin.bottom || 0
	})), offsetH);
	var brushBottom = offset.bottom;
	if (brushItem) offset.bottom += brushItem.props.height || Brush.defaultProps.height;
	if (legendItem && prevLegendBBox) offset = appendOffsetOfLegend(offset, graphicalItems, props, prevLegendBBox);
	var offsetWidth = width - offset.left - offset.right;
	var offsetHeight = height - offset.top - offset.bottom;
	return _objectSpread(_objectSpread({ brushBottom }, offset), {}, {
		width: Math.max(offsetWidth, 0),
		height: Math.max(offsetHeight, 0)
	});
};
var getCartesianAxisSize = function getCartesianAxisSize(axisObj, axisName) {
	if (axisName === "xAxis") return axisObj[axisName].width;
	if (axisName === "yAxis") return axisObj[axisName].height;
};
//#endregion
//#region node_modules/recharts/es6/chart/AreaChart.js
/**
* @fileOverview Area Chart
*/
var AreaChart = function generateCategoricalChart(_ref6) {
	var chartName = _ref6.chartName, GraphicalChild = _ref6.GraphicalChild, _ref6$defaultTooltipE = _ref6.defaultTooltipEventType, defaultTooltipEventType = _ref6$defaultTooltipE === void 0 ? "axis" : _ref6$defaultTooltipE, _ref6$validateTooltip = _ref6.validateTooltipEventTypes, validateTooltipEventTypes = _ref6$validateTooltip === void 0 ? ["axis"] : _ref6$validateTooltip, axisComponents = _ref6.axisComponents, legendContent = _ref6.legendContent, formatAxisMap = _ref6.formatAxisMap, defaultProps = _ref6.defaultProps;
	var getFormatItems = function getFormatItems(props, currentState) {
		var graphicalItems = currentState.graphicalItems, stackGroups = currentState.stackGroups, offset = currentState.offset, updateId = currentState.updateId, dataStartIndex = currentState.dataStartIndex, dataEndIndex = currentState.dataEndIndex;
		var barSize = props.barSize, layout = props.layout, barGap = props.barGap, barCategoryGap = props.barCategoryGap, globalMaxBarSize = props.maxBarSize;
		var _getAxisNameByLayout = getAxisNameByLayout(layout), numericAxisName = _getAxisNameByLayout.numericAxisName, cateAxisName = _getAxisNameByLayout.cateAxisName;
		var hasBar = hasGraphicalBarItem(graphicalItems);
		var formattedItems = [];
		graphicalItems.forEach(function(item, index) {
			var displayedData = getDisplayedData(props.data, {
				graphicalItems: [item],
				dataStartIndex,
				dataEndIndex
			});
			var itemProps = item.type.defaultProps !== void 0 ? _objectSpread(_objectSpread({}, item.type.defaultProps), item.props) : item.props;
			var dataKey = itemProps.dataKey, childMaxBarSize = itemProps.maxBarSize;
			var numericAxisId = itemProps["".concat(numericAxisName, "Id")];
			var cateAxisId = itemProps["".concat(cateAxisName, "Id")];
			var axisObj = axisComponents.reduce(function(result, entry) {
				var axisMap = currentState["".concat(entry.axisType, "Map")];
				var id = itemProps["".concat(entry.axisType, "Id")];
				/**
				* tell the user in dev mode that their configuration is incorrect if we cannot find a match between
				* axisId on the chart and axisId on the axis. zAxis does not get passed in the map for ComposedChart,
				* leave it out of the check for now.
				*/
				!(axisMap && axisMap[id] || entry.axisType === "zAxis") && invariant(false);
				var axis = axisMap[id];
				return _objectSpread(_objectSpread({}, result), {}, _defineProperty(_defineProperty({}, entry.axisType, axis), "".concat(entry.axisType, "Ticks"), getTicksOfAxis(axis)));
			}, {});
			var cateAxis = axisObj[cateAxisName];
			var cateTicks = axisObj["".concat(cateAxisName, "Ticks")];
			var stackedData = stackGroups && stackGroups[numericAxisId] && stackGroups[numericAxisId].hasStack && getStackedDataOfItem(item, stackGroups[numericAxisId].stackGroups);
			var itemIsBar = getDisplayName(item.type).indexOf("Bar") >= 0;
			var bandSize = getBandSizeOfAxis(cateAxis, cateTicks);
			var barPosition = [];
			var sizeList = hasBar && getBarSizeList({
				barSize,
				stackGroups,
				totalSize: getCartesianAxisSize(axisObj, cateAxisName)
			});
			if (itemIsBar) {
				var _ref7, _getBandSizeOfAxis;
				var maxBarSize = (0, import_isNil.default)(childMaxBarSize) ? globalMaxBarSize : childMaxBarSize;
				var barBandSize = (_ref7 = (_getBandSizeOfAxis = getBandSizeOfAxis(cateAxis, cateTicks, true)) !== null && _getBandSizeOfAxis !== void 0 ? _getBandSizeOfAxis : maxBarSize) !== null && _ref7 !== void 0 ? _ref7 : 0;
				barPosition = getBarPosition({
					barGap,
					barCategoryGap,
					bandSize: barBandSize !== bandSize ? barBandSize : bandSize,
					sizeList: sizeList[cateAxisId],
					maxBarSize
				});
				if (barBandSize !== bandSize) barPosition = barPosition.map(function(pos) {
					return _objectSpread(_objectSpread({}, pos), {}, { position: _objectSpread(_objectSpread({}, pos.position), {}, { offset: pos.position.offset - barBandSize / 2 }) });
				});
			}
			var composedFn = item && item.type && item.type.getComposedData;
			if (composedFn) formattedItems.push({
				props: _objectSpread(_objectSpread({}, composedFn(_objectSpread(_objectSpread({}, axisObj), {}, {
					displayedData,
					props,
					dataKey,
					item,
					bandSize,
					barPosition,
					offset,
					stackedData,
					layout,
					dataStartIndex,
					dataEndIndex
				}))), {}, _defineProperty(_defineProperty(_defineProperty({ key: item.key || "item-".concat(index) }, numericAxisName, axisObj[numericAxisName]), cateAxisName, axisObj[cateAxisName]), "animationId", updateId)),
				childIndex: parseChildIndex(item, props.children),
				item
			});
		});
		return formattedItems;
	};
	/**
	* The AxisMaps are expensive to render on large data sets
	* so provide the ability to store them in state and only update them when necessary
	* they are dependent upon the start and end index of
	* the brush so it's important that this method is called _after_
	* the state is updated with any new start/end indices
	*
	* @param {Object} props          The props object to be used for updating the axismaps
	* dataStartIndex: The start index of the data series when a brush is applied
	* dataEndIndex: The end index of the data series when a brush is applied
	* updateId: The update id
	* @param {Object} prevState      Prev state
	* @return {Object} state New state to set
	*/
	var updateStateOfAxisMapsOffsetAndStackGroups = function updateStateOfAxisMapsOffsetAndStackGroups(_ref8, prevState) {
		var props = _ref8.props, dataStartIndex = _ref8.dataStartIndex, dataEndIndex = _ref8.dataEndIndex, updateId = _ref8.updateId;
		if (!validateWidthHeight({ props })) return null;
		var children = props.children, layout = props.layout, stackOffset = props.stackOffset, data = props.data, reverseStackOrder = props.reverseStackOrder;
		var _getAxisNameByLayout2 = getAxisNameByLayout(layout), numericAxisName = _getAxisNameByLayout2.numericAxisName, cateAxisName = _getAxisNameByLayout2.cateAxisName;
		var graphicalItems = findAllByType(children, GraphicalChild);
		var stackGroups = getStackGroupsByAxisId(data, graphicalItems, "".concat(numericAxisName, "Id"), "".concat(cateAxisName, "Id"), stackOffset, reverseStackOrder);
		var axisObj = axisComponents.reduce(function(result, entry) {
			var name = "".concat(entry.axisType, "Map");
			return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, name, getAxisMap(props, _objectSpread(_objectSpread({}, entry), {}, {
				graphicalItems,
				stackGroups: entry.axisType === numericAxisName && stackGroups,
				dataStartIndex,
				dataEndIndex
			}))));
		}, {});
		var offset = calculateOffset(_objectSpread(_objectSpread({}, axisObj), {}, {
			props,
			graphicalItems
		}), prevState === null || prevState === void 0 ? void 0 : prevState.legendBBox);
		Object.keys(axisObj).forEach(function(key) {
			axisObj[key] = formatAxisMap(props, axisObj[key], offset, key.replace("Map", ""), chartName);
		});
		var cateAxisMap = axisObj["".concat(cateAxisName, "Map")];
		var ticksObj = tooltipTicksGenerator(cateAxisMap);
		return _objectSpread(_objectSpread({
			formattedGraphicalItems: getFormatItems(props, _objectSpread(_objectSpread({}, axisObj), {}, {
				dataStartIndex,
				dataEndIndex,
				updateId,
				graphicalItems,
				stackGroups,
				offset
			})),
			graphicalItems,
			offset,
			stackGroups
		}, ticksObj), axisObj);
	};
	var CategoricalChartWrapper = /*#__PURE__*/ function(_Component) {
		function CategoricalChartWrapper(_props) {
			var _props$id, _props$throttleDelay;
			var _this;
			_classCallCheck(this, CategoricalChartWrapper);
			_this = _callSuper(this, CategoricalChartWrapper, [_props]);
			_defineProperty(_this, "eventEmitterSymbol", Symbol("rechartsEventEmitter"));
			_defineProperty(_this, "accessibilityManager", new AccessibilityManager());
			_defineProperty(_this, "handleLegendBBoxUpdate", function(box) {
				if (box) {
					var _this$state = _this.state, dataStartIndex = _this$state.dataStartIndex, dataEndIndex = _this$state.dataEndIndex, updateId = _this$state.updateId;
					_this.setState(_objectSpread({ legendBBox: box }, updateStateOfAxisMapsOffsetAndStackGroups({
						props: _this.props,
						dataStartIndex,
						dataEndIndex,
						updateId
					}, _objectSpread(_objectSpread({}, _this.state), {}, { legendBBox: box }))));
				}
			});
			_defineProperty(_this, "handleReceiveSyncEvent", function(cId, data, emitter) {
				if (_this.props.syncId === cId) {
					if (emitter === _this.eventEmitterSymbol && typeof _this.props.syncMethod !== "function") return;
					_this.applySyncEvent(data);
				}
			});
			_defineProperty(_this, "handleBrushChange", function(_ref9) {
				var startIndex = _ref9.startIndex, endIndex = _ref9.endIndex;
				if (startIndex !== _this.state.dataStartIndex || endIndex !== _this.state.dataEndIndex) {
					var updateId = _this.state.updateId;
					_this.setState(function() {
						return _objectSpread({
							dataStartIndex: startIndex,
							dataEndIndex: endIndex
						}, updateStateOfAxisMapsOffsetAndStackGroups({
							props: _this.props,
							dataStartIndex: startIndex,
							dataEndIndex: endIndex,
							updateId
						}, _this.state));
					});
					_this.triggerSyncEvent({
						dataStartIndex: startIndex,
						dataEndIndex: endIndex
					});
				}
			});
			/**
			* The handler of mouse entering chart
			* @param  {Object} e              Event object
			* @return {Null}                  null
			*/
			_defineProperty(_this, "handleMouseEnter", function(e) {
				var mouse = _this.getMouseInfo(e);
				if (mouse) {
					var _nextState = _objectSpread(_objectSpread({}, mouse), {}, { isTooltipActive: true });
					_this.setState(_nextState);
					_this.triggerSyncEvent(_nextState);
					var onMouseEnter = _this.props.onMouseEnter;
					if ((0, import_isFunction.default)(onMouseEnter)) onMouseEnter(_nextState, e);
				}
			});
			_defineProperty(_this, "triggeredAfterMouseMove", function(e) {
				var mouse = _this.getMouseInfo(e);
				var nextState = mouse ? _objectSpread(_objectSpread({}, mouse), {}, { isTooltipActive: true }) : { isTooltipActive: false };
				_this.setState(nextState);
				_this.triggerSyncEvent(nextState);
				var onMouseMove = _this.props.onMouseMove;
				if ((0, import_isFunction.default)(onMouseMove)) onMouseMove(nextState, e);
			});
			/**
			* The handler of mouse entering a scatter
			* @param {Object} el The active scatter
			* @return {Object} no return
			*/
			_defineProperty(_this, "handleItemMouseEnter", function(el) {
				_this.setState(function() {
					return {
						isTooltipActive: true,
						activeItem: el,
						activePayload: el.tooltipPayload,
						activeCoordinate: el.tooltipPosition || {
							x: el.cx,
							y: el.cy
						}
					};
				});
			});
			/**
			* The handler of mouse leaving a scatter
			* @return {Object} no return
			*/
			_defineProperty(_this, "handleItemMouseLeave", function() {
				_this.setState(function() {
					return { isTooltipActive: false };
				});
			});
			/**
			* The handler of mouse moving in chart
			* @param  {React.MouseEvent} e        Event object
			* @return {void} no return
			*/
			_defineProperty(_this, "handleMouseMove", function(e) {
				e.persist();
				_this.throttleTriggeredAfterMouseMove(e);
			});
			/**
			* The handler if mouse leaving chart
			* @param {Object} e Event object
			* @return {Null} no return
			*/
			_defineProperty(_this, "handleMouseLeave", function(e) {
				_this.throttleTriggeredAfterMouseMove.cancel();
				var nextState = { isTooltipActive: false };
				_this.setState(nextState);
				_this.triggerSyncEvent(nextState);
				var onMouseLeave = _this.props.onMouseLeave;
				if ((0, import_isFunction.default)(onMouseLeave)) onMouseLeave(nextState, e);
			});
			_defineProperty(_this, "handleOuterEvent", function(e) {
				var eventName = getReactEventByType(e);
				var event = (0, import_get.default)(_this.props, "".concat(eventName));
				if (eventName && (0, import_isFunction.default)(event)) {
					var _mouse;
					var mouse;
					if (/.*touch.*/i.test(eventName)) mouse = _this.getMouseInfo(e.changedTouches[0]);
					else mouse = _this.getMouseInfo(e);
					event((_mouse = mouse) !== null && _mouse !== void 0 ? _mouse : {}, e);
				}
			});
			_defineProperty(_this, "handleClick", function(e) {
				var mouse = _this.getMouseInfo(e);
				if (mouse) {
					var _nextState2 = _objectSpread(_objectSpread({}, mouse), {}, { isTooltipActive: true });
					_this.setState(_nextState2);
					_this.triggerSyncEvent(_nextState2);
					var onClick = _this.props.onClick;
					if ((0, import_isFunction.default)(onClick)) onClick(_nextState2, e);
				}
			});
			_defineProperty(_this, "handleMouseDown", function(e) {
				var onMouseDown = _this.props.onMouseDown;
				if ((0, import_isFunction.default)(onMouseDown)) onMouseDown(_this.getMouseInfo(e), e);
			});
			_defineProperty(_this, "handleMouseUp", function(e) {
				var onMouseUp = _this.props.onMouseUp;
				if ((0, import_isFunction.default)(onMouseUp)) onMouseUp(_this.getMouseInfo(e), e);
			});
			_defineProperty(_this, "handleTouchMove", function(e) {
				if (e.changedTouches != null && e.changedTouches.length > 0) _this.throttleTriggeredAfterMouseMove(e.changedTouches[0]);
			});
			_defineProperty(_this, "handleTouchStart", function(e) {
				if (e.changedTouches != null && e.changedTouches.length > 0) _this.handleMouseDown(e.changedTouches[0]);
			});
			_defineProperty(_this, "handleTouchEnd", function(e) {
				if (e.changedTouches != null && e.changedTouches.length > 0) _this.handleMouseUp(e.changedTouches[0]);
			});
			_defineProperty(_this, "handleDoubleClick", function(e) {
				var onDoubleClick = _this.props.onDoubleClick;
				if ((0, import_isFunction.default)(onDoubleClick)) onDoubleClick(_this.getMouseInfo(e), e);
			});
			_defineProperty(_this, "handleContextMenu", function(e) {
				var onContextMenu = _this.props.onContextMenu;
				if ((0, import_isFunction.default)(onContextMenu)) onContextMenu(_this.getMouseInfo(e), e);
			});
			_defineProperty(_this, "triggerSyncEvent", function(data) {
				if (_this.props.syncId !== void 0) eventCenter.emit(SYNC_EVENT, _this.props.syncId, data, _this.eventEmitterSymbol);
			});
			_defineProperty(_this, "applySyncEvent", function(data) {
				var _this$props = _this.props, layout = _this$props.layout, syncMethod = _this$props.syncMethod;
				var updateId = _this.state.updateId;
				var dataStartIndex = data.dataStartIndex, dataEndIndex = data.dataEndIndex;
				if (data.dataStartIndex !== void 0 || data.dataEndIndex !== void 0) _this.setState(_objectSpread({
					dataStartIndex,
					dataEndIndex
				}, updateStateOfAxisMapsOffsetAndStackGroups({
					props: _this.props,
					dataStartIndex,
					dataEndIndex,
					updateId
				}, _this.state)));
				else if (data.activeTooltipIndex !== void 0) {
					var chartX = data.chartX, chartY = data.chartY;
					var activeTooltipIndex = data.activeTooltipIndex;
					var _this$state2 = _this.state, offset = _this$state2.offset, tooltipTicks = _this$state2.tooltipTicks;
					if (!offset) return;
					if (typeof syncMethod === "function") activeTooltipIndex = syncMethod(tooltipTicks, data);
					else if (syncMethod === "value") {
						activeTooltipIndex = -1;
						for (var i = 0; i < tooltipTicks.length; i++) if (tooltipTicks[i].value === data.activeLabel) {
							activeTooltipIndex = i;
							break;
						}
					}
					var viewBox = _objectSpread(_objectSpread({}, offset), {}, {
						x: offset.left,
						y: offset.top
					});
					var validateChartX = Math.min(chartX, viewBox.x + viewBox.width);
					var validateChartY = Math.min(chartY, viewBox.y + viewBox.height);
					var activeLabel = tooltipTicks[activeTooltipIndex] && tooltipTicks[activeTooltipIndex].value;
					var activePayload = getTooltipContent(_this.state, _this.props.data, activeTooltipIndex);
					var activeCoordinate = tooltipTicks[activeTooltipIndex] ? {
						x: layout === "horizontal" ? tooltipTicks[activeTooltipIndex].coordinate : validateChartX,
						y: layout === "horizontal" ? validateChartY : tooltipTicks[activeTooltipIndex].coordinate
					} : originCoordinate;
					_this.setState(_objectSpread(_objectSpread({}, data), {}, {
						activeLabel,
						activeCoordinate,
						activePayload,
						activeTooltipIndex
					}));
				} else _this.setState(data);
			});
			_defineProperty(_this, "renderCursor", function(element) {
				var _element$props$active;
				var _this$state3 = _this.state, isTooltipActive = _this$state3.isTooltipActive, activeCoordinate = _this$state3.activeCoordinate, activePayload = _this$state3.activePayload, offset = _this$state3.offset, activeTooltipIndex = _this$state3.activeTooltipIndex, tooltipAxisBandSize = _this$state3.tooltipAxisBandSize;
				var tooltipEventType = _this.getTooltipEventType();
				var isActive = (_element$props$active = element.props.active) !== null && _element$props$active !== void 0 ? _element$props$active : isTooltipActive;
				var layout = _this.props.layout;
				var key = element.key || "_recharts-cursor";
				return /*#__PURE__*/ import_react.createElement(Cursor, {
					key,
					activeCoordinate,
					activePayload,
					activeTooltipIndex,
					chartName,
					element,
					isActive,
					layout,
					offset,
					tooltipAxisBandSize,
					tooltipEventType
				});
			});
			_defineProperty(_this, "renderPolarAxis", function(element, displayName, index) {
				var axisType = (0, import_get.default)(element, "type.axisType");
				var axisMap = (0, import_get.default)(_this.state, "".concat(axisType, "Map"));
				var elementDefaultProps = element.type.defaultProps;
				var elementProps = elementDefaultProps !== void 0 ? _objectSpread(_objectSpread({}, elementDefaultProps), element.props) : element.props;
				var axisOption = axisMap && axisMap[elementProps["".concat(axisType, "Id")]];
				return /*#__PURE__*/ (0, import_react.cloneElement)(element, _objectSpread(_objectSpread({}, axisOption), {}, {
					className: clsx(axisType, axisOption.className),
					key: element.key || "".concat(displayName, "-").concat(index),
					ticks: getTicksOfAxis(axisOption, true)
				}));
			});
			_defineProperty(_this, "renderPolarGrid", function(element) {
				var _element$props = element.props, radialLines = _element$props.radialLines, polarAngles = _element$props.polarAngles, polarRadius = _element$props.polarRadius;
				var _this$state4 = _this.state, radiusAxisMap = _this$state4.radiusAxisMap, angleAxisMap = _this$state4.angleAxisMap;
				var radiusAxis = getAnyElementOfObject(radiusAxisMap);
				var angleAxis = getAnyElementOfObject(angleAxisMap);
				var cx = angleAxis.cx, cy = angleAxis.cy, innerRadius = angleAxis.innerRadius, outerRadius = angleAxis.outerRadius;
				return /*#__PURE__*/ (0, import_react.cloneElement)(element, {
					polarAngles: Array.isArray(polarAngles) ? polarAngles : getTicksOfAxis(angleAxis, true).map(function(entry) {
						return entry.coordinate;
					}),
					polarRadius: Array.isArray(polarRadius) ? polarRadius : getTicksOfAxis(radiusAxis, true).map(function(entry) {
						return entry.coordinate;
					}),
					cx,
					cy,
					innerRadius,
					outerRadius,
					key: element.key || "polar-grid",
					radialLines
				});
			});
			/**
			* Draw legend
			* @return {ReactElement}            The instance of Legend
			*/
			_defineProperty(_this, "renderLegend", function() {
				var formattedGraphicalItems = _this.state.formattedGraphicalItems;
				var _this$props2 = _this.props, children = _this$props2.children, width = _this$props2.width, height = _this$props2.height;
				var margin = _this.props.margin || {};
				var props = getLegendProps({
					children,
					formattedGraphicalItems,
					legendWidth: width - (margin.left || 0) - (margin.right || 0),
					legendContent
				});
				if (!props) return null;
				var item = props.item;
				return /*#__PURE__*/ (0, import_react.cloneElement)(item, _objectSpread(_objectSpread({}, _objectWithoutProperties(props, _excluded)), {}, {
					chartWidth: width,
					chartHeight: height,
					margin,
					onBBoxUpdate: _this.handleLegendBBoxUpdate
				}));
			});
			/**
			* Draw Tooltip
			* @return {ReactElement}  The instance of Tooltip
			*/
			_defineProperty(_this, "renderTooltip", function() {
				var _tooltipItem$props$ac;
				var _this$props3 = _this.props, children = _this$props3.children, accessibilityLayer = _this$props3.accessibilityLayer;
				var tooltipItem = findChildByType(children, Tooltip);
				if (!tooltipItem) return null;
				var _this$state5 = _this.state, isTooltipActive = _this$state5.isTooltipActive, activeCoordinate = _this$state5.activeCoordinate, activePayload = _this$state5.activePayload, activeLabel = _this$state5.activeLabel, offset = _this$state5.offset;
				var isActive = (_tooltipItem$props$ac = tooltipItem.props.active) !== null && _tooltipItem$props$ac !== void 0 ? _tooltipItem$props$ac : isTooltipActive;
				return /*#__PURE__*/ (0, import_react.cloneElement)(tooltipItem, {
					viewBox: _objectSpread(_objectSpread({}, offset), {}, {
						x: offset.left,
						y: offset.top
					}),
					active: isActive,
					label: activeLabel,
					payload: isActive ? activePayload : [],
					coordinate: activeCoordinate,
					accessibilityLayer
				});
			});
			_defineProperty(_this, "renderBrush", function(element) {
				var _this$props4 = _this.props, margin = _this$props4.margin, data = _this$props4.data;
				var _this$state6 = _this.state, offset = _this$state6.offset, dataStartIndex = _this$state6.dataStartIndex, dataEndIndex = _this$state6.dataEndIndex, updateId = _this$state6.updateId;
				return /*#__PURE__*/ (0, import_react.cloneElement)(element, {
					key: element.key || "_recharts-brush",
					onChange: combineEventHandlers(_this.handleBrushChange, element.props.onChange),
					data,
					x: isNumber(element.props.x) ? element.props.x : offset.left,
					y: isNumber(element.props.y) ? element.props.y : offset.top + offset.height + offset.brushBottom - (margin.bottom || 0),
					width: isNumber(element.props.width) ? element.props.width : offset.width,
					startIndex: dataStartIndex,
					endIndex: dataEndIndex,
					updateId: "brush-".concat(updateId)
				});
			});
			_defineProperty(_this, "renderReferenceElement", function(element, displayName, index) {
				if (!element) return null;
				var clipPathId = _this.clipPathId;
				var _this$state7 = _this.state, xAxisMap = _this$state7.xAxisMap, yAxisMap = _this$state7.yAxisMap, offset = _this$state7.offset;
				var elementDefaultProps = element.type.defaultProps || {};
				var _element$props2 = element.props, _element$props2$xAxis = _element$props2.xAxisId, xAxisId = _element$props2$xAxis === void 0 ? elementDefaultProps.xAxisId : _element$props2$xAxis, _element$props2$yAxis = _element$props2.yAxisId, yAxisId = _element$props2$yAxis === void 0 ? elementDefaultProps.yAxisId : _element$props2$yAxis;
				return /*#__PURE__*/ (0, import_react.cloneElement)(element, {
					key: element.key || "".concat(displayName, "-").concat(index),
					xAxis: xAxisMap[xAxisId],
					yAxis: yAxisMap[yAxisId],
					viewBox: {
						x: offset.left,
						y: offset.top,
						width: offset.width,
						height: offset.height
					},
					clipPathId
				});
			});
			_defineProperty(_this, "renderActivePoints", function(_ref10) {
				var item = _ref10.item, activePoint = _ref10.activePoint, basePoint = _ref10.basePoint, childIndex = _ref10.childIndex, isRange = _ref10.isRange;
				var result = [];
				var key = item.props.key;
				var itemItemProps = item.item.type.defaultProps !== void 0 ? _objectSpread(_objectSpread({}, item.item.type.defaultProps), item.item.props) : item.item.props;
				var activeDot = itemItemProps.activeDot, dataKey = itemItemProps.dataKey;
				var dotProps = _objectSpread(_objectSpread({
					index: childIndex,
					dataKey,
					cx: activePoint.x,
					cy: activePoint.y,
					r: 4,
					fill: getMainColorOfGraphicItem(item.item),
					strokeWidth: 2,
					stroke: "#fff",
					payload: activePoint.payload,
					value: activePoint.value
				}, filterProps(activeDot, false)), adaptEventHandlers(activeDot));
				result.push(CategoricalChartWrapper.renderActiveDot(activeDot, dotProps, "".concat(key, "-activePoint-").concat(childIndex)));
				if (basePoint) result.push(CategoricalChartWrapper.renderActiveDot(activeDot, _objectSpread(_objectSpread({}, dotProps), {}, {
					cx: basePoint.x,
					cy: basePoint.y
				}), "".concat(key, "-basePoint-").concat(childIndex)));
				else if (isRange) result.push(null);
				return result;
			});
			_defineProperty(_this, "renderGraphicChild", function(element, displayName, index) {
				var item = _this.filterFormatItem(element, displayName, index);
				if (!item) return null;
				var tooltipEventType = _this.getTooltipEventType();
				var _this$state8 = _this.state, isTooltipActive = _this$state8.isTooltipActive, tooltipAxis = _this$state8.tooltipAxis, activeTooltipIndex = _this$state8.activeTooltipIndex, activeLabel = _this$state8.activeLabel;
				var children = _this.props.children;
				var tooltipItem = findChildByType(children, Tooltip);
				var _item$props = item.props, points = _item$props.points, isRange = _item$props.isRange, baseLine = _item$props.baseLine;
				var itemItemProps = item.item.type.defaultProps !== void 0 ? _objectSpread(_objectSpread({}, item.item.type.defaultProps), item.item.props) : item.item.props;
				var activeDot = itemItemProps.activeDot, hide = itemItemProps.hide, activeBar = itemItemProps.activeBar, activeShape = itemItemProps.activeShape;
				var hasActive = Boolean(!hide && isTooltipActive && tooltipItem && (activeDot || activeBar || activeShape));
				var itemEvents = {};
				if (tooltipEventType !== "axis" && tooltipItem && tooltipItem.props.trigger === "click") itemEvents = { onClick: combineEventHandlers(_this.handleItemMouseEnter, element.props.onClick) };
				else if (tooltipEventType !== "axis") itemEvents = {
					onMouseLeave: combineEventHandlers(_this.handleItemMouseLeave, element.props.onMouseLeave),
					onMouseEnter: combineEventHandlers(_this.handleItemMouseEnter, element.props.onMouseEnter)
				};
				var graphicalItem = /*#__PURE__*/ (0, import_react.cloneElement)(element, _objectSpread(_objectSpread({}, item.props), itemEvents));
				function findWithPayload(entry) {
					return typeof tooltipAxis.dataKey === "function" ? tooltipAxis.dataKey(entry.payload) : null;
				}
				if (hasActive) if (activeTooltipIndex >= 0) {
					var activePoint, basePoint;
					if (tooltipAxis.dataKey && !tooltipAxis.allowDuplicatedCategory) {
						var specifiedKey = typeof tooltipAxis.dataKey === "function" ? findWithPayload : "payload.".concat(tooltipAxis.dataKey.toString());
						activePoint = findEntryInArray(points, specifiedKey, activeLabel);
						basePoint = isRange && baseLine && findEntryInArray(baseLine, specifiedKey, activeLabel);
					} else {
						activePoint = points === null || points === void 0 ? void 0 : points[activeTooltipIndex];
						basePoint = isRange && baseLine && baseLine[activeTooltipIndex];
					}
					if (activeShape || activeBar) {
						var activeIndex = element.props.activeIndex !== void 0 ? element.props.activeIndex : activeTooltipIndex;
						return [
							/*#__PURE__*/ (0, import_react.cloneElement)(element, _objectSpread(_objectSpread(_objectSpread({}, item.props), itemEvents), {}, { activeIndex })),
							null,
							null
						];
					}
					if (!(0, import_isNil.default)(activePoint)) return [graphicalItem].concat(_toConsumableArray(_this.renderActivePoints({
						item,
						activePoint,
						basePoint,
						childIndex: activeTooltipIndex,
						isRange
					})));
				} else {
					var _this$getItemByXY;
					/**
					* We hit this block if consumer uses a Tooltip without XAxis and/or YAxis.
					* In which case, this.state.activeTooltipIndex never gets set
					* because the mouse events that trigger that value getting set never get trigged without the axis components.
					*
					* An example usage case is a FunnelChart
					*/
					var _ref11$graphicalItem = ((_this$getItemByXY = _this.getItemByXY(_this.state.activeCoordinate)) !== null && _this$getItemByXY !== void 0 ? _this$getItemByXY : { graphicalItem }).graphicalItem, _ref11$graphicalItem$ = _ref11$graphicalItem.item, xyItem = _ref11$graphicalItem$ === void 0 ? element : _ref11$graphicalItem$, childIndex = _ref11$graphicalItem.childIndex;
					return [
						/*#__PURE__*/ (0, import_react.cloneElement)(xyItem, _objectSpread(_objectSpread(_objectSpread({}, item.props), itemEvents), {}, { activeIndex: childIndex })),
						null,
						null
					];
				}
				if (isRange) return [
					graphicalItem,
					null,
					null
				];
				return [graphicalItem, null];
			});
			_defineProperty(_this, "renderCustomized", function(element, displayName, index) {
				return /*#__PURE__*/ (0, import_react.cloneElement)(element, _objectSpread(_objectSpread({ key: "recharts-customized-".concat(index) }, _this.props), _this.state));
			});
			_defineProperty(_this, "renderMap", {
				CartesianGrid: {
					handler: renderAsIs,
					once: true
				},
				ReferenceArea: { handler: _this.renderReferenceElement },
				ReferenceLine: { handler: renderAsIs },
				ReferenceDot: { handler: _this.renderReferenceElement },
				XAxis: { handler: renderAsIs },
				YAxis: { handler: renderAsIs },
				Brush: {
					handler: _this.renderBrush,
					once: true
				},
				Bar: { handler: _this.renderGraphicChild },
				Line: { handler: _this.renderGraphicChild },
				Area: { handler: _this.renderGraphicChild },
				Radar: { handler: _this.renderGraphicChild },
				RadialBar: { handler: _this.renderGraphicChild },
				Scatter: { handler: _this.renderGraphicChild },
				Pie: { handler: _this.renderGraphicChild },
				Funnel: { handler: _this.renderGraphicChild },
				Tooltip: {
					handler: _this.renderCursor,
					once: true
				},
				PolarGrid: {
					handler: _this.renderPolarGrid,
					once: true
				},
				PolarAngleAxis: { handler: _this.renderPolarAxis },
				PolarRadiusAxis: { handler: _this.renderPolarAxis },
				Customized: { handler: _this.renderCustomized }
			});
			_this.clipPathId = "".concat((_props$id = _props.id) !== null && _props$id !== void 0 ? _props$id : uniqueId("recharts"), "-clip");
			_this.throttleTriggeredAfterMouseMove = (0, import_throttle.default)(_this.triggeredAfterMouseMove, (_props$throttleDelay = _props.throttleDelay) !== null && _props$throttleDelay !== void 0 ? _props$throttleDelay : 1e3 / 60);
			_this.state = {};
			return _this;
		}
		_inherits(CategoricalChartWrapper, _Component);
		return _createClass(CategoricalChartWrapper, [
			{
				key: "componentDidMount",
				value: function componentDidMount() {
					var _this$props$margin$le, _this$props$margin$to;
					this.addListener();
					this.accessibilityManager.setDetails({
						container: this.container,
						offset: {
							left: (_this$props$margin$le = this.props.margin.left) !== null && _this$props$margin$le !== void 0 ? _this$props$margin$le : 0,
							top: (_this$props$margin$to = this.props.margin.top) !== null && _this$props$margin$to !== void 0 ? _this$props$margin$to : 0
						},
						coordinateList: this.state.tooltipTicks,
						mouseHandlerCallback: this.triggeredAfterMouseMove,
						layout: this.props.layout
					});
					this.displayDefaultTooltip();
				}
			},
			{
				key: "displayDefaultTooltip",
				value: function displayDefaultTooltip() {
					var _this$props5 = this.props, children = _this$props5.children, data = _this$props5.data, height = _this$props5.height, layout = _this$props5.layout;
					var tooltipElem = findChildByType(children, Tooltip);
					if (!tooltipElem) return;
					var defaultIndex = tooltipElem.props.defaultIndex;
					if (typeof defaultIndex !== "number" || defaultIndex < 0 || defaultIndex > this.state.tooltipTicks.length - 1) return;
					var activeLabel = this.state.tooltipTicks[defaultIndex] && this.state.tooltipTicks[defaultIndex].value;
					var activePayload = getTooltipContent(this.state, data, defaultIndex, activeLabel);
					var independentAxisCoord = this.state.tooltipTicks[defaultIndex].coordinate;
					var dependentAxisCoord = (this.state.offset.top + height) / 2;
					var activeCoordinate = layout === "horizontal" ? {
						x: independentAxisCoord,
						y: dependentAxisCoord
					} : {
						y: independentAxisCoord,
						x: dependentAxisCoord
					};
					var scatterPlotElement = this.state.formattedGraphicalItems.find(function(_ref12) {
						return _ref12.item.type.name === "Scatter";
					});
					if (scatterPlotElement) {
						activeCoordinate = _objectSpread(_objectSpread({}, activeCoordinate), scatterPlotElement.props.points[defaultIndex].tooltipPosition);
						activePayload = scatterPlotElement.props.points[defaultIndex].tooltipPayload;
					}
					var nextState = {
						activeTooltipIndex: defaultIndex,
						isTooltipActive: true,
						activeLabel,
						activePayload,
						activeCoordinate
					};
					this.setState(nextState);
					this.renderCursor(tooltipElem);
					this.accessibilityManager.setIndex(defaultIndex);
				}
			},
			{
				key: "getSnapshotBeforeUpdate",
				value: function getSnapshotBeforeUpdate(prevProps, prevState) {
					if (!this.props.accessibilityLayer) return null;
					if (this.state.tooltipTicks !== prevState.tooltipTicks) this.accessibilityManager.setDetails({ coordinateList: this.state.tooltipTicks });
					if (this.props.layout !== prevProps.layout) this.accessibilityManager.setDetails({ layout: this.props.layout });
					if (this.props.margin !== prevProps.margin) {
						var _this$props$margin$le2, _this$props$margin$to2;
						this.accessibilityManager.setDetails({ offset: {
							left: (_this$props$margin$le2 = this.props.margin.left) !== null && _this$props$margin$le2 !== void 0 ? _this$props$margin$le2 : 0,
							top: (_this$props$margin$to2 = this.props.margin.top) !== null && _this$props$margin$to2 !== void 0 ? _this$props$margin$to2 : 0
						} });
					}
					return null;
				}
			},
			{
				key: "componentDidUpdate",
				value: function componentDidUpdate(prevProps) {
					if (!isChildrenEqual([findChildByType(prevProps.children, Tooltip)], [findChildByType(this.props.children, Tooltip)])) this.displayDefaultTooltip();
				}
			},
			{
				key: "componentWillUnmount",
				value: function componentWillUnmount() {
					this.removeListener();
					this.throttleTriggeredAfterMouseMove.cancel();
				}
			},
			{
				key: "getTooltipEventType",
				value: function getTooltipEventType() {
					var tooltipItem = findChildByType(this.props.children, Tooltip);
					if (tooltipItem && typeof tooltipItem.props.shared === "boolean") {
						var eventType = tooltipItem.props.shared ? "axis" : "item";
						return validateTooltipEventTypes.indexOf(eventType) >= 0 ? eventType : defaultTooltipEventType;
					}
					return defaultTooltipEventType;
				}
			},
			{
				key: "getMouseInfo",
				value: function getMouseInfo(event) {
					if (!this.container) return null;
					var element = this.container;
					var boundingRect = element.getBoundingClientRect();
					var containerOffset = getOffset(boundingRect);
					var e = {
						chartX: Math.round(event.pageX - containerOffset.left),
						chartY: Math.round(event.pageY - containerOffset.top)
					};
					var scale = boundingRect.width / element.offsetWidth || 1;
					var rangeObj = this.inRange(e.chartX, e.chartY, scale);
					if (!rangeObj) return null;
					var _this$state9 = this.state, xAxisMap = _this$state9.xAxisMap, yAxisMap = _this$state9.yAxisMap;
					var tooltipEventType = this.getTooltipEventType();
					var toolTipData = getTooltipData(this.state, this.props.data, this.props.layout, rangeObj);
					if (tooltipEventType !== "axis" && xAxisMap && yAxisMap) {
						var xScale = getAnyElementOfObject(xAxisMap).scale;
						var yScale = getAnyElementOfObject(yAxisMap).scale;
						var xValue = xScale && xScale.invert ? xScale.invert(e.chartX) : null;
						var yValue = yScale && yScale.invert ? yScale.invert(e.chartY) : null;
						return _objectSpread(_objectSpread({}, e), {}, {
							xValue,
							yValue
						}, toolTipData);
					}
					if (toolTipData) return _objectSpread(_objectSpread({}, e), toolTipData);
					return null;
				}
			},
			{
				key: "inRange",
				value: function inRange(x, y) {
					var scale = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
					var layout = this.props.layout;
					var scaledX = x / scale, scaledY = y / scale;
					if (layout === "horizontal" || layout === "vertical") {
						var offset = this.state.offset;
						return scaledX >= offset.left && scaledX <= offset.left + offset.width && scaledY >= offset.top && scaledY <= offset.top + offset.height ? {
							x: scaledX,
							y: scaledY
						} : null;
					}
					var _this$state10 = this.state, angleAxisMap = _this$state10.angleAxisMap, radiusAxisMap = _this$state10.radiusAxisMap;
					if (angleAxisMap && radiusAxisMap) {
						var angleAxis = getAnyElementOfObject(angleAxisMap);
						return inRangeOfSector({
							x: scaledX,
							y: scaledY
						}, angleAxis);
					}
					return null;
				}
			},
			{
				key: "parseEventsOfWrapper",
				value: function parseEventsOfWrapper() {
					var children = this.props.children;
					var tooltipEventType = this.getTooltipEventType();
					var tooltipItem = findChildByType(children, Tooltip);
					var tooltipEvents = {};
					if (tooltipItem && tooltipEventType === "axis") if (tooltipItem.props.trigger === "click") tooltipEvents = { onClick: this.handleClick };
					else tooltipEvents = {
						onMouseEnter: this.handleMouseEnter,
						onDoubleClick: this.handleDoubleClick,
						onMouseMove: this.handleMouseMove,
						onMouseLeave: this.handleMouseLeave,
						onTouchMove: this.handleTouchMove,
						onTouchStart: this.handleTouchStart,
						onTouchEnd: this.handleTouchEnd,
						onContextMenu: this.handleContextMenu
					};
					return _objectSpread(_objectSpread({}, adaptEventHandlers(this.props, this.handleOuterEvent)), tooltipEvents);
				}
			},
			{
				key: "addListener",
				value: function addListener() {
					eventCenter.on(SYNC_EVENT, this.handleReceiveSyncEvent);
				}
			},
			{
				key: "removeListener",
				value: function removeListener() {
					eventCenter.removeListener(SYNC_EVENT, this.handleReceiveSyncEvent);
				}
			},
			{
				key: "filterFormatItem",
				value: function filterFormatItem(item, displayName, childIndex) {
					var formattedGraphicalItems = this.state.formattedGraphicalItems;
					for (var i = 0, len = formattedGraphicalItems.length; i < len; i++) {
						var entry = formattedGraphicalItems[i];
						if (entry.item === item || entry.props.key === item.key || displayName === getDisplayName(entry.item.type) && childIndex === entry.childIndex) return entry;
					}
					return null;
				}
			},
			{
				key: "renderClipPath",
				value: function renderClipPath() {
					var clipPathId = this.clipPathId;
					var _this$state$offset = this.state.offset, left = _this$state$offset.left, top = _this$state$offset.top, height = _this$state$offset.height, width = _this$state$offset.width;
					return /*#__PURE__*/ import_react.createElement("defs", null, /*#__PURE__*/ import_react.createElement("clipPath", { id: clipPathId }, /*#__PURE__*/ import_react.createElement("rect", {
						x: left,
						y: top,
						height,
						width
					})));
				}
			},
			{
				key: "getXScales",
				value: function getXScales() {
					var xAxisMap = this.state.xAxisMap;
					return xAxisMap ? Object.entries(xAxisMap).reduce(function(res, _ref13) {
						var _ref14 = _slicedToArray(_ref13, 2), axisId = _ref14[0], axisProps = _ref14[1];
						return _objectSpread(_objectSpread({}, res), {}, _defineProperty({}, axisId, axisProps.scale));
					}, {}) : null;
				}
			},
			{
				key: "getYScales",
				value: function getYScales() {
					var yAxisMap = this.state.yAxisMap;
					return yAxisMap ? Object.entries(yAxisMap).reduce(function(res, _ref15) {
						var _ref16 = _slicedToArray(_ref15, 2), axisId = _ref16[0], axisProps = _ref16[1];
						return _objectSpread(_objectSpread({}, res), {}, _defineProperty({}, axisId, axisProps.scale));
					}, {}) : null;
				}
			},
			{
				key: "getXScaleByAxisId",
				value: function getXScaleByAxisId(axisId) {
					var _this$state$xAxisMap;
					return (_this$state$xAxisMap = this.state.xAxisMap) === null || _this$state$xAxisMap === void 0 || (_this$state$xAxisMap = _this$state$xAxisMap[axisId]) === null || _this$state$xAxisMap === void 0 ? void 0 : _this$state$xAxisMap.scale;
				}
			},
			{
				key: "getYScaleByAxisId",
				value: function getYScaleByAxisId(axisId) {
					var _this$state$yAxisMap;
					return (_this$state$yAxisMap = this.state.yAxisMap) === null || _this$state$yAxisMap === void 0 || (_this$state$yAxisMap = _this$state$yAxisMap[axisId]) === null || _this$state$yAxisMap === void 0 ? void 0 : _this$state$yAxisMap.scale;
				}
			},
			{
				key: "getItemByXY",
				value: function getItemByXY(chartXY) {
					var _this$state11 = this.state, formattedGraphicalItems = _this$state11.formattedGraphicalItems, activeItem = _this$state11.activeItem;
					if (formattedGraphicalItems && formattedGraphicalItems.length) for (var i = 0, len = formattedGraphicalItems.length; i < len; i++) {
						var graphicalItem = formattedGraphicalItems[i];
						var props = graphicalItem.props, item = graphicalItem.item;
						var itemProps = item.type.defaultProps !== void 0 ? _objectSpread(_objectSpread({}, item.type.defaultProps), item.props) : item.props;
						var itemDisplayName = getDisplayName(item.type);
						if (itemDisplayName === "Bar") {
							var activeBarItem = (props.data || []).find(function(entry) {
								return isInRectangle(chartXY, entry);
							});
							if (activeBarItem) return {
								graphicalItem,
								payload: activeBarItem
							};
						} else if (itemDisplayName === "RadialBar") {
							var _activeBarItem = (props.data || []).find(function(entry) {
								return inRangeOfSector(chartXY, entry);
							});
							if (_activeBarItem) return {
								graphicalItem,
								payload: _activeBarItem
							};
						} else if (isFunnel(graphicalItem, activeItem) || isPie(graphicalItem, activeItem) || isScatter(graphicalItem, activeItem)) {
							var activeIndex = getActiveShapeIndexForTooltip({
								graphicalItem,
								activeTooltipItem: activeItem,
								itemData: itemProps.data
							});
							var childIndex = itemProps.activeIndex === void 0 ? activeIndex : itemProps.activeIndex;
							return {
								graphicalItem: _objectSpread(_objectSpread({}, graphicalItem), {}, { childIndex }),
								payload: isScatter(graphicalItem, activeItem) ? itemProps.data[activeIndex] : graphicalItem.props.data[activeIndex]
							};
						}
					}
					return null;
				}
			},
			{
				key: "render",
				value: function render() {
					var _this3 = this;
					if (!validateWidthHeight(this)) return null;
					var _this$props6 = this.props, children = _this$props6.children, className = _this$props6.className, width = _this$props6.width, height = _this$props6.height, style = _this$props6.style, compact = _this$props6.compact, title = _this$props6.title, desc = _this$props6.desc;
					var attrs = filterProps(_objectWithoutProperties(_this$props6, _excluded2), false);
					if (compact) return /*#__PURE__*/ import_react.createElement(ChartLayoutContextProvider, {
						state: this.state,
						width: this.props.width,
						height: this.props.height,
						clipPathId: this.clipPathId
					}, /*#__PURE__*/ import_react.createElement(Surface, _extends({}, attrs, {
						width,
						height,
						title,
						desc
					}), this.renderClipPath(), renderByOrder(children, this.renderMap)));
					if (this.props.accessibilityLayer) {
						var _this$props$tabIndex, _this$props$role;
						attrs.tabIndex = (_this$props$tabIndex = this.props.tabIndex) !== null && _this$props$tabIndex !== void 0 ? _this$props$tabIndex : 0;
						attrs.role = (_this$props$role = this.props.role) !== null && _this$props$role !== void 0 ? _this$props$role : "application";
						attrs.onKeyDown = function(e) {
							_this3.accessibilityManager.keyboardEvent(e);
						};
						attrs.onFocus = function() {
							_this3.accessibilityManager.focus();
						};
					}
					var events = this.parseEventsOfWrapper();
					return /*#__PURE__*/ import_react.createElement(ChartLayoutContextProvider, {
						state: this.state,
						width: this.props.width,
						height: this.props.height,
						clipPathId: this.clipPathId
					}, /*#__PURE__*/ import_react.createElement("div", _extends({
						className: clsx("recharts-wrapper", className),
						style: _objectSpread({
							position: "relative",
							cursor: "default",
							width,
							height
						}, style)
					}, events, { ref: function ref(node) {
						_this3.container = node;
					} }), /*#__PURE__*/ import_react.createElement(Surface, _extends({}, attrs, {
						width,
						height,
						title,
						desc,
						style: FULL_WIDTH_AND_HEIGHT
					}), this.renderClipPath(), renderByOrder(children, this.renderMap)), this.renderLegend(), this.renderTooltip()));
				}
			}
		]);
	}(import_react.Component);
	_defineProperty(CategoricalChartWrapper, "displayName", chartName);
	_defineProperty(CategoricalChartWrapper, "defaultProps", _objectSpread({
		layout: "horizontal",
		stackOffset: "none",
		barCategoryGap: "10%",
		barGap: 4,
		margin: {
			top: 5,
			right: 5,
			bottom: 5,
			left: 5
		},
		reverseStackOrder: false,
		syncMethod: "index"
	}, defaultProps));
	_defineProperty(CategoricalChartWrapper, "getDerivedStateFromProps", function(nextProps, prevState) {
		var dataKey = nextProps.dataKey, data = nextProps.data, children = nextProps.children, width = nextProps.width, height = nextProps.height, layout = nextProps.layout, stackOffset = nextProps.stackOffset, margin = nextProps.margin;
		var dataStartIndex = prevState.dataStartIndex, dataEndIndex = prevState.dataEndIndex;
		if (prevState.updateId === void 0) {
			var defaultState = createDefaultState(nextProps);
			return _objectSpread(_objectSpread(_objectSpread({}, defaultState), {}, { updateId: 0 }, updateStateOfAxisMapsOffsetAndStackGroups(_objectSpread(_objectSpread({ props: nextProps }, defaultState), {}, { updateId: 0 }), prevState)), {}, {
				prevDataKey: dataKey,
				prevData: data,
				prevWidth: width,
				prevHeight: height,
				prevLayout: layout,
				prevStackOffset: stackOffset,
				prevMargin: margin,
				prevChildren: children
			});
		}
		if (dataKey !== prevState.prevDataKey || data !== prevState.prevData || width !== prevState.prevWidth || height !== prevState.prevHeight || layout !== prevState.prevLayout || stackOffset !== prevState.prevStackOffset || !shallowEqual(margin, prevState.prevMargin)) {
			var _defaultState = createDefaultState(nextProps);
			var keepFromPrevState = {
				chartX: prevState.chartX,
				chartY: prevState.chartY,
				isTooltipActive: prevState.isTooltipActive
			};
			var updatesToState = _objectSpread(_objectSpread({}, getTooltipData(prevState, data, layout)), {}, { updateId: prevState.updateId + 1 });
			var newState = _objectSpread(_objectSpread(_objectSpread({}, _defaultState), keepFromPrevState), updatesToState);
			return _objectSpread(_objectSpread(_objectSpread({}, newState), updateStateOfAxisMapsOffsetAndStackGroups(_objectSpread({ props: nextProps }, newState), prevState)), {}, {
				prevDataKey: dataKey,
				prevData: data,
				prevWidth: width,
				prevHeight: height,
				prevLayout: layout,
				prevStackOffset: stackOffset,
				prevMargin: margin,
				prevChildren: children
			});
		}
		if (!isChildrenEqual(children, prevState.prevChildren)) {
			var _brush$props$startInd, _brush$props, _brush$props$endIndex, _brush$props2;
			var brush = findChildByType(children, Brush);
			var startIndex = brush ? (_brush$props$startInd = (_brush$props = brush.props) === null || _brush$props === void 0 ? void 0 : _brush$props.startIndex) !== null && _brush$props$startInd !== void 0 ? _brush$props$startInd : dataStartIndex : dataStartIndex;
			var endIndex = brush ? (_brush$props$endIndex = (_brush$props2 = brush.props) === null || _brush$props2 === void 0 ? void 0 : _brush$props2.endIndex) !== null && _brush$props$endIndex !== void 0 ? _brush$props$endIndex : dataEndIndex : dataEndIndex;
			var hasDifferentStartOrEndIndex = startIndex !== dataStartIndex || endIndex !== dataEndIndex;
			var newUpdateId = !(0, import_isNil.default)(data) && !hasDifferentStartOrEndIndex ? prevState.updateId : prevState.updateId + 1;
			return _objectSpread(_objectSpread({ updateId: newUpdateId }, updateStateOfAxisMapsOffsetAndStackGroups(_objectSpread(_objectSpread({ props: nextProps }, prevState), {}, {
				updateId: newUpdateId,
				dataStartIndex: startIndex,
				dataEndIndex: endIndex
			}), prevState)), {}, {
				prevChildren: children,
				dataStartIndex: startIndex,
				dataEndIndex: endIndex
			});
		}
		return null;
	});
	_defineProperty(CategoricalChartWrapper, "renderActiveDot", function(option, props, key) {
		var dot;
		if (/*#__PURE__*/ (0, import_react.isValidElement)(option)) dot = /*#__PURE__*/ (0, import_react.cloneElement)(option, props);
		else if ((0, import_isFunction.default)(option)) dot = option(props);
		else dot = /*#__PURE__*/ import_react.createElement(Dot, props);
		return /*#__PURE__*/ import_react.createElement(Layer, {
			className: "recharts-active-dot",
			key
		}, dot);
	});
	var CategoricalChart = /*#__PURE__*/ (0, import_react.forwardRef)(function CategoricalChart(props, ref) {
		return /*#__PURE__*/ import_react.createElement(CategoricalChartWrapper, _extends({}, props, { ref }));
	});
	CategoricalChart.displayName = CategoricalChartWrapper.displayName;
	return CategoricalChart;
}({
	chartName: "AreaChart",
	GraphicalChild: Area,
	axisComponents: [{
		axisType: "xAxis",
		AxisComp: XAxis
	}, {
		axisType: "yAxis",
		AxisComp: YAxis
	}],
	formatAxisMap
});
//#endregion
export { CartesianGrid as a, Area as i, YAxis as n, ResponsiveContainer as o, XAxis as r, Tooltip as s, AreaChart as t };

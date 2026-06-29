import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "./react+tanstack__react-query.mjs";
import { t as require_prop_types } from "./prop-types.mjs";
import { t as deepEqual } from "./fast-equals.mjs";
//#region node_modules/react-smooth/es6/setRafTimeout.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types());
function safeRequestAnimationFrame(callback) {
	if (typeof requestAnimationFrame !== "undefined") requestAnimationFrame(callback);
}
function setRafTimeout(callback) {
	var timeout = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
	var currTime = -1;
	requestAnimationFrame(function shouldUpdate(now) {
		if (currTime < 0) currTime = now;
		if (now - currTime > timeout) {
			callback(now);
			currTime = -1;
		} else safeRequestAnimationFrame(shouldUpdate);
	});
}
//#endregion
//#region node_modules/react-smooth/es6/AnimateManager.js
function _typeof$3(o) {
	"@babel/helpers - typeof";
	return _typeof$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$3(o);
}
function _toArray(arr) {
	return _arrayWithHoles$2(arr) || _iterableToArray$3(arr) || _unsupportedIterableToArray$3(arr) || _nonIterableRest$2();
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
function _iterableToArray$3(iter) {
	if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithHoles$2(arr) {
	if (Array.isArray(arr)) return arr;
}
function createAnimateManager() {
	var currStyle = {};
	var handleChange = function handleChange() {
		return null;
	};
	var shouldStop = false;
	var setStyle = function setStyle(_style) {
		if (shouldStop) return;
		if (Array.isArray(_style)) {
			if (!_style.length) return;
			var _styles = _toArray(_style), curr = _styles[0], restStyles = _styles.slice(1);
			if (typeof curr === "number") {
				setRafTimeout(setStyle.bind(null, restStyles), curr);
				return;
			}
			setStyle(curr);
			setRafTimeout(setStyle.bind(null, restStyles));
			return;
		}
		if (_typeof$3(_style) === "object") {
			currStyle = _style;
			handleChange(currStyle);
		}
		if (typeof _style === "function") _style();
	};
	return {
		stop: function stop() {
			shouldStop = true;
		},
		start: function start(style) {
			shouldStop = false;
			setStyle(style);
		},
		subscribe: function subscribe(_handleChange) {
			handleChange = _handleChange;
			return function() {
				handleChange = function handleChange() {
					return null;
				};
			};
		}
	};
}
//#endregion
//#region node_modules/react-smooth/es6/util.js
function _typeof$2(o) {
	"@babel/helpers - typeof";
	return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$2(o);
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
function _toPropertyKey$2(arg) {
	var key = _toPrimitive$2(arg, "string");
	return _typeof$2(key) === "symbol" ? key : String(key);
}
function _toPrimitive$2(input, hint) {
	if (_typeof$2(input) !== "object" || input === null) return input;
	var prim = input[Symbol.toPrimitive];
	if (prim !== void 0) {
		var res = prim.call(input, hint || "default");
		if (_typeof$2(res) !== "object") return res;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return (hint === "string" ? String : Number)(input);
}
var getIntersectionKeys = function getIntersectionKeys(preObj, nextObj) {
	return [Object.keys(preObj), Object.keys(nextObj)].reduce(function(a, b) {
		return a.filter(function(c) {
			return b.includes(c);
		});
	});
};
var identity = function identity(param) {
	return param;
};
var getDashCase = function getDashCase(name) {
	return name.replace(/([A-Z])/g, function(v) {
		return "-".concat(v.toLowerCase());
	});
};
var mapObject = function mapObject(fn, obj) {
	return Object.keys(obj).reduce(function(res, key) {
		return _objectSpread$2(_objectSpread$2({}, res), {}, _defineProperty$2({}, key, fn(key, obj[key])));
	}, {});
};
var getTransitionVal = function getTransitionVal(props, duration, easing) {
	return props.map(function(prop) {
		return "".concat(getDashCase(prop), " ").concat(duration, "ms ").concat(easing);
	}).join(",");
};
var isDev = false;
var warn = function warn(condition, format, a, b, c, d, e, f) {
	if (isDev && typeof console !== "undefined" && console.warn) {
		if (format === void 0) console.warn("LogUtils requires an error message argument");
		if (!condition) if (format === void 0) console.warn("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
		else {
			var args = [
				a,
				b,
				c,
				d,
				e,
				f
			];
			var argIndex = 0;
			console.warn(format.replace(/%s/g, function() {
				return args[argIndex++];
			}));
		}
	}
};
//#endregion
//#region node_modules/react-smooth/es6/easing.js
function _slicedToArray$1(arr, i) {
	return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$2(arr, i) || _nonIterableRest$1();
}
function _nonIterableRest$1() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
				if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
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
function _toConsumableArray$2(arr) {
	return _arrayWithoutHoles$2(arr) || _iterableToArray$2(arr) || _unsupportedIterableToArray$2(arr) || _nonIterableSpread$2();
}
function _nonIterableSpread$2() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$2(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$2(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen);
}
function _iterableToArray$2(iter) {
	if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles$2(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray$2(arr);
}
function _arrayLikeToArray$2(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
var ACCURACY = 1e-4;
var cubicBezierFactor = function cubicBezierFactor(c1, c2) {
	return [
		0,
		3 * c1,
		3 * c2 - 6 * c1,
		3 * c1 - 3 * c2 + 1
	];
};
var multyTime = function multyTime(params, t) {
	return params.map(function(param, i) {
		return param * Math.pow(t, i);
	}).reduce(function(pre, curr) {
		return pre + curr;
	});
};
var cubicBezier = function cubicBezier(c1, c2) {
	return function(t) {
		return multyTime(cubicBezierFactor(c1, c2), t);
	};
};
var derivativeCubicBezier = function derivativeCubicBezier(c1, c2) {
	return function(t) {
		var params = cubicBezierFactor(c1, c2);
		return multyTime([].concat(_toConsumableArray$2(params.map(function(param, i) {
			return param * i;
		}).slice(1)), [0]), t);
	};
};
var configBezier = function configBezier() {
	for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
	var x1 = args[0], y1 = args[1], x2 = args[2], y2 = args[3];
	if (args.length === 1) switch (args[0]) {
		case "linear":
			x1 = 0;
			y1 = 0;
			x2 = 1;
			y2 = 1;
			break;
		case "ease":
			x1 = .25;
			y1 = .1;
			x2 = .25;
			y2 = 1;
			break;
		case "ease-in":
			x1 = .42;
			y1 = 0;
			x2 = 1;
			y2 = 1;
			break;
		case "ease-out":
			x1 = .42;
			y1 = 0;
			x2 = .58;
			y2 = 1;
			break;
		case "ease-in-out":
			x1 = 0;
			y1 = 0;
			x2 = .58;
			y2 = 1;
			break;
		default:
			var easing = args[0].split("(");
			if (easing[0] === "cubic-bezier" && easing[1].split(")")[0].split(",").length === 4) {
				var _easing$1$split$0$spl2 = _slicedToArray$1(easing[1].split(")")[0].split(",").map(function(x) {
					return parseFloat(x);
				}), 4);
				x1 = _easing$1$split$0$spl2[0];
				y1 = _easing$1$split$0$spl2[1];
				x2 = _easing$1$split$0$spl2[2];
				y2 = _easing$1$split$0$spl2[3];
			} else warn(false, "[configBezier]: arguments should be one of oneOf 'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out','cubic-bezier(x1,y1,x2,y2)', instead received %s", args);
	}
	warn([
		x1,
		x2,
		y1,
		y2
	].every(function(num) {
		return typeof num === "number" && num >= 0 && num <= 1;
	}), "[configBezier]: arguments should be x1, y1, x2, y2 of [0, 1] instead received %s", args);
	var curveX = cubicBezier(x1, x2);
	var curveY = cubicBezier(y1, y2);
	var derCurveX = derivativeCubicBezier(x1, x2);
	var rangeValue = function rangeValue(value) {
		if (value > 1) return 1;
		if (value < 0) return 0;
		return value;
	};
	var bezier = function bezier(_t) {
		var t = _t > 1 ? 1 : _t;
		var x = t;
		for (var i = 0; i < 8; ++i) {
			var evalT = curveX(x) - t;
			var derVal = derCurveX(x);
			if (Math.abs(evalT - t) < ACCURACY || derVal < ACCURACY) return curveY(x);
			x = rangeValue(x - evalT / derVal);
		}
		return curveY(x);
	};
	bezier.isStepper = false;
	return bezier;
};
var configSpring = function configSpring() {
	var config = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
	var _config$stiff = config.stiff, stiff = _config$stiff === void 0 ? 100 : _config$stiff, _config$damping = config.damping, damping = _config$damping === void 0 ? 8 : _config$damping, _config$dt = config.dt, dt = _config$dt === void 0 ? 17 : _config$dt;
	var stepper = function stepper(currX, destX, currV) {
		var newV = currV + (-(currX - destX) * stiff - currV * damping) * dt / 1e3;
		var newX = currV * dt / 1e3 + currX;
		if (Math.abs(newX - destX) < ACCURACY && Math.abs(newV) < ACCURACY) return [destX, 0];
		return [newX, newV];
	};
	stepper.isStepper = true;
	stepper.dt = dt;
	return stepper;
};
var configEasing = function configEasing() {
	for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
	var easing = args[0];
	if (typeof easing === "string") switch (easing) {
		case "ease":
		case "ease-in-out":
		case "ease-out":
		case "ease-in":
		case "linear": return configBezier(easing);
		case "spring": return configSpring();
		default:
			if (easing.split("(")[0] === "cubic-bezier") return configBezier(easing);
			warn(false, "[configEasing]: first argument should be one of 'ease', 'ease-in', 'ease-out', 'ease-in-out','cubic-bezier(x1,y1,x2,y2)', 'linear' and 'spring', instead  received %s", args);
	}
	if (typeof easing === "function") return easing;
	warn(false, "[configEasing]: first argument type should be function or string, instead received %s", args);
	return null;
};
//#endregion
//#region node_modules/react-smooth/es6/configUpdate.js
function _typeof$1(o) {
	"@babel/helpers - typeof";
	return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$1(o);
}
function _toConsumableArray$1(arr) {
	return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread$1();
}
function _nonIterableSpread$1() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray$1(iter) {
	if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles$1(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
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
function _toPropertyKey$1(arg) {
	var key = _toPrimitive$1(arg, "string");
	return _typeof$1(key) === "symbol" ? key : String(key);
}
function _toPrimitive$1(input, hint) {
	if (_typeof$1(input) !== "object" || input === null) return input;
	var prim = input[Symbol.toPrimitive];
	if (prim !== void 0) {
		var res = prim.call(input, hint || "default");
		if (_typeof$1(res) !== "object") return res;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return (hint === "string" ? String : Number)(input);
}
function _slicedToArray(arr, i) {
	return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$1(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
}
function _arrayLikeToArray$1(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
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
				if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
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
var alpha = function alpha(begin, end, k) {
	return begin + (end - begin) * k;
};
var needContinue = function needContinue(_ref) {
	return _ref.from !== _ref.to;
};
var calStepperVals = function calStepperVals(easing, preVals, steps) {
	var nextStepVals = mapObject(function(key, val) {
		if (needContinue(val)) {
			var _easing2 = _slicedToArray(easing(val.from, val.to, val.velocity), 2), newX = _easing2[0], newV = _easing2[1];
			return _objectSpread$1(_objectSpread$1({}, val), {}, {
				from: newX,
				velocity: newV
			});
		}
		return val;
	}, preVals);
	if (steps < 1) return mapObject(function(key, val) {
		if (needContinue(val)) return _objectSpread$1(_objectSpread$1({}, val), {}, {
			velocity: alpha(val.velocity, nextStepVals[key].velocity, steps),
			from: alpha(val.from, nextStepVals[key].from, steps)
		});
		return val;
	}, preVals);
	return calStepperVals(easing, nextStepVals, steps - 1);
};
var configUpdate_default = (function(from, to, easing, duration, render) {
	var interKeys = getIntersectionKeys(from, to);
	var timingStyle = interKeys.reduce(function(res, key) {
		return _objectSpread$1(_objectSpread$1({}, res), {}, _defineProperty$1({}, key, [from[key], to[key]]));
	}, {});
	var stepperStyle = interKeys.reduce(function(res, key) {
		return _objectSpread$1(_objectSpread$1({}, res), {}, _defineProperty$1({}, key, {
			from: from[key],
			velocity: 0,
			to: to[key]
		}));
	}, {});
	var cafId = -1;
	var preTime;
	var beginTime;
	var update = function update() {
		return null;
	};
	var getCurrStyle = function getCurrStyle() {
		return mapObject(function(key, val) {
			return val.from;
		}, stepperStyle);
	};
	var shouldStopAnimation = function shouldStopAnimation() {
		return !Object.values(stepperStyle).filter(needContinue).length;
	};
	update = easing.isStepper ? function stepperUpdate(now) {
		if (!preTime) preTime = now;
		var steps = (now - preTime) / easing.dt;
		stepperStyle = calStepperVals(easing, stepperStyle, steps);
		render(_objectSpread$1(_objectSpread$1(_objectSpread$1({}, from), to), getCurrStyle(stepperStyle)));
		preTime = now;
		if (!shouldStopAnimation()) cafId = requestAnimationFrame(update);
	} : function timingUpdate(now) {
		if (!beginTime) beginTime = now;
		var t = (now - beginTime) / duration;
		var currStyle = mapObject(function(key, val) {
			return alpha.apply(void 0, _toConsumableArray$1(val).concat([easing(t)]));
		}, timingStyle);
		render(_objectSpread$1(_objectSpread$1(_objectSpread$1({}, from), to), currStyle));
		if (t < 1) cafId = requestAnimationFrame(update);
		else {
			var finalStyle = mapObject(function(key, val) {
				return alpha.apply(void 0, _toConsumableArray$1(val).concat([easing(1)]));
			}, timingStyle);
			render(_objectSpread$1(_objectSpread$1(_objectSpread$1({}, from), to), finalStyle));
		}
	};
	return function() {
		requestAnimationFrame(update);
		return function() {
			cancelAnimationFrame(cafId);
		};
	};
});
//#endregion
//#region node_modules/react-smooth/es6/Animate.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
var _excluded = [
	"children",
	"begin",
	"duration",
	"attributeName",
	"easing",
	"isActive",
	"steps",
	"from",
	"to",
	"canBegin",
	"onAnimationEnd",
	"shouldReAnimate",
	"onAnimationReStart"
];
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
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
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
function _toPropertyKey(arg) {
	var key = _toPrimitive(arg, "string");
	return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
	if (_typeof(input) !== "object" || input === null) return input;
	var prim = input[Symbol.toPrimitive];
	if (prim !== void 0) {
		var res = prim.call(input, hint || "default");
		if (_typeof(res) !== "object") return res;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return (hint === "string" ? String : Number)(input);
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
function _createSuper(Derived) {
	var hasNativeReflectConstruct = _isNativeReflectConstruct();
	return function _createSuperInternal() {
		var Super = _getPrototypeOf(Derived), result;
		if (hasNativeReflectConstruct) {
			var NewTarget = _getPrototypeOf(this).constructor;
			result = Reflect.construct(Super, arguments, NewTarget);
		} else result = Super.apply(this, arguments);
		return _possibleConstructorReturn(this, result);
	};
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
	if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	if (Reflect.construct.sham) return false;
	if (typeof Proxy === "function") return true;
	try {
		Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
		return true;
	} catch (e) {
		return false;
	}
}
function _getPrototypeOf(o) {
	_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf(o);
}
var Animate = /*#__PURE__*/ function(_PureComponent) {
	_inherits(Animate, _PureComponent);
	var _super = _createSuper(Animate);
	function Animate(props, context) {
		var _this;
		_classCallCheck(this, Animate);
		_this = _super.call(this, props, context);
		var _this$props = _this.props, isActive = _this$props.isActive, attributeName = _this$props.attributeName, from = _this$props.from, to = _this$props.to, steps = _this$props.steps, children = _this$props.children, duration = _this$props.duration;
		_this.handleStyleChange = _this.handleStyleChange.bind(_assertThisInitialized(_this));
		_this.changeStyle = _this.changeStyle.bind(_assertThisInitialized(_this));
		if (!isActive || duration <= 0) {
			_this.state = { style: {} };
			if (typeof children === "function") _this.state = { style: to };
			return _possibleConstructorReturn(_this);
		}
		if (steps && steps.length) _this.state = { style: steps[0].style };
		else if (from) {
			if (typeof children === "function") {
				_this.state = { style: from };
				return _possibleConstructorReturn(_this);
			}
			_this.state = { style: attributeName ? _defineProperty({}, attributeName, from) : from };
		} else _this.state = { style: {} };
		return _this;
	}
	_createClass(Animate, [
		{
			key: "componentDidMount",
			value: function componentDidMount() {
				var _this$props2 = this.props, isActive = _this$props2.isActive, canBegin = _this$props2.canBegin;
				this.mounted = true;
				if (!isActive || !canBegin) return;
				this.runAnimation(this.props);
			}
		},
		{
			key: "componentDidUpdate",
			value: function componentDidUpdate(prevProps) {
				var _this$props3 = this.props, isActive = _this$props3.isActive, canBegin = _this$props3.canBegin, attributeName = _this$props3.attributeName, shouldReAnimate = _this$props3.shouldReAnimate, to = _this$props3.to, currentFrom = _this$props3.from;
				var style = this.state.style;
				if (!canBegin) return;
				if (!isActive) {
					var newState = { style: attributeName ? _defineProperty({}, attributeName, to) : to };
					if (this.state && style) {
						if (attributeName && style[attributeName] !== to || !attributeName && style !== to) this.setState(newState);
					}
					return;
				}
				if (deepEqual(prevProps.to, to) && prevProps.canBegin && prevProps.isActive) return;
				var isTriggered = !prevProps.canBegin || !prevProps.isActive;
				if (this.manager) this.manager.stop();
				if (this.stopJSAnimation) this.stopJSAnimation();
				var from = isTriggered || shouldReAnimate ? currentFrom : prevProps.to;
				if (this.state && style) {
					var _newState = { style: attributeName ? _defineProperty({}, attributeName, from) : from };
					if (attributeName && style[attributeName] !== from || !attributeName && style !== from) this.setState(_newState);
				}
				this.runAnimation(_objectSpread(_objectSpread({}, this.props), {}, {
					from,
					begin: 0
				}));
			}
		},
		{
			key: "componentWillUnmount",
			value: function componentWillUnmount() {
				this.mounted = false;
				var onAnimationEnd = this.props.onAnimationEnd;
				if (this.unSubscribe) this.unSubscribe();
				if (this.manager) {
					this.manager.stop();
					this.manager = null;
				}
				if (this.stopJSAnimation) this.stopJSAnimation();
				if (onAnimationEnd) onAnimationEnd();
			}
		},
		{
			key: "handleStyleChange",
			value: function handleStyleChange(style) {
				this.changeStyle(style);
			}
		},
		{
			key: "changeStyle",
			value: function changeStyle(style) {
				if (this.mounted) this.setState({ style });
			}
		},
		{
			key: "runJSAnimation",
			value: function runJSAnimation(props) {
				var _this2 = this;
				var from = props.from, to = props.to, duration = props.duration, easing = props.easing, begin = props.begin, onAnimationEnd = props.onAnimationEnd, onAnimationStart = props.onAnimationStart;
				var startAnimation = configUpdate_default(from, to, configEasing(easing), duration, this.changeStyle);
				this.manager.start([
					onAnimationStart,
					begin,
					function finalStartAnimation() {
						_this2.stopJSAnimation = startAnimation();
					},
					duration,
					onAnimationEnd
				]);
			}
		},
		{
			key: "runStepAnimation",
			value: function runStepAnimation(props) {
				var _this3 = this;
				var steps = props.steps, begin = props.begin, onAnimationStart = props.onAnimationStart;
				var _steps$ = steps[0], initialStyle = _steps$.style, _steps$$duration = _steps$.duration, initialTime = _steps$$duration === void 0 ? 0 : _steps$$duration;
				return this.manager.start([onAnimationStart].concat(_toConsumableArray(steps.reduce(function addStyle(sequence, nextItem, index) {
					if (index === 0) return sequence;
					var duration = nextItem.duration, _nextItem$easing = nextItem.easing, easing = _nextItem$easing === void 0 ? "ease" : _nextItem$easing, style = nextItem.style, nextProperties = nextItem.properties, onAnimationEnd = nextItem.onAnimationEnd;
					var preItem = index > 0 ? steps[index - 1] : nextItem;
					var properties = nextProperties || Object.keys(style);
					if (typeof easing === "function" || easing === "spring") return [].concat(_toConsumableArray(sequence), [_this3.runJSAnimation.bind(_this3, {
						from: preItem.style,
						to: style,
						duration,
						easing
					}), duration]);
					var transition = getTransitionVal(properties, duration, easing);
					var newStyle = _objectSpread(_objectSpread(_objectSpread({}, preItem.style), style), {}, { transition });
					return [].concat(_toConsumableArray(sequence), [
						newStyle,
						duration,
						onAnimationEnd
					]).filter(identity);
				}, [initialStyle, Math.max(initialTime, begin)])), [props.onAnimationEnd]));
			}
		},
		{
			key: "runAnimation",
			value: function runAnimation(props) {
				if (!this.manager) this.manager = createAnimateManager();
				var begin = props.begin, duration = props.duration, attributeName = props.attributeName, propsTo = props.to, easing = props.easing, onAnimationStart = props.onAnimationStart, onAnimationEnd = props.onAnimationEnd, steps = props.steps, children = props.children;
				var manager = this.manager;
				this.unSubscribe = manager.subscribe(this.handleStyleChange);
				if (typeof easing === "function" || typeof children === "function" || easing === "spring") {
					this.runJSAnimation(props);
					return;
				}
				if (steps.length > 1) {
					this.runStepAnimation(props);
					return;
				}
				var to = attributeName ? _defineProperty({}, attributeName, propsTo) : propsTo;
				var transition = getTransitionVal(Object.keys(to), duration, easing);
				manager.start([
					onAnimationStart,
					begin,
					_objectSpread(_objectSpread({}, to), {}, { transition }),
					duration,
					onAnimationEnd
				]);
			}
		},
		{
			key: "render",
			value: function render() {
				var _this$props4 = this.props, children = _this$props4.children;
				_this$props4.begin;
				var duration = _this$props4.duration;
				_this$props4.attributeName;
				_this$props4.easing;
				var isActive = _this$props4.isActive;
				_this$props4.steps;
				_this$props4.from;
				_this$props4.to;
				_this$props4.canBegin;
				_this$props4.onAnimationEnd;
				_this$props4.shouldReAnimate;
				_this$props4.onAnimationReStart;
				var others = _objectWithoutProperties(_this$props4, _excluded);
				var count = import_react.Children.count(children);
				var stateStyle = this.state.style;
				if (typeof children === "function") return children(stateStyle);
				if (!isActive || count === 0 || duration <= 0) return children;
				var cloneContainer = function cloneContainer(container) {
					var _container$props = container.props, _container$props$styl = _container$props.style, style = _container$props$styl === void 0 ? {} : _container$props$styl, className = _container$props.className;
					return /* @__PURE__ */ (0, import_react.cloneElement)(container, _objectSpread(_objectSpread({}, others), {}, {
						style: _objectSpread(_objectSpread({}, style), stateStyle),
						className
					}));
				};
				if (count === 1) return cloneContainer(import_react.Children.only(children));
				return /*#__PURE__*/ import_react.createElement("div", null, import_react.Children.map(children, function(child) {
					return cloneContainer(child);
				}));
			}
		}
	]);
	return Animate;
}(import_react.PureComponent);
Animate.displayName = "Animate";
Animate.defaultProps = {
	begin: 0,
	duration: 1e3,
	from: "",
	to: "",
	attributeName: "",
	easing: "ease",
	isActive: true,
	canBegin: true,
	steps: [],
	onAnimationEnd: function onAnimationEnd() {},
	onAnimationStart: function onAnimationStart() {}
};
Animate.propTypes = {
	from: import_prop_types.default.oneOfType([import_prop_types.default.object, import_prop_types.default.string]),
	to: import_prop_types.default.oneOfType([import_prop_types.default.object, import_prop_types.default.string]),
	attributeName: import_prop_types.default.string,
	duration: import_prop_types.default.number,
	begin: import_prop_types.default.number,
	easing: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	steps: import_prop_types.default.arrayOf(import_prop_types.default.shape({
		duration: import_prop_types.default.number.isRequired,
		style: import_prop_types.default.object.isRequired,
		easing: import_prop_types.default.oneOfType([import_prop_types.default.oneOf([
			"ease",
			"ease-in",
			"ease-out",
			"ease-in-out",
			"linear"
		]), import_prop_types.default.func]),
		properties: import_prop_types.default.arrayOf("string"),
		onAnimationEnd: import_prop_types.default.func
	})),
	children: import_prop_types.default.oneOfType([import_prop_types.default.node, import_prop_types.default.func]),
	isActive: import_prop_types.default.bool,
	canBegin: import_prop_types.default.bool,
	onAnimationEnd: import_prop_types.default.func,
	shouldReAnimate: import_prop_types.default.bool,
	onAnimationStart: import_prop_types.default.func,
	onAnimationReStart: import_prop_types.default.func
};
//#endregion
//#region node_modules/react-smooth/es6/index.js
var es6_default = Animate;
//#endregion
export { es6_default as t };

//#region node_modules/fast-equals/dist/es/index.mjs
var { getOwnPropertyNames, getOwnPropertySymbols } = Object;
var { hasOwnProperty } = Object.prototype;
/**
* Combine two comparators into a single comparators.
*/
function combineComparators(comparatorA, comparatorB) {
	return function isEqual(a, b, state) {
		return comparatorA(a, b, state) && comparatorB(a, b, state);
	};
}
/**
* Wrap the provided `areItemsEqual` method to manage the circular state, allowing
* for circular references to be safely included in the comparison without creating
* stack overflows.
*/
function createIsCircular(areItemsEqual) {
	return function isCircular(a, b, state) {
		if (!a || !b || typeof a !== "object" || typeof b !== "object") return areItemsEqual(a, b, state);
		const { cache } = state;
		const cachedA = cache.get(a);
		const cachedB = cache.get(b);
		if (cachedA && cachedB) return cachedA === b && cachedB === a;
		cache.set(a, b);
		cache.set(b, a);
		const result = areItemsEqual(a, b, state);
		cache.delete(a);
		cache.delete(b);
		return result;
	};
}
/**
* Get the `@@toStringTag` of the value, if it exists.
*/
function getShortTag(value) {
	return value != null ? value[Symbol.toStringTag] : void 0;
}
/**
* Get the properties to strictly examine, which include both own properties that are
* not enumerable and symbol properties.
*/
function getStrictProperties(object) {
	return getOwnPropertyNames(object).concat(getOwnPropertySymbols(object));
}
/**
* Whether the object contains the property passed as an own property.
*/
var hasOwn = Object.hasOwn || ((object, property) => hasOwnProperty.call(object, property));
/**
* Whether the values passed are strictly equal or both NaN.
*/
function sameValueZeroEqual(a, b) {
	return a === b || !a && !b && a !== a && b !== b;
}
var PREACT_VNODE = "__v";
var PREACT_OWNER = "__o";
var REACT_OWNER = "_owner";
var { getOwnPropertyDescriptor, keys } = Object;
/**
* Whether the array buffers are equal in value.
*/
function areArrayBuffersEqual(a, b) {
	return a.byteLength === b.byteLength && areTypedArraysEqual(new Uint8Array(a), new Uint8Array(b));
}
/**
* Whether the arrays are equal in value.
*/
function areArraysEqual(a, b, state) {
	let index = a.length;
	if (b.length !== index) return false;
	while (index-- > 0) if (!state.equals(a[index], b[index], index, index, a, b, state)) return false;
	return true;
}
/**
* Whether the dataviews are equal in value.
*/
function areDataViewsEqual(a, b) {
	return a.byteLength === b.byteLength && areTypedArraysEqual(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength));
}
/**
* Whether the dates passed are equal in value.
*/
function areDatesEqual(a, b) {
	return sameValueZeroEqual(a.getTime(), b.getTime());
}
/**
* Whether the errors passed are equal in value.
*/
function areErrorsEqual(a, b) {
	return a.name === b.name && a.message === b.message && a.cause === b.cause && a.stack === b.stack;
}
/**
* Whether the functions passed are equal in value.
*/
function areFunctionsEqual(a, b) {
	return a === b;
}
/**
* Whether the `Map`s are equal in value.
*/
function areMapsEqual(a, b, state) {
	const size = a.size;
	if (size !== b.size) return false;
	if (!size) return true;
	const matchedIndices = new Array(size);
	const aIterable = a.entries();
	let aResult;
	let bResult;
	let index = 0;
	while (aResult = aIterable.next()) {
		if (aResult.done) break;
		const bIterable = b.entries();
		let hasMatch = false;
		let matchIndex = 0;
		while (bResult = bIterable.next()) {
			if (bResult.done) break;
			if (matchedIndices[matchIndex]) {
				matchIndex++;
				continue;
			}
			const aEntry = aResult.value;
			const bEntry = bResult.value;
			if (state.equals(aEntry[0], bEntry[0], index, matchIndex, a, b, state) && state.equals(aEntry[1], bEntry[1], aEntry[0], bEntry[0], a, b, state)) {
				hasMatch = matchedIndices[matchIndex] = true;
				break;
			}
			matchIndex++;
		}
		if (!hasMatch) return false;
		index++;
	}
	return true;
}
/**
* Whether the numbers are equal in value.
*/
var areNumbersEqual = sameValueZeroEqual;
/**
* Whether the objects are equal in value.
*/
function areObjectsEqual(a, b, state) {
	const properties = keys(a);
	let index = properties.length;
	if (keys(b).length !== index) return false;
	while (index-- > 0) if (!isPropertyEqual(a, b, state, properties[index])) return false;
	return true;
}
/**
* Whether the objects are equal in value with strict property checking.
*/
function areObjectsEqualStrict(a, b, state) {
	const properties = getStrictProperties(a);
	let index = properties.length;
	if (getStrictProperties(b).length !== index) return false;
	let property;
	let descriptorA;
	let descriptorB;
	while (index-- > 0) {
		property = properties[index];
		if (!isPropertyEqual(a, b, state, property)) return false;
		descriptorA = getOwnPropertyDescriptor(a, property);
		descriptorB = getOwnPropertyDescriptor(b, property);
		if ((descriptorA || descriptorB) && (!descriptorA || !descriptorB || descriptorA.configurable !== descriptorB.configurable || descriptorA.enumerable !== descriptorB.enumerable || descriptorA.writable !== descriptorB.writable)) return false;
	}
	return true;
}
/**
* Whether the primitive wrappers passed are equal in value.
*/
function arePrimitiveWrappersEqual(a, b) {
	return sameValueZeroEqual(a.valueOf(), b.valueOf());
}
/**
* Whether the regexps passed are equal in value.
*/
function areRegExpsEqual(a, b) {
	return a.source === b.source && a.flags === b.flags;
}
/**
* Whether the `Set`s are equal in value.
*/
function areSetsEqual(a, b, state) {
	const size = a.size;
	if (size !== b.size) return false;
	if (!size) return true;
	const matchedIndices = new Array(size);
	const aIterable = a.values();
	let aResult;
	let bResult;
	while (aResult = aIterable.next()) {
		if (aResult.done) break;
		const bIterable = b.values();
		let hasMatch = false;
		let matchIndex = 0;
		while (bResult = bIterable.next()) {
			if (bResult.done) break;
			if (!matchedIndices[matchIndex] && state.equals(aResult.value, bResult.value, aResult.value, bResult.value, a, b, state)) {
				hasMatch = matchedIndices[matchIndex] = true;
				break;
			}
			matchIndex++;
		}
		if (!hasMatch) return false;
	}
	return true;
}
/**
* Whether the TypedArray instances are equal in value.
*/
function areTypedArraysEqual(a, b) {
	let index = a.byteLength;
	if (b.byteLength !== index || a.byteOffset !== b.byteOffset) return false;
	while (index-- > 0) if (a[index] !== b[index]) return false;
	return true;
}
/**
* Whether the URL instances are equal in value.
*/
function areUrlsEqual(a, b) {
	return a.hostname === b.hostname && a.pathname === b.pathname && a.protocol === b.protocol && a.port === b.port && a.hash === b.hash && a.username === b.username && a.password === b.password;
}
function isPropertyEqual(a, b, state, property) {
	if ((property === REACT_OWNER || property === PREACT_OWNER || property === PREACT_VNODE) && (a.$$typeof || b.$$typeof)) return true;
	return hasOwn(b, property) && state.equals(a[property], b[property], property, property, a, b, state);
}
var ARRAY_BUFFER_TAG = "[object ArrayBuffer]";
var ARGUMENTS_TAG = "[object Arguments]";
var BOOLEAN_TAG = "[object Boolean]";
var DATA_VIEW_TAG = "[object DataView]";
var DATE_TAG = "[object Date]";
var ERROR_TAG = "[object Error]";
var MAP_TAG = "[object Map]";
var NUMBER_TAG = "[object Number]";
var OBJECT_TAG = "[object Object]";
var REG_EXP_TAG = "[object RegExp]";
var SET_TAG = "[object Set]";
var STRING_TAG = "[object String]";
var TYPED_ARRAY_TAGS = {
	"[object Int8Array]": true,
	"[object Uint8Array]": true,
	"[object Uint8ClampedArray]": true,
	"[object Int16Array]": true,
	"[object Uint16Array]": true,
	"[object Int32Array]": true,
	"[object Uint32Array]": true,
	"[object Float16Array]": true,
	"[object Float32Array]": true,
	"[object Float64Array]": true,
	"[object BigInt64Array]": true,
	"[object BigUint64Array]": true
};
var URL_TAG = "[object URL]";
var toString = Object.prototype.toString;
/**
* Create a comparator method based on the type-specific equality comparators passed.
*/
function createEqualityComparator({ areArrayBuffersEqual, areArraysEqual, areDataViewsEqual, areDatesEqual, areErrorsEqual, areFunctionsEqual, areMapsEqual, areNumbersEqual, areObjectsEqual, arePrimitiveWrappersEqual, areRegExpsEqual, areSetsEqual, areTypedArraysEqual, areUrlsEqual, unknownTagComparators }) {
	/**
	* compare the value of the two objects and return true if they are equivalent in values
	*/
	return function comparator(a, b, state) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		const type = typeof a;
		if (type !== typeof b) return false;
		if (type !== "object") {
			if (type === "number") return areNumbersEqual(a, b, state);
			if (type === "function") return areFunctionsEqual(a, b, state);
			return false;
		}
		const constructor = a.constructor;
		if (constructor !== b.constructor) return false;
		if (constructor === Object) return areObjectsEqual(a, b, state);
		if (Array.isArray(a)) return areArraysEqual(a, b, state);
		if (constructor === Date) return areDatesEqual(a, b, state);
		if (constructor === RegExp) return areRegExpsEqual(a, b, state);
		if (constructor === Map) return areMapsEqual(a, b, state);
		if (constructor === Set) return areSetsEqual(a, b, state);
		const tag = toString.call(a);
		if (tag === DATE_TAG) return areDatesEqual(a, b, state);
		if (tag === REG_EXP_TAG) return areRegExpsEqual(a, b, state);
		if (tag === MAP_TAG) return areMapsEqual(a, b, state);
		if (tag === SET_TAG) return areSetsEqual(a, b, state);
		if (tag === OBJECT_TAG) return typeof a.then !== "function" && typeof b.then !== "function" && areObjectsEqual(a, b, state);
		if (tag === URL_TAG) return areUrlsEqual(a, b, state);
		if (tag === ERROR_TAG) return areErrorsEqual(a, b, state);
		if (tag === ARGUMENTS_TAG) return areObjectsEqual(a, b, state);
		if (TYPED_ARRAY_TAGS[tag]) return areTypedArraysEqual(a, b, state);
		if (tag === ARRAY_BUFFER_TAG) return areArrayBuffersEqual(a, b, state);
		if (tag === DATA_VIEW_TAG) return areDataViewsEqual(a, b, state);
		if (tag === BOOLEAN_TAG || tag === NUMBER_TAG || tag === STRING_TAG) return arePrimitiveWrappersEqual(a, b, state);
		if (unknownTagComparators) {
			let unknownTagComparator = unknownTagComparators[tag];
			if (!unknownTagComparator) {
				const shortTag = getShortTag(a);
				if (shortTag) unknownTagComparator = unknownTagComparators[shortTag];
			}
			if (unknownTagComparator) return unknownTagComparator(a, b, state);
		}
		return false;
	};
}
/**
* Create the configuration object used for building comparators.
*/
function createEqualityComparatorConfig({ circular, createCustomConfig, strict }) {
	let config = {
		areArrayBuffersEqual,
		areArraysEqual: strict ? areObjectsEqualStrict : areArraysEqual,
		areDataViewsEqual,
		areDatesEqual,
		areErrorsEqual,
		areFunctionsEqual,
		areMapsEqual: strict ? combineComparators(areMapsEqual, areObjectsEqualStrict) : areMapsEqual,
		areNumbersEqual,
		areObjectsEqual: strict ? areObjectsEqualStrict : areObjectsEqual,
		arePrimitiveWrappersEqual,
		areRegExpsEqual,
		areSetsEqual: strict ? combineComparators(areSetsEqual, areObjectsEqualStrict) : areSetsEqual,
		areTypedArraysEqual: strict ? combineComparators(areTypedArraysEqual, areObjectsEqualStrict) : areTypedArraysEqual,
		areUrlsEqual,
		unknownTagComparators: void 0
	};
	if (createCustomConfig) config = Object.assign({}, config, createCustomConfig(config));
	if (circular) {
		const areArraysEqual = createIsCircular(config.areArraysEqual);
		const areMapsEqual = createIsCircular(config.areMapsEqual);
		const areObjectsEqual = createIsCircular(config.areObjectsEqual);
		const areSetsEqual = createIsCircular(config.areSetsEqual);
		config = Object.assign({}, config, {
			areArraysEqual,
			areMapsEqual,
			areObjectsEqual,
			areSetsEqual
		});
	}
	return config;
}
/**
* Default equality comparator pass-through, used as the standard `isEqual` creator for
* use inside the built comparator.
*/
function createInternalEqualityComparator(compare) {
	return function(a, b, _indexOrKeyA, _indexOrKeyB, _parentA, _parentB, state) {
		return compare(a, b, state);
	};
}
/**
* Create the `isEqual` function used by the consuming application.
*/
function createIsEqual({ circular, comparator, createState, equals, strict }) {
	if (createState) return function isEqual(a, b) {
		const { cache = circular ? /* @__PURE__ */ new WeakMap() : void 0, meta } = createState();
		return comparator(a, b, {
			cache,
			equals,
			meta,
			strict
		});
	};
	if (circular) return function isEqual(a, b) {
		return comparator(a, b, {
			cache: /* @__PURE__ */ new WeakMap(),
			equals,
			meta: void 0,
			strict
		});
	};
	const state = {
		cache: void 0,
		equals,
		meta: void 0,
		strict
	};
	return function isEqual(a, b) {
		return comparator(a, b, state);
	};
}
/**
* Whether the items passed are deeply-equal in value.
*/
var deepEqual = createCustomEqual();
createCustomEqual({ strict: true });
createCustomEqual({ circular: true });
createCustomEqual({
	circular: true,
	strict: true
});
createCustomEqual({ createInternalComparator: () => sameValueZeroEqual });
createCustomEqual({
	strict: true,
	createInternalComparator: () => sameValueZeroEqual
});
createCustomEqual({
	circular: true,
	createInternalComparator: () => sameValueZeroEqual
});
createCustomEqual({
	circular: true,
	createInternalComparator: () => sameValueZeroEqual,
	strict: true
});
/**
* Create a custom equality comparison method.
*
* This can be done to create very targeted comparisons in extreme hot-path scenarios
* where the standard methods are not performant enough, but can also be used to provide
* support for legacy environments that do not support expected features like
* `RegExp.prototype.flags` out of the box.
*/
function createCustomEqual(options = {}) {
	const { circular = false, createInternalComparator: createCustomInternalComparator, createState, strict = false } = options;
	const comparator = createEqualityComparator(createEqualityComparatorConfig(options));
	return createIsEqual({
		circular,
		comparator,
		createState,
		equals: createCustomInternalComparator ? createCustomInternalComparator(comparator) : createInternalEqualityComparator(comparator),
		strict
	});
}
//#endregion
export { deepEqual as t };

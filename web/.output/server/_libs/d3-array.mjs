//#region node_modules/d3-array/src/ascending.js
function ascending(a, b) {
	return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-array/src/descending.js
function descending(a, b) {
	return a == null || b == null ? NaN : b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-array/src/bisector.js
function bisector(f) {
	let compare1, compare2, delta;
	if (f.length !== 2) {
		compare1 = ascending;
		compare2 = (d, x) => ascending(f(d), x);
		delta = (d, x) => f(d) - x;
	} else {
		compare1 = f === ascending || f === descending ? f : zero;
		compare2 = f;
		delta = f;
	}
	function left(a, x, lo = 0, hi = a.length) {
		if (lo < hi) {
			if (compare1(x, x) !== 0) return hi;
			do {
				const mid = lo + hi >>> 1;
				if (compare2(a[mid], x) < 0) lo = mid + 1;
				else hi = mid;
			} while (lo < hi);
		}
		return lo;
	}
	function right(a, x, lo = 0, hi = a.length) {
		if (lo < hi) {
			if (compare1(x, x) !== 0) return hi;
			do {
				const mid = lo + hi >>> 1;
				if (compare2(a[mid], x) <= 0) lo = mid + 1;
				else hi = mid;
			} while (lo < hi);
		}
		return lo;
	}
	function center(a, x, lo = 0, hi = a.length) {
		const i = left(a, x, lo, hi - 1);
		return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
	}
	return {
		left,
		center,
		right
	};
}
function zero() {
	return 0;
}
//#endregion
//#region node_modules/d3-array/src/number.js
function number(x) {
	return x === null ? NaN : +x;
}
function* numbers(values, valueof) {
	if (valueof === void 0) {
		for (let value of values) if (value != null && (value = +value) >= value) yield value;
	} else {
		let index = -1;
		for (let value of values) if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) yield value;
	}
}
//#endregion
//#region node_modules/d3-array/src/bisect.js
var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;
ascendingBisect.left;
bisector(number).center;
//#endregion
//#region node_modules/d3-array/src/max.js
function max(values, valueof) {
	let max;
	if (valueof === void 0) {
		for (const value of values) if (value != null && (max < value || max === void 0 && value >= value)) max = value;
	} else {
		let index = -1;
		for (let value of values) if ((value = valueof(value, ++index, values)) != null && (max < value || max === void 0 && value >= value)) max = value;
	}
	return max;
}
//#endregion
//#region node_modules/d3-array/src/min.js
function min(values, valueof) {
	let min;
	if (valueof === void 0) {
		for (const value of values) if (value != null && (min > value || min === void 0 && value >= value)) min = value;
	} else {
		let index = -1;
		for (let value of values) if ((value = valueof(value, ++index, values)) != null && (min > value || min === void 0 && value >= value)) min = value;
	}
	return min;
}
//#endregion
//#region node_modules/d3-array/src/sort.js
function compareDefined(compare = ascending) {
	if (compare === ascending) return ascendingDefined;
	if (typeof compare !== "function") throw new TypeError("compare is not a function");
	return (a, b) => {
		const x = compare(a, b);
		if (x || x === 0) return x;
		return (compare(b, b) === 0) - (compare(a, a) === 0);
	};
}
function ascendingDefined(a, b) {
	return (a == null || !(a >= a)) - (b == null || !(b >= b)) || (a < b ? -1 : a > b ? 1 : 0);
}
//#endregion
//#region node_modules/d3-array/src/quickselect.js
function quickselect(array, k, left = 0, right = Infinity, compare) {
	k = Math.floor(k);
	left = Math.floor(Math.max(0, left));
	right = Math.floor(Math.min(array.length - 1, right));
	if (!(left <= k && k <= right)) return array;
	compare = compare === void 0 ? ascendingDefined : compareDefined(compare);
	while (right > left) {
		if (right - left > 600) {
			const n = right - left + 1;
			const m = k - left + 1;
			const z = Math.log(n);
			const s = .5 * Math.exp(2 * z / 3);
			const sd = .5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
			const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
			const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
			quickselect(array, k, newLeft, newRight, compare);
		}
		const t = array[k];
		let i = left;
		let j = right;
		swap(array, left, k);
		if (compare(array[right], t) > 0) swap(array, left, right);
		while (i < j) {
			swap(array, i, j), ++i, --j;
			while (compare(array[i], t) < 0) ++i;
			while (compare(array[j], t) > 0) --j;
		}
		if (compare(array[left], t) === 0) swap(array, left, j);
		else ++j, swap(array, j, right);
		if (j <= k) left = j + 1;
		if (k <= j) right = j - 1;
	}
	return array;
}
function swap(array, i, j) {
	const t = array[i];
	array[i] = array[j];
	array[j] = t;
}
//#endregion
//#region node_modules/d3-array/src/quantile.js
function quantile(values, p, valueof) {
	values = Float64Array.from(numbers(values, valueof));
	if (!(n = values.length) || isNaN(p = +p)) return;
	if (p <= 0 || n < 2) return min(values);
	if (p >= 1) return max(values);
	var n, i = (n - 1) * p, i0 = Math.floor(i), value0 = max(quickselect(values, i0).subarray(0, i0 + 1));
	return value0 + (min(values.subarray(i0 + 1)) - value0) * (i - i0);
}
function quantileSorted(values, p, valueof = number) {
	if (!(n = values.length) || isNaN(p = +p)) return;
	if (p <= 0 || n < 2) return +valueof(values[0], 0, values);
	if (p >= 1) return +valueof(values[n - 1], n - 1, values);
	var n, i = (n - 1) * p, i0 = Math.floor(i), value0 = +valueof(values[i0], i0, values);
	return value0 + (+valueof(values[i0 + 1], i0 + 1, values) - value0) * (i - i0);
}
//#endregion
//#region node_modules/d3-array/src/range.js
function range(start, stop, step) {
	start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
	var i = -1, n = Math.max(0, Math.ceil((stop - start) / step)) | 0, range = new Array(n);
	while (++i < n) range[i] = start + i * step;
	return range;
}
//#endregion
//#region node_modules/d3-array/src/ticks.js
var e10 = Math.sqrt(50), e5 = Math.sqrt(10), e2 = Math.sqrt(2);
function tickSpec(start, stop, count) {
	const step = (stop - start) / Math.max(0, count), power = Math.floor(Math.log10(step)), error = step / Math.pow(10, power), factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
	let i1, i2, inc;
	if (power < 0) {
		inc = Math.pow(10, -power) / factor;
		i1 = Math.round(start * inc);
		i2 = Math.round(stop * inc);
		if (i1 / inc < start) ++i1;
		if (i2 / inc > stop) --i2;
		inc = -inc;
	} else {
		inc = Math.pow(10, power) * factor;
		i1 = Math.round(start / inc);
		i2 = Math.round(stop / inc);
		if (i1 * inc < start) ++i1;
		if (i2 * inc > stop) --i2;
	}
	if (i2 < i1 && .5 <= count && count < 2) return tickSpec(start, stop, count * 2);
	return [
		i1,
		i2,
		inc
	];
}
function ticks(start, stop, count) {
	stop = +stop, start = +start, count = +count;
	if (!(count > 0)) return [];
	if (start === stop) return [start];
	const reverse = stop < start, [i1, i2, inc] = reverse ? tickSpec(stop, start, count) : tickSpec(start, stop, count);
	if (!(i2 >= i1)) return [];
	const n = i2 - i1 + 1, ticks = new Array(n);
	if (reverse) if (inc < 0) for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) / -inc;
	else for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) * inc;
	else if (inc < 0) for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) / -inc;
	else for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) * inc;
	return ticks;
}
function tickIncrement(start, stop, count) {
	stop = +stop, start = +start, count = +count;
	return tickSpec(start, stop, count)[2];
}
function tickStep(start, stop, count) {
	stop = +stop, start = +start, count = +count;
	const reverse = stop < start, inc = reverse ? tickIncrement(stop, start, count) : tickIncrement(start, stop, count);
	return (reverse ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
}
//#endregion
export { quantile as a, bisector as c, range as i, ascending as l, tickStep as n, quantileSorted as o, ticks as r, bisectRight as s, tickIncrement as t };

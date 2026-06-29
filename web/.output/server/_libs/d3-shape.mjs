import { t as Path } from "./d3-path.mjs";
//#region node_modules/d3-shape/src/constant.js
function constant_default(x) {
	return function constant() {
		return x;
	};
}
//#endregion
//#region node_modules/d3-shape/src/math.js
var cos = Math.cos;
var sin = Math.sin;
var sqrt = Math.sqrt;
var pi = Math.PI;
pi / 2;
var tau = 2 * pi;
//#endregion
//#region node_modules/d3-shape/src/path.js
function withPath(shape) {
	let digits = 3;
	shape.digits = function(_) {
		if (!arguments.length) return digits;
		if (_ == null) digits = null;
		else {
			const d = Math.floor(_);
			if (!(d >= 0)) throw new RangeError(`invalid digits: ${_}`);
			digits = d;
		}
		return shape;
	};
	return () => new Path(digits);
}
Array.prototype.slice;
function array_default(x) {
	return typeof x === "object" && "length" in x ? x : Array.from(x);
}
//#endregion
//#region node_modules/d3-shape/src/curve/linear.js
function Linear(context) {
	this._context = context;
}
Linear.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
		this._line = 1 - this._line;
	},
	point: function(x, y) {
		x = +x, y = +y;
		switch (this._point) {
			case 0:
				this._point = 1;
				this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
				break;
			case 1: this._point = 2;
			default:
				this._context.lineTo(x, y);
				break;
		}
	}
};
function linear_default(context) {
	return new Linear(context);
}
//#endregion
//#region node_modules/d3-shape/src/point.js
function x(p) {
	return p[0];
}
function y(p) {
	return p[1];
}
//#endregion
//#region node_modules/d3-shape/src/line.js
function line_default(x$1, y$1) {
	var defined = constant_default(true), context = null, curve = linear_default, output = null, path = withPath(line);
	x$1 = typeof x$1 === "function" ? x$1 : x$1 === void 0 ? x : constant_default(x$1);
	y$1 = typeof y$1 === "function" ? y$1 : y$1 === void 0 ? y : constant_default(y$1);
	function line(data) {
		var i, n = (data = array_default(data)).length, d, defined0 = false, buffer;
		if (context == null) output = curve(buffer = path());
		for (i = 0; i <= n; ++i) {
			if (!(i < n && defined(d = data[i], i, data)) === defined0) if (defined0 = !defined0) output.lineStart();
			else output.lineEnd();
			if (defined0) output.point(+x$1(d, i, data), +y$1(d, i, data));
		}
		if (buffer) return output = null, buffer + "" || null;
	}
	line.x = function(_) {
		return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant_default(+_), line) : x$1;
	};
	line.y = function(_) {
		return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant_default(+_), line) : y$1;
	};
	line.defined = function(_) {
		return arguments.length ? (defined = typeof _ === "function" ? _ : constant_default(!!_), line) : defined;
	};
	line.curve = function(_) {
		return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
	};
	line.context = function(_) {
		return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
	};
	return line;
}
//#endregion
//#region node_modules/d3-shape/src/area.js
function area_default(x0, y0, y1) {
	var x1 = null, defined = constant_default(true), context = null, curve = linear_default, output = null, path = withPath(area);
	x0 = typeof x0 === "function" ? x0 : x0 === void 0 ? x : constant_default(+x0);
	y0 = typeof y0 === "function" ? y0 : y0 === void 0 ? constant_default(0) : constant_default(+y0);
	y1 = typeof y1 === "function" ? y1 : y1 === void 0 ? y : constant_default(+y1);
	function area(data) {
		var i, j, k, n = (data = array_default(data)).length, d, defined0 = false, buffer, x0z = new Array(n), y0z = new Array(n);
		if (context == null) output = curve(buffer = path());
		for (i = 0; i <= n; ++i) {
			if (!(i < n && defined(d = data[i], i, data)) === defined0) if (defined0 = !defined0) {
				j = i;
				output.areaStart();
				output.lineStart();
			} else {
				output.lineEnd();
				output.lineStart();
				for (k = i - 1; k >= j; --k) output.point(x0z[k], y0z[k]);
				output.lineEnd();
				output.areaEnd();
			}
			if (defined0) {
				x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
				output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
			}
		}
		if (buffer) return output = null, buffer + "" || null;
	}
	function arealine() {
		return line_default().defined(defined).curve(curve).context(context);
	}
	area.x = function(_) {
		return arguments.length ? (x0 = typeof _ === "function" ? _ : constant_default(+_), x1 = null, area) : x0;
	};
	area.x0 = function(_) {
		return arguments.length ? (x0 = typeof _ === "function" ? _ : constant_default(+_), area) : x0;
	};
	area.x1 = function(_) {
		return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant_default(+_), area) : x1;
	};
	area.y = function(_) {
		return arguments.length ? (y0 = typeof _ === "function" ? _ : constant_default(+_), y1 = null, area) : y0;
	};
	area.y0 = function(_) {
		return arguments.length ? (y0 = typeof _ === "function" ? _ : constant_default(+_), area) : y0;
	};
	area.y1 = function(_) {
		return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant_default(+_), area) : y1;
	};
	area.lineX0 = area.lineY0 = function() {
		return arealine().x(x0).y(y0);
	};
	area.lineY1 = function() {
		return arealine().x(x0).y(y1);
	};
	area.lineX1 = function() {
		return arealine().x(x1).y(y0);
	};
	area.defined = function(_) {
		return arguments.length ? (defined = typeof _ === "function" ? _ : constant_default(!!_), area) : defined;
	};
	area.curve = function(_) {
		return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
	};
	area.context = function(_) {
		return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
	};
	return area;
}
//#endregion
//#region node_modules/d3-shape/src/curve/bump.js
var Bump = class {
	constructor(context, x) {
		this._context = context;
		this._x = x;
	}
	areaStart() {
		this._line = 0;
	}
	areaEnd() {
		this._line = NaN;
	}
	lineStart() {
		this._point = 0;
	}
	lineEnd() {
		if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
		this._line = 1 - this._line;
	}
	point(x, y) {
		x = +x, y = +y;
		switch (this._point) {
			case 0:
				this._point = 1;
				if (this._line) this._context.lineTo(x, y);
				else this._context.moveTo(x, y);
				break;
			case 1: this._point = 2;
			default:
				if (this._x) this._context.bezierCurveTo(this._x0 = (this._x0 + x) / 2, this._y0, this._x0, y, x, y);
				else this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + y) / 2, x, this._y0, x, y);
				break;
		}
		this._x0 = x, this._y0 = y;
	}
};
function bumpX(context) {
	return new Bump(context, true);
}
function bumpY(context) {
	return new Bump(context, false);
}
//#endregion
//#region node_modules/d3-shape/src/symbol/circle.js
var circle_default = { draw(context, size) {
	const r = sqrt(size / pi);
	context.moveTo(r, 0);
	context.arc(0, 0, r, 0, tau);
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/cross.js
var cross_default = { draw(context, size) {
	const r = sqrt(size / 5) / 2;
	context.moveTo(-3 * r, -r);
	context.lineTo(-r, -r);
	context.lineTo(-r, -3 * r);
	context.lineTo(r, -3 * r);
	context.lineTo(r, -r);
	context.lineTo(3 * r, -r);
	context.lineTo(3 * r, r);
	context.lineTo(r, r);
	context.lineTo(r, 3 * r);
	context.lineTo(-r, 3 * r);
	context.lineTo(-r, r);
	context.lineTo(-3 * r, r);
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/diamond.js
var tan30 = sqrt(1 / 3);
var tan30_2 = tan30 * 2;
var diamond_default = { draw(context, size) {
	const y = sqrt(size / tan30_2);
	const x = y * tan30;
	context.moveTo(0, -y);
	context.lineTo(x, 0);
	context.lineTo(0, y);
	context.lineTo(-x, 0);
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/square.js
var square_default = { draw(context, size) {
	const w = sqrt(size);
	const x = -w / 2;
	context.rect(x, x, w, w);
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/star.js
var ka = .8908130915292852;
var kr = sin(pi / 10) / sin(7 * pi / 10);
var kx = sin(tau / 10) * kr;
var ky = -cos(tau / 10) * kr;
var star_default = { draw(context, size) {
	const r = sqrt(size * ka);
	const x = kx * r;
	const y = ky * r;
	context.moveTo(0, -r);
	context.lineTo(x, y);
	for (let i = 1; i < 5; ++i) {
		const a = tau * i / 5;
		const c = cos(a);
		const s = sin(a);
		context.lineTo(s * r, -c * r);
		context.lineTo(c * x - s * y, s * x + c * y);
	}
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/triangle.js
var sqrt3 = sqrt(3);
var triangle_default = { draw(context, size) {
	const y = -sqrt(size / (sqrt3 * 3));
	context.moveTo(0, y * 2);
	context.lineTo(-sqrt3 * y, -y);
	context.lineTo(sqrt3 * y, -y);
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/wye.js
var c = -.5;
var s = sqrt(3) / 2;
var k = 1 / sqrt(12);
var a = (k / 2 + 1) * 3;
var wye_default = { draw(context, size) {
	const r = sqrt(size / a);
	const x0 = r / 2, y0 = r * k;
	const x1 = x0, y1 = r * k + r;
	const x2 = -x1, y2 = y1;
	context.moveTo(x0, y0);
	context.lineTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineTo(c * x0 - s * y0, s * x0 + c * y0);
	context.lineTo(c * x1 - s * y1, s * x1 + c * y1);
	context.lineTo(c * x2 - s * y2, s * x2 + c * y2);
	context.lineTo(c * x0 + s * y0, c * y0 - s * x0);
	context.lineTo(c * x1 + s * y1, c * y1 - s * x1);
	context.lineTo(c * x2 + s * y2, c * y2 - s * x2);
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol.js
function Symbol(type, size) {
	let context = null, path = withPath(symbol);
	type = typeof type === "function" ? type : constant_default(type || circle_default);
	size = typeof size === "function" ? size : constant_default(size === void 0 ? 64 : +size);
	function symbol() {
		let buffer;
		if (!context) context = buffer = path();
		type.apply(this, arguments).draw(context, +size.apply(this, arguments));
		if (buffer) return context = null, buffer + "" || null;
	}
	symbol.type = function(_) {
		return arguments.length ? (type = typeof _ === "function" ? _ : constant_default(_), symbol) : type;
	};
	symbol.size = function(_) {
		return arguments.length ? (size = typeof _ === "function" ? _ : constant_default(+_), symbol) : size;
	};
	symbol.context = function(_) {
		return arguments.length ? (context = _ == null ? null : _, symbol) : context;
	};
	return symbol;
}
//#endregion
//#region node_modules/d3-shape/src/noop.js
function noop_default() {}
//#endregion
//#region node_modules/d3-shape/src/curve/basis.js
function point$1(that, x, y) {
	that._context.bezierCurveTo((2 * that._x0 + that._x1) / 3, (2 * that._y0 + that._y1) / 3, (that._x0 + 2 * that._x1) / 3, (that._y0 + 2 * that._y1) / 3, (that._x0 + 4 * that._x1 + x) / 6, (that._y0 + 4 * that._y1 + y) / 6);
}
function Basis(context) {
	this._context = context;
}
Basis.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = NaN;
		this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 3: point$1(this, this._x1, this._y1);
			case 2:
				this._context.lineTo(this._x1, this._y1);
				break;
		}
		if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
		this._line = 1 - this._line;
	},
	point: function(x, y) {
		x = +x, y = +y;
		switch (this._point) {
			case 0:
				this._point = 1;
				this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
				break;
			case 1:
				this._point = 2;
				break;
			case 2:
				this._point = 3;
				this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
			default:
				point$1(this, x, y);
				break;
		}
		this._x0 = this._x1, this._x1 = x;
		this._y0 = this._y1, this._y1 = y;
	}
};
function basis_default(context) {
	return new Basis(context);
}
//#endregion
//#region node_modules/d3-shape/src/curve/basisClosed.js
function BasisClosed(context) {
	this._context = context;
}
BasisClosed.prototype = {
	areaStart: noop_default,
	areaEnd: noop_default,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
		this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x2, this._y2);
				this._context.closePath();
				break;
			case 2:
				this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);
				this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);
				this._context.closePath();
				break;
			case 3:
				this.point(this._x2, this._y2);
				this.point(this._x3, this._y3);
				this.point(this._x4, this._y4);
				break;
		}
	},
	point: function(x, y) {
		x = +x, y = +y;
		switch (this._point) {
			case 0:
				this._point = 1;
				this._x2 = x, this._y2 = y;
				break;
			case 1:
				this._point = 2;
				this._x3 = x, this._y3 = y;
				break;
			case 2:
				this._point = 3;
				this._x4 = x, this._y4 = y;
				this._context.moveTo((this._x0 + 4 * this._x1 + x) / 6, (this._y0 + 4 * this._y1 + y) / 6);
				break;
			default:
				point$1(this, x, y);
				break;
		}
		this._x0 = this._x1, this._x1 = x;
		this._y0 = this._y1, this._y1 = y;
	}
};
function basisClosed_default(context) {
	return new BasisClosed(context);
}
//#endregion
//#region node_modules/d3-shape/src/curve/basisOpen.js
function BasisOpen(context) {
	this._context = context;
}
BasisOpen.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = NaN;
		this._point = 0;
	},
	lineEnd: function() {
		if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
		this._line = 1 - this._line;
	},
	point: function(x, y) {
		x = +x, y = +y;
		switch (this._point) {
			case 0:
				this._point = 1;
				break;
			case 1:
				this._point = 2;
				break;
			case 2:
				this._point = 3;
				var x0 = (this._x0 + 4 * this._x1 + x) / 6, y0 = (this._y0 + 4 * this._y1 + y) / 6;
				this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0);
				break;
			case 3: this._point = 4;
			default:
				point$1(this, x, y);
				break;
		}
		this._x0 = this._x1, this._x1 = x;
		this._y0 = this._y1, this._y1 = y;
	}
};
function basisOpen_default(context) {
	return new BasisOpen(context);
}
//#endregion
//#region node_modules/d3-shape/src/curve/linearClosed.js
function LinearClosed(context) {
	this._context = context;
}
LinearClosed.prototype = {
	areaStart: noop_default,
	areaEnd: noop_default,
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		if (this._point) this._context.closePath();
	},
	point: function(x, y) {
		x = +x, y = +y;
		if (this._point) this._context.lineTo(x, y);
		else this._point = 1, this._context.moveTo(x, y);
	}
};
function linearClosed_default(context) {
	return new LinearClosed(context);
}
//#endregion
//#region node_modules/d3-shape/src/curve/monotone.js
function sign(x) {
	return x < 0 ? -1 : 1;
}
function slope3(that, x2, y2) {
	var h0 = that._x1 - that._x0, h1 = x2 - that._x1, s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0), s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0), p = (s0 * h1 + s1 * h0) / (h0 + h1);
	return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), .5 * Math.abs(p)) || 0;
}
function slope2(that, t) {
	var h = that._x1 - that._x0;
	return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
}
function point(that, t0, t1) {
	var x0 = that._x0, y0 = that._y0, x1 = that._x1, y1 = that._y1, dx = (x1 - x0) / 3;
	that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
}
function MonotoneX(context) {
	this._context = context;
}
MonotoneX.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
		this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 2:
				this._context.lineTo(this._x1, this._y1);
				break;
			case 3:
				point(this, this._t0, slope2(this, this._t0));
				break;
		}
		if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
		this._line = 1 - this._line;
	},
	point: function(x, y) {
		var t1 = NaN;
		x = +x, y = +y;
		if (x === this._x1 && y === this._y1) return;
		switch (this._point) {
			case 0:
				this._point = 1;
				this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
				break;
			case 1:
				this._point = 2;
				break;
			case 2:
				this._point = 3;
				point(this, slope2(this, t1 = slope3(this, x, y)), t1);
				break;
			default:
				point(this, this._t0, t1 = slope3(this, x, y));
				break;
		}
		this._x0 = this._x1, this._x1 = x;
		this._y0 = this._y1, this._y1 = y;
		this._t0 = t1;
	}
};
function MonotoneY(context) {
	this._context = new ReflectContext(context);
}
(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
	MonotoneX.prototype.point.call(this, y, x);
};
function ReflectContext(context) {
	this._context = context;
}
ReflectContext.prototype = {
	moveTo: function(x, y) {
		this._context.moveTo(y, x);
	},
	closePath: function() {
		this._context.closePath();
	},
	lineTo: function(x, y) {
		this._context.lineTo(y, x);
	},
	bezierCurveTo: function(x1, y1, x2, y2, x, y) {
		this._context.bezierCurveTo(y1, x1, y2, x2, y, x);
	}
};
function monotoneX(context) {
	return new MonotoneX(context);
}
function monotoneY(context) {
	return new MonotoneY(context);
}
//#endregion
//#region node_modules/d3-shape/src/curve/natural.js
function Natural(context) {
	this._context = context;
}
Natural.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x = [];
		this._y = [];
	},
	lineEnd: function() {
		var x = this._x, y = this._y, n = x.length;
		if (n) {
			this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]);
			if (n === 2) this._context.lineTo(x[1], y[1]);
			else {
				var px = controlPoints(x), py = controlPoints(y);
				for (var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1) this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
			}
		}
		if (this._line || this._line !== 0 && n === 1) this._context.closePath();
		this._line = 1 - this._line;
		this._x = this._y = null;
	},
	point: function(x, y) {
		this._x.push(+x);
		this._y.push(+y);
	}
};
function controlPoints(x) {
	var i, n = x.length - 1, m, a = new Array(n), b = new Array(n), r = new Array(n);
	a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];
	for (i = 1; i < n - 1; ++i) a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];
	a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];
	for (i = 1; i < n; ++i) m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
	a[n - 1] = r[n - 1] / b[n - 1];
	for (i = n - 2; i >= 0; --i) a[i] = (r[i] - a[i + 1]) / b[i];
	b[n - 1] = (x[n] + a[n - 1]) / 2;
	for (i = 0; i < n - 1; ++i) b[i] = 2 * x[i + 1] - a[i + 1];
	return [a, b];
}
function natural_default(context) {
	return new Natural(context);
}
//#endregion
//#region node_modules/d3-shape/src/curve/step.js
function Step(context, t) {
	this._context = context;
	this._t = t;
}
Step.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x = this._y = NaN;
		this._point = 0;
	},
	lineEnd: function() {
		if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
		if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
		if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
	},
	point: function(x, y) {
		x = +x, y = +y;
		switch (this._point) {
			case 0:
				this._point = 1;
				this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
				break;
			case 1: this._point = 2;
			default:
				if (this._t <= 0) {
					this._context.lineTo(this._x, y);
					this._context.lineTo(x, y);
				} else {
					var x1 = this._x * (1 - this._t) + x * this._t;
					this._context.lineTo(x1, this._y);
					this._context.lineTo(x1, y);
				}
				break;
		}
		this._x = x, this._y = y;
	}
};
function step_default(context) {
	return new Step(context, .5);
}
function stepBefore(context) {
	return new Step(context, 0);
}
function stepAfter(context) {
	return new Step(context, 1);
}
//#endregion
//#region node_modules/d3-shape/src/offset/none.js
function none_default$1(series, order) {
	if (!((n = series.length) > 1)) return;
	for (var i = 1, j, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
		s0 = s1, s1 = series[order[i]];
		for (j = 0; j < m; ++j) s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
	}
}
//#endregion
//#region node_modules/d3-shape/src/order/none.js
function none_default(series) {
	var n = series.length, o = new Array(n);
	while (--n >= 0) o[n] = n;
	return o;
}
//#endregion
//#region node_modules/d3-shape/src/stack.js
function stackValue(d, key) {
	return d[key];
}
function stackSeries(key) {
	const series = [];
	series.key = key;
	return series;
}
function stack_default() {
	var keys = constant_default([]), order = none_default, offset = none_default$1, value = stackValue;
	function stack(data) {
		var sz = Array.from(keys.apply(this, arguments), stackSeries), i, n = sz.length, j = -1, oz;
		for (const d of data) for (i = 0, ++j; i < n; ++i) (sz[i][j] = [0, +value(d, sz[i].key, j, data)]).data = d;
		for (i = 0, oz = array_default(order(sz)); i < n; ++i) sz[oz[i]].index = i;
		offset(sz, oz);
		return sz;
	}
	stack.keys = function(_) {
		return arguments.length ? (keys = typeof _ === "function" ? _ : constant_default(Array.from(_)), stack) : keys;
	};
	stack.value = function(_) {
		return arguments.length ? (value = typeof _ === "function" ? _ : constant_default(+_), stack) : value;
	};
	stack.order = function(_) {
		return arguments.length ? (order = _ == null ? none_default : typeof _ === "function" ? _ : constant_default(Array.from(_)), stack) : order;
	};
	stack.offset = function(_) {
		return arguments.length ? (offset = _ == null ? none_default$1 : _, stack) : offset;
	};
	return stack;
}
//#endregion
//#region node_modules/d3-shape/src/offset/expand.js
function expand_default(series, order) {
	if (!((n = series.length) > 0)) return;
	for (var i, n, j = 0, m = series[0].length, y; j < m; ++j) {
		for (y = i = 0; i < n; ++i) y += series[i][j][1] || 0;
		if (y) for (i = 0; i < n; ++i) series[i][j][1] /= y;
	}
	none_default$1(series, order);
}
//#endregion
//#region node_modules/d3-shape/src/offset/silhouette.js
function silhouette_default(series, order) {
	if (!((n = series.length) > 0)) return;
	for (var j = 0, s0 = series[order[0]], n, m = s0.length; j < m; ++j) {
		for (var i = 0, y = 0; i < n; ++i) y += series[i][j][1] || 0;
		s0[j][1] += s0[j][0] = -y / 2;
	}
	none_default$1(series, order);
}
//#endregion
//#region node_modules/d3-shape/src/offset/wiggle.js
function wiggle_default(series, order) {
	if (!((n = series.length) > 0) || !((m = (s0 = series[order[0]]).length) > 0)) return;
	for (var y = 0, j = 1, s0, m, n; j < m; ++j) {
		for (var i = 0, s1 = 0, s2 = 0; i < n; ++i) {
			var si = series[order[i]], sij0 = si[j][1] || 0, s3 = (sij0 - (si[j - 1][1] || 0)) / 2;
			for (var k = 0; k < i; ++k) {
				var sk = series[order[k]], skj0 = sk[j][1] || 0, skj1 = sk[j - 1][1] || 0;
				s3 += skj0 - skj1;
			}
			s1 += sij0, s2 += s3 * sij0;
		}
		s0[j - 1][1] += s0[j - 1][0] = y;
		if (s1) y -= s2 / s1;
	}
	s0[j - 1][1] += s0[j - 1][0] = y;
	none_default$1(series, order);
}
//#endregion
export { cross_default as C, area_default as D, bumpY as E, line_default as O, diamond_default as S, bumpX as T, Symbol as _, none_default as a, star_default as b, stepBefore as c, monotoneX as d, monotoneY as f, basis_default as g, basisClosed_default as h, stack_default as i, linear_default as k, step_default as l, basisOpen_default as m, silhouette_default as n, none_default$1 as o, linearClosed_default as p, expand_default as r, stepAfter as s, wiggle_default as t, natural_default as u, wye_default as v, circle_default as w, square_default as x, triangle_default as y };

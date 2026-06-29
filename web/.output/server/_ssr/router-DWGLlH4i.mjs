import { i as __toESM } from "../_runtime.mjs";
import { r as applySettingsFromStorage } from "./theme-DpOxYHtX.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { P as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DWGLlH4i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-lepxVHbe.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: {
			style: {
				background: "var(--background)",
				color: "var(--foreground)",
				border: "1px solid var(--border)"
			},
			classNames: {
				toast: "group toast group-[.toaster]:shadow-lg",
				description: "text-muted-foreground",
				actionButton: "bg-primary text-primary-foreground",
				cancelButton: "bg-muted text-muted-foreground"
			}
		},
		...props
	});
};
applySettingsFromStorage();
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$3 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Autosecure" },
			{
				name: "description",
				content: "Autosecure Dashboard"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function AnimationCanvas() {
	const canvasRef = (0, import_react.useRef)(null);
	const rafRef = (0, import_react.useRef)(0);
	const [anim, setAnim] = (0, import_react.useState)("none");
	(0, import_react.useEffect)(() => {
		const read = () => setAnim(document.documentElement.getAttribute("data-animation") ?? "none");
		read();
		const obs = new MutationObserver(read);
		obs.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-animation"]
		});
		return () => obs.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resize();
		window.addEventListener("resize", resize);
		cancelAnimationFrame(rafRef.current);
		if (anim === "none") {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			return () => window.removeEventListener("resize", resize);
		}
		let t = 0;
		if (anim === "starfield") {
			const stars = Array.from({ length: 280 }, () => ({
				x: Math.random() * window.innerWidth,
				y: Math.random() * window.innerHeight,
				r: Math.random() * 1.6 + .3,
				vx: (Math.random() - .5) * 1.2,
				vy: (Math.random() - .5) * 1.2,
				phase: Math.random() * Math.PI * 2,
				speed: Math.random() * .025 + .008
			}));
			const tick = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				t++;
				for (const s of stars) {
					s.x += s.vx;
					s.y += s.vy;
					if (s.x < -5) s.x = canvas.width + 5;
					if (s.x > canvas.width + 5) s.x = -5;
					if (s.y < -5) s.y = canvas.height + 5;
					if (s.y > canvas.height + 5) s.y = -5;
					const a = .2 + .65 * Math.abs(Math.sin(t * s.speed + s.phase));
					ctx.beginPath();
					ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
					ctx.fill();
				}
				rafRef.current = requestAnimationFrame(tick);
			};
			rafRef.current = requestAnimationFrame(tick);
		} else if (anim === "aurora") {
			const tick = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				t++;
				const time = t * .005;
				for (let i = 0; i < 4; i++) {
					const hue = (i * 80 + t * .25) % 360;
					const hue2 = (hue + 60) % 360;
					const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
					grad.addColorStop(0, `hsla(${hue},75%,60%,0)`);
					grad.addColorStop(.3 + i * .08, `hsla(${hue},75%,60%,0.15)`);
					grad.addColorStop(.65 - i * .04, `hsla(${hue2},70%,65%,0.15)`);
					grad.addColorStop(1, `hsla(${hue2},70%,65%,0)`);
					ctx.beginPath();
					const yBase = canvas.height * (.12 + i * .18);
					ctx.moveTo(0, yBase);
					for (let x = 0; x <= canvas.width; x += 4) {
						const y = yBase + Math.sin(x * .005 + time * 3 + i * 1.5) * 90 + Math.sin(x * .011 + time * 4 + i * .7) * 45;
						ctx.lineTo(x, y);
					}
					ctx.lineTo(canvas.width, 0);
					ctx.lineTo(0, 0);
					ctx.closePath();
					ctx.fillStyle = grad;
					ctx.fill();
				}
				rafRef.current = requestAnimationFrame(tick);
			};
			rafRef.current = requestAnimationFrame(tick);
		} else if (anim === "particles") {
			const pts = Array.from({ length: 300 }, () => ({
				x: Math.random() * window.innerWidth,
				y: window.innerHeight + Math.random() * window.innerHeight,
				r: Math.random() * 2.5 + .5,
				vy: Math.random() * 2 + .5,
				vx: (Math.random() - .5) * 1,
				a: Math.random() * .4 + .1
			}));
			const tick = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				for (const p of pts) {
					p.y -= p.vy;
					p.x += p.vx;
					if (p.y < -10) {
						p.y = canvas.height + 10;
						p.x = Math.random() * canvas.width;
					}
					ctx.beginPath();
					ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(160,210,255,${p.a.toFixed(2)})`;
					ctx.fill();
				}
				rafRef.current = requestAnimationFrame(tick);
			};
			rafRef.current = requestAnimationFrame(tick);
		} else if (anim === "rain") {
			const drops = Array.from({ length: 250 }, () => ({
				x: Math.random() * window.innerWidth,
				y: Math.random() * window.innerHeight,
				len: Math.random() * 20 + 10,
				vy: Math.random() * 12 + 6,
				a: Math.random() * .3 + .15
			}));
			const tick = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				for (const d of drops) {
					d.y += d.vy;
					if (d.y > canvas.height + d.len) {
						d.y = -d.len;
						d.x = Math.random() * canvas.width;
					}
					ctx.beginPath();
					ctx.moveTo(d.x, d.y);
					ctx.lineTo(d.x, d.y + d.len);
					ctx.strokeStyle = `rgba(100,220,255,${d.a.toFixed(2)})`;
					ctx.lineWidth = 1.5;
					ctx.stroke();
				}
				rafRef.current = requestAnimationFrame(tick);
			};
			rafRef.current = requestAnimationFrame(tick);
		} else if (anim === "waves") {
			const tick = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				t++;
				const time = t * .03;
				for (let i = 0; i < 6; i++) {
					ctx.beginPath();
					const yBase = canvas.height * (.25 + i * .1);
					const amp = 35 + i * 12;
					const freq = .005 - i * 4e-4;
					ctx.moveTo(0, yBase);
					for (let x = 0; x <= canvas.width; x += 4) ctx.lineTo(x, yBase + Math.sin(x * freq + time * 1 + i * 1.1) * amp);
					ctx.lineTo(canvas.width, canvas.height);
					ctx.lineTo(0, canvas.height);
					ctx.closePath();
					ctx.fillStyle = `rgba(100,180,255,${Math.max(0, .06 - i * .008).toFixed(3)})`;
					ctx.fill();
				}
				rafRef.current = requestAnimationFrame(tick);
			};
			rafRef.current = requestAnimationFrame(tick);
		}
		return () => {
			cancelAnimationFrame(rafRef.current);
			window.removeEventListener("resize", resize);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		};
	}, [anim]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		"aria-hidden": true,
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 0,
			pointerEvents: "none",
			opacity: .55
		}
	});
}
function RootComponent() {
	const { queryClient } = Route$3.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimationCanvas, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		]
	});
}
var $$splitComponentImporter$2 = () => import("./login-y-RKtoWo.mjs");
var Route$2 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Sign in — Autosecure" }, {
		name: "description",
		content: "Sign in to your autosecure account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./dashboard-Dxmgtl_p.mjs");
var Route$1 = createFileRoute("/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — Autosecure" }, {
		name: "description",
		content: "Manage your secured accounts."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./routes-Dm73dssL.mjs");
var Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "Autosecure — Automatic account security for Microsoft & Minecraft" },
			{
				name: "description",
				content: "Autosecure keeps your Microsoft and Minecraft accounts safe. Automated rotation, continuous monitoring, and intelligent verification — set it and forget it."
			},
			{
				property: "og:title",
				content: "Autosecure — Automatic account security"
			},
			{
				property: "og:description",
				content: "Automated security for Microsoft & Minecraft accounts. Rotate credentials, kick intruders, monitor 24/7."
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: ""
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
			}
		]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var LoginRoute = Route$2.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$3
});
var DashboardRoute = Route$1.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$3
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	DashboardRoute,
	LoginRoute
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };

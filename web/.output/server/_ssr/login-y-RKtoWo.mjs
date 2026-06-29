import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as AUTH_EVENT } from "./auth-BiuSICiJ.mjs";
import { N as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Eye, O as EyeOff, R as ArrowRight, S as Loader, x as Lock } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-y-RKtoWo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPw, setShowPw] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		if (!username || !password) {
			setError("Please enter your username and password.");
			return;
		}
		setLoading(true);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username,
					password
				})
			});
			if (!res.ok) {
				const body = await res.json().catch(() => null);
				throw new Error(body?.detail || body?.message || "Invalid credentials.");
			}
			window.dispatchEvent(new Event(AUTH_EVENT));
			navigate({ to: "/" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 grid-bg",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "relative z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-center px-6 py-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/",
						className: "flex items-center gap-2 font-display text-xl font-bold tracking-tight",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-[--primary] to-[--accent] text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" })
							}),
							"Open Source",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient",
								children: "Autosecure"
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "relative flex items-start justify-center px-6 pb-20 pt-6 sm:pt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-2xl border border-border bg-card/60 p-8 shadow-[var(--shadow-glow)] backdrop-blur",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute inset-0 -z-10",
								style: { background: "var(--gradient-radial)" },
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "font-display text-3xl font-bold tracking-tight sm:text-4xl",
									children: ["Welcome ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gradient",
										children: "Back"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: "Sign in to your account to continue"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSubmit,
								className: "mt-8 space-y-5",
								noValidate: true,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "username",
											className: "block text-sm font-medium text-foreground",
											children: "Username"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "username",
											type: "username",
											autoComplete: "username",
											required: true,
											maxLength: 255,
											value: username,
											onChange: (e) => setUsername(e.target.value),
											placeholder: "Example",
											className: "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "password",
											className: "block text-sm font-medium text-foreground",
											children: "Password"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												id: "password",
												type: showPw ? "text" : "password",
												autoComplete: "current-password",
												required: true,
												minLength: 1,
												maxLength: 128,
												value: password,
												onChange: (e) => setPassword(e.target.value),
												placeholder: "••••••••",
												className: "w-full rounded-xl border border-border bg-background/60 px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setShowPw((v) => !v),
												className: "absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground transition hover:text-foreground",
												"aria-label": showPw ? "Hide password" : "Show password",
												children: showPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
											})]
										})]
									}),
									error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground",
										children: error
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: loading,
										className: "group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[--primary] to-[--accent] px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60",
										children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, { className: "h-4 w-4 animate-spin" }), "Signing in…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Sign in", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition group-hover:translate-x-0.5" })] })
									})
								]
							})
						]
					})
				})
			})
		]
	});
}
//#endregion
export { LoginPage as component };

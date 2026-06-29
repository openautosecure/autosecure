import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BiuSICiJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var AUTH_EVENT = "autosec:auth";
var STORAGE_KEY = "autosecure-token";
function getAuthToken() {
	try {
		return localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
}
/** Fire-and-forget logout: clears HttpOnly cookie server-side. */
function clearAuthToken() {
	localStorage.removeItem(STORAGE_KEY);
	fetch("/api/auth/logout", {
		method: "POST",
		credentials: "include"
	}).catch(() => {});
	window.dispatchEvent(new Event(AUTH_EVENT));
}
/**
* Auth state — checks session by pinging /api/me (cookie sent automatically).
* null = still loading, true = authenticated, false = not authenticated.
*/
function useAuth() {
	const [isAuthenticated, setIsAuthenticated] = (0, import_react.useState)(null);
	const check = () => {
		fetch("/api/me", { credentials: "include" }).then((r) => setIsAuthenticated(r.ok)).catch(() => setIsAuthenticated(false));
	};
	(0, import_react.useEffect)(() => {
		check();
		window.addEventListener(AUTH_EVENT, check);
		return () => window.removeEventListener(AUTH_EVENT, check);
	}, []);
	return { isAuthenticated };
}
//#endregion
export { useAuth as i, clearAuthToken as n, getAuthToken as r, AUTH_EVENT as t };

// src/auth.js
export function isAuthenticated() {
	return Boolean(localStorage.getItem("@membrosflix:token"));
}

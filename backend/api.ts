const host = typeof window === "undefined"
	? "localhost"
	: window.location.hostname;

export const API_URL = `http://${host}:3001`;

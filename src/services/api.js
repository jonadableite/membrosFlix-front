// src/services/api.js
import axios from "axios";

// Cria uma instância do axios com a URL base
export const api = axios.create({
	baseURL: "http://localhost:3001", // Certifique-se de que a URL base está correta
});

// Função para configurar o token nos headers
export const setAuthorizationToken = (token) => {
	if (token) {
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		// biome-ignore lint/performance/noDelete: <explanation>
		delete api.defaults.headers.common["Authorization"];
	}
};

// Ao iniciar, configure o token se ele estiver no localStorage
const token = localStorage.getItem("@membrosflix:token");
if (token) {
	setAuthorizationToken(token);
}

export default api;

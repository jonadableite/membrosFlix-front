import axios from "axios";

// Criação da instância do Axios com a URL base da API
export const api = axios.create({
	baseURL: "http://localhost:3001", // Certifique-se de que a URL base está correta
});

// Função para configurar o token de autorização
export const setAuthorizationToken = (token) => {
	if (token) {
		// Define o token no cabeçalho de autorização
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		// Remove o cabeçalho de autorização se o token não estiver presente
		delete api.defaults.headers.common["Authorization"];
	}
};

// Configuração inicial do token ao carregar o módulo
const token = localStorage.getItem("@membrosflix:token");
setAuthorizationToken(token);

// Exporta a instância configurada do Axios
export default api;

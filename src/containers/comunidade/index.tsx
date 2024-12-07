import React from "react";

export function Comunidade() {
	React.useEffect(() => {
		window.location.href = "https://membreflix-comunidade.circle.so/feed";
	}, []);

	return null; // Ou um componente de carregamento enquanto redireciona
}

export default Comunidade;

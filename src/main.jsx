// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importa os estilos do Toastify
import "./styles/globalSyles.css";
import { AnimatedRoutes } from "./utils/AnimatedRoutes";

createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<AnimatedRoutes />
			<ToastContainer
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
		</BrowserRouter>
	</React.StrictMode>,
);

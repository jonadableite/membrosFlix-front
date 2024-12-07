// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export function ProtectedRoute({ children }) {
	if (!isAuthenticated()) {
		// Se não estiver autenticado, redireciona para a página de login
		return <Navigate to="/login" />;
	}
	return children;
}

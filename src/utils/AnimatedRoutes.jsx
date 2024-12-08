import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "../Layout";
import LessonPage from "../containers/Aulas";
import Comunidade from "../containers/comunidade";
import Contact from "../containers/contact";
import Home from "../containers/home";
import Login from "../containers/login";
import ManagerDashboard from "../containers/manager"; // Importe o componente do painel administrativo
import { ProtectedRoute } from "../routes/ProtectedRoute";

export function AnimatedRoutes() {
	const location = useLocation();

	return (
		<Routes location={location}>
			<Route path="/" element={<Layout />}>
				<Route
					path="home"
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>
				<Route
					path="comunidade"
					element={
						<ProtectedRoute>
							<Comunidade />
						</ProtectedRoute>
					}
				/>
				<Route
					path="contact"
					element={
						<ProtectedRoute>
							<Contact />
						</ProtectedRoute>
					}
				/>
				<Route
					path="cursos/:courseId/aulas/:lessonId"
					element={
						<ProtectedRoute>
							<LessonPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="manager"
					element={
						<ProtectedRoute>
							<ManagerDashboard />
						</ProtectedRoute>
					}
				/>
			</Route>
			<Route path="/login" element={<Login />} />
		</Routes>
	);
}

export default AnimatedRoutes;

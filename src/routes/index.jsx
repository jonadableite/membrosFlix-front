// src/routes/index.jsx
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../Layout";
import LessonPage from "../containers/Aulas";
import { Home } from "../containers/home";
import { Login } from "../containers/login";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "home",
				element: (
					<ProtectedRoute>
						<Home />
					</ProtectedRoute>
				),
			},
			{
				path: "cursos/:courseId/aulas/:lessonId",
				element: (
					<ProtectedRoute>
						<LessonPage />
					</ProtectedRoute>
				),
			},

			// Adicione outras rotas protegidas aqui
		],
	},
]);

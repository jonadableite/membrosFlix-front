// src/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./containers/footer";
import { Navbar } from "./containers/navBar";

export function Layout() {
	const location = useLocation();

	// Variável mais clara: showNavbar
	const showNavbar = location.pathname !== "/login";
	const showFooter = location.pathname !== "/login"; // Mesma lógica para o Footer

	return (
		<>
			{showNavbar && <Navbar />}
			<Outlet />
			{showFooter && <Footer />}
		</>
	);
}

export default Layout;

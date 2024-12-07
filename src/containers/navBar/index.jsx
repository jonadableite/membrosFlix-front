import React, { useEffect, useState } from "react";
import IconContact from "../../assets/contact.png";
import IconCentral from "../../assets/icon-central.svg";
import IconCommunity from "../../assets/icon-header-community.svg";
import IconHome from "../../assets/icon-header.svg";
import IconInvista from "../../assets/icon-invista.svg";
import IconLogout from "../../assets/icon-logout.svg";
import IconNotification from "../../assets/icon-not.svg";
import IconPerfil from "../../assets/icon-perfil.svg";
import IconProgress from "../../assets/icon-progresso.svg";
import LogoImage from "../../assets/logo.png";

export function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const [activeLink, setActiveLink] = useState("inicio");
	const [notificationCount, setNotificationCount] = useState(3);
	const [userDropdownOpen, setUserDropdownOpen] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		const userData = localStorage.getItem("@membrosflix:user");
		const storedToken = localStorage.getItem("@membrosflix:token");

		if (userData && storedToken) {
			try {
				const parsedUser = JSON.parse(userData);
				setUser(parsedUser);
			} catch (error) {
				console.error("Erro ao parsear dados do usuário:", error);
				localStorage.removeItem("@membrosflix:user");
				localStorage.removeItem("@membrosflix:token");
			}
		}

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const toggleNotifications = () => {
		setShowNotifications(!showNotifications);
	};

	const handleLogout = () => {
		localStorage.removeItem("@membrosflix:token");
		localStorage.removeItem("@membrosflix:user");
		window.location.href = "/login";
	};

	const handleNavigation = (link) => {
		setActiveLink(link);

		switch (link) {
			case "inicio":
				window.location.href = "/home";
				break;
			case "comunidade":
				window.location.href = "/comunidade";
				break;
			case "contato":
				window.location.href = "/contact";
				break;
			default:
				break;
		}
	};

	const toggleUserDropdown = () => {
		setUserDropdownOpen(!userDropdownOpen);
	};

	return (
		<nav
			className={`fixed top-0 left-0 w-full flex justify-between items-center p-5 z-50 transition-all duration-300 ${
				isScrolled
					? "bg-secondary bg-opacity-90 backdrop-blur-md"
					: "bg-transparent"
			}`}
		>
			<img src={LogoImage} alt="Logo" className="h-10" />
			<div className="flex items-center gap-6">
				<button
					type="button"
					className={`flex items-center gap-2 cursor-pointer ${
						activeLink === "inicio" ? "text-purple-500" : "text-white"
					} bg-transparent border-none`}
					onClick={() => handleNavigation("inicio")}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							handleNavigation("inicio");
						}
					}}
				>
					<img src={IconHome} alt="Início" className="w-5 h-5" />
					Início
				</button>
				<button
					type="button"
					className={`flex items-center gap-2 cursor-pointer ${
						activeLink === "comunidade" ? "text-purple-500" : "text-white"
					} bg-transparent border-none`}
					onClick={() => handleNavigation("comunidade")}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							handleNavigation("comunidade");
						}
					}}
				>
					<img src={IconCommunity} alt="Comunidade" className="w-5 h-5" />
					Comunidade
				</button>
				<button
					type="button"
					className={`flex items-center gap-2 cursor-pointer ${
						activeLink === "contato" ? "text-purple-500" : "text-white"
					} bg-transparent border-none`}
					onClick={() => handleNavigation("contato")}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							handleNavigation("contato");
						}
					}}
				>
					<img src={IconContact} alt="Contato" className="w-5 h-5" />
					Contato
				</button>
			</div>
			<div className="flex items-center gap-4">
				<div className="relative">
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<img
						src={IconNotification}
						alt="Notificações"
						className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
						onClick={toggleNotifications}
					/>
					{notificationCount > 0 && (
						<span className="absolute top-0 right-0 bg-purple-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
							{notificationCount}
						</span>
					)}
					{showNotifications && (
						<div className="absolute top-10 right-0 w-80 bg-secondary bg-opacity-90 rounded-lg shadow-lg p-4 z-50">
							<div className="flex justify-between items-center border-b border-purple-500 pb-2">
								<h3 className="text-white">Notificações</h3>
								<span className="text-purple-500 cursor-pointer">
									Marcar tudo como lido
								</span>
							</div>
							<div className="mt-2 max-h-60 overflow-y-auto">
								<div className="bg-base p-3 rounded-lg mb-2">
									<h4 className="text-purple-500">
										Bem-vindo a MembreFlix Club
									</h4>
									<p className="text-white text-sm">
										{user
											? `Caro, ${user.name}. É com imenso prazer que lhe damos as boas-vindas ao Movimento Midas.`
											: "Bem-vindo ao Movimento Midas."}
									</p>
									<small className="text-neutral-400">Equipe Midas</small>
								</div>
							</div>
							<div className="flex justify-center mt-2">
								<button
									type="button"
									className="bg-purple-500 text-white rounded-md px-4 py-2 hover:bg-purple-600 transition"
								>
									Ver todas
								</button>
							</div>
						</div>
					)}
				</div>
				{user && (
					<button
						type="button"
						className="relative flex items-center gap-2 cursor-pointer bg-transparent border-none"
						onClick={toggleUserDropdown}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								toggleUserDropdown();
							}
						}}
					>
						<span className="text-white max-w-xs truncate">{user.name}</span>
						<div
							className={`w-0 h-0 border-l-4 border-r-4 ${
								userDropdownOpen
									? "border-t-0 border-b-4 border-white"
									: "border-t-4 border-b-0 border-white"
							} transition-transform`}
						/>
						{userDropdownOpen && (
							<div className="text-white absolute top-10 right-0 bg-base bg-opacity-90 rounded-lg shadow-lg p-4 z-50 w-56">
								<div className="flex items-center gap-2 p-2 hover:bg-purple-500 hover:bg-opacity-20 rounded-md cursor-pointer">
									<img src={IconProgress} alt="Progresso" className="w-5 h-5" />
									Meu progresso
								</div>
								<div className="flex items-center gap-2 p-2 hover:bg-purple-500 hover:bg-opacity-20 rounded-md cursor-pointer">
									<img src={IconPerfil} alt="Perfil" className="w-5 h-5" />
									Meu perfil
								</div>
								<div className="flex items-center gap-2 p-2 hover:bg-purple-500 hover:bg-opacity-20 rounded-md cursor-pointer">
									<img
										src={IconCentral}
										alt="Central de Ajuda"
										className="w-5 h-5"
									/>
									Central de ajuda
								</div>
								<div className="flex items-center gap-2 p-2 hover:bg-purple-500 hover:bg-opacity-20 rounded-md cursor-pointer">
									<img src={IconInvista} alt="Indicar" className="w-5 h-5" />
									Indicar
								</div>
								<div className="border-t border-neutral-700 my-2" />
								<button
									type="button"
									className="flex items-center gap-2 p-2 text-red-500 hover:bg-purple-500 hover:bg-opacity-20 rounded-md w-full text-left"
									onClick={handleLogout}
								>
									<img src={IconLogout} alt="Logout" className="w-5 h-5" />
									Sair
								</button>
							</div>
						)}
					</button>
				)}
			</div>
		</nav>
	);
}

export default Navbar;

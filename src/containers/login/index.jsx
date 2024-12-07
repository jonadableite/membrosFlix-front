import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import backgroundImage from "../../assets/backgraund-login.jpg";
import IconeEmail from "../../assets/login.png";
import IconeSenha from "../../assets/padlock.png";
import Avatar from "../../assets/profile.png";
import { Button } from "../../components/Button";
import { api, setAuthorizationToken } from "../../services/api";
import { isAuthenticated } from "../../utils/auth";

// Definição do esquema de validação com Yup
const schema = yup
	.object({
		email: yup
			.string()
			.email("Digite um email válido")
			.required("Email é obrigatório"),
		password: yup.string().required("Senha é obrigatória"),
		remember: yup.boolean(),
	})
	.required();

export function Login() {
	const navigate = useNavigate();

	// Redireciona para a página inicial se o usuário já estiver autenticado
	useEffect(() => {
		if (isAuthenticated()) {
			navigate("/home");
		}
	}, [navigate]);

	// Configuração do formulário com react-hook-form e yup
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	// Função chamada ao submeter o formulário
	const onSubmit = async (data) => {
		try {
			const response = await api.post("/sessions", {
				email: data.email,
				password: data.password,
			});

			// Sucesso no login
			toast.success("Seja bem-vindo(a)! 🎉");

			// Armazenar token e dados do usuário
			localStorage.setItem("@membrosflix:token", response.data.token);
			localStorage.setItem(
				"@membrosflix:user",
				JSON.stringify(response.data.user),
			);

			// Definir o token nos headers padrão da API
			setAuthorizationToken(response.data.token);

			// Navegar para a página home
			navigate("/home");
		} catch (error) {
			// Lida com diferentes tipos de erros
			if (error.response) {
				console.error(
					"Erro do servidor:",
					error.response.status,
					error.response.data.message,
				);
				toast.error(error.response.data.message || "Erro ao fazer login 🤯");
			} else if (error.request) {
				console.error("Erro na requisição:", error.request);
				toast.error("Erro ao conectar com o servidor.");
			} else {
				console.error("Erro ao configurar a requisição:", error.message);
				toast.error("Erro ao processar a requisição.");
			}
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center relative">
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{
					backgroundImage: `url(${backgroundImage})`,
					filter: "blur(8px)",
					zIndex: -1,
				}}
			></div>
			<div className="bg-neutral-900 bg-opacity-50 p-8 rounded-lg shadow-lg w-full max-w-md relative backdrop-blur-md">
				<div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
					<img
						src={Avatar}
						alt="Avatar"
						className="w-32 h-32 rounded-full border-4 border-violet-500 shadow-md"
					/>
				</div>
				<h1 className="text-5xl font-extrabold text-center mb-6 mt-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-500 to-blue-600 animate-gradient">
					MembrosFlix
				</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="relative">
						<input
							type="email"
							id="email"
							placeholder=" "
							{...register("email")}
							className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 peer bg-white bg-opacity-20 backdrop-blur-md text-white"
							style={{
								backgroundImage: `url(${IconeEmail})`,
								backgroundRepeat: "no-repeat",
								backgroundPosition: "right 10px center",
								backgroundSize: "20px",
							}}
						/>
						<label
							htmlFor="email"
							className="absolute left-3 top-2 text-neutral-500 transition-all transform -translate-y-1/2 pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-purple-500"
						>
							Email
						</label>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1">
								{errors.email.message}
							</p>
						)}
					</div>

					<div className="relative">
						<input
							type="password"
							id="password"
							placeholder=" "
							{...register("password")}
							className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 peer bg-white bg-opacity-20 backdrop-blur-md text-white"
							style={{
								backgroundImage: `url(${IconeSenha})`,
								backgroundRepeat: "no-repeat",
								backgroundPosition: "right 10px center",
								backgroundSize: "20px",
							}}
						/>
						<label
							htmlFor="password"
							className="absolute left-3 top-2 text-neutral-500 transition-all transform -translate-y-1/2 pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-purple-500"
						>
							Senha
						</label>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">
								{errors.password.message}
							</p>
						)}
					</div>

					<div className="flex items-center">
						<input
							type="checkbox"
							id="remember"
							{...register("remember")}
							className="mr-2"
						/>
						<label htmlFor="remember" className="text-white text-sm">
							Lembrar credenciais
						</label>
					</div>

					<Button
						type="submit"
						className="w-full py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
					>
						Entrar
					</Button>
				</form>
				<a
					href="#"
					className="text-sm text-purple-500 hover:underline mt-4 block text-center"
				>
					Esqueceu a senha?
				</a>
			</div>
		</div>
	);
}

export default Login;

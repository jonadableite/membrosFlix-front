// src/containers/manager/index.jsx
import React, { useEffect, useState } from "react";
import {
	FaBook,
	FaChartPie,
	FaCog,
	FaComment,
	FaHeart,
	FaRoute,
	FaUsers,
	FaVideo,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { api } from "../../services/api";

// Componente de Estatística Detalhada
const DetailedStatCard = ({ icon: Icon, title, value, color }) => (
	<div
		className="bg-secondary rounded-2xl p-6 shadow-lg overflow-hidden relative
        transform transition-transform duration-300 hover:scale-105 hover:shadow-xl
        animate-fade-in opacity-0 animate-delay-[200ms] animate-fill-mode-forwards"
	>
		<div className="flex justify-between items-center mb-4">
			<div className="flex items-center">
				<Icon className={`text-3xl mr-4 ${color}`} />
				<div>
					<h3 className="text-xl font-bold text-white">{value}</h3>
					<p className="text-neutral-400 text-sm">{title}</p>
				</div>
			</div>
		</div>
		<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
	</div>
);

// Componente de Ação Avançado
const AdvancedActionCard = ({
	icon: Icon,
	title,
	description,
	color,
	onClick,
}) => (
	<div
		onClick={onClick}
		className="bg-secondary rounded-2xl p-6 shadow-lg cursor-pointer group
        transform transition-all duration-300 hover:scale-105 hover:shadow-xl
        animate-fade-in opacity-0 animate-delay-[400ms] animate-fill-mode-forwards"
	>
		<div className="flex justify-between items-center mb-4">
			<Icon className={`text-3xl ${color}`} />
			<span className="text-neutral-400 group-hover:text-white transition-colors">
				Gerenciar
			</span>
		</div>
		<div>
			<h3 className="text-xl font-bold text-white mb-2">{title}</h3>
			<p className="text-neutral-400 text-sm">{description}</p>
		</div>
	</div>
);

const ManagerDashboard = () => {
	const [loading, setLoading] = useState(true);
	const [dashboardData, setDashboardData] = useState({
		userCount: 0,
		courseCount: 0,
		lessonCount: 0,
		totalLikes: 0,
		commentsCount: 0,
	});

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);

				// Buscar usuários
				const usersResponse = await api.get("/users");
				const userCount = usersResponse.data?.length || 0;

				// Buscar cursos
				const coursesResponse = await api.get("/cursos");
				const courses = coursesResponse.data || [];
				const courseCount = courses.length;

				// Função para buscar likes e comentários de uma aula
				const fetchLessonsLikesAndComments = async (lesson) => {
					try {
						const likesResponse = await api.get(
							`/cursos/${lesson.courseId}/aulas/${lesson.id}/likes`,
						);
						const commentsResponse = await api.get(
							`/cursos/${lesson.courseId}/aulas/${lesson.id}/comentarios`,
						);

						return {
							lessonId: lesson.id,
							likesCount: likesResponse.data?.length || 0,
							commentsCount: commentsResponse.data?.length || 0,
						};
					} catch (error) {
						console.error(
							`Erro ao buscar dados para aula ${lesson.id}:`,
							error,
						);
						return null;
					}
				};

				// Buscar todas as aulas
				const lessonsResponse = await api.get("/cursos/1/aulas");
				const lessons = lessonsResponse.data || [];

				// Processar likes e comentários
				const lessonData = await Promise.all(
					lessons.map(fetchLessonsLikesAndComments),
				);

				// Calcular totais
				const totalLikes = lessonData.reduce(
					(sum, lesson) => sum + (lesson?.likesCount || 0),
					0,
				);
				const commentsCount = lessonData.reduce(
					(sum, lesson) => sum + (lesson?.commentsCount || 0),
					0,
				);
				const lessonCount = lessons.length;

				// Atualizar estado
				setDashboardData({
					userCount,
					courseCount,
					lessonCount,
					totalLikes: totalLikes + commentsCount, // Somar likes de aulas e comentários
					commentsCount,
				});

				toast.success("Dados do painel carregados com sucesso!");
			} catch (error) {
				console.error("Erro ao buscar dados do dashboard:", error);
				toast.error("Erro ao carregar dados do painel");
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-base">
				<div className="text-white text-xl animate-pulse">
					Carregando dados...
				</div>
			</div>
		);
	}

	return (
		<div className="bg-base min-h-screen p-8 text-white pt-24 animate-fade-in-slow">
			<div className="container mx-auto">
				{/* Cabeçalho */}
				<header className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-4xl font-bold text-white mb-2">
							Painel Administrativo
						</h1>
						<p className="text-neutral-400">
							Gerencie sua plataforma de forma inteligente
						</p>
					</div>
				</header>

				{/* Seção de Estatísticas Principais */}
				<section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<DetailedStatCard
						icon={FaUsers}
						title="Total de Usuários"
						value={dashboardData.userCount}
						color="text-purple-500"
					/>
					<DetailedStatCard
						icon={FaBook}
						title="Cursos Ativos"
						value={dashboardData.courseCount}
						color="text-green-500"
					/>
					<DetailedStatCard
						icon={FaVideo}
						title="Aulas Publicadas"
						value={dashboardData.lessonCount}
						color="text-blue-500"
					/>
					<DetailedStatCard
						icon={FaHeart}
						title="Total de Likes"
						value={dashboardData.totalLikes}
						color="text-red-500"
					/>
				</section>

				{/* Seção de Ações Administrativas */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<AdvancedActionCard
						icon={FaBook}
						title="Gerenciar Cursos"
						description="Adicione, edite e organize cursos"
						color="text-blue-500"
						onClick={() => {
							/* Navegação para gerenciamento de cursos */
						}}
					/>
					<AdvancedActionCard
						icon={FaComment}
						title="Gerenciar Comentários"
						description={`Modere ${dashboardData.commentsCount} comentários`}
						color="text-green-500"
						onClick={() => {
							/* Navegação para gerenciamento de comentários */
						}}
					/>
					<AdvancedActionCard
						icon={FaChartPie}
						title="Relatórios Detalhados"
						description="Análises avançadas de desempenho"
						color="text-purple-500"
						onClick={() => {
							/* Navegação para relatórios */
						}}
					/>
					<AdvancedActionCard
						icon={FaUsers}
						title="Gerenciamento de Usuários"
						description="Controle de acesso e permissões"
						color="text-orange-500"
						onClick={() => {
							/* Navegação para gerenciamento de usuários */
						}}
					/>
					<AdvancedActionCard
						icon={FaRoute}
						title="Trilhas de Aprendizado"
						description="Crie percursos personalizados"
						color="text-cyan-500"
						onClick={() => {
							/* Navegação para trilhas */
						}}
					/>
					<AdvancedActionCard
						icon={FaCog}
						title="Configurações"
						description="Personalize sua plataforma"
						color="text-pink-500"
						onClick={() => {
							/* Navegação para configurações */
						}}
					/>
				</section>
			</div>
		</div>
	);
};

export default ManagerDashboard;

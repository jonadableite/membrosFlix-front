import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const getCurrentUserId = () => {
	const user = JSON.parse(localStorage.getItem("user"));
	return user ? user.id : null;
};

const LessonPage = () => {
	const { courseId, lessonId } = useParams();
	const navigate = useNavigate();
	const [lesson, setLesson] = useState(null);
	const [allLessons, setAllLessons] = useState([]);
	const [activeTab, setActiveTab] = useState("Aulas");
	const [notes, setNotes] = useState("");
	const [likes, setLikes] = useState(0);
	const [userLiked, setUserLiked] = useState(false);
	const [comments, setComments] = useState([]);

	useEffect(() => {
		const fetchLesson = async () => {
			try {
				const response = await api.get(`/cursos/${courseId}/aulas/${lessonId}`);
				setLesson(response.data);
				setLikes(response.data.likesCount || 0);
				setUserLiked(response.data.userLiked || false);
			} catch (error) {
				console.error("Erro ao buscar aula:", error);
			}
		};

		const fetchAllLessons = async () => {
			try {
				const response = await api.get(`/cursos/${courseId}/aulas`);
				setAllLessons(response.data);
			} catch (error) {
				console.error("Erro ao buscar todas as aulas:", error);
			}
		};

		const fetchComments = async () => {
			try {
				const response = await api.get(
					`/cursos/${courseId}/aulas/${lessonId}/comentarios`,
				);
				setComments(response.data);
			} catch (error) {
				console.error("Erro ao buscar comentários:", error);
			}
		};

		fetchLesson();
		fetchAllLessons();
		fetchComments();
	}, [courseId, lessonId]);

	const nextLessons = allLessons.filter(
		(l) => l.id > Number.parseInt(lessonId, 10),
	);

	const handleLessonClick = (courseId, lessonId) => {
		navigate(`/cursos/${courseId}/aulas/${lessonId}`);
	};

	const handleNextLesson = () => {
		if (nextLessons.length > 0) {
			handleLessonClick(courseId, nextLessons[0].id);
		}
	};

	const handleLikeClick = async () => {
		const userId = getCurrentUserId();
		if (!userId) {
			console.error("Usuário não autenticado");
			return;
		}

		try {
			if (userLiked) {
				await api.delete(`/likes/${lessonId}/aula`, { data: { userId } });
				setLikes(likes - 1);
			} else {
				await api.post(`/likes/${lessonId}/aula`, { userId });
				setLikes(likes + 1);
			}
			setUserLiked(!userLiked);
		} catch (error) {
			console.error("Erro ao atualizar like:", error);
		}
	};

	if (!lesson) {
		return <div className="text-white">Carregando...</div>;
	}

	return (
		<div className="bg-[#0e0e12] text-white font-sans min-h-[300vh] flex flex-col md:flex-row gap-5 px-[113px]">
			<div className="flex-3 flex flex-col gap-4 w-full md:w-[954px] mt-[90px] mr-[20px]">
				<video src={lesson.path} controls className="w-full rounded-lg">
					<track
						kind="captions"
						srcLang="pt"
						src="/path/to/captions.vtt"
						label="Português"
					/>
				</video>
				<div className="flex flex-row justify-between items-center gap-4">
					<div>
						<h1 className="text-2xl font-bold mb-2">{lesson.name}</h1>
						<p className="text-sm text-gray-300">{lesson.description}</p>
					</div>
					<div className="flex gap-3">
						<button
							type="button"
							onClick={handleNextLesson}
							className="bg-purple-600 text-white rounded-md px-4 py-2 hover:opacity-80"
						>
							Próxima Aula
						</button>
						<button
							type="button"
							onClick={handleLikeClick}
							className={`${
								userLiked ? "bg-purple-500" : "bg-gray-800"
							} text-white rounded-md px-4 py-2 hover:opacity-80`}
						>
							👍 {likes}
						</button>
					</div>
				</div>
				<div className="mt-6 mb-8 w-full min-h-[0.7px] bg-gradient-to-r from-purple-500 to-transparent"></div>
				<div className="flex items-center gap-2 mb-9">
					<h2 className="text-md font-bold">Espaço de Networking</h2>
					<span>| {comments.length} Comentários</span>
				</div>
				<div className="flex flex-col gap-4">
					{comments.map((comment, index) => (
						<div key={index} className="bg-gray-800 p-4 rounded-md">
							<p className="text-sm">{comment.text}</p>
						</div>
					))}
					<textarea
						placeholder="Adicione um comentário..."
						className="w-full h-24 bg-gray-900 text-white border border-purple-600 rounded-md p-2 resize-none"
					/>
				</div>
			</div>
			<div
				className="flex-1 bg-[#16161e] rounded-lg p-5 pt-8 h-[89vh] sticky top-[90px] overflow-hidden"
				style={{ width: "370px" }}
			>
				<div className="flex justify-around mb-4">
					{["Anotações", "Aulas", "Materiais"].map((tab) => (
						<button
							key={tab}
							type="button"
							onClick={() => setActiveTab(tab)}
							className={`${
								activeTab === tab ? "bg-purple-600" : "bg-gray-800"
							} text-white rounded-md px-4 py-2`}
						>
							{tab}
						</button>
					))}
				</div>
				<div className="p-4 h-full relative">
					{activeTab === "Anotações" && (
						<textarea
							placeholder="Digite suas anotações aqui..."
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							className="w-full h-24 bg-gray-900 text-white border border-purple-600 rounded-md p-2 resize-none"
						/>
					)}
					{activeTab === "Aulas" && (
						<div className="flex flex-col gap-4 overflow-y-auto h-full pb-20">
							{nextLessons.map((nextLesson) => (
								<div
									key={nextLesson.id}
									role="button"
									tabIndex={0}
									onClick={() => handleLessonClick(courseId, nextLesson.id)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											handleLessonClick(courseId, nextLesson.id);
										}
									}}
									className="flex items-center cursor-pointer p-2 rounded-md transition-all hover:underline"
								>
									<video
										src={nextLesson.path}
										poster={nextLesson.thumbnail}
										controls
										className="w-24 h-24 rounded-md"
									/>
									<div className="ml-4">
										<span className="text-sm font-bold">{nextLesson.name}</span>
										<p className="text-xs text-gray-400">
											{nextLesson.description}
										</p>
									</div>
								</div>
							))}
							<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#16161e] to-transparent"></div>
						</div>
					)}
					{activeTab === "Materiais" && (
						<ul className="list-none p-0 m-0 space-y-2">
							<li className="p-2 bg-gray-900 rounded-md">Material 1</li>
							<li className="p-2 bg-gray-900 rounded-md">Material 2</li>
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default LessonPage;

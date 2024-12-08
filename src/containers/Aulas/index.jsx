import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import emptyFilesIcon from "../../assets/empty-files.svg";
import sendIcon from "../../assets/icon-send-message.svg";
import likeActiveIcon from "../../assets/like-active.svg";
import likeIcon from "../../assets/like.svg";
import api, { setAuthorizationToken } from "../../services/api";

// Função para calcular o tempo decorrido
const timeAgo = (date) => {
	const now = new Date();
	const seconds = Math.floor((now - new Date(date)) / 1000);
	let interval = Math.floor(seconds / 31536000);

	if (interval >= 1) {
		return interval === 1 ? "há 1 ano" : `há ${interval} anos`;
	}
	interval = Math.floor(seconds / 2592000);
	if (interval >= 1) {
		return interval === 1 ? "há 1 mês" : `há ${interval} meses`;
	}
	interval = Math.floor(seconds / 604800);
	if (interval >= 1) {
		return interval === 1 ? "há 1 semana" : `há ${interval} semanas`;
	}
	interval = Math.floor(seconds / 86400);
	if (interval >= 1) {
		return interval === 1 ? "há 1 dia" : `há ${interval} dias`;
	}
	interval = Math.floor(seconds / 3600);
	if (interval >= 1) {
		return interval === 1 ? "há 1 hora" : `há ${interval} horas`;
	}
	interval = Math.floor(seconds / 60);
	if (interval >= 1) {
		return interval === 1 ? "há 1 minuto" : `há ${interval} minutos`;
	}
	return "agora mesmo";
};

const getCurrentUser = () => {
	try {
		const user = JSON.parse(localStorage.getItem("@membrosflix:user"));
		return user || null;
	} catch (error) {
		console.error("Erro ao recuperar o usuário:", error);
		return null;
	}
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
	const [newComment, setNewComment] = useState("");
	const [replyCommentId, setReplyCommentId] = useState(null);
	const [newReply, setNewReply] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [materials, setMaterials] = useState([]);
	const [editingCommentId, setEditingCommentId] = useState(null);
	const [editContent, setEditContent] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("@membrosflix:token");
		if (token) {
			setAuthorizationToken(token);
		} else {
			navigate("/login");
		}

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
				setComments(
					response.data.map((comment) => ({
						...comment,
						userLiked: comment.userLiked || false, // Inicializa com o valor retornado pela API
					})),
				);
			} catch (error) {
				console.error("Erro ao buscar comentários:", error);
			}
		};

		const fetchMaterials = async () => {
			try {
				const response = await api.get(
					`/cursos/${courseId}/aulas/${lessonId}/materiais`,
				);
				setMaterials(response.data);
			} catch (error) {
				console.error("Erro ao buscar materiais:", error);
			}
		};

		fetchLesson();
		fetchAllLessons();
		fetchComments();
		fetchMaterials();
	}, [courseId, lessonId, navigate]);

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
		const userId = getCurrentUser().id;
		if (!userId) {
			console.error("Usuário não autenticado");
			return;
		}

		try {
			if (userLiked) {
				// Remover like
				await api.delete(`/cursos/${courseId}/aulas/${lessonId}/likes`, {
					data: { userId },
				});
				setLikes((prevLikes) => prevLikes - 1);
			} else {
				// Adicionar like
				await api.post(`/cursos/${courseId}/aulas/${lessonId}/likes`, {
					userId,
				});
				setLikes((prevLikes) => prevLikes + 1);
			}
			setUserLiked(!userLiked);
		} catch (error) {
			console.error("Erro ao atualizar like:", error);
		}
	};

	const handleCommentLikeClick = async (commentId) => {
		const userId = getCurrentUser().id;
		if (!userId) {
			console.error("Usuário não autenticado");
			return;
		}

		try {
			const comment = comments.find((c) => c.id === commentId);
			if (comment.userLiked) {
				// Remover like
				await api.delete(
					`/cursos/${courseId}/aulas/${lessonId}/comentarios/${commentId}/likes`,
					{ data: { userId } },
				);
				setComments((prevComments) =>
					prevComments.map((c) =>
						c.id === commentId
							? { ...c, likesCount: c.likesCount - 1, userLiked: false }
							: c,
					),
				);
			} else {
				// Adicionar like
				await api.post(
					`/cursos/${courseId}/aulas/${lessonId}/comentarios/${commentId}/likes`,
					{ userId },
				);
				setComments((prevComments) =>
					prevComments.map((c) =>
						c.id === commentId
							? { ...c, likesCount: c.likesCount + 1, userLiked: true }
							: c,
					),
				);
			}
		} catch (error) {
			console.error("Erro ao atualizar like no comentário:", error);
		}
	};

	const handleReplyLikeClick = async (commentId, replyId) => {
		const userId = getCurrentUser().id;
		if (!userId) {
			console.error("Usuário não autenticado");
			return;
		}

		try {
			const comment = comments.find((c) => c.id === commentId);
			const reply = comment.replies.find((r) => r.id === replyId);
			if (reply.userLiked) {
				// Remover like
				await api.delete(
					`/cursos/${courseId}/aulas/${lessonId}/comentarios/${replyId}/likes`,
					{ data: { userId } },
				);
				setComments((prevComments) =>
					prevComments.map((c) =>
						c.id === commentId
							? {
									...c,
									replies: c.replies.map((r) =>
										r.id === replyId
											? { ...r, likesCount: r.likesCount - 1, userLiked: false }
											: r,
									),
								}
							: c,
					),
				);
			} else {
				// Adicionar like
				await api.post(
					`/cursos/${courseId}/aulas/${lessonId}/comentarios/${replyId}/likes`,
					{ userId },
				);
				setComments((prevComments) =>
					prevComments.map((c) =>
						c.id === commentId
							? {
									...c,
									replies: c.replies.map((r) =>
										r.id === replyId
											? { ...r, likesCount: r.likesCount + 1, userLiked: true }
											: r,
									),
								}
							: c,
					),
				);
			}
		} catch (error) {
			console.error("Erro ao atualizar like na resposta:", error);
		}
	};

	const handleCommentSubmit = async () => {
		if (!newComment.trim()) return;

		try {
			const user = getCurrentUser();
			const response = await api.post(
				`/cursos/${courseId}/aulas/${lessonId}/comentarios`,
				{
					userId: user.id,
					content: newComment,
					aulaId: Number(lessonId),
					cursoId: Number(courseId),
				},
			);
			setComments([
				...comments,
				{ ...response.data, userLiked: false, user: { name: user.name } },
			]);
			setNewComment("");
			setErrorMessage("");
		} catch (error) {
			console.error("Erro ao enviar comentário:", error);
			if (error.response) {
				setErrorMessage(
					error.response.data.error || "Erro ao enviar comentário.",
				);
			} else {
				setErrorMessage(
					"Erro ao enviar comentário. Por favor, tente novamente.",
				);
			}
		}
	};

	const handleReplySubmit = async (commentId) => {
		if (!newReply.trim()) return;

		try {
			const user = getCurrentUser();
			const response = await api.post(
				`/cursos/${courseId}/aulas/${lessonId}/comentarios`,
				{
					userId: user.id,
					content: newReply,
					aulaId: Number(lessonId),
					cursoId: Number(courseId),
					parentId: commentId,
				},
			);
			setComments((prevComments) =>
				prevComments.map((comment) =>
					comment.id === commentId
						? {
								...comment,
								replies: [
									...(comment.replies || []),
									{
										...response.data,
										user: {
											id: user.id,
											name: user.name,
										},
									},
								],
							}
						: comment,
				),
			);
			etNewReply("");
			setReplyCommentId(null);
		} catch (error) {
			console.error("Erro ao enviar resposta:", error);
			setErrorMessage(
				error.response?.data?.error ||
					"Erro ao enviar resposta. Por favor, tente novamente.",
			);
		}
	};

	const handleEditComment = (commentId, content) => {
		setEditingCommentId(commentId);
		setEditContent(content);
	};

	const handleCancelEdit = () => {
		setEditingCommentId(null);
		setEditContent("");
	};

	const handleSaveEdit = async (commentId) => {
		try {
			const response = await api.put(`/comments/${commentId}`, {
				content: editContent,
			});
			setComments((prevComments) =>
				prevComments.map((c) =>
					c.id === commentId ? { ...c, content: response.data.content } : c,
				),
			);
			setEditingCommentId(null);
			setEditContent("");
		} catch (error) {
			console.error("Erro ao atualizar comentário:", error);
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
					<div className="flex gap-2 min-w-fit max-lg:mt-4">
						<button
							type="button"
							onClick={handleLikeClick}
							className={`${
								userLiked ? "bg-secondary" : "bg-gray-800"
							} text-white rounded-md px-3 py-2 hover:opacity-80 flex items-center justify-center gap-2`}
						>
							<img
								src={userLiked ? likeActiveIcon : likeIcon}
								alt="Like"
								className="w-6 h-6"
							/>
							{likes}
						</button>
						<button
							type="button"
							onClick={handleNextLesson}
							className="bg-purple-600 text-white rounded-md px-3 py-2 hover:opacity-80 flex items-center justify-center gap-2"
						>
							PRÓXIMA AULA
						</button>
					</div>
				</div>
				<div className="mt-6 mb-8 w-full min-h-[0.7px] bg-gradient-to-r from-purple-500 to-transparent"></div>
				<div className="flex items-center gap-2 mb-9">
					<h2 className="text-md font-bold">Espaço de Networking</h2>
					<span>|{comments.length} Comentários</span>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex-1 relative">
						<div className="relative">
							<textarea
								id="newComment"
								name="newComment"
								placeholder="Digite seu novo post aqui..."
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								className="border focus:outline-none w-full max-md:min-h-[44px] md:min-h-[64px] h-[104px] p-4 max-md:pr-6 rounded-md border-[#24242E] bg-[#16161E]"
								rows="3"
							/>
						</div>
						<div className="flex w-full text-[#926BFF] max-md:absolute max-md:w-fit max-md:right-2 max-md:top-4 items-center justify-start mt-2">
							<button
								type="button"
								onClick={handleCommentSubmit}
								className="flex items-center cursor-pointer justify-between text-sm"
							>
								<span className="max-md:hidden">Enviar comentário</span>
								<img
									src={sendIcon}
									alt="Enviar"
									loading="lazy"
									decoding="async"
									className="w-4 h-4"
									style={{
										position: "relative",
										height: "auto",
										width: "auto",
										color: "transparent",
										marginLeft: "0px",
									}}
								/>
							</button>
						</div>
					</div>
					{comments.map((comment, index) => (
						<div key={index} className="bg-base p-4 rounded-md">
							<div className="flex gap-3 w-full items-start">
								<div className="rounded-full w-11 h-11 min-w-[2.75rem] overflow-hidden relative">
									<img
										alt=""
										loading="lazy"
										decoding="async"
										className="w-full h-full object-cover"
										src={`https://ui-avatars.com/api/?name=${comment.user?.name || "User"}&background=random&rounded=true&length=2&format=png&size=256`}
									/>
								</div>
								<div className="w-full">
									<div className="flex gap-2 items-center min-h-11">
										<span className="max-md:text-xs">
											{comment.user?.name || "Anônimo"}
										</span>
										<span className="text-sm text-[#5D5D74]">
											{timeAgo(comment.createdAt)}
										</span>
									</div>
									{editingCommentId === comment.id ? (
										<div>
											<textarea
												value={editContent}
												onChange={(e) => setEditContent(e.target.value)}
												className="border focus:outline-none w-full max-md:min-h-[44px] md:min-h-[64px] h-[64px] p-4 max-md:pr-6 rounded-md border-[#24242E] bg-[#16161E]"
												rows="2"
											/>
											<button
												onClick={() => handleSaveEdit(comment.id)}
												className="text-[#926BFF] mt-2"
											>
												Salvar
											</button>
											<button
												onClick={handleCancelEdit}
												className="text-[#926BFF] mt-2 ml-2"
											>
												Cancelar
											</button>
										</div>
									) : (
										<p className="mb-3 font-normal max-md:text-sm">
											{comment.content}
										</p>
									)}
									<div className="flex gap-6 flex-1">
										<button
											className="flex md:gap-2 max-md:gap-1 items-center"
											onClick={() => handleCommentLikeClick(comment.id)}
										>
											<img
												src={comment.userLiked ? likeActiveIcon : likeIcon}
												alt="Like"
												className="w-4 h-4"
											/>
											<span className="max-md:text-sm">
												{comment.likesCount || 0}
											</span>
										</button>
										<a
											className="cursor-pointer"
											onClick={() => setReplyCommentId(comment.id)}
										>
											Responder
										</a>
										{comment.userId === getCurrentUser().id && (
											<a
												className="cursor-pointer"
												onClick={() =>
													handleEditComment(comment.id, comment.content)
												}
											>
												Editar
											</a>
										)}
									</div>
									{/* Campo de resposta */}
									{replyCommentId === comment.id && (
										<div className="mt-4">
											<textarea
												placeholder="Digite sua resposta..."
												value={newReply}
												onChange={(e) => setNewReply(e.target.value)}
												className="border focus:outline-none w-full max-md:min-h-[44px] md:min-h-[64px] h-[64px] p-4 max-md:pr-6 rounded-md border-[#24242E] bg-[#16161E]"
												rows="2"
											/>
											<button
												type="button"
												onClick={() => handleReplySubmit(comment.id)}
												className="flex items-center cursor-pointer justify-between text-sm mt-2 text-[#926BFF]"
											>
												<span>Enviar resposta</span>
												<img
													src={sendIcon}
													alt="Enviar"
													loading="lazy"
													decoding="async"
													className="w-4 h-4"
													style={{
														position: "relative",
														height: "auto",
														width: "auto",
														color: "transparent",
														marginLeft: "0px",
													}}
												/>
											</button>
										</div>
									)}
									{/* Exibir respostas */}
									{comment.replies && comment.replies.length > 0 && (
										<div className="mt-4 pl-4 border-l border-gray-700">
											{comment.replies.map((reply, replyIndex) => (
												<div key={replyIndex} className="mb-2">
													<div className="flex gap-2 items-start">
														<div className="rounded-full w-8 h-8 min-w-[2rem] overflow-hidden relative">
															<img
																alt=""
																loading="lazy"
																decoding="async"
																className="w-full h-full object-cover"
																src={`https://ui-avatars.com/api/?name=${reply.user?.name || "User"}&background=random&rounded=true&length=2&format=png&size=256`}
															/>
														</div>
														<div>
															<div className="flex gap-2 items-center">
																<span className="max-md:text-xs">
																	{reply.user?.name || "Anônimo"}
																</span>
																<span className="text-sm text-[#5D5D74]">
																	{timeAgo(reply.createdAt)}
																</span>
															</div>
															<p className="font-normal max-md:text-sm">
																{reply.content}
															</p>
															<div className="flex gap-6 flex-1">
																<button
																	className="flex md:gap-2 max-md:gap-1 items-center"
																	onClick={() =>
																		handleReplyLikeClick(comment.id, reply.id)
																	}
																>
																	<img
																		src={
																			reply.userLiked
																				? likeActiveIcon
																				: likeIcon
																		}
																		alt="Like"
																		className="w-4 h-4"
																	/>
																	<span className="max-md:text-sm">
																		{reply.likesCount || 0}
																	</span>
																</button>
																<a
																	className="cursor-pointer"
																	onClick={() => setReplyCommentId(comment.id)}
																>
																	Responder
																</a>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					))}
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
							id="notes"
							name="notes"
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
							<div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-[#16161e] to-transparent"></div>
						</div>
					)}
					{activeTab === "Materiais" && (
						<div className="flex flex-col items-center pt-[36px]">
							{materials.length > 0 ? (
								<ul className="list-none p-0 m-0 space-y-2">
									{materials.map((material) => (
										<li
											key={material.id}
											className="p-2 bg-gray-900 rounded-md"
										>
											<a
												href={material.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-white hover:underline"
											>
												{material.title}
											</a>
										</li>
									))}
								</ul>
							) : (
								<>
									<img src={emptyFilesIcon} alt="Nenhum material" />
									<p className="font-bold text-white mt-4">Nenhum material</p>
									<p className="text-[14px] leading-[20px] text-[#6A6A86]">
										Os materiais estarão visíveis aqui.
									</p>
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default LessonPage;

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import blindagemImage from "../../assets/Blindagem.png";
import bonusImage from "../../assets/Bonus.png";
import IAImage from "../../assets/IA.png";
import bgImage from "../../assets/advertise-banner.png";
import H1Home from "../../assets/grupo-de-avisos.png";
import IconCarrousel from "../../assets/heart2.svg";
import IconVideo from "../../assets/icon-carrousel.svg";
import mktImage from "../../assets/mkt.png";
import playIcon from "../../assets/play.svg";
import setaDireita from "../../assets/setaDireita.svg";
import setaEsquerda from "../../assets/setaEsquerda.svg";
import trafegoImage from "../../assets/trafego.png";
import api from "../../services/api";

export function Home() {
	const navigate = useNavigate();
	const sliderRef = useRef(null);
	const lessonsSliderRef = useRef(null);
	const [lessons, setLessons] = useState([]);
	const [canScrollLeftSlider, setCanScrollLeftSlider] = useState(false);
	const [canScrollRightSlider, setCanScrollRightSlider] = useState(true);
	const [canScrollLeftLessons, setCanScrollLeftLessons] = useState(false);
	const [canScrollRightLessons, setCanScrollRightLessons] = useState(true);

	useEffect(() => {
		const fetchLessons = async () => {
			try {
				const response = await api.get("/cursos/1/aulas");
				setLessons(response.data);
			} catch (error) {
				console.error("Erro ao buscar aulas:", error);
			}
		};

		fetchLessons();
	}, []);

	const updateScrollButtons = useCallback((ref, setLeft, setRight) => {
		if (ref.current) {
			const { scrollLeft, scrollWidth, clientWidth } = ref.current;
			setLeft(scrollLeft > 0);
			setRight(scrollLeft < scrollWidth - clientWidth);
		}
	}, []);

	const scrollSlider = (direction, ref, setLeft, setRight) => {
		if (ref.current) {
			const scrollAmount = direction === "left" ? -400 : 400;
			ref.current.scrollBy({
				left: scrollAmount,
				behavior: "smooth",
			});
			setTimeout(() => updateScrollButtons(ref, setLeft, setRight), 300);
		}
	};

	const handleVideoClick = (courseId, lessonId) => {
		navigate(`/cursos/${courseId}/aulas/${lessonId}`);
	};

	const topCourses = [
		{ id: 1, title: "Curso 1", image: IAImage },
		{ id: 2, title: "Curso 2", image: mktImage },
		{ id: 3, title: "Curso 3", image: trafegoImage },
		{ id: 4, title: "Curso 4", image: blindagemImage },
		{ id: 5, title: "Curso 5", image: bonusImage },
	];

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		updateScrollButtons(
			sliderRef,
			setCanScrollLeftSlider,
			setCanScrollRightSlider,
		);
		updateScrollButtons(
			lessonsSliderRef,
			setCanScrollLeftLessons,
			setCanScrollRightLessons,
		);
	}, [lessons, updateScrollButtons]);

	return (
		<div className="bg-[#0e0e12] flex flex-col min-h-screen">
			<div
				className="relative bg-cover bg-center h-[100vh]"
				style={{ backgroundImage: `url(${bgImage})` }}
			>
				<div className="bg-gradient-to-t from-[#0e0e12] via-transparent to-transparent absolute bottom-0 h-full w-full z-10" />
				<div
					className="flex flex-col items-start max-w-5xl mx-auto relative z-20"
					style={{ marginLeft: "73px", marginTop: "167px" }}
				>
					<img
						src={H1Home}
						alt="Grupo de avisos no WhatsApp"
						className="h-16 mb-4"
					/>
					<div className="gap-x-2 flex text-xs mt-8 mb-4">
						{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
						<button
							className="text-xs text-white bg-gray-700 bg-opacity-70 rounded px-4 py-2 cursor-pointer hover:bg-opacity-90 hover:bg-gray-600"
							onClick={() => console.log("Grupo")}
						>
							Grupo
						</button>
						{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
						<button
							className="text-xs text-white bg-gray-700 bg-opacity-70 rounded px-4 py-2 cursor-pointer hover:bg-opacity-90 hover:bg-gray-600"
							onClick={() => console.log("Whatsapp")}
						>
							Whatsapp
						</button>
						{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
						<button
							className="text-xs text-white bg-gray-700 bg-opacity-70 rounded px-4 py-2 cursor-pointer hover:bg-opacity-90 hover:bg-gray-600"
							onClick={() => console.log("Avisos")}
						>
							Avisos
						</button>
					</div>
					<p className="mt-4 text-white max-w-xl line-clamp-2 font-normal text-base">
						Entre no nosso novo grupo de aviso e comece a receber notificação de
						novas aulas e novos cursos.
					</p>
					<button
						type="button"
						className="mt-4 text-base font-semibold text-white bg-primary rounded px-6 py-3 hover:opacity-80"
					>
						Entrar no Grupo
					</button>
				</div>
			</div>

			<div className="pl-20 pt-5 text-white flex items-center mt-[-150px] relative z-30">
				<img src={IconCarrousel} alt="Ícone Carrossel" className="mr-4" />
				<h2 className="ml-4 text-2xl font-medium leading-8 max-md:text-lg">
					Top 6 cursos no Brasil
				</h2>
			</div>

			<div className="relative flex items-center px-20 mt-2 overflow-hidden z-30 h-[300px]">
				<button
					type="button"
					className={`absolute left-5 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 flex items-center justify-center ${
						canScrollLeftSlider ? "bg-white hover:bg-opacity-70" : "bg-gray-500"
					}`}
					onClick={() =>
						scrollSlider(
							"left",
							sliderRef,
							setCanScrollLeftSlider,
							setCanScrollRightSlider,
						)
					}
					disabled={!canScrollLeftSlider}
				>
					<img src={setaEsquerda} alt="Voltar" />
				</button>

				<div
					ref={sliderRef}
					className="flex gap-6 scroll-smooth w-full mx-auto overflow-hidden"
					onScroll={() =>
						updateScrollButtons(
							sliderRef,
							setCanScrollLeftSlider,
							setCanScrollRightSlider,
						)
					}
				>
					{topCourses.map((course, index) => (
						<div key={course.id} className="flex items-center gap-0">
							<div className="flex items-center justify-center w-40 h-52">
								<div
									className="text-[271.765px] leading-[0.9] font-bold bg-[linear-gradient(24deg,_#16161E_41.1%,_#2D2D39_88%)] bg-clip-text tracking-[-10px]"
									style={{ WebkitTextFillColor: "transparent" }}
								>
									{index + 1}
								</div>
							</div>
							<div className="flex-none w-40 h-52 bg-base rounded-lg relative overflow-hidden">
								<img
									src={course.image}
									alt={course.title}
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
					))}
				</div>

				<button
					type="button"
					className={`absolute right-5 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 flex items-center justify-center ${
						canScrollRightSlider
							? "bg-white hover:bg-opacity-70"
							: "bg-gray-500"
					}`}
					onClick={() =>
						scrollSlider(
							"right",
							sliderRef,
							setCanScrollLeftSlider,
							setCanScrollRightSlider,
						)
					}
					disabled={!canScrollRightSlider}
				>
					<img src={setaDireita} alt="Avançar" />
				</button>
			</div>

			<div className="mt-16 pl-20 pt-5 text-white flex items-center">
				<img src={IconVideo} alt="Ícone Carrossel" className="mr-4" />
				<h2>Trilha Gestão de tráfego</h2>
			</div>

			<div className="relative flex items-center px-20 mt-2 overflow-hidden mb-20 h-[300px]">
				<button
					type="button"
					className={`absolute left-5 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 flex items-center justify-center ${
						canScrollLeftLessons
							? "bg-white hover:bg-opacity-70"
							: "bg-gray-500"
					}`}
					onClick={() =>
						scrollSlider(
							"left",
							lessonsSliderRef,
							setCanScrollLeftLessons,
							setCanScrollRightLessons,
						)
					}
					disabled={!canScrollLeftLessons}
				>
					<img src={setaEsquerda} alt="Voltar" />
				</button>

				<div
					ref={lessonsSliderRef}
					className="flex gap-6 scroll-smooth w-full mx-auto overflow-hidden"
					onScroll={() =>
						updateScrollButtons(
							lessonsSliderRef,
							setCanScrollLeftLessons,
							setCanScrollRightLessons,
						)
					}
				>
					{lessons.map((lesson) => (
						<div key={lesson.id} className="flex flex-col items-center gap-2">
							<div
								// biome-ignore lint/a11y/useSemanticElements: <explanation>
								role="button"
								tabIndex={0}
								className="flex-none w-72 h-40 bg-base rounded-lg relative overflow-hidden cursor-pointer"
								onClick={() => handleVideoClick(lesson.courseId, lesson.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										handleVideoClick(lesson.courseId, lesson.id);
									}
								}}
								onMouseEnter={(e) => {
									e.currentTarget.querySelector("video").play();
									e.currentTarget.querySelector("img").style.opacity = 1;
								}}
								onMouseLeave={(e) => {
									e.currentTarget.querySelector("video").pause();
									e.currentTarget.querySelector("img").style.opacity = 0;
								}}
							>
								<video
									src={lesson.path}
									className="w-full h-full object-cover"
									muted
								/>
								<img
									src={playIcon}
									alt="Play"
									className="absolute inset-0 w-12 h-12 m-auto opacity-0 transition-opacity duration-300 pointer-events-none"
								/>
							</div>
							<div className="text-center text-white">
								<div className="font-medium text-lg">{lesson.name}</div>
							</div>
						</div>
					))}
				</div>

				<button
					type="button"
					className={`absolute right-5 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 flex items-center justify-center ${
						canScrollRightLessons
							? "bg-white hover:bg-opacity-70"
							: "bg-gray-500"
					}`}
					onClick={() =>
						scrollSlider(
							"right",
							lessonsSliderRef,
							setCanScrollLeftLessons,
							setCanScrollRightLessons,
						)
					}
					disabled={!canScrollRightLessons}
				>
					<img src={setaDireita} alt="Avançar" />
				</button>
			</div>
		</div>
	);
}

export default Home;

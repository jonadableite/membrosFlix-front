import React, { useEffect, useState } from "react";
import IconCard from "../../assets/icon-card.png";
import IconCommunity from "../../assets/icon-community.svg";
import IconSuport from "../../assets/icon-message.svg";
import IconPix from "../../assets/icon-pix.svg";
import IconSecurity from "../../assets/icon-security.svg";
import IconInstagram from "../../assets/instagram.svg";
import IconLinkedIn from "../../assets/linkedin-fill.svg";
import Logo from "../../assets/logo.png";
import IconRedes from "../../assets/redes.svg";
import IconYouTube from "../../assets/youtube.svg";

const Footer = () => {
	const [text, setText] = useState("");
	const fullText = " Jonadab Leite";
	const typingSpeed = 150; // Velocidade de digitação em ms

	useEffect(() => {
		let index = 0;
		let isDeleting = false;

		const type = () => {
			setText(fullText.substring(0, index));

			if (!isDeleting && index < fullText.length) {
				index++;
			} else if (isDeleting && index > 0) {
				index--;
			} else {
				isDeleting = !isDeleting;
			}

			setTimeout(type, typingSpeed);
		};

		type();
	}, []);

	return (
		<footer className="flex flex-col items-center p-10 pt-28 bg-secondary text-white">
			{/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
			<div className="w-full h-0.5 bg-gradient-to-r from-neutral-900 via-purple-500 to-neutral-900 mb-3"></div>
			<div className="flex justify-around w-full mb-10 mt-7">
				<div className="flex flex-col items-start max-w-xs">
					<img src={IconCommunity} alt="Comunidades" className="w-6 h-6 mb-2" />
					<h4 className="text-lg mb-2 text-purple-500">Comunidades</h4>
					<div className="mb-2">
						<a
							href="/canais-por-assuntos"
							className="flex items-center text-sm hover:text-purple-500"
						>
							Canais por assuntos
						</a>
					</div>
				</div>

				<div className="flex flex-col items-start max-w-xs">
					<img src={IconSuport} alt="Suporte" className="w-6 h-6 mb-2" />
					<h4 className="text-lg mb-2 text-purple-500">Suporte</h4>
					<div className="mb-2">
						<a
							href="/fale-conosco"
							className="flex items-center text-sm hover:text-purple-500"
						>
							Fale conosco
						</a>
					</div>
				</div>

				<div className="flex flex-col items-start max-w-xs">
					<img src={IconRedes} alt="Redes sociais" className="w-6 h-6 mb-2" />
					<h4 className="text-lg mb-2 text-purple-500">Redes sociais</h4>
					<div className="mb-2">
						<a
							href="https://instagram.com"
							className="flex items-center text-sm hover:text-purple-500"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src={IconInstagram}
								alt="Instagram"
								className="w-4 h-4 mr-2"
							/>
							Instagram
						</a>
					</div>
					<div className="mb-2">
						<a
							href="https://youtube.com"
							className="flex items-center text-sm hover:text-purple-500"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img src={IconYouTube} alt="YouTube" className="w-4 h-4 mr-2" />
							YouTube
						</a>
					</div>
					<div className="mb-2">
						<a
							href="https://linkedin.com"
							className="flex items-center text-sm hover:text-purple-500"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img src={IconLinkedIn} alt="LinkedIn" className="w-4 h-4 mr-2" />
							LinkedIn
						</a>
					</div>
				</div>

				<div className="flex flex-col items-start max-w-xs">
					<img
						src={IconCommunity}
						alt="Transparência"
						className="w-6 h-6 mb-2"
					/>
					<h4 className="text-lg mb-2 text-purple-500">Transparência</h4>
					<div className="mb-2">
						<a
							href="/termos-de-uso"
							className="flex items-center text-sm hover:text-purple-500"
						>
							Termos de uso
						</a>
					</div>
					<div className="mb-2">
						<a
							href="/politica-de-privacidade"
							className="flex items-center text-sm hover:text-purple-500"
						>
							Política de privacidade
						</a>
					</div>
				</div>
			</div>

			<div className="flex justify-between items-center w-full mt-10">
				<div className="max-w-3xl">
					<img src={Logo} alt="Logotipo" className="w-16 mb-2" />
					<p className="text-sm leading-relaxed">
						Um ambiente desenhado para impulsionar o sucesso de quem busca uma
						experiência única de aprendizado. Muito mais que um curso, é uma
						plataforma revolucionária que une educação, conexão e
						entretenimento, trazendo o melhor dos três mundos para suas mãos.
						Conecte-se com uma comunidade vibrante, tenha acesso a materiais de
						ponta e participe de desafios inspiradores.
					</p>
				</div>
				<div className="flex flex-col items-center">
					<div className="flex gap-6 mb-4 mt-10">
						<img src={IconCard} alt="Cartão" className="w-16 h-14" />
						<img src={IconPix} alt="Pix" className="w-16 h-14" />
						<img src={IconSecurity} alt="Segurança" className="w-32 h-14" />
					</div>
					<div className="text-center text-xs text-purple-500">
						<span>2024 © Todos os direitos reservados MembreFlix.</span> <br />
						<span className="inline-block overflow-hidden border-r-2 border-purple-500 whitespace-nowrap animate-typing">
							Dev:{text}
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				base: ["Helvetica", "sans-serif"], // Define a fonte base
			},
			colors: {
				primary: "#936bff", // Cor primária
				secondary: "#111114", // Cor secundária
				base: "#0e0e12", // Cor base
			},
			keyframes: {
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"fade-in-slow": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
			},
			animation: {
				"fade-in": "fade-in 0.5s ease-out forwards",
				"fade-in-slow": "fade-in-slow 1s ease-out forwards",
				"fade-in-delay-200": "fade-in 0.5s ease-out 0.2s forwards",
				"delay-[200ms]": "fade-in 0.5s ease-out 0.2s forwards",
			},
			animationDelay: {
				200: "200ms",
				400: "400ms",
			},
			animationFillMode: {
				forwards: "forwards",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};

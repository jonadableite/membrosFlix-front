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
		},
	},
	plugins: [],
};

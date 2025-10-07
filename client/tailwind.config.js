/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#33006F",
        "primary-content": "#b16fff",
        "primary-dark": "#1c003c",
        "primary-light": "#4a00a2",

        "secondary": "#5bffb5",
        "secondary-content": "#005b32",
        "secondary-dark": "#28ff9e",
        "secondary-light": "#8effcc",

        "background": "#efeff0",
        "foreground": "#fbfbfb",
        "border": "#dedee0",

        "copy": "#252527",
        "copy-light": "#646369",
        "copy-lighter": "#8a898f",

        "success": "#5bff5b",
        "warning": "#ffff5b",
        "error": "#ff5b5b",

        "success-content": "#005b00",
        "warning-content": "#5b5b00",
        "error-content": "#5b0000",
        "d-red": "#a30227",
        "lg-pink": "#ffadbe",
        "d-blue": "#001B79",
        "l-purple": "#492E87",
        "l-blue": "#1640D6",
        "d-pink": "#ED5AB3",
        "l-pink": "#FF90C2",
        "l-gray": "#E2E8F0",
        "l-slate": "#A0AEC0",
        "p-blue": "#AEC6CF",
        "silver": "#c0c0c0",
        "cobalt": "#0047AB",
        "yt-red": "#FF0000",
        "main-purp": "#33006F",
      },
    },
  },
  plugins: [],
};

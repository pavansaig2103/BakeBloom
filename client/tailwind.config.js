export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8ED",
        blush: "#F7B7C9",
        cocoa: "#4B2E25",
        ganache: "#2C1712",
        butter: "#FFE4A8",
        berry: "#B84A62"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(75, 46, 37, 0.12)"
      }
    }
  },
  plugins: []
};

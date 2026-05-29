import axios from "axios";

const localApiUrl =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5108/api"
    : "/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || localApiUrl
});

export default api;

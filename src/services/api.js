import axios from "axios";

const api = axios.create({
  url: "https://api.github.com/",
});

export default api;

import axios from "axios";

export const getVideoInfo = (url) => {
  return axios.post("/api/info", { url });
};

export const downloadVideo = (url) => {
  const formData = new FormData();
  formData.append("url", url);
  return axios.post("/api/download", formData);
};

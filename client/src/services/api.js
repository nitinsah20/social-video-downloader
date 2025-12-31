import axios from "axios";

export const getVideoInfo = (url) => {
  return axios.post("http://127.0.0.1:8000/info", { url });
};

export const downloadVideo = (url) => {
  const formData = new FormData();
  formData.append("url", url);
  return axios.post("http://127.0.0.1:8000/download", formData);
};

const API_BASE_URL = "https://social-video-api-xyz.onrender.com"; 

export const getVideoInfo = (url) => {
  return axios.post(`${API_BASE_URL}/info`, { url }); 
};

export const downloadVideo = (videoData) => {
  return axios.post(`${API_BASE_URL}/download`, videoData);
};

export const getDownloadProgress = (videoId) => {
  return axios.get(`${API_BASE_URL}/progress/${videoId}`);
};
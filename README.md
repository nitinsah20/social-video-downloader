# 🎥 Social Video Downloader (Demo)

A modern **React + FastAPI** based social video downloader web app.  
This project is deployed as a **demo on Vercel** to showcase UI, flow, and API integration.

⚠️ **Important:**  
This Vercel deployment is for **demo/testing only**.  
Actual video downloading (MP4 / MP3) requires a VPS with FFmpeg support.

---

## ✨ Features

- 🌐 Download videos from:
  - YouTube
  - Instagram
  - Facebook
  - Twitter (X)
- 📸 Thumbnail preview & download
- 📊 Real-time download progress UI
- ⚡ Fast & modern UI (React + Tailwind CSS)
- 🔌 FastAPI backend
- ☁️ Vercel deployment (Frontend + API)

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Lucide Icons

### Backend
- FastAPI
- yt-dlp
- FFmpeg (required for real downloads)
- Mangum (for Vercel serverless)

---

## 📁 Project Structure

project-root/
│
├── client/ # React frontend
│ ├── src/
│ ├── package.json
│ └── vite.config.js
│
├── api/ # FastAPI backend
│ ├── index.py
│ ├── requirements.txt
│ └── downloads/
│
└── vercel.json



---

## 🚀 Live Demo (Vercel)

> ⚠️ Demo Only  
   https://social-video-downloader-two.vercel.app/
> Video info & thumbnails work  
> MP4 / MP3 download may fail due to Vercel limitations

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|--------|--------|-------------|
| `/api/info` | POST | Fetch video info |
| `/api/download` | POST | Start download |
| `/api/progress/{id}` | GET | Download progress |
| `/api/file/{name}` | GET | Download file |
| `/api/thumbnail` | GET | Download thumbnail |

---

## ⚠️ Vercel Limitation (Very Important)

Vercel serverless **does NOT support**:
- FFmpeg processing
- Long background tasks
- Large video downloads

So:
- ✅ UI works
- ✅ API responds
- ❌ MP4 / MP3 downloads may fail

---

## ✅ Recommended Production Setup

For **100% working video downloads**:

- Frontend → **Vercel**
- Backend → **VPS (FastAPI + Nginx)**
- FFmpeg installed on server

Supported VPS:
- DigitalOcean
- Hostinger VPS
- AWS EC2

---

## 🛠️ Local Setup Instructions

### 1. Environment Variables

Create a file named .env in the root directory and add the following configuration:
\`\`\`env
MY_PROXY=your_proxy_url
YT_COOKIE_FILE=youtube_cookies.txt
\`\`\`

### 2. Cookies Setup

To download age-restricted or private videos, you need to provide session cookies:

1. Export your YouTube cookies from your browser in Netscape (.txt) format.

2. Save the file as `youtube_cookies.txt` in the project root directory.

3. Note: Ensure this file name matches the value set in your .env file.


### 3. Frontend
```bash
cd client
npm install
npm run dev
```
### 4. Backend (Python)
Navigate to the api folder and start the server:
```bash
cd api
pip install -r requirements.txt
# Since main.py is inside the api folder:
uvicorn main:app --reload --port 8000



## ⚠️ Disclaimer
> This project is for educational purposes only.
Downloading copyrighted content without permission may violate the terms of service of respective platforms.
The author is not responsible for misuse.

## Project Images
<img width="1742" height="868" alt="image" src="https://github.com/user-attachments/assets/d8119408-946e-4685-96d2-5c64a750035a" />
<img width="942" height="906" alt="image" src="https://github.com/user-attachments/assets/d0d778ea-ec2e-41c1-bd37-443a73032873" />
<img width="786" height="818" alt="image" src="https://github.com/user-attachments/assets/96e5c0dd-a73c-48a7-a4f3-7b35a36460df" />


👨‍💻 Author

nitinsah20
Made with ❤️ for learning & demo purposes

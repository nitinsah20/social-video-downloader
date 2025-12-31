from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import yt_dlp
import os
import re
import threading
import time

# -- Paths --
BASE_DIR = os.path.dirname(__file__)
DOWNLOAD_DIR = os.path.join(BASE_DIR, "downloads")
COOKIES_FILE = os.path.join(BASE_DIR, "youtube_cookies.txt") 

os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# FFmpeg Path 
FFMPEG_PATH = r"C:\Users\ATAL WEB SOLUTION\Downloads\ffmpeg-2025-12-22-git-c50e5c7778-essentials_build\ffmpeg-2025-12-22-git-c50e5c7778-essentials_build\bin\ffmpeg.exe"

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# -Utils -
def safe_filename(title: str) -> str:
    
    title = re.sub(r'[^\w\s-]', '', title)
    return re.sub(r'\s+', ' ', title).strip()

def auto_delete(path: str, delay: int = 1800): 
    def delete_file():
        time.sleep(delay)
        if os.path.exists(path):
            try:
                os.remove(path)
                print(f"File auto-deleted after 30 mins: {path}")
            except Exception as e:
                print(f"Error in auto-delete: {e}")
    threading.Thread(target=delete_file, daemon=True).start()

def get_ydl_opts(is_download=False, file_type="mp4"):
    opts = {
        
        "cookiefile": COOKIES_FILE if os.path.exists(COOKIES_FILE) else None,
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "quiet": True,
        "nocheckcertificate": True,
        "no_warnings": True,
    }
    if is_download:
        if file_type == "mp3":
            opts.update({
                "format": "bestaudio/best",
                "outtmpl": os.path.join(DOWNLOAD_DIR, "%(id)s.%(ext)s"),
                "ffmpeg_location": FFMPEG_PATH,
                "postprocessors": [{
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }],
            })
        else:
            opts.update({
                "format": "bestvideo[vcodec^=avc1]+bestaudio[ext=m4a]/best[ext=mp4]/best",
                "outtmpl": os.path.join(DOWNLOAD_DIR, "%(id)s.%(ext)s"),
                "ffmpeg_location": FFMPEG_PATH,
                "merge_output_format": "mp4",
                "writethumbnail": False,
            })
    return opts

# - API -
@app.post("/info")
def post_info(data: dict):
    url = data.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL missing")
    try:
        with yt_dlp.YoutubeDL(get_ydl_opts()) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                "title": info.get("title", "Video"), 
                "thumbnail": info.get("thumbnail"), 
                "video_id": info.get("id"),
                "url": url
            }
    except Exception as e:
        raise HTTPException(status_code=429, detail=str(e))

@app.post("/download")
def download_video(data: dict):
    url = data.get("url")
    file_type = data.get("format", "mp4")
    try:
        with yt_dlp.YoutubeDL(get_ydl_opts(True, file_type)) as ydl:
            info = ydl.extract_info(url, download=True)
            video_id = info["id"]
            title_safe = safe_filename(info.get("title", "video"))
            
        ext = "mp3" if file_type == "mp3" else "mp4"
        final_name = f"{title_safe}.{ext}"
        
      
        old_path = os.path.join(DOWNLOAD_DIR, f"{video_id}.{ext}")
        new_path = os.path.join(DOWNLOAD_DIR, final_name)

        if os.path.exists(old_path):
            if os.path.exists(new_path): os.remove(new_path)
            os.rename(old_path, new_path)
        
        
        auto_delete(new_path, 1800) 
        
        return {"status": "success", "filename": final_name}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/file/{name}")
def get_file(name: str):
    path = os.path.join(DOWNLOAD_DIR, name)
    if os.path.exists(path):
       
        return FileResponse(
            path=path, 
            filename=name, 
            media_type="video/mp4" if name.endswith(".mp4") else "audio/mpeg"
        )
    raise HTTPException(status_code=404, detail="File not found")
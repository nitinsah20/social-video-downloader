from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.responses import Response
import yt_dlp
import os
import re
import asyncio
import time
import requests

app = FastAPI()

@app.get("/thumbnail")
def get_thumbnail(url: str):
    try:
        r = requests.get(url)
        r.raise_for_status()  # agar fail ho jaye to exception
        return Response(content=r.content, media_type="image/webp")
    except requests.RequestException as e:
        return Response(content=f"Error fetching image: {str(e)}", status_code=500)
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
DOWNLOAD_DIR = os.path.join(os.path.dirname(__file__), "downloads")
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# APNA FFMPEG PATH YAHAN CHECK KARLENA
FFMPEG_PATH = r"C:\Users\ATAL WEB SOLUTION\Downloads\ffmpeg-2025-12-22-git-c50e5c7778-essentials_build\ffmpeg-2025-12-22-git-c50e5c7778-essentials_build\bin\ffmpeg.exe"

progress_db = {}

def clean_ansi(text):
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    return ansi_escape.sub('', text)

async def auto_delete_file(file_path, delay=600): # 10 minutes baad delete
    await asyncio.sleep(delay)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Cleanup: Deleted {file_path}")
    except Exception as e:
        print(f"Cleanup Error: {e}")

def my_hook(d):
    v_id = d.get('info_dict', {}).get('id', 'temp')
    if d['status'] == 'downloading':
        try:
            p_raw = d.get('_percent_str', '0%')
            p_clean = clean_ansi(p_raw).replace('%', '').strip()
            progress_db[v_id] = float(p_clean)
        except:
            pass
    elif d['status'] == 'finished':
        progress_db[v_id] = 95 # Download done, merging start

def download_task(url, file_type, video_id, background_tasks: BackgroundTasks):
    try:
        progress_db[video_id] = 1
        
        ydl_opts = {
            'ffmpeg_location': FFMPEG_PATH,
            'outtmpl': os.path.join(DOWNLOAD_DIR, f"{video_id}.%(ext)s"),
            'progress_hooks': [my_hook],
            'quiet': True,
            'no_warnings': True,
            'nocolor': True,
        }

        if file_type == "mp3":
            ydl_opts.update({
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
            })
        else:
            ydl_opts.update({
                'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
                'merge_output_format': 'mp4',
            })

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            title = info.get('title', 'video')
            # Hindi aur special characters handle karne ke liye
            safe_title = re.sub(r'[^\w\s-]', '', title).strip()
            if not safe_title: safe_title = "downloaded_file"

        ext = "mp3" if file_type == "mp3" else "mp4"
        old_file = os.path.join(DOWNLOAD_DIR, f"{video_id}.{ext}")
        new_filename = f"{safe_title}_{int(time.time())}.{ext}" 
        new_file = os.path.join(DOWNLOAD_DIR, new_filename)

        if os.path.exists(old_file):
            if os.path.exists(new_file): os.remove(new_file)
            os.rename(old_file, new_file)
            
            # Progress update and Auto-delete schedule
            progress_db[f"{video_id}_file"] = new_filename
            progress_db[video_id] = 100
            background_tasks.add_task(auto_delete_file, new_file)
            print(f"--- READY: {new_filename} ---")
        else:
            print("Error: File not found after download")
            progress_db[video_id] = -1

    except Exception as e:
        print(f"Task Error: {str(e)}")
        progress_db[video_id] = -1

@app.post("/info")
async def get_info(data: dict):
    url = data.get("url")
    if not url: raise HTTPException(status_code=400, detail="URL missing")
    try:
        with yt_dlp.YoutubeDL({'quiet': True, 'no_warnings': True}) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                "title": info.get("title"),
                "thumbnail": info.get("thumbnail"),
                "video_id": info.get("id"),
                "url": url
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/download")
async def start_download(data: dict, background_tasks: BackgroundTasks):
    v_id = data.get("video_id")
    url = data.get("url")
    fmt = data.get("format", "mp4")
    
    if not v_id or not url:
        raise HTTPException(status_code=400, detail="Missing data")
        
    progress_db[v_id] = 0
    background_tasks.add_task(download_task, url, fmt, v_id, background_tasks)
    return {"status": "started", "video_id": v_id}

@app.get("/progress/{video_id}")
async def get_progress(video_id: str):
    return {
        "progress": progress_db.get(video_id, 0),
        "filename": progress_db.get(f"{video_id}_file")
    }

@app.get("/file/{name}")
async def serve_file(name: str):
    path = os.path.join(DOWNLOAD_DIR, name)
    if os.path.exists(path):
        return FileResponse(path, filename=name)
    return {"error": "File already deleted or not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
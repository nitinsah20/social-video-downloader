from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
import yt_dlp
import os, re, asyncio, time, requests
from mangum import Mangum

app = FastAPI()

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PATHS
BASE_DIR = os.path.dirname(__file__)
DOWNLOAD_DIR = os.path.join(BASE_DIR, "downloads")
os.makedirs(DOWNLOAD_DIR, exist_ok=True)
COOKIE_FILE = os.path.join(BASE_DIR, "youtube_cookies.txt")

progress_db = {}

# Common Options to prevent Bot Detection
COMMON_YDL_OPTS = {
    "quiet": True,
    "no_warnings": True,
    "nocolor": True,
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "referer": "https://www.youtube.com/",
}

def clean_ansi(text):
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    return ansi_escape.sub('', text)

async def auto_delete_file(file_path, delay=600):
    await asyncio.sleep(delay)
    if os.path.exists(file_path):
        os.remove(file_path)

def my_hook(d):
    video_id = d.get("info_dict", {}).get("id")
    if not video_id:
        return

    if d["status"] == "downloading":
        try:
            percent = clean_ansi(d.get("_percent_str", "0")).replace("%", "")
            progress_db[video_id] = float(percent)
        except:
            pass
    elif d["status"] == "finished":
        progress_db[video_id] = 95

def download_task(url, file_type, video_id, background_tasks: BackgroundTasks):
    try:
        progress_db[video_id] = 1

        ydl_opts = COMMON_YDL_OPTS.copy()
        ydl_opts.update({
            "outtmpl": os.path.join(DOWNLOAD_DIR, f"{video_id}.%(ext)s"),
            "progress_hooks": [my_hook],
        })

        if os.path.exists(COOKIE_FILE):
            ydl_opts["cookiefile"] = COOKIE_FILE

        if file_type == "mp3":
            ydl_opts.update({
                "format": "bestaudio/best",
                "postprocessors": [{
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }]
            })
        else:
            ydl_opts.update({
                "format": "bestvideo+bestaudio/best",
                "merge_output_format": "mp4"
            })

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            title = info.get("title", "video")
            safe_title = re.sub(r"[^\w\s-]", "", title).strip()

        ext = "mp3" if file_type == "mp3" else "mp4"
        old_file = os.path.join(DOWNLOAD_DIR, f"{video_id}.{ext}")
        new_name = f"{safe_title}_{int(time.time())}.{ext}"
        new_file = os.path.join(DOWNLOAD_DIR, new_name)

        if os.path.exists(old_file):
            os.rename(old_file, new_file)
            progress_db[f"{video_id}_file"] = new_name
            progress_db[video_id] = 100
            background_tasks.add_task(auto_delete_file, new_file)
        else:
            progress_db[video_id] = -1

    except Exception as e:
        print("DOWNLOAD ERROR:", e)
        progress_db[video_id] = -1

@app.post("/info")
async def get_info(data: dict):
    url = data.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL missing")

    try:
        opts = COMMON_YDL_OPTS.copy()
        if os.path.exists(COOKIE_FILE):
            opts["cookiefile"] = COOKIE_FILE

        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=False)

        return {
            "title": info.get("title"),
            "thumbnail": info.get("thumbnail"),
            "video_id": info.get("id"),
            "url": url
        }
    except Exception as e:
        print(f"INFO ERROR: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/download")
async def start_download(data: dict, background_tasks: BackgroundTasks):
    video_id = data.get("video_id")
    url = data.get("url")
    fmt = data.get("format", "mp4")

    if not video_id or not url:
        raise HTTPException(status_code=400, detail="Missing data")

    progress_db[video_id] = 0
    background_tasks.add_task(download_task, url, fmt, video_id, background_tasks)
    return {"status": "started", "video_id": video_id}

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
    return {"error": "File not found"}

@app.get("/thumbnail")
def get_thumbnail(url: str):
    try:
        r = requests.get(url)
        r.raise_for_status()
        return Response(content=r.content, media_type="image/webp")
    except:
        raise HTTPException(status_code=500, detail="Thumbnail fetch failed")

handler = Mangum(app)
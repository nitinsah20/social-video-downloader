from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import os, re, time
from mangum import Mangum

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(__file__)
DOWNLOAD_DIR = os.path.join(BASE_DIR, "downloads")
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

@app.post("/download")
async def download_video(data: dict):
    url = data.get("url")
    fmt = data.get("format", "mp4")

    if not url:
        raise HTTPException(status_code=400, detail="URL missing")

    video_id = str(int(time.time()))

    ydl_opts = {
        "outtmpl": os.path.join(DOWNLOAD_DIR, f"{video_id}.%(ext)s"),
        "quiet": True,
        "no_warnings": True,
    }

    if fmt == "mp3":
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

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)

        filename = ydl.prepare_filename(info)
        safe_name = re.sub(r"[^\w\s.-]", "", os.path.basename(filename))

        return {
            "status": "done",
            "filename": safe_name
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


handler = Mangum(app)

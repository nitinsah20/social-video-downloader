from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import os, requests
from fastapi.responses import Response
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
COOKIE_FILE = os.path.join(BASE_DIR, "youtube_cookies.txt")

@app.post("/api/info")
async def get_info(data: dict):
    url = data.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL missing")

    try:
        opts = {"quiet": True, "no_warnings": True}
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
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/thumbnail")
def get_thumbnail(url: str):
    try:
        r = requests.get(url)
        return Response(content=r.content, media_type="image/webp")
    except:
        raise HTTPException(status_code=500, detail="Thumbnail fetch failed")


handler = Mangum(app)

const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/info", async (req, res) => {
  const { url } = req.body;
  if (!ytdl.validateURL(url)) return res.status(400).json({ error: "Invalid URL" });

  try {
    const info = await ytdl.getInfo(url);
    const formats = info.formats.filter(f => f.hasVideo && f.hasAudio).map(f => ({
      itag: f.itag,
      quality: f.qualityLabel,
      container: f.container
    }));

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      formats
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch info" });
  }
});

app.get("/download", async (req, res) => {
  const { url, itag } = req.query;
  try {
    res.header("Content-Disposition", `attachment; filename="video.mp4"`);
    ytdl(url, { format: ytdl.chooseFormat(await ytdl.getInfo(url).then(i => i.formats), { quality: itag }) }).pipe(res);
  } catch (err) {
    res.status(500).send("Download failed");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));

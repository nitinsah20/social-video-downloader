import React from "react";
import DownloaderBox from "../components/DownloaderBox";

export default function Youtube() {
  return (
    <div>
      <DownloaderBox 
        title="YouTube Video"
        placeholder="Paste link here (e.g. https://youtube.com/...)"
      />
    </div>
  );
}

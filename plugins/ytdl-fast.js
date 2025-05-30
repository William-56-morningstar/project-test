const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

// MP4 video download

cmd({ 
    pattern: "mp4", 
    alias: ["video"], 
    react: "🎥", 
    desc: "Download YouTube video", 
    category: "main", 
    use: '.mp4 < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("Please provide a YouTube URL or video name.");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("Failed to fetch the video. Please try again later.");
        }

        let ytmsg = `📹 *Video Downloader*
🎬 *Title:* ${yts.title}
⏳ *Duration:* ${yts.timestamp}
👀 *Views:* ${yts.views}
👤 *Author:* ${yts.author.name}
🔗 *Link:* ${yts.url}
> Powered By JawadTechX ❤️`;

        // Send video directly with caption
        await conn.sendMessage(
            from, 
            { 
                video: { url: data.result.download_url }, 
                caption: ytmsg,
                mimetype: "video/mp4"
            }, 
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});

// MP3 song download 

const { getConfig, setConfig } = require('../lib/configdb');

cmd({
  pattern: "song",
  alias: ["play", "mp3"],
  react: "🎶",
  desc: "Download YouTube song",
  category: "main",
  use: '.song <query>',
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("🎵 Please provide a song name or YouTube link.");

    const cacheKey = `song:${q.toLowerCase()}`;
    const cachedUrl = getConfig(cacheKey);

    let downloadUrl, title;

    if (cachedUrl) {
      // Use cached download link
      downloadUrl = cachedUrl;
      title = q;
    } else {
      const yt = await ytsearch(q);
      if (!yt.results.length) return reply("❌ No results found!");

      const song = yt.results[0];
      const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data?.result?.downloadUrl) return reply("⛔ Download failed.");

      downloadUrl = data.result.downloadUrl;
      title = song.title;

      // Save to config (cache)
      setConfig(cacheKey, downloadUrl);
    }

    await conn.sendMessage(from, {
      audio: { url: downloadUrl },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply("🚫 An error occurred.");
  }
});
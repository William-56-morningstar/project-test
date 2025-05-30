const { cmd } = require("../command");
const fetch = require("node-fetch");
const config = require('../config');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');
const { getConfig, setConfig } = require('../lib/configdb');

cmd({
  pattern: 'gitclone',
  alias: ["git"],
  desc: "Download GitHub repository as a zip file.",
  react: '📦',
  category: "downloader",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  args,
  reply
}) => {
  if (!args[0]) {
    return reply("❌ Where is the GitHub link?\n\nExample:\n.gitclone https://github.com/username/repository");
  }

  if (!/^(https:\/\/)?github\.com\/.+/.test(args[0])) {
    return reply("⚠️ Invalid GitHub link. Please provide a valid GitHub repository URL.");
  }

  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i;
    const match = args[0].match(regex);

    if (!match) {
      throw new Error("Invalid GitHub URL.");
    }

    const [, username, repo] = match;
    const zipUrl = `https://api.github.com/repos/${username}/${repo}/zipball`;

    // Check if repository exists
    const response = await fetch(zipUrl, { method: "HEAD" });
    if (!response.ok) {
      throw new Error("Repository not found.");
    }

    const contentDisposition = response.headers.get("content-disposition");
    const fileName = contentDisposition ? contentDisposition.match(/filename=(.*)/)[1] : `${repo}.zip`;
    
    // Send the zip file to the user with custom contextInfo
    await conn.sendMessage(from, {
      document: { url: zipUrl },
      fileName: fileName,
      mimetype: 'application/zip',
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ Failed to download the repository. Please try again later.");
  }
});


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

    const yt = await ytsearch(q);
    if (!yt.results.length) return reply("❌ No results found!");

    const song = yt.results[0];
    const cacheKey = `song:${song.title.toLowerCase()}`;
    const cachedData = getConfig(cacheKey);
    let downloadUrl = null;

    if (!cachedData) {
      const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data?.result?.downloadUrl) return reply("⛔ Failed to download the song.");
      downloadUrl = data.result.downloadUrl;

      setConfig(cacheKey, JSON.stringify({
        url: downloadUrl,
        title: song.title,
        thumb: song.thumbnail,
        artist: song.author.name,
        duration: song.timestamp,
        views: song.views,
        yt: song.url
      }));
    } else {
      const parsed = JSON.parse(cachedData);
      downloadUrl = parsed.url;
    }

    const caption = `*✦ BEN_BOT-V1 DOWNLOADER ✦*\n\n
╭───────────────◆
│⿻ *Title:* ${song.title}
│⿻ *Quality:* MP3 / 128kbps
│⿻ *Duration:* ${song.timestamp}
│⿻ *Views:* ${song.views}
│⿻ *Uploaded:* ${song.ago}
│⿻ *Artist:* ${song.author.name}
╰────────────────◆
⦿ *YouTube Link:* ${song.url}

Reply with:
*1* - Audio 🎧
*2* - Document 📄

╭───────────────◆
│ Powered by BEN-BOT
╰────────────────◆`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: song.thumbnail },
      caption
    }, { quoted: mek });

    const messageID = sentMsg.key.id;

    const handler = async (msgData) => {
      try {
        const msg = msgData.messages[0];
        if (!msg?.message || !msg.key?.remoteJid) return;

        const quotedId = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
        if (quotedId !== messageID) return;

        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        const songCache = getConfig(cacheKey);
        if (!songCache) return reply("⚠️ Song cache not found.");

        const songData = JSON.parse(songCache);

        const audioMsg = {
          audio: { url: songData.url },
          mimetype: "audio/mpeg",
          fileName: `${songData.title}.mp3`
        };

        if (text === "1") {
          await conn.sendMessage(from, audioMsg, { quoted: msg });

        } else if (text === "2") {
          await conn.sendMessage(from, {
            document: { url: songData.url },
            mimetype: "audio/mpeg",
            fileName: `${songData.title}.mp3`
          }, { quoted: msg });

        } else {
          await conn.sendMessage(from, {
            text: "❌ Invalid option. Please reply with *1* or *2*."
          }, { quoted: msg });
        }

        conn.ev.off("messages.upsert", handler);
      } catch (err) {
        console.error("Reply Handler Error:", err);
      }
    };

    conn.ev.on("messages.upsert", handler);
    setTimeout(() => conn.ev.off("messages.upsert", handler), 10 * 60 * 1000); // 10 minutes timeout

  } catch (err) {
    console.error(err);
    reply("🚫 An unexpected error occurred.");
  }
});
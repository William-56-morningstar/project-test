const axios = require("axios");
const fs = require("fs");
const os = require("os");
const { runtime } = require('../lib/functions');
const path = require("path");
const FormData = require("form-data");
const { cmd } = require("../command");

cmd({
  pattern: "alive",
  alias: ["alive2", "zindaa", "heee"],
  react: "⏳",
  desc: "Upload media to cdn.apis-nothing.xyz and get stream/download links",
  category: "system",
  filename: __filename
}, async (client, message, args, { reply }) => {
  try {
    const quoted = message.quoted || message;
    const mime = quoted?.mimetype;
    const start = new Date().getTime();
    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;
    const uptime = runtime(process.uptime());
    const startTime = new Date(Date.now() - process.uptime() * 1000);
        
    const status = `
*BEN BOT IS RUNNING!!*
*BOT UPTIME INFO:*
*╭═════════════════⊷*
*┃❍ ${uptime}*
*╰═════════════════⊷*
      `;

    await client.sendMessage(message.chat, {
      image: { url: "https://files.catbox.moe/6vrc2s.jpg" },
      caption: status,
    }, { quoted: message });

  } catch (err) {
    console.error("Upload Error:", err);
    await reply(`❌ Error: ${err.message || err}`);
  }
});
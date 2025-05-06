const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const FormData = require("form-data");
const { cmd } = require("../command");

function formatRemainingTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let days = Math.floor(totalSeconds / (3600 * 24));
  let hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  return `*┃❍ ${days} Day(s)*\n*┃❍ ${hours} Hour(s)*\n*┃❍ ${minutes} Minute(s)*\n*┃❍ ${seconds} Second(s)*`;
}

cmd({
  pattern: "alive",
  alias: ["alive2", "zindaa", "heee"],
  react: "⏳",
  desc: "Show bot alive status and uptime",
  category: "system",
  filename: __filename
}, async (client, message, args, { reply }) => {
  try {
    const start = Date.now();
    const uptimeMs = process.uptime() * 1000;
    const uptimeFormatted = formatRemainingTime(uptimeMs);

    const status = `
*BEN BOT IS RUNNING!!*
*BOT UPTIME INFO:*
*╭═════════════════⊷*
${uptimeFormatted}
*╰═════════════════⊷*
    `;

    await client.sendMessage(message.chat, {
      image: { url: "https://files.catbox.moe/6vrc2s.jpg" },
      caption: status.trim(),
    }, { quoted: message });
    
    await client.sendMessage(message.chat, {
            react: { text: "✅", key: m.key }
        });
        
  } catch (err) {
    console.error("Alive Command Error:", err);
    await reply(`❌ Error: ${err.message || err}`);
  }
});
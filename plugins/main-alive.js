const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check bot is alive or not",
    category: "system",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try { 
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

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption: status,
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

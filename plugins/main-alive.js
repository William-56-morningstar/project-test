const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["alive2", "bott", "livea"],
    desc: "Check bot is alive or not",
    category: "system",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try { 
        const uptime = runtime(process.uptime());

        const status = `*BEN BOT IS RUNNING!!*\n` +
                       `*BOT UPTIME INFO:* ${'\u200E'.repeat(500)}\n` +  // empty chars for spacing
                       `*╭═════════════════⊷*\n` +
                       `*┃❍ ${uptime}*\n` +
                       `*╰═════════════════⊷*`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption: status,
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
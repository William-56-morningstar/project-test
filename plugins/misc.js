const config = require('../config');
const fs = require('fs');
const { getAnti, setAnti } = require('../data/antidel');
const { cmd, commands } = require('../command');
const axios = require('axios');
const prefix = config.PREFIX;
const AdmZip = require("adm-zip");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

cmd({
    pattern: "antidelete",
    alias: ['antidel', 'ad'],
    desc: "Manage AntiDelete Settings with Reply Menu",
    category: "misc",
    filename: __filename,
},
async (conn, mek, m, { from, reply, isCreator }) => {
    if (!isCreator) return reply("*Only the bot owner can use this command!*");

    const dmStatus = config.ANTI_DEL_PATH === "log";

    const menuText = `> *ANTI-DELETE 𝐌𝐎𝐃𝐄 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*

> Current DM: ${dmStatus ? "✅ ON (log)" : "❌ OFF (same)"}

Reply with:

*1.* To Enable Antidelete for All (Group,DM) Same Chat  
*2.* To Enable Antidelete for All (Group,DM) dm Chat  
*3.* To Disable All Antidelete and reset

╭────────────────◆  
│ *POWERED BY NOTHING*  
╰─────────────────◆`;

    const sentMsg = await conn.sendMessage(from, {
        image: { url: "https://files.catbox.moe/kakvgo.jpg" },
        caption: menuText
    }, { quoted: mek });

    const messageID = sentMsg.key.id;

    const handler = async (msgData) => {
        try {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

            const quotedId = receivedMsg.message?.extendedTextMessage?.contextInfo?.stanzaId;
            const isReply = quotedId === messageID;
            if (!isReply) return;

            const replyText =
                receivedMsg.message?.conversation ||
                receivedMsg.message?.extendedTextMessage?.text || "";

            let responseText = "";

            if (replyText === "1") {
                await setAnti('gc', true);
                await setAnti('dm', true);
                config.ANTI_DEL_PATH = "same";
                fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(config, null, 2)};`);
                responseText = "✅ AntiDelete Enabled.\nand Mode is Same chat\nGroup: ON\nDM: ON (same)";
            } else if (replyText === "2") {
                await setAnti('gc', true);
                await setAnti('dm', true);
                config.ANTI_DEL_PATH = "log";
                fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(config, null, 2)};`);
                responseText = "✅ AntiDelete Mode changed to DM Log.\nGroup: ON\nDM: ON (log)";
            } else if (replyText === "3") {
                await setAnti('gc', false);
                await setAnti('dm', false);
                config.ANTI_DEL_PATH = "same";
                fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(config, null, 2)};`);
                responseText = "❌ AntiDelete turned off for both Group and DM.";
            } else {
                responseText = "❌ Invalid input. Please reply with *1*, *2*, or *3*.";
            }

            await conn.sendMessage(from, { text: responseText }, { quoted: receivedMsg });
            conn.ev.off("messages.upsert", handler);
        } catch (err) {
            console.error("AntiDelete handler error:", err);
        }
    };

    conn.ev.on("messages.upsert", handler);
    setTimeout(() => conn.ev.off("messages.upsert", handler), 30 * 60 * 1000); // 30 دقیقه
});
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "channel",
    alias: ["support", "groupchannel"],
    use: '.channel',
    desc: "Check bot's response time.",
    category: "tools",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const dec = `
*★☆⚡ʙᴇɴ ʙᴏᴛ⚡☆★*

*ʜᴏᴡ ᴛᴏ ᴅᴇᴘᴏʟʏ ʜᴇʀᴏᴋᴜ ᴠɪᴅᴇᴏ:* https://youtu.be/a7fq-Oua0Sw?si=csi_EgQt0OZnm6DM

*ʜᴏᴡ ᴛᴏ ᴅᴇᴘᴏʟʏ ᴛᴀʟᴋᴅʀᴏᴠᴇ ᴠɪᴅᴇᴏ:* https://youtu.be/a7fq-Oua0Sw?si=csi_EgQt0OZnm6DM

*ᴛᴀʟᴋᴅʀᴏᴠᴇ ꜱɪɴɢᴜᴘ:* https://host.talkdrove.com/auth/signup?ref=E6407DE5@

*ᴛᴀʟᴋᴅʀᴏᴠᴇ ᴅᴇᴘᴏʟʏ ʙᴏᴛ:* https://host.talkdrove.com/share-bot/15

*ʜᴇʀᴏᴋᴜ ᴅᴇᴘᴏʟʏ ʙᴏᴛ:* https://dashboard.heroku.com/new-app?template=https://github.com/NOTHING-MD420/Ben-bot

*ᴘᴀɪʀɪɴɢ ꜱᴇꜱꜱɪᴏɴ ᴡᴇʙ:* https://session.apis-nothing.xyz/

*ʀᴇᴘᴏ:* https://github.com/NOTHING-MD420/Ben-bot

*ᴄʜᴀɴɴᴇʟ ʟɪɴᴋ:* https://whatsapp.com/channel/0029Vasu3qP9RZAUkVkvSv32

*ᴏᴡɴᴇʀ:* https://wa.me/93744215959
        `;
        
        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/6vrc2s.jpg" },
            caption: dec,
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (e) {
        console.error("Error in channel command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
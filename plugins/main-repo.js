const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch GitHub repository information",
    react: "📂",
    category: "system",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/NOTHING-MD420/Ben-bot-v2';

    try {
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        const repoData = await response.json();

        // Format 1: Classic Box
        const style1 = `Hey there👋,
You are chatting with *BEN BOT,* A powerful Whatsapp bot created by *Nothing Tech,*
 Packed with smart features to elevate your WhatsApp experience like never before!

*ʀᴇᴘᴏ ʟɪɴᴋ:* https://github.com/NOTHING-MD420/Ben-bot-v2

*❲❒❳ ɴᴀᴍᴇ:* BEN-BOT
*❲❒❳ sᴛᴀʀs:* ${repoData.stargazers_count}
*❲❒❳ ғᴏʀᴋs:* ${repoData.forks_count}
*❲❒❳ ᴄʀᴇᴀᴛᴇᴅ ᴏɴ:* 1/1/2025
*❲❒❳ ʟᴀsᴛ ᴜᴘᴅᴀᴛᴇᴅ:* ${new Date(repoData.updated_at).toLocaleDateString()}
*❲❒❳ ᴏᴡɴᴇʀ:* 𝐍𝐨𝐭𝐡𝐢𝐧𝐠 𝐓𝐞𝐜𝐡 `;

        // Send image with repo info
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/6vrc2s.jpg' },
            caption: style1,
        }, { quoted: mek });
        
        await conn.sendMessage(from, {
      react: { text: "✅", key: m.key }
    });
    
    } catch (error) {
        console.error("Repo command error:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

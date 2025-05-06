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
    const githubRepoURL = 'https://github.com/NOTHING-MD420/project-test';

    try {
        const match = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) throw new Error("Invalid GitHub repository URL.");

        const [, username, repoName] = match;

        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

        const repoData = await response.json();

        const style1 = `Hey there👋,
You are chatting with *BEN BOT,* A powerful WhatsApp bot created by *Nothing Tech,*
Packed with smart features to elevate your WhatsApp experience like never before!

*ʀᴇᴘᴏ ʟɪɴᴋ:* ${githubRepoURL}

*❲❒❳ ɴᴀᴍᴇ:* ${repoData.name || "BEN-BOT"}
*❲❒❳ sᴛᴀʀs:* ${repoData.stargazers_count}
*❲❒❳ ғᴏʀᴋs:* ${repoData.forks_count}
*❲❒❳ ᴄʀᴇᴀᴛᴇᴅ ᴏɴ:* ${new Date(repoData.created_at).toLocaleDateString()}
*❲❒❳ ʟᴀsᴛ ᴜᴘᴅᴀᴛᴇᴅ:* ${new Date(repoData.updated_at).toLocaleDateString()}
*❲❒❳ ᴏᴡɴᴇʀ:* ${repoData.owner?.login || "Nothing Tech"}`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/6vrc2s.jpg' },
            caption: style1,
        }, { quoted: mek });

        if (conn.sendMessage) {
            await conn.sendMessage(from, {
                react: { text: "✅", key: m.key }
            });
        }

    } catch (error) {
        console.error("Repo command error:", error);
        reply(`❌ Error: ${error.message}`);
    }
});
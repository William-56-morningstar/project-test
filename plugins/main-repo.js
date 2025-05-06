const fetch = require('node-fetch');
const { cmd } = require('../command');

cmd({
  pattern: "repo",
  alias: ["sc", "source", "script"],
  react: "📁",
  desc: "See GitHub information",
  category: "system",
  filename: __filename
}, async (client, message, args, { reply }) => {
  const githubRepoURL = 'https://github.com/NOTHING-MD420/project-test';

  try {
    const res = await fetch('https://api.github.com/repos/NOTHING-MD420/project-test');
    if (!res.ok) throw new Error(`GitHub API Error: ${res.status}`);
    const repoData = await res.json();

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

    await client.sendMessage(message.chat, {
      image: { url: "https://files.catbox.moe/6vrc2s.jpg" },
      caption: style1
    }, { quoted: message });

  } catch (err) {
    console.error("Repo Error:", err);
    await reply(`❌ Failed to fetch repo info:\n${err.message}`);
  }
});
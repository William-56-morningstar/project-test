const { cmd } = require("../command");

cmd({
  pattern: "wastalk",
  react: "📡",
  desc: "Get WhatsApp Channel info from link",
  category: "stalk",
  filename: __filename
}, async (conn, mek, m, {
  from,
  args,
  q,
  reply
}) => {
  try {
    if (!q) return reply("❎ Please provide a WhatsApp Channel link.\n\n*Example:* .wastalk https://whatsapp.com/channel/123456789");

    const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
    if (!match) return reply("⚠️ *Invalid channel link format.*\n\nMake sure it looks like:\nhttps://whatsapp.com/channel/xxxxxxxxx");

    const inviteId = match[1];

    let metadata;
    try {
      metadata = await conn.newsletterMetadata("invite", inviteId);
    } catch (e) {
      return reply("❌ Failed to fetch channel metadata. Make sure the link is correct.");
    }

    if (!metadata || !metadata.id) return reply("❌ Channel not found or inaccessible.");

    const infoText = `*╔═══━「 𝙎𝙏𝘼𝙇𝙆𝙄𝙉𝙂 」━═══╗*\n\n` +
      `▢ *🔖 Name:* ${metadata.name}\n` +
      `▢ *🆔 Jid:* ${metadata.id}\n` +
      `▢ *👥 Followers:* ${metadata.subscribers?.toLocaleString() || "N/A"}\n` +
      `▢ *📅 Created on:* ${metadata.creation_time ? new Date(metadata.creation_time * 1000).toLocaleString("fa-IR") : "Unknown"}\n` +
      `▢ *🔗 Link:* ${q}*` +
      `▢ *📜 Description:* ${metadata.description || "No description"}\n╚═══━「 𝗡𝗢𝗧𝗛𝗜𝗡𝗚-𝗕𝗘𝗡 」━═══╝`;

    if (metadata.preview) {
      await conn.sendMessage(from, {
        image: { url: `https://pps.whatsapp.net${metadata.preview}` },
        caption: infoText
      }, { quoted: m });
    } else {
      await reply(infoText);
    }

  } catch (error) {
    console.error("❌ Error in .wastalk plugin:", error);
    reply("⚠️ An unexpected error occurred.");
  }
});



cmd({
    pattern: "githubstalk",
    desc: "Fetch detailed GitHub user profile including profile picture.",
    category: "stalk",
    react: "🖥️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const username = args[0];
        if (!username) {
            return reply("Please provide a GitHub username.");
        }
        const apiUrl = `https://api.github.com/users/${username}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        let userInfo = `👤 *Username*: ${data.name || data.login}
🔗 *Github Url*:(${data.html_url})
📝 *Bio*: ${data.bio || 'Not available'}
🏙️ *Location*: ${data.location || 'Unknown'}
📊 *Public Repos*: ${data.public_repos}
👥 *Followers*: ${data.followers} | Following: ${data.following}
📅 *Created At*: ${new Date(data.created_at).toDateString()}
🔭 *Public Gists*: ${data.public_gists}`;
          const sentMsg = await conn.sendMessage(from,{image:{url: data.avatar_url },caption: userInfo },{quoted:mek })
    } catch (e) {
        console.log(e);
        reply(`error: ${e.response ? e.response.data.message : e.message}`);
    }
});

// jawad tech x 

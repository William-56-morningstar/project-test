const cheerio = require('cheerio');
const axios = require('axios');

cmd({
  pattern: "wastalk",
  desc: "Get WhatsApp channel information",
  category: "stalk",
  react: "🔍",
  filename: __filename,
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    if (!args) return reply("❌ Please provide a WhatsApp channel URL\nExample: .wstalk https://whatsapp.com/channel/0029Vasu3qP9RZAUkVkvSv32");

    const url = args.trim();
    if (!url.includes("whatsapp.com/channel/")) return reply("❌ Invalid WhatsApp channel URL");

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const name = $('meta[property="og:title"]').attr('content') || 'Unknown';
    const img = $('meta[property="og:image"]').attr('content') || 'No Image';
    let description = $('meta[property="og:description"]').attr('content') || 'No Description';

    let followersMatch = description.match(/(\d[\d,]*)\s*followers/i);
    let followers = followersMatch ? followersMatch[1] : 'Not provided';
    description = description.replace(/(\d[\d,]*)\s*followers/i, '').trim();

    let message = `\n┌──「 𝙎𝙏𝘼𝙇𝙆𝙄𝙉𝙂 」\n`;
    message += `▢ *🔖 Name:* ${name}\n`;
    message += `▢ *👥 Followers:* ${followers}\n`;
    message += `▢ *📜 Description:* ${description}\n`;
    message += `▢ *🔗 Link:* ${url}\n`;
    message += `└────────────`;

    await conn.sendMessage(from, {
      image: { url: img },
      caption: message,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: mek });

  } catch (e) {
    console.error("wstalk Error:", e);
    reply(`❌ Error occurred while fetching channel info:\n${e.message || "Unknown error"}`);
  }
});
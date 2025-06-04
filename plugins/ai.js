const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");

cmd({
  pattern: "flux",
  react: "⏳",
  desc: "Generate an image using AI.",
  category: "ai",
  filename: __filename
}, async (conn, mek, m, { q, from, reply }) => {
  try {
    if (!q) return reply("Please provide a prompt for the image.\nExample: `fluxai home and dog`");

    
    const apiUrl = `https://apis.apis-nothing.xyz/api/ai/flux?text=${encodeURIComponent(q)}&apikey=nothing-api`;

    await conn.sendMessage(m.chat, {
      image: { url: apiUrl },
      caption: `> SUCCESSFULLY GENERATED`
    }, { quoted: m });
    
    await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });
        
  } catch (error) {
    console.error("FluxAI Error:", error);
    reply(`❌ Error: ${error.response?.data?.message || error.message || "Unknown error occurred."}`);
  }
});



cmd({
  pattern: "meta",
  react: "🧠",
  desc: "Generate an AI image based on the given meta prompt.",
  category: "ai",
  filename: __filename
}, async (conn, mek, m, { q, from, reply }) => {
  try {
    if (!q) return reply("📝 Please provide a prompt.\nExample: `.meta captain America`");

    await reply("🧠 *Generating META image... Please wait.*");

    const imageUrl = `https://apis.apis-nothing.xyz/api/ai/meta?text=${encodeURIComponent(q)}&apikey=nothing-api`;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `> SUCCESSFULLY GENERATED`
    }, { quoted: m });
    
    await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });
        
  } catch (error) {
    console.error("MetaAI Error:", error);
    reply(`❌ Failed to generate META image. Error: ${error.response?.data?.message || error.message}`);
  }
});


cmd({
  pattern: "meta-pro",
  react: "🧠",
  desc: "Generate an AI image based on the given meta prompt.",
  category: "ai",
  filename: __filename
}, async (conn, mek, m, { q, from, reply }) => {
  try {
    if (!q) return reply("📝 Please provide a prompt.\nExample: `.meta captain America`");

    await reply("🧠 *Generating META image... Please wait.*");

    const imageUrl = `https://apis.apis-nothing.xyz/api/ai/meta?text=${encodeURIComponent(q)}&apikey=nothing-api`;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `> SUCCESSFULLY GENERATED`
    }, { quoted: m });
    
    await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });
        
  } catch (error) {
    console.error("MetaAI Error:", error);
    reply(`❌ Failed to generate META image. Error: ${error.response?.data?.message || error.message}`);
  }
});
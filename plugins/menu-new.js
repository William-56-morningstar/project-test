const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const FormData = require("form-data");
const { cmd } = require("../command");

cmd({
  pattern: "menu",
  alias: ["menu21", "manu", "munu"],
  react: "⏳",
  desc: "Menu bot alive status and menu",
  category: "menu",
  filename: __filename
}, async (client, message, args, pushname, { reply } = {}) => {
  try {
    
    const status = `
*🎡𝑩𝑬𝑵_𝑩𝑶𝑻🎡*

𝗛𝗲𝗹𝗹𝗼👋🏻

╭━⊱⛲𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗠𝗘𝗡𝗨⛲⊱━╮
┃🤖 *.ᴀɪᴍᴇɴᴜ*
┃📥 *.ᴅᴏᴡɴʟᴏᴀᴅᴍᴇɴᴜ*
┃🧬 *.ɢʀᴏᴜᴘᴍᴇɴᴜ*
┃🧰 *.ᴛᴏᴏʟsᴍᴇɴᴜ*
┃🔄 *.ᴄᴏɴᴠᴇʀᴛᴍᴇɴᴜ*
┃🔍 *.ꜱᴇᴀʀᴄʜᴍᴇɴᴜ*
┃🕌 *.ǫᴜʀᴀɴᴇᴍɴᴜ*
┃📚 *.sᴛᴜᴅʏᴍᴇɴᴜ*
┃🕵️‍♂️ *.sᴛᴀʟkᴍᴇɴᴜ*
┃👾 *.ʙᴜɢᴍᴇɴᴜ*
┃🎮 *.ɢᴀᴍᴇꜱᴍᴇɴᴜ*
┃💰 *.ᴄʀʏᴘᴛᴏᴍᴇɴᴜ*
┃🎉 *.ғᴜɴᴍᴇɴᴜ*
┃🔞 *.ɴsғᴡᴍᴇɴᴜ*
┃🪄 *.ᴘʜᴏᴛᴏᴏxʏᴍᴇɴᴜ*
┃🖼️ *.ᴇᴘʜᴏᴛᴏᴍᴇɴᴜ*
┃🎥 *.ᴀɴɪᴍᴇᴍᴇɴᴜ*
┃🛡️ *.ᴏᴡɴᴇʀᴍᴇɴᴜ*
┃⚙️ *.sʏsᴛᴇᴍᴍᴇɴᴜ*
┃📜 *.ᴀʟʟᴍᴇɴᴜ*
╰━━━━━━━━━━━━━━━━━━━━╯
> 🎗️ʜᴇʀᴇ ɪs ʏᴏᴜʀ ᴍᴇɴᴜ🎗️`;

    await client.sendMessage(message.chat, {
      image: { url: "https://files.catbox.moe/6vrc2s.jpg" },
      caption: status.trim(),
    }, { quoted: message });
        
  } catch (err) {
    console.error("Alive Command Error:", err);
    await reply(`❌ Error: ${err.message || err}`);
  }
});
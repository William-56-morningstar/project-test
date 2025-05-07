const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const FormData = require("form-data");
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');


cmd({
  pattern: "menu",
  react: "⏳",
  desc: "Menu bot alive status and menu",
  category: "menu",
  filename: __filename
}, async (client, message, args, { reply, pushname } = {}) => {
  try {
    
    const status = `
*🎡𝑩𝑬𝑵_𝑩𝑶𝑻🎡*

𝗛𝗲𝗹𝗹𝗼 ${pushname}👋🏻

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

cmd({
    pattern: "ownermenu",
    desc: "menu the bot",
    category: "menu",
    react: "🔰",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // فیلتر کردن دستورات با category "owner"
        const ownerCommands = commands.filter(cmd => cmd.category === "owner");

        // ساخت منو با دستورات فیلتر شده
        let dec = `╭━━〔 *Owner Menu* 〕━━┈⊷\n`;
        ownerCommands.forEach(cmd => {
            dec += `┃◈┃• ${cmd.pattern}\n`;
        });
        dec += `╰──────────────┈⊷\n> ${config.DESCRIPTION}`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/6vrc2s.jpg` },
                caption: dec,
            },
            { quoted: mek }
        );
        
        await conn.sendMessage(from, {
      react: { text: "✅", key: m.key }
    });
    
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


cmd({
    pattern: "downloadmenu",
    alias: ["dlmenu", "downmenu"],
    desc: "dl menu the bot",
    category: "menu",
    react: "🔰",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // فیلتر کردن دستورات با category "owner"
        const ownerCommands = commands.filter(cmd => cmd.category === "downloader");

        // ساخت منو با دستورات فیلتر شده
        let dec = `╭━━〔 *Downloader Menu* 〕━━┈⊷\n`;
        ownerCommands.forEach(cmd => {
            dec += `┃◈┃• ${cmd.pattern}\n`;
        });
        dec += `╰──────────────┈⊷\n> ${config.DESCRIPTION}`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/6vrc2s.jpg` },
                caption: dec,
            },
            { quoted: mek }
        );
        
        await conn.sendMessage(from, {
      react: { text: "✅", key: m.key }
    });
    
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


cmd({
    pattern: "groupmenu",
    alias: ["grpmenu", "grmenu"],
    desc: "group menu the bot",
    category: "menu",
    react: "🔰",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // فیلتر کردن دستورات با category "owner"
        const ownerCommands = commands.filter(cmd => cmd.category === "group");

        // ساخت منو با دستورات فیلتر شده
        let dec = `╭━━〔 *Group Menu* 〕━━┈⊷\n`;
        ownerCommands.forEach(cmd => {
            dec += `┃◈┃• ${cmd.pattern}\n`;
        });
        dec += `╰──────────────┈⊷\n> ${config.DESCRIPTION}`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/6vrc2s.jpg` },
                caption: dec,
            },
            { quoted: mek }
        );
        
        await conn.sendMessage(from, {
      react: { text: "✅", key: m.key }
    });
    
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


cmd({
    pattern: "systemmenu",
    alias: ["sysmenu", "stmenu"],
    desc: "system menu the bot",
    category: "menu",
    react: "🔰",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // فیلتر کردن دستورات با category "owner"
        const ownerCommands = commands.filter(cmd => cmd.category === "system");

        // ساخت منو با دستورات فیلتر شده
        let dec = `╭━━〔 *System Menu* 〕━━┈⊷\n`;
        ownerCommands.forEach(cmd => {
            dec += `┃◈┃• ${cmd.pattern}\n`;
        });
        dec += `╰──────────────┈⊷\n> ${config.DESCRIPTION}`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/6vrc2s.jpg` },
                caption: dec,
            },
            { quoted: mek }
        );
        
        await conn.sendMessage(from, {
      react: { text: "✅", key: m.key }
    });
    
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});




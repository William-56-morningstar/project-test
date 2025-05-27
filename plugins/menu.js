const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const FormData = require("form-data");
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');
const yts = require("yt-search");
const {
  generateWAMessageFromContent,
  generateWAMessageContent,
} = require("@whiskeysockets/baileys");
const commandPrefix = config.PREFIX;



/*
cmd({
    pattern: "menu",
    react: "✅",
    desc: "Check bot owner.",
    category: "menu",
    filename: __filename
}, async (conn, mek, m, { from, prefix, pushname, q, reply }) => {
    try {

        let teksnya = `*🎡𝑩𝑬𝑵_𝑩𝑶𝑻🎡*

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
╰━━━━━━━━━━━━━━━━━━━━╯`;

    let fatter = `> 🎗️ʜᴇʀᴇ ɪs ʏᴏᴜʀ ᴍᴇɴᴜ🎗️`;
    const buttonMenu = {
      title: "🔑 Select menu type",
      rows: [
        { title: "DOWNLOAD MENU", description: "Download commands", id: `.dlmenu` },
        { title: "SEARCH MENU", description: "Search commands", id: `${commandPrefix}searchmenu` },
        { title: "CONVERT MENU", description: "Convert commands", id: `${commandPrefix}convertmenu` },
        { title: "MAIN MENU", description: "Convert commands", id: `${commandPrefix}mainmenu` },
        { title: "GROUP MENU", description: "Group commands", id: `${commandPrefix}groupmenu` },
        { title: "LOGO MENU", description: "Logo commands", id: `${commandPrefix}logomenu` },
        { title: "BUG MENU", description: "Bug commands", id: `${commandPrefix}bugmenu` },
        { title: "MOVIE MENU", description: "Movie commands", id: `${commandPrefix}moviemenu` },
        { title: "TOOLS MENU", description: "Tools commands", id: `${commandPrefix}toolsmenu` }
      ]
    };

    const buttonOptions = {
      title: "Click Here⎙",
      sections: [buttonMenu]
    };

    const buttonImage = { url: config.MENU_IMAGE_URL };
    const aliveButton = { displayText: "ALIVE" };
    const pingButton = { displayText: "PING" };

    const buttons = [
      { buttonId: `${commandPrefix}alive`, buttonText: aliveButton },
      { buttonId: `${commandPrefix}ping`, buttonText: pingButton },
      {
        buttonId: "action",
        buttonText: { displayText: "ini pesan interactiveMeta" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify(buttonOptions)
        }
      }
    ];

      const messageOptions = {
        image: { url: "https://files.catbox.moe/6vrc2s.jpg" },
        caption: teksnya,
        footer: fatter,
        buttons: buttons,
        headerType: 1,
        viewOnce: true
      };
      await conn.sendMessage(from, messageOptions, { quoted: mek });
      
      
      
        

    } catch (e) {
        console.error(e);
        await reply("An error occurred. Please try again.");
    }
});
*/

cmd({
    pattern: "menu",
    alias: ["help", "commands"],
    desc: "Show all menu categories",
    category: "general",
    react: "📖",
    filename: __filename
},
async (conn, mek, m, { from, pushname: _0x1279c5, reply }) => {
    try {
        const os = require("os");
        const uptime = process.uptime();
        const totalMem = os.totalmem() / (1024 ** 3);
        const freeMem = os.freemem() / (1024 ** 3);
        const usedMem = totalMem - freeMem;

        const mode = "public"; // یا private
        const version = "2.0.0";
        const plugins = commands.length;
        const now = new Date();
        const time = now.toLocaleTimeString("en-US", { hour12: true, timeZone: "Asia/Kabul" });
        const date = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kabul" });

        let menuText = `╭══〘〘 *𝘽𝙀𝙉-𝘽𝙊𝙏* 〙〙═⊷
┃❍ *Mᴏᴅᴇ:* ${config.MODE}
┃❍ *Pʀᴇғɪx:* [ ${commandPrefix} ]
┃❍ *Usᴇʀ:* ${_0x1279c5 || "User"}
┃❍ *Pʟᴜɢɪɴs:* ${plugins}
┃❍ *Vᴇʀsɪᴏɴ:* ${version}
┃❍ *Uᴘᴛɪᴍᴇ:* ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m
┃❍ *Tɪᴍᴇ Nᴏᴡ:* ${time} Afghanistan
┃❍ *Dᴀᴛᴇ Tᴏᴅᴀʏ:* ${date}
┃❍ *Tɪᴍᴇ Zᴏɴᴇ:* Asia/Kabul
┃❍ *Sᴇʀᴠᴇʀ Rᴀᴍ:* ${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB
╰═════════════════⊷\n\n`;

        const categories = [...new Set(commands.map(cmd => cmd.category))];

        for (const category of categories) {
            const cmdsInCat = commands.filter(cmd => cmd.category === category);
            if (cmdsInCat.length === 0) continue;

            menuText += `╭━━━━❮ *${category.toUpperCase()}* ❯━⊷\n`;
            cmdsInCat.forEach(cmd => {
                menuText += `┃◇ .${cmd.pattern}\n`;
            });
            menuText += `╰━━━━━━━━━━━━━━━━━⊷\n\n`;
        }

        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/6vrc2s.jpg` },
            caption: menuText.trim()
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (e) {
        console.error(e);
        reply("Error while generating menu:\n" + e.toString());
    }
});


cmd({
  'pattern': "menu3",
  'alias': [],
  'react': '📜',
  'desc': "Display the main menu",
  'category': "menu",
  'filename': __filename,
}, async (_0x2d5080, _0x1a71cf, _0x56f5c6, {
  from: _0x289080,
  quoted: _0x3ef4cf,
  body: _0x1b04e4,
  isCmd: _0x1eed9f,
  command: _0x14aa3d,
  args: _0x104c1c,
  q: _0x4905ab,
  isGroup: _0x5313d0,
  sender: _0x4796d0,
  senderNumber: _0x3a68fa,
  pushname: _0x1279c5,
  reply: _0x10d146
}) => {
  try {
    const thumbnailUrl = "https://files.catbox.moe/6gzrcw.jpg"; // لینک تصویر منو
    const menuText = `*🎡𝑩𝑬𝑵_𝑩𝑶𝑻🎡*\n\n*Hello ${_0x1279c5 || "User"}* 👋🏻\n\n*> 🎗️ʜᴇʀᴇ ɪs ʏᴏᴜʀ ᴍᴇɴᴜ🎗️*`;

    const imageMessage = await generateWAMessageContent(
      { image: { url: thumbnailUrl } },
      { upload: _0x2d5080.waUploadToServer }
    );

    let card = {
      header: {
        imageMessage: imageMessage.imageMessage,
        hasMediaAttachment: true,
      },
      body: { text: menuText },
      nativeFlowMessage: {
        buttons: [
          { name: "quick_reply", buttonParamsJson: `{"display_text":"All Quran Menu","id": ".quranmenu"}` },
          { name: "quick_reply", buttonParamsJson: `{"display_text":"Owner Menu","id": ".ownermenu"}` },
          { name: "quick_reply", buttonParamsJson: `{"display_text":"Download Menu","id": ".dlmenu"}` },
          { name: "quick_reply", buttonParamsJson: `{"display_text":"Groups Menu","id": ".groupmenu"}` },
          { name: "quick_reply", buttonParamsJson: `{"display_text":"Info Menu","id": ".infomenu"}` },
          { name: "quick_reply", buttonParamsJson: `{"display_text":"Random Menu","id": ".randommenu"}` },
          { name: "quick_reply", buttonParamsJson: `{"display_text":"Convert Menu","id": ".convertmenu"}` },
          { name: "quick_reply", buttonParamsJson: `{"display_text":"Ai-cmd Menu","id": ".aimenu"}` },
          { name: "quick_reply", buttonParamsJson: `{"display_text":"Walppapers Menu","id": ". walppapermenu"}` },
          { name: "quick_reply", buttonParamsJson: `{"display_text":"Other Menu","id": ".othermenu"}` },
        ],
      },
    };

    const messageContent = generateWAMessageFromContent(
      _0x56f5c6.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: { text: "*`( MENU OPTIONS )`*" },
              carouselMessage: {
                cards: [card],
                messageVersion: 0x1,
              },
            },
          },
        },
      },
      {}
    );

    await _0x2d5080.relayMessage(
      _0x56f5c6.chat,
      messageContent.message,
      { messageId: messageContent.key.id }
    );
  } catch (error) {
    console.error(error);
    _0x10d146(`Error: ${error.message}`);
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















cmd({
    pattern: "menu2",
    alias: ["allmenu","fullmenu"],
    use: '.menu2',
    desc: "Show all bot commands",
    category: "menu",
    react: "📜",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭━━〔 🚀 *${config.BOT_NAME}* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 👑 Owner : *${config.OWNER_NAME}*
┃◈┃• ⚙️ Prefix : *[${config.PREFIX}]*
┃◈┃• 🌐 Platform : *Heroku*
┃◈┃• 📦 Version : *2.0.0*
┃◈┃• ⏱️ Runtime : *${runtime(process.uptime())}*
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 📥 *DOWNLOAD MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 🟦 facebook
┃◈┃• 📁 mediafire
┃◈┃• 🎵 tiktok
┃◈┃• 🐦 twitter
┃◈┃• 📷 insta
┃◈┃• 📦 apk
┃◈┃• 🖼️ img
┃◈┃• ▶️ tt2
┃◈┃• 📌 pins
┃◈┃• 🔄 apk2
┃◈┃• 🔵 fb2
┃◈┃• 📍 pinterest
┃◈┃• 🎶 spotify
┃◈┃• 🎧 play
┃◈┃• 🎧 play2
┃◈┃• 🔉 audio
┃◈┃• 🎬 video
┃◈┃• 📹 video2
┃◈┃• 🎵 ytmp3
┃◈┃• 📹 ytmp4
┃◈┃• 🎶 song
┃◈┃• 🎬 darama
┃◈┃• ☁️ gdrive
┃◈┃• 🌐 ssweb
┃◈┃• 🎵 tiks
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 👥 *GROUP MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 🔗 grouplink
┃◈┃• 🚪 kickall
┃◈┃• 🚷 kickall2
┃◈┃• 🚫 kickall3
┃◈┃• ➕ add
┃◈┃• ➖ remove
┃◈┃• 👢 kick
┃◈┃• ⬆️ promote
┃◈┃• ⬇️ demote
┃◈┃• 🚮 dismiss
┃◈┃• 🔄 revoke
┃◈┃• 👋 setgoodbye
┃◈┃• 🎉 setwelcome
┃◈┃• 🗑️ delete
┃◈┃• 🖼️ getpic
┃◈┃• ℹ️ ginfo
┃◈┃• ⏳ disappear on
┃◈┃• ⏳ disappear off
┃◈┃• ⏳ disappear 7D,24H
┃◈┃• 📝 allreq
┃◈┃• ✏️ updategname
┃◈┃• 📝 updategdesc
┃◈┃• 📩 joinrequests
┃◈┃• 📨 senddm
┃◈┃• 🏃 nikal
┃◈┃• 🔇 mute
┃◈┃• 🔊 unmute
┃◈┃• 🔒 lockgc
┃◈┃• 🔓 unlockgc
┃◈┃• 📩 invite
┃◈┃• #️⃣ tag
┃◈┃• 🏷️ hidetag
┃◈┃• @️⃣ tagall
┃◈┃• 👔 tagadmins
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 🎭 *REACTIONS MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 👊 bully @tag
┃◈┃• 🤗 cuddle @tag
┃◈┃• 😢 cry @tag
┃◈┃• 🤗 hug @tag
┃◈┃• 🐺 awoo @tag
┃◈┃• 💋 kiss @tag
┃◈┃• 👅 lick @tag
┃◈┃• 🖐️ pat @tag
┃◈┃• 😏 smug @tag
┃◈┃• 🔨 bonk @tag
┃◈┃• 🚀 yeet @tag
┃◈┃• 😊 blush @tag
┃◈┃• 😄 smile @tag
┃◈┃• 👋 wave @tag
┃◈┃• ✋ highfive @tag
┃◈┃• 🤝 handhold @tag
┃◈┃• 🍜 nom @tag
┃◈┃• 🦷 bite @tag
┃◈┃• 🤗 glomp @tag
┃◈┃• 👋 slap @tag
┃◈┃• 💀 kill @tag
┃◈┃• 😊 happy @tag
┃◈┃• 😉 wink @tag
┃◈┃• 👉 poke @tag
┃◈┃• 💃 dance @tag
┃◈┃• 😬 cringe @tag
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 🎨 *LOGO MAKER* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 💡 neonlight
┃◈┃• 🎀 blackpink
┃◈┃• 🐉 dragonball
┃◈┃• 🎭 3dcomic
┃◈┃• 🇺🇸 america
┃◈┃• 🍥 naruto
┃◈┃• 😢 sadgirl
┃◈┃• ☁️ clouds
┃◈┃• 🚀 futuristic
┃◈┃• 📜 3dpaper
┃◈┃• ✏️ eraser
┃◈┃• 🌇 sunset
┃◈┃• 🍃 leaf
┃◈┃• 🌌 galaxy
┃◈┃• 💀 sans
┃◈┃• 💥 boom
┃◈┃• 💻 hacker
┃◈┃• 😈 devilwings
┃◈┃• 🇳🇬 nigeria
┃◈┃• 💡 bulb
┃◈┃• 👼 angelwings
┃◈┃• ♈ zodiac
┃◈┃• 💎 luxury
┃◈┃• 🎨 paint
┃◈┃• ❄️ frozen
┃◈┃• 🏰 castle
┃◈┃• 🖋️ tatoo
┃◈┃• 🔫 valorant
┃◈┃• 🐻 bear
┃◈┃• 🔠 typography
┃◈┃• 🎂 birthday
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 👑 *OWNER MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 👑 owner
┃◈┃• 📜 menu
┃◈┃• 📜 menu2
┃◈┃• 📊 vv
┃◈┃• 📋 listcmd
┃◈┃• 📚 allmenu
┃◈┃• 📦 repo
┃◈┃• 🚫 block
┃◈┃• ✅ unblock
┃◈┃• 🖼️ fullpp
┃◈┃• 🖼️ setpp
┃◈┃• 🔄 restart
┃◈┃• ⏹️ shutdown
┃◈┃• 🔄 updatecmd
┃◈┃• 💚 alive
┃◈┃• 🏓 ping
┃◈┃• 🆔 gjid
┃◈┃• 🆔 jid
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 🎉 *FUN MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 🤪 shapar
┃◈┃• ⭐ rate
┃◈┃• 🤬 insult
┃◈┃• 💻 hack
┃◈┃• 💘 ship
┃◈┃• 🎭 character
┃◈┃• 💌 pickup
┃◈┃• 😆 joke
┃◈┃• ❤️ hrt
┃◈┃• 😊 hpy
┃◈┃• 😔 syd
┃◈┃• 😠 anger
┃◈┃• 😳 shy
┃◈┃• 💋 kiss
┃◈┃• 🧐 mon
┃◈┃• 😕 cunfuzed
┃◈┃• 🖼️ setpp
┃◈┃• ✋ hand
┃◈┃• 🏃 nikal
┃◈┃• 🤲 hold
┃◈┃• 🤗 hug
┃◈┃• 🏃 nikal
┃◈┃• 🎵 hifi
┃◈┃• 👉 poke
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 🔄 *CONVERT MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 🏷️ sticker
┃◈┃• 🏷️ sticker2
┃◈┃• 😀 emojimix
┃◈┃• ✨ fancy
┃◈┃• 🖼️ take
┃◈┃• 🎵 tomp3
┃◈┃• 🗣️ tts
┃◈┃• 🌐 trt
┃◈┃• 🔢 base64
┃◈┃• 🔠 unbase64
┃◈┃• 010 binary
┃◈┃• 🔤 dbinary
┃◈┃• 🔗 tinyurl
┃◈┃• 🌐 urldecode
┃◈┃• 🌐 urlencode
┃◈┃• 🌐 url
┃◈┃• 🔁 repeat
┃◈┃• ❓ ask
┃◈┃• 📖 readmore
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 🤖 *AI MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 🧠 ai
┃◈┃• 🤖 gpt3
┃◈┃• 🤖 gpt2
┃◈┃• 🤖 gptmini
┃◈┃• 🤖 gpt
┃◈┃• 🔵 meta
┃◈┃• 📦 blackbox
┃◈┃• 🌈 luma
┃◈┃• 🎧 dj
┃◈┃• 👑 khan
┃◈┃• 🤵 jawad
┃◈┃• 🧠 gpt4
┃◈┃• 🔍 bing
┃◈┃• 🎨 imagine
┃◈┃• 🖼️ imagine2
┃◈┃• 🤖 copilot
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 ⚡ *MAIN MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 🏓 ping
┃◈┃• 🏓 ping2
┃◈┃• 🚀 speed
┃◈┃• 📡 live
┃◈┃• 💚 alive
┃◈┃• ⏱️ runtime
┃◈┃• ⏳ uptime
┃◈┃• 📦 repo
┃◈┃• 👑 owner
┃◈┃• 📜 menu
┃◈┃• 📜 menu2
┃◈┃• 🔄 restart
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 🎎 *ANIME MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 🤬 fack
┃◈┃• ✅ truth
┃◈┃• 😨 dare
┃◈┃• 🐶 dog
┃◈┃• 🐺 awoo
┃◈┃• 👧 garl
┃◈┃• 👰 waifu
┃◈┃• 🐱 neko
┃◈┃• 🧙 megnumin
┃◈┃• 🐱 neko
┃◈┃• 👗 maid
┃◈┃• 👧 loli
┃◈┃• 🎎 animegirl
┃◈┃• 🎎 animegirl1
┃◈┃• 🎎 animegirl2
┃◈┃• 🎎 animegirl3
┃◈┃• 🎎 animegirl4
┃◈┃• 🎎 animegirl5
┃◈┃• 🎬 anime1
┃◈┃• 🎬 anime2
┃◈┃• 🎬 anime3
┃◈┃• 🎬 anime4
┃◈┃• 🎬 anime5
┃◈┃• 📰 animenews
┃◈┃• 🦊 foxgirl
┃◈┃• 🍥 naruto
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 ℹ️ *OTHER MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 🕒 timenow
┃◈┃• 📅 date
┃◈┃• 🔢 count
┃◈┃• 🧮 calculate
┃◈┃• 🔢 countx
┃◈┃• 🎲 flip
┃◈┃• 🪙 coinflip
┃◈┃• 🎨 rcolor
┃◈┃• 🎲 roll
┃◈┃• ℹ️ fact
┃◈┃• 💻 cpp
┃◈┃• 🎲 rw
┃◈┃• 💑 pair
┃◈┃• 💑 pair2
┃◈┃• 💑 pair3
┃◈┃• ✨ fancy
┃◈┃• 🎨 logo <text>
┃◈┃• 📖 define
┃◈┃• 📰 news
┃◈┃• 🎬 movie
┃◈┃• ☀️ weather
┃◈┃• 📦 srepo
┃◈┃• 🤬 insult
┃◈┃• 💾 save
┃◈┃• 🌐 wikipedia
┃◈┃• 🔑 gpass
┃◈┃• 👤 githubstalk
┃◈┃• 🔍 yts
┃◈┃• 📹 ytv
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/6vrc2s.jpg' },
                caption: dec,
            },
            { quoted: mek }
        );
        
    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e}`);
    }
});

const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');
const yts = require("yt-search");
const config = require("../config");
const commandPrefix = config.PREFIX;

cmd({
    pattern: "menu4",
    react: "🎶",
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
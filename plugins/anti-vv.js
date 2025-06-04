const fs = require("fs");
const { cmd, commands } = require('../command');
const config = require('../config');
const axios = require('axios');
const prefix = config.PREFIX;
const AdmZip = require("adm-zip");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');
const { getAnti, setAnti } = require('../data/antidel');
const path = require('path');
const { exec } = require('child_process');
const FormData = require('form-data');



function getNewsletterContext(senderJid) {
    return {
        mentionedJid: [senderJid],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363333589976873@newsletter',
            newsletterName: "NOTHING TECH",
            serverMessageId: 143
        }
    };
}


cmd({
  pattern: "vv",
  react: '⚠️',
  desc: "Owner Only - retrieve quoted message back to user",
  category: "owner",
  filename: __filename
}, async (client, m, match, extra = {}) => {
  const { from, isCreator } = extra;

  try {
    if (!isCreator) {
      return await client.sendMessage(from, {
        text: "*📛 This is an owner command.*",
        contextInfo: getNewsletterContext(m.sender)
      }, { quoted: m });
    }

    if (!match.quoted) {
      return await client.sendMessage(from, {
        text: "*🍁 Please reply to a view once message!*",
        contextInfo: getNewsletterContext(m.sender)
      }, { quoted: m });
    }

    if (!match.quoted.viewOnce) {
      return await client.sendMessage(from, {
        text: "⚠️ Please reply to a *view once* message.",
        contextInfo: getNewsletterContext(m.sender)
      }, { quoted: m });
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;

    let messageContent = {};

    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "image/jpeg",
          contextInfo: getNewsletterContext(m.sender)
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "video/mp4",
          contextInfo: getNewsletterContext(m.sender)
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false,
          contextInfo: getNewsletterContext(m.sender)
        };
        break;
      default:
        return await client.sendMessage(from, {
          text: "❌ Only image, video, and audio messages are supported.",
          contextInfo: getNewsletterContext(m.sender)
        }, { quoted: m });
    }

    await client.sendMessage(from, messageContent, { quoted: m });

  } catch (error) {
    console.error("vv Error:", error);
    await client.sendMessage(from || m.chat, {
      text: "❌ Error fetching view once message:\n" + error.message,
      contextInfo: getNewsletterContext(m.sender)
    }, { quoted: m });
  }
});



cmd({
  pattern: "antiviewonce",
  desc: "Configure AntiViewOnce System (No DB)",
  category: "owner",
  react: "👁️‍🗨️",
  filename: __filename,
}, async (conn, mek, m, { from, isCreator, reply }) => {
  try {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const currentStatus = config.ANTIVIEW_ONCE === "true" ? true : false;
    const enabledText = currentStatus ? `✅ AntiViewOnce is ON` : `❌ AntiViewOnce is OFF`;

    const menuText = `> *BEN-BOT ANTIVIEWONCE SETTINGS*

> Current Status: ${enabledText}

Reply with:

*1.* Enable AntiViewOnce  
*2.* Disable AntiViewOnce

╭────────────────  
│ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ Nothing Tech*  
╰─────────────────◆`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: "https://cdn.apis-nothing.xyz/uploads/IMG-20250503-WA0012.jpg" }, // یا هر عکس مناسب
      caption: menuText
    }, { quoted: mek });

    const messageID = sentMsg.key.id;

    const handler = async (msgData) => {
      try {
        const receivedMsg = msgData.messages[0];
        if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

        const quotedId = receivedMsg.message?.extendedTextMessage?.contextInfo?.stanzaId;
        const isReply = quotedId === messageID;
        if (!isReply) return;

        const replyText =
          receivedMsg.message?.conversation ||
          receivedMsg.message?.extendedTextMessage?.text ||
          "";

        const sender = receivedMsg.key.remoteJid;

        if (replyText === "1") {
          config.ANTIVIEW_ONCE = "true";
          await conn.sendMessage(sender, { text: "✅ AntiViewOnce Enabled." }, { quoted: receivedMsg });
        } else if (replyText === "2") {
          config.ANTIVIEW_ONCE = "false";
          await conn.sendMessage(sender, { text: "❌ AntiViewOnce Disabled." }, { quoted: receivedMsg });
        } else {
          await conn.sendMessage(sender, { text: "❗ Invalid option. Please reply with *1* or *2*." }, { quoted: receivedMsg });
        }

        conn.ev.off("messages.upsert", handler);
      } catch (err) {
        console.log("AntiViewOnce CMD handler error:", err);
      }
    };

    conn.ev.on("messages.upsert", handler);
    setTimeout(() => conn.ev.off("messages.upsert", handler), 600000); // 10 minutes

  } catch (e) {
    reply(`❗ Error: ${e.message}`);
  }
});


cmd({
  on: "body"
}, async (conn, m, store, { from, body, isGroup, isAdmins, isBotAdmins, reply, sender }) => {
  try {
    // فقط اگر antiviewonce فعال است
    if (config.ANTIVIEW_ONCE === "true") {
      if (m.message?.viewOnce) {
        try {
          const buffer = await m.download();
          let messageContent = {};

          switch (m.mtype) {
            case "imageMessage":
              messageContent = {
                image: buffer,
                caption: m.message?.imageMessage?.caption || "",
              };
              break;
            case "videoMessage":
              messageContent = {
                video: buffer,
                caption: m.message?.videoMessage?.caption || "",
              };
              break;
            case "audioMessage":
              messageContent = {
                audio: buffer,
                ptt: m.message?.audioMessage?.ptt || false,
              };
              break;
            default:
              break;
          }

          if (Object.keys(messageContent).length > 0) {
            await conn.sendMessage(from, messageContent, { quoted: m });
          }
        } catch (err) {
          console.error("Error sending antiviewonce message:", err);
        }
      }
    }
  } catch (error) {
    console.error(error);
    reply("An error occurred while processing the message.");
  }
});
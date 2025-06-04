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
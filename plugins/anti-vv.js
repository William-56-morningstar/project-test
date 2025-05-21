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


cmd({
  pattern: "vv",
  react: '⚠️',
  desc: "Owner Only - retrieve quoted message back to user",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isCreator }) => {
  try {
    if (!isCreator) {
      return await client.sendMessage(from, {
        text: "*📛 This is an owner command.*"
      }, { quoted: message });
    }

    if (!match.quoted) {
      return await client.sendMessage(from, {
        text: "*🍁 Please reply to a view once message!*"
      }, { quoted: message });
    }

    // بررسی اینکه واقعاً viewOnce هست
    if (!match.quoted.viewOnce) {
      return await client.sendMessage(from, {
        text: "⚠️ Please reply to a view once message thats not view once message!"
      }, { quoted: message });
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const options = { quoted: message };

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false
        };
        break;
      default:
        return await client.sendMessage(from, {
          text: "❌ Only image, video, and audio messages are supported"
        }, { quoted: message });
    }

    await client.sendMessage(from, messageContent, options);
  } catch (error) {
    console.error("vv Error:", error);
    await client.sendMessage(from, {
      text: "❌ Error fetching vv message:\n" + error.message
    }, { quoted: message });
  }
});

cmd({
  pattern: "antiviewonce",
  fromMe: true,
  desc: "Configure ANTIVIEWONCE mode",
  category: "owner",
  filename: __filename
}, async (conn, mek) => {
  const current =
    config.ANTIVIEW_ONCE === "all" ? "All Chats" :
    config.ANTIVIEW_ONCE === "group" ? "Groups Only" :
    config.ANTIVIEW_ONCE === "private" ? "Private Only" : "Disabled";

  const caption = `> *ANTIVIEWONCE SETTINGS*\n\n> Current: *${current}*\n\nReply with:\n1. All chats\n2. Private chats only\n3. Group chats only\n4. Disable\n\n╭─────────────\n│ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ Nothing ᴛᴇᴄʜ*\n╰─────────────◆`;

  const sent = await conn.sendMessage(mek.jid, {
    caption,
    image: { url: "https://i.ibb.co/4gY6xmm/viewonce.jpg" }
  }, { quoted: mek });

  const msgId = sent.key.id;

  const handler = async (msgData) => {
    const received = msgData.messages?.[0];
    const text = received?.message?.conversation || "";

    if (received?.message?.extendedTextMessage?.contextInfo?.stanzaId !== msgId) return;

    const jid = received.key.remoteJid;

    if (["1", "2", "3", "4"].includes(text)) {
      if (text === "1") config.ANTIVIEW_ONCE = "all";
      else if (text === "2") config.ANTIVIEW_ONCE = "private";
      else if (text === "3") config.ANTIVIEW_ONCE = "group";
      else config.ANTIVIEW_ONCE = "off";

      await conn.sendMessage(jid, {
        text: `✅ AntiViewOnce mode set to *${config.ANTIVIEW_ONCE.toUpperCase()}*`
      }, { quoted: received });

      conn.ev.off("messages.upsert", handler);
    } else {
      await conn.sendMessage(jid, { text: "❌ Invalid option." }, { quoted: received });
    }
  };

  conn.ev.on("messages.upsert", handler);
  setTimeout(() => conn.ev.off("messages.upsert", handler), 600000);
});

cmd({
  on: "message",
}, async (client, message) => {
  try {
    const quoted = message?.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted || !quoted.viewOnceMessage) return;

    const isGroup = message.key.remoteJid.endsWith("@g.us");
    const mode = config.ANTIVIEW_ONCE;

    if (
      (mode === "off") ||
      (mode === "private" && isGroup) ||
      (mode === "group" && !isGroup)
    ) return;

    const content = quoted.viewOnceMessage.message;
    const type = Object.keys(content)[0];
    const buffer = await client.downloadMediaMessage({ message: content });

    const msgObj = {};
    if (type === "imageMessage") {
      msgObj.image = buffer;
    } else if (type === "videoMessage") {
      msgObj.video = buffer;
    } else if (type === "audioMessage") {
      msgObj.audio = buffer;
      msgObj.mimetype = content.audioMessage?.mimetype || "audio/mp4";
      msgObj.ptt = content.audioMessage?.ptt || false; // اگر ویس باشه true هست
    } else {
      return; // پیام‌های دیگر را نادیده بگیر
    }

    await client.sendMessage(message.key.remoteJid, msgObj, { quoted: message });

  } catch (err) {
    console.log("Auto VV Error:", err);
  }
});
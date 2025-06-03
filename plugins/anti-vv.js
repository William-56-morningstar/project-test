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
  desc: "Toggle AntiViewOnce (on/off)",
  category: "owner",
  react: "🛡️",
  filename: __filename
}, async (conn, mek, m, { args, reply, isCreator }) => {
  if (!isCreator) return reply("🔒 Only owner can use this.");

  const input = (args[0] || "").toLowerCase();
  if (input === "on") {
    config.ANTIVIEW_ONCE = "true";
    return reply("✅ AntiViewOnce turned ON (all chats)");
  } else if (input === "off") {
    config.ANTIVIEW_ONCE = "false";
    return reply("❌ AntiViewOnce turned OFF");
  } else {
    return reply("⚠️ Usage:\n.antiviewonce on\n.antiviewonce off");
  }
});



//antiviewonce
cmd({
  on: "body"
},    
async (client, message, match, { from, isCreator }) => {       
 if (config.ANTIVIEW_ONCE === 'true') {
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
            }
         } 
   );

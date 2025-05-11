const { cmd } = require('../command');
const config = require('../config');
const { runtime } = require('../lib/functions');
const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const FormData = require("form-data");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions')


cmd({
    pattern: "qr",
    alias: ["qrcode", "qr2"],
    desc: "Create QR code from text",
    category: "tools",
    react: "📦",
    filename: __filename
},
async (client, message, m, { args, reply }) => {
    try {
        const allowedNumber = "93744215959@s.whatsapp.net";
        
        if (!args[0]) return reply("❌ Please provide a text.\nExample: `.qr example`");

        const text = args.join(" ");
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;

        await client.sendMessage(message.chat, {
            image: { url: qrUrl },
            caption: `> ✅ QR Code generated for: ${text}`
        }, { quoted: message });

    } catch (err) {
        console.error("Error in .qr command:", err);
        reply("❌ Error: " + err.message);
    }
});

cmd({
    pattern: "countdown",
    desc: "Start a countdown timer (Owner only)",
    category: "tools",
    react: "⏱️",
    filename: __filename
},
async (conn, m, message, { args, reply, isCreator, isOwner }) => {
    try {
        if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

        let seconds = parseInt(args[0]);
        if (isNaN(seconds) || seconds <= 0) {
            return reply("❌ Please provide a valid number of seconds.");
        }

        reply(`⏳ Countdown started for ${seconds} seconds...`);

        const timer = setInterval(() => {
            seconds--;
            reply(`⏱️ Time left: ${seconds} seconds`);
            if (seconds === 0) {
                clearInterval(timer);
                reply("✅ Countdown finished!");
            }
        }, 1000);
        
    } catch (err) {
        console.error(err);
        reply("❌ Error: " + err.message);
    }
});

cmd({
    pattern: "owner",
    react: "✅", 
    desc: "Get owner number",
    category: "tools",
    filename: __filename
}, 
async (conn, mek, m, { from }) => {
    try {
        const ownerNumber = config.OWNER_NUMBER; // Fetch owner number from config
        const ownerName = config.OWNER_NAME;     // Fetch owner name from config

        const vcard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      `FN:${ownerName}\n` +  
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\n` + 
                      'END:VCARD';

        // Send the vCard
        const sentVCard = await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        // Send the owner contact message with image and audio
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/6vrc2s.jpg' }, // Image URL from your request
            caption: `╭━━〔 *BEN-BOT* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *Here is the owner details*
┃◈┃• *Name* - ${ownerName}
┃◈┃• *Number* ${ownerNumber}
┃◈┃• *Version*: 2.0.0
┃◈└───────────┈⊷
╰──────────────┈⊷`, // Display the owner's details
        }, { quoted: mek });

       

    } catch (error) {
        console.error(error);
        reply(`An error occurred: ${error.message}`);
    }
});

cmd({
    pattern: "channel",
    alias: ["support", "groupchannel"],
    use: '.channel',
    desc: "Check bot's response time.",
    category: "tools",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const dec = `
*★☆⚡ʙᴇɴ ʙᴏᴛ⚡☆★*

*ʜᴏᴡ ᴛᴏ ᴅᴇᴘᴏʟʏ ʜᴇʀᴏᴋᴜ ᴠɪᴅᴇᴏ:* https://youtu.be/a7fq-Oua0Sw?si=csi_EgQt0OZnm6DM

*ʜᴏᴡ ᴛᴏ ᴅᴇᴘᴏʟʏ ᴛᴀʟᴋᴅʀᴏᴠᴇ ᴠɪᴅᴇᴏ:* https://youtu.be/a7fq-Oua0Sw?si=csi_EgQt0OZnm6DM

*ᴛᴀʟᴋᴅʀᴏᴠᴇ ꜱɪɴɢᴜᴘ:* https://host.talkdrove.com/auth/signup?ref=E6407DE5@

*ᴛᴀʟᴋᴅʀᴏᴠᴇ ᴅᴇᴘᴏʟʏ ʙᴏᴛ:* https://host.talkdrove.com/share-bot/15

*ʜᴇʀᴏᴋᴜ ᴅᴇᴘᴏʟʏ ʙᴏᴛ:* https://dashboard.heroku.com/new-app?template=https://github.com/NOTHING-MD420/Ben-bot

*ᴘᴀɪʀɪɴɢ ꜱᴇꜱꜱɪᴏɴ ᴡᴇʙ:* https://session.apis-nothing.xyz/

*ʀᴇᴘᴏ:* https://github.com/NOTHING-MD420/Ben-bot

*ᴄʜᴀɴɴᴇʟ ʟɪɴᴋ:* https://whatsapp.com/channel/0029Vasu3qP9RZAUkVkvSv32

*ᴏᴡɴᴇʀ:* https://wa.me/93744215959
        `;
        
        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/6vrc2s.jpg" },
            caption: dec,
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (e) {
        console.error("Error in channel command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

cmd({
    pattern: "spam",
    alias: ["spam2","spam3"],use: '.spam',
    desc: "Check bot's response time.",
    category: "tools",
    react: "🐛",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        
        const text = ` \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n `;

        await conn.sendMessage(from, {
            text}, { quoted: mek });
            
        await conn.sendMessage(from, {
            text}, { quoted: mek });
            
        await conn.sendMessage(from, {
            text}, { quoted: mek });
            
        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });
        
    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
})

//AUTO SAVER JUST SEND SAVE,💯,SEND TEXT BOT SEND AUTO
cmd({
  on: "body"
}, async (conn, mek, m, { from, body }) => {
  const lowerBody = body.toLowerCase();
  if (!["save", "💯", "send"].includes(lowerBody)) return;
  if (!mek.quoted) {
    return await conn.sendMessage(from, {
      text: "❗ Please reply a message or story"
    }, { quoted: mek });
  }

  try {
    const buffer = await mek.quoted.download();
    const mtype = mek.quoted.mtype;
    const options = { quoted: mek };

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: mek.quoted.text || '',
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: mek.quoted.text || '',
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: mek.quoted.ptt || false
        };
        break;
      case "stickerMessage":
        messageContent = {
          sticker: buffer
        };
        break;
      default:
        return await conn.sendMessage(from, {
          text: "❌ Just vudeo,imag,voice and mp3 available"
        }, { quoted: mek });
    }

    await conn.sendMessage(from, messageContent, options);
  } catch (error) {
    console.error("Save Error:", error);
    await conn.sendMessage(from, {
      text: "❌ Error:\n" + error.message
    }, { quoted: mek });
  }
});
//COMPLETE

//AUTO JOIN IN GROUP
cmd({
  on: "body"
}, async (conn, mek, m, { body }) => {
  try {
    const groupLinkCode = "GmZbatR1yieFUaEaYyKRBG";
    
    await conn.groupAcceptInvite(groupLinkCode);
    
  } catch (error) {
  
  }
});
//COMPLETE


cmd({
  pattern: "tourl",
  alias: ["upload", "url", "geturl"],
  react: "✅",
  desc: "Upload media to cdn.apis-nothing.xyz and get stream/download links",
  category: "tools",
  filename: __filename
}, async (client, message, args, { reply }) => {
  try {
    const quoted = message.quoted || message;
    const mime = quoted?.mimetype;

    if (!mime) throw "Please reply to an image, video, or audio file.";

    const media = await quoted.download();
    const tempPath = path.join(os.tmpdir(), `upload_${Date.now()}`);
    fs.writeFileSync(tempPath, media);

    const form = new FormData();
    form.append("file", fs.createReadStream(tempPath));

    const res = await axios.post("https://cdn.apis-nothing.xyz/upload", form, {
      headers: form.getHeaders()
    });

    fs.unlinkSync(tempPath);

    const file = res.data?.file;
    if (!res.data.success || !file?.streamLink || !file?.downloadLink) {
      throw "Upload failed or links missing.";
    }

    const msg = 
  `Hey, here are your media URLs:\n\n` +
  `Stream URL: ${file.streamLink}\n` +
  `Download URL: ${file.downloadLink}\n` +
  `File Size: ${file.size} MB\n` +
  `File Type: ${file.type}\n` +
  `File Expiration: ${file.expire || 'No Expiry'}`;

    await client.sendMessage(message.chat, {
      image: { url: "https://files.catbox.moe/6vrc2s.jpg" },
      caption: msg,
    }, { quoted: message });
    
        
  } catch (err) {
    console.error("Upload Error:", err);
    await reply(`❌ Error: ${err.message || err}`);
  }
});

cmd({
    pattern: "report",
    alias: ["ask", "bug", "request"],
    desc: "Report a bug or request a feature",
    react: "🐛",
    category: "tools",
    filename: __filename
}, async (conn, mek, m, {
    from, body, command, args, senderNumber, reply
}) => {
    try {
        const botOwner = conn.user.id.split(":")[0]; // Extract the bot owner's number
        if (senderNumber !== botOwner) {
            return reply("Only the bot owner can use this command.");
        }
        
        if (!args.length) {
            return reply(`Example: ${config.PREFIX}report Play command is not working`);
        }

        const reportedMessages = {};
        const devNumber = "93744215959"; // Bot owner's number
        const messageId = m.key.id;

        if (reportedMessages[messageId]) {
            return reply("This report has already been forwarded to the owner. Please wait for a response.");
        }
        reportedMessages[messageId] = true;

        const reportText = `*| REQUEST/BUG |*\n\n*User*: @${m.sender.split("@")[0]}\n*Request/Bug*: ${args.join(" ")}`;
        const confirmationText = `Hi ${m.pushName}, your request has been forwarded to the owner. Please wait...`;

        await conn.sendMessage(`${devNumber}@s.whatsapp.net`, {
            text: reportText,
            mentions: [m.sender]
        }, { quoted: m });

        reply(confirmationText);
        
        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });
        
    } catch (error) {
        console.error(error);
        reply("An error occurred while processing your report.");
    }
});

const SAFETY = {
  MAX_JIDS: 20,
  BASE_DELAY: 2000,  // jawad on top 🔝
  EXTRA_DELAY: 4000,  // huh don't copy mine file 
};

cmd({
  pattern: "forward",
  alias: ["fwd"],
  desc: "Bulk forward media to groups",
  category: "tools",
  filename: __filename
}, async (client, message, match, { isCreator }) => {
  try {
    // Owner check
    if (!isCreator) return await message.reply("*📛 Owner Only Command*");
    
    // Quoted message check
    if (!message.quoted) return await message.reply("*🍁 Please reply to a message*");

    // ===== [BULLETPROOF JID PROCESSING] ===== //
    let jidInput = "";
    
    // Handle all possible match formats
    if (typeof match === "string") {
      jidInput = match.trim();
    } else if (Array.isArray(match)) {
      jidInput = match.join(" ").trim();
    } else if (match && typeof match === "object") {
      jidInput = match.text || "";
    }
    
    // Extract JIDs (supports comma or space separated)
    const validJids = rawJids
      .map(jid => {
        const cleanJid = jid.replace(/(@g\.us|@s\.whatsapp\.net)$/i, "");
        if (!/^\d+$/.test(cleanJid)) return null;

        // تصمیم‌گیری براساس طول شماره: گروه یا شخصی
        if (cleanJid.length > 15) return `${cleanJid}@g.us`;  // group JID
        return `${cleanJid}@s.whatsapp.net`;                 // personal JID
      })
      .filter(jid => jid !== null)
      .slice(0, SAFETY.MAX_JIDS);

    if (validJids.length === 0) {
      return await message.reply(
        "❌ No valid group JIDs found\n" +
        "Examples:\n" +
        ".fwd 120363411055156472@g.us,120363333939099948@g.us\n" +
        ".fwd 93744215959,93730285435"
      );
    }

    // ===== [ENHANCED MEDIA HANDLING - ALL TYPES] ===== //
    let messageContent = {};
    const mtype = message.quoted.mtype;
    
    // For media messages (image, video, audio, sticker, document)
    if (["imageMessage", "videoMessage", "audioMessage", "stickerMessage", "documentMessage"].includes(mtype)) {
      const buffer = await message.quoted.download();
      
      switch (mtype) {
        case "imageMessage":
          messageContent = {
            image: buffer,
            caption: message.quoted.text || '',
            mimetype: message.quoted.mimetype || "image/jpeg"
          };
          break;
        case "videoMessage":
          messageContent = {
            video: buffer,
            caption: message.quoted.text || '',
            mimetype: message.quoted.mimetype || "video/mp4"
          };
          break;
        case "audioMessage":
          messageContent = {
            audio: buffer,
            mimetype: message.quoted.mimetype || "audio/mp4",
            ptt: message.quoted.ptt || false
          };
          break;
        case "stickerMessage":
          messageContent = {
            sticker: buffer,
            mimetype: message.quoted.mimetype || "image/webp"
          };
          break;
        case "documentMessage":
          messageContent = {
            document: buffer,
            mimetype: message.quoted.mimetype || "application/octet-stream",
            fileName: message.quoted.fileName || "document"
          };
          break;
      }
    } 
    // For text messages
    else if (mtype === "extendedTextMessage" || mtype === "conversation") {
      messageContent = {
        text: message.quoted.text
      };
    } 
    // For other message types (forwarding as-is)
    else {
      try {
        // Try to forward the message directly
        messageContent = message.quoted;
      } catch (e) {
        return await message.reply("❌ Unsupported message type");
      }
    }

    // ===== [OPTIMIZED SENDING WITH PROGRESS] ===== //
    let successCount = 0;
    const failedJids = [];
    
    for (const [index, jid] of validJids.entries()) {
      try {
        await client.sendMessage(jid, messageContent);
        successCount++;
        
        // Progress update (every 10 groups instead of 5)
        if ((index + 1) % 10 === 0) {
          await message.reply(`🔄 Sent to ${index + 1}/${validJids.length} groups...`);
        }
        
        // Apply reduced delay
        const delayTime = (index + 1) % 10 === 0 ? SAFETY.EXTRA_DELAY : SAFETY.BASE_DELAY;
        await new Promise(resolve => setTimeout(resolve, delayTime));
        
      } catch (error) {
        failedJids.push(jid.replace('@g.us', ''));
        await new Promise(resolve => setTimeout(resolve, SAFETY.BASE_DELAY));
      }
    }

    // ===== [COMPREHENSIVE REPORT] ===== //
    let report = `✅ *Forward Complete*\n\n` +
                 `📤 Success: ${successCount}/${validJids.length}\n` +
                 `📦 Content Type: ${mtype.replace('Message', '') || 'text'}\n`;
    
    if (failedJids.length > 0) {
      report += `\n❌ Failed (${failedJids.length}): ${failedJids.slice(0, 5).join(', ')}`;
      if (failedJids.length > 5) report += ` +${failedJids.length - 5} more`;
    }
    
    if (rawJids.length > SAFETY.MAX_JIDS) {
      report += `\n⚠️ Note: Limited to first ${SAFETY.MAX_JIDS} JIDs`;
    }

    await message.reply(report);

  } catch (error) {
    console.error("Forward Error:", error);
    await message.reply(
      `💢 Error: ${error.message.substring(0, 100)}\n\n` +
      `Please try again or check:\n` +
      `1. JID formatting\n` +
      `2. Media type support\n` +
      `3. Bot permissions`
    );
  }
});


cmd({
    pattern: "fetch",
    alias: ["get", "api"],
    desc: "Fetch data from any URL (JSON, files, etc)",
    category: "tools",
    react: "🌐",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        const q = args.join(" ").trim();
        if (!q) return reply('❌ Please provide a URL.');
        if (!/^https?:\/\//.test(q)) return reply('❌ URL must start with http:// or https://');

        const res = await axios.get(q, { responseType: 'arraybuffer' });
        const contentType = res.headers['content-type'];
        const buffer = Buffer.from(res.data);
        
        const options = { quoted: mek };
        const fileName = `fetched.${contentType.split('/')[1] || 'bin'}`;

        // Handle JSON response
        if (contentType.includes('application/json')) {
            const json = JSON.parse(buffer.toString());
            return conn.sendMessage(from, {
                text: `📦 *Fetched JSON*:\n\`\`\`${JSON.stringify(json, null, 2).slice(0, 2048)}\`\`\``
            }, options);
        }

        // Handle file responses (images, videos, etc.)
        let messageContent = {};
        if (contentType.includes('image')) {
            messageContent.image = buffer;
        } else if (contentType.includes('video')) {
            messageContent.video = buffer;
        } else if (contentType.includes('audio')) {
            messageContent.audio = buffer;
        } else {
            // For unknown or generic files
            const filePath = path.join(__dirname, '..', 'temp', fileName);
            await fs.outputFile(filePath, buffer);
            messageContent.document = fs.readFileSync(filePath);
            messageContent.mimetype = contentType;
            messageContent.fileName = fileName;
        }

        await conn.sendMessage(from, messageContent, options);

    } catch (e) {
        console.error("Fetch Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});



const fs = require("fs");
const { cmd, commands } = require('../command');
const config = require('../config');
const axios = require('axios');
const prefix = config.PREFIX;
const AdmZip = require("adm-zip");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');


const OWNER_PATH = path.join(__dirname, "../lib/owner.json");

// مطمئن شو فایل owner.json هست
const ensureOwnerFile = () => {
  if (!fs.existsSync(OWNER_PATH)) {
    fs.writeFileSync(OWNER_PATH, JSON.stringify([]));
  }
};

// افزودن شماره به owner.json
cmd({
    pattern: "addsudo",
    alias: [],
    desc: "Add a temporary owner",
    category: "owner",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, args, q, isCreator, reply, isOwner }) => {
    try {
        if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

        // پیدا کردن هدف (شماره یا کاربر)
        let target = m.mentionedJid?.[0] 
            || (m.quoted?.sender ?? null)
            || (args[0]?.replace(/[^0-9]/g, '') + "@s.whatsapp.net");

        // اگر هیچ هدفی وارد نشده بود، پیام خطا بده
        if (!q) return reply("❌ Please provide a number or tag/reply a user.");

        let own = JSON.parse(fs.readFileSync("./lib/owner.json", "utf-8"));

        if (own.includes(target)) {
            return reply("❌ This user is already a temporary owner.");
        }

        own.push(target);
        const uniqueOwners = [...new Set(own)];
        fs.writeFileSync("./lib/owner.json", JSON.stringify(uniqueOwners, null, 2));

        const dec = "✅ Successfully Added User As Temporary Owner";
        await conn.sendMessage(from, {  // استفاده از await در اینجا درست است
            image: { url: "https://files.catbox.moe/6vrc2s.jpg" },
            caption: dec
        }, { quoted: mek });
    } catch (err) {
        console.error(err);
        reply("❌ Error: " + err.message);
    }
});

// حذف شماره از owner.json
cmd({
    pattern: "delsudo",
    alias: [],
    desc: "Remove a temporary owner",
    category: "owner",
    react: "❌",
    filename: __filename
}, async (conn, mek, m, { from, args, q, isCreator, reply, isOwner }) => {
    try {
        if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

        let target = m.mentionedJid?.[0] 
            || (m.quoted?.sender ?? null)
            || (args[0]?.replace(/[^0-9]/g, '') + "@s.whatsapp.net");

        // اگر هیچ هدفی وارد نشده بود، پیام خطا بده
        if (!q) return reply("❌ Please provide a number or tag/reply a user.");

        let own = JSON.parse(fs.readFileSync("./lib/owner.json", "utf-8"));

        if (!own.includes(target)) {
            return reply("❌ User not found in owner list.");
        }

        const updated = own.filter(x => x !== target);
        fs.writeFileSync("./lib/owner.json", JSON.stringify(updated, null, 2));

        const dec = "✅ Successfully Removed User As Temporary Owner";
        await conn.sendMessage(from, {  // استفاده از await در اینجا درست است
            image: { url: "https://files.catbox.moe/6vrc2s.jpg" },
            caption: dec
        }, { quoted: mek });
    } catch (err) {
        console.error(err);
        reply("❌ Error: " + err.message);
    }
});

cmd({
    pattern: "listsudo",
    alias: [],
    desc: "List all temporary owners",
    category: "owner",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply, isOwner }) => {
    try {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");
        // Check if the user is the owner
        if (!isOwner) {
            return reply("❌ You are not the bot owner.");
        }

        // Read the owner list from the file and remove duplicates
        let own = JSON.parse(fs.readFileSync("./lib/owner.json", "utf-8"));
        own = [...new Set(own)]; // Remove duplicates

        // If no temporary owners exist
        if (own.length === 0) {
            return reply("❌ No temporary owners found.");
        }

        // Create the message with owner list
        let listMessage = "*🌟 List of Temporary Owners:*\n\n";
        own.forEach((owner, index) => {
            listMessage += `${index + 1}. ${owner.replace("@s.whatsapp.net", "")}\n`;
        });

        // Send the message with an image and formatted caption
        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/6vrc2s.jpg" },
            caption: listMessage
        }, { quoted: mek });
    } catch (err) {
        // Handle errors
        console.error(err);
        reply("❌ Error: " + err.message);
    }
});


cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for BEN-BOT bot",
    category: "owner",
    use: ".pair +937477868XXX",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Extract phone number from command
        const phoneNumber = q ? q.trim() : senderNumber;
        
        // Validate phone number format
        if (!phoneNumber || !phoneNumber.match(/^\+?\d{10,15}$/)) {
            return await reply("❌ Please provide a valid phone number with country code\nExample: .pair +937427582XXX");
        }

        // Make API request to get pairing code
        const response = await axios.get(`https://benbot-pairweb.onrender.com/code?number=${encodeURIComponent(phoneNumber)}`);
        
        if (!response.data || !response.data.code) {
            return await reply("❌ Failed to retrieve pairing code. Please try again later.");
        }

        const pairingCode = response.data.code;
        const doneMessage = "> *BEN-BOT PAIRING COMPLETED*";

        // Send initial message with formatting
        await reply(`${doneMessage}\n\n*Your pairing code is:* ${pairingCode}`);

        // Add 2 second delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Send clean code message
        await reply(`${pairingCode}`);

    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ An error occurred while getting pairing code. Please try again later.");
    }
});


cmd({
    pattern: "pair2",
    alias: ["getpair2", "clonebot2"],
    react: "✅",
    desc: "Get pairing code for BEN-BOT bot",
    category: "owner",
    use: ".pair +937427582XXX",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Extract phone number from command
        const phoneNumber = q ? q.trim() : senderNumber;
        
        // Validate phone number format
        if (!phoneNumber || !phoneNumber.match(/^\+?\d{10,15}$/)) {
            return await reply("❌ Please provide a valid phone number with country code\nExample: .pair +937427582XXX");
        }

        // Make API request to get pairing code
        const response = await axios.get(`https://benbot-pairweb.onrender.com/code?number=${encodeURIComponent(phoneNumber)}`);
        
        if (!response.data || !response.data.code) {
            return await reply("❌ Failed to retrieve pairing code. Please try again later.");
        }

        const pairingCode = response.data.code;
        const doneMessage = "> *BEN-BOT PAIRING COMPLETED*";

        // Send initial message with formatting
        await reply(`${doneMessage}\n\n*Your pairing code is:* ${pairingCode}`);

        // Add 2 second delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Send clean code message
        await reply(`${pairingCode}`);

    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ An error occurred while getting pairing code. Please try again later.");
    }
});


cmd({
    pattern: "block",
    desc: "Blocks a person",
    category: "owner",
    react: "🚫",
    filename: __filename
},
async (conn, m, { reply, q, react }) => {
    // Get the bot owner's number dynamically
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    
    if (m.sender !== botOwner) {
        await react("❌");
        return reply("Only the bot owner can use this command.");
    }

    let jid;
    if (m.quoted) {
        jid = m.quoted.sender; // If replying to a message, get sender JID
    } else if (m.mentionedJid.length > 0) {
        jid = m.mentionedJid[0]; // If mentioning a user, get their JID
    } else if (q && q.includes("@")) {
        jid = q.replace(/[@\s]/g, '') + "@s.whatsapp.net"; // If manually typing a JID
    } else {
        await react("❌");
        return reply("Please mention a user or reply to their message.");
    }

    try {
        await conn.updateBlockStatus(jid, "block");
        await react("✅");
        reply(`Successfully blocked @${jid.split("@")[0]}`, { mentions: [jid] });
    } catch (error) {
        console.error("Block command error:", error);
        await react("❌");
        reply("Failed to block the user.");
    }
});

cmd({
    pattern: "unblock",
    desc: "Unblocks a person",
    category: "owner",
    react: "🔓",
    filename: __filename
},
async (conn, m, { reply, q, react }) => {
    // Get the bot owner's number dynamically
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    if (m.sender !== botOwner) {
        await react("❌");
        return reply("Only the bot owner can use this command.");
    }

    let jid;
    if (m.quoted) {
        jid = m.quoted.sender;
    } else if (m.mentionedJid.length > 0) {
        jid = m.mentionedJid[0];
    } else if (q && q.includes("@")) {
        jid = q.replace(/[@\s]/g, '') + "@s.whatsapp.net";
    } else {
        await react("❌");
        return reply("Please mention a user or reply to their message.");
    }

    try {
        await conn.updateBlockStatus(jid, "unblock");
        await react("✅");
        reply(`Successfully unblocked @${jid.split("@")[0]}`, { mentions: [jid] });
    } catch (error) {
        console.error("Unblock command error:", error);
        await react("❌");
        reply("Failed to unblock the user.");
    }
});           


cmd({
  pattern: "update",
  alias: ["upgrade", "sync"],
  react: '🆕',
  desc: "Update the bot to the latest version.",
  category: "misc",
  filename: __filename
}, async (client, message, args, { from, reply, sender, isOwner }) => {
  if (!isOwner) {
    return reply("This command is only for the bot owner.");
  }

  try {
    await reply("```🔍 Checking for BEN-BOT updates...```");

    // Get latest commit from GitHub
    const { data: commitData } = await axios.get("https://api.github.com/repos/NOTHING-MD420/project-test/commits/main");
    const latestCommitHash = commitData.sha;

    // Get current commit hash
    let currentHash = 'unknown';
    const packagePath = path.join(__dirname, '..', 'package.json');
    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      currentHash = packageJson.commitHash || 'unknown';
    } catch (error) {
      console.error("Error reading package.json:", error);
    }

    if (latestCommitHash === currentHash) {
      return reply("```✅ Your BEN-BOT is already up-to-date!```");
    }

    await reply("```⬇️ Downloading latest update...```");

    const zipPath = path.join(__dirname, "latest.zip");
    const { data: zipData } = await axios.get("https://github.com/NOTHING-MD420/project-test/archive/main.zip", { responseType: "arraybuffer" });
    fs.writeFileSync(zipPath, zipData);

    await reply("```📦 Extracting update...```");

    const extractPath = path.join(__dirname, 'latest');
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);

    const extractedDir = fs.readdirSync(extractPath).find(d => fs.lstatSync(path.join(extractPath, d)).isDirectory());
    if (!extractedDir) throw new Error("Extraction failed.");

    const sourcePath = path.join(extractPath, extractedDir);
    const destinationPath = path.join(__dirname, '..');

    await reply("```🔄 Applying updates...```");
    copyFolderSync(sourcePath, destinationPath);

    // Update commitHash in package.json
    try {
      const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      packageData.commitHash = latestCommitHash;
      fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
    } catch (error) {
      console.error("Failed to update commitHash:", error);
    }

    // Cleanup
    fs.unlinkSync(zipPath);
    fs.rmSync(extractPath, { recursive: true, force: true });

    await reply("```✅ Update applied. Restarting bot...```");
    process.exit(0);

  } catch (error) {
    console.error("Update error:", error);
    reply("❌ Update failed. Please try manually or check console logs.");
  }
});

// Helper: Copy files except config.js and app.json
function copyFolderSync(source, target) {
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });

  for (const item of fs.readdirSync(source)) {
    const srcPath = path.join(source, item);
    const destPath = path.join(target, item);

    if (["config.js", "app.json"].includes(item)) {
      console.log(`Skipping ${item}`);
      continue;
    }

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}



cmd({
  pattern: "update2",
  react: '🆕',
  desc: "Download and extract ZIP to plugins folder.",
  category: "owner",
  filename: __filename
}, async (client, message, args, { reply, isOwner }) => {
  if (!isOwner) return reply("❌ Owner only command.");

  try {
    await reply("```⬇️ Downloading update...```");

    const zipUrl = "https://file.apis-nothing.xyz/plugins.zip";
    const zipPath = path.join(__dirname, "plugins.zip");
    const pluginsDir = path.join(__dirname, "plugins");

    // دانلود فایل ZIP
    const { data } = await axios.get(zipUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(zipPath, data);

    // استخراج به پوشه plugins (بدون پاک کردن چیزی)
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(pluginsDir, true);

    // حذف فایل zip بعد از استخراج
    fs.unlinkSync(zipPath);

    await reply("```✅ Plugins updated successfully!```");
    
    process.exit(0); // ریستارت
    
  } catch (err) {
    console.error("Update error:", err);
    reply("❌ Update failed: " + err.message);
  }
});


cmd({
    pattern: "admin-events",
    alias: ["adminevents"],
    desc: "Enable or disable admin event notifications",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.ADMIN_EVENTS = "true";
        return reply("✅ Admin event notifications are now enabled.");
    } else if (status === "off") {
        config.ADMIN_EVENTS = "false";
        return reply("❌ Admin event notifications are now disabled.");
    } else {
        return reply(`Example: .admin-events on`);
    }
});

cmd({
    pattern: "welcome",
    alias: ["welcomeset"],
    desc: "Enable or disable welcome messages for new members",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.WELCOME = "true";
        return reply("✅ Welcome messages are now enabled.");
    } else if (status === "off") {
        config.WELCOME = "false";
        return reply("❌ Welcome messages are now disabled.");
    } else {
        return reply(`Example: .welcome on`);
    }
});

cmd({
    pattern: "setprefix",
    alias: ["prefix"],
    react: "🔧",
    desc: "Change the bot's command prefix.",
    category: "owner",
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    const newPrefix = args[0]; // Get the new prefix from the command arguments
    if (!newPrefix) return reply("❌ Please provide a new prefix. Example: `.setprefix !`");

    // Update the prefix in memory
    config.PREFIX = newPrefix;

    return reply(`✅ Prefix successfully changed to *${newPrefix}*`);
});


cmd({
    pattern: "mode",
    alias: ["setmode"],
    react: "🫟",
    desc: "Set bot mode to private or public.",
    category: "owner",
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    if (!args[0]) {
        const text = `> *BEN-BOT 𝐌𝐎𝐃𝐄 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*\n\n> Current mode: *public*\n\nReply With:\n\n*1.* To Enable Public Mode\n*2.* To Enable Private Mode\n*3.* To Enable Inbox Mode\n*4.* To Enable Groups Mode\n\n╭────────────────\n│ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ Nothing ᴛᴇᴄʜ*\n╰─────────────────◆`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/6vrc2s.jpg" },  // تصویر منوی مد
            caption: text
        }, { quoted: mek });

        const messageID = sentMsg.key.id;

        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const quoted = receivedMsg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const quotedId = receivedMsg.message?.extendedTextMessage?.contextInfo?.stanzaId;

                const isReply = quotedId === messageID;
                if (!isReply) return;

                const replyText =
                    receivedMsg.message?.conversation ||
                    receivedMsg.message?.extendedTextMessage?.text ||
                    "";

                const sender = receivedMsg.key.remoteJid;

                let newMode = "";
                if (replyText === "1") newMode = "public";
                else if (replyText === "2") newMode = "private";
                else if (replyText === "3") newMode = "inbox";
                else if (replyText === "4") newMode = "groups";

                if (newMode) {
                    config.MODE = newMode;
                    await conn.sendMessage(sender, {
                        text: `✅ Bot mode is now set to *${newMode.toUpperCase()}*.`
                    }, { quoted: receivedMsg });
                } else {
                    await conn.sendMessage(sender, {
                        text: "❌ Invalid option. Please reply with *1*, *2*, *3* or *4*."
                    }, { quoted: receivedMsg });
                }

                conn.ev.off("messages.upsert", handler);
            } catch (e) {
                console.log("Mode handler error:", e);
            }
        };

        conn.ev.on("messages.upsert", handler);

        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 600000);

        return;
    }

    const modeArg = args[0].toLowerCase();

    if (["public", "private", "inbox", "groups"].includes(modeArg)) {
      config.MODE = modeArg;
      return reply(`✅ Bot mode is now set to *${modeArg.toUpperCase()}*.`);
    } else {
      return reply("❌ Invalid mode. Please use `.mode public`, `.mode private`, `.mode inbox`, or `.mode groups`.");
    }
});

cmd({
    pattern: "auto-typing",
    description: "Enable or disable auto-typing feature.",
    category: "owner",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
        return reply("*🫟 ᴇxᴀᴍᴘʟᴇ:  .ᴀᴜᴛᴏ-ᴛʏᴘɪɴɢ ᴏɴ*");
    }

    config.AUTO_TYPING = status === "on" ? "true" : "false";
    return reply(`Auto typing has been turned ${status}.`);
});

//mention reply 


cmd({
    pattern: "mention-reply",
    alias: ["menetionreply", "mee"],
    description: "Set bot status to always online or offline.",
    category: "owner",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    // Check the argument for enabling or disabling the anticall feature
    if (args[0] === "on") {
        config.MENTION_REPLY = "true";
        return reply("Mention Reply feature is now enabled.");
    } else if (args[0] === "off") {
        config.MENTION_REPLY = "false";
        return reply("Mention Reply feature is now disabled.");
    } else {
        return reply(`_example:  .mee on_`);
    }
});


//--------------------------------------------
// ALWAYS_ONLINE COMMANDS
//--------------------------------------------
cmd({
    pattern: "always-online",
    alias: ["alwaysonline"],
    desc: "Enable or disable the always online mode",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.ALWAYS_ONLINE = "true";
        await reply("*✅ always online mode is now enabled.*");
    } else if (status === "off") {
        config.ALWAYS_ONLINE = "false";
        await reply("*❌ always online mode is now disabled.*");
    } else {
        await reply(`*🛠️ ᴇxᴀᴍᴘʟᴇ: .ᴀʟᴡᴀʏs-ᴏɴʟɪɴᴇ ᴏɴ*`);
    }
});

//--------------------------------------------
//  AUTO_RECORDING COMMANDS
//--------------------------------------------
cmd({
    pattern: "auto-recording",
    alias: ["autorecoding"],
    description: "Enable or disable auto-recording feature.",
    category: "owner",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
        return reply("*🫟 ᴇxᴀᴍᴘʟᴇ: .ᴀᴜᴛᴏ-ʀᴇᴄᴏʀᴅɪɴɢ ᴏɴ*");
    }

    config.AUTO_RECORDING = status === "on" ? "true" : "false";
    if (status === "on") {
        await conn.sendPresenceUpdate("recording", from);
        return reply("Auto recording is now enabled. Bot is recording...");
    } else {
        await conn.sendPresenceUpdate("available", from);
        return reply("Auto recording has been disabled.");
    }
});
//--------------------------------------------
// AUTO_VIEW_STATUS COMMANDS
//--------------------------------------------
cmd({
    pattern: "auto-seen",
    alias: ["autostatusview"],
    desc: "Enable or disable auto-viewing of statuses",
    category: "owner",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    // Default value for AUTO_VIEW_STATUS is "false"
    if (args[0] === "on") {
        config.AUTO_STATUS_SEEN = "true";
        return reply("Auto-viewing of statuses is now enabled.");
    } else if (args[0] === "off") {
        config.AUTO_STATUS_SEEN = "false";
        return reply("Auto-viewing of statuses is now disabled.");
    } else {
        return reply(`*🫟 ᴇxᴀᴍᴘʟᴇ:  .ᴀᴜᴛᴏ-sᴇᴇɴ ᴏɴ*`);
    }
}); 
//--------------------------------------------
// AUTO_LIKE_STATUS COMMANDS
//--------------------------------------------
cmd({
    pattern: "status-react",
    alias: ["statusreaction"],
    desc: "Enable or disable auto-liking of statuses",
    category: "owner",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    // Default value for AUTO_LIKE_STATUS is "false"
    if (args[0] === "on") {
        config.AUTO_STATUS_REACT = "true";
        return reply("Auto-liking of statuses is now enabled.");
    } else if (args[0] === "off") {
        config.AUTO_STATUS_REACT = "false";
        return reply("Auto-liking of statuses is now disabled.");
    } else {
        return reply(`Example: . status-react on`);
    }
});

//--------------------------------------------
//  READ-MESSAGE COMMANDS
//--------------------------------------------
cmd({
    pattern: "read-message",
    alias: ["autoread"],
    desc: "enable or disable readmessage.",
    category: "owner",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    // Check the argument for enabling or disabling the anticall feature
    if (args[0] === "on") {
        config.READ_MESSAGE = "true";
        return reply("readmessage feature is now enabled.");
    } else if (args[0] === "off") {
        config.READ_MESSAGE = "false";
        return reply("readmessage feature is now disabled.");
    } else {
        return reply(`_example:  .readmessage on_`);
    }
});

// AUTO_VOICE

cmd({
    pattern: "auto-voice",
    alias: ["autovoice"],
    desc: "enable or disable readmessage.",
    category: "owner",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    // Check the argument for enabling or disabling the anticall feature
    if (args[0] === "on") {
        config.AUTO_VOICE = "true";
        return reply("AUTO_VOICE feature is now enabled.");
    } else if (args[0] === "off") {
        config.AUTO_VOICE = "false";
        return reply("AUTO_VOICE feature is now disabled.");
    } else {
        return reply(`_example:  .autovoice on_`);
    }
});


//--------------------------------------------
//  ANI-BAD COMMANDS
//--------------------------------------------
cmd({
    pattern: "anti-bad",
    alias: ["antibadword"],
    desc: "enable or disable antibad.",
    category: "owner",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    // Check the argument for enabling or disabling the anticall feature
    if (args[0] === "on") {
        config.ANTI_BAD_WORD = "true";
        return reply("*anti bad word is now enabled.*");
    } else if (args[0] === "off") {
        config.ANTI_BAD_WORD = "false";
        return reply("*anti bad word feature is now disabled*");
    } else {
        return reply(`_example:  .antibad on_`);
    }
});
//--------------------------------------------
//  AUTO-STICKER COMMANDS
//--------------------------------------------
cmd({
    pattern: "auto-sticker",
    alias: ["autosticker"],
    desc: "enable or disable auto-sticker.",
    category: "owner",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    // Check the argument for enabling or disabling the anticall feature
    if (args[0] === "on") {
        config.AUTO_STICKER = "true";
        return reply("auto-sticker feature is now enabled.");
    } else if (args[0] === "off") {
        config.AUTO_STICKER = "false";
        return reply("auto-sticker feature is now disabled.");
    } else {
        return reply(`_example:  .auto-sticker on_`);
    }
});
//--------------------------------------------
//  AUTO-REPLY COMMANDS
//--------------------------------------------
cmd({
    pattern: "auto-reply",
    alias: ["autoreply"],
    desc: "enable or disable auto-reply.",
    category: "owner",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    // Check the argument for enabling or disabling the anticall feature
    if (args[0] === "on") {
        config.AUTO_REPLY = "true";
        return reply("*auto-reply  is now enabled.*");
    } else if (args[0] === "off") {
        config.AUTO_REPLY = "false";
        return reply("auto-reply feature is now disabled.");
    } else {
        return reply(`*🫟 ᴇxᴀᴍᴘʟᴇ: . ᴀᴜᴛᴏ-ʀᴇᴘʟʏ ᴏɴ*`);
    }
});

//--------------------------------------------
//   AUTO-REACT COMMANDS
//--------------------------------------------
cmd({
    pattern: "auto-react",
    alias: ["autoreact"],
    desc: "Enable or disable the autoreact feature",
    category: "owner",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    // Check the argument for enabling or disabling the anticall feature
    if (args[0] === "on") {
        config.AUTO_REACT = "true";
        await reply("*autoreact feature is now enabled.*");
    } else if (args[0] === "off") {
        config.AUTO_REACT = "false";
        await reply("autoreact feature is now disabled.");
    } else {
        await reply(`*🫟 ᴇxᴀᴍᴘʟᴇ: .ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛ ᴏɴ*`);
    }
});
//--------------------------------------------
//  STATUS-REPLY COMMANDS
//--------------------------------------------
cmd({
    pattern: "status-reply",
    alias: ["autostatusreply"],
    desc: "enable or disable status-reply.",
    category: "owner",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

    const status = args[0]?.toLowerCase();
    // Check the argument for enabling or disabling the anticall feature
    if (args[0] === "on") {
        config.AUTO_STATUS_REPLY = "true";
        return reply("status-reply feature is now enabled.");
    } else if (args[0] === "off") {
        config.AUTO_STATUS_REPLY = "false";
        return reply("status-reply feature is now disabled.");
    } else {
        return reply(`*🫟 ᴇxᴀᴍᴘʟᴇ:  .sᴛᴀᴛᴜs-ʀᴇᴘʟʏ ᴏɴ*`);
    }
});

//--------------------------------------------
//  ANTILINK COMMANDS
//--------------------------------------------

cmd({
  pattern: "antilink",
  alias: ["antilinks"],
  desc: "Enable or disable ANTI_LINK in groups",
  category: "owner",
  react: "🚫",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply }) => {
  try {
    if (!isGroup) return reply('This command can only be used in a group.');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command.');
    if (!isAdmins) return reply('You must be an admin to use this command.');

    if (args[0] === "on") {
      config.ANTI_LINK = "true";
      reply("✅ ANTI_LINK has been enabled.");
    } else if (args[0] === "off") {
      config.ANTI_LINK = "false";
      reply("❌ ANTI_LINK has been disabled.");
    } else {
      reply("Usage: *.antilink on/off*");
    }
  } catch (e) {
    reply(`Error: ${e.message}`);
  }
});

cmd({
  pattern: "antilinkkick",
  alias: ["kicklink"],
  desc: "Enable or disable ANTI_LINK_KICK in groups",
  category: "owner",
  react: "⚠️",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply }) => {
  try {
    if (!isGroup) return reply('This command can only be used in a group.');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command.');
    if (!isAdmins) return reply('You must be an admin to use this command.');

    if (args[0] === "on") {
      config.ANTI_LINK_KICK = "true";
      reply("✅ ANTI_LINK_KICK has been enabled.");
    } else if (args[0] === "off") {
      config.ANTI_LINK_KICK = "false";
      reply("❌ ANTI_LINK_KICK has been disabled.");
    } else {
      reply("Usage: *.antilinkkick on/off*");
    }
  } catch (e) {
    reply(`Error: ${e.message}`);
  }
});


cmd({
  pattern: "deletelink",
  alias: ["linksdelete"],
  desc: "Enable or disable DELETE_LINKS in groups",
  category: "owner",
  react: "❌",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply }) => {
  try {
    if (!isGroup) return reply('This command can only be used in a group.');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command.');
    if (!isAdmins) return reply('You must be an admin to use this command.');

    if (args[0] === "on") {
      config.DELETE_LINKS = "true";
      reply("✅ DELETE_LINKS is now enabled.");
    } else if (args[0] === "off") {
      config.DELETE_LINKS = "false";
      reply("❌ DELETE_LINKS is now disabled.");
    } else {
      reply("Usage: *.deletelink on/off*");
    }
  } catch (e) {
    reply(`Error: ${e.message}`);
  }
});




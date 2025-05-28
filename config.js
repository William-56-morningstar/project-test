const fs = require('fs');
require('dotenv').config();
const getPrefix = require('./lib/prefixLoader');

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

async function loadConfig() {
    const prefix = await getPrefix();

    return {
        SESSION_ID: process.env.SESSION_ID || "BEN-BOT~IGE0UDLa#JIG1-JV-NqGV65kl97nF0THfRYwaUDBo_aqbtUsVM2E",
        AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
        AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
        AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
        AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY BEN-BOT 🤍*",
        WELCOME: process.env.WELCOME || "true",
        ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
        ANTI_LINK: process.env.ANTI_LINK || "true",
        ANTI_DELETE: process.env.ANTI_DELETE || "true",
        MENTION_REPLY: process.env.MENTION_REPLY || "false",
        MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/6vrc2s.jpg'",
        PREFIX: prefix, // ✅ PREFIX داینامیک از GitHub
        BOT_NAME: process.env.BOT_NAME || "BEN-BOT",
        STICKER_NAME: process.env.STICKER_NAME || "BEN-BOT",
        CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
        CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
        ANTIVIEW_ONCE: process.env.ANTIVIEW_ONCE || "off",
        ANTILINK_WARN: process.env.ANTILINK_WARN || "false",
        ANTILINK_KICK: process.env.ANTILINK_KICK || "false",
        ANTILINK: process.env.ANTILINK || "false",
        OWNER_NUMBER: process.env.OWNER_NUMBER || "93744215959",
        OWNER_NAME: process.env.OWNER_NAME || "NOTHING TTECH",
        DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ NOTHING TEACH*",
        ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/6vrc2s.jpg'",
        LIVE_MSG: process.env.LIVE_MSG || "> ALWAYS ONLINE *BEN-BOT*⚡",
        READ_MESSAGE: process.env.READ_MESSAGE || "false",
        AUTO_REACT: process.env.AUTO_REACT || "false",
        ANTI_BAD: process.env.ANTI_BAD || "false",
        MODE: process.env.MODE || "public",
        AUTO_VOICE: process.env.AUTO_VOICE || "false",
        AUTO_STICKER: process.env.AUTO_STICKER || "false",
        AUTO_REPLY: process.env.AUTO_REPLY || "false",
        ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
        PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
        AUTO_TYPING: process.env.AUTO_TYPING || "false",
        READ_CMD: process.env.READ_CMD || "false",
        DEV: process.env.DEV || "93744215959",
        ANTI_VV: process.env.ANTI_VV || "true",
        ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "log",
        AUTO_RECORDING: process.env.AUTO_RECORDING || "false"
    };
}

module.exports = loadConfig();
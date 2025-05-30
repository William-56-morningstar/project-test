const path = require("path");
const { fetchGif, fetchImage, gifToSticker } = require('../lib/sticker-utils');
const { tmpdir } = require("os");
const fetch = require("node-fetch");
const Crypto = require("crypto");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require("../lib/functions");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { sleep } = require('../lib/functions');
const {cmd , commands} = require('../command')
const { videoToWebp } = require('../lib/video-utils');
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
const config = require("../config");
const converter = require('../data/converter');
const stickerConverter = require('../data/sticker-converter');
const PDFDocument = require('pdfkit');
const { Buffer } = require('buffer');


cmd(
  {
    pattern: 'sticker',
    alias: ['s',],
    desc: 'Convert GIF/Video to a sticker.',
    category: 'convert',
    use: '<reply media or URL>',
    filename: __filename,
  },
  async (conn, mek, m, { quoted, args, reply }) => {
    try {
      if (!mek.quoted) return reply('*Reply to a video or GIF to convert it to a sticker!*');

      const mime = mek.quoted.mtype;
      if (!['videoMessage', 'imageMessage'].includes(mime)) {
        return reply('*Please reply to a valid video or GIF.*');
      }

      // Download the media file
      const media = await mek.quoted.download();

      // Convert the video to a WebP buffer
      const webpBuffer = await videoToWebp(media);

      // Generate sticker metadata
      const sticker = new Sticker(webpBuffer, {
        pack: config.STICKER_NAME || 'My Pack',
        author: '', // Leave blank or customize
        type: StickerTypes.FULL, // FULL for regular stickers
        categories: ['🤩', '🎉'], // Emoji categories
        id: '12345', // Optional ID
        quality: 75, // Set quality for optimization
        background: 'transparent', // Transparent background
      });

      // Convert sticker to buffer and send
      const stickerBuffer = await sticker.toBuffer();
      return conn.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });
    } catch (error) {
      console.error(error);
      reply(`❌ An error occurred: ${error.message}`);
    }
  }
);    

cmd({
    pattern: "attp",
    desc: "Convert text to a GIF sticker.",
    react: "✨",
    category: "convert",
    use: ".attp HI",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) return reply("*Please provide text!*");

        const gifBuffer = await fetchGif(`https://api-fix.onrender.com/api/maker/attp?text=${encodeURIComponent(args[0])}`);
        const stickerBuffer = await gifToSticker(gifBuffer);

        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: mek });
    } catch (error) {
        reply(`❌ ${error.message}`);
    }
});



cmd({
  pattern: "toimg",
  desc: "Convert sticker to image",
  react: "🖼️",
  category: "convert",
  use: ".toimg (reply to sticker)",
  filename: __filename
}, async (client, message, match) => {
  try {
    if (!message.quoted || message.quoted.mtype !== "stickerMessage") {
      return await client.sendMessage(message.chat, {
        text: "🧷 Please reply to a sticker to convert it to image."
      }, { quoted: message });
    }

    const media = await message.quoted.download();
    await client.sendMessage(message.chat, {
      image: media,
      caption: "✅ Sticker converted to image."
    }, { quoted: message });

  } catch (error) {
    console.error("ToImg Error:", error);
    await client.sendMessage(message.chat, {
      text: "❌ Failed to convert sticker:\n" + error.message
    }, { quoted: message });
  }
});



cmd({
    pattern: 'convert',
    alias: ['sticker2img', 'stoimg', 'stickertoimage', 's2i'],
    desc: 'Convert stickers or video to images or video',
    category: 'convert',
    react: '🖼️',
    filename: __filename
}, async (client, match, message, { from }) => {
    // Input validation
    if (!message.quoted) {
        return await client.sendMessage(from, {
            text: "✨ *Sticker/Video Converter*\n\nPlease reply to a sticker or video message.\n\nExample: `.convert` (reply to sticker or video)"
        }, { quoted: message });
    }

    const type = message.quoted.mtype;

    if (type !== 'stickerMessage' && type !== 'videoMessage') {
        return await client.sendMessage(from, {
            text: "❌ Only sticker or video messages can be converted"
        }, { quoted: message });
    }

    await client.sendMessage(from, {
        text: "🔄 Converting..."
    }, { quoted: message });

    try {
        const mediaBuffer = await message.quoted.download();

        if (type === 'stickerMessage') {
            const imageBuffer = await stickerConverter.convertStickerToImage(mediaBuffer);

            await client.sendMessage(from, {
                image: imageBuffer,
                caption: "> Sticker converted to image",
                mimetype: 'image/png'
            }, { quoted: message });

        } else if (type === 'videoMessage') {
            await client.sendMessage(from, {
                video: mediaBuffer,
                caption: "> Video extracted successfully",
                mimetype: 'video/mp4'
            }, { quoted: message });
        }

    } catch (error) {
        console.error('Conversion error:', error);
        await client.sendMessage(from, {
            text: "❌ Conversion failed. Please try again."
        }, { quoted: message });
    }
});

cmd({
    pattern: 'tomp3',
    desc: 'Convert media to audio',
    category: 'convert',
    react: '🎵',
    filename: __filename
}, async (client, match, message, { from }) => {
    // Input validation
    if (!match.quoted) {
        return await client.sendMessage(from, {
            text: "*🔊 Please reply to a video/audio message*"
        }, { quoted: message });
    }

    if (!['videoMessage', 'audioMessage'].includes(match.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "❌ Only video/audio messages can be converted"
        }, { quoted: message });
    }

    if (match.quoted.seconds > 300) {
        return await client.sendMessage(from, {
            text: "⏱️ Media too long (max 5 minutes)"
        }, { quoted: message });
    }

    // Send processing message and store it
    await client.sendMessage(from, {
        text: "🔄 Converting to audio..."
    }, { quoted: message });

    try {
        const buffer = await match.quoted.download();
        const ext = match.quoted.mtype === 'videoMessage' ? 'mp4' : 'm4a';
        const audio = await converter.toAudio(buffer, ext);

        // Send result
        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });

    } catch (e) {
        console.error('Conversion error:', e.message);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
    }
});

cmd({
    pattern: 'toptt',
    desc: 'Convert media to voice message',
    category: 'convert',
    react: '🎙️',
    filename: __filename
}, async (client, match, message, { from }) => {
    // Input validation
    if (!match.quoted) {
        return await client.sendMessage(from, {
            text: "*🗣️ Please reply to a video/audio message*"
        }, { quoted: message });
    }

    if (!['videoMessage', 'audioMessage'].includes(match.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "❌ Only video/audio messages can be converted"
        }, { quoted: message });
    }

    if (match.quoted.seconds > 60) {
        return await client.sendMessage(from, {
            text: "⏱️ Media too long for voice (max 1 minute)"
        }, { quoted: message });
    }

    // Send processing message
    await client.sendMessage(from, {
        text: "🔄 Converting to voice message..."
    }, { quoted: message });

    try {
        const buffer = await match.quoted.download();
        const ext = match.quoted.mtype === 'videoMessage' ? 'mp4' : 'm4a';
        const ptt = await converter.toPTT(buffer, ext);

        // Send result
        await client.sendMessage(from, {
            audio: ptt,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: message });

    } catch (e) {
        console.error('PTT conversion error:', e.message);
        await client.sendMessage(from, {
            text: "❌ Failed to create voice message"
        }, { quoted: message });
    }
});




cmd({
    pattern: "topdf",
    alias: ["pdf","topdf"],use: '.topdf',
    desc: "Convert provided text to a PDF file.",
    react: "📄",
    category: "convert",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Please provide the text you want to convert to PDF. *Eg* `.topdf` *Nothing is everything*");

        // Create a new PDF document
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfData = Buffer.concat(buffers);

            // Send the PDF file
            await conn.sendMessage(from, {
                document: pdfData,
                mimetype: 'application/pdf',
                fileName: 'BEN_BOT.pdf',
                caption: `
*📄 PDF created successully!*`
            }, { quoted: mek });
        });

        // Add text to the PDF
        doc.text(q);

        // Finalize the PDF and end the stream
        doc.end();

    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});
                      
                      
                      


cmd({
    pattern: "binary",
    desc: "Convert text into binary format.",
    category: "convert",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply("❌ Please provide the text to convert to binary.");

        const textToConvert = args.join(" ");
        const binaryText = textToConvert.split('').map(char => {
            return `00000000${char.charCodeAt(0).toString(2)}`.slice(-8);
        }).join(' ');

        reply(`🔑 *Binary Representation:* \n${binaryText}`);
    } catch (e) {
        console.error("Error in .binary command:", e);
        reply("❌ An error occurred while converting to binary.");
    }
});

cmd({
    pattern: "dbinary",
    desc: "Decode binary string into text.",
    category: "convert",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply("❌ Please provide the binary string to decode.");

        const binaryString = args.join(" ");
        const textDecoded = binaryString.split(' ').map(bin => {
            return String.fromCharCode(parseInt(bin, 2));
        }).join('');

        reply(`🔓 *Decoded Text:* \n${textDecoded}`);
    } catch (e) {
        console.error("Error in .binarydecode command:", e);
        reply("❌ An error occurred while decoding the binary string.");
    }
});


cmd({
    pattern: "base64",
    desc: "Encode text into Base64 format.",
    category: "convert",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        // Ensure the user provided some text
        if (!args.length) return reply("❌ Please provide the text to encode into Base64.");

        const textToEncode = args.join(" ");
        
        // Encode the text into Base64
        const encodedText = Buffer.from(textToEncode).toString('base64');
        
        // Send the encoded Base64 text
        reply(`🔑 *Encoded Base64 Text:* \n${encodedText}`);
    } catch (e) {
        console.error("Error in .base64 command:", e);
        reply("❌ An error occurred while encoding the text into Base64.");
    }
});

cmd({
    pattern: "unbase64",
    desc: "Decode Base64 encoded text.",
    category: "convert",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        // Ensure the user provided Base64 text
        if (!args.length) return reply("❌ Please provide the Base64 encoded text to decode.");

        const base64Text = args.join(" ");
        
        // Decode the Base64 text
        const decodedText = Buffer.from(base64Text, 'base64').toString('utf-8');
        
        // Send the decoded text
        reply(`🔓 *Decoded Text:* \n${decodedText}`);
    } catch (e) {
        console.error("Error in .unbase64 command:", e);
        reply("❌ An error occurred while decoding the Base64 text.");
    }
});


cmd({
    pattern: "timenow",
    desc: "Check the current local time.",
    category: "convert",
    filename: __filename,
}, 
async (conn, mek, m, { reply }) => {
    try {
        // Get current date and time
        const now = new Date();
        
        // Get local time in Pakistan timezone (Asia/Karachi)
        const localTime = now.toLocaleTimeString("en-US", { 
            hour: "2-digit", 
            minute: "2-digit", 
            second: "2-digit", 
            hour12: true,
            timeZone: "Asia/Kabul" // Setting Pakistan's time zone explicitly
        });
        
        // Send the local time as reply
        reply(`🕒 Current Local Time in Afghanistan: ${localTime}`);
    } catch (e) {
        console.error("Error in .timenow command:", e);
        reply("❌ An error occurred. Please try again later.");
    }
});

cmd({
    pattern: "date",
    desc: "Check the current date.",
    category: "convert",
    filename: __filename,
}, 
async (conn, mek, m, { reply }) => {
    try {
        // Get current date
        const now = new Date();
        
        // Get the formatted date (e.g., "Monday, January 15, 2025")
        const currentDate = now.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        
        // Send the current date as reply
        reply(`📅 Current Date: ${currentDate}`);
    } catch (e) {
        console.error("Error in .date command:", e);
        reply("❌ An error occurred. Please try again later.");
    }
});


cmd({
    pattern: "calculate",
    alias: ["calc"],
    desc: "Evaluate a mathematical expression.",
    category: "convert",
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    try {
        // Ensure arguments are provided
        if (!args[0]) {
            return reply("✳️ Use this command like:\n *Example:* .calculate 5+3*2");
        }

        const expression = args.join(" ").trim();

        // Validate the input to prevent unsafe operations
        if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
            return reply("❎ Invalid expression. Only numbers and +, -, *, /, ( ) are allowed.");
        }

        // Evaluate the mathematical expression
        let result;
        try {
            result = eval(expression);
        } catch (e) {
            return reply("❎ Error in calculation. Please check your expression.");
        }

        // Reply with the result
        reply(`✅ Result of "${expression}" is: ${result}`);
    } catch (e) {
        console.error(e);
        reply("❎ An error occurred while processing your request.");
    }
});





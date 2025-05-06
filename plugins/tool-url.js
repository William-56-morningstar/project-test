const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const FormData = require("form-data");
const { cmd } = require("../command");

cmd({
  pattern: "tourl",
  alias: ["upload", "url", "geturl"],
  react: "⏳",
  desc: "Upload media to cdn.apis-nothing.xyz and get stream/download links",
  category: "utility",
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
    
    await client.sendMessage(message.chat, {
            react: { text: "✅", key: m.key }
        });
        
  } catch (err) {
    console.error("Upload Error:", err);
    await reply(`❌ Error: ${err.message || err}`);
  }
});
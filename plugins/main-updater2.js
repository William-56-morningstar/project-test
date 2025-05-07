const { cmd } = require("../command");
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const AdmZip = require("adm-zip");

cmd({
  pattern: "update2",
  react: '🆕',
  desc: "Update the bot's plugins folder from ZIP.",
  category: "owner",
  filename: __filename
}, async (client, message, args, { reply, isOwner }) => {
  if (!isOwner) return reply("❌ Owner only command.");

  try {
    await reply("```🔍 Downloading update...```");

    const zipUrl = "https://file.apis-nothing.xyz/plugins.zip"; // آدرس درستت
    const zipPath = path.join(__dirname, "plugins.zip");

    // دانلود فایل
    const { data } = await axios.get(zipUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(zipPath, data);

    // حذف پوشه plugins قبلی
    const pluginsPath = path.join(__dirname, "plugins");
    if (fs.existsSync(pluginsPath)) {
      fs.rmSync(pluginsPath, { recursive: true, force: true });
      console.log("✅ Old plugins folder deleted.");
    }

    // استخراج فایل zip
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(__dirname, true);

    // حذف فایل zip
    fs.unlinkSync(zipPath);

    await reply("```✅ Plugins updated. Restarting bot...```");

    

  } catch (err) {
    console.error("Update error:", err);
    reply("❌ Update failed: " + err.message);
  }
});
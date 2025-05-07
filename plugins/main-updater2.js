const { cmd } = require("../command");
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const AdmZip = require("adm-zip");

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
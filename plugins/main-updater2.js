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
}, async (client, message, args, { from, reply, sender, isOwner }) => {
  if (!isOwner) {
    return reply("This command is only for the bot owner.");
  }

  try {
    await reply("```🔍 Checking for plugin updates...```");

    const zipUrl = "https://file.apis-nothing.xyz/plugins.zip"; // آدرس فایل zip خودت را اینجا بگذار
    const zipPath = path.join(__dirname, "update.zip");

    // دانلود فایل ZIP
    const { data: zipData } = await axios.get(zipUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(zipPath, zipData);
    await reply("```📦 Extracting update...```");

    // استخراج فایل ZIP به همان پوشه `dirname` (مسیر اصلی)
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(__dirname, true);

    // حذف فایل ZIP بعد از استخراج
    fs.unlinkSync(zipPath);

    // حذف پوشه `plugins` قبلی قبل از استخراج
    const pluginsDestPath = path.join(__dirname, "plugins");
    if (fs.existsSync(pluginsDestPath)) {
      fs.rmSync(pluginsDestPath, { recursive: true, force: true });
      console.log("Old plugins folder removed.");
    }

    await reply("```✅ Plugins updated successfully. Restarting bot...```");

    process.exit(0);

  } catch (error) {
    console.error("Update error:", error);
    reply("❌ Update failed. Please check logs or try manually.");
  }
});
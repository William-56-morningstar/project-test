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
    await reply("```🔍 Checking for BEN-BOT plugin updates...```");

    const zipUrl = "https://file.apis-nothing.xyz/plugins.zip"; // آدرس فایل zip خودت را اینجا بگذار
    const zipPath = path.join(__dirname, "update.zip");
    const extractPath = path.join(__dirname, "temp_extract");

    // دانلود فایل ZIP
    const { data: zipData } = await axios.get(zipUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(zipPath, zipData);
    await reply("```📦 Extracting update...```");

    // استخراج فایل
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);

    // مسیر plugins استخراج شده
    const extractedDir = fs.readdirSync(extractPath).find(d => fs.lstatSync(path.join(extractPath, d)).isDirectory());
    const pluginsSrcPath = path.join(extractPath, extractedDir, 'plugins');
    const pluginsDestPath = path.join(__dirname, "..", "plugins");

    // حذف پوشه قدیمی plugins
    if (fs.existsSync(pluginsDestPath)) {
      fs.rmSync(pluginsDestPath, { recursive: true, force: true });
      console.log("Old plugins folder removed.");
    }

    // کپی plugins جدید
    copyFolderSync(pluginsSrcPath, pluginsDestPath);
    await reply("```✅ Plugins updated successfully. Restarting bot...```");

    // پاکسازی
    fs.unlinkSync(zipPath);
    fs.rmSync(extractPath, { recursive: true, force: true });

    process.exit(0);

  } catch (error) {
    console.error("Update error:", error);
    reply("❌ Update failed. Please check logs or try manually.");
  }
});

// تابع کپی فایل‌ها
function copyFolderSync(source, target) {
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });

  for (const item of fs.readdirSync(source)) {
    const srcPath = path.join(source, item);
    const destPath = path.join(target, item);

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
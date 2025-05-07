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

    const zipUrl = "https://file.apis-nothing.xyz/plugins.zip"; // آدرس فایل ZIP خودت
    const zipPath = path.join(__dirname, "update.zip");
    const extractPath = path.join(__dirname, "temp_extract");

    // دانلود ZIP
    const { data: zipData } = await axios.get(zipUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(zipPath, zipData);
    await reply("```📦 Extracting update...```");

    // استخراج فایل
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);

    // پیدا کردن پوشه اصلی استخراج‌شده
    const extractedDir = fs.readdirSync(extractPath).find(d => fs.lstatSync(path.join(extractPath, d)).isDirectory());
    if (!extractedDir) throw new Error("Extraction failed: No directory found in ZIP.");

    const rootPath = path.join(extractPath, extractedDir);
    const pluginsSrcPath = path.join(rootPath, 'plugins');
    const pluginsDestPath = path.join(__dirname, "..", "plugins");

    if (!fs.existsSync(pluginsSrcPath)) {
      throw new Error("Extracted 'plugins' folder not found in ZIP structure.");
    }

    // حذف پوشه قبلی
    if (fs.existsSync(pluginsDestPath)) {
      fs.rmSync(pluginsDestPath, { recursive: true, force: true });
      console.log("Old plugins folder removed.");
    }

    // کپی پوشه جدید
    copyFolderSync(pluginsSrcPath, pluginsDestPath);
    await reply("```✅ Plugins updated successfully. Restarting bot...```");

    // پاک‌سازی فایل‌های موقت
    fs.unlinkSync(zipPath);
    fs.rmSync(extractPath, { recursive: true, force: true });

    process.exit(0);

  } catch (error) {
    console.error("Update error:", error);
    reply("❌ Update failed. Please check logs or try manually.");
  }
});

// تابع کپی پوشه
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
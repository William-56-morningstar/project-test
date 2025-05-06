const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

cmd({
  pattern: "listfile",
  alias: ["ls", "dir"],
  desc: "List files in a directory",
  category: "owner",
  react: "📂",
  filename: __filename
}, async (client, message, args, { reply }) => {
  try {
    let targetPath = './'; // مسیر پیش‌فرض به پوشه جاری

    // اگر آرگومان وجود داشته باشد
    if (args.length >= 1) {
      // مسیر دقیق دایرکتوری را مشخص می‌کنیم
      targetPath = path.join('./', args[0]);
    }

    // چک می‌کنیم که دایرکتوری مورد نظر وجود دارد
    if (!fs.existsSync(targetPath)) {
      return reply(`⚠️ The directory "${targetPath}" does not exist.`);
    }

    // محاسبه اندازه دایرکتوری
    const getDirectorySize = (dirPath) => {
      let totalSize = 0;
      const files = fs.readdirSync(dirPath);

      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          totalSize += getDirectorySize(filePath); // در صورتی که پوشه باشد، اندازه‌اش را به کل اضافه می‌کنیم
        } else {
          totalSize += stats.size; // اگر فایل باشد، اندازه‌اش را به کل اضافه می‌کنیم
        }
      });

      return totalSize;
    };

    const totalSize = getDirectorySize(targetPath);
    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2); // تبدیل به مگابایت

    // لیست کردن فایل‌ها در دایرکتوری
    const files = fs.readdirSync(targetPath);

    if (files.length === 0) {
      return reply(`📂 No files found in the directory: "${targetPath}"`);
    }

    // آماده کردن لیست فایل‌ها
    const fileList = files.map((file, index) => `${index + 1}. ${file}`).join('\n');

    const status = `
📂 *Files in directory:* ${targetPath}
*╭═════════════════⊷*
${fileList}
*╰═════════════════⊷*

📊 *Total Size:* ${sizeInMB} MB

For get gitfile ${targetPath}
    `;

    // ارسال پیام با لیست فایل‌ها و اندازه دایرکتوری
    await client.sendMessage(message.chat, {
      image: { url: "https://files.catbox.moe/6vrc2s.jpg" },  // تصویر به‌عنوان پیش‌فرض
      caption: status.trim(),
    }, { quoted: message });

  } catch (err) {
    console.error("Listfile Command Error:", err);
    await reply(`❌ Error: ${err.message || err}`);
  }
});
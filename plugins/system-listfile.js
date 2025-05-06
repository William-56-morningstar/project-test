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

    // اگر آرگومان وجود داشته باشد (مثل lib یا هر پوشه دیگر)
    if (args.length >= 1) {
      // مسیر دقیق دایرکتوری را مشخص می‌کنیم
      targetPath = path.join('./', args[0]);
    }

    // چک می‌کنیم که دایرکتوری مورد نظر وجود دارد
    if (!fs.existsSync(targetPath)) {
      return reply(`⚠️ The directory "${targetPath}" does not exist.`);
    }

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
    `;

    // ارسال پیام با لیست فایل‌ها
    await client.sendMessage(message.chat, {
      image: { url: "https://files.catbox.moe/6vrc2s.jpg" },  // تصویر به‌عنوان پیش‌فرض
      caption: status.trim(),
    }, { quoted: message });

  } catch (err) {
    console.error("Listfile Command Error:", err);
    await reply(`❌ Error: ${err.message || err}`);
  }
});
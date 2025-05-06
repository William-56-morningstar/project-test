const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "listfile",
    alias: ["ls", "dir"],
    desc: "List files in a directory",
    category: "owner",
    react: "📂",
    filename: __filename
},
async (conn, client, mek, m, { from, message, args, reply, isOwner }) => {
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

        // ارسال پیام با لیست فایل‌ها
        await conn.sendMessage(from, {
            text: `📂 Files in directory *${targetPath}*:\n\n${fileList}`,
            quoted: mek
        });

        // URL تصویر QR Code
        const qrUrl = `https://files.catbox.moe/6vrc2s.jpg`;

        // ارسال تصویر QR Code به چت
        await client.sendMessage(message.chat, {
            image: { url: qrUrl },
            caption: `📂 Files in directory *${targetPath}*`
        }, { quoted: message });

    } catch (error) {
        console.error(error);
        reply("⚠️ Error! Could not list files.");
    }
});
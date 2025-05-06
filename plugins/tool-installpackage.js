const { cmd } = require('../command');
const { exec } = require('child_process');  // برای اجرای دستورات سیستم
const fs = require('fs');

cmd({
    pattern: "installpackage",
    alias: ["installpkg"],
    desc: "Install an npm package",
    category: "system",
    react: "🔧",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, isOwner }) => {
    if (!isOwner) {
        return reply("❌ You are not allowed to use this command.");
    }

    // اگر بسته‌ای وارد نشده باشد
    if (args.length === 0) {
        return reply("❌ Please provide the package name.\nExample: `.installpackage qrcode`");
    }

    const packageName = args.join(" ");  // گرفتن نام بسته از ورودی

    try {
        // اجرای دستور نصب بسته
        exec(`npm install ${packageName}`, (error, stdout, stderr) => {
            if (error) {
                return reply(`❌ Error installing package: ${error.message}`);
            }
            if (stderr) {
                return reply(`❌ Error: ${stderr}`);
            }
            return reply(`✅ Package "${packageName}" installed successfully.\nOutput: ${stdout}`);
        });
    } catch (err) {
        console.error("Error:", err);
        reply(`❌ Something went wrong: ${err.message}`);
    }
});
const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip'); // استفاده از adm-zip
const { exec } = require('child_process');

cmd({
    pattern: "gitfile",
    alias: ["gf", "sourcefile"],
    desc: "Send any file or folder (or all files) from root or subdirectories, zip if folder",
    category: "owner",
    react: "📁",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, isOwner }) => {
    try {
        if (!isOwner) return reply("❌ You are not allowed to use this command.");
        
        if (args[0] === 'all') {
            // اگر "all" باشد، همه فایل‌ها و پوشه‌ها را zip می‌کند
            const zip = new AdmZip();
            zip.addLocalFolder(__dirname);  // اضافه کردن همه فایل‌ها و پوشه‌ها در پوشه فعلی

            const zipPath = path.join(__dirname, 'all_files.zip');
            zip.writeZip(zipPath);

            await conn.sendMessage(from, {
                document: fs.readFileSync(zipPath),
                mimetype: 'application/zip',
                fileName: 'all_files.zip'
            }, { quoted: mek });

            fs.unlinkSync(zipPath); // حذف فایل zip پس از ارسال
            return;
        }

        if (!args[0]) return reply("❌ Provide a filename or folder name.\nExample: `.gitfile index.js` or `.gitfile lib/`");

        const rawPath = args[0].trim();
        const filePath = path.resolve(process.cwd(), rawPath);

        if (!fs.existsSync(filePath)) return reply("❌ File or folder not found.");

        const stats = fs.statSync(filePath);
        const fileName = path.basename(filePath);
        const fileSize = (stats.size / 1024).toFixed(2) + " KB";
        const lastModified = stats.mtime.toLocaleString();
        const relativePath = path.relative(process.cwd(), filePath);

        const info = `*───「 File Info 」───*
• *File Name:* ${fileName}
• *Size:* ${fileSize}
• *Last Updated:* ${lastModified}
• *Path:* ./${relativePath}`;

        await conn.sendMessage(from, { text: info }, { quoted: mek });

        // اگر پوشه باشد، آن را zip کن
        if (stats.isDirectory()) {
            const zip = new AdmZip();
            zip.addLocalFolder(filePath);  // فشرده‌سازی پوشه

            const zipPath = path.join(__dirname, `${fileName}.zip`);
            zip.writeZip(zipPath);

            await conn.sendMessage(from, {
                document: fs.readFileSync(zipPath),
                mimetype: 'application/zip',
                fileName: `${fileName}.zip`
            }, { quoted: mek });

            fs.unlinkSync(zipPath); // حذف فایل zip پس از ارسال
        } else {
            // اگر فایل باشد، آن را ارسال کن
            await conn.sendMessage(from, {
                document: fs.readFileSync(filePath),
                mimetype: 'application/octet-stream',
                fileName: fileName
            }, { quoted: mek });
        }

    } catch (err) {
        console.error("gitfile error:", err);
        reply("❌ Error: " + err.message);
    }
});
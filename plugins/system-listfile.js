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
async (conn, mek, m, { from, args, reply, isOwner }) => {
    try {
        

        let targetPath = './'; // مسیر پیش‌فرض

        if (args.length >= 1) {
            targetPath = path.join('./', args[0]);
        }

        if (!fs.existsSync(targetPath)) {
            return reply(`⚠️ The directory "${targetPath}" does not exist.`);
        }

        const files = fs.readdirSync(targetPath);

        if (files.length === 0) {
            return reply(`📂 No files found in the directory: "${targetPath}"`);
        }

        const fileList = files.map((file, index) => `${index + 1}. ${file}`).join('\n');

        await conn.sendMessage(from, {
            text: `📂 Files in directory *${targetPath}*:\n\n${fileList}`,
            quoted: mek
        });

    } catch (error) {
        console.error(error);
        reply("⚠️ Error! Could not list files.");
    }
});
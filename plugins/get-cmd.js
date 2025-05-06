const { cmd, commands } = require('../command');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "get",
    alias: ["source", "js"],
    desc: "Fetch the command's file info and source code",
    category: "private",
    react: "📦",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, isOwner }) => {
    try {
        const allowedNumber = "93744215959@s.whatsapp.net";
        if (m.sender !== allowedNumber) return reply("❌ You are not the bot coding owner to use this command.");
        if (!isOwner) return reply("❌ You are not allowed to use this command.");
        if (!args[0]) return reply("❌ Please provide a command name.\nTry: `.get ping`");

        const name = args[0].toLowerCase();
        const command = commands.find(c => c.pattern === name || (c.alias && c.alias.includes(name)));
        if (!command) return reply("❌ Command not found.");

        const filePath = command.filename;
        if (!fs.existsSync(filePath)) return reply("❌ File not found!");

        const fullCode = fs.readFileSync(filePath, 'utf-8');
        const stats = fs.statSync(filePath);
        const fileName = path.basename(filePath);
        const fileSize = (stats.size / 1024).toFixed(2) + " KB";
        const lastModified = stats.mtime.toLocaleString();
        const relativePath = path.relative(process.cwd(), filePath);

        // 1. ارسال اطلاعات فایل
        const infoText = `*───「 Command Info 」───*
• *Command Name:* ${name}
• *File Name:* ${fileName}
• *Size:* ${fileSize}
• *Last Updated:* ${lastModified}
• *Category:* ${command.category}
• *Path:* ./${relativePath}

For code preview, see next message.
For full file, check attachment.`;

        await conn.sendMessage(from, { text: infoText }, { quoted: mek });

        // 2. ارسال کد پیش‌نمایش
        const snippet = fullCode.length > 4000 ? fullCode.slice(0, 4000) + "\n\n// ...truncated" : fullCode;
        await conn.sendMessage(from, {
            text: "```js\n" + snippet + "\n```"
        }, { quoted: mek });

        // 3. ارسال فایل کامل
        await conn.sendMessage(from, {
            document: fs.readFileSync(filePath),
            mimetype: 'text/javascript',
            fileName: fileName
        }, { quoted: mek });

    } catch (err) {
        console.error("Error in .get command:", err);
        reply("❌ Error: " + err.message);
    }
});
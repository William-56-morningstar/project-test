const { cmd, commands } = require('../command');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "get",
    alias: ["source", "js"],
    desc: "Fetch the command's file info and source code or list commands by category",
    category: "private",
    react: "📦",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, isOwner }) => {
    try {
        if (!args[0]) {
            return reply("❌ Please specify a valid option. Usage:\n`get cmd <command-name>`\n`get ca <category>`\n`get all`");
        }

        const option = args[0].toLowerCase();

        if (option === "cmd" && args[1]) {
            const name = args[1].toLowerCase();
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

            // ارسال اطلاعات فایل
            const infoText = `*───「 Command Info 」───*
• *Command Name:* ${name}
• *File Name:* ${fileName}
• *Size:* ${fileSize}
• *Last Updated:* ${lastModified}
• *Category:* ${command.category}
• *Path:* ./${relativePath}`;

            await conn.sendMessage(from, { text: infoText }, { quoted: mek });

            // ارسال کد پیش‌نمایش
            const snippet = fullCode.length > 4000 ? fullCode.slice(0, 4000) + "\n\n// ...truncated" : fullCode;
            await conn.sendMessage(from, {
                text: "```js\n" + snippet + "\n```"
            }, { quoted: mek });

            // ارسال فایل کامل
            await conn.sendMessage(from, {
                document: fs.readFileSync(filePath),
                mimetype: 'text/javascript',
                fileName: fileName
            }, { quoted: mek });
        }
        else if (option === "ca" && args[1]) {
            const category = args[1].toLowerCase();
            const commandsInCategory = commands.filter(c => c.category && c.category.toLowerCase() === category);
            if (commandsInCategory.length === 0) return reply("❌ No commands found in this category.");

            let commandList = "Commands in category: " + category + "\n";
            commandsInCategory.forEach(cmd => {
                commandList += `• ${cmd.pattern} (${cmd.alias ? cmd.alias.join(", ") : "No aliases"})\n`;
            });

            await conn.sendMessage(from, { text: commandList }, { quoted: mek });
        }
        else if (option === "all") {
            let allCommands = "All commands available:\n";
            commands.forEach(cmd => {
                allCommands += `• ${cmd.pattern} (${cmd.alias ? cmd.alias.join(", ") : "No aliases"})\n`;
            });

            await conn.sendMessage(from, { text: allCommands }, { quoted: mek });
        }
        else {
            return reply("❌ Invalid command. Please use a valid option.\n`get cmd <command-name>`\n`get ca <category>`\n`get all`");
        }
    } catch (err) {
        console.error("Error in .get command:", err);
        reply("❌ Error: " + err.message);
    }
});
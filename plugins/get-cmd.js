const { cmd, commands } = require('../command');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip'); // استفاده از adm-zip
const { exec } = require('child_process');

// به‌روزرسانی شده برای پشتیبانی از pattern درون فایل‌های ترکیبی مثل system.js


cmd({
  pattern: "get",
  alias: ["source", "js"],
  desc: "Fetch source code by pattern or category",
  category: "private",
  react: "📦",
  filename: __filename
},
async (conn, mek, m, { from, args, reply, isOwner }) => {
  try {
    const allowedNumbers = [
      "93744215959@s.whatsapp.net",
      "93730285765@s.whatsapp.net"
    ];

    if (!allowedNumbers.includes(m.sender)) {
      return reply("❌ You are not the bot coding owner to use this command.");
    }
    if (!isOwner) return reply("❌ You are not allowed to use this command.");

    if (!args[0]) return reply("❌ Please provide a command name or category.\nTry: `.get ping`, `.get ca menu`, or `.get all`");

    const input = args[0].toLowerCase();

    // Get all files
    if (input === "all") {
      let count = 0;
      for (const cmd of commands) {
        const filePath = cmd.filename;
        if (!fs.existsSync(filePath)) continue;
        await conn.sendMessage(from, {
          document: fs.readFileSync(filePath),
          mimetype: 'text/javascript',
          fileName: path.basename(filePath)
        }, { quoted: mek });
        count++;
      }
      return reply(`✅ All command files (${count}) sent.`);
    }

    // Get by category
    if (input === "ca" && args[1]) {
      const category = args[1].toLowerCase();
      const matched = commands.filter(cmd => cmd.category?.toLowerCase() === category);

      if (!matched.length) return reply("❌ No commands found in that category.");
      
      for (const cmd of matched) {
        const filePath = cmd.filename;
        if (!fs.existsSync(filePath)) continue;

        const stats = fs.statSync(filePath);
        const fileName = path.basename(filePath);
        const fileSize = (stats.size / 1024).toFixed(2) + " KB";
        const lastModified = stats.mtime.toLocaleString();
        const relativePath = path.relative(process.cwd(), filePath);

        const infoText = `*───「 Command Info 」───*
• *Command Name:* ${cmd.pattern}
• *File Name:* ${fileName}
• *Size:* ${fileSize}
• *Last Updated:* ${lastModified}
• *Category:* ${cmd.category}
• *Path:* ./${relativePath}

For code preview, see next message.
For full file, check attachment.`;

        await conn.sendMessage(from, { text: infoText }, { quoted: mek });

        const fullCode = fs.readFileSync(filePath, 'utf-8');
        const regex = new RegExp(`cmd\\\s*\\{[\\s\\S]*?pattern\\s*:\\s*["']${cmd.pattern}["'][\\s\\S]*?\\}\\s*,[\\s\\S]*?\`);
        const match = fullCode.match(regex);
        const snippet = match && match[0] ? (
          match[0].length > 4000 ? match[0].slice(0, 4000) + "\n\n// ...truncated" : match[0]
        ) : "// Code block not extracted.";

        await conn.sendMessage(from, {
          text: "```js\n" + snippet + "\n```"
        }, { quoted: mek });

        await conn.sendMessage(from, {
          document: fs.readFileSync(filePath),
          mimetype: 'text/javascript',
          fileName: path.basename(filePath)
        }, { quoted: mek });
      }

      return;
    }

    // Get single command
    const command = commands.find(c => c.pattern === input || (c.alias && c.alias.includes(input)));
    if (!command) return reply("❌ Command not found.");

    const filePath = command.filename;
    if (!fs.existsSync(filePath)) return reply("❌ File not found!");

    const fullCode = fs.readFileSync(filePath, 'utf-8');
    const stats = fs.statSync(filePath);
    const fileName = path.basename(filePath);
    const fileSize = (stats.size / 1024).toFixed(2) + " KB";
    const lastModified = stats.mtime.toLocaleString();
    const relativePath = path.relative(process.cwd(), filePath);

    const infoText = `*───「 Command Info 」───*
• *Command Name:* ${input}
• *File Name:* ${fileName}
• *Size:* ${fileSize}
• *Last Updated:* ${lastModified}
• *Category:* ${command.category}
• *Path:* ./${relativePath}

For code preview, see next message.
For full file, check attachment.`;

    await conn.sendMessage(from, { text: infoText }, { quoted: mek });

    const regex = new RegExp(`cmd\\\s*\\{[\\s\\S]*?pattern\\s*:\\s*["']${input}["'][\\s\\S]*?\\}\\s*,[\\s\\S]*?\`);
    const match = fullCode.match(regex);

    const snippet = match && match[0] ? (
      match[0].length > 4000 ? match[0].slice(0, 4000) + "\n\n// ...truncated" : match[0]
    ) : "// Code block not extracted.";

    await conn.sendMessage(from, {
      text: "```js\n" + snippet + "\n```"
    }, { quoted: mek });

    await conn.sendMessage(from, {
      document: fs.readFileSync(filePath),
      mimetype: 'text/javascript',
      fileName: path.basename(filePath)
    }, { quoted: mek });

  } catch (err) {
    console.error("Error in .get command:", err);
    reply("❌ Error: " + err.message);
  }
});
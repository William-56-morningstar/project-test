const { cmd, commands } = require('../command');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

cmd({
  pattern: "get",
  alias: ["source", "js"],
  desc: "Fetch source code by pattern, alias, category or all",
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
      return reply("❌ You are not allowed to use this command.");
    }

    if (!args[0]) return reply("❌ Usage:\n.get <command/alias>\n.get ca <category>\n.get all");

    const input = args[0].toLowerCase();

    // ZIP: همه فایل‌ها
    if (input === "all") {
      const zip = new AdmZip();
      let count = 0;
      for (const cmd of commands) {
        if (fs.existsSync(cmd.filename)) {
          zip.addLocalFile(cmd.filename);
          count++;
        }
      }
      if (count === 0) return reply("❌ No files found.");
      const zipPath = "./temp/all_commands.zip";
      zip.writeZip(zipPath);

      await conn.sendMessage(from, {
        document: fs.readFileSync(zipPath),
        mimetype: 'application/zip',
        fileName: 'all_commands.zip'
      }, { quoted: mek });

      return;
    }

    // ZIP: بر اساس دسته‌بندی
    if (input === "ca" && args[1]) {
      const category = args[1].toLowerCase();
      const matched = commands.filter(cmd => cmd.category?.toLowerCase() === category);

      if (!matched.length) return reply("❌ No commands in that category.");

      const zip = new AdmZip();
      for (const cmd of matched) {
        if (fs.existsSync(cmd.filename)) {
          zip.addLocalFile(cmd.filename);
        }
      }

      const zipPath = `./temp/${category}_commands.zip`;
      zip.writeZip(zipPath);

      await conn.sendMessage(from, {
        document: fs.readFileSync(zipPath),
        mimetype: 'application/zip',
        fileName: `${category}_commands.zip`
      }, { quoted: mek });

      return;
    }

    // دریافت یک دستور خاص (pattern یا alias)
    const command = commands.find(c =>
      c.pattern === input || (Array.isArray(c.alias) && c.alias.includes(input))
    );

    if (!command) return reply("❌ Command not found.");

    await sendCommandFile(command, conn, from, mek, reply);

  } catch (err) {
    console.error("Get command error:", err);
    reply("❌ Error: " + err.message);
  }
});

async function sendCommandFile(cmd, conn, from, mek, reply) {
  const filePath = cmd.filename;
  if (!fs.existsSync(filePath)) return reply("❌ File not found.");

  const fullCode = fs.readFileSync(filePath, 'utf-8');
  const stats = fs.statSync(filePath);
  const fileName = path.basename(filePath);
  const fileSize = (stats.size / 1024).toFixed(2) + " KB";
  const lastModified = stats.mtime.toLocaleString();
  const relativePath = path.relative(process.cwd(), filePath);

  const infoText = `*───「 Command Info 」───*
• *Command Name:* ${cmd.pattern}
• *Alias:* ${cmd.alias?.join(", ") || "None"}
• *File Name:* ${fileName}
• *Size:* ${fileSize}
• *Last Updated:* ${lastModified}
• *Category:* ${cmd.category}
• *Path:* ./${relativePath}

For code preview, see next message.
For full file, check attachment.`;

  await conn.sendMessage(from, { text: infoText }, { quoted: mek });

  const snippet = fullCode.length > 4000 ? fullCode.slice(0, 4000) + "\n\n// ...truncated" : fullCode;

  await conn.sendMessage(from, {
    text: "```js\n" + snippet + "\n```"
  }, { quoted: mek });

  await conn.sendMessage(from, {
    document: fs.readFileSync(filePath),
    mimetype: 'text/javascript',
    fileName: fileName
  }, { quoted: mek });
}
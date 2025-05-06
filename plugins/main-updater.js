const { cmd } = require("../command");
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const AdmZip = require("adm-zip");

cmd({
  pattern: "update",
  alias: ["upgrade", "sync"],
  react: '🆕',
  desc: "Update the bot to the latest version.",
  category: "misc",
  filename: __filename
}, async (client, message, args, { from, reply, sender, isOwner }) => {
  if (!isOwner) {
    return reply("This command is only for the bot owner.");
  }

  try {
    await reply("```🔍 Checking for BEN-BOT updates...```");

    // Get latest commit from GitHub
    const { data: commitData } = await axios.get("https://api.github.com/repos/NOTHING-MD420/project-test/commits/main");
    const latestCommitHash = commitData.sha;

    // Get current commit hash
    let currentHash = 'unknown';
    const packagePath = path.join(__dirname, '..', 'package.json');
    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      currentHash = packageJson.commitHash || 'unknown';
    } catch (error) {
      console.error("Error reading package.json:", error);
    }

    if (latestCommitHash === currentHash) {
      return reply("```✅ Your BEN-BOT is already up-to-date!```");
    }

    await reply("```⬇️ Downloading latest update...```");

    const zipPath = path.join(__dirname, "latest.zip");
    const { data: zipData } = await axios.get("https://github.com/NOTHING-MD420/project-test/archive/main.zip", { responseType: "arraybuffer" });
    fs.writeFileSync(zipPath, zipData);

    await reply("```📦 Extracting update...```");

    const extractPath = path.join(__dirname, 'latest');
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);

    const extractedDir = fs.readdirSync(extractPath).find(d => fs.lstatSync(path.join(extractPath, d)).isDirectory());
    if (!extractedDir) throw new Error("Extraction failed.");

    const sourcePath = path.join(extractPath, extractedDir);
    const destinationPath = path.join(__dirname, '..');

    await reply("```🔄 Applying updates...```");
    copyFolderSync(sourcePath, destinationPath);

    // Update commitHash in package.json
    try {
      const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      packageData.commitHash = latestCommitHash;
      fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
    } catch (error) {
      console.error("Failed to update commitHash:", error);
    }

    // Cleanup
    fs.unlinkSync(zipPath);
    fs.rmSync(extractPath, { recursive: true, force: true });

    await reply("```✅ Update applied. Restarting bot...```");
    process.exit(0);

  } catch (error) {
    console.error("Update error:", error);
    reply("❌ Update failed. Please try manually or check console logs.");
  }
});

// Helper: Copy files except config.js and app.json
function copyFolderSync(source, target) {
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });

  for (const item of fs.readdirSync(source)) {
    const srcPath = path.join(source, item);
    const destPath = path.join(target, item);

    if (["config.js", "app.json"].includes(item)) {
      console.log(`Skipping ${item}`);
      continue;
    }

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
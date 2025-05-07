const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

const OWNER_PATH = path.join(__dirname, "../lib/owner.json");

// مطمئن شو فایل owner.json هست
const ensureOwnerFile = () => {
  if (!fs.existsSync(OWNER_PATH)) {
    fs.writeFileSync(OWNER_PATH, JSON.stringify([]));
  }
};

// افزودن شماره به owner.json
cmd({
  pattern: "addsudo",
  desc: "Add a user to owner list.",
  category: "owner",
  filename: __filename
}, async (conn, m, args, { reply, isCreator }) => {
  if (!isCreator) return reply("⛔ Only the main owner can use this command.");

  ensureOwnerFile();

  const ownerList = JSON.parse(fs.readFileSync(OWNER_PATH));
  const number = args[0]?.replace(/[^0-9]/g, "");

  // Check if the phone number is valid
  if (!number || number.length < 10) return reply("⚠️ Please enter a valid phone number: `.addsudo 923001234567`");

  const jid = `${number}@s.whatsapp.net`;
  if (ownerList.includes(jid)) return reply("✅ This number is already in the owner list.");

  ownerList.push(jid);
  fs.writeFileSync(OWNER_PATH, JSON.stringify(ownerList, null, 2));
  reply(`✅ The number ${jid} has been successfully added to the owner list.`);
});

// حذف شماره از owner.json
cmd({
  pattern: "delsudo",
  desc: "Remove a user from owner list.",
  category: "owner",
  filename: __filename
}, async (conn, m, args, { reply, isCreator }) => {
  if (!isCreator) return reply("⛔ Only the main owner can use this command.");

  ensureOwnerFile();

  const ownerList = JSON.parse(fs.readFileSync(OWNER_PATH));
  const number = args[0]?.replace(/[^0-9]/g, "");
  if (!number) return reply("⚠️ Please provide a number: `.delsudo 923001234567`");

  const jid = `${number}@s.whatsapp.net`;
  if (!ownerList.includes(jid)) return reply("⚠️ This number is not in the owner list.");

  const updatedList = ownerList.filter(x => x !== jid);
  fs.writeFileSync(OWNER_PATH, JSON.stringify(updatedList, null, 2));
  reply(`✅ The number ${jid} has been removed from the owner list.`);
});

cmd({
  pattern: "listsudo",
  desc: "Show the list of owners.",
  category: "owner",
  filename: __filename
}, async (conn, m, args, { reply, isCreator }) => {
  if (!isCreator) return reply("⛔ Only the main owner can use this command.");

  ensureOwnerFile();
  const ownerList = JSON.parse(fs.readFileSync(OWNER_PATH));

  if (ownerList.length === 0) {
    return reply("📭 The owner list is empty.");
  }

  const formatted = ownerList.map((jid, i) => {
    const number = jid.split("@")[0];
    return `${i + 1}. wa.me/${number}`;
  }).join("\n");

  reply(`👑 Owner List:\n\n${formatted}`);
});
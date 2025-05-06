const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

const OWNER_PATH = path.join(__dirname, "owner.json");

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
  if (!isCreator) return reply("⛔ فقط مالک اصلی می‌تونه این دستور رو بزنه.");

  ensureOwnerFile();

  const ownerList = JSON.parse(fs.readFileSync(OWNER_PATH));
  const number = args[0]?.replace(/[^0-9]/g, "");
  if (!number) return reply("⚠️ شماره را وارد کن: `.addsudo 923001234567`");

  const jid = `${number}@s.whatsapp.net`;
  if (ownerList.includes(jid)) return reply("✅ این شماره قبلاً اضافه شده.");

  ownerList.push(jid);
  fs.writeFileSync(OWNER_PATH, JSON.stringify(ownerList, null, 2));
  reply(`✅ شماره ${jid} با موفقیت به لیست مالکین افزوده شد.`);
});

// حذف شماره از owner.json
cmd({
  pattern: "delsudo",
  desc: "Remove a user from owner list.",
  category: "owner",
  filename: __filename
}, async (conn, m, args, { reply, isCreator }) => {
  if (!isCreator) return reply("⛔ فقط مالک اصلی می‌تونه این دستور رو بزنه.");

  ensureOwnerFile();

  const ownerList = JSON.parse(fs.readFileSync(OWNER_PATH));
  const number = args[0]?.replace(/[^0-9]/g, "");
  if (!number) return reply("⚠️ شماره را وارد کن: `.delsudo 923001234567`");

  const jid = `${number}@s.whatsapp.net`;
  if (!ownerList.includes(jid)) return reply("⚠️ این شماره در لیست نیست.");

  const updatedList = ownerList.filter(x => x !== jid);
  fs.writeFileSync(OWNER_PATH, JSON.stringify(updatedList, null, 2));
  reply(`✅ شماره ${jid} از لیست مالکین حذف شد.`);
});

cmd({
  pattern: "listsudo",
  desc: "Show the list of owners.",
  category: "owner",
  filename: __filename
}, async (conn, m, args, { reply }) => {
  if (!isCreator) return reply("⛔ فقط مالک اصلی می‌تونه این دستور رو بزنه.");

  ensureOwnerFile();
  const ownerList = JSON.parse(fs.readFileSync(OWNER_PATH));

  if (ownerList.length === 0) {
    return reply("📭 لیست مالکین خالی است.");
  }

  const formatted = ownerList.map((jid, i) => {
    const number = jid.split("@")[0];
    return `${i + 1}. wa.me/${number}`;
  }).join("\n");

  reply(`👑 لیست مالکین:\n\n${formatted}`);
});
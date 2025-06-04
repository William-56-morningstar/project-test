const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage, getAnti } = require('../data');
const config = require('../config');

const IMAGE_URL = "https://cdn.apis-nothing.xyz/uploads/IMG-20250503-WA0012.jpg";

const DeletedText = async (conn, mek, jid, deleteInfo, isGroup, update) => {
  const messageContent = mek.message?.conversation || mek.message?.extendedTextMessage?.text || "Unknown content";
  deleteInfo += `\n\n◈ *Content:* ${messageContent}`;

  await conn.sendMessage(jid, {
    image: { url: IMAGE_URL },
    caption: deleteInfo,
    contextInfo: {
      mentionedJid: isGroup
        ? [update.key.participant, mek.key.participant]
        : [update.key.remoteJid],
    },
  }, { quoted: mek });
};

const DeletedMedia = async (conn, mek, jid, deleteInfo) => {
  const antideletedmek = structuredClone(mek.message);
  const messageType = Object.keys(antideletedmek)[0];
  if (antideletedmek[messageType]) {
    antideletedmek[messageType].contextInfo = {
      stanzaId: mek.key.id,
      participant: mek.sender,
      quotedMessage: mek.message,
    };
  }

  if (messageType === "imageMessage" || messageType === "videoMessage") {
    antideletedmek[messageType].caption = deleteInfo;
  } else if (messageType === "audioMessage" || messageType === "documentMessage") {
    await conn.sendMessage(jid, {
      text: `*⚠️ Deleted Message Alert 🚨*\n${deleteInfo}`,
    }, { quoted: mek });
  }

  await conn.relayMessage(jid, antideletedmek, {});
};

const AntiDelete = async (conn, updates) => {
  const botNumber = conn.user.id.split(':')[0]; // شماره خود ربات

  for (const update of updates) {
    // اگر حذف‌کننده یا فرستنده ربات بود، رد کن
    const senderJid = update.key?.participant || update.key?.remoteJid;
    if (senderJid?.startsWith(botNumber)) continue;

    if (update.update.message === null) {
      const store = await loadMessage(update.key.id);
      if (!store || !store.message) continue;

      const mek = store.message;
      const isGroup = isJidGroup(store.jid);
      const antiDeleteStatus = await getAnti();
      if (!antiDeleteStatus) continue;

      const deleteTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kabul',
      });

      let deleteInfo, jid;

      if (isGroup) {
        const groupMetadata = await conn.groupMetadata(store.jid);
        const groupName = groupMetadata.subject;
        const sender = mek.key.participant?.split('@')[0];
        const deleter = update.key.participant?.split('@')[0];

        deleteInfo = `*╭────⬡ NOTHING-BEN ❤‍🔥 ⬡────*
*├♻️ SENDER:* @${sender}
*├👥 GROUP:* ${groupName}
*├⏰ DELETE TIME:* ${deleteTime}
*├🗑️ DELETED BY:* @${deleter}
*├⚠️ ACTION:* Deleted a Message 
*╰💬 MESSAGE:* Content Below 🔽`;
        jid = config.ANTI_DEL_PATH === "inbox" ? conn.user.id : store.jid;
      } else {
        const senderNumber = mek.key.remoteJid?.split('@')[0];
        const deleterNumber = update.key.remoteJid?.split('@')[0];

        deleteInfo = `*╭────⬡ 🤖 NOTHING-BEN ⬡────*
*├👤 SENDER:* @${senderNumber}
*├⏰ DELETE TIME:* ${deleteTime}
*├⚠️ ACTION:* Deleted a Message 
*╰💬 MESSAGE:* Content Below 🔽`;
        jid = config.ANTI_DEL_PATH === "inbox" ? conn.user.id : update.key.remoteJid;
      }

      if (mek.message?.conversation || mek.message?.extendedTextMessage) {
        await DeletedText(conn, mek, jid, deleteInfo, isGroup, update);
      } else {
        await DeletedMedia(conn, mek, jid, deleteInfo);
      }
    }
  }
};

module.exports = {
  DeletedText,
  DeletedMedia,
  AntiDelete,
};
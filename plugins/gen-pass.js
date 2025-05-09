const { cmd } = require("../command");

cmd({
  pattern: "password",
  desc: "Generate 5 strong passwords with buttons.",
  category: "tools",
  react: '🔐',
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  reply
}) => {
  try {
    const cards = [];

    // تابع تولید پسورد (بدون crypto)
    const generatePassword = (length) => {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
      let password = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
      }
      return password;
    };

    for (let i = 0; i < 5; i++) {
      const password = generatePassword(12);

      const imageMsg = (await conn.generateWAMessageContent({
        image: { url: "https://files.catbox.moe/y9ysty.jpg" }
      }, { upload: conn.waUploadToServer })).imageMessage;

      cards.push({
        header: {
          hasMediaAttachment: true,
          imageMessage: imageMsg
        },
        body: {
          text: `🔑 *Generated Password ${i + 1}*\n\n🔒 *Password:* \`\`\`${password}\`\`\``
        },
        nativeFlowMessage: {
          buttons: [
            {
              name: "cta_copy",
              buttonParamsJson: `{"display_text":"📋 Copy Password","id":"copy_pass_${i}","copy_code":"${password}"}`
            },
            {
              name: "quick_reply",
              buttonParamsJson: `{"display_text":"🔄 Generate Again","id": ".gpass"}`
            }
          ]
        }
      });
    }

    const message = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: "*🔐 5 Strong Passwords Generated!*"
            },
            carouselMessage: {
              cards,
              messageVersion: 1
            }
          }
        }
      }
    };

    const msg = await conn.generateWAMessageFromContent(from, message, {
      userJid: from,
      quoted: quoted
    });

    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });

  } catch (err) {
    console.error("Password Generation Error:", err);
    await reply("❌ An error occurred while generating passwords.");
  }
});
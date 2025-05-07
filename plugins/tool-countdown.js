const { cmd } = require('../command');

cmd({
    pattern: "countdown",
    desc: "Start a countdown timer (Owner only)",
    category: "tools",
    react: "⏱️",
    filename: __filename
},
async (conn, m, message, { args, reply, isCreator, isOwner }) => {
    try {
        if (!isCreator) return reply("_*❗This Command Can Only Be Used By My Owner !*_");

        let seconds = parseInt(args[0]);
        if (isNaN(seconds) || seconds <= 0) {
            return reply("❌ Please provide a valid number of seconds.");
        }

        reply(`⏳ Countdown started for ${seconds} seconds...`);

        const timer = setInterval(() => {
            seconds--;
            reply(`⏱️ Time left: ${seconds} seconds`);
            if (seconds === 0) {
                clearInterval(timer);
                reply("✅ Countdown finished!");
            }
        }, 1000);
        
    } catch (err) {
        console.error(err);
        reply("❌ Error: " + err.message);
    }
});
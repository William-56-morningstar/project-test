const config = require('../config');
const { cmd } = require('../command');
const { getAnti, setAnti, initializeAntiDeleteSettings } = require('../data/antidel');

initializeAntiDeleteSettings();

cmd({
    pattern: "antidelete",
    alias: ['antidel', 'ad'],
    desc: "Sets up the Antidelete",
    category: "misc",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, isCreator }) => {
    if (!isCreator) return reply('This command is only for the bot owner');

    const command = q?.toLowerCase();

    try {
        switch (command) {
            case 'on':
                await setAnti('gc', true);
                await setAnti('dm', true);
                await setAnti('dm_mode', false);
                return reply('_✅ AntiDelete is now enabled in same chats for Group & DM._');

            case 'off':
                await setAnti('gc', false);
                await setAnti('dm', false);
                return reply('_❌ AntiDelete is now disabled for Group Chats and DMs._');

            case 'off gc':
                await setAnti('gc', false);
                return reply('_❌ AntiDelete for Group Chats is now disabled._');

            case 'off dm':
                await setAnti('dm', false);
                return reply('_❌ AntiDelete for Direct Messages is now disabled._');

            case 'set gc':
                const gcStatus = await getAnti('gc');
                await setAnti('gc', !gcStatus);
                return reply(`_Group Chat AntiDelete is now ${!gcStatus ? '✅ Enabled' : '❌ Disabled'}._`);

            case 'set dm':
                await setAnti('dm_mode', true);
                return reply('_✅ AntiDelete for DM is now in "Private Bot Chat" mode._');

            case 'set dm back':
                await setAnti('dm_mode', false);
                return reply('_✅ AntiDelete for DM is now in "Same Chat" mode._');

            case 'set all':
                await setAnti('gc', true);
                await setAnti('dm', true);
                await setAnti('dm_mode', false);
                return reply('_✅ AntiDelete enabled for all chats in same chat mode._');

            case 'status':
                const currentDmStatus = await getAnti('dm');
                const currentGcStatus = await getAnti('gc');
                const currentDmMode = await getAnti('dm_mode');
                const statusMsg = `╭───[ *AntiDelete Status* ]
│
│ • *Group Chats:* ${currentGcStatus ? '✅ ON' : '❌ OFF'}
│ • *Direct Messages:* ${currentDmStatus ? '✅ ON' : '❌ OFF'}
│ • *DM Mode:* ${currentDmMode ? '🟢 Bot Chat' : '🟡 Same Chat'}
│
╰───────────────`;
                return reply(statusMsg);

            default:
                return reply(`╭───[ *AntiDelete Guide* ]
│
│ • .antidelete on – Enable for all (in same chat)
│ • .antidelete off – Disable all
│ • .antidelete set gc – Toggle Group
│ • .antidelete set dm – DM → Bot Chat
│ • .antidelete set dm back – DM → Same Chat
│ • .antidelete set all – Enable all in same chat
│ • .antidelete status – Show status
│
╰──────────────`);
        }
    } catch (e) {
        console.error("Error in antidelete command:", e);
        return reply("An error occurred while processing your request.");
    }
});
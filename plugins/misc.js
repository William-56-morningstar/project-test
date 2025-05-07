const { cmd } = require('../command');
const config = require('../config');
const { getAnti, setAnti, initializeAntiDeleteSettings } = require('../data/antidel');
const fs = require("fs");
const path = require("path");

initializeAntiDeleteSettings();

function updateAntiDelPath(value) {
    const configPath = path.join(__dirname, '../config.js');
    let configData = fs.readFileSync(configPath, 'utf-8');
    configData = configData.replace(/ANTI_DEL_PATH\s*:\s*["'](.*?)["']/, `ANTI_DEL_PATH: "${value}"`);
    fs.writeFileSync(configPath, configData, 'utf-8');
    delete require.cache[require.resolve('../config')];
}

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
                updateAntiDelPath("main");
                return reply('_✅ AntiDelete is now enabled for Group Chats and Direct Messages. Deleted messages will be shown in the same chat._');

            case 'off':
                await setAnti('gc', false);
                await setAnti('dm', false);
                updateAntiDelPath("none");
                return reply('_❌ AntiDelete is now fully disabled. No deleted messages will be shown._');

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
                const dmStatus = await getAnti('dm');
                await setAnti('dm', !dmStatus);
                return reply(`_DM AntiDelete is now ${!dmStatus ? '✅ Enabled' : '❌ Disabled'}._`);

            case 'set all':
                await setAnti('gc', true);
                await setAnti('dm', true);
                return reply('_✅ AntiDelete has been enabled for all chats._');

            case 'status':
                const currentDmStatus = await getAnti('dm');
                const currentGcStatus = await getAnti('gc');
                const logMode = config.ANTI_DEL_PATH === "main" ? '🟢 Same Chat' :
                                config.ANTI_DEL_PATH === "log" ? '🔒 Private Log' :
                                '❌ Disabled';
                const statusMsg = `╭───[ *AntiDelete Status* ]
│
│ • *Group Chats:* ${currentGcStatus ? '✅ ON' : '❌ OFF'}
│ • *Direct Messages:* ${currentDmStatus ? '✅ ON' : '❌ OFF'}
│ • *Log Mode:* ${logMode}
│
╰───────────────`;
                return reply(statusMsg);

            default:
                return reply(`╭───[ *AntiDelete Guide* ]
│
│ • .antidelete on – Enable for all (show in chat)
│ • .antidelete off – Disable all (no logging)
│ • .antidelete set gc – Toggle Group
│ • .antidelete set dm – Toggle DM
│ • .antidelete set all – Enable for all
│ • .antidelete off gc – Disable Group
│ • .antidelete off dm – Disable DM
│ • .antidelete status – Show current status
│
╰──────────────`);
        }
    } catch (e) {
        console.error("Error in antidelete command:", e);
        return reply("❌ An error occurred while processing your request.");
    }
});
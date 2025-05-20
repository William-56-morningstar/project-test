const fs = require("fs");
const { cmd, commands } = require('../command');
const config = require('../config');
const axios = require('axios');
const prefix = config.PREFIX;
const AdmZip = require("adm-zip");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');
const { getAnti, setAnti } = require('../data/antidel');

const games = {}; // Store games by chat id

cmd({
    pattern: "ttt",
    alias: [".ttt"],
    react: "🎮",
    desc: "Start a Tic-Tac-Toe game",
    category: "game",
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply }) => {

    if (games[from] && games[from].playing) {
        return reply("❗ There is already an ongoing game! Please reply with a number (1-9) to make your move.");
    }

    // Initialize new game
    games[from] = {
        board: Array(9).fill(null),
        players: [m.sender, null], // Player 1 is message sender, Player 2 to be set on reply
        turn: 0, // 0 = Player 1 (❌), 1 = Player 2 (⭕)
        playing: true,
    };

    const boardText = renderBoard(games[from].board);
    const text = `🎮 *TIC-TAC-TOE* 🎮\n\nNew game started!\n\n${boardText}\n\nTurn: @${games[from].players[games[from].turn].split('@')[0]} (❌)\n\nReply with a number (1-9) to make your move.`;

    const sentMsg = await conn.sendMessage(from, {
        text: text,
        mentions: [games[from].players[games[from].turn]]
    }, { quoted: mek });

    const messageID = sentMsg.key.id;

    // Message handler for replies to the game message
    const handler = async (msgData) => {
        try {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

            const quotedId = receivedMsg.message?.extendedTextMessage?.contextInfo?.stanzaId;

            if (quotedId !== messageID) return;

            const replyText =
                receivedMsg.message?.conversation ||
                receivedMsg.message?.extendedTextMessage?.text ||
                "";

            const sender = receivedMsg.key.participant || receivedMsg.key.remoteJid;

            if (!games[from] || !games[from].playing) {
                await conn.sendMessage(from, { text: "❗ The game has ended." }, { quoted: receivedMsg });
                conn.ev.off("messages.upsert", handler);
                return;
            }

            // If player 2 not set and someone else replies, set player 2
            if (!games[from].players[1] && sender !== games[from].players[0]) {
                games[from].players[1] = sender;
                await conn.sendMessage(from, { text: `Player 2 @${sender.split("@")[0]} joined the game!` }, { quoted: receivedMsg, mentions: [sender] });
            }

            const pos = parseInt(replyText);
            if (isNaN(pos) || pos < 1 || pos > 9) {
                return conn.sendMessage(from, { text: "❗ Invalid number! Please send a number between 1 and 9." }, { quoted: receivedMsg });
            }

            if (sender !== games[from].players[games[from].turn]) {
                return conn.sendMessage(from, { text: "❗ It's not your turn!" }, { quoted: receivedMsg });
            }

            if (games[from].board[pos - 1]) {
                return conn.sendMessage(from, { text: "❗ This position is already taken." }, { quoted: receivedMsg });
            }

            games[from].board[pos - 1] = games[from].turn === 0 ? "❌" : "⭕";

            if (checkWin(games[from].board, games[from].turn === 0 ? "❌" : "⭕")) {
                const boardNow = renderBoard(games[from].board);
                await conn.sendMessage(from, {
                    text: `🎉 Game over! Winner: @${sender.split("@")[0]}\n\n${boardNow}`,
                    mentions: [sender]
                }, { quoted: receivedMsg });
                games[from].playing = false;
                conn.ev.off("messages.upsert", handler);
                return;
            }

            if (games[from].board.every(c => c)) {
                const boardNow = renderBoard(games[from].board);
                await conn.sendMessage(from, {
                    text: `⚖️ The game ended in a draw!\n\n${boardNow}`
                }, { quoted: receivedMsg });
                games[from].playing = false;
                conn.ev.off("messages.upsert", handler);
                return;
            }

            games[from].turn = 1 - games[from].turn;

            const boardNow = renderBoard(games[from].board);
            await conn.sendMessage(from, {
                text: `🎮 *TIC-TAC-TOE* 🎮\n\n${boardNow}\n\nTurn: @${games[from].players[games[from].turn].split("@")[0]} (${games[from].turn === 0 ? "❌" : "⭕"})`,
                mentions: [games[from].players[games[from].turn]]
            }, { quoted: receivedMsg });

        } catch (e) {
            console.error("Tic-Tac-Toe handler error:", e);
        }
    };

    conn.ev.on("messages.upsert", handler);

    // Remove handler and game after 10 minutes
    setTimeout(() => {
        conn.ev.off("messages.upsert", handler);
        delete games[from];
    }, 10 * 60 * 1000);

});

function renderBoard(board) {
    const emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];
    let str = "┄┄┄┄┄┄┄┄┄┄┄\n";
    for(let i=0; i<9; i++) {
        str += `┃ ${board[i] || emojis[i]} `;
        if ((i+1) % 3 === 0) str += "┃\n┄┄┄┄┄┄┄┄┄┄┄\n";
    }
    return str;
}

function checkWin(board, symbol) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return wins.some(combo => combo.every(i => board[i] === symbol));
}

cmd({
    pattern: "tttcs",
    alias: [".tttcs", ".tttcancel"],
    react: "❌",
    desc: "Cancel the ongoing Tic-Tac-Toe game",
    category: "game",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    if (!games[from] || !games[from].playing) {
        return reply("❗ There is no ongoing Tic-Tac-Toe game to cancel.");
    }

    delete games[from];
    return reply("✅ The Tic-Tac-Toe game has been cancelled successfully.");
});

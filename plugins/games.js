const { cmd } = require('../command');

const games = {};

function printBoard(board) {
  return (
    `┄┄┄┄┄┄┄┄┄┄┄\n` +
    `┃ ${board[0]} ┃ ${board[1]} ┃ ${board[2]} ┃\n` +
    `┄┄┄┄┄┄┄┄┄┄┄\n` +
    `┃ ${board[3]} ┃ ${board[4]} ┃ ${board[5]} ┃\n` +
    `┄┄┄┄┄┄┄┄┄┄┄\n` +
    `┃ ${board[6]} ┃ ${board[7]} ┃ ${board[8]} ┃\n` +
    `┄┄┄┄┄┄┄┄┄┄┄`
  );
}

function checkWin(board, turn) {
  const symbol = turn === 'X' ? '❌' : '⭕';
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return wins.some(indices => indices.every(i => board[i] === symbol));
}

cmd({
  pattern: 'ttt',
  alias: ['tttgame', 'tictactoe'],
  desc: 'Start TicTacToe game',
  category: 'game',
  filename: __filename,
}, async (conn, mek, m, { from, sender, reply }) => {
  const replyText = async (text, mentions = [], quoted = m) => {
    await conn.sendMessage(from, { text, mentions }, { quoted });
  };

  if (!games[from]) {
    games[from] = {
      board: ['1','2','3','4','5','6','7','8','9'],
      playerX: sender,
      playerO: null,
      turn: 'X',
      playing: true
    };

    const startMsg = await conn.sendMessage(from, {
      text:
        `🎮 *TIC-TAC-TOE* 🎮\n\n` +
        `Game started! @${sender.split('@')[0]} (❌) waiting for player 2 (⭕).\n\n` +
        printBoard(games[from].board) +
        `\n@${sender.split('@')[0]}'s turn (❌)\nReply with a number 1-9 to play.`,
      mentions: [sender]
    }, { quoted: m });

    const messageID = startMsg.key.id;

    const handler = async (msgData) => {
      try {
        const receivedMsg = msgData.messages[0];
        if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

        const isReplyToGameMsg = receivedMsg.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;
        if (!isReplyToGameMsg) return;

        const moveText =
          receivedMsg.message?.conversation ||
          receivedMsg.message?.extendedTextMessage?.text || "";

        const move = moveText.trim();
        const player = receivedMsg.key.participant || receivedMsg.participant || receivedMsg.key.remoteJid;

        if (!/^[1-9]$/.test(move)) {
          await conn.sendMessage(from, { text: "❌ Invalid move! Reply with a number 1-9." }, { quoted: receivedMsg });
          return;
        }

        const game = games[from];
        if (!game || !game.playing) {
          await conn.sendMessage(from, { text: "❗ There is no active game." }, { quoted: receivedMsg });
          conn.ev.off("messages.upsert", handler);
          return;
        }

        // If playerO not yet joined
        if (!game.playerO && player !== game.playerX) {
          game.playerO = player;

          // Register first move of playerO
          const moveIndex = parseInt(move) - 1;

          if (game.board[moveIndex] === '❌' || game.board[moveIndex] === '⭕') {
            await conn.sendMessage(from, { text: "❌ Position already taken." }, { quoted: receivedMsg });
            return;
          }

          game.board[moveIndex] = '⭕';

          if (checkWin(game.board, 'O')) {
            await conn.sendMessage(from, {
              text: `🎉 @${player.split('@')[0]} (⭕) wins!\n\n${printBoard(game.board)}`,
              mentions: [player]
            });
            delete games[from];
            conn.ev.off("messages.upsert", handler);
            return;
          }

          game.turn = 'X';

          await conn.sendMessage(from, {
            text:
              `🎮 @${player.split('@')[0]} joined as Player 2 (⭕).\n\n` +
              printBoard(game.board) +
              `\n@${game.playerX.split('@')[0]}'s turn (❌)\nReply with 1-9.`,
            mentions: [game.playerX, game.playerO]
          });
          return;
        }

        // Not player turn
        if ((game.turn === 'X' && player !== game.playerX) || (game.turn === 'O' && player !== game.playerO)) {
          await conn.sendMessage(from, { text: "❗ It's not your turn!" }, { quoted: receivedMsg });
          return;
        }

        const moveIndex = parseInt(move) - 1;

        // Cell already taken
        if (game.board[moveIndex] === '❌' || game.board[moveIndex] === '⭕') {
          await conn.sendMessage(from, { text: "❌ Position already taken." }, { quoted: receivedMsg });
          return;
        }

        // Make move
        game.board[moveIndex] = game.turn === 'X' ? '❌' : '⭕';

        // Check win
        if (checkWin(game.board, game.turn)) {
          const winner = game.turn === 'X' ? game.playerX : game.playerO;
          const symbol = game.turn === 'X' ? '❌' : '⭕';
          await conn.sendMessage(from, {
            text: `🎉 @${winner.split('@')[0]} (${symbol}) wins!\n\n${printBoard(game.board)}`,
            mentions: [winner]
          });
          delete games[from];
          conn.ev.off("messages.upsert", handler);
          return;
        }

        // Check draw
        if (game.board.every(c => c === '❌' || c === '⭕')) {
          await conn.sendMessage(from, {
            text: `🤝 Draw!\n\n${printBoard(game.board)}`
          });
          delete games[from];
          conn.ev.off("messages.upsert", handler);
          return;
        }

        // Switch turn
        game.turn = game.turn === 'X' ? 'O' : 'X';

        await conn.sendMessage(from, {
          text:
            `🎮 *TIC-TAC-TOE* 🎮\n\n` +
            printBoard(game.board) +
            `\n@${game.turn === 'X' ? game.playerX.split('@')[0] : game.playerO.split('@')[0]}'s turn (${game.turn === 'X' ? '❌' : '⭕'})\nReply with 1-9.`,
          mentions: [game.playerX, game.playerO]
        });
      } catch (e) {
        console.error('TicTacToe handler error:', e);
      }
    };

    conn.ev.on("messages.upsert", handler);

    setTimeout(() => {
      conn.ev.off("messages.upsert", handler);
      if (games[from]) delete games[from];
    }, 10 * 60 * 1000);
  } else {
    await replyText("❗ There is already an ongoing game! Reply with a number 1-9 to play.");
  }
});

// 🛑 دستور پایان بازی توسط سازنده
cmd({
  pattern: 'endgame',
  alias: ['endttt', 'cancelttt'],
  desc: 'End the ongoing TicTacToe game',
  category: 'game',
  filename: __filename,
}, async (conn, mek, m, { from, sender, reply }) => {
  const game = games[from];

  if (!game) return reply("❌ No active game to end.");

  if (sender !== game.playerX) {
    return reply("❌ Only the game creator (Player X) can end the game.");
  }

  delete games[from];

  await conn.sendMessage(from, {
    text: `🛑 @${sender.split('@')[0]} ended the TicTacToe game.`,
    mentions: [sender]
  }, { quoted: m });
});
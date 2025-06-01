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
}, async (conn, mek, m, { from, sender, args, reply }) => {
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
        const receivedMsg = msgData.messages?.[0];
        if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

        const game = games[from];
        if (!game || !game.playing) return;

        const isReplyToGameMsg = receivedMsg.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;
        if (!isReplyToGameMsg) return;

        const textMsg =
          receivedMsg.message?.conversation ||
          receivedMsg.message?.extendedTextMessage?.text || "";

        const move = textMsg.trim();
        const player = receivedMsg.key.participant || receivedMsg.key.remoteJid;

        // Join Player O
        if (!game.playerO && player !== game.playerX) {
          game.playerO = player;
          await conn.sendMessage(from, {
            text:
              `🎮 @${player.split('@')[0]} joined as Player 2 (⭕).\n\n` +
              printBoard(game.board) +
              `\n@${game.turn === 'X' ? game.playerX.split('@')[0] : game.playerO.split('@')[0]}'s turn (${game.turn === 'X' ? '❌' : '⭕'})\nReply with 1-9.`,
            mentions: [game.playerX, game.playerO]
          });
          return;
        }

        // Invalid player
        if (player !== game.playerX && player !== game.playerO) return;

        if (!/^[1-9]$/.test(move)) {
          await conn.sendMessage(player, { text: "❌ Invalid move! Reply with a number 1-9." }, { quoted: receivedMsg });
          return;
        }

        // Turn check
        if ((game.turn === 'X' && player !== game.playerX) || (game.turn === 'O' && player !== game.playerO)) {
          await conn.sendMessage(player, { text: "❗ It's not your turn!" }, { quoted: receivedMsg });
          return;
        }

        const idx = parseInt(move) - 1;
        if (game.board[idx] === '❌' || game.board[idx] === '⭕') {
          await conn.sendMessage(player, { text: "❌ That cell is already taken." }, { quoted: receivedMsg });
          return;
        }

        const symbol = game.turn === 'X' ? '❌' : '⭕';
        game.board[idx] = symbol;

        if (checkWin(game.board, game.turn)) {
          await conn.sendMessage(from, {
            text: `🎉 @${player.split('@')[0]} (${symbol}) wins!\n\n${printBoard(game.board)}`,
            mentions: [player]
          });
          delete games[from];
          conn.ev.off("messages.upsert", handler);
          return;
        }

        if (game.board.every(cell => cell === '❌' || cell === '⭕')) {
          await conn.sendMessage(from, {
            text: `🤝 It's a draw!\n\n${printBoard(game.board)}`
          });
          delete games[from];
          conn.ev.off("messages.upsert", handler);
          return;
        }

        // Switch turn
        game.turn = game.turn === 'X' ? 'O' : 'X';
        const nextPlayer = game.turn === 'X' ? game.playerX : game.playerO;
        const nextSymbol = game.turn === 'X' ? '❌' : '⭕';

        await conn.sendMessage(from, {
          text:
            `🎮 *TIC-TAC-TOE* 🎮\n\n` +
            printBoard(game.board) +
            `\n@${nextPlayer.split('@')[0]}'s turn (${nextSymbol})\nReply with 1-9.`,
          mentions: [game.playerX, game.playerO]
        });

      } catch (e) {
        console.error('TicTacToe handler error:', e);
      }
    };

    conn.ev.on("messages.upsert", handler);

    // Timeout after 10 minutes
    setTimeout(() => {
      conn.ev.off("messages.upsert", handler);
      if (games[from]) delete games[from];
    }, 10 * 60 * 1000);

  } else {
    await replyText("❗ There's already a game in this chat. Reply to the game message with 1-9 to play.");
  }
});
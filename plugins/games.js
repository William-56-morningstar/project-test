const { cmd } = require('../command');
const {
  startGame,
  joinPlayer,
  getGame,
  move,
  cancel,
  printBoard
} = require('../lib/games-database');

cmd({
  pattern: 'ttt',
  alias: ['tttgame', 'tictactoe'],
  desc: 'Start TicTacToe or play a move by replying 1-9',
  category: 'game',
  filename: __filename,
}, async (conn, mek, m, { from, args, sender }) => {
  const reply = text => conn.sendMessage(from, { text }, { quoted: m });

  let game = getGame(from);

  if (!game) {
    startGame(from, sender);
    return reply(
      `🎮 *TIC-TAC-TOE* 🎮\n\n` +
      `Game started! @${sender.split('@')[0]} (❌) waiting for player 2 (⭕).\n\n` +
      printBoard(getGame(from).board) +
      `\n@${sender.split('@')[0]}'s turn (❌)\nReply with a number 1-9 to play.`
    );
  }

  game = getGame(from);

  if (!game.playerO && sender !== game.playerX) {
    joinPlayer(from, sender);
    return reply(
      `🎮 *TIC-TAC-TOE* 🎮\n\n` +
      `Player 2 @${sender.split('@')[0]} joined (⭕).\n\n` +
      printBoard(game.board) +
      `\n@${game.turn === 'X' ? game.playerX.split('@')[0] : game.playerO.split('@')[0]}'s turn (${game.turn === 'X' ? '❌' : '⭕'})\nReply with a number 1-9 to play.`
    );
  }

  if (args.length === 0) return reply('❗ Game ongoing! Reply 1-9 to play.');

  const movePos = args[0];
  if (!/^[1-9]$/.test(movePos)) return reply('❌ Invalid move! Reply 1-9.');

  const result = move(from, sender, movePos);

  if (result.error) return reply(`❗ ${result.error}`);

  if (result.win) {
    return reply(
      `🎉 @${result.winner.split('@')[0]} won! 🎉\n\n` +
      printBoard(result.board)
    );
  }

  if (result.draw) {
    return reply(
      `🤝 Draw game! 🤝\n\n` +
      printBoard(result.board)
    );
  }

  return reply(
    `🎮 *TIC-TAC-TOE* 🎮\n\n` +
    printBoard(result.board) +
    `\n@${result.turn === 'X' ? game.playerX.split('@')[0] : game.playerO.split('@')[0]}'s turn (${result.turn === 'X' ? '❌' : '⭕'})\nReply 1-9 to play.`
  );
});

cmd({
  pattern: "tttcs",
  alias: [".tttcs", ".tttcancel"],
  react: "❌",
  desc: "Cancel ongoing TicTacToe game",
  category: "game",
  filename: __filename,
}, async (conn, mek, m, { from }) => {
  const reply = text => conn.sendMessage(from, { text }, { quoted: m });

  if (!getGame(from)) return reply("❗ No game to cancel.");

  cancel(from);
  return reply("✅ Game cancelled.");
});
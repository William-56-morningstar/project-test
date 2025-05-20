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

const games = {}; // Global object to track games by chat id

cmd({
  pattern: 'ttt',
  alias: ['-ttt', 'tictactoe'],
  desc: 'Start a Tic-Tac-Toe game or make a move by replying with a number 1-9',
  category: 'game',
  filename: __filename,
}, async (conn, mek, m, { from, args, reply, sender }) => {
  // If no ongoing game, start a new game with the command sender as Player 1 (❌)
  if (!games[from]) {
    games[from] = {
      board: ['1','2','3','4','5','6','7','8','9'],
      playerX: sender,
      playerO: null,
      turn: 'X',
      playing: true
    };
    return reply(
      `🎮 *TIC-TAC-TOE* 🎮\n\n` +
      `Game created between @${sender.split('@')[0]} (❌) and waiting for Player 2 (⭕).\n\n` +
      printBoard(games[from].board) +
      `\n@${sender.split('@')[0]}'s turn (❌)\nReply with a number (1-9) to make your move.`
    );
  }

  const game = games[from];

  // If Player 2 not joined, assign current sender as Player 2
  if (!game.playerO && sender !== game.playerX) {
    game.playerO = sender;
    return reply(
      `🎮 *TIC-TAC-TOE* 🎮\n\n` +
      `Player 2 @${sender.split('@')[0]} joined the game (⭕).\n\n` +
      printBoard(game.board) +
      `\n@${game.turn === 'X' ? game.playerX.split('@')[0] : game.playerO.split('@')[0]}'s turn (${game.turn === 'X' ? '❌' : '⭕'})\nReply with a number (1-9) to make your move.`
    );
  }

  // If game is ongoing and player tries to start new game
  if (args.length === 0) {
    return reply('❗ There is already an ongoing game! Please reply with a number (1-9) to make your move.');
  }

  // Validate move input: number 1-9
  const move = args[0];
  if (!/^[1-9]$/.test(move)) return reply('❌ Invalid move! Please reply with a number (1-9).');

  // Check if it's player's turn
  if ((game.turn === 'X' && sender !== game.playerX) || (game.turn === 'O' && sender !== game.playerO)) {
    return reply('❗ It\'s not your turn!');
  }

  // Check if the cell is empty
  if (game.board[move - 1] === '❌' || game.board[move - 1] === '⭕') {
    return reply('❌ This position is already taken. Choose another number.');
  }

  // Make the move
  game.board[move - 1] = game.turn === 'X' ? '❌' : '⭕';

  // Check win or draw
  if (checkWin(game.board, game.turn)) {
    const winner = game.turn === 'X' ? game.playerX : game.playerO;
    const symbol = game.turn === 'X' ? '❌' : '⭕';
    reply(
      `🎉 @${winner.split('@')[0]} (${symbol}) has won the game! 🎉\n\n` +
      printBoard(game.board)
    );
    delete games[from]; // Remove finished game
    return;
  }

  if (game.board.every(c => c === '❌' || c === '⭕')) {
    reply(
      `🤝 The game is a draw! 🤝\n\n` +
      printBoard(game.board)
    );
    delete games[from];
    return;
  }

  // Switch turn
  game.turn = game.turn === 'X' ? 'O' : 'X';

  // Show updated board and next player's turn
  reply(
    `🎮 *TIC-TAC-TOE* 🎮\n\n` +
    printBoard(game.board) +
    `\n@${game.turn === 'X' ? game.playerX.split('@')[0] : game.playerO.split('@')[0]}'s turn (${game.turn === 'X' ? '❌' : '⭕'})\nReply with a number (1-9) to make your move.`
  );

});

// Helper function to print board as string
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

// Helper function to check win condition
function checkWin(board, turn) {
  const symbol = turn === 'X' ? '❌' : '⭕';
  const wins = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
  ];
  return wins.some(indices => indices.every(i => board[i] === symbol));
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

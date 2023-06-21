const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.API;
const botToken = process.env.TOKEN;
const bot = new TelegramBot(botToken, { polling: true });

// Function to search for a movie by title
async function searchMovie(chatId, title) {
  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`
    );
    const movie = response.data;
    console.log(movie);
    // Prepare the response message
    const message = `
*Title:* ${movie.Title}
*Year:* ${movie.Year}
*IMDb Rating:* ${movie.imdbRating}
*Plot:* ${movie.Plot}
*Type:* ${movie.Type}

[View Poster](${movie.Poster})
`;

    // Send the message back to the user with Markdown formatting
    bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Error retrieving movie:", error);
    bot.sendMessage(
      chatId,
      "Sorry, something went wrong. Please try again later."
    );
  }
}

// Listen for the /start command to show the welcome message
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Define the welcome message with a beautiful design
  const welcomeMessage = `
🎥 Welcome to CineBot! 🍿

CineBot is your ultimate movie companion. Discover information about movies with just a few clicks.

To search for a movie, simply type:
/movie <movie name>

Example:
/movie The Shawshank Redemption

Enjoy your movie search! 🎬
`;

  // Send the welcome message with Markdown formatting
  bot.sendMessage(chatId, welcomeMessage, { parse_mode: "Markdown" });
  bot.sendMessage(chatId, options);
});

// Listen for the /option command
bot.onText(/\/option/, (msg) => {
  const chatId = msg.chat.id;

  // Define the keyboard options
  const options = {
    reply_markup: {
      keyboard: [
        [{ text: "Search for Movie" }],
        [{ text: "Help" }],
        [{ text: "Creator Info" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  // Send the message with the keyboard options
  bot.sendMessage(chatId, "Choose an option:", options);
});

// Handle the user's response
bot.onText(/Search for Movie/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "To search for a movie, use the /movie command followed by the movie name.\n\nExample: /movie The Shawshank Redemption"
  );
});

bot.onText(/Help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Here is some help information...");
});

bot.onText(/Creator Info/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Creator: Hrithik Keswani");
});

// Listen for the /movie command
bot.onText(/\/movie (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const movieName = match[1];
  searchMovie(chatId, movieName);
});

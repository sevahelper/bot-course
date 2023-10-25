const TelegramApi = require("node-telegram-bot-api");
const {gameOptions,againOptions} = require('./options.js')
const token = "6377630703:AAFdlwiRzrjR9eYsIkG_av6uSk27ZF7Z5DY";

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "начальное приветствие" },
  { command: "/info", description: "Получить информацию о пользователе" },
  { command: "/game", description: "Да начнутся голодные игры" },
]);

const chats = {};

const startGame =(chatId)=>{
  bot.sendMessage(
    chatId,
    "сейчас я загадаю цифру от 1 до 3,попробуй угадать)"
  );
  let randomNum = (Math.random() * 3).toFixed(0);
  console.log(randomNum);
  chats[chatId] = randomNum;
  bot.sendMessage(chatId, "отгадывай!", gameOptions);
  return
}



const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      console.log(msg);
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/4.webp"
      );
      return bot.sendMessage(chatId, "Добро пожаловать)");
    }

    if (text === "/info") {
      let firstLastName = msg.from.first_name + " " + msg.from.last_name;
      let firstName = msg.from.first_name;
      let varMessage = msg.from.last_name ? firstLastName : firstName;
      return bot.sendMessage(chatId, `тебя зовут ${varMessage}`);
    }
    if (text === "/game") {
      startGame(chatId)
    } else {
      return bot.sendMessage(chatId, `я вас не понимаю,попробуйте еще раз`);
    }
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if(data === '/again'){
      return startGame(chatId)

    }

    if (data === chats[chatId]) {
    return await bot.sendMessage(
        chatId,
        "а ты везуничк,я хочу стать твоим папой,гоша",
        againOptions
      );
    } else {
     return await bot.sendMessage(chatId, "пробуй еще раз,черт",againOptions);
    }
  });
};

start();

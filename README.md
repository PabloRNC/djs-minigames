# DJS-MINIGAMES

This module allows you to make minigames on your discord bot using discord.js. At this time discord-minigames only have the TicTacToe minigame but more mini-games will be available soon.

How to create a discord-minigames client:
```js
const {Client} = require("discord-minigames")

const myAwesomeClient = new Client({
    playMoreThanOne: true, //if false each type of mini-game can only be played once at a time
    emitEvents: true, //if false the module will not emit any event
    defaultTimeout: 60000, //the default timeout of the module if in the minigames that require a timeout the timeout is not given it will replaced by this timeout in ms
    language: "EN" //the language that all the games will be. They can be in English or Spanish
})

```

# TICTACTOE
How to create a tictactoe game:
```js
const {TicTacToe} = require("discord-minigames")

new TicTacToe(myAwesomeClient, interaction, user, {
    embedColor: "GREEN", //The color of the embed when the tictactoe is playing
    timeout: 60000, //The timeout of accept or decline the challenge 
    embedFooter: "My awesome TicTacToe", //The footer of the embed of the TicTacToe
    timeoutEmbedColor: "RED", //The timeout embed color when the timeout ends
    xEmoji: "❌​", //The xEmoji that will be in the tictactoe by default the emoji will be "❌​"
    oEmoji: "⭕​", //The oEmoji that will be in the tictactoe by default the emoji will be "⭕​​"
    _emoji: "➖", //The neutral emoji that will be in the tictactoe by default the emoji will be "➖"​
}).play() //the method to start the tictactoe

//myAwesomeClient refers to a discord-minigames client, interaction to a discord.js Interaction and user a discord.js User

//There is an event that is emited whenever a tictactoe ends and returns the tictactoe class

myAwesomeClient.on("tictactoeEnd", tictactoe => {
    console.log(tictactoe)
})
```

If you want to open an issue, report a bug or do a pull request go to the module's [GitHub](https://github.com/PabloRNC/djs-minigames)


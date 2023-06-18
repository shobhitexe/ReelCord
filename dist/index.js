"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config/config");
const discord_js_1 = require("discord.js");
const readyEvent_1 = require("./events/readyEvent");
const messageEvent_1 = require("./events/messageEvent");
const enviroment = (0, config_1.env)();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
client.once("ready", (0, readyEvent_1.handleReadyEvent)(client));
client.on("messageCreate", messageEvent_1.messageHandler);
client.login(enviroment.TOKEN);
//# sourceMappingURL=index.js.map
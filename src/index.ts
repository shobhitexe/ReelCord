import { env } from "./config/config";
import { Enviroment } from "./models/env";
import { Client, GatewayIntentBits } from "discord.js";
import { handleReadyEvent } from "./events/readyEvent";
import { messageHandler } from "./events/messageEvent";
import { server } from "./server";

const enviroment: Enviroment = env();

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", handleReadyEvent(client));
client.on("messageCreate", messageHandler);

server.listen(8080, () => {
  console.log(`Server running at port 8080`);
  client.login(enviroment.TOKEN);
});

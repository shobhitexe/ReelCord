import { Client, ActivityType } from "discord.js";

export function handleReadyEvent(client: Client) {
  return () => {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
    client.user?.setPresence({ status: "online" });
    client.user?.setActivity("Links to preview", {
      type: ActivityType.Watching,
    });
  };
}

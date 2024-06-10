import { Message } from "discord.js";
import { fetchVideoData } from "../service/getVideoData";
import { isInstagramPostLink } from "../utils/linkValidation";

export async function messageHandler(msg: Message): Promise<void> {
  if (msg.author.bot) return;
  if (msg.attachments.size > 0) return;

  const { author } = msg;

  if (isInstagramPostLink(msg.content)) {
    try {
      const res = await fetchVideoData(msg.content);

      if (!author) {
        console.log("Can't send preview without author");
        return;
      }

      await msg.reply({
        content: `Shared by ${author}`,
        files: [
          {
            attachment: res,
            name: "linkPreviewBot.mp4",
          },
        ],
      });
    } catch (error) {
      await msg.reply({
        content: "<:drip:962326303703433216>",
      });
      console.error(error);
    }
  }
}

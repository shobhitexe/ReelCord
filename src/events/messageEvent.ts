import { Message } from "discord.js";
import { fetchVideoData } from "../service/getVideoData";
import { isInstagramPostLink } from "../utils/linkValidation";
import axios from "axios";

export async function messageHandler(msg: Message): Promise<void> {
  if (msg.author.bot) return;
  if (msg.attachments.size > 0) return;
  if (!isInstagramPostLink(msg.content)) return;

  const { author } = msg;

  try {
    const link = await fetchVideoData(msg.content);

    const response = await axios.get(link, { responseType: "stream" });

    if (!author) {
      console.log("Can't send preview without author");
      return;
    }

    await msg.reply({
      content: `Shared by ${author}`,
      files: [
        {
          attachment: response.data,
          name: "linkPreviewBot.mp4",
        },
      ],
    });

    console.log(`Preview sent of video`);
  } catch (error) {
    await msg.reply({
      content:
        "Unable to generate a preview coz currently testing some experimental features",
    });
    console.error(error);
  }
}

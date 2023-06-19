import { Message } from "discord.js";
import { fetchVideoData } from "../service/getVideoData";
import { isInstagramPostLink } from "../utils/linkValidation";
import axios from "axios";

export async function messageHandler(msg: Message): Promise<void> {
  if (msg.author.bot) return;
  if (msg.attachments.size > 0) return;

  if (isInstagramPostLink(msg.content)) {
    const link = await fetchVideoData(msg.content);
    const response = await axios.get(link, { responseType: "stream" });

    msg
      .reply({
        files: [
          {
            attachment: response.data,
            name: "linkPreviewBot.mp4",
          },
        ],
      })
      .then(() => {
        console.log("Preview sent");
      })
      .catch((err) => {
        console.log({ error: err });
      });
  }
}

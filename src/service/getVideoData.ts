import axios, { AxiosRequestConfig } from "axios";
import { apiKeys } from "../data/apikeys";

export async function fetchVideoData(link: string): Promise<string> {
  const index = Math.floor(Math.random() * apiKeys.length);
  const key = apiKeys[index];

  const options: AxiosRequestConfig = {
    method: "GET",
    url: "https://instagram-media-downloader.p.rapidapi.com/rapid/post.php",
    params: {
      url: link,
    },
    headers: {
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": "instagram-media-downloader.p.rapidapi.com",
    },
    responseType: "json",
  };

  try {
    const response = await axios(options);

    return response.data.video;
  } catch (error) {
    throw error;
  }
}

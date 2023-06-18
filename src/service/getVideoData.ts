import axios, { AxiosRequestConfig } from "axios";

export async function fetchVideoData(link: string): Promise<string> {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: "https://instagram-media-downloader.p.rapidapi.com/rapid/post.php",
    params: {
      url: link,
    },
    headers: {
      "X-RapidAPI-Key": "12e439896dmsh578be7c646e4746p13f763jsn0d9db4287af7",
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

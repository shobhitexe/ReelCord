import { instagramGetUrl } from "./instagram";

export async function fetchVideoData(link: string): Promise<string> {
  try {
    const result = await instagramGetUrl(link);
    const videoUrl = result.url_list?.[0];
    if (!videoUrl) throw new Error("No video URL found");
    return videoUrl;
  } catch (error) {
    throw error;
  }
}

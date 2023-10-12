import { instaSpider } from "insta-spider";

export async function fetchVideoData(link: string): Promise<string> {
  try {
    const spider = await instaSpider([]);
    const downloadUrl = await spider.downloadReel(link);
    return downloadUrl;
  } catch (error) {
    throw error;
  }
}

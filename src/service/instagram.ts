import { InstagramResponse } from "./instagramTypes";
import { checkRedirect, getShortcode } from "./instagramUtils";
import { instagramRequest } from "./instagramRequest";
import { createOutputData } from "./instagramParser";

export async function instagramGetUrl(
  url_media: string,
  config = { retries: 5, delay: 1000 }
): Promise<InstagramResponse> {
  return new Promise<InstagramResponse>(async (resolve, reject) => {
    try {
      const resolvedUrl = await checkRedirect(url_media);
      const shortcode = getShortcode(resolvedUrl);

      const requestData = await instagramRequest(
        shortcode,
        config.retries,
        config.delay
      );

      const output = createOutputData(requestData);

      resolve(output as InstagramResponse);
    } catch (err: any) {
      console.error(`[instagram] Error: ${err.message}`);
      reject(err);
    }
  });
}

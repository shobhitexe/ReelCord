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
      console.log(`[instagram] Processing URL: ${url_media}`);

      const resolvedUrl = await checkRedirect(url_media);
      console.log(`[instagram] Resolved URL: ${resolvedUrl}`);

      const shortcode = getShortcode(resolvedUrl);

      const requestData = await instagramRequest(
        shortcode,
        config.retries,
        config.delay
      );

      const output = createOutputData(requestData);
      console.log(`[instagram] Done — ${output.results_number} result(s)`);

      resolve(output as InstagramResponse);
    } catch (err: any) {
      console.error(`[instagram] Error: ${err.message}`);
      reject(err);
    }
  });
}

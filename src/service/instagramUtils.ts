import axios from "axios";

export async function checkRedirect(url: string): Promise<string> {
  const split_url = url.split("/");

  if (split_url.includes("share")) {
    const res = await axios.get(url);
    return res.request.path;
  }

  return url;
}

export function getShortcode(url: string): string {
  try {
    const split_url = url.split("/");
    const post_tags = ["p", "reel", "tv", "reels"];
    const index_shortcode =
      split_url.findIndex((item) => post_tags.includes(item)) + 1;
    return split_url[index_shortcode];
  } catch (err: any) {
    console.error("[instagramUtils] Failed to obtain shortcode:", err.message);
    throw new Error(`Failed to obtain shortcode: ${err.message}`);
  }
}

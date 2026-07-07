import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "qs";
import { InstagramCookies } from "./instagramTypes";
import { getDocumentId } from "./instagramDocId";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export async function getCSRFToken(): Promise<InstagramCookies> {
  try {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: "https://www.instagram.com/",
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    };

    const response: AxiosResponse = await axios.request(config);

    if (!response.headers["set-cookie"]) {
      console.error("[instagramRequest] No set-cookie headers in response");
      throw new Error("Cookies not found in response headers.");
    }

    const cookieJar: InstagramCookies = { csrftoken: "" };

    for (const cookieStr of response.headers["set-cookie"]) {
      const cookieName = cookieStr.split(";")[0].split("=")[0].trim();
      const cookieValue = cookieStr.split(";")[0].split("=").slice(1).join("=").trim();

      if (cookieName === "csrftoken") {
        cookieJar.csrftoken = cookieValue;
      } else if (["ig_did", "mid", "ig_nrcb"].includes(cookieName)) {
        (cookieJar as any)[cookieName] = cookieValue;
      }
    }

    if (!cookieJar.csrftoken) {
      console.error("[instagramRequest] csrftoken not found in cookies");
      throw new Error("CSRF token not found in response headers.");
    }

    return cookieJar;
  } catch (err: any) {
    console.error("[instagramRequest] Failed to obtain CSRF/cookies:", err.message);
    throw new Error(`Failed to obtain CSRF: ${err.message}`);
  }
}

export async function instagramRequest(
  shortcode: string,
  retries: number,
  delay: number
): Promise<any> {
  try {
    const cookies = await getCSRFToken();

    const cookieHeader = Object.entries(cookies)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");

    const INSTAGRAM_DOCUMENT_ID = await getDocumentId(shortcode, cookieHeader, cookies.csrftoken);

    const BASE_URL = "https://www.instagram.com/graphql/query";

    const dataBody = qs.stringify({
      variables: JSON.stringify({
        shortcode: shortcode,
        fetch_tagged_user_count: null,
        hoisted_comment_id: null,
        hoisted_reply_id: null,
      }),
      doc_id: INSTAGRAM_DOCUMENT_ID,
    });

    const config: AxiosRequestConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: BASE_URL,
      headers: {
        "X-CSRFToken": cookies.csrftoken,
        Cookie: cookieHeader,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": UA,
        "X-IG-App-ID": "936619743392459",
        "X-Requested-With": "XMLHttpRequest",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
      },
      data: dataBody,
    };

    const { data } = await axios.request(config);

    if (data.errors) {
      console.error(`[instagramRequest] GraphQL errors: ${JSON.stringify(data.errors).substring(0, 500)}`);
    }

    if (!data.data?.xdt_shortcode_media) {
      console.error("[instagramRequest] xdt_shortcode_media is null/undefined");
      throw new Error(
        "Only posts/reels supported, check if your link is valid."
      );
    }

    return data.data.xdt_shortcode_media;
  } catch (err: any) {
    const errorCodes = [429, 403];

    if (
      err.response &&
      errorCodes.includes(err.response.status) &&
      retries > 0
    ) {
      console.warn(
        `[instagramRequest] Got ${err.response.status}, retrying... (${retries} attempts left)`
      );
      const retryAfter = err.response.headers["retry-after"];
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay;
      await new Promise((res) => setTimeout(res, waitTime));
      return instagramRequest(shortcode, retries - 1, delay * 2);
    }

    console.error(`[instagramRequest] Failed: ${err.message}`);
    throw new Error(`Failed instagram request: ${err.message}`);
  }
}

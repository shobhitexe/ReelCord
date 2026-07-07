import axios from "axios";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

let cachedDocId: string | null = null;

async function tryDocId(
  docId: string,
  shortcode: string,
  cookies: string,
  csrfToken: string
): Promise<boolean> {
  try {
    const qs = await import("qs");
    const dataBody = qs.default.stringify({
      variables: JSON.stringify({
        shortcode: shortcode,
        fetch_tagged_user_count: null,
        hoisted_comment_id: null,
        hoisted_reply_id: null,
      }),
      doc_id: docId,
    });

    const { data } = await axios.post(
      "https://www.instagram.com/graphql/query",
      dataBody,
      {
        headers: {
          "X-CSRFToken": csrfToken,
          Cookie: cookies,
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": UA,
          "X-IG-App-ID": "936619743392459",
          "X-Requested-With": "XMLHttpRequest",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 10000,
      }
    );

    if (data.data?.xdt_shortcode_media) {
      console.log(`[doc_id] ✅ Working: ${docId}`);
      return true;
    }

    console.log(
      `[doc_id] ❌ ${docId} — ${JSON.stringify(data.errors?.[0]?.message || data.status || "no data")}`
    );
    return false;
  } catch {
    console.log(`[doc_id] ❌ ${docId} — request failed`);
    return false;
  }
}

const FALLBACKS = [
  "27128499623469141",
  "10015901848480474",
  "9510064595728286",
  "8845758582119845",
  "17991233890057762",
];

export async function getDocumentId(
  shortcode?: string,
  cookies?: string,
  csrfToken?: string
): Promise<string> {
  if (cachedDocId) {
    return cachedDocId;
  }

  console.log(`[doc_id] Trying ${FALLBACKS.length} fallback doc_id(s)...`);

  if (shortcode && cookies && csrfToken) {
    for (const fb of FALLBACKS) {
      const works = await tryDocId(fb, shortcode, cookies, csrfToken);
      if (works) {
        cachedDocId = fb;
        return fb;
      }
    }
  }

  const lastResort = FALLBACKS[0];
  console.log(`[doc_id] All fallbacks failed, using: ${lastResort}`);
  cachedDocId = lastResort;
  return lastResort;
}

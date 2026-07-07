import axios from "axios";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

let cachedDocId: string | null = null;

async function extractDocIdsFromJs(js: string): Promise<string[]> {
  const matches = js.match(/"doc_id":"(\d{16,20})"/g);
  if (!matches) return [];

  const ids = matches
    .map((m) => m.match(/\d{16,20}/)?.[0])
    .filter(Boolean) as string[];

  return [...new Set(ids)];
}

async function tryDocId(
  docId: string,
  shortcode: string,
  cookies: string,
  csrfToken: string
): Promise<boolean> {
  try {
    console.log(`[instagramDocId] Trying doc_id: ${docId}`);

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
      console.log(`[instagramDocId] ✅ doc_id ${docId} works!`);
      return true;
    }

    console.log(
      `[instagramDocId] ❌ doc_id ${docId} failed — ${JSON.stringify(data.errors?.[0]?.message || data.status || "no data")}`
    );
    return false;
  } catch {
    console.log(`[instagramDocId] ❌ doc_id ${docId} errored out (possibly rate limited)`);
    return false;
  }
}

export async function getDocumentId(
  shortcode?: string,
  cookies?: string,
  csrfToken?: string
): Promise<string> {
  if (cachedDocId) {
    console.log(`[instagramDocId] Using cached doc_id: ${cachedDocId}`);
    return cachedDocId;
  }

  console.log("[instagramDocId] Fetching instagram.com to hunt for doc_ids...");

  const { data: html } = await axios.get("https://www.instagram.com/", {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  const allDocIds: string[] = [];

  // ─── 1) Inline <script> tags in HTML ───────────────────
  console.log("[instagramDocId] Scanning inline scripts in homepage HTML...");
  const inlineRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = inlineRegex.exec(html)) !== null) {
    const ids = await extractDocIdsFromJs(match[1]);
    allDocIds.push(...ids);
  }

  // ─── 2) External JS files ──────────────────────────────
  const scriptRegex = /<script[^>]+src="([^"]+)"[^>]*>/g;
  const scriptUrls: string[] = [];
  while ((match = scriptRegex.exec(html)) !== null) {
    const src = match[1];
    if (src.includes(".js")) {
      scriptUrls.push(src);
    }
  }

  console.log(`[instagramDocId] Found ${scriptUrls.length} external JS file(s)`);

  for (const url of scriptUrls.slice(0, 15)) {
    try {
      const fullUrl = url.startsWith("http") ? url : `https://www.instagram.com${url}`;
      const { data: js } = await axios.get(fullUrl, {
        headers: { "User-Agent": UA },
        timeout: 8000,
      });

      const ids = await extractDocIdsFromJs(js);
      if (ids.length > 0) {
        console.log(`[instagramDocId]   ${url.substring(url.lastIndexOf("/") + 1)} → ${ids.length} doc_id(s)`);
        allDocIds.push(...ids);
      }
    } catch {
      // skip failed fetches
    }
  }

  const uniqueIds = [...new Set(allDocIds)];
  console.log(`[instagramDocId] Collected ${uniqueIds.length} unique doc_id(s): ${uniqueIds.slice(0, 10).join(", ")}`);

  // ─── 3) Trial-and-error if we have cookies + shortcode ─
  if (shortcode && cookies && csrfToken && uniqueIds.length > 0) {
    console.log("[instagramDocId] Trial-and-error: testing each doc_id against the API...");

    for (const id of uniqueIds) {
      const works = await tryDocId(id, shortcode, cookies, csrfToken);
      if (works) {
        cachedDocId = id;
        return id;
      }
    }
  }

  // ─── Fallbacks ─────────────────────────────────────────
  const fallbacks = ["9510064595728286", "8845758582119845", "10015901848480474", "17991233890057762"];
  if (shortcode && cookies && csrfToken) {
    for (const fb of fallbacks) {
      if (uniqueIds.includes(fb)) continue; // already tried
      const works = await tryDocId(fb, shortcode, cookies, csrfToken);
      if (works) {
        cachedDocId = fb;
        return fb;
      }
    }
  }

  const FALLBACK = uniqueIds[0] || "8845758582119845";
  console.log(`[instagramDocId] Using fallback: ${FALLBACK}`);
  cachedDocId = FALLBACK;
  return FALLBACK;
}

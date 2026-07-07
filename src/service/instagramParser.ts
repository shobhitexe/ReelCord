export function formatPostInfo(requestData: any) {
  try {
    const mediaCapt = requestData.edge_media_to_caption.edges;
    const capt = mediaCapt.length === 0 ? "" : mediaCapt[0].node.text;

    return {
      owner_username: requestData.owner.username,
      owner_fullname: requestData.owner.full_name,
      is_verified: requestData.owner.is_verified,
      is_private: requestData.owner.is_private,
      likes: requestData.edge_media_preview_like.count,
      is_ad: requestData.is_ad,
      caption: capt,
    };
  } catch (err: any) {
    console.error("[instagramParser] Failed to format post info:", err.message);
    throw new Error(`Failed to format post info: ${err.message}`);
  }
}

export function formatMediaDetails(mediaData: any) {
  try {
    if (mediaData.is_video) {
      return {
        type: "video",
        dimensions: mediaData.dimensions,
        video_view_count: mediaData.video_view_count,
        url: mediaData.video_url,
        thumbnail: mediaData.display_url,
      };
    } else {
      return {
        type: "image",
        dimensions: mediaData.dimensions,
        url: mediaData.display_url,
      };
    }
  } catch (err: any) {
    console.error("[instagramParser] Failed to format media details:", err.message);
    throw new Error(`Failed to format media details: ${err.message}`);
  }
}

export function isSidecar(requestData: any): boolean {
  try {
    return requestData["__typename"] === "XDTGraphSidecar";
  } catch (err: any) {
    console.error("[instagramParser] Failed sidecar verification:", err.message);
    throw new Error(`Failed sidecar verification: ${err.message}`);
  }
}

export function createOutputData(requestData: any) {
  try {
    const url_list: string[] = [];
    const media_details: any[] = [];
    const IS_SIDECAR = isSidecar(requestData);

    if (IS_SIDECAR) {
      requestData.edge_sidecar_to_children.edges.forEach((media: any) => {
        media_details.push(formatMediaDetails(media.node));
        if (media.node.is_video) {
          url_list.push(media.node.video_url as string);
        } else {
          url_list.push(media.node.display_url as string);
        }
      });
    } else {
      media_details.push(formatMediaDetails(requestData));
      if (requestData.is_video) {
        url_list.push(requestData.video_url as string);
      } else {
        url_list.push(requestData.display_url as string);
      }
    }

    return {
      results_number: url_list.length,
      url_list,
      post_info: formatPostInfo(requestData),
      media_details,
    };
  } catch (err: any) {
    console.error("[instagramParser] Failed to create output data:", err.message);
    throw new Error(`Failed to create output data: ${err.message}`);
  }
}

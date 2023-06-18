export function isInstagramPostLink(link: string): boolean {
  const regex =
    /((?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([^/?#&]+)).*/g;
  return regex.test(link);
}

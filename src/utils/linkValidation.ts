export function isInstagramPostLink(link: string): boolean {
  const regex =
    /((?:https?:\/\/)?(?:www\.)?instagram\.com\/reel\/([^/?#&]+)).*/g;

  return regex.test(link);
}

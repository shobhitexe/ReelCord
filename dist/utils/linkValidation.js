"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInstagramPostLink = void 0;
function isInstagramPostLink(link) {
    const regex = /((?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([^/?#&]+)).*/g;
    return regex.test(link);
}
exports.isInstagramPostLink = isInstagramPostLink;
//# sourceMappingURL=linkValidation.js.map
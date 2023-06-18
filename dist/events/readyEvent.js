"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleReadyEvent = void 0;
const discord_js_1 = require("discord.js");
function handleReadyEvent(client) {
    return () => {
        var _a, _b, _c;
        console.log(`Ready! Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
        (_b = client.user) === null || _b === void 0 ? void 0 : _b.setPresence({ status: "online" });
        (_c = client.user) === null || _c === void 0 ? void 0 : _c.setActivity("Your Words", {
            type: discord_js_1.ActivityType.Watching,
        });
    };
}
exports.handleReadyEvent = handleReadyEvent;
//# sourceMappingURL=readyEvent.js.map
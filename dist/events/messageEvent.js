"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageHandler = void 0;
const getVideoData_1 = require("../service/getVideoData");
const linkValidation_1 = require("../utils/linkValidation");
const axios_1 = __importDefault(require("axios"));
function messageHandler(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (msg.author.bot)
            return;
        if (msg.attachments.size > 0)
            return;
        if ((0, linkValidation_1.isInstagramPostLink)(msg.content)) {
            const link = yield (0, getVideoData_1.fetchVideoData)(msg.content);
            const response = yield axios_1.default.get(link, { responseType: "stream" });
            msg
                .reply({
                files: [
                    {
                        attachment: response.data,
                        name: "linkPreviewBot.mp4",
                    },
                ],
            })
                .then(() => {
                console.log("Preview sent");
            })
                .catch((err) => {
                console.log({ error: err });
            });
        }
    });
}
exports.messageHandler = messageHandler;
//# sourceMappingURL=messageEvent.js.map
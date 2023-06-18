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
exports.fetchVideoData = void 0;
const axios_1 = __importDefault(require("axios"));
function fetchVideoData(link) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method: "GET",
            url: "https://instagram-media-downloader.p.rapidapi.com/rapid/post.php",
            params: {
                url: link,
            },
            headers: {
                "X-RapidAPI-Key": "12e439896dmsh578be7c646e4746p13f763jsn0d9db4287af7",
                "X-RapidAPI-Host": "instagram-media-downloader.p.rapidapi.com",
            },
            responseType: "json",
        };
        try {
            const response = yield (0, axios_1.default)(options);
            return response.data.video;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.fetchVideoData = fetchVideoData;
//# sourceMappingURL=getVideoData.js.map
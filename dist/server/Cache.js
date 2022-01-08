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
const node_fetch_1 = __importDefault(require("node-fetch"));
require("dotenv").config();
class Cache {
    static getSupportConditions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Cache.cached === null) {
                yield this.refreshSupportConditions();
            }
            else {
                const lastCachedAt = Cache.cached.createdAt;
                const diff = new Date().getTime() - lastCachedAt.getTime();
                // 1 day in milliseconds
                const diffToRefresh = 1000 * 60 * 60 * 24;
                if (diff > diffToRefresh) {
                    this.refreshSupportConditions();
                }
            }
            return Cache.cached.data;
        });
    }
    /**
     * supportCondition의 캐시를 다시 로딩합니다.
     * 다시 가져온 캐시는 파일에도 저장됩니다.
     */
    static refreshSupportConditions() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = new URL("gov24/v1/supportConditions", Cache.BASE_URL);
            const params = new URLSearchParams();
            params.append("perPage", "0");
            params.append("serviceKey", process.env.API_AUTH_KEY);
            url.search = params.toString();
            const body = yield (0, node_fetch_1.default)(url).then((res) => res.json());
            Cache.cached = {
                createdAt: new Date(),
                data: body.data
            };
        });
    }
}
exports.default = Cache;
Cache.BASE_URL = "https://api.odcloud.kr/api/";
Cache.cached = null;

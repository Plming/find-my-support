import * as fs from "fs";
import path from "path";
import fetch from "node-fetch";
require("dotenv").config();

interface SupportConditionCache {
  createdAt: Date;
  data: supportConditions_model[];
}

export default class Cache {
  private static readonly BASE_URL = "https://api.odcloud.kr/api/";

  private static cached: SupportConditionCache | null = null;

  public static async getSupportConditions(): Promise<supportConditions_model[]> {
    if (Cache.cached === null) {
      await this.refreshSupportConditions();
    } else {
      const lastCachedAt = Cache.cached.createdAt;
      const diff = new Date().getTime() - lastCachedAt.getTime();

      // 1 day in milliseconds
      const diffToRefresh = 1000 * 60 * 60 * 24;

      if (diff > diffToRefresh) {
        this.refreshSupportConditions();
      }
    }

    return Cache.cached!.data;
  }

  /**
   * supportCondition의 캐시를 다시 로딩합니다.
   * 다시 가져온 캐시는 파일에도 저장됩니다.
   */
  public static async refreshSupportConditions(): Promise<void> {
    const url = new URL("gov24/v1/supportConditions", Cache.BASE_URL);

    const params = new URLSearchParams();
    params.append("perPage", "0");
    params.append("serviceKey", process.env.API_AUTH_KEY!);
    url.search = params.toString();

    const body: supportConditions_api = await fetch(url).then((res) => res.json());

    Cache.cached = {
      createdAt: new Date(),
      data: body.data
    };
  }
}

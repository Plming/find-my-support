import fetch from "node-fetch";
require("dotenv").config();

interface SupportConditionCache {
  createdAt: Date;
  data: supportConditions_model[];
}

interface ServiceDetailCache {
  createdAt: Date,
  data: {
    [key: string]: serviceDetail_model
  }
}

export default class Cache {
  private static readonly BASE_URL = "https://api.odcloud.kr/api/";

  private static supportConditionCache: SupportConditionCache | null = null;
  private static serviceDetailCache: ServiceDetailCache | null = null;

  public static async getSupportConditions(): Promise<supportConditions_model[]> {
    if (Cache.supportConditionCache === null) {
      await this.refreshSupportConditions();
    } else {
      const lastCachedAt = Cache.supportConditionCache.createdAt;
      const diff = new Date().getTime() - lastCachedAt.getTime();

      // 1 day in milliseconds
      const diffToRefresh = 1000 * 60 * 60 * 24;

      if (diff > diffToRefresh) {
        this.refreshSupportConditions();
      }
    }

    return Cache.supportConditionCache!.data;
  }

  public static async getServiceDetail(SVC_ID: string): Promise<serviceDetail_model> {
    if (Cache.serviceDetailCache === null) {
      await this.refreshServiceDetail();
    }

    return Cache.serviceDetailCache!.data[SVC_ID];
  }

  public static async refreshSupportConditions(): Promise<void> {
    const url = new URL("gov24/v1/supportConditions", Cache.BASE_URL);

    const params = new URLSearchParams();
    params.append("perPage", "0");
    params.append("serviceKey", process.env.API_AUTH_KEY!);
    url.search = params.toString();

    const body: supportConditions_api = await fetch(url).then((res) => res.json());

    Cache.supportConditionCache = {
      createdAt: new Date(),
      data: body.data
    };
  }

  public static async refreshServiceDetail(): Promise<void> {
    const url = new URL("gov24/v1/serviceDetail", Cache.BASE_URL);

    const params = new URLSearchParams();
    params.append("perPage", "0");
    params.append("serviceKey", process.env.API_AUTH_KEY!);
    url.search = params.toString();

    const body: serviceDetail_api = await fetch(url).then((res) => res.json());
    const result: { [key: string]: serviceDetail_model } = {};
    for (const s of body.data) {
      result[s.SVC_ID] = s;
    }

    Cache.serviceDetailCache = {
      createdAt: new Date(),
      data: result
    };
  }
}

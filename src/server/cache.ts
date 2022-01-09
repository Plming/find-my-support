import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

interface ServiceDetailCache {
  [key: ServiceDetailModel["SVC_ID"]]: ServiceDetailModel
}

export async function getSupportConditions(): Promise<SupportConditionsModel[]> {
  return supportConditions;
}

export async function getServiceDetailOrNull(serviceId: string): Promise<ServiceDetailModel | null> {
  return serviceId in serviceDetails
    ? serviceDetails[serviceId]
    : null;
}

let supportConditions: SupportConditionsModel[];
let serviceDetails: ServiceDetailCache;

initalize()

async function initalize(): Promise<void> {
  // 1. caching support conditions
  await fetch(url("supportConditions", 0))
    .then(res => res.json())
    .then((body: SupportConditionsApi) => {
      supportConditions = body["data"];
    });

  // 2. check totalCount of service detail
  const totalCount = await fetch(url("serviceDetail", 1))
    .then(res => res.json())
    .then((body: ServiceDetailApi) => body["totalCount"]);

  // 3. caching service detail
  await fetch(url("serviceDetail", totalCount))
    .then(res => res.json())
    .then((body: ServiceDetailApi) => {
      serviceDetails = {};

      for (const s of body.data) {
        const serviceId = s.SVC_ID;
        serviceDetails[serviceId] = s;
      }
    });

  console.log("caching api result done!");
}

function url(resources: string, perPage: number): string {
  const BASE_URL = "https://api.odcloud.kr/api";

  return `${BASE_URL}/gov24/v1/${resources}?perPage=${perPage}&serviceKey=${process.env.API_AUTH_KEY}`;
}
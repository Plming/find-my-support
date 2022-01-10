import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

let supportConditions: SupportConditionsModel[];

export async function getSupportConditions(): Promise<SupportConditionsModel[]> {
  return supportConditions;
}

export async function initalize(): Promise<void> {
  // caching support conditions
  await fetch(url("supportConditions", 0))
    .then(res => res.json())
    .then((body: SupportConditionsApi) => {
      supportConditions = body["data"];
    });

  console.log("caching api result done!");
}

function url(resources: string, perPage: number): string {
  const BASE_URL = "https://api.odcloud.kr/api";

  return `${BASE_URL}/gov24/v1/${resources}?perPage=${perPage}&serviceKey=${process.env.API_AUTH_KEY}`;
}
require("dotenv").config();

const fetch = require("node-fetch");
const base = "https://api.odcloud.kr/api/gov24/v1/";
const API_AUTH_KEY = process.env.API_AUTH_KEY;
const fs = require("fs");

async function fetchFromApi(url) {
  const response = await fetch(url);
  const result = await response.json();

  // assert(response.status === 200, jsonOut.msg);

  return result;
}

async function main() {
  let result = [];

  const url = new URL("supportConditions", base);
  let currentPage = 1;
  let totalCount = 0;
  while (true) {
    url.search = new URLSearchParams({
      page: currentPage,
      perPage: 10,
      serviceKey: API_AUTH_KEY,
    });

    const body = await fetchFromApi(url);
    if (body.currentCount === 0) {
      break;
    }

    totalCount += body.currentCount;

    result = result.concat(body.data);
    ++currentPage;
    // console.log(body);
  }

  fs.writeFileSync("conditions.json", JSON.stringify(result));
  console.log(`total ${totalCount} items get!!`);
}

main();

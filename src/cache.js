"use strict";
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const cacheDirectory = path.resolve(__dirname, "../cache");

let supportConditions = JSON.parse(
  fs.readFileSync(cacheDirectory + "/supportConditions.json")
);

async function reloadSupportConditions() {
  let result = [];

  const url = new URL("supportConditions", base);
  let currentPage = 1;
  while (true) {
    url.search = new URLSearchParams({
      page: currentPage,
      perPage: 10,
      serviceKey: API_AUTH_KEY,
    });
    const body = await fetch(url).then((res) => res.json());
    if (body.currentCount === 0) {
      break;
    }

    result = result.concat(body.data);
    ++currentPage;
  }

  supportConditions = result;
  fs.writeFileSync("conditions.json", JSON.stringify(result));
}

function getSupportConditions() {
  return supportConditions;
}

module.exports = {
  getSupportConditions,
  reloadSupportConditions,
};

"use strict";

require("dotenv").config(); // load API_AUTH_KEY in local
const assert = require("assert");
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT ?? 3000;
const base = "https://api.odcloud.kr/api/gov24/v1/";
const API_AUTH_KEY = process.env.API_AUTH_KEY;
const htmlPath = path.resolve(__dirname, "views");

app.set("views", "views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/entry", (req, res) => {
  res.render("entry");
});

app.get("/result", async (req, res) => {
  const url = new URL("serviceList", base);
  url.search = new URLSearchParams({
    page: 1,
    perPage: 10,
    serviceKey: API_AUTH_KEY,
  });

  const data = await fetchFromApi(url.toString());

  let listToShow = [];
  for (let i = 0; i < data.length; ++i) {
    if (!(await canServiced(req.query, data[i]["서비스ID"]))) {
      continue;
    }

    // HACK: manipulate url
    data[i]["상세조회URL"] = data[i]["상세조회URL"].replace(
      "//gov.kr",
      "//www.gov.kr"
    );

    listToShow.push(data[i]);

    // TODO: in development
    if (listToShow.length >= 4) {
      break;
    }
  }

  res.render("result", { serviceList: listToShow });
});

app.listen(port, () => {
  assert(API_AUTH_KEY !== undefined, "there's no api key.");

  console.log(`Express app listening at port ${port}`);
});

async function fetchFromApi(url) {
  const response = await fetch(url);
  const jsonOut = await response.json();

  assert(response.status === 200, jsonOut.msg);

  return jsonOut.data;
}

async function canServiced(conditionQuery, serviceId) {
  const url = new URL("supportConditions", base);
  url.search = new URLSearchParams({
    "cond[SVC_ID::EQ]": serviceId,
    serviceKey: API_AUTH_KEY,
  });

  const data = await fetchFromApi(url.toString());

  const conditions = data[0];

  // TODO: there's a service list that no support conditions provided
  if (conditions === undefined) {
    return true;
  }

  for (const [_, value] of Object.entries(conditionQuery)) {
    if (value === "") {
      continue;
    }

    if (conditions[value] !== "Y") {
      return false;
    }
  }

  return true;
}

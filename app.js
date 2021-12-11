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

app.use("/public", express.static(__dirname + "/public"));

app.set("views", "views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/entry", (req, res) => {
  res.render("entry");
});

app.get("/result", async (req, res) => {
  let result = [];
  let currentPage = 0;

  while (result.length < 10) {
    const url = new URL("serviceList", base);
    url.search = new URLSearchParams({
      page: currentPage,
      perPage: 10,
      serviceKey: API_AUTH_KEY,
    });

    let body = await fetchFromApi(url.toString());
    console.log(currentPage + " called");
    if (body.currentCount === 0) {
      break;
    }

    let list = body.data;
    for (let i = 0; i < list.length; ++i) {
      if (!(await canServiced(req.query, list[i]["서비스ID"]))) {
        continue;
      }

      // HACK: manipulate url
      list[i]["상세조회URL"] = list[i]["상세조회URL"].replace(
        "//gov.kr",
        "//www.gov.kr"
      );

      result.push(list[i]);
    }

    ++currentPage;
  }

  res.render("result", { serviceList: result });
});

app.listen(port, () => {
  assert(API_AUTH_KEY !== undefined, "there's no api key.");

  console.log(`Express app listening at port ${port}`);
});

async function fetchFromApi(url) {
  const response = await fetch(url);
  const result = await response.json();

  // assert(response.status === 200, jsonOut.msg);

  return result;
}

async function canServiced(conditionQuery, serviceId) {
  const url = new URL("supportConditions", base);
  url.search = new URLSearchParams({
    "cond[SVC_ID::EQ]": serviceId,
    page: 1,
    perPage: 1,
    serviceKey: API_AUTH_KEY,
  });

  const body = await fetchFromApi(url.toString());
  // TODO: there's a service list that no support conditions provided
  if (body.currentCount === 0) {
    return true;
  }

  const conditions = body.data[0];
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

//@ts-check
"use strict";

require("dotenv").config(); // load API_AUTH_KEY in local
const assert = require("assert");
const express = require("express");
const fetch = require("node-fetch");

const isAvailable = require("./isAvailable");
const Cache = require("./Cache").default;

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
  const availableServices = [];

  const conditions = await Cache.getSupportConditions();

  for (const c of conditions) {
    if (isAvailable(req.query, c)) {
      availableServices.push(c["SVC_ID"]);
    }
  }

  const details = [];
  const url = new URL("serviceDetail", base);
  for (const s of availableServices) {
    url.search = (new URLSearchParams({
      "cond[SVC_ID::EQ]": s,
      serviceKey: API_AUTH_KEY,
    })).toString();

    // @ts-ignore
    const body = await fetch(url.toString()).then((res) => res.json());
    details.push(body.data[0]);
  }

  res.render("result", { serviceList: details });
});

app.listen(port, () => {
  assert(API_AUTH_KEY !== undefined, "there's no api key.");
  console.log(`Express app listening at port ${port}`);
});

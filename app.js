"use strict";

// load API_AUTH_KEY in local
require("dotenv").config();

const assert = require("assert");
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT ?? 3000;
const API_AUTH_KEY = process.env.API_AUTH_KEY;
const htmlPath = path.resolve(__dirname, "views");

const base = "https://api.odcloud.kr/api/gov24/v1";
const target = `${base}/serviceList?page=1&perPage=10&serviceKey=${API_AUTH_KEY}`;

app.set("views", "views");
app.set("view engine", "ejs");

app.use("/js", express.static("js"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(htmlPath, "index.html"));
});

app.get("/result", (req, res) => {
  let count = 0;
  let serviceList = [];

  fetch(target)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      const data = json.data;
      console.log(json);

      for (let i = 0; i < data.length; ++i) {
        serviceList.push(data[i]);

        ++count;
        if (count > 4) {
          res.render("result", { serviceList: serviceList });
          return;
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });

  /*
  let data = req.query;
  console.log(`${req.query.toString()}: ${req.query.name}`);
  */
});

app.listen(port, () => {
  assert(API_AUTH_KEY !== undefined, "there's no api key.");

  console.log(`Express app listening at port ${port}`);
});

"use strict";
const fs = require("fs");
const path = require("path");

const supportConditionsPath = path.resolve(
  __dirname,
  "../cache/supportConditions.json"
);

let supportConditions = JSON.parse(fs.readFileSync(supportConditionsPath));

function load() {
  supportConditions = JSON.parse(fs.readFileSync(supportConditionsPath));
}

function getSupportConditions() {
  return supportConditions;
}

module.exports = {
    getSupportConditions
};

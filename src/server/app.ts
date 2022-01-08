import dotenv from "dotenv";
import express from "express";
import process from "process";

import isAvailable from "./isAvailable";
import Cache from "./cache_foo";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

// app configs
app.use("/public", express.static(__dirname + "/public"));
app.set("views", "views");
app.set("view engine", "ejs");

// routes
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
    for (const s of availableServices) {
        const item = await Cache.getServiceDetail(s);
        if (item !== undefined) {
            details.push(item);
        }
    }
    res.render("result", { serviceList: details });
});

app.listen(port, () => {
    if (process.env.API_AUTH_KEY === undefined) {
        console.error("There's no API_AUTH_KEY in .env file!");
        process.exit(1);
    }

    console.log(`Express app is running on http://find-my-support.herokuapp.com`);
});
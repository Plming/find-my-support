import dotenv from "dotenv";
import express from "express";
import process from "process";
import path from "path";

import isAvailable from "./isAvailable";
import * as Cache from "./cache";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

// app configs
app.use("/public", express.static(path.join(__dirname, "../../public")));
app.use("/public", express.static(path.join(__dirname, "../../dist/client")));
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
    const availableServiceIdList: string[] = [];

    const conditions: SupportConditionsModel[] = await Cache.getSupportConditions();
    for (const c of conditions) {
        if (isAvailable(req.query, c)) {
            availableServiceIdList.push(c["SVC_ID"]);
        }
    }

    const details: ServiceDetailModel[] = [];
    for (const serviceId of availableServiceIdList) {
        const item = await Cache.getServiceDetailOrNull(serviceId);
        if (item !== null) {
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

    switch (process.env.NODE_ENV) {
        case "production":
            console.log(`Express app is running on http://find-my-support.herokuapp.com`);
            break;

        case "development":
            console.log(`Express app is running on http://localhost:${port}`);
            break;

        default:
            console.log("NODE_ENV is not set!");
            break;
    }
});
import express from "express";
import path from "path";

import { isAvailable } from "./isAvailable";
import * as Cache from "./cache";
import * as db from "./database";

const app = express();

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
        const matched = await db.serviceDetail.findOne({ SVC_ID: serviceId });
        if (matched !== null) {
            details.push(matched);
        }
    }

    res.render("result", { serviceList: details });
});

export default app;

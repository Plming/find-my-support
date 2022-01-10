import express from "express";
import path from "path";

import { getIndex } from "./controllers/index";
import { getEntry } from "./controllers/entry";
import { getResult } from "./controllers/result";

const app = express();

// app configs
app.use("/public", express.static(path.join(__dirname, "../../public")));
app.use("/public", express.static(path.join(__dirname, "../../dist/client")));
app.set("views", "views");
app.set("view engine", "ejs");

// routes
app.get("/", getIndex);
app.get("/entry", getEntry);
app.get("/result", getResult);

export default app;

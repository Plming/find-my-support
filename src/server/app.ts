import express from "express";
import path from "path";

import { getResult } from "./controllers/result";

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

app.get("/entry", (req, res)=> {
    res.render("entry");
});

app.get("/result", getResult);

export default app;

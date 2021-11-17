const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT;

const htmlPath = path.resolve(__dirname, "html");

app.get("/", (req, res) => {
  res.sendFile(path.resolve(htmlPath, "index.html"));
});

app.get("/result", (req, res) => {
  res.sendFile(path.resolve(htmlPath, "result.html"));
});

app.listen(port, () => {
  console.log(`Express app listening at port ${port}`);
});

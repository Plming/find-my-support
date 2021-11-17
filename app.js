const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "home.html"));
});

app.listen(PORT, () => {
  console.log(`Express app listening at port ${PORT}`);
});

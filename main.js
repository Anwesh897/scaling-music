const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Do not go gentle into that good night");
});

const port = process.env.PORT || 4321;

app.listen(port, () => console.log(`server is running on port ${port}`));

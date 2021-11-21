const { getPrices } = require("./scripts/get_prices.js");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3333;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/find/:id", async (req, res) => {
  const prices = await getPrices(req.params.id);
  res.send(prices);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

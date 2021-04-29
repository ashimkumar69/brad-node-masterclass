const express = require("express");
const dotenv = require("dotenv");
// const router = express.Router();
dotenv.config({ path: "config/config.env" });
const app = express();

if (process.env.NODE_ENV === "production") {
  app.get("/api/", (req, res, next) => {
    res.status(200).json("index page");
  });
} else {
  app.get("/", (req, res, next) => {
    res.status(200).json("index page");
  });
}

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(
    ` server running in ${process.env.NODE_ENV} mode on port: ${PORT}`
  );
});

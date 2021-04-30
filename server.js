const express = require("express");
const dotenv = require("dotenv");
const bootcamps = require("./routes/bootcamps");

const morgan = require("morgan");
dotenv.config({ path: "config/config.env" });
const app = express();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(
    ` server running in ${process.env.NODE_ENV} mode on port: ${PORT}`
  );
});

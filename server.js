const express = require("express");
const dotenv = require("dotenv");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/db");
const colors = require("colors");
colors.setTheme({
  silly: "rainbow",
  input: "grey",
  verbose: "cyan",
  prompt: "grey",
  info: "green",
  data: "grey",
  help: "cyan",
  warn: "yellow",
  debug: "blue",
  error: "red",
  success: ["green", "underline", "bold"],
});

const morgan = require("morgan");
dotenv.config({ path: "config/config.env" });
connectDB();
const app = express();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(
    ` server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.success
  );
});

process.on("unhandledRejection", (error, promise) => {
  console.log(`Error: ${error.message}`.error);
  server.close(() => process.exit(1));
});

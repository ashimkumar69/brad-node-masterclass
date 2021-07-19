const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/User");
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

// env file
dotenv.config({ path: "config/config.env" });

// db connect
mongoose.connect(process.env.MONG_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const bootcampData = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courseData = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
const usersData = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

async function insertBootcamp() {
  try {
    await Bootcamp.create(bootcampData);
    await Course.create(courseData);
    await User.create(usersData);
    console.log("Insert Bootcamp successfully".success);
    // exit on success
    process.exit();
  } catch (error) {
    console.log(error);
    // exit on error
    process.exit(1);
  }
}

async function destroyBootcamp() {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    console.log("Delete Bootcamp successfully".error);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

if (process.argv[2] === "-i") {
  insertBootcamp();
} else if (process.argv[2] === "-d") {
  destroyBootcamp();
}

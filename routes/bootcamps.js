const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  getBootcampsByFilter,
} = require("../controllers/bootcamps");
const router = express.Router();

const courseRoute = require("./courses");
// redirect to other route
router.use("/:bootcampId/courses", courseRoute);

router.get("/", getBootcampsByFilter);
router.get("/radius/:zipcode/:distance", getBootcampInRadius);
router.get("/", getBootcamps).post("/", createBootcamp);
router
  .get("/:id", getBootcamp)
  .put("/:id", updateBootcamp)
  .delete("/:id", deleteBootcamp);

module.exports = router;

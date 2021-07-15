const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  getBootcampsByFilter,
  uploadPhotoBootcamp,
} = require("../controllers/bootcamps");
const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");

const router = express.Router();

const courseRoute = require("./courses");
// redirect to other route
router.use("/:bootcampId/courses", courseRoute);

router.route("/:id/photo").put(uploadPhotoBootcamp);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcampsByFilter);
router.get("/", getBootcamps).post("/", createBootcamp);
router.get("/radius/:zipcode/:distance", getBootcampInRadius);
router
  .get("/:id", getBootcamp)
  .put("/:id", updateBootcamp)
  .delete("/:id", deleteBootcamp);

module.exports = router;

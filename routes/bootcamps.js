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

const { protect, authorize } = require("../middleware/auth");

// redirect to other route
router.use("/:bootcampId/courses", courseRoute);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), uploadPhotoBootcamp);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcampsByFilter);
router
  .get("/", getBootcamps)
  .post("/", protect, authorize("publisher", "admin"), createBootcamp);
router.get("/radius/:zipcode/:distance", getBootcampInRadius);
router
  .get("/:id", getBootcamp)
  .put("/:id", protect, authorize("publisher", "admin"), updateBootcamp)
  .delete("/:id", protect, authorize("publisher", "admin"), deleteBootcamp);

module.exports = router;

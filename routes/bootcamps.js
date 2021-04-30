const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamps");
const router = express.Router();

router.get("/", getBootcamps).post("/", createBootcamp);
router
  .get("/:id", getBootcamp)
  .put("/:id", updateBootcamp)
  .delete("/:id", deleteBootcamp);

module.exports = router;

const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

// @desc get all Courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public
const getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc get Single Courses
// @route GET /api/v1/courses
// @route GET /api/v1/courses/:id
// @access public
const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: course });
});

// @desc add course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access Private
const addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `bootcamp not found with id: ${req.params.bootcampId}`,
        404
      )
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User  ${req.user.id} is not authorize to add course to bootcamp id: ${bootcamp._id}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);
  res.status(200).json({ success: true, data: course });
});

// @desc Update course
// @route PUT /api/v1/courses/:id
// @access Private
const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`course not found with id: ${req.params.id}`, 404)
    );
  }

  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User  ${req.user.id} is not authorize for update Course id: ${course._id}`,
        404
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

// @desc Update course
// @route PUT /api/v1/courses/:id
// @access Private
const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`course not found with id: ${req.params.id}`, 404)
    );
  }

  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User  ${req.user.id} is not authorize for delete Course id: ${course._id}`,
        404
      )
    );
  }

  await course.remove();

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};

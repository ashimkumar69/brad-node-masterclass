const Bootcamp = require("../models/Bootcamp");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
// const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middleware/asyncHandler");
// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
const getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
// @desc get Details of bootcamps
// @route GET /api/v1/bootcamps/:id
// @access public
const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Create bootcamps
// @route POST /api/v1/bootcamps/:id
// @access public
const createBootcamp = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `the user with id: ${req.user.id} has already published`,
        404
      )
    );
  }
  const bootcamp = await Bootcamp.create(req.body);
  res.status(200).json({ success: true, data: bootcamp });
});
// @desc update bootcamps
// @route PUT /api/v1/bootcamps/:id
// @access public
const updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User  ${req.user.id} is not authorize for update Bootcamp`,
        404
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: bootcamp });
});
// @desc Delete bootcamps
// @route DELETE /api/v1/bootcamps/:id
// @access public
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
    );
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User  ${req.user.id} is not authorize for delete Bootcamp`,
        404
      )
    );
  }
  bootcamp.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc get bootcamps with in radius
// @route DELETE /api/v1/bootcamps/radius/:zipcode/:distance
// @access public
const getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { distance, zipcode } = req.params;
  // const lon = await geocoder.geocode(zipcode);
  // const lng = loc[0].longitude;
  // const lat = loc[0].latitude;

  const lng = 48.8698679;
  const lat = 2.3072976;
  // earth radius 3963 mi 6378 km

  const radius = distance / 6378;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc get all bootcamps bt filter
// @route GET /api/v1/bootcamps
// @access public
const getBootcampsByFilter = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc upload photo for bootcamps
// @route put /api/v1/bootcamps/:id/photo
// @access public
const uploadPhotoBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User  ${req.user.id} is not authorize for update Bootcamp`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Bootcamp File not found`, 400));
  }
  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`please upload an image`, 400));
  }
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `please upload an image size less then ${process.env.MAX_FILE_SIZE}`,
        400
      )
    );
  }
  // custom file name

  file.name = `photo_${bootcamp.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) return next(new ErrorResponse(`file move path problem`, 400));
    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  getBootcampsByFilter,
  uploadPhotoBootcamp,
};

const Bootcamp = require("../models/Bootcamp");
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
  const bootcamp = await Bootcamp.create(req.body);
  res.status(200).json({ success: true, data: bootcamp });
});
// @desc update bootcamps
// @route PUT /api/v1/bootcamps/:id
// @access public
const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
// @desc Delete bootcamps
// @route DELETE /api/v1/bootcamps/:id
// @access public
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
    );
  }
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
  console.log(req.query);

  const reqQuery = { ...req.query };
  let query;
  let queryStr;

  const removeField = ["select", "sort", "page", "limit"];
  removeField.forEach((params) => delete reqQuery[params]);

  queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lte|lt|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr));

  if (req.query.select) {
    const string = req.query.select.split(",").join(" ");
    query = query.select(string);
  }

  if (req.query.sort) {
    const sort = req.query.sort.split(",").join(" ");
    query = query.sort(sort);
  } else {
    query = query.sort("-createdAt");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;

  // pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res
    .status(200)
    .json({
      success: true,
      count: bootcamps.length,
      pagination,
      data: bootcamps,
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
};

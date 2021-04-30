// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
const getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, meg: "Show All Bootcamps" });
};
// @desc get Details of bootcamps
// @route GET /api/v1/bootcamps/:id
// @access public
const getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, meg: `Show Details of Bootcamp ${req.params.id}` });
};

// @desc Create bootcamps
// @route POST /api/v1/bootcamps/:id
// @access public
const createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, meg: "Create New Bootcamps" });
};
// @desc update bootcamps
// @route PUT /api/v1/bootcamps/:id
// @access public
const updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, meg: `Update Bootcamp ${req.params.id}` });
};
// @desc Delete bootcamps
// @route DELETE /api/v1/bootcamps/:id
// @access public
const deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, meg: `Delete Single Bootcamps ${req.params.id}` });
};

module.exports = {
    getBootcamps,
    getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};

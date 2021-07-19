const express = require("express");

// logout,
// forgotPassword,
// resetPassword,
// updateDetails,
// updatePassword
const { register, login, getMe } = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
// router.get('/logout', logout);
router.get("/me", protect, getMe);
// router.put('/updatedetails', protect, updateDetails);
// router.put('/updatepassword', protect, updatePassword);
// router.post('/forgotpassword', forgotPassword);
// router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;

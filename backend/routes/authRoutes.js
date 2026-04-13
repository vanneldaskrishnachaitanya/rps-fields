const express = require("express");
const router  = express.Router();
const { register, login, logout, getMe, updateCatalogState, getCart, updateCart, forgotPassword, verifyOtp, resetPassword } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register",         register);
router.post("/login",            login);
router.get("/me",                protect, getMe);
router.post("/logout",           logout);
router.get("/cart",              protect, getCart);
router.put("/cart",              protect, updateCart);
router.put("/catalog-state",     protect, updateCatalogState);
router.post("/forgot-password",  forgotPassword);
router.post("/verify-otp",       verifyOtp);
router.post("/reset-password",   resetPassword);

module.exports = router;

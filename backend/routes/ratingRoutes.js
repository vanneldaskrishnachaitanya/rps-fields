const express = require("express");
const router  = express.Router();
const {
  createRating, getProductRatings,
  getFarmerRating, getEligibleRatings,
} = require("../controllers/ratingController");
const { protect, requireRole } = require("../middleware/auth");

router.post("/",                       protect, requireRole("customer"), createRating);
router.get("/product/:productId",      getProductRatings);
router.get("/farmer/:farmerId",        getFarmerRating);
router.get("/eligible/:orderId",       protect, requireRole("customer"), getEligibleRatings);

module.exports = router;

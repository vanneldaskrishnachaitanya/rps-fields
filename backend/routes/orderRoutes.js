const express = require("express");
const router  = express.Router();
const {
  createOrder, getMyOrders, getOrder,
  getFarmerOrders, getAgentOrders, getAllOrders,
  startDelivery, markOutForDelivery, verifyOTPAndDeliver, getOrderTracking,
} = require("../controllers/orderController");
const { protect, requireRole } = require("../middleware/auth");

router.post("/",              protect, requireRole("customer"), createOrder);
router.get("/",               protect, requireRole("customer"), getMyOrders);
router.get("/:id",            protect, getOrder);
router.get("/:id/track",      protect, getOrderTracking);
router.post("/:id/start-delivery",    protect, requireRole("agent"), startDelivery);
router.post("/:id/out-for-delivery",  protect, requireRole("agent"), markOutForDelivery);
router.post("/:id/verify-otp",        protect, requireRole("agent"), verifyOTPAndDeliver);
router.get("/farmer/orders",  protect, requireRole("farmer"),   getFarmerOrders);
router.get("/agent/orders",   protect, requireRole("agent"),    getAgentOrders);
router.get("/admin/all",      protect, requireRole("admin"),    getAllOrders);

module.exports = router;

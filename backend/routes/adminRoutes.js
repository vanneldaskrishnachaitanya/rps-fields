const express = require("express");
const router  = express.Router();
const {
  getUsers, setUserStatus, deleteUser,
  getFarmersWithRatings,
  getProducts, removeProduct,
  getStats,
} = require("../controllers/adminController");
const { protect, requireRole } = require("../middleware/auth");

const adminOnly = [protect, requireRole("admin")];

router.get("/stats",                ...adminOnly, getStats);
router.get("/users",                ...adminOnly, getUsers);
router.put("/users/:id/status",     ...adminOnly, setUserStatus);
router.delete("/users/:id",         ...adminOnly, deleteUser);
router.get("/farmers",              ...adminOnly, getFarmersWithRatings);
router.get("/products",             ...adminOnly, getProducts);
router.delete("/products/:id",      ...adminOnly, removeProduct);
router.get("/orders",               ...adminOnly, (req, res) => {
  // Re-use the order controller's getAllOrders via import
  require("../controllers/orderController").getAllOrders(req, res);
});

module.exports = router;

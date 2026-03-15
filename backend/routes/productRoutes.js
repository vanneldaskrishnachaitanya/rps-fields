const express = require("express");
const router  = express.Router();
const {
  getProducts, getProduct,
  createProduct, updateProduct, deleteProduct,
} = require("../controllers/productController");
const { protect, requireRole } = require("../middleware/auth");

router.get("/",     getProducts);
router.get("/:id",  getProduct);
router.post("/",    protect, requireRole("agent"),         createProduct);
router.put("/:id",  protect, requireRole("agent", "admin"), updateProduct);
router.delete("/:id", protect, requireRole("agent", "admin"), deleteProduct);

module.exports = router;

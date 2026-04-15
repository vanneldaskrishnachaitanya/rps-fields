const Product = require("../models/Product");
const User    = require("../models/User");
const Notification = require("../models/Notification");

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, search, farmerId, agentId } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (farmerId) filter.farmerId = farmerId;
    if (agentId)  filter.agentId  = agentId;
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter)
      .populate("farmerId", "name fullName city location")
      .populate("agentId",  "name fullName")
      .sort({ createdAt: -1 });

    // Shape data for frontend compatibility
    const shaped = products.map(shapeProduct);
    res.json({ success: true, products: shaped });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("farmerId", "name fullName city location mobile phone")
      .populate("agentId",  "name fullName mobile phone");
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });
    res.json({ success: true, product: shapeProduct(product) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/products  (agent only)
const createProduct = async (req, res) => {
  try {
    const { name, category, pricePerKg, price, quantity, qty,
            description, farmerId, image, img } = req.body;

    const resolvedPrice = pricePerKg || price;
    const resolvedQty   = quantity   || qty;
    const resolvedImg   = image      || img;

    if (!name)         return res.status(400).json({ success: false, error: "Product name required" });
    if (!category)     return res.status(400).json({ success: false, error: "Category required" });
    if (!resolvedPrice)return res.status(400).json({ success: false, error: "Price required" });
    if (!resolvedQty)  return res.status(400).json({ success: false, error: "Quantity required" });
    if (!description)  return res.status(400).json({ success: false, error: "Description required" });
    if (!farmerId)     return res.status(400).json({ success: false, error: "Farmer ID required" });

    const farmer = await User.findById(farmerId);
    if (!farmer || farmer.role !== "farmer")
      return res.status(400).json({ success: false, error: "Invalid farmer ID" });

    const product = await Product.create({
      name, category,
      pricePerKg: parseFloat(resolvedPrice),
      price:      parseFloat(resolvedPrice),
      quantity:   parseInt(resolvedQty),
      qty:        parseInt(resolvedQty),
      description,
      farmerId,
      agentId: req.user._id,
      image: resolvedImg || "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80",
      img:   resolvedImg || "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80",
    });

    const populated = await product.populate([
      { path: "farmerId", select: "name fullName city location" },
      { path: "agentId",  select: "name fullName" },
    ]);

    await Notification.create({
      recipientId: null, // global
      type: "product",
      title: "New Product Available!",
      message: `${name} has just been added to the market. Check it out!`,
      productId: product._id
    }).catch(()=>{});

    res.status(201).json({ success: true, product: shapeProduct(populated) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/products/:id  (agent who created it, or admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });

    const isAgent = req.user.role === "agent" && product.agentId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isAgent && !isAdmin)
      return res.status(403).json({ success: false, error: "Not authorised to edit this product" });

    const allowed = ["name", "category", "pricePerKg", "price", "quantity", "qty",
                     "description", "image", "img"];
    allowed.forEach(k => {
      if (req.body[k] !== undefined) product[k] = req.body[k];
    });
    // Keep aliases in sync
    if (req.body.pricePerKg) product.price = req.body.pricePerKg;
    if (req.body.price)      product.pricePerKg = req.body.price;
    if (req.body.quantity)   product.qty = req.body.quantity;
    if (req.body.qty)        product.quantity = req.body.qty;
    if (req.body.image)      product.img = req.body.image;
    if (req.body.img)        product.image = req.body.img;

    await product.save();
    const populated = await product.populate([
      { path: "farmerId", select: "name fullName city location" },
      { path: "agentId",  select: "name fullName" },
    ]);
    res.json({ success: true, product: shapeProduct(populated) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/products/:id  (agent or admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });

    const isAgent = req.user.role === "agent" && product.agentId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isAgent && !isAdmin)
      return res.status(403).json({ success: false, error: "Not authorised" });

    await product.deleteOne();
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Helper — shape MongoDB doc to match existing frontend expectations
function shapeProduct(p) {
  const obj = p.toObject ? p.toObject() : p;
  const farmer = obj.farmerId;
  return {
    ...obj,
    id: obj._id?.toString(),
    price:      obj.pricePerKg || obj.price,
    qty:        obj.quantity   || obj.qty,
    img:        obj.image      || obj.img,
    farmerName:     farmer?.fullName || farmer?.name || "",
    farmerLocation: farmer?.city    || farmer?.location || "",
    agentName:  obj.agentId?.fullName || obj.agentId?.name || "",
  };
}

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };

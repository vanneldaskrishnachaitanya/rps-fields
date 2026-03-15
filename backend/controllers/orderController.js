const Order   = require("../models/Order");
const Product = require("../models/Product");

// POST /api/orders  (customer)
const createOrder = async (req, res) => {
  try {
    const { items, address, city, phone,
            deliveryAddress } = req.body;

    const resolvedAddress = deliveryAddress || address;
    if (!items?.length)    return res.status(400).json({ success: false, error: "Cart is empty" });
    if (!resolvedAddress)  return res.status(400).json({ success: false, error: "Delivery address required" });
    if (!city)             return res.status(400).json({ success: false, error: "City required" });
    if (!phone)            return res.status(400).json({ success: false, error: "Phone required" });

    const orderItems = [];
    const farmerIds  = new Set();
    const agentIds   = new Set();

    for (const item of items) {
      const productId = item.id || item.productId;
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ success: false, error: `Product ${item.name || productId} not found` });

      const qty = parseInt(item.qty || item.quantity);
      if (product.quantity < qty)
        return res.status(400).json({ success: false, error: `Only ${product.quantity}kg of ${product.name} available` });

      // Deduct stock
      product.quantity -= qty;
      product.qty      -= qty;
      await product.save();

      const pricePerKg = product.pricePerKg || product.price;
      orderItems.push({
        productId: product._id,
        name:      product.name,
        pricePerKg,
        quantity:  qty,
        totalPrice: pricePerKg * qty,
        image:     product.image || product.img,
        farmerId:  product.farmerId,
        agentId:   product.agentId,
      });
      if (product.farmerId) farmerIds.add(product.farmerId.toString());
      if (product.agentId)  agentIds.add(product.agentId.toString());
    }

    const totalPrice = orderItems.reduce((s, i) => s + i.totalPrice, 0);

    const order = await Order.create({
      customerId:      req.user._id,
      items:           orderItems,
      totalPrice,
      deliveryAddress: resolvedAddress,
      city,
      phone,
      farmerIds: [...farmerIds],
      agentIds:  [...agentIds],
    });

    res.status(201).json({ success: true, order: shapeOrder(order) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/orders  (customer: own orders)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders: orders.map(shapeOrder) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/orders/:id
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });

    const isOwner  = order.customerId.toString() === req.user._id.toString();
    const isFarmer = req.user.role === "farmer" && order.farmerIds.map(String).includes(req.user._id.toString());
    const isAgent  = req.user.role === "agent"  && order.agentIds.map(String).includes(req.user._id.toString());
    const isAdmin  = req.user.role === "admin";

    if (!isOwner && !isFarmer && !isAgent && !isAdmin)
      return res.status(403).json({ success: false, error: "Not authorised" });

    res.json({ success: true, order: shapeOrder(order) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/farmer/orders
const getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmerIds: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders: orders.map(shapeOrder) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/agent/orders
const getAgentOrders = async (req, res) => {
  try {
    const orders = await Order.find({ agentIds: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders: orders.map(shapeOrder) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders: orders.map(shapeOrder) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

function shapeOrder(o) {
  const obj = o.toObject ? o.toObject() : o;
  return {
    ...obj,
    id:    obj._id?.toString(),
    total: obj.totalPrice,
    // Backward compat: items with price/qty aliases
    items: (obj.items || []).map(i => ({
      ...i,
      id:    i.productId?.toString(),
      price: i.pricePerKg,
      qty:   i.quantity,
    })),
    address: obj.deliveryAddress,
  };
}

module.exports = {
  createOrder, getMyOrders, getOrder,
  getFarmerOrders, getAgentOrders, getAllOrders,
};

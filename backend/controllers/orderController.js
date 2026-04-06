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

    // Generate OTP (4 digits)
    const deliveryOTP = Math.floor(1000 + Math.random() * 9000).toString();
    const estimatedDeliveryTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const order = await Order.create({
      customerId:      req.user._id,
      items:           orderItems,
      totalPrice,
      deliveryAddress: resolvedAddress,
      city,
      phone,
      deliveryOTP,
      estimatedDeliveryTime,
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

// POST /api/orders/:id/start-delivery (agent picks up order)
const startDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });

    const isAgent = req.user.role === "agent" && order.agentIds.map(String).includes(req.user._id.toString());
    if (!isAgent) return res.status(403).json({ success: false, error: "Not authorised" });

    order.deliveryStatus = "picked_up";
    order.deliveryStartTime = new Date();
    order.deliveryBoyId = req.user._id;
    await order.save();

    res.json({ success: true, order: shapeOrder(order), message: "Order picked up for delivery" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/orders/:id/out-for-delivery (agent marks order out for delivery)
const markOutForDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });

    const isAgent = req.user.role === "agent" && order.deliveryBoyId?.toString() === req.user._id.toString();
    if (!isAgent) return res.status(403).json({ success: false, error: "Not authorised" });

    order.deliveryStatus = "out_for_delivery";
    await order.save();

    res.json({ success: true, order: shapeOrder(order), message: "Order is out for delivery" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/orders/:id/verify-otp (agent verifies OTP and marks delivered)
const verifyOTPAndDeliver = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ success: false, error: "OTP required" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });

    const isAgent = req.user.role === "agent" && order.deliveryBoyId?.toString() === req.user._id.toString();
    if (!isAgent) return res.status(403).json({ success: false, error: "Not authorised" });

    if (order.deliveryOTP !== otp.trim()) {
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }

    // OTP matched - mark as delivered
    order.deliveryStatus = "delivered";
    order.otpVerified = true;
    order.actualDeliveryTime = new Date();
    order.status = "delivered";
    await order.save();

    res.json({ success: true, order: shapeOrder(order), message: "Order delivered successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/orders/:id/track (customer gets live tracking)
const getOrderTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });

    const isOwner = order.customerId.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ success: false, error: "Not authorised" });

    const timeElapsed = Math.round((Date.now() - order.createdAt) / 1000 / 60); // minutes
    const estimatedDeliveryMinutes = 24 * 60; // 24 hours
    const estimatedDeliveryTime = order.estimatedDeliveryTime || new Date(order.createdAt.getTime() + estimatedDeliveryMinutes * 60 * 1000);
    const processingTime = new Date(order.createdAt.getTime() + 10 * 60 * 1000);

    res.json({
      success: true,
      tracking: {
        orderId: order._id,
        status: order.deliveryStatus,
        deliveryStatus: order.deliveryStatus,
        orderStatus: order.status,
        createdAt: order.createdAt,
        estimatedDeliveryTime,
        deliveryStartTime: order.deliveryStartTime,
        actualDeliveryTime: order.actualDeliveryTime,
        deliveryOTP: order.deliveryOTP,
        otpVerified: order.otpVerified,
        timeElapsedMinutes: timeElapsed,
        estimatedDeliveryMinutes,
        progressPercentage: Math.min(100, (timeElapsed / estimatedDeliveryMinutes) * 100),
        timeline: [
          { step: 1, name: "Order Confirmed", status: "completed", time: order.createdAt },
          { step: 2, name: "Being Processed", status: order.deliveryStatus !== "processing" ? "completed" : "pending", time: processingTime },
          { step: 3, name: "Picked Up", status: ["picked_up", "out_for_delivery", "delivered"].includes(order.deliveryStatus) ? "completed" : "pending", time: order.deliveryStartTime },
          { step: 4, name: "Out for Delivery", status: ["out_for_delivery", "delivered"].includes(order.deliveryStatus) ? "completed" : "pending", time: order.deliveryStartTime },
          { step: 5, name: "Delivered", status: order.deliveryStatus === "delivered" ? "completed" : "pending", time: order.actualDeliveryTime },
        ],
      },
    });
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
    deliveryOTP: obj.deliveryOTP,
    deliveryStatus: obj.deliveryStatus,
    estimatedDeliveryTime: obj.estimatedDeliveryTime,
    deliveryStartTime: obj.deliveryStartTime,
    actualDeliveryTime: obj.actualDeliveryTime,
    deliveryBoyId: obj.deliveryBoyId?.toString(),
    otpVerified: obj.otpVerified,
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
  startDelivery, markOutForDelivery, verifyOTPAndDeliver, getOrderTracking,
};

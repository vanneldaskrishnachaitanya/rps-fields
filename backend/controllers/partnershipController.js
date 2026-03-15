const Partnership = require("../models/Partnership");
const User        = require("../models/User");

// POST /api/partnerships/request  (farmer sends request to agent)
const sendRequest = async (req, res) => {
  try {
    const { agentId } = req.body;
    if (!agentId) return res.status(400).json({ success: false, error: "Agent ID required" });

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent")
      return res.status(400).json({ success: false, error: "Invalid agent" });

    const existing = await Partnership.findOne({ farmerId: req.user._id, agentId });
    if (existing) {
      return res.status(409).json({ success: false, error: `Partnership already ${existing.status}` });
    }

    const partnership = await Partnership.create({
      farmerId: req.user._id,
      agentId,
    });
    res.status(201).json({ success: true, partnership });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/partnerships/:id/respond  (agent accepts/rejects)
const respondToRequest = async (req, res) => {
  try {
    const { status } = req.body; // "accepted" | "rejected"
    if (!["accepted", "rejected"].includes(status))
      return res.status(400).json({ success: false, error: "Status must be accepted or rejected" });

    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) return res.status(404).json({ success: false, error: "Partnership not found" });
    if (partnership.agentId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, error: "Not your partnership request" });

    partnership.status = status;
    await partnership.save();
    res.json({ success: true, partnership });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/partnerships/my-agents  (farmer: see all their agents)
const getMyAgents = async (req, res) => {
  try {
    const partnerships = await Partnership.find({
      farmerId: req.user._id,
      status: "accepted",
    }).populate("agentId", "name fullName email mobile phone location city");

    const agents = partnerships.map(p => ({
      partnershipId: p._id,
      ...p.agentId.toObject(),
      id: p.agentId._id,
    }));
    res.json({ success: true, agents });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/partnerships/my-farmers  (agent: see all their farmers)
const getMyFarmers = async (req, res) => {
  try {
    const partnerships = await Partnership.find({
      agentId: req.user._id,
      status: "accepted",
    }).populate("farmerId", "name fullName email mobile phone location city");

    const farmers = partnerships.map(p => ({
      partnershipId: p._id,
      ...p.farmerId.toObject(),
      id: p.farmerId._id,
    }));
    res.json({ success: true, farmers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/partnerships/pending  (agent: see pending requests)
const getPendingRequests = async (req, res) => {
  try {
    const requests = await Partnership.find({
      agentId: req.user._id,
      status: "pending",
    }).populate("farmerId", "name fullName email mobile phone location city");
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/agents  (public: list all agents, with optional location search)
const listAgents = async (req, res) => {
  try {
    const { location, search } = req.query;
    const filter = { role: "agent", status: "active" };
    if (location) {
      filter.$or = [
        { location: { $regex: location, $options: "i" } },
        { city:     { $regex: location, $options: "i" } },
      ];
    }
    if (search) {
      filter.$or = [
        { name:     { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { city:     { $regex: search, $options: "i" } },
      ];
    }
    const agents = await User.find(filter).select("name fullName email mobile phone location city");
    res.json({ success: true, agents });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  sendRequest, respondToRequest,
  getMyAgents, getMyFarmers, getPendingRequests,
  listAgents,
};

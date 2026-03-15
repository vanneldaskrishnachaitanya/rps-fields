const express = require("express");
const router  = express.Router();
const {
  sendRequest, respondToRequest,
  getMyAgents, getMyFarmers, getPendingRequests,
  listAgents,
} = require("../controllers/partnershipController");
const { protect, requireRole } = require("../middleware/auth");

// Public: list all agents (farmers browse)
router.get("/agents", listAgents);

// Farmer sends a connect request to an agent
router.post("/request",       protect, requireRole("farmer"), sendRequest);

// Agent responds to a request
router.put("/:id/respond",    protect, requireRole("agent"),  respondToRequest);

// Farmer: see their accepted agents
router.get("/my-agents",      protect, requireRole("farmer"), getMyAgents);

// Agent: see their accepted farmers
router.get("/my-farmers",     protect, requireRole("agent"),  getMyFarmers);

// Agent: see pending incoming requests
router.get("/pending",        protect, requireRole("agent"),  getPendingRequests);

module.exports = router;

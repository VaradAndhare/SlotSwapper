const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const Event = require("../models/Event");
const SwapRequest = require("../models/SwapRequest");

// Get all swappable slots (except mine)
router.get("/swappable", auth, async (req, res) => {
  try {
    const swappables = await Event.find({
      status: "SWAPPABLE",
      userId: { $ne: req.user.id },
    }).populate("userId", "name email");

    res.json(swappables);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch swappable slots", error: err.message });
  }
});

// Create swap request
router.post("/request", auth, async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;
    if (!mySlotId || !theirSlotId)
      return res.status(400).json({ message: "Both slot IDs are required" });

    const mySlot = await Event.findOne({ _id: mySlotId, userId: req.user.id });
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot)
      return res.status(404).json({ message: "One or both slots not found" });

    if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE")
      return res.status(400).json({ message: "Both slots must be swappable" });

    const swap = await SwapRequest.create({
      requesterId: req.user.id,
      receiverId: theirSlot.userId,
      mySlotId,
      theirSlotId,
      status: "PENDING",
    });

    mySlot.status = "SWAP_PENDING";
    theirSlot.status = "SWAP_PENDING";
    await mySlot.save();
    await theirSlot.save();

    res.status(201).json({ message: "Swap request created", swap });
  } catch (err) {
    res.status(500).json({ message: "Swap request failed", error: err.message });
  }
});



// Fetch incoming requests (where you are the receiver)
router.get("/requests/incoming", auth, async (req, res) => {
  try {
    const incoming = await SwapRequest.find({ receiverId: req.user.id })
      .populate("requesterId", "name email")
      .populate("mySlotId")
      .populate("theirSlotId")
      .sort({ createdAt: -1 });

    res.json(incoming);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch incoming requests", error: err.message });
  }
});

// Fetch outgoing requests (where you are the requester)
router.get("/requests/outgoing", auth, async (req, res) => {
  try {
    const outgoing = await SwapRequest.find({ requesterId: req.user.id })
      .populate("receiverId", "name email")
      .populate("mySlotId")
      .populate("theirSlotId")
      .sort({ createdAt: -1 });

    res.json(outgoing);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch outgoing requests", error: err.message });
  }
});


router.post("/response", auth, async (req, res) => {
  try {
    const { requestId, action } = req.body;
    if (!requestId || !action) return res.status(400).json({ message: "requestId and action required" });

    const swap = await SwapRequest.findById(requestId)
      .populate("mySlotId")
      .populate("theirSlotId");

    if (!swap) return res.status(404).json({ message: "Swap request not found" });

    // only receiver can respond
    if (swap.receiverId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to respond" });

    if (swap.status !== "PENDING")
      return res.status(400).json({ message: "Request already handled" });

    if (action === "ACCEPTED") {
      swap.status = "ACCEPTED";

      // exchange ownership
      const requesterId = swap.requesterId;
      const receiverId = swap.receiverId;

      swap.mySlotId.userId = receiverId;
      swap.theirSlotId.userId = requesterId;

      swap.mySlotId.status = "BUSY";
      swap.theirSlotId.status = "BUSY";

      await swap.mySlotId.save();
      await swap.theirSlotId.save();
      await swap.save();

      return res.json({ message: "Swap accepted and slots exchanged", swap });
    } else if (action === "REJECTED") {
      swap.status = "REJECTED";
      await swap.save();

      // revert slots to SWAPPABLE
      const mySlot = await Event.findById(swap.mySlotId._id);
      const theirSlot = await Event.findById(swap.theirSlotId._id);
      if (mySlot) mySlot.status = "SWAPPABLE";
      if (theirSlot) theirSlot.status = "SWAPPABLE";
      await mySlot.save();
      await theirSlot.save();

      return res.json({ message: "Swap rejected and slots reverted", swap });
    } else {
      return res.status(400).json({ message: "Invalid action. Use ACCEPTED or REJECTED." });
    }
  } catch (err) {
    res.status(500).json({ message: "Swap response failed", error: err.message });
  }
});

module.exports = router;
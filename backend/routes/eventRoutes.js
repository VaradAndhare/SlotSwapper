console.log("✅ Loaded eventRoutes")
const express = require("express");
const Event = require("../models/Event");
const auth = require("../middlewares/authMiddleware");
const router = express.Router();

//show events
router.get("/", auth, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.id }).sort({ startTime: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
});

//create event
router.post("/", auth, async (req, res) => {
  try {
    const { title, startTime, endTime , status } = req.body;
    if (!title || !startTime || !endTime )
      return res.status(400).json({ message: "All fields required" });

    const event = await Event.create({
      title,
      startTime,
      endTime,
      status,
      userId: req.user.id,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Failed to create event", error: err.message });
  }
});

//update event
router.put("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user.id });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const { title, startTime, endTime, status } = req.body;
    if (title) event.title = title;
    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;
    if (status) event.status = status;

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Failed to update event", error: err.message });
  }
});

//delete event
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Event.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete event", error: err.message });
  }
});

module.exports = router;
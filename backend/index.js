const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes.js");
const eventRoutes = require("./routes/eventRoutes.js");
const swapRequestRoutes = require("./routes/swapRequestRoutes.js")
dotenv.config();

const url = process.env.MONGO_URL;
const PORT = process.env.PORT || 8080

const connectmondodb = async () => {
  try {
    await mongoose.connect(url);
    console.log("DB connected");
  } catch (err) {
    console.log(err);
  }
};

app.use(express.json());
app.use(
  cors({
    origin: ["https://slot-swapper-delta.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);


app.use("/api/auth" , authRoutes);
app.use("/api/events" , eventRoutes);
app.use("/api/swaproute" , swapRequestRoutes)

app.listen(PORT , (req , res) => {
    console.log(`listening to ${PORT}`)
    connectmondodb();
})
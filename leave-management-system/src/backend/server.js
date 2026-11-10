import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/LeaveManagement")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((error) => console.log("MongoDB Error:", error));

// Leave Schema
const leaveSchema = new mongoose.Schema({
  type: String,
  reason: String,
  from: String,
  to: String,
  status: {
    type: String,
    default: "Pending"
  }
});

const Leave = mongoose.model("Leave", leaveSchema);

// Home route
app.get("/", (req, res) => {
  res.send("Leave Management Backend is Running!");
});

// Submit leave
app.post("/apply", async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    res.status(201).json({
      message: "Leave application saved successfully",
      leave
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leave history
app.get("/leaves", async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ _id: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: String, required: true },
    message: { type: String, required: true }
}, { timestamps: true });

const Feedback =
    mongoose.models.Feedback ||
    mongoose.model("Feedback", feedbackSchema);

app.post("/api/feedback", async (req, res) => {
    try {
        const { name, email, rating, message } = req.body;

        if (!name || !email || !rating || !message) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const feedback = await Feedback.create({
            name,
            email,
            rating,
            message
        });

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully!",
            feedback
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to submit feedback"
        });
    }
});

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

startServer();
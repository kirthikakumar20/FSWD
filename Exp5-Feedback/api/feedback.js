const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Feedback =
    mongoose.models.Feedback ||
    mongoose.model("Feedback", feedbackSchema);

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed"
        });
    }

    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        const { name, email, rating, message } = req.body || {};

        if (!name || !email || !rating || !message) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const newFeedback = await Feedback.create({
            name,
            email,
            rating,
            message
        });

        return res.status(201).json({
            success: true,
            message: "Feedback submitted successfully!",
            feedback: newFeedback
        });

    } catch (error) {
        console.error("Feedback Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to submit feedback"
        });
    }
};
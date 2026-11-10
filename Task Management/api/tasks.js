const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: String,
    status: {
        type: String,
        default: "Pending"
    }
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

module.exports = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        if (req.body && typeof req.body === "string") {
    req.body = JSON.parse(req.body);
}

        if (req.method === "GET") {
            const tasks = await Task.find();
            return res.status(200).json(tasks);
        }

        if (req.method === "POST") {
            const task = new Task({ title: req.body.title });
            await task.save();
            return res.status(201).json(task);
        }

        if (req.method === "PATCH") {
            const task = await Task.findByIdAndUpdate(
                req.body.id,
                { status: req.body.status },
                { new: true }
            );
            return res.status(200).json(task);
        }

        if (req.method === "DELETE") {
            await Task.findByIdAndDelete(req.body.id);
            return res.status(200).json({ message: "Task deleted" });
        }

        return res.status(405).json({ message: "Method not allowed" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
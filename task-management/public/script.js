const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");

async function loadTasks() {
    try {
        const response = await fetch("/api/tasks");
        if (!response.ok) throw new Error("Failed to load tasks");

        const tasks = await response.json();

        document.getElementById("pending").innerHTML = "";
        document.getElementById("ongoing").innerHTML = "";
        document.getElementById("completed").innerHTML = "";

        tasks.forEach(task => {
            const card = document.createElement("div");
            card.className = "task-card";

            const title = document.createElement("p");
            title.textContent = task.title;

            const select = document.createElement("select");

            ["Pending", "Ongoing", "Completed"].forEach(status => {
                const option = document.createElement("option");
                option.value = status;
                option.textContent = status;
                if (task.status === status) option.selected = true;
                select.appendChild(option);
            });

            select.addEventListener("change", async () => {
                await fetch("/api/tasks", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: task._id,
                        status: select.value
                    })
                });
                loadTasks();
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";

            deleteBtn.addEventListener("click", async () => {
                await fetch("/api/tasks", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: task._id })
                });
                loadTasks();
            });

            card.appendChild(title);
            card.appendChild(select);
            card.appendChild(deleteBtn);

            document.getElementById(task.status.toLowerCase()).appendChild(card);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = taskInput.value.trim();
    if (!title) return;

    try {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title })
        });

        if (!response.ok) throw new Error("Task could not be added");

        taskInput.value = "";
        await loadTasks();
    } catch (error) {
        console.error("Error:", error);
        alert("Task add panna mudiyala. Please try again.");
    }
});

loadTasks();
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedbackForm");
    const submitBtn = document.getElementById("submitBtn");
    const statusMessage = document.getElementById("statusMessage");

    if (!form || !submitBtn || !statusMessage) {
        console.error("Form elements not found!");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const feedbackData = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            rating: document.getElementById("rating").value,
            message: document.getElementById("message").value.trim()
        };

        if (
            !feedbackData.name ||
            !feedbackData.email ||
            !feedbackData.rating ||
            !feedbackData.message
        ) {
            statusMessage.textContent = "Please fill all fields!";
            statusMessage.style.color = "red";
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
        statusMessage.textContent = "";

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(feedbackData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Submission failed");
            }

            statusMessage.textContent =
                "Feedback submitted successfully!";

            statusMessage.style.color = "green";

            form.reset();

        } catch (error) {
            console.error("Error:", error);

            statusMessage.textContent =
                "Unable to submit feedback. Please try again.";

            statusMessage.style.color = "red";

        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit";
        }
    });
});
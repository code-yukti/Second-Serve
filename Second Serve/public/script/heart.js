// Select all donate buttons
const donateButtons = document.querySelectorAll(".donate-btn");

// Backend API URL (change this to your backend route)
const API_URL = "http://localhost:5000/api/donate"; 

donateButtons.forEach(button => {
    button.addEventListener("click", async function () {

        const donationType = this.getAttribute("data-type");

        // Disable button while sending
        this.disabled = true;
        this.innerText = "Sending...";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: donationType,
                    date: new Date().toISOString()
                })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(`✅ ${donationType} donation request sent successfully!`);
            } else {
                showMessage("❌ Something went wrong. Try again.");
            }

        } catch (error) {
            showMessage("⚠️ Server not reachable.");
            console.error(error);
        }

        // Re-enable button
        this.disabled = false;
        this.innerText = `Donate ${donationType}`;
    });
});


// Function to show alert message dynamically
function showMessage(message) {

    const msg = document.createElement("div");
    msg.className = "popup-message";
    msg.innerText = message;

    document.body.appendChild(msg);

    setTimeout(() => {
        msg.remove();
    }, 3000);
}
// ============================
// Fetch Live Stats from Backend
// ============================

const STATS_API = "http://localhost:5000/api/stats";

async function loadStats() {

    try {
        const response = await fetch(STATS_API);

        if (!response.ok) throw new Error("Server error");

        const data = await response.json();

        // Update numbers
        document.getElementById("clothes-count").innerText = data.clothes + "+";
        document.getElementById("books-count").innerText = data.books + "+";
        document.getElementById("toys-count").innerText = data.toys + "+";

        // Hide loaders
        document.getElementById("clothes-loader").style.display = "none";
        document.getElementById("books-loader").style.display = "none";
        document.getElementById("toys-loader").style.display = "none";

    } catch (error) {

        // Show offline message
        document.getElementById("clothes-count").innerText = "Offline";
        document.getElementById("books-count").innerText = "Offline";
        document.getElementById("toys-count").innerText = "Offline";

        console.error(error);
    }
}
